import React from 'react'
import { Button } from 'antd-mobile'
import type { ButtonProps } from 'antd-mobile'
import './styles.scss'

const CButton: React.FC<ButtonProps> = ({
  ...props
}) => {
  return <Button {...props} />
}

export default CButton