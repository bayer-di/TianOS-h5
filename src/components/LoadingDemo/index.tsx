import React from 'react'
import { Button, Space } from 'antd-mobile'
import { asyncFetch } from '../../utils/common'
import { Toast } from '../../utils/toast'

// 模拟API请求
const mockSuccessApi = () => {
  return new Promise<{ data: string }>((resolve) => {
    setTimeout(() => {
      resolve({ data: '请求成功' })
    }, 2000)
  })
}

const mockErrorApi = () => {
  return new Promise<{ data: string }>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('请求失败'))
    }, 2000)
  })
}

const LoadingDemo: React.FC = () => {
  // 成功请求示例
  const handleSuccessRequest = async () => {
    await asyncFetch(mockSuccessApi, {
      loadingAction: '加载数据',
      loadingSuccessMsg: '数据加载',
      onSuccess: (res) => {
        console.log('请求成功:', res)
      },
      onError: (errMsg) => {
        console.error('请求错误:', errMsg)
      },
      onFinish: () => {
        console.log('请求完成')
      }
    })
  }

  // 失败请求示例
  const handleErrorRequest = async () => {
    await asyncFetch(mockErrorApi, {
      loadingAction: '加载数据',
      onError: (errMsg) => {
        console.error('自定义错误处理:', errMsg)
      }
    })
  }

  // 不显示loading的请求示例
  const handleSilentRequest = async () => {
    await asyncFetch(mockSuccessApi, {
      onSuccess: (res) => {
        console.log('静默请求成功:', res)
      }
    })
  }
  
  // 直接使用自定义Toast示例
  const handleDirectToast = () => {
    Toast.loading('直接使用Toast加载中...')
    
    setTimeout(() => {
      Toast.clear()
      Toast.success('操作成功')
    }, 2000)
  }

  return (
    <div>
      <h2>全局Loading演示</h2>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button color="primary" block onClick={handleSuccessRequest}>
          成功请求（带Loading）
        </Button>
        <Button color="danger" block onClick={handleErrorRequest}>
          失败请求（带Loading）
        </Button>
        <Button block onClick={handleSilentRequest}>
          静默请求（无Loading）
        </Button>
        <Button color="success" block onClick={handleDirectToast}>
          直接使用Toast
        </Button>
      </Space>
    </div>
  )
}

export default LoadingDemo
