/**
 * 薪酬管理相关类型定义
 */

/**
 * 薪酬项目
 */
export interface SalaryItem {
  /** 项目名称 */
  name: string
  /** 项目类型：1-收入，2-扣款 */
  type: number
  /** 计算方式：1-固定金额，2-公式计算 */
  calcMethod: number
  /** 是否参与个税计算 */
  includeTax: boolean
}

/**
 * 薪资结构
 */
export interface SalaryStructure {
  /** ID */
  id: number
  /** 结构名称 */
  structureName: string
  /** 薪酬项目配置 */
  salaryItems: SalaryItem[]
  /** 计算公式 */
  formula: string
  /** 适用范围 */
  applicableScope: string
  /** 状态：1-启用，0-停用 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 薪资结构查询参数
 */
export interface SalaryStructureListParams {
  /** 结构名称 */
  structureName?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 调薪申请
 */
export interface SalaryAdjustment {
  /** 申请ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 职位名称 */
  positionName: string
  /** 员工状态：1-在职 2-试用期 3-已离职 */
  employeeStatus: number
  /** 调薪类型：1-晋升调薪 2-年度调薪 3-绩效调薪 4-市场调薪 */
  adjustmentType: number
  /** 调薪类型名称 */
  adjustmentTypeName: string
  /** 调薪前薪资 */
  beforeSalary: number
  /** 调薪后薪资 */
  afterSalary: number
  /** 调薪幅度（百分比） */
  adjustmentRate: number
  /** 调薪原因 */
  reason: string
  /** 生效日期 */
  effectiveDate: string
  /** 审批状态：0-待审批 1-已批准 2-已拒绝 */
  approvalStatus: number
  /** 审批状态名称 */
  approvalStatusName: string
  /** 审批人 */
  approver?: string
  /** 审批时间 */
  approvalTime?: string
  /** 审批意见 */
  approvalComment?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 调薪申请查询参数
 */
export interface SalaryAdjustmentListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 调薪类型 */
  adjustmentType?: number | string | null
  /** 审批状态 */
  approvalStatus?: number | string | null
  /** 员工状态 */
  employeeStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 工资记录
 */
export interface SalaryRecord {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 员工编号 */
  employeeNo: string
  /** 部门名称 */
  departmentName: string
  /** 薪资月份 */
  salaryMonth: string
  /** 薪资结构ID */
  structureId: number
  /** 薪资结构名称 */
  structureName: string
  /** 基本工资 */
  basicSalary: number
  /** 绩效工资 */
  performanceSalary: number
  /** 岗位津贴 */
  positionAllowance: number
  /** 岗位津贴（别名） */
  allowance: number
  /** 加班费 */
  overtimePay: number
  /** 其他收入 */
  otherIncome: number
  /** 应发工资 */
  grossSalary: number
  /** 社保扣款（个人） */
  socialSecurityPersonal: number
  /** 社保扣款 */
  socialSecurityDeduction: number
  /** 公积金扣款（个人） */
  housingFundPersonal: number
  /** 公积金扣款 */
  housingFundDeduction: number
  /** 个税 */
  tax: number
  /** 个税（别名） */
  taxDeduction: number
  /** 其他扣款 */
  otherDeduction: number
  /** 实发工资 */
  netSalary: number
  /** 状态：0-未发放 1-已发放 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 工资条状态：1-未发送 2-已发送 */
  payslipStatus: number
  /** 发送时间 */
  sendTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 工资记录查询参数
 */
export interface SalaryRecordListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工编号 */
  employeeNo?: string
  /** 部门名称 */
  departmentName?: string
  /** 薪资月份 */
  salaryMonth?: string
  /** 状态 */
  status?: number | string | null
  /** 工资条状态 */
  payslipStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 个税申报
 */
export interface TaxDeclaration {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 申报月份 */
  declarationMonth: string
  /** 本月收入 */
  currentIncome: number
  /** 本月专项扣除 */
  currentSpecialDeduction: number
  /** 本月应纳税所得额 */
  currentTaxableIncome: number
  /** 本月应纳税额 */
  currentTax: number
  /** 累计收入 */
  accumulatedIncome: number
  /** 累计专项扣除 */
  accumulatedSpecialDeduction: number
  /** 累计应纳税所得额 */
  accumulatedTaxableIncome: number
  /** 累计应纳税额 */
  accumulatedTax: number
  /** 申报状态：0-未申报 1-已申报 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 个税申报查询参数
 */
export interface TaxDeclarationListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 申报月份 */
  declarationMonth?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
