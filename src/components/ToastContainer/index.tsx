import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CIcon } from '../CIcon'
import type { ToastInstance } from '@/contexts/toast-types'
// import CLoading from '../CLoading'
import './styles.scss'

// 全局类型声明
declare global {
  interface Window {
    __TOAST_CONTEXT__?: {
      addToast: (toast: Omit<ToastInstance, 'id'>) => string
      removeToast: (id: string) => void
      clearAll: () => void
    }
  }
}

// Toast组件
const ToastComponent: React.FC<{
  content: string
  icon?: 'success' | 'fail' | 'loading'
}> = ({ content, icon }) => {
  // 根据icon选择不同的图标
  let iconElement = null
  if (icon === 'success') {
    iconElement = <CIcon type="Global_18" size={40} color="#00B42A" />
  } else if (icon === 'fail') {
    iconElement = <CIcon type="Global_21" size={40} color="#FF4D4F" />
  } else if (icon === 'loading') {
    iconElement = <div className="toast-icon toast-loading"></div>
  }

  return (
    <div className="custom-toast">
      {iconElement}
      <div className="toast-content">{content}</div>
    </div>
  )
}

// Toast容器
const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastInstance[]>([])
  const toastsRef = useRef<Record<string, NodeJS.Timeout>>({}) // 存储定时器

  const addToast = (toast: Omit<ToastInstance, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
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
    setToasts(prev => prev.filter(toast => toast.id !== id))
    
    // 清除定时器
    if (toastsRef.current[id]) {
      clearTimeout(toastsRef.current[id])
      delete toastsRef.current[id]
    }
  }
  
  const clearAll = () => {
    setToasts([])
    
    // 清除所有定时器
    Object.values(toastsRef.current).forEach(timer => clearTimeout(timer))
    toastsRef.current = {}
  }
  
  // 创建一个Portal容器
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const div = document.createElement('div')
    div.className = 'toast-portal-container'
    document.body.appendChild(div)
    setContainer(div)
    
    return () => {
      document.body.removeChild(div)
    }
  }, [])
  
  if (!container) return null
  
  // 将context暴露给全局使用
  const contextValue = { addToast, removeToast, clearAll }
  window.__TOAST_CONTEXT__ = contextValue
  
  return createPortal(
    <>
      {toasts.map(toast => (
        <div key={toast.id} className="custom-toast-container">
          <ToastComponent content={toast.content} icon={toast.icon} />
        </div>
      ))}
    </>,
    container
  )
}

export default ToastContainer
