// import { parseMessage } from './error'
import { Toast } from './toast'
// import { Toast } from 'antd-mobile'

export function parseMessage(e: unknown): string {
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message.replace('Error: ', '') || '出错了'
  return '出错了'
}
export interface AsyncFetchHooks<T> {
  loadingAction?: string
  loadingSuccessMsg?: string
  onRequest?: () => void
  onSuccess?: (response: T) => void
  onError?: (errMessage: unknown) => void
  onFinish?: () => void
}

export const asyncFetch = async <T>(
  callApi: () => Promise<T>,
  hooks: AsyncFetchHooks<T> = {},
): Promise<boolean> => {
  const {
    loadingAction,
    loadingSuccessMsg,
    onRequest,
    onSuccess,
    onError,
    onFinish,
  } = hooks
  
  // 保存Toast引用
  let loadingToast: { clear: () => void } | null = null
  
  try {
    // 显示加载中提示
    if (loadingAction) {
      loadingToast = Toast.loading(`正在${loadingAction}...`)
    }
    
    if (onRequest) onRequest()
    const response = await callApi()
    if (onSuccess) onSuccess(response)
    
    // 隐藏加载提示并显示成功提示
    if (loadingToast) {
      loadingToast.clear()
      loadingToast = null
      
      if (loadingSuccessMsg) {
        setTimeout(() => {
          Toast.success(`${loadingSuccessMsg}成功`)
        }, 50)
      }
    }
    
    return true
  } catch (e: unknown) {
    const errorMsg = parseMessage(e)
    
    // 隐藏加载提示
    if (loadingToast) {
      loadingToast.clear()
      loadingToast = null
    }
    
    if (onError) {
      onError(errorMsg)
    } else {
      console.log(errorMsg,'er')
      Toast.fail(errorMsg)
      // Toast.show({
      //   content: errorMsg,
      //   icon: 'fail',
      //   duration: 2000,
      // })
    }
    
    return false
  } finally {
    // 确保加载提示被清除
    if (loadingToast) {
      loadingToast.clear()
      loadingToast = null
    }
    if (onFinish) onFinish()
  }
}

