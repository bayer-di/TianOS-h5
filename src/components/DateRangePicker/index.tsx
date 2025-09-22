import React, { useState, useEffect } from 'react'
import { DatePickerView, Button } from 'antd-mobile'
import type { Precision } from 'antd-mobile/es/components/date-picker/date-picker-utils'
import cls from 'classnames'
import dayjs from 'dayjs'
import { CloseCircleFill, CalendarOutline } from 'antd-mobile-icons'
import CPopup from '../CPopup'
import CButton from '../CButton'
import { CIcon } from '../CIcon'
import './styles.scss'

export interface DateRangePickerProps {
  /** 值，格式为 [startTime, endTime] 的时间戳数组 */
  value?: [number, number]
  /** 默认值 */
  defaultValue?: [number, number]
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 精度，year表示只选年份，month表示到月份，day表示到天，hour表示到小时，minute表示到分钟，second表示到秒 */
  precision?: Precision
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 日期格式化 */
  format?: string
  /** 值变化回调 */
  onChange?: (value: [number, number]) => void
  /** 取消回调，由CPopup自动处理 */
  onCancel?: () => void
  /** 关闭回调 */
  onClose?: () => void
  /** 弹窗标题 */
  title?: string
  /** 确认按钮文本 */
  confirmText?: string
  /** 是否可清空 */
  clearable?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * 日期范围选择器组件
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  defaultValue,
  disabled = false,
  precision = 'second',
  min,
  max,
  format,
  onChange,
  onCancel,
  onClose,
  title = '选择日期范围',
  confirmText = '确定',
  clearable = false,
  className,
  style
}) => {
  // 根据精度确定格式化字符串
  const formatString = format || (() => {
    switch (precision) {
      case 'year': return 'YYYY'
      case 'month': return 'YYYY/MM'
      case 'day': return 'YYYY/MM/DD'
      case 'hour': return 'YYYY/MM/DD HH'
      case 'minute': return 'YYYY/MM/DD HH:mm'
      case 'second': return 'YYYY/MM/DD HH:mm:ss'
      default: return 'YYYY/MM/DD'
    }
  })()
  
  // 内部状态
  const [visible, setVisible] = useState(false)
  const [innerValue, setInnerValue] = useState<[number, number] | undefined>(
    value || defaultValue
  )
  const [activeTab, setActiveTab] = useState<'start' | 'end'>('start')
  const [tempDate, setTempDate] = useState<Date>(new Date())

  // 当外部value变化时，更新内部状态
  useEffect(() => {
    if (value) {
      setInnerValue(value)
    }
  }, [value])

  // 打开弹窗时，初始化临时值
  useEffect(() => {
    if (visible) {
      const now = new Date()
      let currentDate = now

      if (innerValue) {
        if (activeTab === 'start' && innerValue[0]) {
          currentDate = new Date(innerValue[0])
        } else if (activeTab === 'end' && innerValue[1]) {
          currentDate = new Date(innerValue[1])
        }
      }
      
      setTempDate(currentDate)
    }
  }, [visible, activeTab, innerValue])

  // 处理打开选择器
  const handleOpen = () => {
    if (disabled) return
    setVisible(true)
  }

  // 处理清空
  const handleClear = () => {
    onChange?.(undefined as unknown as [number, number])
    setInnerValue(undefined)
  }

  // 处理关闭弹窗
  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  // 处理确认
  const handleConfirm = () => {
    const currentTimestamp = tempDate.getTime()

    let newValue: [number, number] = innerValue || [0, 0]
    
    if (activeTab === 'start') {
      newValue = [currentTimestamp, newValue[1] || currentTimestamp]
      // 如果开始时间大于结束时间，则更新结束时间
      if (newValue[0] > newValue[1]) {
        newValue[1] = newValue[0]
      }
      // 切换到结束时间选择
      setActiveTab('end')
    } else {
      newValue = [newValue[0] || currentTimestamp, currentTimestamp]
      // 如果结束时间小于开始时间，则更新开始时间
      if (newValue[1] < newValue[0]) {
        newValue[0] = newValue[1]
      }
      // 完成选择，关闭弹窗
      setVisible(false)
      onChange?.(newValue)
    }

    setInnerValue(newValue)
  }

  // 处理日期变更
  const handleDateChange = (date: Date) => {
    setTempDate(date)
  }

  // 切换开始/结束时间选择
  const handleTabChange = (tab: 'start' | 'end') => {
    setActiveTab(tab)
  }

  // 获取开始时间显示文本
  const getStartTimeText = () => {
    if (!innerValue || !innerValue[0]) return ''
    return dayjs(innerValue[0]).format(formatString)
  }
  
  // 获取结束时间显示文本
  const getEndTimeText = () => {
    if (!innerValue || !innerValue[1]) return ''
    return dayjs(innerValue[1]).format(formatString)
  }

  // 获取最小日期
  const getMinDate = () => {
    return min || new Date(new Date().getFullYear() - 10, 0, 1)
  }
  
  // 获取最大日期
  const getMaxDate = () => {
    return max || new Date(new Date().getFullYear() + 10, 11, 31, 23, 59, 59)
  }

  return (
    <div className={cls('date-range-picker', className)} style={style}>
      {/* 自定义触发区域 */}
      <div 
        className={cls('date-range-picker-custom-field', {
          'date-range-picker-custom-field--disabled': disabled
        })}
        onClick={disabled ? undefined : handleOpen}
      >
        <div className="date-range-picker-custom-field__content">
          <div className="date-range-picker-custom-field__start">
            {getStartTimeText() || <span className="date-range-picker-placeholder">开始时间</span>}
          </div>
          <div className="date-range-picker-custom-field__separator">
            <CIcon type="Global_51" size={16} />
          </div>
          <div className="date-range-picker-custom-field__end">
            {getEndTimeText() || <span className="date-range-picker-placeholder">结束时间</span>}
          </div>
        </div>
        <div className="date-range-picker-custom-field__actions">
          {clearable && !!innerValue ? (
            <div 
              className="date-range-picker-custom-field__clear" 
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            >
              <CloseCircleFill />
            </div>
          ) : (
            <div className="date-range-picker-custom-field__icon">
              <CIcon type="Global_48" size={16}/>
            </div>
          )}
        </div>
      </div>
      
      {/* 弹出层 */}
      <CPopup
        visible={visible}
        onClose={() => {
          handleClose()
          onCancel?.()
        }}
        position="bottom"
        destroyOnClose
        className="date-range-picker-popup"
        title={title}
        footer={
          <div className="date-range-picker-footer">
            <CButton 
              block
              size="large"
              color="primary"
              className="date-range-picker-confirm" 
              onClick={handleConfirm}
            >
              {confirmText}
            </CButton>
          </div>
        }
      >
        {/* 日期范围显示 - 根据UI图重新设计 */}
        <div className="date-range-picker-header">
          <div className="date-range-picker-tabs">
            <div 
              className={cls('date-range-picker-tab', { active: activeTab === 'start' })}
              onClick={() => handleTabChange('start')}
            >
              {innerValue && innerValue[0] ? dayjs(innerValue[0]).format(formatString) : '开始时间'}
            </div>
            <div className="date-range-picker-tab-separator">至</div>
            <div 
              className={cls('date-range-picker-tab', { active: activeTab === 'end' })}
              onClick={() => handleTabChange('end')}
            >
              {innerValue && innerValue[1] ? dayjs(innerValue[1]).format(formatString) : '结束时间'}
            </div>
          </div>
        </div>
        
        {/* 日期时间选择器 */}
        <div className="date-range-picker-selector">
          <DatePickerView
            value={tempDate}
            onChange={handleDateChange}
            precision={precision}
            min={getMinDate()}
            max={getMaxDate()}
            className="date-range-picker-view"
            renderLabel={(_type, data) => {
              switch (_type) {
                case 'year': return data + '年'
                case 'month': return data + '月'
                case 'day': return data + '日'
                case 'hour': return data + '时'
                case 'minute': return data + '分'
                case 'second': return data + '秒'
                default: return data
              }
            }}
          />
        </div>
        
      </CPopup>
    </div>
  )
}

export default DateRangePicker
