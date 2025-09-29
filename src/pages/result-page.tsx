import React from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'
import CResult from '@/components/CResult'

interface ResultPageState {
  status?: 'success' | 'error'
  title?: string
  description?: string
}

const ResultPage: React.FC = () => {
  const location = useLocation()
  
  const state = location.state as ResultPageState || {}
  const { 
    status = 'success', 
    title = '操作成功', 
    description = '', 
  } = state

  
  return (
    <PageContainer title="结果反馈" showBack={false}>
      <CResult
        status={status}
        title={title}
        description={description}
      />
    </PageContainer>
  )
}

export default ResultPage