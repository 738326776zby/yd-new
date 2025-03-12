import { get, post } from './base'
import type {
  Collection,
  Tool
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
export const fetchInstallAppList = () => {
  return get<{ installed_apps: InstalledApp[] }>('/hyyd/installed-apps')
}