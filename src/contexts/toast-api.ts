import type { ToastOptions } from './toast-types'

// Toast API
export const Toast = {
  show: (options: ToastOptions) => {
    const context = window.__TOAST_CONTEXT__
    if (!context) return { clear: () => {} }
    
    const id = context.addToast({
      content: options.content,
      icon: options.icon,
      duration: options.duration,
      position: options.position
    })
    
    return {
      clear: () => context.removeToast(id)
    }
  },
  
  success: (content: string, duration: number = 2000) => {
    return Toast.show({
      icon: 'success',
      content,
      duration
    })
  },
  
  fail: (content: string, duration: number = 2000) => {
    return Toast.show({
      icon: 'fail',
      content,
      duration
    })
  },
  
  loading: (content: string = '加载中...', options: Omit<ToastOptions, 'content' | 'icon'> = {}) => {
    return Toast.show({
      icon: 'loading',
      content,
      duration: 0,
      maskClickable: false,
      ...options
    })
  },
  
  clear: () => {
    const context = window.__TOAST_CONTEXT__
    if (context) {
      context.clearAll()
    }
  }
}
