import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/locales'
import { supportedLanguages, defaultLanguage } from '@/locales'
import { LOCAL_LANGUAGE } from '@/constants/storage'

interface LanguageState {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  isInitialized: boolean
}

// 语言检测逻辑（与 i18n 保持一致）
const detectLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem(LOCAL_LANGUAGE)
    if (stored && supportedLanguages.includes(stored as Language)) {
      return stored as Language
    }
  } catch (error) {
    console.warn('Failed to get stored language:', error)
  }
  
  const browserLang = navigator.language || navigator.languages?.[0]
  if (browserLang?.startsWith('en')) return 'en-US'
  if (browserLang?.startsWith('zh')) return 'zh-CN'
  
  return defaultLanguage
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: detectLanguage(),
      isInitialized: false,
      
      setLanguage: (language: Language) => {
        // 验证语言是否支持
        if (!supportedLanguages.includes(language)) {
          console.warn(`Language ${language} is not supported, falling back to ${defaultLanguage}`)
          language = defaultLanguage
        }
        
        set({ 
          currentLanguage: language,
          isInitialized: true 
        })
      }
    }),
    {
      name: LOCAL_LANGUAGE,
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      }
    }
  )
)
