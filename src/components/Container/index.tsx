import React from 'react'
import './styles.scss'

interface ContainerProps {
  children: React.ReactNode
  fluid?: boolean
  className?: string
}

/**
 * 响应式容器组件
 * 在小屏幕上占满宽度，在大屏幕上限制最大宽度并居中
 */
const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className = ''
}) => {
  const baseClass = fluid ? 'c-container-fluid' : 'c-container'
  
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  )
}

export default Container
