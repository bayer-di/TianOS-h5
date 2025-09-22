import React, { useState } from 'react'
import List from './index'
import { RightOutline, CheckOutline } from 'antd-mobile-icons'
import SelectCard from '../SelectCard'

const ListDemo = () => {
  const [selectedItem, setSelectedItem] = useState<string>('2')

  const items = [
    { id: '1', name: '苹果', desc: '红富士' },
    { id: '2', name: '香蕉', desc: '进口' },
    { id: '3', name: '橙子', desc: '赣南脐橙' },
    { id: '4', name: '葡萄', desc: '巨峰葡萄' },
  ]

  const handleItemClick = (id: string) => {
    console.log('点击了项目:', id)
  }

  const handleSelect = (id: string) => {
    setSelectedItem(id)
  }

  return (
    <div style={{ padding: '16px' }}>
      <h3>基础列表</h3>
      <List header="基础用法">
        <List.Item>普通列表项</List.Item>
        <List.Item extra="附加信息">带有额外信息</List.Item>
        <List.Item arrow={true}>带箭头的列表项</List.Item>
        <List.Item disabled>禁用状态的列表项</List.Item>
      </List>

      <h3 style={{ marginTop: '24px' }}>可点击列表</h3>
      <List header="水果列表">
        {items.map(item => (
          <List.Item
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            extra={item.desc}
            arrow={true}
          >
            {item.name}
          </List.Item>
        ))}
      </List>

      <h3 style={{ marginTop: '24px' }}>与SelectCard结合</h3>
      <List header="选择水果">
        {items.map(item => (
          <SelectCard
            key={item.id}
            label={item.name}
            value={item.id}
            selected={selectedItem === item.id}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </List>

      <h3 style={{ marginTop: '24px' }}>自定义列表</h3>
      <List 
        header="自定义列表头部" 
        footer="这里是列表底部信息"
      >
        {items.map(item => (
          <List.Item
            key={item.id}
            onClick={() => handleSelect(item.id)}
            extra={
              selectedItem === item.id ? (
                <CheckOutline style={{ color: '#1677ff' }} />
              ) : (
                <RightOutline />
              )
            }
          >
            <div>
              <div style={{ fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{item.desc}</div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  )
}

export default ListDemo
