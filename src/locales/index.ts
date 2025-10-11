import zhCN from './zh-CN.json'
import enUS from './en-US.json'

export const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  },
} as const

export type Language = keyof typeof resources

// 支持的语言列表
export const supportedLanguages: Language[] = ['zh-CN', 'en-US']

// 默认语言
export const defaultLanguage: Language = 'zh-CN'

// 语言映射（用于系统语言检测）
export const languageMap: Record<string, Language> = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-CN', // 繁体中文映射到简体中文
  'zh-HK': 'zh-CN',
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-US', // 英式英语映射到美式英语
  'en-CA': 'en-US',
  'en-AU': 'en-US',
}
