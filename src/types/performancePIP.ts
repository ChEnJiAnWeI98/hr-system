/**
 * 绩效改进计划 PIP 类型定义（Phase B2）
 */

/** PIP 状态：规划中 / 进行中 / 已延期 / 已完成 / 已关闭 */
export type PIPStatus = 'planning' | 'in_progress' | 'extended' | 'completed' | 'closed'

/** PIP 最终结果 */
export type PIPResult = 'passed' | 'extended' | 'failed'

/** 员工签署状态 */
export type PIPSignStatus = 'not_signed' | 'signed' | 'refused'

/** 月评估结果 */
export type MonthlyReviewResult = 'above_expected' | 'meet_expected' | 'below_expected'

/**
 * PIP 改进目标项
 */
export interface PIPGoalItem {
  /** 目标序号 */
  order: number
  /** 改进目标描述 */
  description: string
  /** 可衡量标准 */
  criteria: string
  /** 时间节点 */
  deadline: string
  /** 当前进度 0-100 */
  progress: number
}

/**
 * PIP 周跟踪
 */
export interface PIPWeeklyTrack {
  id: number
  pipId: number
  /** 第 N 周 */
  week: number
  /** 员工本周进展 */
  employeeUpdate: string
  /** 上级本周反馈 */
  leaderFeedback: string
  /** 各改进目标进度（JSON：{goalOrder: progress}） */
  goalProgress: Record<number, number>
  submitTime: string
}

/**
 * PIP 月度评估
 */
export interface PIPMonthlyReview {
  id: number
  pipId: number
  /** 第 N 月（1/2/3） */
  month: number
  /** 评估结果 */
  result: MonthlyReviewResult
  /** 评估说明 */
  comment: string
  /** HR 意见 */
  hrComment?: string
  reviewerId: number
  reviewerName: string
  reviewTime: string
}

/**
 * 绩效改进计划 PIP
 */
export interface PerformancePIP {
  id: number
  pipNo: string
  /** 员工 */
  employeeId: number
  employeeName: string
  departmentId?: number
  departmentName: string
  positionName?: string

  /** 启动原因（关联的绩效评估结果）*/
  initiatedReason: string
  /** 关联评估 ID */
  evaluationId?: number

  /** 启动日期 */
  startDate: string
  /** 预计结束日期（默认 +3 个月） */
  expectedEndDate: string
  /** 实际结束日期 */
  actualEndDate?: string

  /** 改进目标（3~5 个）*/
  goals: PIPGoalItem[]

  /** HR 工号/姓名 */
  hrId: number
  hrName: string
  /** 直属上级 */
  leaderId: number
  leaderName: string

  /** 员工签署状态 */
  signStatus: PIPSignStatus
  signTime?: string
  refuseReason?: string

  /** 状态 */
  status: PIPStatus

  /** 最终结果（PIP 结束时判定） */
  result?: PIPResult
  resultReason?: string
  /** 结果判定时间 */
  resultTime?: string

  /** 申诉窗口：3 工作日 */
  appealStatus?: 'none' | 'filed' | 'rejected' | 'accepted'

  createTime: string
  updateTime: string
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const PIP_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  planning: { label: '规划中', type: 'info' },
  in_progress: { label: '进行中', type: 'primary' },
  extended: { label: '已延期', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  closed: { label: '已关闭', type: 'info' }
}

export const PIP_RESULT_MAP: Record<string, { label: string; type: ElTagType }> = {
  passed: { label: '通过（回归正常）', type: 'success' },
  extended: { label: '延期（延长 1 月）', type: 'warning' },
  failed: { label: '未通过（进入离职流程）', type: 'danger' }
}

export const SIGN_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  not_signed: { label: '待签署', type: 'warning' },
  signed: { label: '已签署', type: 'success' },
  refused: { label: '拒绝签署', type: 'danger' }
}

export const MONTHLY_RESULT_MAP: Record<string, { label: string; type: ElTagType; score: number }> = {
  above_expected: { label: '超预期', type: 'success', score: 3 },
  meet_expected: { label: '达预期', type: 'primary', score: 2 },
  below_expected: { label: '低于预期', type: 'danger', score: 1 }
}
