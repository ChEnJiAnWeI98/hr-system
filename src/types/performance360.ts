/**
 * 360 度评估 类型定义（Phase A6）
 */

/** 评估人类型 */
export type ReviewerType = 'subordinate' | 'peer' | 'cross' | 'superior'

/** 提名来源 */
export type NominationSource = 'self' | 'superior' | 'hr'

/** 关系状态 */
export type ReviewerRelationStatus = 'proposed' | 'approved' | 'rejected' | 'submitted' | 'declined'

/**
 * 360 评估关系（谁评谁）
 */
export interface ReviewerRelation {
  id: number
  /** 关联的评估任务 ID */
  evaluationId: number
  /** 被评估人 */
  subjectId: number
  subjectName: string
  subjectDept: string
  /** 周期 */
  cycleId: number
  /** 评估人 */
  reviewerId: number
  reviewerName: string
  reviewerDept: string
  /** 评估人类型 */
  reviewerType: ReviewerType
  /** 提名来源 */
  nominationSource: NominationSource
  /** 核准人 */
  approverName?: string
  approveTime?: string
  /** 状态 */
  status: ReviewerRelationStatus
  /** 拒绝/婉拒原因 */
  rejectReason?: string
  createTime: string
}

/**
 * 360 评估反馈
 */
export interface ReviewFeedback {
  id: number
  /** 对应关系 ID */
  relationId: number
  /** 各维度评分（1-5）*/
  dimensionScores: Array<{ dimension: string; score: number }>
  /** 综合评分（加权平均 × 20，0-100）*/
  overallScore: number
  /** 亮点反馈 */
  strengths?: string
  /** 改进建议 */
  improvements?: string
  /** 是否匿名（上级实名；下属/同事/跨部门默认匿名） */
  anonymous: 0 | 1
  /** 反馈质量（低于 20 字或全同分会标记 low） */
  quality: 'normal' | 'low'
  submitTime: string
}

/**
 * 被评估人的 360 聚合结果
 */
export interface ReviewAggregatedResult {
  subjectId: number
  subjectName: string
  evaluationId: number
  cycleId: number
  /** 各类型评分人数 */
  counts: Record<ReviewerType, number>
  /** 各类型平均综合分 */
  avgScores: Record<ReviewerType, number>
  /** 按模板权重加权的总分（下属 15 + 同事 30 + 跨部门 15 + 上级 40）*/
  weightedScore: number
  /** 各维度跨评估人的平均分 */
  dimensionAverage: Array<{ dimension: string; score: number }>
  /** 亮点反馈（聚合后的文字摘录）*/
  strengths: string[]
  /** 改进建议（聚合后的文字摘录）*/
  improvements: string[]
  /** 反馈提交率 */
  submissionRate: number
}

/** 查询参数 */
export interface Review360ListParams {
  evaluationId?: number
  subjectName?: string
  cycleId?: number | null
  reviewerType?: ReviewerType | ''
  status?: ReviewerRelationStatus | ''
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const REVIEWER_TYPE_MAP: Record<string, { label: string; icon: string; weight: number }> = {
  subordinate: { label: '下属', icon: '⬇️', weight: 15 },
  peer: { label: '同事', icon: '◐', weight: 30 },
  cross: { label: '跨部门', icon: '↔', weight: 15 },
  superior: { label: '上级', icon: '⬆️', weight: 40 }
}

export const NOMINATION_MAP: Record<string, string> = {
  self: '员工自选',
  superior: '上级指定',
  hr: 'HR 调整'
}

export const REL_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  proposed: { label: '待核准', type: 'warning' },
  approved: { label: '已核准', type: 'primary' },
  rejected: { label: '核准被拒', type: 'danger' },
  submitted: { label: '已提交反馈', type: 'success' },
  declined: { label: '评估人婉拒', type: 'info' }
}

/** 默认 360 评估维度（6 个通用能力项） */
export const DEFAULT_360_DIMENSIONS = [
  '协作沟通',
  '执行力',
  '专业度',
  '责任心',
  '创新突破',
  '价值观认同'
]
