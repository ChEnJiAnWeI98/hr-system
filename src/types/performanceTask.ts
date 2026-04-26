/**
 * 绩效任务中心 类型定义（Phase B4）
 */

/** 任务类型（22 种常见场景的简化版） */
export type TaskType =
  // 员工视角
  | 'set_goal'
  | 'update_progress'
  | 'self_review'
  | 'nominate_360_reviewers'
  | 'submit_360_feedback'
  | 'confirm_meeting_notes'
  | 'prepare_one_on_one'
  | 'pip_weekly_update'
  | 'appeal'
  // Leader 视角
  | 'approve_goal'
  | 'review_subordinate'
  | 'approve_360_reviewers'
  | 'host_meeting'
  | 'conduct_one_on_one'
  | 'calibration_meeting'
  | 'pip_monthly_review'
  | 'pip_weekly_feedback'
  // HR 视角
  | 'advance_cycle'
  | 'monitor_evaluation'
  | 'organize_calibration'
  | 'publish_result'
  | 'handle_appeal'

/** 优先级 */
export type TaskPriority = 'urgent' | 'important' | 'normal'

/** 任务状态 */
export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'delayed' | 'cancelled'

/** 视角 */
export type TaskViewAs = 'employee' | 'leader' | 'hr'

/**
 * 绩效任务
 */
export interface PerformanceTask {
  id: number
  taskNo?: string
  type: TaskType
  /** 任务标题（自动生成或自定义）*/
  title: string
  /** 详情说明 */
  description?: string
  /** 分配给谁 */
  assigneeId: number
  assigneeName: string
  assigneeRole: TaskViewAs
  /** 关联业务对象（JSON） */
  relatedObject?: {
    type: string
    id: number
    name?: string
  }
  priority: TaskPriority
  /** 截止时间 */
  dueTime: string
  /** 提醒时间点（JSON：['-3d', '-1d', '0']） */
  remindAt?: string[]
  /** 跳转 URL */
  redirectUrl?: string
  status: TaskStatus
  /** 完成时间 */
  completedAt?: string
  /** 延期申请历史 */
  delayHistory?: Array<{ applyTime: string; newDueTime: string; reason: string; approver?: string; approved?: boolean }>
  createTime: string
  updateTime: string
}

/** 查询参数 */
export interface TaskListParams {
  assigneeRole?: TaskViewAs | ''
  assigneeName?: string
  type?: TaskType | ''
  priority?: TaskPriority | ''
  status?: TaskStatus | ''
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const TASK_TYPE_MAP: Record<string, { label: string; icon: string; group: string }> = {
  set_goal: { label: '设定目标', icon: '🎯', group: '员工' },
  update_progress: { label: '更新目标进度', icon: '📊', group: '员工' },
  self_review: { label: '完成自评', icon: '✍️', group: '员工' },
  nominate_360_reviewers: { label: '选择 360 评估人', icon: '👥', group: '员工' },
  submit_360_feedback: { label: '提交 360 反馈', icon: '💭', group: '员工' },
  confirm_meeting_notes: { label: '确认面谈纪要', icon: '✅', group: '员工' },
  prepare_one_on_one: { label: '准备 1on1', icon: '📝', group: '员工' },
  pip_weekly_update: { label: 'PIP 周更', icon: '📓', group: '员工' },
  appeal: { label: '提交申诉', icon: '⚖', group: '员工' },
  approve_goal: { label: '审批下属目标', icon: '✔️', group: 'Leader' },
  review_subordinate: { label: '评分下属', icon: '📋', group: 'Leader' },
  approve_360_reviewers: { label: '核准 360 评估人', icon: '🤝', group: 'Leader' },
  host_meeting: { label: '主持面谈', icon: '💬', group: 'Leader' },
  conduct_one_on_one: { label: '进行 1on1', icon: '☕', group: 'Leader' },
  calibration_meeting: { label: '参加校准会', icon: '⚖', group: 'Leader' },
  pip_monthly_review: { label: 'PIP 月评估', icon: '📅', group: 'Leader' },
  pip_weekly_feedback: { label: 'PIP 周反馈', icon: '📤', group: 'Leader' },
  advance_cycle: { label: '推进周期阶段', icon: '⏭', group: 'HR' },
  monitor_evaluation: { label: '监控评估进度', icon: '👁', group: 'HR' },
  organize_calibration: { label: '组织校准会', icon: '🎪', group: 'HR' },
  publish_result: { label: '公示结果', icon: '📢', group: 'HR' },
  handle_appeal: { label: '审批申诉', icon: '⚖', group: 'HR' }
}

export const PRIORITY_MAP: Record<string, { label: string; type: ElTagType; color: string }> = {
  urgent: { label: '紧急', type: 'danger', color: '#f56c6c' },
  important: { label: '重要', type: 'warning', color: '#e6a23c' },
  normal: { label: '常规', type: 'info', color: '#909399' }
}

export const TASK_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待完成', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  overdue: { label: '已超期', type: 'danger' },
  delayed: { label: '已延期', type: 'primary' },
  cancelled: { label: '已取消', type: 'info' }
}

export const VIEW_LABEL: Record<string, string> = {
  employee: '员工视角',
  leader: 'Leader 视角',
  hr: 'HR 视角'
}
