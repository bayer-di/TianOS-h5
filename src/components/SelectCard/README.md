# SelectCard 选择卡片组件

SelectCard 是一个简洁的 UI 选中项组件，用于展示可选项并提供选中状态的视觉反馈。

## 使用示例

```jsx
import { useState } from 'react'
import SelectCard from '@/components/SelectCard'

const Demo = () => {
  const [selected, setSelected] = useState('1')
  
  const handleSelect = (value) => {
    setSelected(value)
  }
  
  return (
    <div>
      <SelectCard
        label="水果深加工工程师"
        value="1"
        selected={selected === '1'}
        onClick={() => handleSelect('1')}
      />
      
      <SelectCard
        label="果园主管"
        value="2"
        selected={selected === '2'}
        onClick={() => handleSelect('2')}
      />
    </div>
  )
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 显示的文本内容 | `string` | - |
| value | 选项的值（可选） | `string \| number` | - |
| selected | 是否选中 | `boolean` | `false` |
| onClick | 点击事件回调 | `() => void` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| icon | 自定义选中图标 | `ReactNode` | `<CheckOutline />` |
| disabled | 是否禁用 | `boolean` | `false` |

## 样式定制

组件使用 BEM 命名规范，可以通过以下类名进行样式定制：

- `.c-select-card`: 卡片容器
- `.c-select-card__label`: 文本标签
- `.c-select-card__icon`: 选中图标
- `.c-select-card--selected`: 选中状态
- `.c-select-card--disabled`: 禁用状态

## 注意事项

1. 组件默认带有底部边框，最后一项会自动去除边框
2. 选中状态下文本颜色会变为主题色
3. 禁用状态下不会触发点击事件
