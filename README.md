# TianOS-H5

TianOS-H5是一个基于React 20的移动端H5应用框架，采用现代化的技术栈和最佳实践。

## 技术栈

- **核心框架**: React 20 + TypeScript
- **构建工具**: Vite
- **样式方案**: SCSS + BEM命名约定
- **状态管理**: Zustand
- **路由**: React Router 6 (Hash路由)
- **UI组件库**: Ant Design Mobile
- **HTTP请求**: Axios
- **工具库**: dayjs, lodash-es, ahooks

## 项目特性

- 移动端适配（rem方案）
- 主题切换（亮色/暗色）
- 路由懒加载
- 状态持久化
- 统一的HTTP请求处理
- BEM命名约定的样式组织

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

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

## 样式指南

项目采用SCSS + BEM命名约定的样式方案：

- 组件前缀: `tian-`
- 元素: `tian-component__element`
- 修饰符: `tian-component--modifier`

## 开发规范

- 组件采用函数式组件 + Hooks
- 使用TypeScript进行类型检查
- 遵循BEM命名约定组织样式
- 使用Zustand进行状态管理
- 使用React Router的Hash路由模式