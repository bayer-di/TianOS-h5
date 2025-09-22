# TianOS-H5 组件模板

本文档提供了TianOS-H5项目中创建新组件的标准模板，以确保所有组件遵循一致的结构和风格。

## 基础组件模板

### 目录结构

```
ComponentName/
├── index.tsx        # 组件主文件
├── types.ts         # 类型定义
└── utils.ts         # (可选) 组件相关工具函数
```

### types.ts

```typescript
import { ReactNode, HTMLAttributes } from 'react'

export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 组件主要属性的说明
   */
  propName?: string
  
  /**
   * 子元素
   */
  children?: ReactNode
  
  /**
   * 自定义类名
   */
  className?: string
}
```

### index.tsx

```typescript
import React from 'react'
import { ComponentNameProps } from './types'

/**
 * ComponentName组件说明
 * 
 * @example
 * <ComponentName propName="value">
 *   内容
 * </ComponentName>
 */
const ComponentName: React.FC<ComponentNameProps> = ({
  propName,
  children,
  className = '',
  ...rest
}) => {
  // 状态和钩子
  
  // 处理函数
  
  // 计算类名
  const baseClass = 'c-component-name'
  const classes = [
    baseClass,
    className
  ].filter(Boolean).join(' ')
  
  // 渲染
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

export default ComponentName
```

## 样式规范

对应的SCSS文件应放在 `src/styles/components/componentName.scss`：

```scss
.c-component-name {
  // 基础样式
  
  // 元素
  &__element {
    // 元素样式
  }
  
  // 修饰符
  &--modifier {
    // 修饰符样式
  }
}
```

## 表单组件模板

表单组件应支持受控和非受控模式：

```typescript
import React, { useState, useEffect } from 'react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  label?: string
}

const Input: React.FC<InputProps> = ({
  value: propValue,
  defaultValue,
  onChange,
  label,
  className = '',
  ...rest
}) => {
  // 内部状态，用于非受控模式
  const [innerValue, setInnerValue] = useState(defaultValue || '')
  
  // 判断是否为受控组件
  const isControlled = propValue !== undefined
  const value = isControlled ? propValue : innerValue
  
  // 处理变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // 非受控模式下更新内部状态
    if (!isControlled) {
      setInnerValue(newValue)
    }
    
    // 调用外部onChange
    onChange?.(newValue)
  }
  
  // 当受控值变化时更新
  useEffect(() => {
    if (isControlled) {
      setInnerValue(propValue || '')
    }
  }, [isControlled, propValue])
  
  return (
    <div className={`c-input-wrapper ${className}`}>
      {label && <label className="c-input__label">{label}</label>}
      <input
        className="c-input"
        value={value}
        onChange={handleChange}
        {...rest}
      />
    </div>
  )
}

export default Input
```

## 容器组件模板

容器组件负责数据获取和状态管理：

```typescript
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores'
import { userApi } from '@/services'
import PresentationalComponent from './PresentationalComponent'

const UserContainer: React.FC = () => {
  // 状态
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 从store获取数据
  const { user, setUser } = useUserStore()
  
  // 数据获取
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await userApi.getUserInfo()
        setUser(response.user)
      } catch (err) {
        setError('获取用户信息失败')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [setUser])
  
  // 条件渲染
  if (loading) return <div className="c-loading">加载中...</div>
  if (error) return <div className="c-error">{error}</div>
  if (!user) return <div className="c-empty">无数据</div>
  
  // 渲染展示组件
  return <PresentationalComponent user={user} />
}

export default UserContainer
```

## 自定义Hook模板

```typescript
import { useState, useEffect, useCallback } from 'react'

interface UseFeatureOptions {
  initialValue?: string
  otherOption?: boolean
}

interface UseFeatureResult {
  value: string
  loading: boolean
  error: Error | null
  setValue: (newValue: string) => void
  refresh: () => Promise<void>
}

/**
 * 自定义Hook说明
 */
export const useFeature = (options: UseFeatureOptions = {}): UseFeatureResult => {
  const { initialValue = '', otherOption = false } = options
  
  // 状态
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // 方法
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 异步操作
      const result = await someAsyncOperation()
      setValue(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 副作用
  useEffect(() => {
    if (otherOption) {
      refresh()
    }
  }, [otherOption, refresh])
  
  return {
    value,
    loading,
    error,
    setValue,
    refresh
  }
}

// 模拟异步操作
const someAsyncOperation = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('result'), 1000)
  })
}
```

## 页面组件模板

```typescript
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePageData } from '@/hooks'
import { PageHeader, ContentSection } from '@/components'

/**
 * 页面组件
 */
const PageName: React.FC = () => {
  // 路由相关
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // 数据获取
  const { data, loading, error, refresh } = usePageData(id)
  
  // 页面标题
  useEffect(() => {
    document.title = `${data?.title || '页面'} - TianOS-H5`
  }, [data?.title])
  
  // 处理函数
  const handleBack = () => {
    navigate(-1)
  }
  
  const handleAction = () => {
    // 处理操作
  }
  
  // 渲染
  return (
    <div className="page page-name">
      <PageHeader title={data?.title} onBack={handleBack} />
      
      {loading && <div className="c-loading">加载中...</div>}
      
      {error && (
        <div className="c-error">
          <p>{error.message}</p>
          <button onClick={refresh}>重试</button>
        </div>
      )}
      
      {data && (
        <ContentSection 
          data={data}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

export default PageName
```

## 最佳实践

1. 组件应该是可复用的，避免硬编码业务逻辑
2. 使用TypeScript类型定义提高代码质量
3. 使用JSDoc注释说明组件用途和使用方法
4. 分离关注点，展示组件只负责渲染，容器组件负责数据和状态
5. 使用自定义Hook封装复杂逻辑
6. 遵循BEM命名约定组织样式