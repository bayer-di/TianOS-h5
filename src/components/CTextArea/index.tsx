import cls from 'classnames'
import { TextArea } from 'antd-mobile'
import type { TextAreaProps } from 'antd-mobile'
import './styles.scss'

const CTextArea = (props: TextAreaProps) => {
  const { className, ...rest } = props
  return (
    <TextArea
      style={{
        // '--font-size': '14px',
        '--placeholder-color': '#787878',
      }}
      className={cls('c-text-area', className)}
      {...rest}
    />
  )
}

export default CTextArea