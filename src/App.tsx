import React from 'react'
import { useRoutes } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import enUS from 'antd-mobile/es/locales/en-US'
import routes from '@/routes'
import ToastContainer from '@/components/ToastContainer'
import { ToastProvider } from '@/contexts/ToastContext'
import { useLanguageStore } from '@/stores/languageStore'
import type { Language } from '@/locales'

const App: React.FC = () => {
  const element = useRoutes(routes)
  const { currentLanguage } = useLanguageStore()
  
  const localeMap: Record<Language, typeof zhCN> = {
    'zh-CN': zhCN,
    'en-US': enUS,
  }
  
  return (
    <ConfigProvider locale={localeMap[currentLanguage]}>
      <ToastProvider>
        <div className="app">
          {element}
        </div>
        <ToastContainer />
      </ToastProvider>
    </ConfigProvider>
  )
}

export default App