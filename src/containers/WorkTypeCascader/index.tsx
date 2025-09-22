import React, { useState, useEffect, useMemo } from 'react'
import cls from 'classnames'
import CCascader from '../../components/CCascader'
import type { CascaderOption } from 'antd-mobile/es/components/cascader-view/cascader-view'
import type { CCascaderProps } from '../../components/CCascader'
import type { IGroupWorkType } from '../../types/workRecord'
import { workRecordApi } from '../../services/workRecord'
import './styles.scss'

interface WorkTypeCascaderProps extends Omit<CCascaderProps, 'options'> {
  baseId: number
  title?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

const WorkTypeCascader: React.FC<WorkTypeCascaderProps> = ({
  value,
  baseId,
  title = '选择工种',
  disabled = false,
  onChange,
  onCancel,
  onClose,
  className,
  style,
  ...rest
}) => {
  // 工种组数据
  const [workTypeGroups, setWorkTypeGroups] = useState<IGroupWorkType[]>([])
  
  // 获取工种组数据
  const fetchWorkTypeGroups = React.useCallback(async () => {
    const res = await workRecordApi.getWorkTypeList(baseId)
    setWorkTypeGroups(res.data || [])
  }, [baseId])
  
  // 当baseId变化时获取数据，或者使用测试数据
  useEffect(() => {
    if (baseId) {
      // 否则从API获取数据
      fetchWorkTypeGroups()
    }
  }, [baseId, fetchWorkTypeGroups])

  // 将工种组数据转换为级联选择器选项
  const cascaderOptions = useMemo(() => {
    if (!workTypeGroups.length) return []
    
    // 递归构建级联选项
    const buildOptions = (groups: IGroupWorkType[]): CascaderOption[] => {
      return groups.map(group => {
        const option: CascaderOption = {
          label: group.name,
          value: `group_${group.id}`,
        }
        
        const hasChildren = group.children && group.children.length > 0;
        const hasWorkTypes = group.workTypes && group.workTypes.length > 0;
        
        // 添加子组
        if (hasChildren) {
          option.children = buildOptions(group.children as IGroupWorkType[])
        }
        
        // 添加工种作为叶子节点
        if (hasWorkTypes) {
          const workTypeOptions = group.workTypes.map(workType => ({
            label: workType.name,
            value: `workType_${workType.id}`,
            // 存储完整的工种数据以便后续使用
            data: workType
          }))
          
          // 如果已有子组，则合并工种选项
          if (option.children) {
            option.children = [...option.children, ...workTypeOptions]
          } else {
            option.children = workTypeOptions
          }
        }
        
        // 如果是叶子节点（没有子节点）且没有工种，则禁用该选项
        if (!hasChildren && !hasWorkTypes) {
          option.disabled = true
        }
        
        return option
      })
    }
    
    return buildOptions(workTypeGroups)
  }, [workTypeGroups])


  return (
    <div className={cls('work-type-cascader', className)} style={style}>
      <CCascader
        options={cascaderOptions}
        value={value}
        onChange={onChange}
        title={title}
        disabled={disabled}
        onCancel={onCancel}
        onClose={onClose}
        className="work-type-cascader-inner"
        {...rest}
      />
    </div>
  )
}

export default WorkTypeCascader