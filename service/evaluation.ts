import { get, post } from './base'
import { BaseResponse, EvaluationRecord, CollectionsAddschemeRes, CollectionsDeletescheme, GetRecordlistReq, PageinfoProps, RecordTableListItem } from '@/models/evaluation'
export const getCollectionsSchemelist = () => {
    return get<BaseResponse<{ list: EvaluationRecord[] }>>('/auto-evaluate/api/v1/evaluate/collections/schemelist')
}
export const addschemeCollections = (body: CollectionsAddschemeRes) => {
    return post<BaseResponse<null>>('/auto-evaluate/api/v1/evaluate/collections/addscheme', { body }, { bodyStringify: false, deleteContentType: true })
}
export const deleteschemeCollections = (body: CollectionsDeletescheme) => {
    return post<BaseResponse<null>>('/auto-evaluate/api/v1/evaluate/collections/deletescheme', { body })
}
export const getRecordlist = (body: GetRecordlistReq) => {
    return post<BaseResponse<PageinfoProps<RecordTableListItem[]>>>('/auto-evaluate/api/v1/evaluate/collections/recordlist', {
        body
    })
}
export const getEvaluationObjectList = () => {
    return get<BaseResponse<string[]>>('/auto-evaluate/api/v1/evaluate/record/evaluationObjectList')
}
const downloadCommon = async (response: any) => {
    // 从响应头中获取文件名
    const disposition = response.headers['content-disposition'];
    let filename = '默认名称'; // 设置一个默认文件名

    if (disposition && disposition.indexOf('attachment') !== -1) {
      const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; // 正则表达式
      const matches = regex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, ''); // 去掉引号
      }
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
export const downloadReviews = async (id: string,tenant_id:string) => {
    const response = await fetch(`/auto-evaluate/api/v1/evaluate/record/download?id=${id}&tenant_id=${tenant_id}`);
    downloadCommon(response)

}
export const downloadCollections = async (id: string, tenant_id: string) => {
    const response = await fetch(`/auto-evaluate/api/v1/evaluate/collections/download?id=${id}&tenant_id=${tenant_id}`);
    downloadCommon(response)

}
