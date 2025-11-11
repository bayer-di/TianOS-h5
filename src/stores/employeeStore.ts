import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClockIn } from '../types/employee'
import { asyncFetch } from '../utils/common'
import { employeeApi } from '../services/employee'
import type { IPosition } from '../types/employee'
import type { IEmployeeFilter } from '../types/employee'

// 员工数据接口
export interface IEmployee {
  id: string
  employeeNo: string
  name: string
  positionId: number
  positionName: string
  isSelected?: boolean
  clockIn?: number // 打卡状态
}

// 员工选择状态接口
interface EmployeeState {
  // 数据状态
  positions: IPosition[]
  employees: IEmployee[]
  selectedEmployees: IEmployee[]
  currentPositionId: number
  filter: Partial<IEmployeeFilter>
  
  // 加载状态
  isLoading: boolean
  error: string | null
  
  // 操作方法
  setFilter: (filter: Partial<IEmployeeFilter>) => void
  setCurrentPositionId: (positionId: number) => void
  selectEmployee: (employee: IEmployee) => void
  unselectEmployee: (employeeId: string) => void
  selectAllEmployees: () => void
  unselectAllEmployees: () => void
  clearSelectedEmployees: () => void
  
  // 数据加载方法
  fetchPositions: (uuid: string) => Promise<void>
  fetchEmployees: () => Promise<void>
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      // 初始状态
      positions: [],
      employees: [],
      selectedEmployees: [],
      currentPositionId: 0,
      filter: {
        clockIn: ClockIn.ALL,
        keywords: '',
      },
      isLoading: false,
      error: null,
      
      // 设置筛选条件
      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter }
        }))
        // 更新筛选条件后自动获取员工列表
        get().fetchEmployees()
      },
      
      // 设置当前选中的职位
      setCurrentPositionId: (positionId) => {
        set({ currentPositionId: positionId })
        // 切换职位后自动获取员工列表
        get().fetchEmployees()
      },
      
      // 选择员工
      selectEmployee: (employee) => {
        set((state) => {
          // 检查是否已经选择
          const isAlreadySelected = state.selectedEmployees.some(emp => emp.id === employee.id)
          if (isAlreadySelected) {
            return state // 已选中，不做任何操作
          }
          
          // 添加到已选列表
          return {
            selectedEmployees: [...state.selectedEmployees, employee],
            employees: state.employees.map(emp => 
              emp.id === employee.id ? { ...emp, isSelected: true } : emp
            )
          }
        })
      },
      
      // 取消选择员工
      unselectEmployee: (employeeId) => {
        set((state) => ({
          selectedEmployees: state.selectedEmployees.filter(emp => emp.id !== employeeId),
          employees: state.employees.map(emp => 
            emp.id === employeeId ? { ...emp, isSelected: false } : emp
          )
        }))
      },
      
      // 选择当前筛选条件下的所有员工
      selectAllEmployees: () => {
        set((state) => {
          const { employees } = state
          
          
          // 合并已选和当前筛选条件下的员工
          const newSelectedEmployees = [
            ...state.selectedEmployees.filter(selected => 
              !employees.some(emp => emp.id === selected.id)
            ),
            ...employees
          ]
          
          // 更新员工选中状态
          const updatedEmployees = state.employees.map(emp => {
            const isSelected = newSelectedEmployees.some(selected => selected.id === emp.id)
            return { ...emp, isSelected }
          })
          
          return {
            selectedEmployees: newSelectedEmployees,
            employees: updatedEmployees
          }
        })
      },
      
      // 取消选择当前筛选条件下的所有员工
      unselectAllEmployees: () => {
        set((state) => {
          const { employees } = state
          
          
          // 从已选中列表中移除当前筛选条件下的员工
          const newSelectedEmployees = state.selectedEmployees.filter(selected => 
            !employees.some(emp => emp.id === selected.id)
          )
          
          // 更新员工选中状态
          const updatedEmployees = state.employees.map(emp => {
            const isSelected = newSelectedEmployees.some(selected => selected.id === emp.id)
            return { ...emp, isSelected }
          })
          
          return {
            selectedEmployees: newSelectedEmployees,
            employees: updatedEmployees
          }
        })
      },
      
      // 清空所有选中的员工
      clearSelectedEmployees: () => {
        set({
          selectedEmployees: [],
          employees: get().employees.map(emp => ({ ...emp, isSelected: false }))
        })
      },
      
      // 获取职位列表
      fetchPositions: async (uuid) => {
        await asyncFetch(() => employeeApi.getPositionList(uuid), {
          onSuccess: (res: any) => {
            set({ positions: res?.data, currentPositionId: res.data.length > 0 ? res.data[0].id : 0 })
            if (res.data.length > 0) {
              get().fetchEmployees()
            }
          }
        })
      },
      
      // 获取员工列表
      fetchEmployees: async () => {
        const { filter, currentPositionId, selectedEmployees } = get()
        
        if (!currentPositionId) return
        
        await asyncFetch(() => employeeApi.getEmployeeList({
          ...filter,
          clockIn: filter.clockIn === ClockIn.ALL ? undefined : filter.clockIn,
          positionId: currentPositionId,
        }), {
          onSuccess: (res: any) => {
            if (res && res.data) {
              const employeeList = res.data.map((emp: IEmployee) => {
                const isSelected = selectedEmployees.some(selected => selected.id === emp.id)
                return { ...emp, isSelected }
              })
              set({ employees: employeeList, isLoading: false })
            }
          }
        })
      }
    }),
    {
      name: 'employee-selection-storage',
    }
  )
)
