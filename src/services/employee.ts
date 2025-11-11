import { get, post } from './http'
import type { IEmployeeFilter } from '../types/employee'

// 员工相关接口
export const employeeApi = {
  // 获取职位列表
  getPositionList: (uuid: string) => get(`/api/labor/force/position/list/${uuid}`),
  // 获取员工列表（带筛选条件）
  getEmployeeList: ({ uuid, ...data }: Partial<IEmployeeFilter>) => post('/api/labor/force/employee/list', { uid: uuid, ...data }),
}