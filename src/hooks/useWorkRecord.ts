import { useState, useEffect } from 'react'
import { SESSION_WORK_RECORD_FORM } from '@/constants/storage'
import type { WorkRecordForm } from '@/types/workRecord'
import type { IEmployee } from '@/stores/employeeStore'

/**
 * 处理作业记录表单数据与选择人员的 Hook
 */
export const useWorkRecord = () => {
  // 扩展 WorkRecordForm 类型，增加 selectedEmployees 字段
  type ExtendedWorkRecordForm = Partial<WorkRecordForm> & {
    selectedEmployees?: IEmployee[]
  }
  
  // 表单数据状态（包含选中人员）
  const [formData, setFormData] = useState<ExtendedWorkRecordForm>({})

  // 初始化时从 sessionStorage 读取数据
  useEffect(() => {
    const storedFormData = sessionStorage.getItem(SESSION_WORK_RECORD_FORM)

    if (storedFormData) {
      try {
        setFormData(JSON.parse(storedFormData))
      } catch (error) {
        console.error('解析表单数据失败:', error)
      }
    }
  }, [])

  // 保存表单数据到 sessionStorage
  const saveFormData = (data: ExtendedWorkRecordForm) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)
    sessionStorage.setItem(SESSION_WORK_RECORD_FORM, JSON.stringify(newFormData))
  }

  // 更新选中人员，并同步更新employeeIds
  const updateSelectedEmployees = (employees: IEmployee[]) => {
    const employeeIds = employees.length > 0 
      ? employees.map(emp => Number(emp.id)) 
      : []
    
    saveFormData({ 
      ...formData, 
      selectedEmployees: employees,
      employeeIds 
    })
  }

  // 获取选中的人员
  const getSelectedEmployees = (): IEmployee[] => {
    return formData.selectedEmployees || []
  }

  // 清除表单数据和选中人员
  const clearWorkRecordData = () => {
    setFormData({})
    sessionStorage.removeItem(SESSION_WORK_RECORD_FORM)
  }

  return {
    formData,
    selectedEmployees: getSelectedEmployees(),
    saveFormData,
    updateSelectedEmployees,
    clearWorkRecordData
  }
}

export default useWorkRecord
