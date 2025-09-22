import React from 'react'
import { Toast as AntdMobileToast } from 'antd-mobile'
import { createRoot } from 'react-dom/client'

interface ToastOptions {
  content: string
  icon?: 'success' | 'fail' | 'loading'
  duration?: number
  maskClickable?: boolean
}

// 创建一个全局容器用于挂载Toast
let toastContainer: HTMLDivElement | null = null
let toastRoot: any = null

// 确保容器只创建一次
const getContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.className = 'custom-toast-container'
    document.body.appendChild(toastContainer)
    toastRoot = createRoot(toastContainer)
  }
  return { container: toastContainer, root: toastRoot }
}

// 清除所有Toast
const clear = () => {
  if (toastRoot) {
    toastRoot.render(null)
  }
}

// 显示Toast
const show = (options: ToastOptions) => {
  const { container, root } = getContainer()
  
  // 使用React 19的createRoot API渲染Toast
  root.render(
    <AntdMobileToast
      content={options.content}
      icon={options.icon}
      duration={options.duration}
      maskClickable={options.maskClickable}
      afterClose={() => {
        if (options.duration !== 0) {
          clear()
        }
      }}
    />
  )
  
  // 返回一个控制对象
  return {
    clear
  }
}

// 成功提示
const success = (content: string, duration: number = 2000) => {
  return show({
    icon: 'success',
    content,
    duration
  })
}

// 失败提示
const fail = (content: string, duration: number = 2000) => {
  return show({
    icon: 'fail',
    content,
    duration
  })
}

// 加载提示
const loading = (content: string = '加载中...', options: Omit<ToastOptions, 'content' | 'icon'> = {}) => {
  return show({
    icon: 'loading',
    content,
    duration: 0,
    maskClickable: false,
    ...options
  })
}

export const Toast = {
  show,
  success,
  fail,
  loading,
  clear
}
