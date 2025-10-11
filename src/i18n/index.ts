import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources, defaultLanguage, supportedLanguages } from '@/locales'
import { LOCAL_LANGUAGE } from '@/constants/storage'
import type { Language } from '@/locales'

// 语言检测
const getInitialLanguage = () => {
  // 检查 localStorage
  try {
    const stored = window.localStorage.getItem(LOCAL_LANGUAGE)
    if (stored && supportedLanguages.includes(stored as Language)) {
      return stored
    }
  } catch (error) {
    console.warn('Failed to get stored language:', error)
  }
  
  // 检查浏览器语言
  const browserLang = navigator.language || navigator.languages?.[0]
  if (browserLang?.startsWith('en')) {
    return 'en-US'
  }
  if (browserLang?.startsWith('zh')) {
    return 'zh-CN'
  }
  
  // 默认中文
  return defaultLanguage
}

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: defaultLanguage,
    debug: process.env.NODE_ENV === 'development',
    resources,
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
