# TianOS-H5 项目风格指南

本文档定义了TianOS-H5项目的代码风格和开发规范，所有项目贡献者都应遵循这些规则。

## 目录结构

```
src/
├── assets/         # 静态资源
├── components/     # 公共组件
├── hooks/          # 自定义hooks
├── layouts/        # 布局组件
├── pages/          # 页面组件（文件即路由）
├── services/       # API服务
├── stores/         # 状态管理
├── styles/         # 样式文件
│   ├── base/       # 基础样式
│   ├── components/ # 组件样式
│   ├── layouts/    # 布局样式
│   ├── pages/      # 页面样式
│   ├── utils/      # 样式工具
│   └── themes/     # 主题相关
├── types/          # TypeScript类型
├── utils/          # 工具函数
```

## 命名规范

### 文件命名

- 组件文件：使用 PascalCase（如 `Button.tsx`）
- 组件目录：使用 PascalCase（如 `Button/`）
- 页面文件：使用 camelCase（如 `home.tsx`）
- 样式文件：使用 camelCase（如 `button.scss`）
- 工具/Hook文件：使用 camelCase（如 `useTheme.ts`）

### 变量命名

- 变量和函数：使用 camelCase（如 `userName`）
- 组件：使用 PascalCase（如 `UserProfile`）
- 常量：使用 UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）
- 接口/类型：使用 PascalCase 并以 I 前缀（如 `IUserProps`）或无前缀

## 样式规范

### BEM命名约定

- 块（Block）：功能独立的组件（如 `.app-button`）
- 元素（Element）：块的组成部分（如 `.app-button__icon`）
- 修饰符（Modifier）：改变块或元素的状态或外观（如 `.app-button--primary`）

### 样式命名建议

- 建议为自定义组件样式添加适当的前缀，避免与第三方库冲突
- 前缀可根据功能模块或组件类型灵活选择，不强制统一前缀
- 常见前缀示例：
  - 页面相关：`page-`
  - 组件相关：`c-`或组件名称
  - 布局相关：`layout-`
  - 工具类：`util-`

### CSS变量

- 颜色、间距、字体等通用属性使用CSS变量
- 变量定义在 `:root` 选择器中
- 暗色主题变量定义在 `.dark-theme` 类中

### SCSS样式规则

- SCSS文件中使用分号结尾，保持与CSS标准一致
- 嵌套不超过3层，避免过深的选择器
- 使用`&`符号表示父选择器引用
- 变量、混合和函数使用连字符命名（如`$primary-color`）
- 避免使用`!important`，优先使用特定性更高的选择器
  
## 组件开发规范

### 组件结构

```tsx
// 函数组件模板
import React from 'react'
import { ComponentProps } from './types'

const Component: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  className = '',
  ...rest
}) => {
  // 状态和钩子

  // 处理函数

  // 渲染
  return (
    <div className={`c-component ${className}`} {...rest}>
      {/* 内容 */}
    </div>
  )
}

export default Component
```

### Props定义

- 使用TypeScript接口定义Props
- 为所有非必需Props提供默认值
- 组件应接收className和style属性以支持样式覆盖

## 状态管理规范

### Zustand Store

- 每个功能模块创建独立的store
- 使用TypeScript接口定义状态类型
- 使用persist中间件持久化关键状态

```tsx
// Store模板
import { create } from 'zustand'

interface StoreState {
  // 状态
  count: number
  
  // 操作
  increment: () => void
  decrement: () => void
}

export const useCountStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}))
```

## 路由规范

- 使用Hash路由模式
- 页面组件放在pages目录下
- 使用React.lazy进行代码分割
- 路由配置集中在routes.tsx文件中

## TypeScript规范

- 为所有组件Props定义接口
- 为API响应定义类型
- 使用泛型增强类型安全
- 避免使用any，优先使用unknown

## 代码格式

- 使用2个空格缩进
- 使用单引号
- 每行最大长度100字符
- **JavaScript/TypeScript代码不使用分号结尾**
- **SCSS/CSS样式文件保留分号结尾**
- 使用ESLint和Prettier保持代码一致性

## Git提交规范

提交信息格式：`<type>: <subject>`

类型（type）:
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动

## 性能优化规则

- 使用React.memo避免不必要的重渲染
- 使用useMemo和useCallback缓存计算结果和函数
- 使用虚拟列表处理长列表
- 图片使用WebP格式并进行懒加载
- 使用代码分割减小初始加载体积

## 最佳实践

- 组件应遵循单一职责原则
- 避免过深的组件嵌套
- 使用自定义Hook封装复杂逻辑
- 避免在渲染函数中创建函数或对象
- 使用React.lazy和Suspense进行代码分割
- 使用条件渲染优化性能