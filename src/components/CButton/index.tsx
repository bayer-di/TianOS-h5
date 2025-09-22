import React from 'react'
import cls from 'classnames'
import { Button } from 'antd-mobile'
import type { ButtonProps } from 'antd-mobile'
import './styles.scss'
export interface CButtonProps extends ButtonProps {
  /**
   * 按钮类型
   */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'middle' | 'large';
  
  /**
   * 是否为块级按钮
   */
  block?: boolean;
  
  /**
   * 是否为圆角按钮
   */
  round?: boolean;
  
  /**
   * 是否为幽灵按钮（透明背景）
   */
  ghost?: boolean;
}

const CButton: React.FC<CButtonProps> = ({
  color = 'primary',
  size = 'middle',
  block = false,
  round = false,
  ghost = false,
  className = '',
  ...props
}) => {

  return (
    <Button 
      color={color} 
      block={block} 
      className={cls('cButton', {
        [`cButton--${color}`]: color,
        [`cButton--${size}`]: size,
        'cButton--block': block,
        'cButton--round': round,
        'cButton--ghost': ghost,
      }, className)}
      {...props} 
    />
  )
}

export default CButton