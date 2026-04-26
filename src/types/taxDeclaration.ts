/**
 * 个税申报类型定义
 */

/**
 * 个税申报列表查询参数
 */
export interface TaxDeclarationListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 申报月份 */
  declarationMonth?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 个税申报数据项
 */
export interface TaxDeclaration {
  /** ID */
  id: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeNo: string
  /** 申报月份 */
  declarationMonth: string
  /** 本期收入 */
  currentIncome: number
  /** 本期应缴税额 */
  currentTaxPayable: number
  /** 本期实缴税额 */
  currentTaxPaid: number
  /** 创建时间 */
  createTime: string
}

/**
 * 个税申报详情
 */
export interface TaxDeclarationDetail extends TaxDeclaration {
  /** 本期专项扣除 */
  currentSpecialDeduction: number
  /** 本期专项附加扣除 */
  currentAdditionalDeduction: number
  /** 本期应纳税所得额 */
  currentTaxableIncome: number
  /** 累计收入 */
  accumulatedIncome: number
  /** 累计专项扣除 */
  accumulatedSpecialDeduction: number
  /** 累计专项附加扣除 */
  accumulatedAdditionalDeduction: number
  /** 累计应纳税所得额 */
  accumulatedTaxableIncome: number
  /** 累计已缴税额 */
  accumulatedTaxPaid: number
}

/**
 * 生成申报参数
 */
export interface GenerateTaxDeclarationParams {
  /** 申报月份 */
  declarationMonth: string
  /** 员工范围类型：all-全部员工，department-指定部门，employee-指定员工 */
  rangeType: 'all' | 'department' | 'employee'
  /** 部门ID列表（rangeType为department时必填） */
  departmentIds?: number[]
  /** 员工ID列表（rangeType为employee时必填） */
  employeeIds?: number[]
}
