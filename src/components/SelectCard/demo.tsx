import { useState } from 'react'
import SelectCard from './index'
import { HeartFill } from 'antd-mobile-icons'

const SelectCardDemo = () => {
  const [selectedItem, setSelectedItem] = useState<string>('2')

  const items = [
    { label: '果园观光项目经理', value: '1' },
    { label: '水果保鲜技术研究员', value: '2' },
    { label: '水果分选包装主管', value: '3' },
    { label: '水果深加工工程师', value: '4' },
    { label: '果园主管', value: '5' },
  ]

  const handleSelect = (value: string) => {
    setSelectedItem(value)
  }

  return (
    <div style={{ padding: '16px' }}>
      <h3>基础用法</h3>
      <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
        {items.map(item => (
          <SelectCard
            key={item.value}
            label={item.label}
            value={item.value}
            selected={selectedItem === item.value}
            onClick={() => handleSelect(item.value as string)}
          />
        ))}
      </div>

      <h3 style={{ marginTop: '24px' }}>自定义图标</h3>
      <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
        <SelectCard
          label="自定义图标示例"
          selected={true}
          icon={<HeartFill style={{ color: '#ff4d4f' }} />}
        />
      </div>

      <h3 style={{ marginTop: '24px' }}>禁用状态</h3>
      <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
        <SelectCard
          label="禁用状态示例"
          disabled={true}
        />
      </div>
    </div>
  )
}

export default SelectCardDemo
