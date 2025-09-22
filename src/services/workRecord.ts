import { get, post } from './http'
import type { WorkRecordForm } from '../types/workRecord'

// 作业记录录入相关接口
export const workRecordApi = {
  /** 获取工种组-工种级联列表 */
  getWorkTypeList: (baseId: number) => get(`/api/labor/force/group/tree/${baseId}/with/work-type`),
  /** 获取工种列表（全量） */
  getWorkTypeListAll: (baseId: number) => get(`/api/labor/force/work/list/${baseId}`),
  /** 获取所属区块级联列表 */
  getZoneList: (baseId: number) => get(`/api/labor/force/zone/tree/list/${baseId}`),
  /** 区块-种植区域 Map */
  getAreaMap: (baseId: number) => post(`/api/labor/force/tree/list-area/${baseId}`),
  /** 获取品种列表 */
  getCategoryList: (baseId: number) => get(`/api/labor/force/crop/category/list/${baseId}`),
  /** 录入作业记录 */
  saveWorkRecord: (data: WorkRecordForm) => post('/api/labor/force/save/record', data),
}