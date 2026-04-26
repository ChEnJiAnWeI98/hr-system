/**
 * 薪酬体系（薪酬带宽） 类型定义（Phase 4.1）
 */

/**
 * 薪酬带宽（岗位族 × 职级 × { min / mid / max }）
 */
export interface SalaryBand {
  id: number
  /** 岗位族（字典 JOB_FAMILY） */
  jobFamily: string
  /** 职级（P1~P10 / M1~M5） */
  level: string
  /** 月薪下限 */
  minSalary: number
  /** 月薪中位 */
  midSalary: number
  /** 月薪上限 */
  maxSalary: number
  /** 生效年度 */
  year: number
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 员工在带宽中的位置（分位分析）
 */
export interface SalaryPositionAnalysis {
  employeeId: number
  employeeName: string
  jobFamily: string
  level: string
  currentSalary: number
  band: SalaryBand | null
  /** 分位：在 min~max 区间的百分位，0~100 */
  percentile: number
  /** 状态：低于带宽 / 正常 / 超出带宽 */
  status: 'below' | 'normal' | 'above'
}

/**
 * 调薪规则
 */
export interface SalaryAdjustRule {
  id: number
  ruleName: string
  /** 触发类型：annual 年度调薪 / promotion 晋升调薪 / special 特批 */
  triggerType: 'annual' | 'promotion' | 'special'
  /** 幅度类型：percentage 百分比 / fixed 固定金额 */
  amountType: 'percentage' | 'fixed'
  /** 幅度值（按绩效等级）*/
  amountByGrade?: {
    S: number
    A: number
    B: number
    C: number
    D: number
  }
  /** 单次固定金额 */
  fixedAmount?: number
  description: string
  status: 0 | 1
}

/** 查询参数 */
export interface SalaryBandListParams {
  jobFamily?: string
  level?: string
  year?: number
  page?: number
  pageSize?: number
}
