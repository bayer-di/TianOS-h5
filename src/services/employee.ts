import { get, post } from './http'
import type { IEmployeeFilter } from '../types/employee'

// 员工相关接口
export const employeeApi = {
  // 获取职位列表
  getPositionList: (baseId: number) => get(`/api/labor/force/position/list/${baseId}`),
  // 获取员工列表（带筛选条件）
  getEmployeeList: (data: Partial<IEmployeeFilter>) => post('/api/labor/force/employee/list', data),
}