/** 作业记录表单录入 */
export interface WorkRecordForm {
    id?: number
    uuid: string
    /** 工种 */
    workTypeId: number
    /** 员工 */
    employeeIds: number[]
    /** 计件单位 */
    pieceUnitId: number
    /** 计件工作量 */
    pieceCount: number
    /** 计时工作量 */
    workTimeHour: number
    workTimeHourUnit: string
    workTimeHourUnitId: number
    /** 所属区块 */
    zoneId: number
    /** 所属种植区域 */
    areaId: number
    /** 所属品种 */
    categoryId: number
    remark: string
    startTime: number
    endTime: number
  }


/** 工种分组 */
export interface IWorkTypeGroup {
  id: number
  name: string
  parentId: number
  children: IWorkTypeGroup[]
}

/** 工种列表 */
export interface IWorkType {
  id: number
  name: string
  /** 计件单位 */
  pieceUnitId: number
  pieceUnitName: string
  /** 工种分组 */
  workTypeGroupId: number
  workTypeGroupName: string
}

// 工种组-工种级联列表
export interface IGroupWorkType extends IWorkTypeGroup {
  workTypes: IWorkType[]
}

/** 区块级联树结构 */
export interface IBlockLevel {
  id: number
  name: string
  parentId: number
  aliasName: string
  /** 区块编号 */
  code: string
  /** 面积 */
  square: string
  children?: IBlockLevel[]
}

/** 种植区域 */ 
export interface IPlantingArea {
  id: number
  name: string
}
  
