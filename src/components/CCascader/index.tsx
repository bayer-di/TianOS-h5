import React, { useState, useEffect } from 'react'
import { CascaderView } from 'antd-mobile'
import type { CascaderOption, CascaderValue, CascaderValueExtend } from 'antd-mobile/es/components/cascader-view/cascader-view'
import cls from 'classnames'
import CPopup from '../CPopup'
import Field from '../Field'
import './styles.scss'

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
  placeholder = '请选择',
  title = '选择',
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
        // rightIcon={
        //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //   </svg>
        // }
        active={visible}
        className="c-cascader-field"
      />
      
      {/* 级联选择器 */}
      <CPopup
        visible={visible}
        onClose={handleClose}
        // className="c-cascader-popup"
        position="bottom"
        destroyOnClose
        title={title}
        footer={
          showConfirmButton ? (
            <div className="c-cascader-footer">
              <button 
                className="c-cascader-confirm" 
                onClick={handleConfirm}
              >
                确定
              </button>
            </div>
          ) : null
        }
      >
        <div className="c-cascader-container">
          <div className="c-cascader-content">
            <CascaderView
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