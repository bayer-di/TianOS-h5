import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  
  return (
    <div className="layout-main">
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
