import React from 'react'
import cls from 'classnames'
import { CIcon } from '../CIcon'
import './styles.scss'

interface SelectCardProps {
  /** 显示的文本内容 */
  label: string
  /** 选项的值（可选） */
  value?: string | number
  /** 是否选中 */
  selected?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  /** 自定义图标（可选） */
  icon?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
}

const SelectCard: React.FC<SelectCardProps> = ({
  label,
  value,
  selected = false,
  onClick,
  className,
  style,
  icon,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <div 
      className={cls('c-select-card', { 
        'c-select-card--selected': selected,
        'c-select-card--disabled': disabled
      }, className)}
      style={style}
      onClick={handleClick}
    >
      <span className="c-select-card__label">{label}</span>
      {selected && (
        <span className="c-select-card__icon">
          {icon || <CIcon type="Global_15" size={20} color="#1856AC" />}
        </span>
      )}
    </div>
  )
}

export default SelectCard