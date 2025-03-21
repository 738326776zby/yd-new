/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 16:33:11
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-21 14:13:36
 * @FilePath: /yd-new/models/evaluation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Emoji } from "@/app/components/tools/types";

export interface EvaluationRecord {
  id: string;
  tenant_id: string;
  name: string;
  user_id: string;
  user_name: string;
  instructions: string;
  introduction: string;
  path: string;
  source: number;
  status: number;
  evaluation_type: string;
  evaluation_content: string;
  created_time: string;
  updated_time: string;
  delStatus: boolean;
  editStatus: boolean;
}

export interface BaseResponse<T> {
  code: number;
  status: string;
  message: string;
  type?: string;
  data: T;
}

export interface CollectionsAddschemeRes {
  tenant_id?: string;
  name?: string;
  instructions?: string;
  introduction?: string;
  evaluation_type?: string;
  evaluation_content?: string;
  user_id?: string;
  user_name?: string;
  [key: string]: any;
}
export interface CollectionsDeletescheme {
  id: string;
  tenant_id: string;
}

export interface GetRecordlistReq {
  tenant_id?: string;
  collections_id?: string;
  filter_curr_user?: boolean;
  user_id?: string;
  pageNum?: number;
  pageSize?: number;
  evaluation_object?: string;
  pages?: number;
  evaluation_time_order?: 'ASC' | 'DESC';
  results_order?: 'ASC' | 'DESC';
}
export type RecordTableListItem = {
  id: string;
  tenant_id: string;
  collections_id: string;
  collections_name: string;
  user_id: string;
  user_name: string;
  evaluation_object: string;
  task_description: string;
  evaluation_time: string;
  results: null;
  results_file_path: null;
  status: number;
  created_time: string;
  updated_time: string;
};

export type PageinfoProps<T> = {
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  list: T[];
};

export type UserInfo = {
  email: string;
  is_admin: boolean;
  is_editor: boolean;
  tenant_id: string;
  user_id: string;
  user_name: string;
};
export type EvaluationObjectItem = {
  value: string;
  title: string;
};
