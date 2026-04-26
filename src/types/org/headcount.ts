/**
 * 编制管理 类型定义（Phase 3.3）
 */

/** 编制状态 */
export type HeadcountStatus = 'normal' | 'warning' | 'over'

/**
 * 编制计划（按组织 × 年度）
 */
export interface HeadcountPlan {
  id: number
  orgId: number
  orgName: string
  orgPath: string
  /** 年度 */
  year: number
  /** 预算编制人数 */
  budgetCount: number
  /** 实际在职人数（从员工档案统计） */
  actualCount: number
  /** 招聘中占用数（从招聘需求池统计） */
  pipelineCount: number
  /** 剩余可招人数 = budgetCount - actualCount - pipelineCount */
  gap: number
  /** 编制状态 */
  status: HeadcountStatus
  /** 最近调整时间 */
  lastAdjustTime?: string
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 编制调整申请
 */
export interface HeadcountAdjust {
  id: number
  /** 调整单号 */
  adjustNo: string
  orgId: number
  orgName: string
  /** 调整年度 */
  year: number
  /** 调整前预算 */
  beforeBudget: number
  /** 调整后预算 */
  afterBudget: number
  /** 变动值（可正可负） */
  delta: number
  /** 调整原因 */
  reason: string
  /** 发起人 */
  submitterName: string
  submitterId: number
  /** 状态 */
  status: 'pending' | 'approved' | 'rejected'
  /** 审批人 */
  approverName?: string
  approverId?: number
  approvalTime?: string
  approvalComment?: string
  /** 生效日期 */
  effectiveDate?: string
  createTime: string
  updateTime: string
}

/** 编制告警规则 */
export interface HeadcountAlert {
  orgId: number
  orgName: string
  alertLevel: 'warning' | 'danger'
  message: string
}

/** ========== 字典 ========== */

export const HEADCOUNT_STATUS_LABEL: Record<HeadcountStatus, string> = {
  normal: '正常',
  warning: '接近上限',
  over: '超编'
}

export const HEADCOUNT_STATUS_TYPE: Record<
  HeadcountStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  normal: 'success',
  warning: 'warning',
  over: 'danger'
}

/** 计算编制状态 */
export function calcHeadcountStatus(
  actualCount: number,
  budgetCount: number
): HeadcountStatus {
  if (actualCount > budgetCount) return 'over'
  const ratio = budgetCount > 0 ? actualCount / budgetCount : 0
  if (ratio >= 0.9) return 'warning'
  return 'normal'
}
