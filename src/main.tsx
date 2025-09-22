import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'

// 导入Ant Design Mobile样式
import 'antd-mobile/es/global'

// 导入全局样式
import './styles/index.scss'

// 移动端适配
import setRem from './utils/flexible'

// 初始化rem适配
setRem()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)