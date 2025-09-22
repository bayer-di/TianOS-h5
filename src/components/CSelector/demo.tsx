import React, { useState } from 'react'
import CSelector from './index'
import { Space, Button } from 'antd-mobile'

const CSelectorDemo = () => {
  const [singleValue, setSingleValue] = useState<string>('2')
  const [multipleValue, setMultipleValue] = useState<string[]>(['1', '3'])

  const options = [
    { label: '果园观光项目经理', value: '1' },
    { label: '水果保鲜技术研究员', value: '2' },
    { label: '水果分选包装主管', value: '3' },
    { label: '水果深加工工程师', value: '4' },
    { label: '果园主管', value: '5' },
    { label: '水果质检员', value: '6' },
    { label: '采后处理技术员', value: '7' },
    { label: '水果电商运营专员', value: '8' },
  ]

  const handleSingleChange = (value: string | number) => {
    console.log('单选值变化:', value)
    setSingleValue(value as string)
  }

  const handleMultipleChange = (value: Array<string | number>) => {
    console.log('多选值变化:', value)
    setMultipleValue(value as string[])
  }

  const resetValues = () => {
    setSingleValue('2')
    setMultipleValue(['1', '3'])
  }

  return (
    <div style={{ padding: '16px' }}>
      <h3>基本用法（单选）</h3>
      <CSelector
        options={options}
        value={singleValue}
        placeholder="请选择职位"
        title="选择职位"
        onChange={handleSingleChange}
      />

      <h3 style={{ marginTop: '24px' }}>多选模式</h3>
      <CSelector
        multiple
        options={options}
        value={multipleValue}
        placeholder="请选择职位"
        title="选择职位"
        onChange={handleMultipleChange}
      />

      <h3 style={{ marginTop: '24px' }}>禁用状态</h3>
      <CSelector
        options={options}
        value={singleValue}
        disabled
        placeholder="请选择职位"
      />

      <div style={{ marginTop: '24px' }}>
        <Button color="primary" onClick={resetValues}>重置选择</Button>
      </div>
    </div>
  )
}

export default CSelectorDemo
