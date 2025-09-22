import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useUserStore } from '../stores'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const login = useUserStore(state => state.login)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleLogin = async () => {
    if (!username || !password) {
      alert('请输入用户名和密码')
      return
    }
    
    setLoading(true)
    try {
      const success = await login(username, password)
      if (success) {
        navigate('/')
      } else {
        alert('登录失败，请重试')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('登录出错')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="page page-login">
      <h1>登录</h1>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="用户名" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="password" 
            placeholder="密码" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)'
            }} 
          />
        </div>
        
        <Button 
          type="primary" 
          block 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
      </div>
    </div>
  )
}

export default LoginPage