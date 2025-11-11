export interface IPosition {
  id: number
  name: string
  baseId: number
  positionTypeId: number
  positionTypeName: string
  canDeleted: boolean
}

export enum ClockIn {
  ALL = -1,
  NO = 0,
  YES = 1,
}

export interface IEmployeeFilter {
  uuid: string
  positionId: number
  /** 工号/姓名 */
  keywords: string
  clockIn: ClockIn
}