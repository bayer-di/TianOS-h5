import type { WorkRecordForm } from '../types/workRecord'
import { getFormField } from '../constants/formFieldMapping'

/**
 * 将数据模型数据转换为表单数据
 * @param modelData 数据模型数据
 * @returns 表单数据
 */
export const convertModelToForm = (modelData: Partial<WorkRecordForm>): Record<string, unknown> => {
  const formData: Record<string, unknown> = {}
  
  // 遍历数据模型字段
  Object.entries(modelData).forEach(([modelField, value]) => {
    // 获取对应的表单字段名
    const formField = getFormField(modelField)
    
    // 特殊处理某些字段
    if (modelField === 'workTypeId' || modelField === 'zoneId' || 
        modelField === 'areaId' || modelField === 'categoryId') {
      // 数字ID转为字符串
      formData[formField] = value !== undefined ? String(value) : undefined
    } else {
      // 其他字段直接赋值
      formData[formField] = value
    }
  })
  
  return formData
}

/**
 * 将表单值设置到表单实例中
 * @param form 表单实例
 * @param values 表单值
 */
export const setFormValues = (
  form: { setFieldValue: (name: string, value: any) => void },
  values: Record<string, unknown>
): void => {
  // 遍历表单值并设置到表单中
  Object.entries(values).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      form.setFieldValue(field, value)
    }
  })
}
