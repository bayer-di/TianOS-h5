export enum OCRTypeEnum {
  IdCard = 'id',
  BankCard = 'bank',
}

/**
 * OCR识别结果 - 身份证
 */
export interface IdCardOCRResult {
  name?: string
  idNumber?: string
  address?: string
  gender?: string
  nation?: string
  birthDate?: string
  issueAuthority?: string
  validDate?: string
}

/**
 * OCR识别结果 - 银行卡
 */
export interface BankCardOCRResult {
  bankName?: string
  cardNumber?: string
  cardType?: string
  validDate?: string
}

/**
 * 员工信息录入数据
 */
export interface EmployeeInfoData {
  idCardImage?: string
  bankCardImage?: string
}

export interface OCRVerifyQue {
  file: File
  type: OCRTypeEnum
  uuid: string
}

export interface OCRVerifyResult {
  type: OCRTypeEnum
  imgUrl: string
}
