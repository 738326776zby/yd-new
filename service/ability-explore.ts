import { get, post } from './base'
import type {
  Collection,
  Tool,
  FetchInstallAppListReq,
  FetchTestToolReq,
  FetchYdToolListReq,
  HyydDataProviderReq,
  ThirdPartyDataListReqItem
} from '@/models/ability-explore'

import type { InstalledApp } from '@/models/explore'
export const fetchHyydDataProvidersList = () => {
  return get<Collection[]>('/hyyd/hyyd-data-list')
}

export const fetcHhyydDataProvider = (id: string) => {
  return get<HyydDataProviderReq>(`/hyyd/hyyd-data/${id}`)
}
export const fetchThirdPartyToolsList = () => {
  return get<Collection[]>('/hyyd/other-tools-providers')
}
export const fetchInstallAppList = (params:FetchInstallAppListReq) => {
  return get<{ installed_apps: InstalledApp[] }>('/hyyd/installed-apps', {
    params
  })
}
export const fetchTestTool = (data:FetchTestToolReq) => {
  const { collection, tool, params } = data
  return post<any>(`/hyyd/tools-test/${collection}/${tool}`, {
    body: params
  })
}

export const fetchYdToolList = (body:FetchYdToolListReq) => {
  return post<any>(`/hyyd/tools-providers`, {
   body
  })
}
export const fetcHhyydToolsProviderList = (collectionName: string) => {
  return get<Tool[]>(`/hyyd/tools-provider/${collectionName}/tools`)
}


export const fetchThirdPartyDataList = () => {
  return get<ThirdPartyDataListReqItem[]>(`/hyyd/third-party-data-list`)
}