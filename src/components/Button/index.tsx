import React from 'react'
import type { ButtonProps } from './types'

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'medium',
  disabled = false,
  block = false,
  icon,
  children,
  className = '',
  ...rest
}) => {
  const baseClass = 'c-button'
  const classes = [
    baseClass,
    `${baseClass}--${type}`,
    `${baseClass}--${size}`,
    disabled ? `${baseClass}--disabled` : '',
    block ? `${baseClass}--block` : '',
    className
  ].filter(Boolean).join(' ')
  
  return (
    <button 
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      {children && <span className={`${baseClass}__text`}>{children}</span>}
    </button>
  )
}

export default Button
