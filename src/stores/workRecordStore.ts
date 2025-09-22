import { create } from 'zustand'
import { Toast } from 'antd-mobile'
import { persist } from 'zustand/middleware'
import type { WorkRecordForm, IWorkTypeGroup, IBlockLevel, IPlantingArea, IWorkType } from '../types/workRecord'
import type { IEmployee } from './employeeStore'
import { workRecordApi } from '../services/workRecord'
import { asyncFetch, parseMessage } from '../utils/common'

interface WorkRecordState {
  // 表单数据
  formData: Partial<WorkRecordForm>
  
  // 基础数据
  workTypes: IWorkTypeGroup[]
  workTypesAll: IWorkType[]
  workTypesMap: Record<number, IWorkType>
  zones: IBlockLevel[]
  areaMap: Record<number, IPlantingArea[]>
  categories: Array<{ id: number; name: string }>
  
  // 表单状态
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  
  // 操作方法
  updateFormData: (data: Partial<WorkRecordForm>) => void
  updateEmployees: (employees: IEmployee[]) => void
  resetForm: () => void
  
  // 数据加载方法
  fetchWorkTypes: (baseId: number) => Promise<void>
  fetchZones: (baseId: number) => Promise<void>
  fetchAreaMap: (baseId: number) => Promise<void>
  fetchCategories: (baseId: number) => Promise<void>
  fetchWorkTypesAll: (baseId: number) => Promise<void>
  
  // 提交相关
  saveWorkRecord: (data: WorkRecordForm) => Promise<void>
  setSubmitting: (isSubmitting: boolean) => void
  setError: (error: string | null) => void
}

// 默认表单数据
const defaultFormData: Partial<WorkRecordForm> = {
  employeeIds: [],
  pieceCount: 0,
  workTimeHour: 0,
}

export const useWorkRecordStore = create<WorkRecordState>()(
  persist(
    (set) => ({
      formData: { ...defaultFormData },
      workTypes: [],
      workTypesAll: [],
      workTypesMap: {},
      zones: [],
      areaMap: {},
      categories: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      
      // 更新表单数据
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }))
      },
      
      // 更新员工数据
      updateEmployees: (employees) => {
        const employeeIds = employees.map(emp => Number(emp.id))
        set((state) => ({
          formData: { 
            ...state.formData, 
            employeeIds
          }
        }))
      },
      
      // 重置表单
      resetForm: () => {
        set({
          formData: { ...defaultFormData },
          isSubmitting: false,
          error: null
        })
      },
      
      // 获取工种级联列表
      fetchWorkTypes: async (baseId) => {
        await asyncFetch(() => workRecordApi.getWorkTypeList(baseId), {
          onSuccess: (res) => {
            set({ workTypes: res.data })
          },
        })
      },

      // 获取工种列表（全量）
      fetchWorkTypesAll: async (baseId: number) => {
        await asyncFetch(() => workRecordApi.getWorkTypeListAll(baseId), {
          onSuccess: (res) => {
            set({ workTypesAll: res.data })
            set({ workTypesMap: res.data.reduce((acc: Record<number, IWorkType>, item: IWorkType) => {
              acc[item.id] = item
              return acc
            }, {}) })
          },
        })
      },
      
      // 获取区块级联列表
      fetchZones: async (baseId) => {
        await asyncFetch(() => workRecordApi.getZoneList(baseId), {
          onSuccess: (res) => {
            set({ zones: res.data })
          },
        })
      },
      
      // 获取区块-种植区域映射
      fetchAreaMap: async (baseId) => {
        await asyncFetch(() => workRecordApi.getAreaMap(baseId), {
          onSuccess: (res) => {
            set({ areaMap: res.data.areaZoneMap })
          },
        })
      },
      
      // 获取品种列表
      fetchCategories: async (baseId) => {
        await asyncFetch(() => workRecordApi.getCategoryList(baseId), {
          onSuccess: (res) => {
            set({ categories: res.data })
          },
        })
      },
      
      // 保存作业记录
      saveWorkRecord: async (data) => {
        await asyncFetch(() => workRecordApi.saveWorkRecord(data), {
          // onSuccess: (res) => {
          //   console.log('res---saveWorkRecord', res)
          //   // set({ isSubmitting: false })
          // },
          // onError: (errMessage) => {
          //   // Toast.show({
          //   //   icon: 'fail',
          //   //   content: parseMessage(errMessage)
          //   // })
          //   console.log('errMessage---saveWorkRecord', parseMessage(errMessage))
          //   // set({ isSubmitting: false, error: errMessage })
          // }
        })
      },
      
      // 设置提交状态
      setSubmitting: (isSubmitting) => {
        set({ isSubmitting })
      },
      
      // 设置错误信息
      setError: (error) => {
        set({ error })
      }
    }),
    {
      name: 'work-record-storage',
      // 只持久化表单数据
      partialize: (state) => ({ 
        formData: state.formData
      }),
    }
  )
)
