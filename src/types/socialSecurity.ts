/**
 * 社保管理类型定义
 */

/**
 * 参保配置
 */
export interface InsuranceConfig {
  id: number
  city: string
  year: number
  month: number
  yearMonth?: string // 年月（格式：YYYY-MM）
  pensionBase: number // 养老保险基数
  pensionCompanyRate: number // 养老保险企业比例
  pensionPersonalRate: number // 养老保险个人比例
  medicalBase: number // 医疗保险基数
  medicalCompanyRate: number
  medicalPersonalRate: number
  unemploymentBase: number // 失业保险基数
  unemploymentCompanyRate: number
  unemploymentPersonalRate: number
  injuryBase: number // 工伤保险基数
  injuryCompanyRate: number
  maternityBase: number // 生育保险基数
  maternityCompanyRate: number
  status: number // 1-启用 0-停用
  statusName?: string
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 参保配置列表查询参数
 */
export interface InsuranceConfigListParams {
  city?: string
  year?: number | string | null
  month?: number | string | null
  status?: number | string | null
  page: number
  pageSize: number
}

/**
 * 增减员管理
 */
export interface EmployeeInsurance {
  id: number
  employeeId: number
  employeeName: string
  idCard: string
  department: string
  operationType: number // 1-参保 2-停保
  city: string
  insuranceTypes: string[] // 参保险种：['养老', '医疗', '失业', '工伤', '生育']
  startDate: string
  endDate?: string
  status: number // 1-待办理 2-已办理 3-已取消
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 增减员管理列表查询参数
 */
export interface EmployeeInsuranceListParams {
  employeeName?: string
  idCard?: string
  department?: string
  operationType?: number | string | null
  city?: string
  status?: number | string | null
  startDateStart?: string
  startDateEnd?: string
  page: number
  pageSize: number
}

/**
 * 公积金管理
 */
export interface ProvidentFund {
  id: number
  employeeId: number
  employeeName: string
  idCard: string
  department: string
  city: string
  fundBase: number // 缴费基数（元）
  companyRate: number // 单位缴费比例（%）
  personalRate: number // 个人缴费比例（%）
  companyAmount: number // 单位缴费金额（元）
  personalAmount: number // 个人缴费金额（元）
  totalAmount: number // 合计金额（元）
  startDate: string
  endDate?: string
  status: number // 1-正常缴纳 2-暂停缴纳 3-已停缴
  operationType: number // 1-新增 2-调整 3-停缴
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 公积金管理列表查询参数
 */
export interface ProvidentFundListParams {
  employeeName?: string
  idCard?: string
  department?: string
  city?: string
  status?: number | string | null
  operationType?: number | string | null
  page: number
  pageSize: number
}

/**
 * 社保账单
 */
export interface InsuranceBill {
  id: number
  billNo: string
  year: number
  month: number
  city: string
  employeeCount: number // 参保人数
  pensionCompany: number // 养老保险企业缴纳
  pensionPersonal: number // 养老保险个人缴纳
  medicalCompany: number
  medicalPersonal: number
  unemploymentCompany: number
  unemploymentPersonal: number
  injuryCompany: number
  maternityCompany: number
  totalCompany: number // 企业合计
  totalPersonal: number // 个人合计
  totalAmount: number // 总计
  status: number // 1-未支付 2-已支付
  paymentDate?: string
  createTime: string
  updateTime: string
}

/**
 * 社保账单列表查询参数
 */
export interface InsuranceBillListParams {
  billNo?: string
  year?: number | string | null
  month?: number | string | null
  city?: string
  status?: number | string | null
  page: number
  pageSize: number
}

/**
 * 缴纳记录
 */
export interface PaymentRecord {
  id: number
  recordNo: string // 缴纳记录编号
  yearMonth: string // 缴纳月份（YYYY-MM）
  city: string
  employeeCount: number // 参保人数
  pensionAmount: number // 养老保险金额
  medicalAmount: number // 医疗保险金额
  unemploymentAmount: number // 失业保险金额
  injuryAmount: number // 工伤保险金额
  maternityAmount: number // 生育保险金额
  providentFundAmount: number // 公积金金额
  totalAmount: number // 总金额
  paymentDate: string // 缴纳日期
  paymentStatus: number // 1-待缴纳 2-已缴纳 3-缴纳失败
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 缴纳记录列表查询参数
 */
export interface PaymentRecordListParams {
  recordNo?: string
  yearMonth?: string
  city?: string
  paymentStatus?: number | string | null
  page: number
  pageSize: number
}

/**
 * 数据统计 - 参保人数趋势
 */
export interface InsuredTrend {
  month: string // 月份
  insuredCount: number // 参保人数
  newCount: number // 新增人数
  stopCount: number // 停保人数
}

/**
 * 数据统计 - 缴纳金额统计
 */
export interface PaymentAmountStats {
  month: string
  pensionAmount: number
  medicalAmount: number
  unemploymentAmount: number
  injuryAmount: number
  maternityAmount: number
  providentFundAmount: number
  totalAmount: number
}

/**
 * 数据统计 - 部门费用对比
 */
export interface DepartmentCostCompare {
  department: string
  totalAmount: number
  pensionAmount: number
  medicalAmount: number
  unemploymentAmount: number
  injuryAmount: number
  maternityAmount: number
  providentFundAmount: number
}

/**
 * 数据统计 - 险种费用占比
 */
export interface InsuranceTypeRatio {
  insuranceType: string // 险种名称
  amount: number // 金额
  ratio: number // 占比（%）
}

/**
 * 数据统计查询参数
 */
export interface StatisticsQueryParams {
  startMonth?: string // 开始月份（YYYY-MM）
  endMonth?: string // 结束月份（YYYY-MM）
  department?: string // 部门
  city?: string // 城市
}
