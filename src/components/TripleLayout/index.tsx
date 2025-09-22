import React, { type ReactNode } from 'react'
import cls from 'classnames'

interface TripleLayoutProps {
  /** 顶部内容 */
  header?: ReactNode
  /** 底部内容 */
  footer?: ReactNode
  /** 中间内容区域 */
  children: ReactNode
  /** 是否固定顶部 */
  fixedHeader?: boolean
  /** 是否固定底部 */
  fixedFooter?: boolean
  /** 是否适配安全区域 */
  safeArea?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 内容区域类名 */
  contentClassName?: string
  /** 内容区域样式 */
  contentStyle?: React.CSSProperties
  /** 顶部区域类名 */
  headerClassName?: string
  /** 底部区域类名 */
  footerClassName?: string
}

/**
 * 三栏布局组件 - 上中下结构，上下固定，中间滚动
 */
const TripleLayout: React.FC<TripleLayoutProps> = ({
  header,
  footer,
  children,
  fixedHeader = false,
  fixedFooter = false,
  safeArea = true,
  className,
  style,
  contentClassName,
  contentStyle,
  headerClassName,
  footerClassName
}) => {
  const layoutClasses = cls(
    'c-triple-layout',
    {
      'c-triple-layout--fixed-header': fixedHeader,
      'c-triple-layout--fixed-footer': fixedFooter,
      'c-triple-layout--safe-area': safeArea
    },
    className
  )

  const headerClasses = cls(
    'c-triple-layout__header',
    headerClassName
  )

  const contentClasses = cls(
    'c-triple-layout__content',
    contentClassName
  )

  const footerClasses = cls(
    'c-triple-layout__footer',
    footerClassName
  )

  return (
    <div className={layoutClasses} style={style}>
      {header && (
        <div className={headerClasses}>
          {header}
        </div>
      )}
      
      <div className={contentClasses} style={contentStyle}>
        {children}
      </div>
      
      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default TripleLayout
