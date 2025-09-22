import React from 'react'
import { Toast } from '../utils/toast'
import CButton from '../components/CButton'

const ToastTestPage: React.FC = () => {
  const handleShowToast = () => {
    Toast.show({
      content: '这是一条普通提示',
      duration: 2000
    })
  }

  const handleShowSuccessToast = () => {
    Toast.success('操作成功')
  }

  const handleShowFailToast = () => {
    Toast.fail('操作失败')
  }

  const handleShowLoadingToast = () => {
    const loadingToast = Toast.loading('加载中...')
    
    // 3秒后关闭loading
    setTimeout(() => {
      loadingToast.clear()
      Toast.success('加载完成')
    }, 3000)
  }

  return (
    <div className="toast-test-page">
      <h1>Toast测试页面</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
        <CButton onClick={handleShowToast}>显示普通Toast</CButton>
        <CButton onClick={handleShowSuccessToast}>显示成功Toast</CButton>
        <CButton onClick={handleShowFailToast}>显示失败Toast</CButton>
        <CButton onClick={handleShowLoadingToast}>显示加载中Toast</CButton>
      </div>
    </div>
  )
}

export default ToastTestPage
