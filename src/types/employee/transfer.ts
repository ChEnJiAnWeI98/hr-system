/**
 * 人员异动 类型定义（Phase 3.1）
 *
 * ⚠️ 模块职责划分（V2.0 业界对齐 SAP / Workday / 北森）：
 * - 入职：由【招聘管理 / 入职办理】处理，完成入职时自动创建员工档案（不走异动）
 * - 离职：由【员工管理 / 离职管理】专门处理（Phase 3.2）
 * - 返聘：由【招聘管理 / 入职办理】处理（标记"返聘入职"新建档案）
 *
 * 异动模块只处理【已在职员工的变动】：
 * 转正/调动/晋升/降级/调薪/合同续签/借调
 */

/** 异动类型（字典 TRANSFER_TYPE） */
export type TransferType =
  | 'regularization' // 转正
  | 'transfer' // 调动
  | 'promotion' // 晋升
  | 'demotion' // 降级
  | 'salary_adjust' // 调薪
  | 'renewal' // 合同续签
  | 'secondment' // 借调

/** 异动流程状态 */
export type TransferStatus =
  | 'draft' // 草稿
  | 'level1_reviewing' // 一级审批中
  | 'level1_rejected' // 一级已驳回
  | 'level2_reviewing' // 二级审批中
  | 'level2_rejected' // 二级已驳回
  | 'pending_effect' // 待生效
  | 'effective' // 已生效
  | 'cancelled' // 已撤销
  | 'archived' // 已归档

/**
 * 审批节点
 */
export interface TransferApproval {
  stage: 'level1' | 'level2'
  /** 审批人姓名 */
  approverName: string
  /** 审批人 ID */
  approverId: number
  /** 结果 */
  result: 'pending' | 'approved' | 'rejected'
  /** 意见 */
  comment?: string
  /** 审批时间 */
  approvalTime?: string
}

/**
 * 异动记录
 */
export interface EmployeeTransfer {
  id: number
  /** 异动单号 */
  transferNo: string
  /** 员工 */
  employeeId: number
  employeeName: string
  /** 异动类型 */
  transferType: TransferType
  /** 变更前 */
  fromOrgId?: number
  fromOrgName?: string
  fromPositionId?: number
  fromPositionName?: string
  fromLevel?: string
  fromSalary?: number
  /** 变更后 */
  toOrgId?: number
  toOrgName?: string
  toPositionId?: number
  toPositionName?: string
  toLevel?: string
  toSalary?: number
  /** 流程状态 */
  status: TransferStatus
  /** 生效日期 */
  effectiveDate: string
  /** 提交时间 */
  submitTime: string
  /** 发起人 */
  submitterId: number
  submitterName: string
  /** 审批流水 */
  approvals: TransferApproval[]
  /** 异动原因 */
  reason: string
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 查询参数
 */
export interface TransferListParams {
  transferNo?: string
  employeeName?: string
  transferType?: TransferType | ''
  status?: TransferStatus | ''
  dateRange?: [string, string]
  page: number
  pageSize: number
}

/** ========== 字典 ========== */

export const TRANSFER_STATUS_LABEL: Record<TransferStatus, string> = {
  draft: '草稿',
  level1_reviewing: '一级审批中',
  level1_rejected: '一级已驳回',
  level2_reviewing: '二级审批中',
  level2_rejected: '二级已驳回',
  pending_effect: '待生效',
  effective: '已生效',
  cancelled: '已撤销',
  archived: '已归档'
}

export const TRANSFER_STATUS_TYPE: Record<
  TransferStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  draft: 'info',
  level1_reviewing: 'warning',
  level1_rejected: 'danger',
  level2_reviewing: 'warning',
  level2_rejected: 'danger',
  pending_effect: 'primary',
  effective: 'success',
  cancelled: 'info',
  archived: 'info'
}

export const TRANSFER_TYPE_LABEL: Record<TransferType, string> = {
  regularization: '转正',
  transfer: '调动',
  promotion: '晋升',
  demotion: '降级',
  salary_adjust: '调薪',
  renewal: '合同续签',
  secondment: '借调'
}

export const TRANSFER_TYPE_COLOR: Record<
  TransferType,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  regularization: 'success',
  transfer: 'primary',
  promotion: 'success',
  demotion: 'warning',
  salary_adjust: 'primary',
  renewal: 'info',
  secondment: 'info'
}

/**
 * 异动类型 → 需要填写哪些变更字段
 */
export const TRANSFER_TYPE_FIELDS: Record<TransferType, Array<'org' | 'position' | 'level' | 'salary'>> = {
  regularization: ['salary'],
  transfer: ['org', 'position'],
  promotion: ['position', 'level', 'salary'],
  demotion: ['position', 'level', 'salary'],
  salary_adjust: ['salary'],
  renewal: [],
  secondment: ['org']
}

/** 判断某状态是否允许继续流转 */
export function isTransferActive(status: TransferStatus): boolean {
  return (
    status === 'level1_reviewing' ||
    status === 'level2_reviewing' ||
    status === 'pending_effect'
  )
}

/** 是否为终态 */
export function isTransferFinal(status: TransferStatus): boolean {
  return (
    status === 'effective' ||
    status === 'cancelled' ||
    status === 'archived' ||
    status === 'level1_rejected' ||
    status === 'level2_rejected'
  )
}
