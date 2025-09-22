import React from 'react'
import cls from 'classnames'
import { Input } from 'antd-mobile'
import type { ReactNode } from 'react'
import type { InputProps } from 'antd-mobile'
import './styles.scss'

interface CInputProps extends InputProps {
  addonAfter?: ReactNode
}

const CInput: React.FC<CInputProps> = ({ addonAfter, className, ...props }) => {
  return (
    <div className={cls('c-input-wrapper', className)}>
      <Input 
        className="c-input" 
        style={{ 
          height: 42,
        }}
        {...props} 
      />
      {addonAfter && <div className="c-input-addon-after">{addonAfter}</div>}
    </div>
  )
}

export default CInput