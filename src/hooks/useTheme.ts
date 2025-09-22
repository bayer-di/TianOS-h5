import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export const useTheme = () => {
  // 从localStorage获取主题或使用默认主题
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('app-theme')
    return (savedTheme as Theme) || 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // 设置特定主题
  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // 当主题变化时更新文档类和localStorage
  useEffect(() => {
    // 保存到localStorage
    localStorage.setItem('app-theme', theme)
    
    // 更新文档类
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark')
    } else {
      document.documentElement.classList.remove('theme-dark')
    }
  }, [theme])

  return { theme, toggleTheme, setTheme: setSpecificTheme }
}

export default useTheme
