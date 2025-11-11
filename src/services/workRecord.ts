import { get, post } from './http'
import type { WorkRecordForm } from '../types/workRecord'

// 作业记录录入相关接口
export const workRecordApi = {
  /** 获取工种组-工种级联列表 */
  getWorkTypeList: (uuid: string) => get(`/api/labor/force/group/tree/${uuid}/with/work-type`),
  /** 获取工种列表（全量） */
  getWorkTypeListAll: (uuid: string) => get(`/api/labor/force/work/list/${uuid}`),
  /** 获取所属区块级联列表 */
  getZoneList: (uuid: string) => get(`/api/labor/force/zone/tree/list/${uuid}`),
  /** 区块-种植区域 Map */
  getAreaMap: (uuid: string) => post(`/api/labor/force/tree/list-area/${uuid}`),
  /** 获取品种列表 */
  getCategoryList: (uuid: string) => get(`/api/labor/force/crop/category/list/${uuid}`),
  /** 录入作业记录 */
  saveWorkRecord: ({ uuid, ...data }: WorkRecordForm) => post('/api/labor/force/save/record', { uid: uuid, ...data }),
}