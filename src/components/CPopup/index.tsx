import React from 'react'
import cls from 'classnames'
import { Popup } from 'antd-mobile'
import type { PopupProps } from 'antd-mobile'

// 扩展PopupProps接口，添加title属性
interface CPopupProps extends PopupProps {
  title?: React.ReactNode
  footer?: React.ReactNode
}
import TripleLayout from '../TripleLayout'
import './styles.scss'

const CPopup = (props: CPopupProps) => {
  const { className, children, title, bodyClassName, footer, ...rest } = props
  return (
    <Popup
      visible
      destroyOnClose
      showCloseButton
    //   closeIcon={<CloseOutline fontSize={24} color="red" />}
      position="bottom"
      className={cls('c-popup', className)}
      bodyClassName={cls('c-popup-body', bodyClassName)}
      bodyStyle={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        minHeight: '40vh',
        maxHeight: '60vh',
      }}
      {...rest}
    >
      <TripleLayout
        header={title ? (
            <div className="c-popup-header">
                <div className="c-popup-title">{title}</div>
            </div>) : null
        }
        footer={footer ? (
            <div className="c-popup-footer">
                {footer}
            </div>
        ) : null}
      >
        {children}
      </TripleLayout>
    </Popup>
  )
}

export default CPopup