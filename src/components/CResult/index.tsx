import React from 'react'
import { Result } from 'antd-mobile'
import type { ResultProps } from 'antd-mobile/es/components/result'
import { CIcon } from '../CIcon'

import './style.scss'

export const IconMap = {
  success: <CIcon type="Global_18" size={64} color="#46A342" />,
  error: <CIcon type="Global_21" size={64} color="#FF4D4F" />,
}

const CResult: React.FC<ResultProps> = (props) => {
  const { status, title, description, ...rest } = props
  if (status === 'success') {
    return (
      <div className="c-result">
        <Result status="success" title={title} description={description} icon={IconMap.success} {...rest} />
      </div>
    )
  } 
}

export default CResult