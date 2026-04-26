/**
 * 绩效结果应用联动 类型定义（Phase B5）
 */

/** 规则类别 */
export type RuleCategory = 'bonus' | 'raise' | 'training' | 'promotion' | 'talent_tag'

/** 规则状态 */
export type RuleStatus = 'draft' | 'pending_approval' | 'active' | 'disabled'

/** 触发条件类型 */
export type TriggerConditionType = 'grade' | 'consecutive_grade' | 'score_range' | 'goal_rate'

/**
 * 触发条件
 */
export interface RuleCondition {
  type: TriggerConditionType
  /** 单一等级（grade）或等级数组（consecutive_grade）*/
  grades?: string[]
  /** 连续周期数（consecutive_grade）*/
  consecutiveCycles?: number
  /** 分数区间 */
  scoreMin?: number
  scoreMax?: number
  /** 目标完成率（goal_rate）*/
  goalRateMin?: number
}

/**
 * 执行动作
 */
export interface RuleAction {
  /** 奖金系数（bonus）*/
  bonusCoefficient?: number
  /** 调薪幅度最小值（raise）*/
  raiseMin?: number
  /** 调薪幅度最大值（raise）*/
  raiseMax?: number
  /** 培训课程 ID 列表（training）*/
  trainingCourses?: string[]
  /** 晋升池类别（promotion）*/
  promotionPool?: string
  /** 人才标签（talent_tag）*/
  talentTag?: string
  /** 执行说明 */
  description?: string
}

/**
 * 绩效应用规则
 */
export interface PerformanceApplyRule {
  id: number
  ruleNo: string
  name: string
  category: RuleCategory
  /** 触发条件 */
  condition: RuleCondition
  /** 执行动作 */
  action: RuleAction
  /** 适用范围（JSON） */
  applyScope?: {
    departments?: string[]
    jobFamilies?: string[]
    levels?: string[]
  }
  /** 优先级（数字越大越优先）*/
  priority: number
  status: RuleStatus
  /** 是否需要 HRBP+HRD 双确认 */
  needDualConfirm: 0 | 1
  /** 备注 */
  remark?: string
  createdBy?: string
  createTime: string
  updateTime: string
}

/**
 * 规则执行记录
 */
export interface RuleExecutionRecord {
  id: number
  ruleId: number
  ruleName: string
  category: RuleCategory
  /** 关联员工 */
  employeeId: number
  employeeName: string
  /** 触发的上下文（如评估 / 等级 / 分数 等）*/
  context: string
  /** 具体执行了什么 */
  executedAction: string
  /** 下游模块状态：待确认 / 已确认 / 已拒绝 / 已执行 */
  downstreamStatus: 'pending' | 'confirmed' | 'rejected' | 'executed'
  /** 确认人 */
  confirmedBy?: string
  confirmedAt?: string
  executeTime: string
}

/** 查询参数 */
export interface ApplyRuleListParams {
  name?: string
  category?: RuleCategory | ''
  status?: RuleStatus | ''
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const RULE_CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  bonus: { label: '绩效奖金', icon: '💰', color: '#f56c6c' },
  raise: { label: '年度调薪', icon: '📈', color: '#e6a23c' },
  training: { label: '培训推送', icon: '📚', color: '#409eff' },
  promotion: { label: '晋升候选', icon: '⬆', color: '#67c23a' },
  talent_tag: { label: '人才标签', icon: '🏷', color: '#6f5ef9' }
}

export const RULE_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  draft: { label: '草稿', type: 'info' },
  pending_approval: { label: '待审批', type: 'warning' },
  active: { label: '已启用', type: 'success' },
  disabled: { label: '已禁用', type: 'info' }
}

export const CONDITION_TYPE_MAP: Record<string, string> = {
  grade: '按等级',
  consecutive_grade: '连续 N 个周期某等级',
  score_range: '按分数区间',
  goal_rate: '目标完成率'
}

export const DOWNSTREAM_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待确认', type: 'warning' },
  confirmed: { label: '已确认', type: 'primary' },
  rejected: { label: '已拒绝', type: 'danger' },
  executed: { label: '已执行', type: 'success' }
}
