import type { TypeWithI18N } from '@/app/components/header/account-setting/model-provider-page/declarations'


export type NavItem = {
  title: string
  key: string
  icon: string
  category?: string
}
export type NavSection = {
  mainTitle: string
  list: NavItem[]
  desc: string
}
export enum LOC {
  tools = 'tools',
  app = 'app',
}

export enum AuthType {
  none = 'none',
  apiKey = 'api_key',
}

export enum AuthHeaderPrefix {
  basic = 'basic',
  bearer = 'bearer',
  custom = 'custom',
}

export type Credential = {
  'auth_type': AuthType
  'api_key_header'?: string
  'api_key_value'?: string
  'api_key_header_prefix'?: AuthHeaderPrefix
}

export enum CollectionType {
  all = 'all',
  builtIn = 'builtin',
  custom = 'api',
  model = 'model',
  workflow = 'workflow',
}

export type Emoji = {
  background: string
  content: string
}

export type Collection = {
  id: string
  name: string
  author: string
  description: string
  icon: string | Emoji
  label: TypeWithI18N
  type: CollectionType
  team_credentials: Record<string, any>
  is_team_authorization: boolean
  allow_delete: boolean
  labels: string[]
  is_new: boolean
}

export type ToolParameter = {
  name: string
  label: TypeWithI18N
  human_description: TypeWithI18N
  type: string
  form: string
  llm_description: string
  required: boolean
  default: string
  options?: {
    label: TypeWithI18N
    value: string
  }[]
  min?: number
  max?: number
}

export type Tool = {
  name: string
  author: string
  label: TypeWithI18N
  description: any
  parameters: ToolParameter[]
  labels: string[]
  examples?: any[]
}

export type ToolCredential = {
  name: string
  label: TypeWithI18N
  help: TypeWithI18N
  placeholder: TypeWithI18N
  type: string
  required: boolean
  default: string
  options?: {
    label: TypeWithI18N
    value: string
  }[]
}

export type CustomCollectionBackend = {
  provider: string
  original_provider?: string
  credentials: Credential
  icon: Emoji
  schema_type: string
  schema: string
  privacy_policy: string
  custom_disclaimer: string
  tools?: ParamItem[]
  id: string
  labels: string[]
}

export type ParamItem = {
  name: string
  label: TypeWithI18N
  human_description: TypeWithI18N
  llm_description: string
  type: string
  form: string
  required: boolean
  default: string
  min?: number
  max?: number
  options?: {
    label: TypeWithI18N
    value: string
  }[]
}

export type CustomParamSchema = {
  operation_id: string // name
  summary: string
  server_url: string
  method: string
  parameters: ParamItem[]
}

export type WorkflowToolProviderParameter = {
  name: string
  form: string
  description: string
  required?: boolean
  type?: string
}

export type WorkflowToolProviderRequest = {
  name: string
  icon: Emoji
  description: string
  parameters: WorkflowToolProviderParameter[]
  labels: string[]
  privacy_policy: string
}

export type WorkflowToolProviderResponse = {
  workflow_app_id: string
  workflow_tool_id: string
  label: string
  name: string
  icon: Emoji
  description: string
  synced: boolean
  tool: {
    author: string
    name: string
    label: TypeWithI18N
    description: TypeWithI18N
    labels: string[]
    parameters: ParamItem[]
  }
  privacy_policy: string
}
export type DefaultToolsListItem = {
  amount1: number
  amount2: number
  list: Collection[]
} | undefined
export type DefaultToolsListResponse = {
  xinxijiansuo: DefaultToolsListItem
  wenben: DefaultToolsListItem
  wendangchuli: DefaultToolsListItem
}
export type FetchInstallAppListReq = {
  mode?: string
  name?: string
}
export type FetchTestToolReq = {
  tool: string
  params: Record<string, string>
  collection: string
  show_name?: string
  _is_file?: boolean
  _is_upload?: boolean
  file_name?: string
}
export type FetchYdToolListReq = {
  scope?: string
  label?: string[]
  keyword?: string
}
export type fetchYdToolListResItem = {
  items: Collection[]
  provider_num: number
  tool_num: number
  nameCN: string
  color: string
  id: string
}
export type FetchYdToolListItemRes = {
  items: Collection[]
  provider_num: number
  tool_num: number
  nameCN:string
}

export type FetchYdToolListRes = {
  information_search?: FetchYdToolListItemRes
  text_analyze?: FetchYdToolListItemRes
  document_process?: FetchYdToolListItemRes
  process_configuration_assistance?: FetchYdToolListItemRes
  text_generation?: FetchYdToolListItemRes
  expert_rule?: FetchYdToolListItemRes
  multimodal?:FetchInstallAppListReq
}

export type HyydDataProviderReq = {
  full_description: string
  examples: {
    name: string
    content: string
  }[]
  icon: string
  name:string
}
export type ThirdPartyDataListReqItem = {
  background: string
  description: string
  icon: string
  id: string
  is_new: boolean
  name: string
}

export type HyydFileUploadReq = {
  file_name: string
  show_name: string
  _is_upload: boolean
  _is_file: boolean
}


