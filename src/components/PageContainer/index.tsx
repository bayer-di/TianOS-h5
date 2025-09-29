import React, { type ReactNode } from 'react'
import cls from 'classnames'
import CNavBar from '../CNavBar'
import TripleLayout from '../../layouts/TripleLayout'
import CButton from '../CButton'
import { useNavigate } from 'react-router-dom'
import CLoading from '../CLoading'

interface PageContainerProps {
  /** 页面标题 */
  title?: string
  /** 中间内容区域 */
  children: ReactNode
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回按钮点击回调，不传则默认使用navigate(-1) */
  onBack?: () => void
  /** 右侧内容 */
  right?: ReactNode
  /** 底部内容 */
  footer?: ReactNode
  border?: boolean
  loading?: boolean
  /** 是否适配安全区域 */
  safeArea?: boolean
  /** 自定义类名 */
  className?: string
  /** 内容区域类名 */
  contentClassName?: string
  /** 内容区域样式 */
  contentStyle?: React.CSSProperties
  /** 是否显示提交按钮 */
  showSubmit?: boolean
  /** 提交按钮文本 */
  submitText?: string
  /** 提交按钮点击回调 */
  onSubmit?: () => void
  /** 提交按钮加载状态 */
  submitLoading?: boolean
  /** 提交按钮禁用状态 */
  submitDisabled?: boolean
  /** 提交按钮类名 */
  submitClassName?: string
}

/**
 * 页面容器组件 - 集成导航栏和三栏布局
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  showBack = true,
  border = true,
  right,
  footer,
  loading = false,
  safeArea = true,
  className,
  contentClassName,
  contentStyle,
  showSubmit = false,
  submitText = '提交',
  submitLoading = false,
  submitDisabled = false,
  submitClassName,
  onBack,
  onSubmit,
}) => {
  const navigate = useNavigate()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  // 页面头部
  const header = (
    <CNavBar 
      border={border}
      title={title}
      onBack={showBack ? handleBack : undefined}
      backIcon={showBack}
      right={right}
    />
  )

  // 页面底部
  const renderFooter = () => {
    if (footer) {
      return <div className={cls('page-container__footer', {
        'page-container__footer--border': border,
      })}>{footer}</div>
    }
    
    if (showSubmit) {
      return (
        <div className={cls('page-container__submit', submitClassName, {
          'page-container__submit--border': border,
        })}>
          <CButton
            block
            type="submit"
            color="primary"
            size="large"
            onClick={onSubmit}
            loading={submitLoading}
            disabled={submitDisabled}
          >
            {submitText}
          </CButton>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className={cls('page-container', className)}>
      <TripleLayout
        header={header}
        footer={renderFooter()}
        safeArea={safeArea}
        contentClassName={contentClassName}
        contentStyle={contentStyle}
      >
        <div className="page-container__content">
          <CLoading loading={loading} >
            {children}
         </CLoading>
        </div>
      </TripleLayout>
    </div>
  )
}

export default PageContainer