import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Dialog from '@/components/Dialog'
import useDIRequest from '@/hooks/useRequest'
import ImageCropper from '@/components/ImageCropper'
import PageContainer from '@/components/PageContainer'
import { Toast } from '@/contexts/toast-api'
import { OCRTypeEnum } from '@/types/employeeInfoEntry'
import { sessionStorage } from '@/utils/storage'
import { employeeInfoEntryApi } from '@/services/employeeInfoEntry'

interface LocationState {
  imageUrl: string
  type: OCRTypeEnum
  uuid: string
}

/**
 * 图片裁剪页面
 * 用于身份证和银行卡等证件的拍照裁剪
 */
const ImageCropperPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState
  
  // 用于跟踪处理状态，当前在UI中不显示，但保留以便未来扩展
  const [, setProcessing] = useState(false)
  
  const [dialogVisible, setDialogVisible] = useState(false)
  
  const handleDialogConfirm = () => {
    setDialogVisible(false)
  }
  
  // 处理Dialog取消按钮点击
  const handleDialogCancel = () => {
    setDialogVisible(false)
    // 返回上一页
    navigate(-1)
  }
  
  // OCR识别请求
  const [{ loading: ocrLoading, runAsync: ocrAction }] = useDIRequest(employeeInfoEntryApi.ocrVerify, {
    manual: true,
  }, {
    onSuccess: ({ data }) => {
      const { type, imgUrl } = data
      if (type === OCRTypeEnum.IdCard) {
        Toast.success('实名认证通过')
      } else {
        Toast.success('银行卡核验成功')
      }
      
      // 将OCR结果存储在sessionStorage中，确保在页面间传递
      sessionStorage.set('ocrResult', {
        type,
        imgUrl,
        timestamp: Date.now()
      })

      setTimeout(() => {
        navigate(-1)
      }, 200)
    },
    onError: () => {
      setDialogVisible(true)
    }
  })
  
  const { imageUrl, type, uuid } = state
  
  // 裁剪完成后处理
  const handleCropComplete = async (croppedFile: File) => {
    setProcessing(true)
    await ocrAction({
      file: croppedFile,
      type,
      uuid
    })
  }
  
  const handleCancel = () => {
    navigate(-1)
  }
  
  return (
    <PageContainer
      showBack={false}
      showSubmit={false}
    >
      <div className="image-cropper-page">
        <ImageCropper
          loading={ocrLoading}
          imageUrl={imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCancel}
        />
      </div>
      
      <Dialog
        visible={dialogVisible}
        data={
          type === OCRTypeEnum.IdCard ? {
            title: '身份认证不通过',
            description: '请在网页端手动录入'
          } : {
            title: '银行卡信息查询失败',
            description: '请在网页端手动录入'
          }
        }
        closeOnAction
        actions={[
          {
            key: 'cancel',
            text: '返回',
            onClick: handleDialogCancel
          },
          {
            key: 'confirm',
            text: '重试',
            bold: true,
            onClick: handleDialogConfirm
          }
        ]}
      />
    </PageContainer>
  )
}

export default ImageCropperPage
