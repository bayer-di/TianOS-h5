# DateRangePicker 日期范围选择器

## 📋 概述

支持国际化的日期范围选择器组件，可根据当前语言自动显示对应的日期时间单位。

## 🌐 国际化支持

### 自动适配语言

组件会根据当前语言设置自动显示对应的日期时间单位：

**中文环境 (zh-CN)：**
```
2024年 01月 15日 10时 30分 45秒
```

**英文环境 (en-US)：**
```
2024 01 15 10 30 45
```

### 翻译键

日期时间单位使用以下翻译键：

```json
{
  "common": {
    "dateTime": {
      "year": "年",      // 英文为空字符串 ""
      "month": "月",     // 英文为空字符串 ""
      "day": "日",       // 英文为空字符串 ""
      "hour": "时",      // 英文为空字符串 ""
      "minute": "分",    // 英文为空字符串 ""
      "second": "秒"     // 英文为空字符串 ""
    },
    "startTime": "开始时间",  // Start Time
    "endTime": "结束时间",    // End Time
    "selectDateRange": "选择日期范围"  // Select Date Range
  }
}
```

## 🎯 使用示例

### 基础用法

```tsx
import DateRangePicker from '@/components/DateRangePicker'
import { useState } from 'react'

const MyComponent = () => {
  const [dateRange, setDateRange] = useState<[number, number]>([
    new Date(2024, 0, 1, 9, 0, 0).getTime(),
    new Date(2024, 0, 1, 18, 0, 0).getTime()
  ])

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      precision="second"
      title="选择工作时间"
      clearable
    />
  )
}
```

### 精度控制

组件支持不同的时间精度，会自动显示对应的单位：

```tsx
// 精度：年
<DateRangePicker precision="year" />
// 中文显示：2024年
// 英文显示：2024

// 精度：月
<DateRangePicker precision="month" />
// 中文显示：2024年 01月
// 英文显示：2024 01

// 精度：日
<DateRangePicker precision="day" />
// 中文显示：2024年 01月 15日
// 英文显示：2024 01 15

// 精度：小时
<DateRangePicker precision="hour" />
// 中文显示：2024年 01月 15日 10时
// 英文显示：2024 01 15 10

// 精度：分钟
<DateRangePicker precision="minute" />
// 中文显示：2024年 01月 15日 10时 30分
// 英文显示：2024 01 15 10 30

// 精度：秒
<DateRangePicker precision="second" />
// 中文显示：2024年 01月 15日 10时 30分 45秒
// 英文显示：2024 01 15 10 30 45
```

## 🔧 技术实现

### renderLabel 函数

组件使用 `renderLabel` 函数动态渲染日期时间单位：

```typescript
renderLabel={(_type, data) => {
  // 根据类型获取对应的翻译
  const suffix = t(`common.dateTime.${_type}`)
  // 返回数据 + 单位后缀
  return data + suffix
}
```

### 语言切换

当用户切换语言时，DatePicker 会自动更新显示：

```typescript
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { setLanguage } = useI18n()
  
  // 切换到英文
  setLanguage('en-US')
  // DatePicker 自动显示为：2024 01 15 10 30 45
  
  // 切换到中文
  setLanguage('zh-CN')
  // DatePicker 自动显示为：2024年 01月 15日 10时 30分 45秒
}
```

## 📝 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `[number, number]` | - | 值，格式为 [startTime, endTime] 的时间戳数组 |
| defaultValue | `[number, number]` | - | 默认值 |
| placeholder | `string` | - | 占位文本 |
| disabled | `boolean` | `false` | 是否禁用 |
| precision | `Precision` | `'second'` | 精度（year/month/day/hour/minute/second） |
| min | `Date` | 10年前 | 最小可选日期 |
| max | `Date` | 10年后 | 最大可选日期 |
| format | `string` | 根据精度自动 | 日期格式化 |
| onChange | `(value: [number, number]) => void` | - | 值变化回调 |
| onCancel | `() => void` | - | 取消回调 |
| onClose | `() => void` | - | 关闭回调 |
| title | `string` | `'选择日期范围'` | 弹窗标题 |
| confirmText | `string` | `'确定'` | 确认按钮文本 |
| clearable | `boolean` | `false` | 是否可清空 |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |

## 🎨 样式定制

组件支持通过 CSS 变量自定义样式：

```scss
.date-range-picker-view {
  --item-height: 42px;        // 选项高度
  --item-font-size: 14px;     // 字体大小
}
```

## 📚 相关文档

- [国际化文档](../../i18n/README.md)
- [语言包配置](../../locales/index.ts)
- [Ant Design Mobile DatePicker](https://mobile.ant.design/components/date-picker)
