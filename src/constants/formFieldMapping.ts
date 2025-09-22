/**
 * 表单字段与数据模型字段的映射关系
 * 用于统一管理表单字段和数据模型之间的映射
 */

// 作业记录表单字段映射
export const workRecordFieldMapping = {
  // 表单字段名: 数据模型字段名
  workTypeId: 'workTypeId',
  zoneId: 'zoneId',
  plantingArea: 'areaId',
  categoryId: 'categoryId',
  pieceCount: 'pieceCount',
  workTimeHour: 'workTimeHour',
  remark: 'remark',
  employeeIds: 'employeeIds'
}

// 获取表单字段名对应的数据模型字段名
export const getModelField = (formField: string): string => {
  return workRecordFieldMapping[formField as keyof typeof workRecordFieldMapping] || formField
}

// 获取数据模型字段名对应的表单字段名
export const getFormField = (modelField: string): string => {
  const entries = Object.entries(workRecordFieldMapping)
  const entry = entries.find(([_, value]) => value === modelField)
  return entry ? entry[0] : modelField
}
