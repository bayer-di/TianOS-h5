import React from 'react'
import type { ReactNode } from 'react'
import cls from 'classnames'
import './styles.scss'

// List组件属性接口
interface ListProps {
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

// ListItem组件属性接口
interface ListItemProps {
  onClick?: () => void
  extra?: ReactNode
  arrow?: boolean
  disabled?: boolean
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

// ListItem组件
const ListItem: React.FC<ListItemProps> = ({
  onClick,
  extra,
  arrow = false,
  disabled = false,
  children,
  className,
  style
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <div 
      className={cls('c-list-item', {
        'c-list-item--clickable': onClick,
        'c-list-item--disabled': disabled
      }, className)}
      style={style}
      onClick={handleClick}
    >
      <div className="c-list-item__content">
        {children}
      </div>
      {(extra || arrow) && (
        <div className="c-list-item__extra">
          {extra}
          {arrow && <div className="c-list-item__arrow" />}
        </div>
      )}
    </div>
  )
}

// List组件
const List: React.FC<ListProps> & { Item: typeof ListItem } = ({
  header,
  footer,
  children,
  className,
  style
}) => {
  return (
    <div className={cls('c-list', className)} style={style}>
      {header && <div className="c-list__header">{header}</div>}
      <div className="c-list__body">{children}</div>
      {footer && <div className="c-list__footer">{footer}</div>}
    </div>
  )
}

// 将ListItem作为List的静态属性
List.Item = ListItem

export default List
