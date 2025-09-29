import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import CButton from '@/components/CButton'
import './styles.scss'

interface ImageCropperProps {
  /**
   * 要裁剪的图片URL
   */
  imageUrl: string
  /**
   * 裁剪完成回调
   */
  onCropComplete: (croppedImage: File) => void
  /**
   * 取消裁剪回调
   */
  onCancel: () => void
}

/**
 * 创建裁剪后的图片
 */
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<File> => {
  const image = new Image()
  image.src = imageSrc
  
  // 等待图片加载
  const loadImage = new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => resolve(image)
  })
  
  const imageObj = await loadImage
  
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('无法获取canvas上下文')
  }
  
  // 绘制裁剪后的图片
  ctx.drawImage(
    imageObj,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )
  
  // 转换为Blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file)
      } else {
        throw new Error('裁剪图片失败')
      }
    }, 'image/jpeg', 0.95)
  })

  // 创建File对象
  return new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' })
}

/**
 * 图片裁剪组件
 */
const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel
}) => {
  // 裁剪区域位置
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  // 缩放比例
  const [zoom, setZoom] = useState(1)
  // 裁剪区域像素信息
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  // 是否正在处理裁剪
  const [processing, setProcessing] = useState(false)
  
  // 根据证件类型设置裁剪比例
  const aspectRatio = 1.59 // 身份证和银行卡的标准比例约为1.58:1
  
  // 裁剪区域变化回调
  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location)
  }
  
  // 缩放变化回调
  const onZoomChange = (value: number | number[]) => {
    // antd-mobile的Slider可能返回number或number[]，需要处理
    const zoomValue = Array.isArray(value) ? value[0] : value
    setZoom(zoomValue)
  }
  
  // 裁剪完成回调
  const onCropCompleteHandler = useCallback(
    (
      _croppedArea: { x: number; y: number; width: number; height: number },
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )
  
  // 确认裁剪
  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    
    try {
      setProcessing(true)
      const croppedImage = await createCroppedImage(imageUrl, croppedAreaPixels)

      onCropComplete(croppedImage)
    } catch (error) {
      console.error('裁剪图片失败:', error)
    } finally {
      setProcessing(false)
    }
  }
  
  return (
    <div className="image-cropper">
      <div className="image-cropper__container">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteHandler}
          /** 网格线 */
          showGrid={false}
          classes={{
            containerClassName: 'image-cropper__cropper',
            cropAreaClassName: 'image-cropper__crop-area'
          }}
        />
      </div>
      
      <div className="image-cropper__controls">
        {/* <div className="image-cropper__zoom">
          <div className="image-cropper__zoom-label">缩放 ({zoom.toFixed(1)})</div>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={onZoomChange}
            onAfterChange={(val) => {
              console.log('Slider value after change:', val)
              const zoomValue = Array.isArray(val) ? val[0] : val
              setZoom(zoomValue)
            }}
          />
          
          <div className="image-cropper__zoom-buttons">
            <Button 
              size="mini"
              onClick={() => {
                const newZoom = Math.max(1, zoom - 0.1)
                setZoom(newZoom)
              }}
            >
              -
            </Button>
            <span className="image-cropper__zoom-value">{zoom.toFixed(1)}</span>
            <Button 
              size="mini"
              onClick={() => {
                const newZoom = Math.min(3, zoom + 0.1)
                setZoom(newZoom)
              }}
            >
              +
            </Button>
          </div>
        </div> */}
        
        <div className="image-cropper__actions">
          <CButton
            color="default"
            className="image-cropper__button"
            onClick={onCancel}
          >
            取消
          </CButton>
          <CButton
            className="image-cropper__button"
            color="primary"
            onClick={handleConfirm}
            loading={processing}
            disabled={processing}
          >
            确认
          </CButton>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
