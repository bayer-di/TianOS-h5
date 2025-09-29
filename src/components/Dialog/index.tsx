import cls from 'classnames'
import { Dialog } from "antd-mobile"
import type { DialogProps } from "antd-mobile/es/components/dialog"
import './styles.scss'

const CDialog = (props: DialogProps & { data: { title: string, description: string } }) => {
    const { className, bodyClassName, data: { title, description }, ...rest } = props
    return (
        <Dialog 
          className={cls('c-dialog', className)} 
          bodyClassName={cls('c-dialog-body', bodyClassName)}
          closeOnAction
          content={
            <div className="c-dialog-content">
                <div className="c-dialog-content-title">
                    {title}
                </div>
                <div className="c-dialog-content-content">
                    {description}
                </div>
            </div>
          }
          {...rest} 
        />
    )
}

export default CDialog