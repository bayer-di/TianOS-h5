import React from 'react'
import { ImageUploader, Button } from 'antd-mobile'
import { CIcon } from '@/components/CIcon'
import { useNavigate } from 'react-router-dom'
import { OCRTypeEnum } from '@/types/employeeInfoEntry'
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

import './styles.scss'

export interface PhotoUploaderProps {
  /**
   * 上传图片URL
   */
  data?: string | undefined
  /**
   * 上传区域标题
   */
  title?: string
  /**
   * 空图片
   */
  emptyImage?: string
  /**
   * 上传成功后的回调
   */
  onResult?: (result: string, file: File) => void
  /**
   * 删除照片后的回调
   */
  onDelete?: () => void
  /**
   * OCR类型
   */
  ocrType: OCRTypeEnum
  /**
   * 用户UUID
   */
  uuid: string
}

/**
 * 照片上传组件
 * 用于身份证和银行卡等证件的拍照上传
 */
const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  data,
  title,
  emptyImage,
  onDelete,
  ocrType,
  uuid
}) => {

  const navigate = useNavigate()
  
  // 处理图片选择
  const handleImageUploaderChange = (items: ImageUploadItem[]) => {
    if (items.length > 0) {
      // 从items[0].url获取图片URL
      const imageUrl = items[0].url
      
      // 导航到裁剪页面
      navigate('/image-cropper', {
        state: {
          imageUrl,
          type: ocrType,
          uuid,
        }
      })
    }
  }
  
  // 自定义上传函数
  const customUpload = (file: File) => {
    return new Promise<{ url: string }>(resolve => {
      // 创建URL并立即解析，不需要上传到服务器
      const url = URL.createObjectURL(file)
      resolve({ url })
    })
  }
  
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div className="photo-uploader">
      <div className="photo-uploader__title">
        {title}
      </div>
      
      <div className="photo-uploader__content">
        {!data ? (
          <div className="photo-uploader__uploader">
            <ImageUploader
              onChange={handleImageUploaderChange}
              upload={customUpload}
              multiple={false}
              maxCount={1}
            >
              <img src={emptyImage} />
            </ImageUploader>
          </div>
        ) : (
          <div className="photo-uploader__preview">
            <img src={data} />
            <div className="photo-uploader__actions">
              <Button 
                className="photo-uploader__delete-btn"
                onClick={handleDelete}
              >
                <CIcon type="Global_33" size={24} color="#fff" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default PhotoUploader
