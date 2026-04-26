/**
 * 绩效面谈 类型定义（Phase A8）
 */

/** 面谈状态 */
export type MeetingStatus =
  | 'pending'     // 待预约
  | 'scheduled'   // 已预约
  | 'completed'   // 已完成（上级已提交纪要）
  | 'confirmed'   // 员工已确认
  | 'disputed'    // 员工有异议
  | 'resolved'    // 异议已协商处理

/** 员工确认状态 */
export type EmployeeConfirmStatus = 'not_confirmed' | 'confirmed' | 'disputed'

/**
 * 绩效面谈
 */
export interface PerformanceMeeting {
  id: number
  meetingNo: string
  /** 周期 */
  cycleId: number
  cycleName: string
  /** 关联评估 */
  evaluationId?: number
  /** 员工 */
  employeeId: number
  employeeName: string
  departmentId?: number
  departmentName: string
  /** 面谈人（直属上级或指定替代者）*/
  interviewerId: number
  interviewerName: string
  /** 预约时间 */
  scheduledTime?: string
  /** 实际面谈时间 */
  actualTime?: string
  /** 面谈时长（分钟）*/
  duration?: number

  /** 纪要：优点总结 */
  strengths?: string
  /** 纪要：不足分析 */
  weaknesses?: string
  /** 纪要：改进建议 */
  improvementSuggestions?: string
  /** 纪要：发展计划 */
  developmentPlan?: string
  /** 纪要：下周期目标预设 */
  nextPeriodGoals?: string
  /** 员工反馈 */
  employeeFeedback?: string
  /** 上级承诺 */
  commitments?: string

  /** 员工确认 */
  employeeConfirmStatus: EmployeeConfirmStatus
  /** 员工异议内容 */
  employeeDispute?: string
  /** 确认时间 */
  confirmTime?: string

  /** 状态 */
  status: MeetingStatus
  /** 提交纪要时间 */
  submitTime?: string

  createTime: string
  updateTime: string
}

/** 查询参数 */
export interface MeetingListParams {
  employeeName?: string
  departmentName?: string
  cycleId?: number | null
  status?: MeetingStatus | ''
  employeeConfirmStatus?: EmployeeConfirmStatus | ''
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const MEETING_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待预约', type: 'info' },
  scheduled: { label: '已预约', type: 'warning' },
  completed: { label: '待员工确认', type: 'primary' },
  confirmed: { label: '已确认', type: 'success' },
  disputed: { label: '员工有异议', type: 'danger' },
  resolved: { label: '异议已处理', type: 'success' }
}

export const CONFIRM_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  not_confirmed: { label: '未确认', type: 'info' },
  confirmed: { label: '已确认', type: 'success' },
  disputed: { label: '有异议', type: 'danger' }
}

/**
 * 面谈提纲模板（标准 6 项）
 */
export const DEFAULT_MEETING_TEMPLATE = {
  strengths: '回顾本周期的优点和亮点：\n- \n- \n- ',
  weaknesses: '需要改进的方面：\n- \n- ',
  improvementSuggestions: '针对不足的具体改进建议：\n- \n- ',
  developmentPlan: '发展计划（培训/技能/晋升路径）：\n- \n- ',
  nextPeriodGoals: '下周期目标预设：\n- \n- ',
  commitments: '上级承诺（如指导培训、调整职责等）：\n- '
}
