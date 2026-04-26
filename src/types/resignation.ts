/**
 * 离职管理类型定义
 */

/**
 * 离职类型枚举
 */
export enum ResignationType {
  /** 主动离职 */
  ACTIVE = 1,
  /** 被动离职 */
  PASSIVE = 2,
  /** 合同到期 */
  CONTRACT_EXPIRY = 3,
  /** 试用期不合格 */
  PROBATION_FAIL = 4
}

/**
 * 离职原因枚举
 */
export enum ResignationReason {
  /** 个人发展 */
  PERSONAL_DEVELOPMENT = 1,
  /** 薪资待遇 */
  SALARY = 2,
  /** 工作压力 */
  WORK_PRESSURE = 3,
  /** 家庭原因 */
  FAMILY = 4,
  /** 其他 */
  OTHER = 5
}

/**
 * 离职申请状态枚举
 */
export enum ResignationStatus {
  /** 待审批 */
  PENDING = 1,
  /** 审批中 */
  APPROVING = 2,
  /** 已通过 */
  APPROVED = 3,
  /** 已拒绝 */
  REJECTED = 4,
  /** 已完成 */
  COMPLETED = 5
}

/**
 * 审批结果枚举
 */
export enum ApprovalResult {
  /** 通过 */
  APPROVED = 1,
  /** 拒绝 */
  REJECTED = 2,
  /** 退回修改 */
  RETURNED = 3
}

/**
 * 审批记录
 */
export interface ApprovalRecord {
  /** ID */
  id: number
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: string
  /** 审批结果 */
  result: number
  /** 审批意见 */
  opinion?: string
}

/**
 * 交接清单项
 */
export interface HandoverItem {
  /** ID */
  id: number
  /** 交接类型 */
  handoverType: string
  /** 交接内容 */
  handoverContent: string
  /** 交接人 */
  handoverPerson: string
  /** 交接时间 */
  handoverTime: string
  /** 交接说明 */
  remark?: string
}

/**
 * 手续清单项
 */
export interface ProcedureItem {
  /** ID */
  id: number
  /** 手续项目 */
  itemName: string
  /** 是否完成 */
  completed: boolean
  /** 办理人 */
  handler?: string
  /** 办理时间 */
  handleTime?: string
  /** 备注说明 */
  remark?: string
}

/**
 * 离职申请
 */
export interface Resignation {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeNo: string
  /** 所属部门ID */
  departmentId: number
  /** 所属部门名称 */
  departmentName: string
  /** 岗位名称 */
  positionName: string
  /** 离职类型 */
  resignationType: number
  /** 离职原因 */
  resignationReason: number
  /** 期望离职日期 */
  expectedResignationDate: string
  /** 工作交接人 */
  handoverPerson?: string
  /** 详细说明 */
  detailDescription?: string
  /** 申请状态 */
  status: number
  /** 申请时间 */
  applyTime: string
  /** 审批记录 */
  approvalRecords?: ApprovalRecord[]
  /** 交接清单 */
  handoverChecklist?: HandoverItem[]
  /** 手续清单 */
  procedureChecklist?: ProcedureItem[]
}

/**
 * 离职申请列表查询参数
 */
export interface ResignationListParams {
  /** 关键字（员工姓名或工号） */
  keyword?: string
  /** 申请状态 */
  status?: number | string | null
  /** 所属部门ID */
  departmentId?: number | string | null
  /** 申请开始时间 */
  applyTimeStart?: string
  /** 申请结束时间 */
  applyTimeEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 审批离职申请参数
 */
export interface ApproveResignationParams {
  /** 离职申请ID */
  id: number
  /** 审批结果 */
  result: number
  /** 审批意见 */
  opinion?: string
}

/**
 * 更新交接清单参数
 */
export interface UpdateHandoverParams {
  /** 离职申请ID */
  id: number
  /** 交接清单 */
  handoverChecklist: HandoverItem[]
}

/**
 * 完成手续参数
 */
export interface CompleteProceduresParams {
  /** 离职申请ID */
  id: number
  /** 手续清单 */
  procedureChecklist: ProcedureItem[]
}
