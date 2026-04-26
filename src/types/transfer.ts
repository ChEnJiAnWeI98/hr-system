/**
 * 员工异动管理类型定义
 */

/** 异动类型枚举 */
export enum TransferType {
  /** 调岗 */
  POSITION_CHANGE = 1,
  /** 晋升 */
  PROMOTION = 2,
  /** 降职 */
  DEMOTION = 3,
  /** 调薪 */
  SALARY_ADJUSTMENT = 4,
  /** 转正 */
  CONVERSION = 5,
  /** 试用期延长 */
  PROBATION_EXTENSION = 6
}

/** 异动状态枚举 */
export enum TransferStatus {
  /** 待审批 */
  PENDING = 1,
  /** 审批中 */
  APPROVING = 2,
  /** 已通过 */
  APPROVED = 3,
  /** 已拒绝 */
  REJECTED = 4,
  /** 已撤回 */
  WITHDRAWN = 5,
  /** 已生效 */
  EFFECTIVE = 6
}

/** 员工异动 */
export interface Transfer {
  id: number
  transferNo: string // 异动编号 TR + 年月日 + 4位流水号
  employeeId: number
  employeeNo: string
  employeeName: string
  type: number // 异动类型
  applyDate: string // 申请日期
  effectiveDate: string // 生效日期
  status: number // 状态

  // 调岗信息
  originalDepartmentId?: number
  originalDepartmentName?: string
  originalPositionId?: number
  originalPositionName?: string
  newDepartmentId?: number
  newDepartmentName?: string
  newPositionId?: number
  newPositionName?: string

  // 调薪信息
  originalSalary?: number
  newSalary?: number
  adjustmentAmount?: number
  adjustmentReason?: string

  // 审批信息
  applicantId: number
  applicantName: string
  departmentApproverId?: number
  departmentApproverName?: string
  departmentApprovalTime?: string
  departmentApprovalComment?: string
  hrApproverId?: number
  hrApproverName?: string
  hrApprovalTime?: string
  hrApprovalComment?: string

  reason: string // 异动原因
  remark?: string
  createTime: string
  updateTime: string
}

/** 列表查询参数 */
export interface TransferListParams {
  keyword?: string // 员工姓名/工号/异动编号
  type?: number | string | null
  status?: number | string | null
  applyDateStart?: string
  applyDateEnd?: string
  effectiveDateStart?: string
  effectiveDateEnd?: string
  page: number
  pageSize: number
}
