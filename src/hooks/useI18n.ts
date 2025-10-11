import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@/stores/languageStore'
import { useEffect, useCallback } from 'react'
import type { Language } from '@/locales'

export const useI18n = () => {
  const { t, i18n } = useTranslation()
  const { currentLanguage, setLanguage, isInitialized } = useLanguageStore()
  
  // 同步 i18n 语言和 store 语言
  useEffect(() => {
    if (i18n.isInitialized && isInitialized && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage)
    }
  }, [currentLanguage, i18n, isInitialized])
  
  // 语言切换函数
  const changeLanguage = useCallback(async (language: Language) => {
    try {
      await i18n.changeLanguage(language)
      setLanguage(language)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }, [i18n, setLanguage])
  
  return {
    t,
    currentLanguage,
    setLanguage: changeLanguage,
    isLoading: !i18n.isInitialized || !isInitialized,
  }
}
