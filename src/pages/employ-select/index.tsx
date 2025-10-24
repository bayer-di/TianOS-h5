import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CIcon } from '@/components/CIcon'
import { SearchBar, Tabs, List } from 'antd-mobile'
import { ClockIn } from '@/types/employee'
import { employeeApi } from '@/services/employee' // 直接使用API
import PageContainer from '@/components/PageContainer'
import { useUrlParams, defaultConverters } from '@/utils/location'
import { useI18n } from '@/hooks/useI18n'
import useEmployeeSelection from '@/hooks/useEmployeeSelection' // 使用新hook
import { asyncFetch } from '@/utils/common'
import type { IPosition, IEmployeeFilter } from '@/types/employee'
import type { IEmployee } from '@/hooks/useEmployeeSelection'

const EmploySelect: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  
  // 页面本地状态
  const [positions, setPositions] = useState<IPosition[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [currentPositionId, setCurrentPositionId] = useState<number>(0)
  const [filter, setFilter] = useState<Partial<IEmployeeFilter>>({
    clockIn: ClockIn.ALL,
    keywords: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 使用自定义hook管理选择状态
  const { 
    selectedEmployees, 
    isEmployeeSelected,
    toggleEmployeeSelection, 
    selectAllEmployees, 
    unselectAllEmployees, 
    saveSelectedEmployees
  } = useEmployeeSelection()

  const { baseId } = useUrlParams({
    baseId: { defaultValue: 0, converter: defaultConverters.number }
  })
  
  // 获取职位列表
  const fetchPositions = async (baseId: number) => {
    await asyncFetch(() => employeeApi.getPositionList(baseId), {
      onSuccess: (res: unknown) => {
        const response = res as { data?: IPosition[] }
        if (response?.data) {
          setPositions(response.data)
          if (response.data.length > 0) {
            setCurrentPositionId(response.data[0].id)
          }
        }
      }
    })
  }
  
  // 获取员工列表
  const fetchEmployees = React.useCallback(async () => {
    if (!currentPositionId) return
    
    setIsLoading(true)
    await asyncFetch(() => employeeApi.getEmployeeList({
      ...filter,
      clockIn: filter.clockIn === ClockIn.ALL ? undefined : filter.clockIn,
      positionId: currentPositionId,
      baseId: baseId as number,
    }), {
      onSuccess: (res: unknown) => {
        const response = res as { data?: IEmployee[] }
        if (response?.data) {
          setEmployees(response.data)
        }
      },
      onFinish: () => {
        setIsLoading(false)
      }
    })
  }, [filter, currentPositionId, baseId])
  
  // 组件加载时获取职位列表
  useEffect(() => {
    if (baseId) {
      fetchPositions(baseId as number)
      setFilter(prev => ({ ...prev, baseId: baseId as number }))
    }
  }, [baseId])
  
  // 监听筛选条件和职位变化，获取员工列表
  useEffect(() => {
    if (currentPositionId) {
      fetchEmployees()
    }
  }, [filter, currentPositionId, fetchEmployees])
  
  // 处理筛选条件变更
  const handleFilterChange = (newFilter: Partial<IEmployeeFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
  }
  
  // 处理职位选择变更
  const handlePositionChange = (positionId: number) => {
    setCurrentPositionId(positionId)
  }
  
  // 处理确认选择
  const handleConfirm = () => {
    // 保存选中员工到sessionStorage
    saveSelectedEmployees()
    // 跳转回作业记录录入页面
    navigate(`/work-record-entry?baseId=${baseId}`)
  }
  
  // 处理返回
  const handleBack = () => {
    navigate(-1)
  }
  
  return (
    <div className="page-employ-select">
      <PageContainer
        title={t('pages.employSelect.title')}
        showBack={true}
        onBack={handleBack}
        showSubmit={true}
        onSubmit={handleConfirm}
        submitText={`${t('common.confirm')}${selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : ''}`}
        submitDisabled={selectedEmployees.length === 0}
      >
        <div className="employ-select-container">
          {/* 搜索框 */}
          <div className="search-bar-wrapper">
            <SearchBar
              placeholder={t('pages.employSelect.searchPlaceholder')}
              value={filter.keywords}
              onChange={(value) => handleFilterChange({ keywords: value })}
            />
          </div>
          
          {/* 主体内容区 */}
          <div className="employ-select-content">
            {/* 左侧职位列表 */}
            <div className="position-list">
              <List>
                {positions.map(position => (
                  <List.Item
                    key={position.id}
                    arrowIcon={false}
                    onClick={() => handlePositionChange(position.id)}
                    className={currentPositionId === position.id ? 'active-position' : ''}
                  >
                    {position.name}
                  </List.Item>
                ))}
              </List>
            </div>
            
            {/* 右侧员工列表区域 */}
            <div className="employee-list-container">
              <div className="employee-tabs">
                <Tabs
                  activeKey={filter.clockIn?.toString()}
                  onChange={key => handleFilterChange({ clockIn: parseInt(key) as ClockIn })}
                >
                  <Tabs.Tab title={t('pages.employSelect.tabs.all')} key={ClockIn.ALL.toString()} />
                  <Tabs.Tab title={t('pages.employSelect.tabs.clockedIn')} key={ClockIn.YES.toString()} />
                  <Tabs.Tab title={t('pages.employSelect.tabs.notClockedIn')} key={ClockIn.NO.toString()} />
                </Tabs>
              </div>
              
              <div className="employee-list">
                {isLoading ? (
                  <div className="loading-container">{t('common.loading')}</div>
                ) : (
                  <List>
                    {employees.map(employee => (
                      <List.Item
                        className={isEmployeeSelected(employee.id) ? 'active-employee' : ''}
                        arrowIcon={false}
                        key={employee.id}
                        onClick={() => toggleEmployeeSelection(employee)}
                        extra={
                          isEmployeeSelected(employee.id) && (
                            <CIcon type="Global_15" color="#1856AC" size={20} />
                          )
                        }
                      >
                        {`${employee.employeeNo} — ${employee.name}`}
                      </List.Item>
                    ))}
                  </List>
                )}
              </div>
              
              <div className="select-actions">
                <span className="action-text" onClick={() => unselectAllEmployees(employees)}>
                  {t('pages.employSelect.actions.unselectAll')}
                </span>
                <span className="action-text" onClick={() => selectAllEmployees(employees)}>
                  {t('pages.employSelect.actions.selectAll')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default EmploySelect