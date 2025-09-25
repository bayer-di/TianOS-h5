import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

/**
 * 从URL查询字符串中获取参数值
 * @param paramName 参数名称
 * @param search 查询字符串，默认使用当前URL的search部分
 * @param defaultValue 默认值，当参数不存在时返回
 * @returns 参数值
 */
export function getUrlParam<T>(
  paramName: string, 
  search?: string, 
  defaultValue?: T
): T | string | null {
  const searchParams = new URLSearchParams(search || window.location.search)
  const value = searchParams.get(paramName)
  
  if (value === null && defaultValue !== undefined) {
    return defaultValue
  }
  
  return value
}

/**
 * 从URL查询字符串中获取数字参数值
 * @param paramName 参数名称
 * @param search 查询字符串，默认使用当前URL的search部分
 * @param defaultValue 默认值，当参数不存在或无法转换为数字时返回
 * @returns 数字参数值
 */
export function getUrlNumberParam(
  paramName: string,
  search?: string,
  defaultValue: number = 0
): number {
  const value = getUrlParam(paramName, search)
  const numValue = value !== null ? Number(value) : NaN
  
  return isNaN(numValue) ? defaultValue : numValue
}

/**
 * 类型转换函数接口
 */
export type ParamConverter<T> = (value: string | null) => T

/**
 * 参数配置接口
 */
export interface ParamConfig<T> {
  /** 默认值 */
  defaultValue?: T
  /** 转换函数 */
  converter?: ParamConverter<T>
}

/**
 * 参数配置映射
 */
export type ParamsConfig = Record<string, ParamConfig<unknown>>

/**
 * 从配置生成结果类型
 */
export type ParamsResult<T extends ParamsConfig> = {
  [K in keyof T]: T[K] extends ParamConfig<infer R> ? R : never;
}

/**
 * 默认转换器映射
 */
export const defaultConverters: Record<string, ParamConverter<unknown>> = {
  string: (value: string | null) => value || '',
  number: (value: string | null) => {
    const num = value !== null ? Number(value) : NaN
    return isNaN(num) ? 0 : num
  },
  boolean: (value: string | null) => {
    if (value === null) return false
    return value.toLowerCase() === 'true' || value === '1'
  }
}

/**
 * 从URL获取多个参数的Hook
 * @param config 参数配置对象
 * @returns 包含所有参数的对象
 * @example
 */
export function useUrlParams<T extends ParamsConfig>(config: T): ParamsResult<T> {
  const location = useLocation()
  
  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const result: Record<string, unknown> = {}
    
    Object.entries(config).forEach(([paramName, paramConfig]) => {
      const { defaultValue, converter } = paramConfig
      const value = searchParams.get(paramName)
      
      if (value === null && defaultValue !== undefined) {
        result[paramName] = defaultValue
      } else if (converter) {
        result[paramName] = converter(value)
      } else {
        result[paramName] = value
      }
    })
    
    return result as ParamsResult<T>
  }, [location.search, config])
}
