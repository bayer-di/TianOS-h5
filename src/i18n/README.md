# 国际化 (i18n) 使用指南

## 📋 概述

本项目使用 `react-i18next` 实现国际化，支持中文（zh-CN）和英文（en-US）两种语言。

## 🏗️ 架构设计

### 核心文件结构
```
src/
├── i18n/
│   ├── index.ts          # i18n 初始化配置
│   ├── types.ts          # TypeScript 类型定义
│   └── README.md         # 使用文档
├── locales/
│   ├── index.ts          # 语言包导出和配置
│   ├── zh-CN.json        # 中文翻译
│   └── en-US.json        # 英文翻译
├── stores/
│   └── languageStore.ts  # 语言状态管理
├── hooks/
│   └── useI18n.ts        # 国际化 Hook
└── constants/
    └── storage.ts        # 存储常量
```

## 🚀 快速开始

### 1. 在组件中使用翻译

```tsx
import React from 'react'
import { useI18n } from '@/hooks/useI18n'

const MyComponent: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useI18n()
  
  return (
    <div>
      <h1>{t('pages.employSelect.title')}</h1>
      <button onClick={() => setLanguage('en-US')}>
        切换到英文
      </button>
    </div>
  )
}
```

### 2. 添加新的翻译

在 `src/locales/zh-CN.json` 和 `src/locales/en-US.json` 中添加新的翻译键：

```json
{
  "common": {
    "newKey": "新文本"
  },
  "pages": {
    "newPage": {
      "title": "新页面标题"
    }
  }
}
```

## 🔧 核心功能

### 语言检测逻辑
1. **优先检查 localStorage**：`tian-h5-local-lang`
2. **检测浏览器语言**：`navigator.language`
3. **默认回退**：中文（zh-CN）

### 支持的语言
- `zh-CN`：简体中文（默认）
- `en-US`：美式英语

### 语言切换
```tsx
const { setLanguage } = useI18n()

// 切换到英文
await setLanguage('en-US')

// 切换到中文
await setLanguage('zh-CN')
```

## 📝 翻译键命名规范

### 层级结构
```
common.*          # 通用文本
pages.*           # 页面相关
components.*      # 组件相关
business.*        # 业务相关
```

### 命名示例
```json
{
  "common": {
    "confirm": "确定",
    "cancel": "取消",
    "loading": "加载中..."
  },
  "pages": {
    "employSelect": {
      "title": "人员选择",
      "searchPlaceholder": "搜索员工姓名或工号"
    }
  },
  "business": {
    "workTypes": {
      "planting": "种植",
      "harvesting": "收割"
    }
  }
}
```

## 🎯 最佳实践

### 1. 使用 useI18n Hook
```tsx
// ✅ 推荐
const { t, currentLanguage, setLanguage } = useI18n()

// ❌ 不推荐直接使用 useTranslation
const { t } = useTranslation()
```

### 2. 翻译键命名
```tsx
// ✅ 推荐：语义化命名
t('pages.employSelect.title')
t('common.confirm')

// ❌ 不推荐：无意义命名
t('text1')
t('button')
```

### 3. 类型安全
```tsx
// ✅ 推荐：使用类型化的语言
setLanguage('zh-CN')  // TypeScript 会检查类型

// ❌ 不推荐：字符串字面量
setLanguage('zh-cn')  // 可能拼写错误
```

## 🔍 调试

### 开发模式
在开发环境中，i18n 会自动输出调试信息到控制台。

### 常见问题
1. **翻译显示为键名**：检查翻译键是否正确添加到语言包中
2. **语言切换不生效**：确保使用了 `useI18n` Hook 的 `setLanguage` 方法
3. **类型错误**：确保翻译键在语言包中存在

## 📦 依赖

- `react-i18next`: ^15.0.0
- `i18next`: ^23.0.0
- `zustand`: ^4.0.0

## 🌐 HTTP 请求语言头

所有的 HTTP 请求都会自动带上当前语言信息：

```typescript
// 在 src/services/http.ts 中配置
headers: {
  'Accept-Language': 'zh-CN',  // 标准语言头
  'X-Language': 'zh-CN'        // 自定义语言头
}
```

**语言头说明：**
- `Accept-Language`：标准 HTTP 语言头，用于告知服务器客户端首选语言
- `X-Language`：自定义语言头，可根据后端要求调整命名

**自动同步：**
- 语言切换时，后续所有请求会自动使用新语言
- 从 `languageStore` 中获取当前语言
- 无需手动在每个请求中添加语言参数

**后端接口示例：**
```typescript
// 前端请求会自动带上语言头
const data = await employeeApi.getList()

// 后端可以通过以下方式获取语言
// 1. 从 Accept-Language header 获取
// 2. 从 X-Language header 获取
// 3. 根据语言返回对应的文本内容
```

## 🔄 扩展新语言

1. 在 `src/locales/` 下创建新的语言包文件
2. 在 `src/locales/index.ts` 中添加新语言
3. 在 `src/i18n/index.ts` 中更新语言检测逻辑
4. 在 `src/stores/languageStore.ts` 中更新支持的语言列表
5. HTTP 请求会自动使用新添加的语言

## 📚 相关文档

- [react-i18next 官方文档](https://react.i18next.com/)
- [i18next 官方文档](https://www.i18next.com/)
- [Zustand 官方文档](https://zustand-demo.pmnd.rs/)
