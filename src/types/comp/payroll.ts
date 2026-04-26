/**
 * 薪资核算 类型定义（Phase 4.2）
 *
 * 核算逻辑（V2.0 决策 6=B 简化版）：
 *   应发 = 基本工资 + 岗位工资 + 绩效工资 + 加班费 + 补贴
 *       绩效工资 = 绩效基数 × 系数（S=1.5 / A=1.2 / B=1.0 / C=0.8 / D=0.5）
 *   扣缴 = 个税 + 社保自缴（10.5%）+ 公积金自缴（12%）
 *   实发 = 应发 - 扣缴
 */

/** 核算批次状态 */
export type PayrollBatchStatus =
  | 'draft' // 草稿
  | 'calculating' // 核算中
  | 'calculated' // 核算完成（待审批）
  | 'reviewing' // 审批中
  | 'approved' // 审批通过（待发放）
  | 'released' // 已发放
  | 'cancelled' // 已取消

/**
 * 核算批次
 */
export interface PayrollBatch {
  id: number
  /** 批次号 PR202604001 */
  batchNo: string
  /** 核算周期 2026-04 */
  period: string
  /** 适用组织 ID 列表；空 = 全员 */
  orgIds: number[]
  /** 组织名称拼接（冗余） */
  orgNames: string
  /** 状态 */
  status: PayrollBatchStatus
  /** 员工人数 */
  totalEmployees: number
  /** 应发总额 */
  totalGross: number
  /** 扣缴总额 */
  totalDeduction: number
  /** 实发总额 */
  totalNet: number
  /** 发起人 */
  creatorName: string
  creatorId: number
  /** HRBP 审批 */
  hrbpApprover?: string
  hrbpApproverId?: number
  hrbpApprovalTime?: string
  /** HRD 审批 */
  hrdApprover?: string
  hrdApproverId?: number
  hrdApprovalTime?: string
  /** 发放时间 */
  releaseTime?: string
  createTime: string
  updateTime: string
}

/** 薪资项 */
export interface PayrollItem {
  /** 薪资项 code（字典 SALARY_ITEM） */
  code: string
  /** 名称 */
  name: string
  /** 方向：加项 / 扣项 */
  direction: 'addition' | 'deduction'
  /** 金额 */
  amount: number
}

/**
 * 单个员工的核算记录
 */
export interface PayrollRecord {
  id: number
  batchId: number
  batchNo: string
  /** 员工 */
  employeeId: number
  employeeName: string
  employeeNo: string
  orgName: string
  positionName: string
  level: string
  /** 核算周期 */
  period: string
  /** 绩效等级（从绩效档案读，无记录默认 B） */
  performanceGrade: 'S' | 'A' | 'B' | 'C' | 'D'
  /** 绩效系数 */
  performanceCoefficient: number
  /** 薪资项明细（按 direction 分） */
  items: PayrollItem[]
  /** 应发总额 */
  grossAmount: number
  /** 扣缴总额 */
  deductionAmount: number
  /** 实发总额 */
  netAmount: number
  /** 状态 */
  status: 'calculated' | 'released' | 'disputed'
  createTime: string
  updateTime: string
}

/** 查询参数 */
export interface PayrollBatchListParams {
  batchNo?: string
  period?: string
  status?: PayrollBatchStatus | ''
  page?: number
  pageSize?: number
}

export interface PayrollRecordListParams {
  batchId?: number
  employeeId?: number
  employeeName?: string
  page?: number
  pageSize?: number
}

/** 字典 */
export const BATCH_STATUS_LABEL: Record<PayrollBatchStatus, string> = {
  draft: '草稿',
  calculating: '核算中',
  calculated: '核算完成',
  reviewing: '审批中',
  approved: '审批通过',
  released: '已发放',
  cancelled: '已取消'
}

export const BATCH_STATUS_TYPE: Record<
  PayrollBatchStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  draft: 'info',
  calculating: 'warning',
  calculated: 'primary',
  reviewing: 'warning',
  approved: 'primary',
  released: 'success',
  cancelled: 'info'
}

/** 绩效系数（V2.0 决策 6=B 简化） */
export const PERFORMANCE_COEFFICIENT: Record<'S' | 'A' | 'B' | 'C' | 'D', number> = {
  S: 1.5,
  A: 1.2,
  B: 1.0,
  C: 0.8,
  D: 0.5
}

/** 社保 / 公积金自缴比例（简化） */
export const SOCIAL_SELF_RATE = 0.105 // 养老 8% + 医疗 2% + 失业 0.5% = 10.5%
export const FUND_SELF_RATE = 0.12 // 公积金 12%
