import React from 'react'
import cls from 'classnames'
import { CheckOutline } from 'antd-mobile-icons'
import { CIcon } from '../CIcon'
import './styles.scss'

interface SelectCardProps {
  label: string                   // 显示的文本内容
  value?: string | number         // 选项的值（可选）
  selected?: boolean              // 是否选中
  onClick?: () => void            // 点击事件回调
  className?: string              // 自定义类名
  style?: React.CSSProperties     // 自定义样式
  icon?: React.ReactNode          // 自定义图标（可选）
  disabled?: boolean              // 是否禁用
}

const SelectCard: React.FC<SelectCardProps> = ({
  label,
  // value is included in props but not used directly in the component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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