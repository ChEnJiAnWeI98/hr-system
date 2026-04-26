/**
 * 招聘预算管理 Phase 5.10 类型定义
 */

/** 预算维度：部门 / 岗位族 / 渠道 */
export type BudgetDimension = 'department' | 'jobFamily' | 'channel'

/** 预算周期：年度 / 季度 / 月度 */
export type BudgetPeriod = 'year' | 'quarter' | 'month'

/** 预算状态 */
export type BudgetStatus = 'normal' | 'warning' | 'exceeded'

/**
 * 招聘预算项
 */
export interface RecruitmentBudget {
  id: number
  /** 预算名称 */
  name: string
  /** 预算年度 */
  year: number
  /** 季度（1-4，若为季度预算）*/
  quarter?: number
  /** 预算周期 */
  period: BudgetPeriod
  /** 维度类型 */
  dimension: BudgetDimension
  /** 维度键值：部门名 / 岗位族 / 渠道名 */
  dimensionKey: string
  /** 预算金额（元） */
  budgetAmount: number
  /** 已使用金额（自动聚合） */
  usedAmount: number
  /** 剩余金额（计算字段） */
  remainingAmount: number
  /** 使用率（%） */
  usageRate: number
  /** 告警阈值（%，默认 80） */
  alertThreshold: number
  /** 当前状态 */
  status: BudgetStatus
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/** 查询参数 */
export interface BudgetListParams {
  year?: number
  period?: BudgetPeriod | ''
  dimension?: BudgetDimension | ''
  status?: BudgetStatus | ''
  page: number
  pageSize: number
}

/**
 * 告警历史
 */
export interface BudgetAlert {
  id: number
  budgetId: number
  budgetName: string
  dimension: BudgetDimension
  dimensionKey: string
  triggerType: 'warning' | 'exceeded'
  triggerAmount: number
  triggerRate: number
  message: string
  acknowledged: 0 | 1
  acknowledgedBy?: string
  acknowledgedTime?: string
  triggerTime: string
}

/**
 * 预算消耗明细（来源于渠道成本等记录）
 */
export interface BudgetExpense {
  id: number
  budgetId: number
  /** 产生消耗的业务来源：channel_cost / referral_reward / background_check / other */
  source: string
  sourceId: number
  amount: number
  month: string
  description: string
  createTime: string
}

/**
 * 预算总览统计
 */
export interface BudgetOverview {
  /** 当前年度预算总额 */
  totalBudget: number
  /** 已使用总额 */
  totalUsed: number
  /** 剩余总额 */
  totalRemaining: number
  /** 总使用率 */
  totalUsageRate: number
  /** 健康预算数 */
  normalCount: number
  /** 预警预算数 */
  warningCount: number
  /** 超支预算数 */
  exceededCount: number
  /** 按维度分布（部门/岗位族/渠道） */
  byDimension: {
    dimension: BudgetDimension
    totalBudget: number
    totalUsed: number
    items: Array<{ key: string; budget: number; used: number; usageRate: number }>
  }[]
  /** 近 6 个月消耗趋势 */
  monthlyTrend: Array<{ month: string; used: number; budget: number }>
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 字典 */
export const BUDGET_DIMENSION_MAP: Record<string, { label: string; icon: string }> = {
  department: { label: '按部门', icon: '🏢' },
  jobFamily: { label: '按岗位族', icon: '👥' },
  channel: { label: '按渠道', icon: '📢' }
}

export const BUDGET_PERIOD_MAP: Record<string, string> = {
  year: '年度',
  quarter: '季度',
  month: '月度'
}

export const BUDGET_STATUS_MAP: Record<string, { label: string; type: ElTagType; color: string }> = {
  normal: { label: '健康', type: 'success', color: '#67c23a' },
  warning: { label: '预警', type: 'warning', color: '#e6a23c' },
  exceeded: { label: '超支', type: 'danger', color: '#f56c6c' }
}

/** 判断预算状态 */
export function calcBudgetStatus(usageRate: number, threshold: number): BudgetStatus {
  if (usageRate >= 100) return 'exceeded'
  if (usageRate >= threshold) return 'warning'
  return 'normal'
}
