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
import { useI18n } from '@/hooks/useI18n'
import { useEmployeeStore } from '@/stores'
import { useNavigate } from 'react-router-dom'
import { useWorkRecordStore } from '@/stores/workRecordStore'
import { useUrlParams, defaultConverters } from '@/utils/location'
import type { IBlockLevel, WorkRecordForm } from '@/types/workRecord'
import type { CascaderOption } from 'antd-mobile/es/components/cascader-view/cascader-view'

const WorkRecordEntry: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  
  const { baseId } = useUrlParams({
    baseId: { defaultValue: 0, converter: defaultConverters.number }
  })
  
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
        fetchZones(baseId as number),
        fetchAreaMap(baseId as number),
        fetchCategories(baseId as number),
        fetchWorkTypesAll(baseId as number)
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
        title={t('pages.workRecordEntry.title')}
        showBack={false}
        showSubmit={true}
        submitLoading={isSubmitting}
        submitText={t('common.submit')}
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
            label={t('pages.workRecordEntry.fields.personnel')}
            rules={[{ 
              required: true, 
              message: t('pages.workRecordEntry.messages.selectPersonnel'),
              // 使用自定义校验器，如果selectedEmployees有值，则通过验证
              validator: () => {
                return selectedEmployees.length > 0 
                  ? Promise.resolve() 
                  : Promise.reject(new Error(t('pages.workRecordEntry.messages.selectPersonnel')));
              }
            }]}
          >
            <div className="personnel-field-container" onClick={() => navigate(`/employ-select?baseId=${baseId}`)}>
              <Field
                value={selectedEmployees.length > 0 ? 
                  selectedEmployees.map(emp => `${emp.employeeNo}-${emp.name}`).join('、') : 
                  undefined
                }
                placeholder={t('common.selectPlaceholder')}
              />
            </div>
          </Form.Item>
          
          <Form.Item 
            className="required-field"
            name="workTypeId" 
            label={t('pages.workRecordEntry.fields.workType')} 
            rules={[{ required: true, message: t('pages.workRecordEntry.messages.selectWorkType') }]}
          >
            <WorkTypeCascader 
              title={t('pages.workRecordEntry.placeholders.selectWorkType')}
              baseId={baseId as number} 
              onChange={handleWorkTypeChange}
            />
          </Form.Item>
          
          <Form.Item 
            className="required-field"
            name="zoneId" 
            label={t('pages.workRecordEntry.fields.zone')} 
            rules={[{ required: true, message: t('pages.workRecordEntry.messages.selectZone') }]}
          >
            <CCascader
              title={t('pages.workRecordEntry.placeholders.selectZone')}
              showConfirmButton
              options={blockOptions}
              onChange={handleBlockChange}
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
                  label={t('pages.workRecordEntry.fields.area')}
                >
                  <CSelector
                    clearable
                    title={t('pages.workRecordEntry.placeholders.selectArea')}
                    disabled={!currentZoneId || currentAreaOptions.length === 0}
                    options={currentAreaOptions}
                    placeholder={
                      currentZoneId 
                        ? (currentAreaOptions.length > 0 ? t('common.selectPlaceholder') : t('pages.workRecordEntry.messages.noAreaInZone')) 
                        : t('common.selectPlaceholder')
                    }
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
          
          <Form.Item 
            name="categoryId" 
            label={t('pages.workRecordEntry.fields.category')}
          >
            <CSelector
              title={t('pages.workRecordEntry.placeholders.selectCategory')}
              options={categoryOptions}
              // placeholder={t('pages.workRecordEntry.placeholders.selectCategory')}
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
                    label={t('pages.workRecordEntry.fields.pieceWork')}
                  >
                    <CInput 
                      // placeholder={t('pages.workRecordEntry.placeholders.enterPieceWork')} 
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
            label={t('pages.workRecordEntry.fields.timeWork')}
            rules={[
              { 
                pattern: /^[0-9]*(\.[0-9]{1,2})?$/, 
                message: t('pages.workRecordEntry.messages.workTimeDecimal') 
              }
            ]}
          >
            <CInput 
              placeholder={t('pages.workRecordEntry.placeholders.enterTimeWork')} 
              type="number" 
              className="work-amount-input" 
              addonAfter={t('common.hour')}
              min={0}
            />
          </Form.Item>
          
          <Form.Item 
            name="workTime" 
            label={t('pages.workRecordEntry.fields.workTime')}
            // initialValue={[now, now]}
          >
            <DateRangePicker 
              defaultValue={[now, now]}
              title={t('pages.workRecordEntry.fields.workTime')}
              clearable 
              // onChange={handleWorkTimeChange}
              precision="second"
            />
          </Form.Item>
          
          <Form.Item 
            name="remark" 
            label={t('pages.workRecordEntry.fields.remark')}
          >
            <CTextArea 
              placeholder={t('pages.workRecordEntry.placeholders.enterRemark')} 
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