# 自动路由系统

本项目实现了一个自动路由系统，可以自动将 `pages` 目录下的文件注册为路由，无需手动配置。

## 使用方法

### 目录页面

在 `pages` 目录下创建一个文件夹，并在其中创建 `index.tsx` 文件，该文件将自动注册为路由。

例如：
- `pages/work-record-entry/index.tsx` -> 路由: `/work-record-entry`
- `pages/employee-info-entry/index.tsx` -> 路由: `/employee-info-entry`
- `pages/auto-route-test/index.tsx` -> 路由: `/auto-route-test`

### 单文件页面

直接在 `pages` 目录下创建 `.tsx` 文件，该文件也会自动注册为路由。

例如：
- `pages/toast-test.tsx` -> 路由: `/toast-test`
- `pages/ui-demo.tsx` -> 路由: `/ui-demo`

## 工作原理

自动路由系统使用 Vite 的 `import.meta.glob` 功能来动态导入页面组件，并根据文件路径自动生成路由配置。

系统分开处理以下两种类型的文件，避免路径冲突：
1. `pages/**/index.tsx` - 目录页面
2. `pages/*.tsx` - 单文件页面

所有自动生成的路由都会作为主布局的子路由。

## 注意事项

- 路由路径是根据文件路径自动生成的，所以请确保文件名符合路由命名规范
- 所有页面组件都会被懒加载，以提高应用性能
- README.md 和其他非 .tsx 文件会被自动跳过
- 如果遇到路由不生效的问题，可以查看控制台的调试信息
