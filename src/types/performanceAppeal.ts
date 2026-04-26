/**
 * 绩效申诉 类型定义（Phase C2）
 */

/** 申诉类型 */
export type AppealType =
  | 'performance_grade' // 绩效等级申诉
  | 'score' // 具体评分申诉
  | 'process' // 流程违规申诉
  | '360_review' // 360 评价申诉
  | 'other' // 其他

/** 申诉状态（流转中） */
export type AppealStatus =
  | 'submitted' // 已提交待一级审批
  | 'level1_approved' // 一级审批通过（进入二级）
  | 'level1_rejected' // 一级驳回
  | 'level2_approved' // 二级审批通过（进入二次评议）
  | 'level2_rejected' // 二级驳回
  | 'committee_reviewing' // 二次评议会中
  | 'overturned' // 推翻原结果（重审）
  | 'final_rejected' // 维持原结果
  | 'withdrawn' // 员工撤回

/** 审批结果 */
export type ApprovalResult = 'approved' | 'rejected'

/**
 * 审批记录
 */
export interface AppealApprovalRecord {
  /** 审批层级：level1 / level2 / committee */
  stage: 'level1' | 'level2' | 'committee'
  /** 审批人 */
  approverName: string
  /** 审批结果 */
  result: ApprovalResult | 'overturn' | 'maintain'
  /** 审批意见 */
  comment: string
  /** 审批时间 */
  approvalTime: string
}

/**
 * 申诉记录
 */
export interface PerformanceAppeal {
  id: number
  /** 申诉编号 */
  appealNo: string
  /** 申诉人 */
  appellantName: string
  appellantId: number
  /** 部门 */
  department: string
  /** 岗位 */
  position: string
  /** 对应周期 */
  cycleId: number
  cycleName: string
  /** 对应绩效档案 ID */
  archiveId?: number
  /** 原绩效等级 */
  originalGrade: 'S' | 'A' | 'B' | 'C' | 'D'
  /** 原综合分数 */
  originalScore: number
  /** 申诉类型 */
  appealType: AppealType
  /** 申诉事由（原评估问题） */
  reason: string
  /** 诉求（期望的处理方式） */
  expectation: string
  /** 证据材料（简单文本说明） */
  evidence?: string
  /** 当前状态 */
  status: AppealStatus
  /** 原结果是否已锁定 */
  resultLocked: boolean
  /** 发起时间 */
  submitTime: string
  /** 截止时限（5 工作日） */
  deadline: string
  /** 审批记录 */
  approvalRecords: AppealApprovalRecord[]
  /** 最终新等级（如果推翻） */
  newGrade?: 'S' | 'A' | 'B' | 'C' | 'D'
  /** 最终新分数 */
  newScore?: number
  createTime: string
  updateTime: string
}

/**
 * 查询参数
 */
export interface AppealListParams {
  appellantName?: string
  appealType?: AppealType | ''
  status?: AppealStatus | ''
  cycleId?: number | null
  page: number
  pageSize: number
}

/** ========== 字典 ========== */

export const APPEAL_TYPE_LABEL: Record<AppealType, string> = {
  performance_grade: '绩效等级申诉',
  score: '评分细项申诉',
  process: '流程违规申诉',
  '360_review': '360 评价申诉',
  other: '其他'
}

export const APPEAL_TYPE_TYPE: Record<
  AppealType,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  performance_grade: 'danger',
  score: 'warning',
  process: 'primary',
  '360_review': 'info',
  other: 'info'
}

export const APPEAL_STATUS_LABEL: Record<AppealStatus, string> = {
  submitted: '待一级审批',
  level1_approved: '一级通过/待二级',
  level1_rejected: '一级已驳回',
  level2_approved: '二级通过/待评议',
  level2_rejected: '二级已驳回',
  committee_reviewing: '二次评议中',
  overturned: '已推翻重审',
  final_rejected: '最终驳回',
  withdrawn: '已撤回'
}

export const APPEAL_STATUS_TYPE: Record<
  AppealStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  submitted: 'warning',
  level1_approved: 'primary',
  level1_rejected: 'info',
  level2_approved: 'primary',
  level2_rejected: 'info',
  committee_reviewing: 'warning',
  overturned: 'success',
  final_rejected: 'danger',
  withdrawn: 'info'
}

/** 状态 → 可操作审批层级 */
export function getActiveStage(status: AppealStatus): 'level1' | 'level2' | 'committee' | null {
  if (status === 'submitted') return 'level1'
  if (status === 'level1_approved') return 'level2'
  if (status === 'level2_approved' || status === 'committee_reviewing') return 'committee'
  return null
}
