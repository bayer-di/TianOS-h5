import React, { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// 懒加载页面组件
// const HomePage = lazy(() => import('./pages/home'))
// const LoginPage = lazy(() => import('./pages/login'))
// const UiDemoPage = lazy(() => import('./pages/ui-demo'))
const WorkRecordEntryPage = lazy(() => import('./pages/work-record-entry'))
const EmploySelectPage = lazy(() => import('./pages/employ-select'))

// 加载中组件
const LoadingPage: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    加载中...
  </div>
)

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'work-record-entry',
        element: (
          <Suspense>
            <WorkRecordEntryPage />
          </Suspense>
        ),
      },
      {
        path: 'employ-select',
        element: (
          <Suspense>
            <EmploySelectPage />
          </Suspense>
        ),
      },
    ],
  },
]

export default routes
