/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 10:37:00
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-21 11:25:45
 * @FilePath: /yd-new/service/ability-explore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from './base'
import type {
  Collection,
  Tool,
  FetchInstallAppListReq,
  FetchTestToolReq,
  FetchYdToolListReq,
  HyydDataProviderReq,
  ThirdPartyDataListReqItem,
  fetchYdToolListResItem,
  HyydFileUploadReq
} from '@/models/ability-explore'
import type { BaseResponse } from '@/models/evaluation'
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
  return post<fetchYdToolListResItem[]>(`/hyyd/tools-providers`, {
   body
  })
}
export const fetcHhyydToolsProviderList = (collectionName: string) => {
  return get<Tool[]>(`/hyyd/tools-provider/${collectionName}/tools`)
}


export const fetchThirdPartyDataList = () => {
  return get<ThirdPartyDataListReqItem[]>(`/hyyd/third-party-data-list`)
}
export const fetchHyydFileUpload = (body:any) => {
  return post<BaseResponse<HyydFileUploadReq>>(
    "/hyyd/file-upload",
    { body },
    { bodyStringify: false, deleteContentType: true }
  );
};