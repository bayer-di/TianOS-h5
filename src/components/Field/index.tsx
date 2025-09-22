import React, { type ReactNode } from 'react'
import cls from 'classnames'
import _isNil from 'lodash/isNil'
import { CloseCircleFill, DownOutline, CalendarOutline } from 'antd-mobile-icons'
import './styles.scss'

export interface FieldProps {
  type?: 'select' | 'date'
  /** 显示的文本内容 */
  value?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 点击事件回调 */
  onClick?: () => void
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 清除按钮点击回调 */
  onClear?: () => void
  /** 右侧图标 */
  rightIcon?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 是否处于激活状态 */
  active?: boolean
  /** 子元素 */
  children?: ReactNode
}

/**
 * Field 组件 - 通用的表单字段触发区域
 * 用于 CSelector 和 CCascader 等组件的触发回显区域
 */
const Field: React.FC<FieldProps> = ({
  type = 'select',
  value,
  placeholder = '请选择',
  disabled = false,
  onClick,
  clearable = false,
  onClear,
  rightIcon,
  className,
  style,
  active = false,
  children
}) => {
  // 处理清除按钮点击，阻止事件冒泡
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  // 是否为空值
  const isEmpty = _isNil(value)

  return (
    <div 
      className={cls('c-field', { 
        'c-field--disabled': disabled,
        'c-field--active': active
      }, className)} 
      style={style}
      onClick={disabled ? undefined : onClick}
    >
      <div className={cls('c-field__content', { 
        'c-field__content--placeholder': isEmpty
      })}>
        {isEmpty ? placeholder : (children || value)}
      </div>
      <div className="c-field__suffix">
        {!isEmpty && clearable && !disabled && (
          <div className="c-field__clear" onClick={handleClear}>
            <CloseCircleFill />
          </div>
        )}
        {(rightIcon || type) ? (
          <div className={cls('c-field__icon', { 'c-field__icon--active': active })}>
            {rightIcon || (type === 'select' ? <DownOutline /> : (type === 'date' ? <CalendarOutline /> : null))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Field