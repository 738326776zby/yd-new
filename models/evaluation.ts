import { Emoji } from '@/app/components/tools/types'
export interface EvaluationItem {
  id: string
  title: string
  publishTime: string
  source: string
  progress: string
  size?: string
  fontSize?: string
  icon: string | Emoji
}

export type EvaluationList = EvaluationItem[]
