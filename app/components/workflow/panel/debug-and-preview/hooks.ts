import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { produce, setAutoFreeze } from 'immer'
import { uniqBy } from 'lodash-es'
import { useWorkflowRun } from '../../hooks'
import { NodeRunningStatus, WorkflowRunningStatus } from '../../types'
import { useWorkflowStore } from '../../store'
import { DEFAULT_ITER_TIMES } from '../../constants'
import type {
  ChatItem,
  ChatItemInTree,
  Inputs,
} from '@/app/components/base/chat/types'
import type { InputForm } from '@/app/components/base/chat/chat/type'
import {
  getProcessedInputs,
  processOpeningStatement,
} from '@/app/components/base/chat/chat/utils'
import { useToastContext } from '@/app/components/base/toast'
import { TransferMethod } from '@/types/app'
import {
  getProcessedFiles,
  getProcessedFilesFromResponse,
} from '@/app/components/base/file-uploader/utils'
import type { FileEntity } from '@/app/components/base/file-uploader/types'
import { getThreadMessages } from '@/app/components/base/chat/utils'
import type { NodeTracing } from '@/types/workflow'

type GetAbortController = (abortController: AbortController) => void
type SendCallback = {
  onGetSuggestedQuestions?: (responseItemId: string, getAbortController: GetAbortController) => Promise<any>
}
export const useChat = (
  config: any,
  formSettings?: {
    inputs: Inputs
    inputsForm: InputForm[]
  },
  prevChatTree?: ChatItemInTree[],
  stopChat?: (taskId: string) => void,
) => {
  const { t } = useTranslation()
  const { notify } = useToastContext()
  const { handleRun } = useWorkflowRun()
  const hasStopResponded = useRef(false)
  const workflowStore = useWorkflowStore()
  const conversationId = useRef('')
  const taskIdRef = useRef('')
  const [isResponding, setIsResponding] = useState(false)
  const isRespondingRef = useRef(false)
  const [suggestedQuestions, setSuggestQuestions] = useState<string[]>([])
  const suggestedQuestionsAbortControllerRef = useRef<AbortController | null>(null)
  const {
    setIterTimes,
  } = workflowStore.getState()

  const handleResponding = useCallback((isResponding: boolean) => {
    setIsResponding(isResponding)
    isRespondingRef.current = isResponding
  }, [])

  const [chatTree, setChatTree] = useState<ChatItemInTree[]>(prevChatTree || [])
  const chatTreeRef = useRef<ChatItemInTree[]>(chatTree)
  const [targetMessageId, setTargetMessageId] = useState<string>()
  const threadMessages = useMemo(() => getThreadMessages(chatTree, targetMessageId), [chatTree, targetMessageId])

  const getIntroduction = useCallback((str: string) => {
    return processOpeningStatement(str, formSettings?.inputs || {}, formSettings?.inputsForm || [])
  }, [formSettings?.inputs, formSettings?.inputsForm])

  /** Final chat list that will be rendered */
  const chatList = useMemo(() => {
    const ret = [...threadMessages]
    if (config?.opening_statement) {
      const index = threadMessages.findIndex(item => item.isOpeningStatement)

      if (index > -1) {
        ret[index] = {
          ...ret[index],
          content: getIntroduction(config.opening_statement),
          suggestedQuestions: config.suggested_questions,
        }
      }
      else {
        ret.unshift({
          id: `${Date.now()}`,
          content: getIntroduction(config.opening_statement),
          isAnswer: true,
          isOpeningStatement: true,
          suggestedQuestions: config.suggested_questions,
        })
      }
    }
    return ret
  }, [threadMessages, config?.opening_statement, getIntroduction, config?.suggested_questions])

  useEffect(() => {
    setAutoFreeze(false)
    return () => {
      setAutoFreeze(true)
    }
  }, [])

  /** Find the target node by bfs and then operate on it */
  const produceChatTreeNode = useCallback((targetId: string, operation: (node: ChatItemInTree) => void) => {
    return produce(chatTreeRef.current, (draft) => {
      const queue: ChatItemInTree[] = [...draft]
      while (queue.length > 0) {
        const current = queue.shift()!
        if (current.id === targetId) {
          operation(current)
          break
        }
        if (current.children)
          queue.push(...current.children)
      }
    })
  }, [])

  const handleStop = useCallback(() => {
    hasStopResponded.current = true
    handleResponding(false)
    if (stopChat && taskIdRef.current)
      stopChat(taskIdRef.current)
    setIterTimes(DEFAULT_ITER_TIMES)
    if (suggestedQuestionsAbortControllerRef.current)
      suggestedQuestionsAbortControllerRef.current.abort()
  }, [handleResponding, setIterTimes, stopChat])

  const handleRestart = useCallback(() => {
    conversationId.current = ''
    taskIdRef.current = ''
    handleStop()
    setIterTimes(DEFAULT_ITER_TIMES)
    setChatTree([])
    setSuggestQuestions([])
  }, [
    handleStop,
    setIterTimes,
  ])

  const updateCurrentQAOnTree = useCallback(({
    parentId,
    responseItem,
    placeholderQuestionId,
    questionItem,
  }: {
    parentId?: string
    responseItem: ChatItem
    placeholderQuestionId: string
    questionItem: ChatItem
  }) => {
    let nextState: ChatItemInTree[]
    const currentQA = { ...questionItem, children: [{ ...responseItem, children: [] }] }
    if (!parentId && !chatTree.some(item => [placeholderQuestionId, questionItem.id].includes(item.id))) {
      // QA whose parent is not provided is considered as a first message of the conversation,
      // and it should be a root node of the chat tree
      nextState = produce(chatTree, (draft) => {
        draft.push(currentQA)
      })
    }
    else {
      // find the target QA in the tree and update it; if not found, insert it to its parent node
      nextState = produceChatTreeNode(parentId!, (parentNode) => {
        const questionNodeIndex = parentNode.children!.findIndex(item => [placeholderQuestionId, questionItem.id].includes(item.id))
        if (questionNodeIndex === -1)
          parentNode.children!.push(currentQA)
        else
          parentNode.children![questionNodeIndex] = currentQA
      })
    }
    setChatTree(nextState)
    chatTreeRef.current = nextState
  }, [chatTree, produceChatTreeNode])

  const handleSend = useCallback((
    params: {
      query: string
      files?: FileEntity[]
      parent_message_id?: string
      [key: string]: any
    },
    {
      onGetSuggestedQuestions,
    }: SendCallback,
  ) => {
    if (isRespondingRef.current) {
      notify({ type: 'info', message: t('appDebug.errorMessage.waitForResponse') })
      return false
    }

    const parentMessage = threadMessages.find(item => item.id === params.parent_message_id)

    const placeholderQuestionId = `question-${Date.now()}`
    const questionItem = {
      id: placeholderQuestionId,
      content: params.query,
      isAnswer: false,
      message_files: params.files,
      parentMessageId: params.parent_message_id,
    }

    const placeholderAnswerId = `answer-placeholder-${Date.now()}`
    const placeholderAnswerItem = {
      id: placeholderAnswerId,
      content: '',
      isAnswer: true,
      parentMessageId: questionItem.id,
      siblingIndex: parentMessage?.children?.length ?? chatTree.length,
    }

    setTargetMessageId(parentMessage?.id)
    updateCurrentQAOnTree({
      parentId: params.parent_message_id,
      responseItem: placeholderAnswerItem,
      placeholderQuestionId,
      questionItem,
    })

    // answer
    const responseItem: ChatItem = {
      id: placeholderAnswerId,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
      parentMessageId: questionItem.id,
      siblingIndex: parentMessage?.children?.length ?? chatTree.length,
    }

    handleResponding(true)

    const { files, inputs, ...restParams } = params
    const bodyParams = {
      files: getProcessedFiles(files || []),
      inputs: getProcessedInputs(inputs || {}, formSettings?.inputsForm || []),
      ...restParams,
    }
    if (bodyParams?.files?.length) {
      bodyParams.files = bodyParams.files.map((item) => {
        if (item.transfer_method === TransferMethod.local_file) {
          return {
            ...item,
            url: '',
          }
        }
        return item
      })
    }

    let hasSetResponseId = false

    handleRun(
      bodyParams,
      {
        onData: (message: string, isFirstMessage: boolean, { conversationId: newConversationId, messageId, taskId }: any) => {
          responseItem.content = responseItem.content + message

          if (messageId && !hasSetResponseId) {
            questionItem.id = `question-${messageId}`
            responseItem.id = messageId
            responseItem.parentMessageId = questionItem.id
            hasSetResponseId = true
          }

          if (isFirstMessage && newConversationId)
            conversationId.current = newConversationId

          taskIdRef.current = taskId
          if (messageId)
            responseItem.id = messageId

          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        async onCompleted(hasError?: boolean, errorMessage?: string) {
          handleResponding(false)

          if (hasError) {
            if (errorMessage) {
              responseItem.content = errorMessage
              responseItem.isError = true
              updateCurrentQAOnTree({
                placeholderQuestionId,
                questionItem,
                responseItem,
                parentId: params.parent_message_id,
              })
            }
            return
          }

          if (config?.suggested_questions_after_answer?.enabled && !hasStopResponded.current && onGetSuggestedQuestions) {
            try {
              const { data }: any = await onGetSuggestedQuestions(
                responseItem.id,
                newAbortController => suggestedQuestionsAbortControllerRef.current = newAbortController,
              )
              setSuggestQuestions(data)
            }
            catch (error) {
              setSuggestQuestions([])
            }
          }
        },
        onMessageEnd: (messageEnd) => {
          responseItem.citation = messageEnd.metadata?.retriever_resources || []
          const processedFilesFromResponse = getProcessedFilesFromResponse(messageEnd.files || [])
          responseItem.allFiles = uniqBy([...(responseItem.allFiles || []), ...(processedFilesFromResponse || [])], 'id')

          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onMessageReplace: (messageReplace) => {
          responseItem.content = messageReplace.answer
        },
        onError() {
          handleResponding(false)
        },
        onWorkflowStarted: ({ workflow_run_id, task_id }) => {
          taskIdRef.current = task_id
          responseItem.workflow_run_id = workflow_run_id
          responseItem.workflowProcess = {
            status: WorkflowRunningStatus.Running,
            tracing: [],
          }
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onWorkflowFinished: ({ data }) => {
          responseItem.workflowProcess!.status = data.status as WorkflowRunningStatus
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onIterationStart: ({ data }) => {
          responseItem.workflowProcess!.tracing!.push({
            ...data,
            status: NodeRunningStatus.Running,
            details: [],
          } as any)
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onIterationNext: ({ data }) => {
          const tracing = responseItem.workflowProcess!.tracing!
          const iterations = tracing.find(item => item.node_id === data.node_id
            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id))!
          iterations.details!.push([])

          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onIterationFinish: ({ data }) => {
          const tracing = responseItem.workflowProcess!.tracing!
          const iterationsIndex = tracing.findIndex(item => item.node_id === data.node_id
            && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id))!
          tracing[iterationsIndex] = {
            ...tracing[iterationsIndex],
            ...data,
            status: NodeRunningStatus.Succeeded,
          } as any
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onNodeStarted: ({ data }) => {
          if (data.iteration_id)
            return

          responseItem.workflowProcess!.tracing!.push({
            ...data,
            status: NodeRunningStatus.Running,
          } as any)
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
        onNodeRetry: ({ data }) => {
          if (data.iteration_id)
            return

          const currentIndex = responseItem.workflowProcess!.tracing!.findIndex((item) => {
            if (!item.execution_metadata?.parallel_id)
              return item.node_id === data.node_id
            return item.node_id === data.node_id && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id)
          })
          if (responseItem.workflowProcess!.tracing[currentIndex].retryDetail)
            responseItem.workflowProcess!.tracing[currentIndex].retryDetail?.push(data as NodeTracing)
          else
            responseItem.workflowProcess!.tracing[currentIndex].retryDetail = [data as NodeTracing]

          handleUpdateChatList(produce(chatListRef.current, (draft) => {
            const currentIndex = draft.findIndex(item => item.id === responseItem.id)
            draft[currentIndex] = {
              ...draft[currentIndex],
              ...responseItem,
            }
          }))
        },
        onNodeFinished: ({ data }) => {
          if (data.iteration_id)
            return

          const currentIndex = responseItem.workflowProcess!.tracing!.findIndex((item) => {
            if (!item.execution_metadata?.parallel_id)
              return item.node_id === data.node_id
            return item.node_id === data.node_id && (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id || item.parallel_id === data.execution_metadata?.parallel_id)
          })
          responseItem.workflowProcess!.tracing[currentIndex] = {
            ...(responseItem.workflowProcess!.tracing[currentIndex]?.extras
              ? { extras: responseItem.workflowProcess!.tracing[currentIndex].extras }
              : {}),
            ...(responseItem.workflowProcess!.tracing[currentIndex]?.retryDetail
              ? { retryDetail: responseItem.workflowProcess!.tracing[currentIndex].retryDetail }
              : {}),
            ...data,
          } as any
          updateCurrentQAOnTree({
            placeholderQuestionId,
            questionItem,
            responseItem,
            parentId: params.parent_message_id,
          })
        },
      },
    )
  }, [threadMessages, chatTree.length, updateCurrentQAOnTree, handleResponding, formSettings?.inputsForm, handleRun, notify, t, config?.suggested_questions_after_answer?.enabled])

  return {
    conversationId: conversationId.current,
    chatList,
    setTargetMessageId,
    handleSend,
    handleStop,
    handleRestart,
    isResponding,
    suggestedQuestions,
  }
}
