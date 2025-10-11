import React from 'react'
import { Toast } from '@/utils/toast'
import CButton from '@/components/CButton'
import { useI18n } from '@/hooks/useI18n'

const ToastTestPage: React.FC = () => {
  const { t } = useI18n()
  
  const handleShowToast = () => {
    Toast.show({
      content: t('pages.toastTest.normalMessage'),
      duration: 2000
    })
  }

  const handleShowSuccessToast = () => {
    Toast.success(t('pages.toastTest.successMessage'))
  }

  const handleShowFailToast = () => {
    Toast.fail(t('pages.toastTest.failMessage'))
  }

  const handleShowLoadingToast = () => {
    const loadingToast = Toast.loading(t('pages.toastTest.loadingMessage'))
    
    // 3秒后关闭loading
    setTimeout(() => {
      loadingToast.clear()
      Toast.success(t('pages.toastTest.loadingComplete'))
    }, 3000)
  }

  return (
    <div className="toast-test-page">
      <h1>{t('pages.toastTest.title')}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
        <CButton onClick={handleShowToast}>{t('pages.toastTest.normalToast')}</CButton>
        <CButton onClick={handleShowSuccessToast}>{t('pages.toastTest.successToast')}</CButton>
        <CButton onClick={handleShowFailToast}>{t('pages.toastTest.failToast')}</CButton>
        <CButton onClick={handleShowLoadingToast}>{t('pages.toastTest.loadingToast')}</CButton>
      </div>
    </div>
  )
}

export default ToastTestPage
