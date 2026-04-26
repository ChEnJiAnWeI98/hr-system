/**
 * 自动化规则引擎 Phase 5.8 类型定义
 */

/** 触发器类型 */
export type TriggerType =
  | 'resume_stuck'          // 简历初筛超时
  | 'interview_no_feedback' // 面试后未及时反馈
  | 'offer_no_response'     // Offer 候选人长期未反馈
  | 'low_match'             // 简历匹配度低于阈值
  | 'onboard_no_confirm'    // 入职日临近未确认
  | 'demand_overdue'        // 招聘需求超期未关闭

/** 动作类型 */
export type ActionType =
  | 'send_notification' // 发送站内通知
  | 'send_email'        // 发送邮件
  | 'auto_reject'       // 自动淘汰
  | 'escalate_approval' // 升级审批
  | 'add_tag'           // 打标签
  | 'assign_to'         // 转派给指定人

/** 执行结果 */
export type ActionResult = 'success' | 'failed' | 'skipped'

/**
 * 规则动作
 */
export interface RuleAction {
  type: ActionType
  /** 动作参数（结构因 type 而异） */
  config: Record<string, any>
}

/**
 * 自动化规则
 */
export interface AutomationRule {
  id: number
  name: string
  /** 规则描述 */
  description?: string
  /** 触发器类型 */
  triggerType: TriggerType
  /** 触发器参数（如 {days: 3, matchThreshold: 60}） */
  triggerConfig: Record<string, any>
  /** 动作列表（按顺序执行） */
  actions: RuleAction[]
  /** 启用状态 */
  enabled: 0 | 1
  /** 优先级（数字越大越优先执行） */
  priority: number
  /** 已触发次数 */
  triggerCount: number
  /** 最近触发时间 */
  lastTriggerTime?: string
  /** 创建人 */
  createdByName: string
  createTime: string
  updateTime: string
}

/**
 * 规则触发日志
 */
export interface AutomationLog {
  id: number
  ruleId: number
  ruleName: string
  triggerType: TriggerType
  /** 目标对象类型：resume / interview / offer / onboarding / demand */
  targetType: string
  targetId: number
  /** 目标对象名称（冗余展示） */
  targetName: string
  /** 触发原因/匹配条件文字 */
  matchedReason: string
  /** 每个动作的执行结果 */
  actionResults: Array<{
    type: ActionType
    result: ActionResult
    message: string
  }>
  /** 整体结果 */
  overallResult: ActionResult
  triggerTime: string
}

/**
 * 规则模板（内置）
 */
export interface RuleTemplate {
  id: number
  name: string
  description: string
  category: '简历筛选' | '面试跟进' | 'Offer 管理' | '入职保障' | '需求管理'
  triggerType: TriggerType
  triggerConfig: Record<string, any>
  actions: RuleAction[]
  recommendedFor: string
}

/**
 * 触发器统计
 */
export interface AutomationStats {
  totalRules: number
  enabledRules: number
  last30DaysTriggers: number
  successRate: number
  topRules: Array<{ ruleId: number; ruleName: string; count: number }>
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 字典（key 放宽为 string，便于索引 any 字段） */
export const TRIGGER_TYPE_MAP: Record<string, { label: string; icon: string; description: string }> = {
  resume_stuck: {
    label: '简历初筛超时',
    icon: '📄',
    description: '候选人投递后 N 天内仍未完成初筛动作'
  },
  interview_no_feedback: {
    label: '面试后未反馈',
    icon: '💬',
    description: '面试结束 N 天后面试官仍未提交评价'
  },
  offer_no_response: {
    label: 'Offer 长期未反馈',
    icon: '📨',
    description: 'Offer 发送 N 天后候选人仍未接受/拒绝'
  },
  low_match: {
    label: '匹配度低于阈值',
    icon: '⚠️',
    description: 'AI 匹配总分低于配置阈值'
  },
  onboard_no_confirm: {
    label: '入职日临近未确认',
    icon: '🗓️',
    description: '距入职日不足 N 天，候选人资料填报仍未完成'
  },
  demand_overdue: {
    label: '招聘需求超期',
    icon: '⏰',
    description: '需求已批准 N 天仍未完成招聘'
  }
}

export const ACTION_TYPE_MAP: Record<string, { label: string; icon: string }> = {
  send_notification: { label: '发送站内通知', icon: '🔔' },
  send_email: { label: '发送邮件', icon: '✉️' },
  auto_reject: { label: '自动淘汰', icon: '🚫' },
  escalate_approval: { label: '升级审批', icon: '⬆️' },
  add_tag: { label: '打标签', icon: '🏷️' },
  assign_to: { label: '转派给指定人', icon: '👤' }
}

export const ACTION_RESULT_MAP: Record<string, { label: string; type: ElTagType }> = {
  success: { label: '成功', type: 'success' },
  failed: { label: '失败', type: 'danger' },
  skipped: { label: '跳过', type: 'info' }
}
