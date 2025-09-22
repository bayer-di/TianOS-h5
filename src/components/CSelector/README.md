# CSelector 组件

CSelector 是一个优化的弹出式选择器组件，提供单选和多选功能，专注于基本的选择交互。组件使用了多种性能优化技术，提供流畅的用户体验。

## 特性

- **灵活的选择模式**：支持单选和多选模式
- **优化的交互体验**：单选模式下选中即关闭，多选模式下需确认
- **自包含的交互逻辑**：组件内部处理弹出、选择和回显
- **灵活的状态管理**：支持受控和非受控两种使用模式
- **性能优化**：使用useMemo、useCallback和useMemoizedFn优化渲染性能
- **与组件集成**：利用CPopup提供统一的弹出层体验，结合SelectCard和List组件展示选项
- **响应式设计**：适配不同屏幕尺寸和设备
- **组件复用**：充分利用已有组件，提高代码复用性和一致性

## 使用方法

### 基本使用（单选）

```jsx
import CSelector from '@/components/CSelector'

const Demo = () => {
  const jobTypeOptions = [
    { label: '种植', value: '1' },
    { label: '采摘', value: '2' },
    { label: '施肥', value: '3' }
  ]
  
  const handleJobTypeChange = (value, option) => {
    console.log('选中的值:', value)
    console.log('选中的选项:', option)
  }
  
  return (
    <CSelector
      options={jobTypeOptions}
      placeholder="请选择工种"
      title="选择工种"
      onChange={handleJobTypeChange}
    />
  )
}
```

### 多选模式

```jsx
import CSelector from '@/components/CSelector'

const Demo = () => {
  const personnelOptions = [
    { label: '张三', value: '1' },
    { label: '李四', value: '2' },
    { label: '王五', value: '3' }
  ]
  
  return (
    <CSelector
      multiple
      options={personnelOptions}
      title="选择人员"
      onChange={(values, options) => console.log('选中的人员:', options)}
    />
  )
}
```

### 受控模式

```jsx
import { useState } from 'react'
import CSelector from '@/components/CSelector'

const Demo = () => {
  const [selectedValue, setSelectedValue] = useState('1')
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ]
  
  return (
    <CSelector
      value={selectedValue}
      options={options}
      onChange={(value) => setSelectedValue(value)}
    />
  )
}
```

## 实现思路

1. **优化的组件结构**：
   - 使用CPopup作为弹出层基础，提供统一的用户体验
   - 结合SelectCard和List组件展示选项列表，提高代码复用性
   - 使用useMemo缓存计算结果，减少不必要的重新计算
   - 使用useCallback和useMemoizedFn优化事件处理函数

2. **状态管理**：
   - 使用ahooks的useControllableValue管理受控和非受控状态
   - 内部维护临时选中状态，多选模式下只有点击确认才会提交

3. **性能优化**：
   - 使用Map数据结构优化选项查找效率
   - 使用useMemo缓存选项列表渲染结果
   - 使用useMemoizedFn避免事件处理函数的不必要重新创建

4. **用户体验**：
   - 单选模式下选中即关闭，简化操作流程
   - 多选模式下提供临时状态预览，确认后才应用变更

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中的值（受控模式） | `string \| number \| Array<string \| number>` | - |
| defaultValue | 默认选中的值（非受控模式） | `string \| number \| Array<string \| number>` | - |
| options | 选项数据 | `Option[]` | `[]` |
| placeholder | 未选中时的占位文本 | `string` | `'请选择'` |
| disabled | 是否禁用 | `boolean` | `false` |
| multiple | 是否支持多选 | `boolean` | `false` |
| showCheckMark | 是否显示选中标记 | `boolean` | `true` |
| title | 弹出层标题 | `string` | - |
| confirmText | 确认按钮文本（多选模式下） | `string` | `'确定'` |
| onChange | 选择变更的回调函数 | `(value, option) => void` | - |
| onCancel | 取消选择的回调函数 | `() => void` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### Option 类型

```typescript
interface Option {
  label: string       // 选项显示文本
  value: string | number  // 选项值
  disabled?: boolean  // 是否禁用
}
```

## 性能优化与组件集成

CSelector组件使用了多种性能优化技术，并与其他组件进行了集成：

### 性能优化

1. **useMemo**：缓存选项映射和计算结果，避免不必要的重新计算
2. **useCallback**：优化函数引用稳定性，减少子组件的不必要重渲染
3. **useMemoizedFn**：使用ahooks提供的函数记忆化工具，进一步优化事件处理函数
4. **Map数据结构**：使用Map代替对象进行选项查找，提高查找效率
5. **条件渲染优化**：使用useMemo缓存条件渲染的结果，减少重渲染

### 组件集成

1. **CPopup集成**：使用CPopup组件作为弹出层，统一弹出层体验
2. **SelectCard集成**：使用SelectCard组件展示每个选项，提供统一的选中效果
3. **List集成**：使用List组件作为选项列表容器，提供统一的列表体验

这种组件集成方式有以下优势：
- **一致性**：保持整个应用的UI和交互一致性
- **可维护性**：各组件职责清晰，便于维护和更新
- **复用性**：充分利用已有组件，减少重复代码