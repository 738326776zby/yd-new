import { Emoji } from '@/app/components/tools/types'

export interface EvaluationRecord {
  id: string
  tenant_id: string
  name: string
  user_id: string
  user_name: string
  instructions: string
  introduction: string
  path: string
  source: number
  status: number
  evaluation_type: string
  evaluation_content: string
  created_time: string
  updated_time: string
}

export interface BaseResponse<T> {
  code: number
  status: string
  message: string
  data: T
}

export interface CollectionsAddschemeRes {
  tenant_id: string
  name: string
  instructions: string
  introduction: string
  evaluation_type: string
  evaluation_content: string
  [key:string]:any
}
export interface CollectionsDeletescheme {
  id: string
  tenant_id: string
}

export interface GetRecordlistReq {
  tenant_id?: string
  collections_id?: string
  user_id?: string
  pageNum?: number
  pageSize?: number
  evaluation_object?: string
  pages?: number
}
export type RecordTableListItem = {
  id: string
    tenant_id: string
    collections_id: string
    collections_name: string
    user_id: string
    user_name: string
    evaluation_object: string
    task_description: string
    evaluation_time: string
    results: null
    results_file_path: null
    status: number
    created_time: string
    updated_time: string
}

export type PageinfoProps<T> = {
  size: number
  startRow: number
  endRow: number
  pages: number
  prePage: number
  nextPage: number
  isFirstPage: boolean
  isLastPage: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  list: T[]
}