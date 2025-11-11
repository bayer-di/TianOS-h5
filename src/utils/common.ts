import { Toast } from '../contexts/toast-api'

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

/**
 * 异步请求封装函数，带有加载、成功和错误提示
 * @param callApi 调用的API函数
 * @param hooks 回调和配置
 * @returns Promise<boolean> 请求是否成功
 */
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
    
    // 调用请求前的钩子
    if (onRequest) onRequest()
    
    // 执行请求
    const response = await callApi()
    
    // 调用成功后的钩子
    if (onSuccess) onSuccess(response)
    
    // 处理成功提示
    if (loadingToast) {
      // 先关闭加载提示
      loadingToast.clear()
      loadingToast = null
      
      // 如果有成功提示文案，显示成功提示
      if (loadingSuccessMsg) {
        // 稍微延迟一下，避免两个toast叠加
        setTimeout(() => {
          Toast.success(`${loadingSuccessMsg}成功`)
        }, 100)
      }
    }
    
    return true
  } catch (e: unknown) {
    // 解析错误信息
    // const errorMsg = parseMessage(e)
    const errorMsg = (e as any).response?.data?.msg || parseMessage(e)

    // 隐藏加载提示
    if (loadingToast) {
      loadingToast.clear()
      loadingToast = null
    }
    
    // 处理错误
    if (onError) {
      // 如果有自定义错误处理，交给它处理
      onError(errorMsg)
    } else {
      // 否则显示错误提示
      Toast.fail(errorMsg)
    }
    
    return false
  } finally {
    // 确保加载提示被清除（防止其他异常情况）
    if (loadingToast) {
      loadingToast.clear()
      loadingToast = null
    }
    
    // 调用完成后的钩子
    if (onFinish) onFinish()
  }
}

