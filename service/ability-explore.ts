import { get, post } from './base'
import type {
  Collection,
  Tool,
  FetchInstallAppListReq,
  FetchTestToolReq,
  FetchYdToolListReq
} from '@/models/ability-explore'

import type { InstalledApp } from '@/models/explore'
export const fetchHyydDataProvidersList = () => {
  return get<Collection[]>('/hyyd/data-providers')
}

export const fetcHhyydDataProviderList = (collectionName: string) => {
  return get<Tool[]>(`/hyyd/data-provider/${collectionName}/tools`)
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
