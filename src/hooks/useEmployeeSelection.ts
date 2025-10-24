import { useState, useEffect } from 'react'
import { SESSION_WORK_RECORD_FORM } from '@/constants/storage'
// 定义员工接口以避免循环依赖
export interface IEmployee {
  id: string
  employeeNo: string
  name: string
  positionId: number
  positionName: string
  isSelected?: boolean
  clockIn?: number
}

export const useEmployeeSelection = () => {
  // 本地状态管理选中的员工
  const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([])
  const [employeeMap, setEmployeeMap] = useState<Record<string, boolean>>({})
  
  // 初始化时从sessionStorage读取选中员工
  useEffect(() => {
    const storedData = sessionStorage.getItem(SESSION_WORK_RECORD_FORM)
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        if (parsedData.selectedEmployees?.length > 0) {
          setSelectedEmployees(parsedData.selectedEmployees)
          // 创建员工ID到选中状态的映射
          const newMap: Record<string, boolean> = {}
          parsedData.selectedEmployees.forEach((emp: IEmployee) => {
            newMap[emp.id] = true
          })
          setEmployeeMap(newMap)
        }
      } catch (error) {
        console.error('解析已选员工数据失败:', error)
      }
    }
  }, [])
  
  // 检查员工是否被选中
  const isEmployeeSelected = (employeeId: string): boolean => {
    return !!employeeMap[employeeId]
  }
  
  // 选择单个员工
  const selectEmployee = (employee: IEmployee) => {
    if (employeeMap[employee.id]) return // 已经选中，不做操作

    setSelectedEmployees(prev => [...prev, employee])
    setEmployeeMap(prev => ({ ...prev, [employee.id]: true }))
  }
  
  // 取消选择单个员工
  const unselectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId))
    setEmployeeMap(prev => {
      const newMap = { ...prev }
      delete newMap[employeeId]
      return newMap
    })
  }
  
  // 处理员工选择/取消选择
  const toggleEmployeeSelection = (employee: IEmployee) => {
    if (employeeMap[employee.id]) {
      unselectEmployee(employee.id)
    } else {
      selectEmployee(employee)
    }
  }
  
  // 选择当前列表中所有员工
  const selectAllEmployees = (employees: IEmployee[]) => {
    const newMap = { ...employeeMap }
    const employeesToAdd: IEmployee[] = []

    employees.forEach(emp => {
      if (!newMap[emp.id]) {
        newMap[emp.id] = true
        employeesToAdd.push(emp)
      }
    })

    setEmployeeMap(newMap)
    setSelectedEmployees(prev => [...prev, ...employeesToAdd])
  }
  
  // 取消选择当前列表中所有员工
  const unselectAllEmployees = (employees: IEmployee[]) => {
    const employeeIds = new Set(employees.map(emp => emp.id))
    const newMap = { ...employeeMap }
    
    employeeIds.forEach(id => {
      delete newMap[id]
    })
    
    setEmployeeMap(newMap)
    setSelectedEmployees(prev => prev.filter(emp => !employeeIds.has(emp.id)))
  }
  
  // 保存选中员工到sessionStorage
  const saveSelectedEmployees = () => {
    const storedData = sessionStorage.getItem(SESSION_WORK_RECORD_FORM)
    let formData = {}
    
    if (storedData) {
      try {
        formData = JSON.parse(storedData)
      } catch (error) {
        console.error('解析表单数据失败:', error)
      }
    }
    
    const employeeIds = selectedEmployees.map(emp => Number(emp.id))
    const newData = {
      ...formData,
      selectedEmployees,
      employeeIds
    }
    
    sessionStorage.setItem(SESSION_WORK_RECORD_FORM, JSON.stringify(newData))
  }
  
  // 清空选中的员工
  const clearSelectedEmployees = () => {
    setSelectedEmployees([])
    setEmployeeMap({})
  }
  
  return {
    selectedEmployees,
    isEmployeeSelected,
    selectEmployee,
    unselectEmployee,
    toggleEmployeeSelection,
    selectAllEmployees,
    unselectAllEmployees,
    saveSelectedEmployees,
    clearSelectedEmployees
  }
}

export default useEmployeeSelection
