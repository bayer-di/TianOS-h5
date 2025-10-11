import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CIcon } from '@/components/CIcon'
import { SearchBar, Tabs, List } from 'antd-mobile'
import { ClockIn } from '@/types/employee'
import { useEmployeeStore } from '@/stores'
import PageContainer from '@/components/PageContainer'
import { useUrlParams, defaultConverters } from '@/utils/location'
import { useI18n } from '@/hooks/useI18n'


const EmploySelect: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  
  const { baseId } = useUrlParams({
    baseId: { defaultValue: 0, converter: defaultConverters.number }
  })
  
  const {
    positions,
    employees,
    selectedEmployees,
    currentPositionId,
    filter,
    isLoading,
    setFilter,
    setCurrentPositionId,
    selectEmployee,
    unselectEmployee,
    selectAllEmployees,
    unselectAllEmployees,
    fetchPositions
  } = useEmployeeStore()
  
  // 组件加载时获取职位列表
  useEffect(() => {
    if (baseId) {
      fetchPositions(baseId as number)
      setFilter({ baseId: baseId as number })
    }
  }, [baseId, fetchPositions, setFilter])
  
  // 处理员工选择
  const handleEmployeeSelect = (employee: typeof employees[0]) => {
    const isAlreadySelected = selectedEmployees.some(emp => emp.id === employee.id)
    if (isAlreadySelected) {
      unselectEmployee(employee.id)
    } else {
      selectEmployee(employee)
    }
  }
  
  // 处理确认选择
  const handleConfirm = () => {
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
              onChange={(value) => setFilter({ ...filter, keywords: value })}
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
                    onClick={() => setCurrentPositionId(position.id)}
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
                  onChange={key => setFilter({ ...filter, clockIn: parseInt(key) as ClockIn })}
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
                        className={employee.isSelected ? 'active-employee' : ''}
                        arrowIcon={false}
                        key={employee.id}
                        onClick={() => handleEmployeeSelect(employee)}
                        extra={
                          employee.isSelected && (
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
                <span className="action-text" onClick={unselectAllEmployees}>{t('pages.employSelect.actions.unselectAll')}</span>
                <span className="action-text" onClick={selectAllEmployees}>{t('pages.employSelect.actions.selectAll')}</span>
              </div>
            </div>
          </div>
          
          {/* 底部确认按钮 */}
          {/* <div className="bottom-actions">
            <CButton
              block
              color="primary"
              onClick={handleConfirm}
              className="confirm-button"
              disabled={selectedEmployees.length === 0}
            >
              确定{selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : ''}
            </CButton>
          </div> */}
        </div>
      </PageContainer>
    </div>
  )
}

export default EmploySelect