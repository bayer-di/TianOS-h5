import cls from 'classnames'
import './style.scss'

interface ICLoadingProps {
  loading?: boolean
  size?: 'small' | 'large'
  children?: React.ReactNode
  className?: string
}

const CLoading = ({
  loading,
  children,
  size = 'large',
  className,
}: ICLoadingProps) => {
  return (
    <div className={cls('c-loading', className)}>
      {children}
      {loading && (
        <div className={`c-loading__mask ${size}`}>
          <div className="c-loading__content">
            <div className="c-loading__dot dot1" />
            <div className="c-loading__dot dot2" />
          </div>
        </div>
      )}
    </div>
  )
}

export default CLoading
