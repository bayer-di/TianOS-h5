import React, { useState } from 'react'
import { Space } from 'antd-mobile'
import { PageContainer } from '../components/UI'
import WorkTypeCascader from '../containers/WorkTypeCascader'
import TripleLayout from '../layouts/TripleLayout'
import DateRangePicker from '../components/DateRangePicker'
import CCascader from '../components/CCascader'
import CButton from '../components/CButton'
import type { CascaderValue, CascaderValueExtend } from 'antd-mobile/es/components/cascader-view/cascader-view'

const UiDemo: React.FC = () => {
  const [selectedWorkType, setSelectedWorkType] = useState<string[]>([])
  const [contentHeight, setContentHeight] = useState<'small' | 'medium' | 'large'>('medium')
  const [dateRange, setDateRange] = useState<[number, number]>([
    new Date(2025, 8, 11, 9, 10, 46).getTime(),
    new Date(2025, 8, 11, 17, 20, 20).getTime()
  ])
  const [precision, setPrecision] = useState<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'>('second')
  const [cascaderValue, setCascaderValue] = useState<string[]>([])
  
  // 级联选择器示例数据
  const cascaderOptions = [
    {
      label: '农作物区',
      value: 'crops',
      children: [
        {
          label: '水稻种植区',
          value: 'rice',
        },
        {
          label: '小麦种植区',
          value: 'wheat',
        },
        {
          label: '玉米种植区',
          value: 'corn',
        }
      ]
    },
    {
      label: '果园区',
      value: 'fruits',
      children: [
        {
          label: '苹果园',
          value: 'apple',
        },
        {
          label: '柑橘园',
          value: 'citrus',
        },
        {
          label: '葡萄园',
          value: 'grape',
        }
      ]
    },
    {
      label: '实验区',
      value: 'experiment',
      children: [
        {
          label: '土壤改良试验区',
          value: 'soil',
        },
        {
          label: '水肥一体化示范区',
          value: 'water',
        }
      ]
    }
  ]

  // 处理工种选择
  const handleWorkTypeChange = (values: CascaderValue[], extend: CascaderValueExtend) => {
    setSelectedWorkType(values as string[])
    console.log('选中工种:', values, extend)
  }
  
  // 处理级联选择器选择
  const handleCascaderChange = (values: CascaderValue[], extend: CascaderValueExtend) => {
    setCascaderValue(values as string[])
    console.log('选中区域:', values, extend)
  }

  // 根据内容高度设置不同的样式
  const getContentStyle = () => {
    switch (contentHeight) {
      case 'small':
        return { height: '100px' }
      case 'medium':
        return { height: '300px' }
      case 'large':
        return { height: '800px' }
      default:
        return {}
    }
  }

  // 切换内容高度
  const toggleContentHeight = () => {
    const heights: ['small', 'medium', 'large'] = ['small', 'medium', 'large']
    const currentIndex = heights.indexOf(contentHeight)
    const nextIndex = (currentIndex + 1) % heights.length
    setContentHeight(heights[nextIndex])
  }

  // 已移除不需要的代码

  // 演示用的头部
  const demoHeader = (
    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
      <h3>头部区域</h3>
    </div>
  )

  // 演示用的底部
  const demoFooter = (
    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
      <h3>底部区域</h3>
    </div>
  )

  return (
    <PageContainer title="UI组件演示">
      <div className="demo-section">
        <h2>工种选择器</h2>
        <div className="demo-item">
          <div style={{ marginBottom: '16px' }}>
            <Space align="center" wrap>
              <span>工种选择器示例</span>
            </Space>
          </div>
          
          <WorkTypeCascader
            baseId={1} // 假设基地ID为1
            value={selectedWorkType}
            onChange={handleWorkTypeChange}
          />
        </div>
        {selectedWorkType && selectedWorkType.length > 0 && (
          <div className="demo-result">
            <h3>选中结果</h3>
            <p>选中值: {selectedWorkType.join(', ')}</p>
          </div>
        )}
        <Space className="demo-actions">
          <CButton
            color="primary"
            fill="outline"
            onClick={() => setSelectedWorkType([])}
          >
            清除选择
          </CButton>
        </Space>
      </div>

      <div className="demo-section">
        <h2>日期范围选择器</h2>
        <div className="demo-item">
          <div style={{ marginBottom: '16px' }}>
            <Space align="center" wrap>
              <span>精度选择:</span>
              <CButton 
                size="small" 
                color={precision === 'year' ? 'primary' : 'default'}
                onClick={() => setPrecision('year')}
              >
                年
              </CButton>
              <CButton 
                size="small" 
                color={precision === 'month' ? 'primary' : 'default'}
                onClick={() => setPrecision('month')}
              >
                月
              </CButton>
              <CButton 
                size="small" 
                color={precision === 'day' ? 'primary' : 'default'}
                onClick={() => setPrecision('day')}
              >
                日
              </CButton>
              <CButton 
                size="small" 
                color={precision === 'hour' ? 'primary' : 'default'}
                onClick={() => setPrecision('hour')}
              >
                时
              </CButton>
              <CButton 
                size="small" 
                color={precision === 'minute' ? 'primary' : 'default'}
                onClick={() => setPrecision('minute')}
              >
                分
              </CButton>
              <CButton 
                size="small" 
                color={precision === 'second' ? 'primary' : 'default'}
                onClick={() => setPrecision('second')}
              >
                秒
              </CButton>
            </Space>
          </div>
          
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            precision={precision}
            clearable
          />
        </div>
        {dateRange && (
          <div className="demo-result">
            <h3>选中结果</h3>
            <p>开始时间: {new Date(dateRange[0]).toLocaleString()}</p>
            <p>结束时间: {new Date(dateRange[1]).toLocaleString()}</p>
            <p>时间差: {Math.round((dateRange[1] - dateRange[0]) / (1000 * 60))} 分钟</p>
          </div>
        )}
        <Space className="demo-actions">
          <CButton
            color="primary"
            fill="outline"
            onClick={() => setDateRange([
              new Date(2025, 8, 11, 9, 0, 0).getTime(),
              new Date(2025, 8, 11, 18, 0, 0).getTime()
            ])}
          >
            重置时间
          </CButton>
        </Space>
      </div>

      <div className="demo-section">
        <h2>三栏布局</h2>
        <div className="demo-item">
          <div style={{ marginBottom: '16px' }}>
            <CButton 
              color="primary" 
              onClick={toggleContentHeight}
            >
              切换内容高度 (当前: {contentHeight})
            </CButton>
          </div>
          
          <div style={{ border: '1px solid #ddd', height: '500px', overflow: 'hidden' }}>
            <TripleLayout
              header={demoHeader}
              footer={demoFooter}
            >
              <div 
                style={{ 
                  padding: '20px', 
                  backgroundColor: '#fff', 
                  ...getContentStyle() 
                }}
              >
                <h4>内容区域 ({contentHeight})</h4>
                <p>这是中间内容区域，会自动填充剩余空间并在内容超出时滚动。</p>
                <div style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
                <div style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
                <div style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
                <div style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
                <div style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
              </div>
            </TripleLayout>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>级联选择器</h2>
        <div className="demo-item">
          <div style={{ marginBottom: '16px' }}>
            <Space align="center" wrap>
              <span>级联选择器示例</span>
            </Space>
          </div>
          
          <CCascader
            options={cascaderOptions}
            value={cascaderValue}
            onChange={handleCascaderChange}
            placeholder="请选择区域"
            title="选择所属区块"
            clearable
            showConfirmButton
          />
        </div>
        {cascaderValue && cascaderValue.length > 0 && (
          <div className="demo-result">
            <h3>选中结果</h3>
            <p>选中值: {cascaderValue.join(', ')}</p>
          </div>
        )}
        <Space className="demo-actions">
          <CButton
            color="primary"
            onClick={() => setCascaderValue([])}
          >
            清除选择
          </CButton>
        </Space>
      </div>
      
      <div className="demo-section">
        <h2>按钮组件</h2>
        <div className="demo-item">
          <h3>按钮类型</h3>
          <Space wrap>
            <CButton color="default">默认按钮</CButton>
            <CButton color="primary">主要按钮</CButton>
            <CButton color="success">成功按钮</CButton>
            <CButton color="warning">警告按钮</CButton>
            <CButton color="danger">危险按钮</CButton>
          </Space>
          
          <h3 style={{ marginTop: '16px' }}>按钮尺寸</h3>
          <Space wrap>
            <CButton color="primary" size="small">小按钮</CButton>
            <CButton color="primary" size="middle">中按钮</CButton>
            <CButton color="primary" size="large">大按钮</CButton>
          </Space>
          
          <h3 style={{ marginTop: '16px' }}>特殊样式</h3>
          <Space wrap>
            <CButton color="primary" round>圆角按钮</CButton>
            <CButton color="primary" ghost>幽灵按钮</CButton>
            <CButton color="primary" disabled>禁用按钮</CButton>
          </Space>
          
          <h3 style={{ marginTop: '16px' }}>块级按钮</h3>
          <div style={{ width: '100%', marginBottom: '8px' }}>
            <CButton color="primary" block>块级主要按钮</CButton>
          </div>
          <div style={{ width: '100%' }}>
            <CButton color="default" block>块级默认按钮</CButton>
          </div>
        </div>
      </div>

    </PageContainer>
  )
}

export default UiDemo