import React from 'react'
import { useLocation } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'
import CResult from '@/components/CResult'
import { useI18n } from '@/hooks/useI18n'

interface ResultPageState {
  status?: 'success' | 'error'
  title?: string
  description?: string
}

const ResultPage: React.FC = () => {
  const location = useLocation()
  const { t } = useI18n()
  
  const state = location.state as ResultPageState || {}
  const { 
    status = 'success', 
    title = t('pages.resultPage.success.title'), 
    description = '', 
  } = state

  
  return (
    <PageContainer title={t('pages.resultPage.title')} showBack={false}>
      <CResult
        status={status}
        title={title}
        description={description}
      />
    </PageContainer>
  )
}

export default ResultPage