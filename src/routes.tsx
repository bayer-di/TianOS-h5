import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import type { ComponentType } from 'react'
import MainLayout from './layouts/MainLayout'

// 自动注册路由系统，使用 Vite 的 import.meta.glob 功能自动导入页面组件
const pageModules = import.meta.glob<{ default: ComponentType<Record<string, unknown>> }>('./pages/**/*.tsx')
const autoRoutes: RouteObject[] = []

// 处理所有找到的页面文件
Object.keys(pageModules).forEach(path => {
  // 跳过 README 和其他非页面文件
  if (path.includes('README') || path.includes('.d.ts')) {
    return
  }
  
  let routePath = ''
  
  // 处理不同类型的路径
  if (path.endsWith('/index.tsx')) {
    // 目录页面: './pages/folder/index.tsx' -> 'folder'
    routePath = path
      .replace('./pages/', '')
      .replace('/index.tsx', '')
    
    // 跳过根目录的 index.tsx
    if (path === './pages/index.tsx') {
      return
    }
  } else {
    // 根页面: './pages/file.tsx' -> 'file'
    // 只处理直接位于 pages 目录下的文件
    const pathParts = path.split('/')
    if (pathParts.length > 3 && !path.endsWith('/index.tsx')) {
      return
    }
    
    routePath = path
      .replace('./pages/', '')
      .replace('.tsx', '')
  }
  
  // 创建懒加载组件
  const Component = lazy(() => pageModules[path]())
  
  // 添加到路由配置
  autoRoutes.push({
    path: routePath,
    element: (
      <Suspense>
        <Component />
      </Suspense>
    ),
  })
})


const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: autoRoutes,
  },
]

export default routes
