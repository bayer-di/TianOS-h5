import React from 'react'
import cls from 'classnames'
import { NavBar } from 'antd-mobile'
import { CIcon } from '../CIcon'
import type { NavBarProps } from 'antd-mobile/es/components/nav-bar'

interface CNavBarProps extends NavBarProps {
  title?: string
  border?: boolean
}

const CNavBar: React.FC<CNavBarProps> = (props) => {
  const { title, className, backIcon, border, ...rest } = props
  return (
    <NavBar
      backIcon={backIcon ? <CIcon type="Global_05" /> : false}
      className={cls('c-nav-bar', className)}
      style={{
        '--height': '42px',
        backgroundColor: '#fff',
        borderBottom: border ? '1px solid #DFDFDF' : 'none',
      }}
     {...rest} 
    >
      {title}
    </NavBar>
  )
}

export default CNavBar