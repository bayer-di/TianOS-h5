import 'react-i18next'
import type { resources } from '@/locales'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['zh-CN']
  }
}
