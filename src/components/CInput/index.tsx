import React from 'react'
import cls from 'classnames'
import { Input } from 'antd-mobile'
import { useI18n } from '@/hooks/useI18n'
import type { ReactNode } from 'react'
import type { InputProps } from 'antd-mobile'
import './styles.scss'

interface CInputProps extends InputProps {
  addonAfter?: ReactNode
}

const CInput: React.FC<CInputProps> = ({ addonAfter, className, ...props }) => {
  const { t } = useI18n()
  return (
    <div className={cls('c-input-wrapper', className)}>
      <Input 
        className="c-input" 
        style={{ 
          height: 42,
        }}
        placeholder={t('common.placeholder')}
        {...props} 
      />
      {addonAfter && <div className="c-input-addon-after">{addonAfter}</div>}
    </div>
  )
}

export default CInput