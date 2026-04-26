/**
 * 个税 类型定义（Phase 4.3）
 * 简化累进税率表（V2.0 决策 6=B）
 */

/**
 * 累进税率档
 */
export interface TaxBracket {
  /** 下限（含） */
  min: number
  /** 上限（不含，最后一档 Infinity） */
  max: number
  /** 税率 */
  rate: number
  /** 速算扣除数 */
  quickDeduction: number
}

/**
 * 专项附加扣除项
 */
export type SpecialDeductionType =
  | 'child_education' // 子女教育
  | 'continuing_education' // 继续教育
  | 'serious_illness' // 大病医疗
  | 'housing_loan' // 住房贷款
  | 'housing_rent' // 住房租金
  | 'elder_support' // 赡养老人

/**
 * 专项附加扣除登记
 */
export interface SpecialDeduction {
  id: number
  employeeId: number
  employeeName: string
  type: SpecialDeductionType
  /** 月扣除金额 */
  monthlyAmount: number
  /** 生效年份 */
  year: number
  /** 备注（如子女姓名、银行合同号等） */
  remark?: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

/**
 * 年度个税汇算清缴记录
 */
export interface YearTaxSettlement {
  id: number
  employeeId: number
  employeeName: string
  year: number
  /** 年度收入总额 */
  totalIncome: number
  /** 累计专项扣除 */
  totalSpecialDeduction: number
  /** 累计已缴税 */
  totalPaid: number
  /** 应补退税（正=补税 / 负=退税） */
  settlement: number
  /** 状态 */
  status: 'pending' | 'settled'
}

export const DEDUCTION_TYPE_LABEL: Record<SpecialDeductionType, string> = {
  child_education: '子女教育',
  continuing_education: '继续教育',
  serious_illness: '大病医疗',
  housing_loan: '住房贷款利息',
  housing_rent: '住房租金',
  elder_support: '赡养老人'
}

/** 简化累进税率表（7 级） */
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 36000, rate: 0.03, quickDeduction: 0 },
  { min: 36000, max: 144000, rate: 0.1, quickDeduction: 2520 },
  { min: 144000, max: 300000, rate: 0.2, quickDeduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, quickDeduction: 31920 },
  { min: 420000, max: 660000, rate: 0.3, quickDeduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, quickDeduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, quickDeduction: 181920 }
]

/** 起征点 */
export const TAX_THRESHOLD = 5000 // 月 / 年度 60000

/**
 * 简化个税计算
 * 按月计算：应纳税所得额 = 月工资 - 起征点 5000 - 社保公积金 - 专项附加扣除
 */
export function calcMonthlyTax(
  grossMonthly: number,
  socialSelf: number,
  fundSelf: number,
  specialDeduction: number = 0
): number {
  const taxable = grossMonthly - TAX_THRESHOLD - socialSelf - fundSelf - specialDeduction
  if (taxable <= 0) return 0
  // 按年化计算
  const yearly = taxable * 12
  const bracket = TAX_BRACKETS.find((b) => yearly >= b.min && yearly < b.max) || TAX_BRACKETS[0]
  const yearlyTax = yearly * bracket.rate - bracket.quickDeduction
  return Math.max(0, Math.round(yearlyTax / 12))
}
