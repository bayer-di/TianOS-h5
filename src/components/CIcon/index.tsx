import { createFromIconfontCN } from '@ant-design/icons'
import { useMemo } from 'react'

interface CIconProps {
  color?: string
  size?: number
  type: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

export const IconFont = createFromIconfontCN({
  scriptUrl:
    'https://fe-statics.cosmos-ag.com/TianOS-H5/iconfont-20250922-154031.js',
})

export const CIcon: React.FC<CIconProps> = ({ color, size, ...props }) => {
  const finalStyle = useMemo(() => {
    if (color && size) {
      return {
        color,
        fontSize: size,
      }
    } else if (color) {
      return {
        color,
      }
    } else if (size) {
      return {
        fontSize: size,
      }
    }
    return {}
  }, [color, size])

  return <IconFont style={finalStyle} {...props} />
}
