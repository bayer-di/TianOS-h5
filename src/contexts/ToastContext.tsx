import React, { createContext, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import type { ToastInstance, ToastContextType } from './toast-types'

// 创建Context
const ToastContext = createContext<ToastContextType | null>(null)

// 使用Context的Hook
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Provider组件
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用ref存储toast列表，避免不必要的重渲染
  const toastsRef = useRef<Record<string, NodeJS.Timeout>>({}) // 存储定时器

  const addToast = (toast: Omit<ToastInstance, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    // 触发自定义事件来添加Toast
    window.dispatchEvent(new CustomEvent('toast:add', { detail: newToast }))
    
    // 如果设置了duration，自动关闭
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        removeToast(id)
      }, toast.duration || 2000)
      
      toastsRef.current[id] = timer
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    // 触发自定义事件来移除Toast
    window.dispatchEvent(new CustomEvent('toast:remove', { detail: id }))
    
    // 清除定时器
    if (toastsRef.current[id]) {
      clearTimeout(toastsRef.current[id])
      delete toastsRef.current[id]
    }
  }
  
  const clearAll = () => {
    // 触发自定义事件来清除所有Toast
    window.dispatchEvent(new CustomEvent('toast:clear'))
    
    // 清除所有定时器
    Object.values(toastsRef.current).forEach(timer => clearTimeout(timer))
    toastsRef.current = {}
  }

  // 将方法暴露给全局使用
  window.__TOAST_CONTEXT__ = { addToast, removeToast, clearAll }
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  )
}