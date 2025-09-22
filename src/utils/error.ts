/**
 * 解析错误消息
 * @param e 错误对象
 * @returns 格式化后的错误消息
 */
// export function parseMessage(e: unknown): string {
//   if (typeof e === 'string') return e
//   if (e instanceof Error) return e.message.replace('Error: ', '') || '出错了'
  
//   // 处理API返回的错误对象
//   if (e && typeof e === 'object') {
//     if ('message' in e && typeof e.message === 'string') return e.message
//     if ('msg' in e && typeof e.msg === 'string') return e.msg
//     if ('error' in e && typeof e.error === 'string') return e.error
//   }
  
//   return '出错了'
// }
