import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useUserStore } from '../stores'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useUserStore()
  
  const handleLoginClick = () => {
    navigate('/login')
  }
  
  const handleLogoutClick = () => {
    logout()
  }
  
  return (
    <div className="page page-home">
      <h1>TianOS-H5</h1>
      <p>欢迎使用TianOS-H5移动端应用</p>
      
      {isLoggedIn ? (
        <div className="page-user-info">
          <div style={{ marginBottom: '20px' }}>
            <p>欢迎回来，{user?.username}！</p>
          </div>
          <Button type="outline" onClick={handleLogoutClick}>
            退出登录
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={handleLoginClick}>
            去登录
          </Button>
        </div>
      )}
      
      <div style={{ marginTop: '40px' }}>
        <h2>按钮演示</h2>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" size="medium">
            主要按钮
          </Button>
          <Button type="secondary" style={{ marginLeft: '10px' }}>
            次要按钮
          </Button>
          <Button type="outline" style={{ marginLeft: '10px' }}>
            边框按钮
          </Button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" size="small">
            小按钮
          </Button>
          <Button type="primary" size="medium" style={{ marginLeft: '10px' }}>
            中按钮
          </Button>
          <Button type="primary" size="large" style={{ marginLeft: '10px' }}>
            大按钮
          </Button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" disabled>
            禁用按钮
          </Button>
        </div>
        
        <div style={{ marginTop: '20px', width: '100%' }}>
          <Button type="primary" block>
            块级按钮
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage