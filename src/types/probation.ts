/**
 * 试用期管理类型定义
 */

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
  /** 转正日期 */
  regularDate: string
  /** 试用期状态：0-试用中，1-已转正，2-延长试用，3-不合格 */
  status: number
  /** 试用期状态名称 */
  statusName: string
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
  /** 不合格原因 */
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
  status?: number | string | null
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
  /** 是否通过：1-通过，2-延长试用，3-不合格 */
  result: number
  /** 延长试用期时长（月） */
  extensionMonths?: number
  /** 延长原因 */
  extensionReason?: string
  /** 不合格原因 */
  failureReason?: string
}
