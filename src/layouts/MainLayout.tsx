import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const MainLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 简单的导航项
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/login', label: '登录' },
    { path: '/ui-demo', label: 'UI组件' }
  ];
  
  return (
    <div className="layout-main">
      {/* 内容区域 */}
      <main className="layout-main-content">
        <Outlet />
      </main>
      
      {/* 底部导航 */}
      {/* <footer className="layout-main-footer">
        <div className="layout-tabbar">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`layout-tabbar-item ${location.pathname === item.path ? 'layout-tabbar-item--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </footer> */}
    </div>
  )
}

export default MainLayout
