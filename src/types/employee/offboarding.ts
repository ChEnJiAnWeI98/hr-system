/**
 * 离职管理 类型定义（Phase 3.2）
 */

/** 离职类型（字典 LEAVE_REASON_TYPE） */
export type OffboardingType =
  | 'voluntary' // 主动离职
  | 'involuntary' // 被动离职
  | 'negotiated' // 协商离职
  | 'retirement' // 退休
  | 'contract_end' // 合同到期
  | 'terminated_cause' // 辞退
  | 'probation_failed' // 试用未通过

/** 离职流程状态 */
export type OffboardingStatus =
  | 'draft' // 草稿
  | 'dept_reviewing' // 部门审批中
  | 'dept_rejected' // 部门驳回
  | 'hr_reviewing' // HR 审批中
  | 'hr_rejected' // HR 驳回
  | 'handover' // 交接中
  | 'pending_last_day' // 待离职日
  | 'completed' // 已完成
  | 'cancelled' // 已取消

/** 交接项分类 */
export type HandoverCategory =
  | 'work' // 工作交接
  | 'asset' // 财产归还
  | 'access' // 账号权限
  | 'finance' // 财务结算

/** 交接项状态 */
export type HandoverItemStatus = 'pending' | 'in_progress' | 'completed'

/**
 * 交接清单项
 */
export interface HandoverItem {
  id: number
  category: HandoverCategory
  /** 交接内容描述（如"客户对接交接给李某"） */
  content: string
  /** 接收方员工 ID */
  receiverId?: number
  receiverName?: string
  /** 状态 */
  status: HandoverItemStatus
  /** 完成时间 */
  completedTime?: string
  remark?: string
}

/**
 * 离职面谈记录
 */
export interface ExitInterview {
  /** 面谈官（HR） */
  interviewerName: string
  interviewerId: number
  /** 面谈时间 */
  interviewTime: string
  /** 离职原因（详细） */
  mainReason: string
  /** 满意度 1-5 */
  satisfaction: number
  /** 公司改进建议 */
  suggestions: string
  /** 是否愿意推荐公司 */
  wouldRecommend: boolean
  /** 是否接受返聘 */
  openToRehire: boolean
  /** 面谈备注 */
  remark?: string
}

/**
 * 离职申请
 */
export interface EmployeeOffboarding {
  id: number
  /** 离职单号 */
  offboardingNo: string
  /** 员工 */
  employeeId: number
  employeeName: string
  orgName: string
  positionName: string
  /** 离职类型 */
  offboardingType: OffboardingType
  /** 离职原因（简要） */
  reason: string
  /** 离职意向日 */
  expectedLastDay: string
  /** 实际离职日（完成时写入） */
  actualLastDay?: string
  /** 流程状态 */
  status: OffboardingStatus
  /** 部门审批 */
  deptApproverName?: string
  deptApproverId?: number
  deptApprovalTime?: string
  deptApprovalResult?: 'approved' | 'rejected'
  deptApprovalComment?: string
  /** HR 审批 */
  hrApproverName?: string
  hrApproverId?: number
  hrApprovalTime?: string
  hrApprovalResult?: 'approved' | 'rejected'
  hrApprovalComment?: string
  /** 交接清单 */
  handoverItems: HandoverItem[]
  /** 离职面谈 */
  exitInterview?: ExitInterview
  /** 是否出具离职证明 */
  certificateIssued: boolean
  certificateIssueTime?: string
  submitTime: string
  createTime: string
  updateTime: string
}

/** 查询参数 */
export interface OffboardingListParams {
  offboardingNo?: string
  employeeName?: string
  offboardingType?: OffboardingType | ''
  status?: OffboardingStatus | ''
  page: number
  pageSize: number
}

/** ========== 字典 ========== */

export const OFFBOARDING_STATUS_LABEL: Record<OffboardingStatus, string> = {
  draft: '草稿',
  dept_reviewing: '部门审批中',
  dept_rejected: '部门已驳回',
  hr_reviewing: 'HR 审批中',
  hr_rejected: 'HR 已驳回',
  handover: '交接中',
  pending_last_day: '待离职日',
  completed: '已完成',
  cancelled: '已取消'
}

export const OFFBOARDING_STATUS_TYPE: Record<
  OffboardingStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  draft: 'info',
  dept_reviewing: 'warning',
  dept_rejected: 'danger',
  hr_reviewing: 'warning',
  hr_rejected: 'danger',
  handover: 'primary',
  pending_last_day: 'primary',
  completed: 'success',
  cancelled: 'info'
}

export const OFFBOARDING_TYPE_LABEL: Record<OffboardingType, string> = {
  voluntary: '主动离职',
  involuntary: '被动离职',
  negotiated: '协商离职',
  retirement: '退休',
  contract_end: '合同到期',
  terminated_cause: '辞退',
  probation_failed: '试用未通过'
}

export const OFFBOARDING_TYPE_COLOR: Record<
  OffboardingType,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  voluntary: 'warning',
  involuntary: 'danger',
  negotiated: 'info',
  retirement: 'info',
  contract_end: 'info',
  terminated_cause: 'danger',
  probation_failed: 'danger'
}

export const HANDOVER_CATEGORY_LABEL: Record<HandoverCategory, string> = {
  work: '工作交接',
  asset: '财产归还',
  access: '账号权限',
  finance: '财务结算'
}

export const HANDOVER_STATUS_LABEL: Record<HandoverItemStatus, string> = {
  pending: '未开始',
  in_progress: '进行中',
  completed: '已完成'
}

export const HANDOVER_STATUS_TYPE: Record<
  HandoverItemStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  pending: 'info',
  in_progress: 'warning',
  completed: 'success'
}

/** 交接清单默认模板（发起离职时自动生成） */
export const DEFAULT_HANDOVER_TEMPLATE: Omit<HandoverItem, 'id'>[] = [
  { category: 'work', content: '待处理任务与项目交接', status: 'pending' },
  { category: 'work', content: '客户/合作方对接', status: 'pending' },
  { category: 'work', content: '项目文档与代码权限', status: 'pending' },
  { category: 'asset', content: '工牌 / 门禁卡', status: 'pending' },
  { category: 'asset', content: '办公电脑 / 移动设备', status: 'pending' },
  { category: 'asset', content: '办公用品 / 钥匙 / 车位卡', status: 'pending' },
  { category: 'access', content: '企业邮箱', status: 'pending' },
  { category: 'access', content: '企业微信 / 钉钉账号', status: 'pending' },
  { category: 'access', content: '业务系统账号权限', status: 'pending' },
  { category: 'finance', content: '工资 / 加班费结算', status: 'pending' },
  { category: 'finance', content: '报销单据提交', status: 'pending' },
  { category: 'finance', content: '违约金 / 培训费确认', status: 'pending' }
]
