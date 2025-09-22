import type { ReactNode, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * 按钮类型
   */
  type?: 'primary' | 'secondary' | 'outline';
  
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 是否为块级元素（宽度100%）
   */
  block?: boolean;
  
  /**
   * 按钮图标
   */
  icon?: ReactNode;
  
  /**
   * 子元素
   */
  children?: ReactNode;
}
