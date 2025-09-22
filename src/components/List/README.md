# List 列表组件

List 是一个通用的列表组件，用于展示一组相关的内容。它由 List 和 List.Item 两个组件组成，可以灵活地组合使用。

## 使用示例

```jsx
import List from '@/components/List'

const Demo = () => {
  return (
    <List header="列表标题">
      <List.Item>基础列表项</List.Item>
      <List.Item extra="附加信息">带有额外内容</List.Item>
      <List.Item arrow={true} onClick={() => console.log('点击了')}>
        可点击的列表项
      </List.Item>
    </List>
  )
}
```

## 与 SelectCard 结合使用

```jsx
import { useState } from 'react'
import List from '@/components/List'
import SelectCard from '@/components/SelectCard'

const Demo = () => {
  const [selected, setSelected] = useState('1')
  
  return (
    <List header="选择水果">
      <SelectCard
        label="苹果"
        value="1"
        selected={selected === '1'}
        onClick={() => setSelected('1')}
      />
      <SelectCard
        label="香蕉"
        value="2"
        selected={selected === '2'}
        onClick={() => setSelected('2')}
      />
    </List>
  )
}
```

## API

### List

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| header | 列表头部内容 | `ReactNode` | - |
| footer | 列表底部内容 | `ReactNode` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### List.Item

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onClick | 点击事件回调 | `() => void` | - |
| extra | 右侧额外内容 | `ReactNode` | - |
| arrow | 是否显示箭头图标 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

## 样式定制

组件使用 BEM 命名规范，可以通过以下类名进行样式定制：

### List

- `.c-list`: 列表容器
- `.c-list__header`: 列表头部
- `.c-list__body`: 列表主体
- `.c-list__footer`: 列表底部

### List.Item

- `.c-list-item`: 列表项容器
- `.c-list-item__content`: 列表项内容
- `.c-list-item__extra`: 列表项额外内容
- `.c-list-item__arrow`: 列表项箭头
- `.c-list-item--clickable`: 可点击状态
- `.c-list-item--disabled`: 禁用状态

## 注意事项

1. 列表项默认带有底部边框，最后一项会自动去除边框
2. 可以将 List 和其他组件（如 SelectCard）结合使用
3. 禁用状态下不会触发点击事件
