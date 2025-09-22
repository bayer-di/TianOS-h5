import React from 'react'
import cls from 'classnames'
import { NavBar } from 'antd-mobile'
import type { NavBarProps } from 'antd-mobile/es/components/nav-bar'

interface CNavBarProps extends NavBarProps {
  title: string
}

const CNavBar: React.FC<CNavBarProps> = (props) => {
  const { title, className, ...rest } = props
  return (
    <NavBar
      backIcon={false}
      className={cls('c-nav-bar', className)}
      style={{
        '--height': '52px',
        backgroundColor: '#fff',
      }}
     {...rest} 
    >
      {title}
    </NavBar>
  )
}

export default CNavBar