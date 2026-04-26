/**
 * 试用期管理类型定义（Phase 4.x 对齐市面主流术语重构）
 *
 * 状态术语对照（对齐北森/Workday/SAP 主流做法）：
 *   trial    = 试用期（入职默认）
 *   extended = 延长试用期（考核未通过但决定给机会）
 *   passed   = 转正（考核通过，员工档案状态变为 regular）
 *   failed   = 试用未通过（终态，触发离职流程）
 */

/** 试用期状态（字符串枚举） */
export type ProbationStatus = 'trial' | 'extended' | 'passed' | 'failed'

/** 状态中文 Label */
export const PROBATION_STATUS_LABEL: Record<ProbationStatus, string> = {
  trial: '试用期',
  extended: '延长试用期',
  passed: '转正',
  failed: '试用未通过'
}

/** 状态标签颜色 */
export const PROBATION_STATUS_TYPE: Record<
  ProbationStatus,
  'primary' | 'warning' | 'success' | 'danger' | 'info'
> = {
  trial: 'primary',
  extended: 'warning',
  passed: 'success',
  failed: 'danger'
}

/** 转正评估结果 */
export type EvaluationResult = 'passed' | 'extended' | 'failed'

/**
 * 试用期记录
 */
export interface Probation {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeCode: string
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 岗位ID */
  positionId: number
  /** 岗位名称 */
  positionName: string
  /** 入职日期 */
  entryDate: string
  /** 试用期时长（月） */
  probationMonths: number
  /** 转正日期（预计或实际） */
  regularDate: string
  /** 试用期状态 */
  status: ProbationStatus
  /** 工作能力评分 */
  workAbilityScore?: number
  /** 工作态度评分 */
  workAttitudeScore?: number
  /** 团队协作评分 */
  teamworkScore?: number
  /** 评估得分 */
  evaluationScore?: number
  /** 评估意见 */
  evaluationComment?: string
  /** 评估人ID */
  evaluatorId?: number
  /** 评估人姓名 */
  evaluatorName?: string
  /** 评估时间 */
  evaluationTime?: string
  /** 延长试用期时长（月） */
  extensionMonths?: number
  /** 延长原因 */
  extensionReason?: string
  /** 试用未通过原因 */
  failureReason?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 试用期列表查询参数
 */
export interface ProbationListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工工号 */
  employeeCode?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 试用期状态 */
  status?: ProbationStatus | ''
  /** 转正日期开始 */
  regularDateStart?: string
  /** 转正日期结束 */
  regularDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 试用期表单
 */
export interface ProbationForm {
  /** ID（编辑时） */
  id?: number
  /** 员工ID */
  employeeId: number
  /** 入职日期 */
  entryDate: string
  /** 试用期时长（月） */
  probationMonths: number
  /** 备注 */
  remark?: string
}

/**
 * 转正评估表单
 */
export interface RegularizationForm {
  /** ID */
  id: number
  /** 评估得分 */
  evaluationScore: number
  /** 评估意见 */
  evaluationComment: string
  /** 评估结果：passed=转正 / extended=延长试用期 / failed=试用未通过 */
  result: EvaluationResult
  /** 延长试用期时长（月） */
  extensionMonths?: number
  /** 延长原因 */
  extensionReason?: string
  /** 试用未通过原因 */
  failureReason?: string
}
