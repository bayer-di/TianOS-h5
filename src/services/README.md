# API 服务层文档

## 📋 概述

本目录包含所有的 API 服务封装，提供统一的 HTTP 请求接口。

## 🌐 国际化支持

### 自动语言头

所有通过 `http.ts` 发起的请求都会自动带上当前语言信息：

```typescript
// 请求会自动包含以下 headers
{
  "Accept-Language": "zh-CN",  // 标准语言头
  "X-Language": "zh-CN"        // 自定义语言头
}
```

### 语言切换

当用户切换语言时，后续的所有请求会自动使用新的语言：

```typescript
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { setLanguage } = useI18n()
  
  const switchToEnglish = async () => {
    // 切换语言
    await setLanguage('en-US')
    
    // 之后的所有请求都会带上 en-US
    const data = await employeeApi.getList() // headers 会包含 "Accept-Language": "en-US"
  }
}
```

## 🔧 HTTP 拦截器配置

### 请求拦截器

```typescript
// src/services/http.ts
http.interceptors.request.use((config) => {
  // 1. 添加 Token
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // 2. 添加语言头
  const currentLanguage = useLanguageStore.getState().currentLanguage
  config.headers['Accept-Language'] = currentLanguage
  config.headers['X-Language'] = currentLanguage
  
  // 3. 处理 Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
})
```

## 📝 API 服务示例

### 标准 API 调用

```typescript
// src/services/employee.ts
import { get, post } from './http'

export const employeeApi = {
  // GET 请求
  getList: () => get<EmployeeList>('/employees'),
  
  // POST 请求
  create: (data: EmployeeData) => post<Employee>('/employees', data),
}

// 使用
const employees = await employeeApi.getList()
// 请求会自动带上：
// - Authorization: Bearer xxx
// - Accept-Language: zh-CN
// - X-Language: zh-CN
```

### 文件上传

```typescript
// FormData 请求会自动处理 Content-Type
const formData = new FormData()
formData.append('file', file)

await post('/upload', formData)
// Content-Type 会被自动设置为 multipart/form-data
// 同时会带上语言头
```

### 语言值说明

- `zh-CN`：简体中文
- `en-US`：美式英语

## 📚 相关文档

- [HTTP 配置](./http.ts)
- [国际化文档](../i18n/README.md)
- [语言状态管理](../stores/languageStore.ts)
