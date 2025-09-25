import React from 'react'
import PageContainer from '@/components/PageContainer'

const EmployeeInfoEntry: React.FC = () => {
  return (
    <PageContainer
      title="员工信息录入"
      showBack={false}
      showSubmit={true}
      submitText="提交"
    //   onSubmit={handleSubmit}
    >
      <div>EmployeeInfoEntry</div>
    </PageContainer>
  )
}

export default EmployeeInfoEntry