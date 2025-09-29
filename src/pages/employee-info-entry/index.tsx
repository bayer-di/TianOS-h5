import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDIRequest from '@/hooks/useRequest'
import PageContainer from '@/components/PageContainer'
import PhotoUploader from '@/components/PhotoUploader'
import idEmptyImage from '@/assets/image/id-card.png'
import bankEmptyImage from '@/assets/image/bank-card.png'
import { OCRTypeEnum } from '@/types/employeeInfoEntry'
import { sessionStorage } from '@/utils/storage'
import type { EmployeeInfoData } from '@/types/employeeInfoEntry'
import { employeeInfoEntryApi } from '@/services/employeeInfoEntry'
import { useUrlParams, defaultConverters } from '@/utils/location'
import './styles.scss'


const getSavedEmployeeInfo = (): EmployeeInfoData => {
  return sessionStorage.get<EmployeeInfoData>('employeeInfo', {}) as EmployeeInfoData
}

const EmployeeInfoEntry: React.FC = () => {
  const navigate = useNavigate()
  const { uuid } = useUrlParams({
    uuid: { defaultValue: '', converter: defaultConverters.string }
  })

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfoData>(getSavedEmployeeInfo())

  const [{ loading, runAsync: enableAction }] = useDIRequest(employeeInfoEntryApi.enableEmployee, {
    manual: true,
  }, {
    onSuccess: () => {
      sessionStorage.remove('employeeInfo')
      navigate('/result-page', {
        replace: true,
        state: {
          status: 'success',
          title: '信息上传成功',
          description: '请前往网页端查看',
        }
      })
    }
  })
  
  // 处理从裁剪页面返回的OCR结果
  useEffect(() => {
    const ocrResult = sessionStorage.get('ocrResult')
    if (ocrResult) {
      const { type, imgUrl } = ocrResult
      
      // 更新员工信息状态
      setEmployeeInfo(prevInfo => {
        const updatedInfo = type === OCRTypeEnum.IdCard
          ? { ...prevInfo, idCardImage: imgUrl }
          : { ...prevInfo, bankCardImage: imgUrl }
        
        // 更新到sessionStorage以便页面刷新时持久化
        sessionStorage.set('employeeInfo', updatedInfo)
        return updatedInfo
      })
    
      sessionStorage.remove('ocrResult')
    }
  }, [])
  
  const handleSubmit = async () => {
    await enableAction(uuid as string)
  }

  // 更新状态并同步到sessionStorage
  const updateEmployeeInfo = (updatedInfo: EmployeeInfoData) => {
    sessionStorage.set('employeeInfo', updatedInfo)
    setEmployeeInfo(updatedInfo)
  }
  
  const onDeleteIdCard = () => {
    updateEmployeeInfo({
      ...employeeInfo,
      idCardImage: undefined,
    })
  }
  
  const onDeleteBankCard = () => {
    updateEmployeeInfo({
      ...employeeInfo,
      bankCardImage: undefined,
    })
  }

  return (
    <PageContainer
      title="入职信息上传"
      showBack={false}
      showSubmit={true}
      submitText="提交"
      onSubmit={handleSubmit}
      submitLoading={loading}
      submitDisabled={!employeeInfo?.idCardImage && !employeeInfo?.bankCardImage}
    >
      <div className="employee-info-entry">
        {/* 身份证上传区域 */}
        <div className="upload-section">
          <PhotoUploader
            data={employeeInfo?.idCardImage}
            title="上传身份证「人像面」"
            onDelete={onDeleteIdCard}
            emptyImage={idEmptyImage}
            ocrType={OCRTypeEnum.IdCard}
            uuid={uuid as string}
          />
        </div>
        
        {/* 银行卡上传区域 */}
        <div className="upload-section">
          <PhotoUploader 
            data={employeeInfo?.bankCardImage}
            title="上传银行卡「卡号面」"
            onDelete={onDeleteBankCard}
            emptyImage={bankEmptyImage}
            ocrType={OCRTypeEnum.BankCard}
            uuid={uuid as string}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default EmployeeInfoEntry