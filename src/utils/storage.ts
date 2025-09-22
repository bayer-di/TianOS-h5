/**
 * localStorage封装
 */
export const localStorage = {
  /**
   * 设置localStorage
   * @param key 键
   * @param value 值
   */
  set(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 获取localStorage
   * @param key 键
   * @param defaultValue 默认值
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    const value = window.localStorage.getItem(key)
    if (value === null) return defaultValue
    try {
      return JSON.parse(value) as T
    } catch (error) {
      return value as unknown as T
    }
  },

  /**
   * 移除localStorage
   * @param key 键
   */
  remove(key: string): void {
    window.localStorage.removeItem(key)
  },

  /**
   * 清空localStorage
   */
  clear(): void {
    window.localStorage.clear()
  }
};

/**
 * sessionStorage封装
 */
export const sessionStorage = {
  /**
   * 设置sessionStorage
   * @param key 键
   * @param value 值
   */
  set(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * 获取sessionStorage
   * @param key 键
   * @param defaultValue 默认值
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    const value = window.sessionStorage.getItem(key)
    if (value === null) return defaultValue
    try {
      return JSON.parse(value) as T
    } catch (error) {
      return value as unknown as T
    }
  },

  /**
   * 移除sessionStorage
   * @param key 键
   */
  remove(key: string): void {
    window.sessionStorage.removeItem(key)
  },

  /**
   * 清空sessionStorage
   */
  clear(): void {
    window.sessionStorage.clear()
  }
}
