import React, { useEffect } from 'react'
import { 
  Form
} from 'antd-mobile'
import CForm from '@/components/CForm'
import Field from '@/components/Field'
import CInput from '@/components/CInput'
import CCascader from '@/components/CCascader'
import CSelector from '@/components/CSelector'
import CTextArea from '@/components/CTextArea'
import PageContainer from '@/components/PageContainer'
import DateRangePicker from '@/components/DateRangePicker'
import WorkTypeCascader from '@/containers/WorkTypeCascader'
import { useEmployeeStore } from '@/stores'
import { useWorkRecordStore } from '@/stores/workRecordStore'
import { useNavigate, useLocation } from 'react-router-dom'
import type { IBlockLevel, WorkRecordForm } from '@/types/workRecord'
import type { CascaderOption } from 'antd-mobile/es/components/cascader-view/cascader-view'

const WorkRecordEntry: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 从URL获取baseId参数
  const getBaseIdFromUrl = () => {
    const params = new URLSearchParams(location.search)
    const baseId = params.get('baseId')
    return Number(baseId)
  }
  
  const baseId = getBaseIdFromUrl()
  
  const { selectedEmployees = [] } = useEmployeeStore()
  
  const { 
    zones, 
    areaMap, 
    categories, 
    isSubmitting,
    formData,
    workTypesMap,
    fetchZones, 
    fetchAreaMap, 
    fetchCategories, 
    updateFormData,
    saveWorkRecord,
    fetchWorkTypesAll,
  } = useWorkRecordStore()
  
  const [form] = Form.useForm()
  
  // 当前选中的工种数据
  const now = new Date().getTime()
  
  useEffect(() => {
    if (baseId) {
      Promise.all([
        fetchZones(baseId),
        fetchAreaMap(baseId),
        fetchCategories(baseId),
        fetchWorkTypesAll(baseId)
      ])
    }
  }, [baseId])
  
  // 监听表单字段变化，同步到store
  const handleFormValuesChange = (changedValues: Record<string, unknown>) => {
    const filteredChanges = { ...changedValues }

    if (Object.keys(filteredChanges).length > 0) {
      updateFormData(filteredChanges as Partial<WorkRecordForm>)
    }
  }
  
  // 当组件加载或selectedEmployees变化时，更新表单字段
  useEffect(() => {
    const employeeIds = selectedEmployees.map(emp => Number(emp.id))
    form.setFieldValue('employeeIds', employeeIds)
  }, [selectedEmployees])
  
  // 从store中恢复表单数据
  useEffect(() => {
    form.setFieldsValue(formData)
  }, [formData])
  
  const blockOptions = React.useMemo(() => {
    // 递归转换函数，保留树形结构
    const convertToOptions = (items: IBlockLevel[]): CascaderOption[] => {
      return items.map(item => ({
        label: item.name,
        value: item.id.toString(),
        children: item.children && item.children.length > 0 ? convertToOptions(item.children) : undefined
      }))
    }
    
    return convertToOptions(zones)
  }, [zones])

  const categoryOptions = React.useMemo(() => {
    return categories.map(category => ({
      label: category.name,
      value: category.id.toString(),
    }))
  }, [categories])
  
  const handleBlockChange = () => {
    // 清空种植区域
    form.setFieldValue('areaId', undefined)
  }

  const handleWorkTypeChange = () => {
    // 清空计件工作量
    form.setFieldValue('pieceCount', undefined)
  }
  
  // 处理表单提交
  const handleSubmit = async () => {
    const res = await form.validateFields()
    const { workTime = [], workTypeId = [], ...rest } = res
    const formData = {
      ...rest,
      baseId,
      employeeIds: selectedEmployees.map(emp => Number(emp.id)),
      startTime: workTime?.[0],
      endTime: workTime?.[1],
      workTypeId: workTypeId
        .filter((v: string) => v.includes('workType_'))
        .map((v: string) => Number(v.split('_')[1]))?.[0],
      zoneId: Number(res.zoneId[res.zoneId.length - 1]),
    }

    await saveWorkRecord(formData).then(() => {
      // 提交成功后清空表单数据
      form.resetFields()
      // 清空已选择的人员
      useEmployeeStore.getState().clearSelectedEmployees()
      // 重置workRecordStore中的表单数据
      useWorkRecordStore.getState().resetForm()
    })
  }

  return (
    <div className="page-work-record-entry">
      <PageContainer
        title="作业记录录入"
        showBack={false}
        showSubmit={true}
        submitText={isSubmitting ? "提交中..." : "提交"}
        onSubmit={handleSubmit}
        // submitDisabled={isSubmitting || loading}
      >
        <CForm
          form={form}
          layout="vertical"
          className="work-record-form"
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            className="required-field"
            name="employeeIds"
            label="人员"
            rules={[{ 
              required: true, 
              message: '请选择人员',
              // 使用自定义校验器，如果selectedEmployees有值，则通过验证
              validator: () => {
                return selectedEmployees.length > 0 
                  ? Promise.resolve() 
                  : Promise.reject(new Error('请选择人员'));
              }
            }]}
          >
            <div className="personnel-field-container" onClick={() => navigate(`/employ-select?baseId=${baseId}`)}>
              <Field
                value={selectedEmployees.length > 0 ? 
                  selectedEmployees.map(emp => `${emp.employeeNo}-${emp.name}`).join('、') : 
                  undefined
                }
                placeholder="请选择"
              />
            </div>
          </Form.Item>
          
          <Form.Item 
            className="required-field"
            name="workTypeId" 
            label="工种" 
            rules={[{ required: true, message: '请选择工种' }]}
          >
            <WorkTypeCascader 
              title="选择工种"
              baseId={baseId} 
              onChange={handleWorkTypeChange}
            />
          </Form.Item>
          
          <Form.Item 
            className="required-field"
            name="zoneId" 
            label="所属区块" 
            rules={[{ required: true, message: '请选择所属区块' }]}
          >
            <CCascader
              title="选择所属区块"
              showConfirmButton
              options={blockOptions}
              onChange={handleBlockChange}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item noStyle dependencies={['zoneId']}>
            {({ getFieldValue }) => {
              const currentZoneIdArr = getFieldValue('zoneId') || []
              const currentZoneId = currentZoneIdArr[currentZoneIdArr.length - 1]
              
              // 获取当前区块对应的种植区域选项
              let currentAreaOptions: { label: string; value: string }[] = []
              
              if (currentZoneId && areaMap) {
                // 从areaMap中获取当前区块的种植区域
                const areas = areaMap[currentZoneId] || []
                currentAreaOptions = areas.map(area => ({
                  label: area.name,
                  value: area.id.toString()
                }))
              }
              return (
                <Form.Item 
                  name="areaId" 
                  label="种植区域"
                >
                  <CSelector
                    clearable
                    title="选择种植区域"
                    disabled={!currentZoneId || currentAreaOptions.length === 0}
                    options={currentAreaOptions}
                    placeholder={
                      currentZoneId 
                        ? (currentAreaOptions.length > 0 ? '请选择' : '当前区块无种植区域') 
                        : '请选择'
                    }
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
          
          <Form.Item 
            name="categoryId" 
            label="品种"
          >
            <CSelector
              title="选择品种"
              options={categoryOptions}
              placeholder="请选择"
              clearable
            />
          </Form.Item>

          <Form.Item noStyle dependencies={['workTypeId']}>
            {({ getFieldValue }) => {
              const currentWorkTypeArr = getFieldValue('workTypeId') || []
              const currentWorkTypeId = Number(currentWorkTypeArr[currentWorkTypeArr.length - 1]?.split('_')[1])
              if (currentWorkTypeId && workTypesMap[currentWorkTypeId]) {
                return (
                  <Form.Item 
                    name="pieceCount" 
                    label="计件工作量"
                  >
                    <CInput 
                      placeholder="请输入" 
                      min={0}
                      type="number"
                      className="work-amount-input" 
                      addonAfter={workTypesMap[currentWorkTypeId].pieceUnitName} 
                    />
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>
          <Form.Item 
            name="workTimeHour" 
            label="计时工作量"
            rules={[
              { 
                pattern: /^[0-9]*(\.[0-9]{1,2})?$/, 
                message: '计时工作量最多两位小数' 
              }
            ]}
          >
            <CInput 
              placeholder="请输入" 
              type="number" 
              className="work-amount-input" 
              addonAfter="小时" 
              min={0}
            />
          </Form.Item>
          
          <Form.Item 
            name="workTime" 
            label="工作时间"
            // initialValue={[now, now]}
          >
            <DateRangePicker 
              defaultValue={[now, now]}
              title="工作时间"
              clearable 
              // onChange={handleWorkTimeChange}
              precision="second"
            />
          </Form.Item>
          
          <Form.Item 
            name="remark" 
            label="备注"
          >
            <CTextArea 
              placeholder="请输入" 
              maxLength={100}
              rows={2}
              // showCount
              className="remarks-textarea"
            />
          </Form.Item>
        </CForm>
      </PageContainer>
    </div>
  )
}

export default WorkRecordEntry