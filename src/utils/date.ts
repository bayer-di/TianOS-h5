/**
 * 获取指定时分秒的时间戳
 * @param hours 小时 (0-23)，默认为当前小时
 * @param minutes 分钟 (0-59)，默认为 0
 * @param seconds 秒数 (0-59)，默认为 0
 * @param baseDate 基准日期，默认为当前日期
 * @returns 时间戳（毫秒）
 */
export const getTimeWithHMS = (
  hours?: number,
  minutes: number = 0,
  seconds: number = 0,
  baseDate: Date = new Date()
): number => {
  const date = new Date(baseDate)
  
  if (hours !== undefined) {
    date.setHours(hours)
  }
  date.setMinutes(minutes)
  date.setSeconds(seconds)
  date.setMilliseconds(0)
  
  return date.getTime()
}

/**
 * 获取当前时间的年月日时 + 指定分秒的时间戳
 * @param minutes 分钟 (0-59)，默认为 30
 * @param seconds 秒数 (0-59)，默认为 0
 * @returns 时间戳（毫秒）
 */
export const getCurrentTimeWithMinutes = (
  minutes: number = 30,
  seconds: number = 0
): number => {
  return getTimeWithHMS(undefined, minutes, seconds)
}

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式字符串，支持：YYYY-年, MM-月, DD-日, HH-时, mm-分, ss-秒
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  const d = typeof date === 'number' ? new Date(date) : date
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

