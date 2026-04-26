/**
 * 1on1 / 持续反馈 类型定义（Phase B1）
 * 包含：1on1 记录 + 即时反馈 Feedback + 认可徽章 Recognition
 */

/** 1on1 发起方 */
export type OneOnOneInitiator = 'employee' | 'leader'

/** 1on1 状态 */
export type OneOnOneStatus = 'pending' | 'completed' | 'cancelled'

/** 反馈类型 */
export type FeedbackType = 'appreciation' | 'suggestion' | 'correction'

/** 反馈可见范围 */
export type FeedbackVisibility = 'private' | 'with_leader' | 'public'

/**
 * 1on1 记录
 */
export interface OneOnOne {
  id: number
  oneOnOneNo?: string
  /** 员工 */
  employeeId: number
  employeeName: string
  departmentName: string
  /** Leader */
  leaderId: number
  leaderName: string
  /** 发起方 */
  initiator: OneOnOneInitiator
  /** 计划时间 */
  plannedTime?: string
  /** 实际时间 */
  actualTime?: string
  /** 时长（分钟） */
  duration?: number
  /** 员工准备内容 */
  employeePrep?: string
  /** Leader 准备内容 */
  leaderPrep?: string
  /** 会议纪要 */
  minutes?: string
  /** 关键决定 */
  keyDecisions?: string
  /** 后续待办（JSON：[{content, dueDate}]） */
  followUpTasks?: Array<{ content: string; dueDate?: string }>
  /** 状态 */
  status: OneOnOneStatus
  createTime: string
  updateTime: string
}

/**
 * 即时反馈
 */
export interface FeedbackRecord {
  id: number
  feedbackNo?: string
  /** 反馈发起人 */
  fromId: number
  fromName: string
  /** 反馈对象 */
  toId: number
  toName: string
  toDepartment: string
  /** 反馈类型 */
  type: FeedbackType
  /** 反馈内容 */
  content: string
  /** 关联项目/事件 */
  context?: string
  /** 可见范围 */
  visibility: FeedbackVisibility
  createTime: string
}

/**
 * 徽章类型（定义哪些徽章可用）
 */
export interface BadgeType {
  id: number
  code: string
  name: string
  /** Emoji 图标 */
  icon: string
  /** 关联价值观或文化标签 */
  valueTag: string
  /** 授予一次获得的积分 */
  points: number
  /** 描述 */
  description: string
  /** 是否启用 */
  enabled: 0 | 1
}

/**
 * 认可徽章记录（谁给谁发）
 */
export interface Recognition {
  id: number
  /** 徽章类型 */
  badgeTypeCode: string
  badgeTypeName: string
  badgeIcon: string
  /** 授予人 */
  fromId: number
  fromName: string
  /** 授予人角色：peer / leader / hr */
  fromRole: 'peer' | 'leader' | 'hr'
  /** 接收人 */
  toId: number
  toName: string
  toDepartment: string
  /** 理由（具体事例）*/
  reason: string
  /** 积分值（来自 BadgeType） */
  points: number
  createTime: string
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const OOO_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待进行', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' }
}

export const FEEDBACK_TYPE_MAP: Record<string, { label: string; type: ElTagType; icon: string }> = {
  appreciation: { label: '赞赏', type: 'success', icon: '👏' },
  suggestion: { label: '建议', type: 'primary', icon: '💡' },
  correction: { label: '纠偏', type: 'warning', icon: '⚠' }
}

export const VISIBILITY_MAP: Record<string, string> = {
  private: '仅双方可见',
  with_leader: '双方 + Leader',
  public: '团队公开'
}

/**
 * 1on1 提纲模板
 */
export const OOO_TEMPLATES = {
  career: '职业发展讨论\n- 近期的职业目标是什么？\n- 遇到什么瓶颈？\n- 需要什么支持？',
  work: '工作反馈\n- 近期最满意的工作成果？\n- 最具挑战的事？\n- 想要什么样的反馈？',
  project: '项目回顾\n- 项目推进情况\n- 关键障碍\n- 下一步计划',
  personal: '个人议题\n- 近期生活/状态\n- 困扰或诉求',
  open: '自由讨论\n- 你想聊的任何话题'
}
