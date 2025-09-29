import type { OCRVerifyResult, OCRVerifyQue } from '@/types/employeeInfoEntry'
import { post } from './http'

/**
 * 员工信息录入相关API
 */
export const employeeInfoEntryApi = {

  ocrVerify: (data: OCRVerifyQue): Promise<OCRVerifyResult> => {
    const { file, type, uuid } = data

    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)
    
    // 使用封装的post函数，http拦截器会自动处理FormData
    return post(`/api/labor/force/verify/${uuid}/${type}`, formData)
  },
  
  /** 启用员工 */
  enableEmployee: (uuid: string) => {
    return post(`/api/labor/force/identity/enable/${uuid}`)
  },

}
