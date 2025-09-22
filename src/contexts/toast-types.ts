// 定义Toast相关的类型
export interface ToastOptions {
  content: string
  icon?: 'success' | 'fail' | 'loading'
  duration?: number
  maskClickable?: boolean
  position?: 'top' | 'bottom' | 'center'
}

export interface ToastInstance {
  id: string
  content: string
  icon?: 'success' | 'fail' | 'loading'
  duration?: number
  position?: 'top' | 'bottom' | 'center'
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastInstance, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

// 全局类型声明
declare global {
  interface Window {
    __TOAST_CONTEXT__?: ToastContextType
  }
}
