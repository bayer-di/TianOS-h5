import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { employeeApi } from '../services/employee'
import { ClockIn } from '../types/employee'
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
  fetchPositions: (baseId: number) => Promise<void>
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
        baseId: 21, // 默认基地ID
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
          const { filter, employees } = state
          
          // 获取当前筛选条件下的员工
          const filteredEmployees = employees.filter(emp => {
            if (filter.clockIn === ClockIn.ALL) return true
            return emp.clockIn === filter.clockIn
          })
          
          // 合并已选和当前筛选条件下的员工
          const newSelectedEmployees = [
            ...state.selectedEmployees.filter(selected => 
              !filteredEmployees.some(emp => emp.id === selected.id)
            ),
            ...filteredEmployees
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
          const { filter, employees } = state
          
          // 获取当前筛选条件下的员工
          const filteredEmployees = employees.filter(emp => {
            if (filter.clockIn === ClockIn.ALL) return true
            return emp.clockIn === filter.clockIn
          })
          
          // 从已选中列表中移除当前筛选条件下的员工
          const newSelectedEmployees = state.selectedEmployees.filter(selected => 
            !filteredEmployees.some(emp => emp.id === selected.id)
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
      fetchPositions: async (baseId) => {
        set({ isLoading: true, error: null })
        try {
          const res = await employeeApi.getPositionList(baseId)
          if (res && res.data) {
            set({ 
              positions: res.data,
              currentPositionId: res.data.length > 0 ? res.data[0].id : 0,
              isLoading: false 
            })
            
            // 获取职位后自动获取员工列表
            if (res.data.length > 0) {
              get().fetchEmployees()
            }
          }
        } catch (error) {
          console.error('Failed to fetch positions:', error)
          set({ 
            isLoading: false, 
            error: '获取职位列表失败' 
          })
        }
      },
      
      // 获取员工列表
      fetchEmployees: async () => {
        const { filter, currentPositionId, selectedEmployees } = get()
        
        if (!currentPositionId) return
        
        set({ isLoading: true, error: null })
        try {
          const res = await employeeApi.getEmployeeList({
            ...filter,
            positionId: currentPositionId,
          })
          
          if (res && res.data) {
            // 处理员工数据，标记已选中的员工
            const employeeList = res.data.map((emp: IEmployee) => {
              const isSelected = selectedEmployees.some(selected => selected.id === emp.id)
              return { ...emp, isSelected }
            })
            set({ employees: employeeList, isLoading: false })
          }
        } catch (error) {
          console.error('Failed to fetch employees:', error)
          set({ 
            isLoading: false, 
            error: '获取员工列表失败' 
          })
        }
      }
    }),
    {
      name: 'employee-selection-storage',
      // 只持久化选中的员工和筛选条件
      partialize: (state) => ({ 
        selectedEmployees: state.selectedEmployees,
        filter: state.filter 
      }),
    }
  )
)
