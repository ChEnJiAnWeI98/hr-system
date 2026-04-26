/**
 * 证件到期提醒类型定义
 */

/**
 * 证件到期提醒
 */
export interface CertificateReminder {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeNo: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 证件类型 */
  certificateType: string
  /** 证件号码 */
  certificateNumber: string
  /** 发证日期 */
  issueDate: string
  /** 到期日期 */
  expiryDate: string
  /** 剩余天数 */
  remainingDays: number
  /** 提醒状态：1-未提醒，2-已提醒，3-已过期 */
  reminderStatus: number
  /** 提醒状态名称 */
  reminderStatusName: string
  /** 提醒次数 */
  reminderCount: number
  /** 最后提醒时间 */
  lastReminderTime?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 证件到期提醒列表查询参数
 */
export interface CertificateReminderListParams {
  /** 员工工号 */
  employeeNo?: string
  /** 员工姓名 */
  employeeName?: string
  /** 证件类型 */
  certificateType?: string
  /** 提醒状态 */
  reminderStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
