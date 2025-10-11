import React, { useState, useEffect } from 'react'
import i18n from '@/i18n'
import { CascaderView } from 'antd-mobile'
import type { CascaderOption, CascaderValue, CascaderValueExtend } from 'antd-mobile/es/components/cascader-view/cascader-view'
import cls from 'classnames'
import Field from '../Field'
import CPopup from '../CPopup'
import CButton from '../CButton'
import { CIcon } from '../CIcon'
import { useI18n } from '@/hooks/useI18n'
// 级联选择器属性接口
export interface CCascaderProps {
  value?: CascaderValue[]
  defaultValue?: CascaderValue[]
  options: CascaderOption[]
  placeholder?: string
  title?: string
  disabled?: boolean
  /** 是否选择任意节点触发onChange */
  changeOnSelect?: boolean
  /** 是否显示底部确认按钮 */
  showConfirmButton?: boolean
  /** 是否可清空 */
  clearable?: boolean
  onChange?: (value: CascaderValue[], extend: CascaderValueExtend) => void
  onCancel?: () => void
  onClose?: () => void
  className?: string
  style?: React.CSSProperties
}

const CCascader: React.FC<CCascaderProps> = ({
  options = [],
  placeholder = i18n.t('common.selectPlaceholder'),
  title = i18n.t('common.select'),
  disabled = false,
  value = [],
  changeOnSelect = false,
  showConfirmButton = false,
  clearable = false,
  onChange,
  onCancel,
  onClose,
  className,
  style
}) => {
  const { t } = useI18n()
  // 内部状态管理
  const [visible, setVisible] = useState(false)
  const [innerValue, setInnerValue] = useState<CascaderValue[]>(value)
  // console.log(value,'value')

  useEffect(() => {
    if (value.length > 0) {
      setInnerValue(value)
    } else {
      setInnerValue([])
    }
  }, [JSON.stringify(value)])


  // 处理打开选择器
  const handleOpen = () => {
    if (disabled) return
    setVisible(true)
  }
  
  // 处理清空
  const handleClear = () => {
    onChange?.([], { items: [], isLeaf: false })
    setInnerValue([])
  }

  // 处理关闭选择器
  const handleClose = () => {
    setVisible(false)
    onClose?.()
    onCancel?.()
  }

  // 处理选择确认
  const handleConfirm = () => {
    // 点击确定按钮时触发onChange
    if (Array.isArray(innerValue) && innerValue.length > 0) {
      // 构造extend对象
      const extend: CascaderValueExtend = {
        items: innerValue.map(val => {
          // 查找选项
          let found: CascaderOption | null = null
          let currentOptions = options
          
          for (let i = 0; i < innerValue.length; i++) {
            const option = currentOptions.find(opt => opt.value === innerValue[i])
            if (option) {
              if (option.value === val) {
                found = option
                break
              }
              if (option.children) {
                currentOptions = option.children
              } else {
                break
              }
            } else {
              break
            }
          }
          
          return found
        }),
        isLeaf: true
      }
      
      onChange?.(innerValue, extend)
    
    }
    setVisible(false)
  }
  
  // 处理选项选择
  const handleSelect = (val: CascaderValue[], extend: CascaderValueExtend) => {
    setInnerValue(val)
    
    // 如果是叶子节点，或者changeOnSelect=false允许选择非叶子节点，则触发onChange并自动关闭弹窗
    if (extend.isLeaf || changeOnSelect) {
      onChange?.(val, extend)
      setVisible(false)
    }
  }


  // 获取显示文本 - 以 / 分隔形式显示
  const getDisplayText = () => {
    if (!Array.isArray(value) || value.length === 0) {
      return undefined
    }
    
    // 查找所有选中项的标签
    const labels: string[] = []
    let currentOptions = options
    
    for (let i = 0; i < value.length; i++) {
      const val = value[i]
      const option = currentOptions.find(opt => opt.value === val)
      
      if (option) {
        // 添加当前选项的标签
        labels.push(option.label?.toString() || '')
        
        // 更新当前选项列表为子选项
        if (option.children) {
          currentOptions = option.children
        } else {
          break
        }
      } else {
        break
      }
    }
    
    // 以 / 分隔形式连接所有标签
    return labels.length > 0 ? labels.join(' / ') : placeholder
   
  }


  return (
    <div className={cls('c-cascader', className)} style={style}>
      {/* 触发区域 */}
      <Field
        value={getDisplayText()}
        placeholder={placeholder}
        disabled={disabled}
        onClick={handleOpen}
        clearable={clearable && value.length > 0}
        onClear={handleClear}
        active={visible}
        className="c-cascader-field"
      />
      
      {/* 级联选择器 */}
      <CPopup
        visible={visible}
        onClose={handleClose}
        position="bottom"
        destroyOnClose
        title={title}
        footer={
          showConfirmButton ? (
            <div className="c-cascader-footer">
              <CButton
                color="primary"
                block
                size="large"
                onClick={handleConfirm}
              >
                {t('common.confirm')}
              </CButton>
            </div>
          ) : null
        }
      >
        <div className="c-cascader-container">
          <div className="c-cascader-content">
            <CascaderView
              activeIcon={<CIcon type="Global_15" color="#1856AC" size={20} />}
              options={options}
              value={innerValue}
              onChange={handleSelect}
            />
          </div>
        </div>
      </CPopup>
    </div>
  )
}

export default CCascader