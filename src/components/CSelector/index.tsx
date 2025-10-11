import React, { useState, useEffect, useMemo, useCallback } from 'react'
import cls from 'classnames'
import i18n from '@/i18n'
import { useMemoizedFn } from 'ahooks'
import { isEmpty, isEqual } from 'lodash'
import List from '../List'
import Field from '../Field'
import CPopup from '../CPopup'
import CButton from '../CButton'
import SelectCard from '../SelectCard'

import './styles.scss'

// 选项类型
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// CSelector属性接口
interface CSelectorProps {
  value?: string | number | Array<string | number>
  defaultValue?: string | number | Array<string | number>
  options: Option[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  showCheckMark?: boolean
  title?: string
  confirmText?: string
  clearable?: boolean
  onChange?: (value: string | number | Array<string | number>) => void
  onCancel?: () => void
  className?: string
  style?: React.CSSProperties
}

const CSelector: React.FC<CSelectorProps> = ({
  options = [],
  placeholder = i18n.t('common.selectPlaceholder'),
  disabled = false,
  multiple = false,
  showCheckMark = true,
  title,
  confirmText = i18n.t('common.confirm'),
  clearable = false,
  onCancel,
  className,
  style,
  value,
  defaultValue,
  onChange,
  ...restProps
}) => {
  // 内部状态，如果提供了value则使用value，否则使用defaultValue或undefined
  const [innerValue, setInnerValue] = useState<string | number | Array<string | number> | undefined>(
    value !== undefined ? value : defaultValue
  )
  
  // 状态管理
  const [visible, setVisible] = useState(false)
  const [tempValue, setTempValue] = useState<string | number | Array<string | number> | undefined>(
    value !== undefined ? value : innerValue
  )
  
  // 当外部value变化时，同步内部状态
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value)
      setTempValue(value)
    }
  }, [value])
  
  // 使用useMemo缓存选项映射，提高查找效率
  const optionMap = useMemo(() => {
    const map = new Map<string | number, Option>()
    options.forEach(option => {
      map.set(option.value, option)
    })
    return map
  }, [options])
  
  // 处理值变化
  const handleValueChange = (newValue: string | number | Array<string | number>) => {
    // 如果是非受控组件，更新内部状态
    if (value === undefined) {
      setInnerValue(newValue)
    }
    
    // 触发外部onChange事件
    onChange?.(newValue)
  }
  
  // 处理触发区域点击 - 使用useMemoizedFn避免不必要的重渲染
  const handleTriggerClick = useMemoizedFn(() => {
    if (!disabled) {
      // 打开弹窗时，将当前值设置为临时值
      setTempValue(value !== undefined ? value : innerValue)
      setVisible(true)
    }
  })
  
  // 处理清空
  const handleClear = useMemoizedFn(() => {
    if (multiple) {
      handleValueChange([] as Array<string | number>)
    } else {
      // 单选模式下，清空值需要特殊处理
      if (value !== undefined) {
        onChange?.('' as string | number) // 对于外部受控模式，触发onChange
      } else {
        setInnerValue('') // 对于内部非受控模式，更新内部状态
      }
    }
  })
  
  // 处理弹出层关闭
  const handleClose = useMemoizedFn(() => {
    setVisible(false)
    onCancel?.()
  })
  
  // 处理选项选择
  const handleOptionSelect = useMemoizedFn((option: Option) => {
    if (option.disabled) return
    
    if (!multiple) {
      // 单选模式：选中即关闭
      handleValueChange(option.value)
      setVisible(false)
    } else {
      // 多选模式：更新临时值，不关闭
      const currentValue = value !== undefined ? value : innerValue
      // 确保currentValue不为undefined
      const currentTempValue = currentValue === undefined ? [] : 
                              (Array.isArray(currentValue) ? currentValue : [currentValue])
      const isSelected = currentTempValue.includes(option.value)
      
      const newTempValue = isSelected
        ? currentTempValue.filter(v => v !== option.value)
        : [...currentTempValue, option.value]
      
      setTempValue(newTempValue)
    }
  })
  
  // 多选模式下的确认按钮处理
  const handleConfirm = useMemoizedFn(() => {
    if (multiple) {
      const currentValue = value !== undefined ? value : innerValue
      if (!isEqual(currentValue, tempValue)) {
        // 确保tempValue不为undefined
        const safeValue = tempValue === undefined ? [] : (Array.isArray(tempValue) ? tempValue : [tempValue])
        handleValueChange(safeValue)
      }
    }
    setVisible(false)
  })
  
  // 获取当前值（受控或非受控）
  const currentValue = value !== undefined ? value : innerValue
  
  // 获取显示文本 - 使用useMemo缓存计算结果
  const displayText = useMemo(() => {
    if (currentValue === undefined || isEmpty(currentValue) || 
        (Array.isArray(currentValue) && currentValue.length === 0)) {
      return undefined
    }
    
    if (!Array.isArray(currentValue)) {
      // 单选
      const option = optionMap.get(currentValue)
      return option ? option.label : undefined
    } else {
      // 多选
      return currentValue
        .map(val => {
          const option = optionMap.get(val)
          return option ? option.label : ''
        })
        .filter(Boolean)
        .join(', ')
    }
  }, [currentValue, optionMap, placeholder])
  
  // 判断选项是否选中 - 使用useCallback优化
  const isOptionSelected = useCallback((optionValue: string | number) => {
    if (tempValue === undefined) {
      return false
    }
    if (Array.isArray(tempValue)) {
      return tempValue.includes(optionValue)
    }
    return tempValue === optionValue
  }, [tempValue])
  
  // 渲染选项列表 - 使用useMemo优化渲染，结合使用List和SelectCard组件
  const optionsList = useMemo(() => (
    <div className="c-selector-options">
      <List>
        {options.map(option => (
          <SelectCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={isOptionSelected(option.value)}
            icon={showCheckMark ? undefined : null}
            disabled={option.disabled}
            onClick={() => handleOptionSelect(option)}
          />
        ))}
      </List>
    </div>
  ), [options, isOptionSelected, showCheckMark, handleOptionSelect])
  
  // 多选模式下的底部确认按钮
  const footer = useMemo(() => {
    if (!multiple) return null
    
    return (
      <div className="c-selector-footer">
        <CButton
          block
          color="primary"
          size="large"
          onClick={handleConfirm}
        >
          {confirmText}
        </CButton>
      </div>
    )
  }, [multiple, confirmText, handleConfirm])

  return (
    <div className={cls('c-selector', className)} style={style} {...restProps}>
      {/* 触发区域 */}
      <Field
        value={displayText}
        placeholder={placeholder}
        disabled={disabled}
        onClick={handleTriggerClick}
        clearable={clearable && !isEmpty(currentValue) && !(Array.isArray(currentValue) && currentValue.length === 0)}
        onClear={handleClear}
        active={visible}
        className="c-selector-field"
      />
      
      {/* 弹出层 */}
      <CPopup
        visible={visible}
        onClose={handleClose}
        className="c-selector-popup"
        position="bottom"
        destroyOnClose
        title={title}
      >
        {optionsList}
        {footer}
      </CPopup>
    </div>
  )
}

export default CSelector