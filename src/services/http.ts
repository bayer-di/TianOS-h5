import axios, { type AxiosRequestConfig, type AxiosError } from 'axios'
import { useUserStore } from '../stores'
import { useLanguageStore } from '../stores/languageStore'

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从状态管理获取token
    const token = useUserStore.getState().token
    
    // 如果有token则添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加语言头
    const currentLanguage = useLanguageStore.getState().currentLanguage
    if (config.headers) {
      // 可以根据后端要求使用不同的header名称
      config.headers['Accept-Language'] = currentLanguage
      // 或者使用自定义header
      config.headers['X-Language'] = currentLanguage
    }
    
    // 如果数据是FormData类型，则不设置Content-Type，让浏览器自动处理
    if (config.data instanceof FormData) {
      // 删除Content-Type，让浏览器自动设置，包括boundary
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // 对于非FormData请求，如果没有设置Content-Type，则设置为application/json
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 直接返回数据
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response
      
      // 处理401未授权错误
      if (status === 401) {
        // 清除用户信息
        useUserStore.getState().logout()
        // 可以在这里添加重定向到登录页的逻辑
      }
      
      // 处理其他错误
      const errorMessage = (error.response?.data as any)?.message || '请求失败'
      console.error(`请求错误 ${status}: ${errorMessage}`)
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      console.error(`请求错误: ${error.message}`)
    }
    
    return Promise.reject(error)
  }
)

// 封装GET请求
export const get = <T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return http.get(url, { params, ...config })
}

// 封装POST请求
export const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return http.post(url, data, config)
}

// 封装PUT请求
export const put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return http.put(url, data, config)
}

// 封装DELETE请求
export const del = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.delete(url, config)
}

export default http
