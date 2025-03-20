/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-15 10:43:54
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-19 15:51:48
 * @FilePath: /yd-new/service/evaluation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEU
 */
import { get, post } from "./base";
import {
  BaseResponse,
  EvaluationRecord,
  CollectionsAddschemeRes,
  GetRecordlistReq,
  PageinfoProps,
  RecordTableListItem,
  UserInfo,
  EvaluationObjectItem
} from "@/models/evaluation";
export const getCollectionsSchemelist = (
  tenant_id: string,
  user_id: string
) => {
  return get<BaseResponse<{ list: EvaluationRecord[] }>>(
    "/api/v1/evaluate/collections/schemelist",
    {
      type: "evaluation",
      params: {
        tenant_id,
        user_id,
      },
    }
  );
};
export const addschemeCollections = (body: CollectionsAddschemeRes) => {
  return post<BaseResponse<null>>(
    "/api/v1/evaluate/collections/addscheme",
    { body, type: "evaluation" },
    { bodyStringify: false, deleteContentType: true }
  );
};
export const updateSchemeCollections = (body: CollectionsAddschemeRes) => {
  return post<BaseResponse<null>>(
    "/api/v1/evaluate/collections/updatescheme",
    { body, type: "evaluation" },
  );
};
export const deleteschemeCollections = (id:string) => {
  return get<BaseResponse<null>>(`/api/v1/evaluate/collections/deletescheme?&id=${id}`, {
      type: "evaluation"
  });
};
export const getRecordlist = (body: GetRecordlistReq) => {
  return post<BaseResponse<PageinfoProps<RecordTableListItem[]>>>(
    "/api/v1/evaluate/collections/recordlist",
    {
      body,
      type: "evaluation"
    }
  );
};
export const getEvaluationObjectList = () => {
  return get<BaseResponse<{ [key: string]: string }>>("/api/v1/evaluate/record/evaluationObjectList", {
    type: "evaluation"
  });
};

export const downloadReviews = async (id: string, tenant_id: string) => {
  window.open(`${process.env.NEXT_PUBLIC_EVALUATION_API_PREFIX}/api/v1/evaluate/record/download?id=${id}&tenant_id=${tenant_id}`)
};
export const downloadCollections = async (id: string) => {
  window.open(`${process.env.NEXT_PUBLIC_EVALUATION_API_PREFIX}/api/v1/evaluate/collections/download?id=${id}`)
};
export const fetchUserInfo = () => {
  return get<UserInfo>("/hyyd/user/info");
};

export const fetchEvaluationObjectList = () => {
  return get<BaseResponse<EvaluationObjectItem[]>>("/api/v1/evaluate/record/evaluationRuleList", {
   type: "evaluation"
  })
}
export const fetchRecordStart = (body:any) => {
  return post<BaseResponse<EvaluationRecord>>(`/api/v1/evaluate/record/start`, {
    type: "evaluation",
    body
  })
}
export const fetchRestartStart = (id:string) => {
  return post<BaseResponse<null>>(`/api/v1/evaluate/record/restart`, {
    type: "evaluation",
    body: {
      id
    }
  })
}

export const fetchCheckUserState = (user_id:string,user_name:string) => { 
  return get<BaseResponse<boolean>>(`/api/v1/evaluate/user/checkUserState?user_id=${user_id}&user_name=${user_name}`, {
    type: "evaluation"
   })
}

