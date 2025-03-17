'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter,useSearchParams } from 'next/navigation'
import cn from '@/utils/classnames'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import Input from '@/app/components/base/input'
import Empty from '@/app/components/tools/add-tool-modal/empty'
import { fetchInstallAppList } from '@/service/ability-explore'
import { useContext } from 'use-context-selector'
import ExploreContext from '@/context/ability-explore-context'
import s from '../style.module.css'
import type { InstalledApp } from '@/models/explore'
import Card from './card'
import {FetchInstallAppListReq} from '@/models/ability-explore'
type ListProps = {
  className: string
}

const List = ({ className }: ListProps) => {
  const [activeTab, setActiveTab] = useState('workflow')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeTabItem } = useContext(ExploreContext)
  const recommendedOptions = [
    {
      value: 'workflow',
      text: '工作流',
    },
    {
      value: 'chat',
      text: '对话助手',
    },
    {
      value: 'agent-chat',
      text: '智能体',
    },
  ]
  const [keywords, setKeywords] = useState<string>('')
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    getList({
      name:value
    })
  }
  const [collectionList, setCollectionList] = useState<InstalledApp[]>([])
 
  const getList = async (params:FetchInstallAppListReq) => {
    const { installed_apps } = await fetchInstallAppList({
      mode: activeTab,
      name:keywords,
      ...params
    })
    setCollectionList(installed_apps || [])
  }
  useEffect(() => {
    getList({})
  }, [])

  const [currentProvider, setCurrentProvider] = useState<
  InstalledApp | undefined
  >()
  useEffect(() => {
    if (currentProvider && collectionList.length > 0) {
      const newCurrentProvider = collectionList.find(
        (collection) => collection.id === currentProvider.id,
      )
      setCurrentProvider(newCurrentProvider)
    }
  }, [collectionList, currentProvider])

  return (
    <div className={cn("flex h-full relative overflow-hidden bg-gray-100 shrink-0  grow", className)}>
      <div className="relative flex flex-col overflow-y-auto bg-gray-100 grow mb-1">
        <div
          className={cn(
            'sticky top-0 flex flex-col pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-20 flex-wrap gap-y-2',
            currentProvider && 'pr-6',
          )}
        >
          <div className='flex flex-col gap-2 flex-1'>
            <div
              className={
                'mb-1 text-xl font-semibold items-center justify-between flex flex-1'
              }
            >
              <span className={s.textGradient}>
                {activeTabItem?.mainTitle}
              </span>
              <div className="flex items-center gap-2">

                <Input
                  showLeftIcon
                  showClearIcon
                  wrapperClassName="w-[200px]"
                  value={keywords}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  onClear={() => handleKeywordsChange('')}
                />
              </div>
            </div>
            <div className="text-gray-500 text-sm">{activeTabItem?.desc}</div>
            <TabSliderNew
              value={activeTab}
              onChange={(state) => {
                setActiveTab(state)
                getList({
                  mode:state
                })
                if (state !== activeTab) setCurrentProvider(undefined)
              }}
              options={recommendedOptions}
            />
          </div>
        </div>
        <div
          className={cn(
            'relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0',
            currentProvider &&
            'pr-6 sm:grid-cols-1 md:grid-cols-2',
          )}
        >
          {collectionList.map((collection) => (
            <Card
              active={currentProvider?.id === collection.id}
              onSelect={() => { 
                router.push(`/ability-explore/installed/${collection.id}?${searchParams.toString()}`)
              }}
              key={collection.id}
              data={collection}
              collection={collection.app}
            />
          ))}
          {!collectionList.length && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Empty />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default List
