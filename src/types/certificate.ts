/**
 * 证件到期提醒类型定义
 */

/**
 * 证件到期提醒记录
 */
export interface CertificateReminder {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 所属部门 */
  departmentName: string
  /** 证件类型：1-身份证，2-劳动合同，3-资质证书，4-健康证，5-其他 */
  certificateType: number
  /** 证件类型名称 */
  certificateTypeName: string
  /** 证件号码 */
  certificateNumber: string
  /** 有效期 */
  expiryDate: string
  /** 剩余天数 */
  remainingDays: number
  /** 紧急程度：1-正常（>30天），2-提醒（15-30天），3-警告（7-15天），4-紧急（<7天），5-已过期 */
  urgencyLevel: number
  /** 紧急程度名称 */
  urgencyLevelName: string
  /** 提醒状态：1-待处理，2-已提醒，3-已更新，4-已忽略 */
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
 * 证件更新记录
 */
export interface CertificateUpdateRecord {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 证件类型 */
  certificateType: number
  /** 证件类型名称 */
  certificateTypeName: string
  /** 旧证件号码 */
  oldCertificateNumber: string
  /** 新证件号码 */
  newCertificateNumber: string
  /** 旧有效期 */
  oldExpiryDate: string
  /** 新有效期 */
  newExpiryDate: string
  /** 更新原因 */
  updateReason: string
  /** 更新人 */
  updatedBy: string
  /** 更新时间 */
  updateTime: string
  /** 附件 */
  attachment?: string
}

/**
 * 证件到期提醒列表查询参数
 */
export interface CertificateReminderListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 证件类型 */
  certificateType?: number | string | null
  /** 紧急程度 */
  urgencyLevel?: number | string | null
  /** 提醒状态 */
  reminderStatus?: number | string | null
  /** 到期日期开始 */
  expiryDateStart?: string
  /** 到期日期结束 */
  expiryDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 证件更新表单
 */
export interface CertificateUpdateForm {
  /** ID（更新时） */
  id?: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName?: string
  /** 部门名称 */
  departmentName?: string
  /** 证件类型 */
  certificateType: number
  /** 证件号码 */
  certificateNumber?: string
  /** 有效期 */
  expiryDate?: string
  /** 新证件号码 */
  newCertificateNumber: string
  /** 新有效期 */
  newExpiryDate: string
  /** 更新原因 */
  updateReason: string
  /** 备注 */
  remark?: string
  /** 附件 */
  attachment?: string
}

/**
 * 批量提醒参数
 */
export interface BatchReminderParams {
  /** 证件提醒ID列表 */
  ids: number[]
  /** 提醒方式：1-系统消息，2-邮件，3-企业微信 */
  reminderMethod: number[]
}

/**
 * 证件统计数据
 */
export interface CertificateStatistics {
  /** 总数 */
  total: number
  /** 待处理数 */
  pending: number
  /** 已提醒数 */
  reminded: number
  /** 已更新数 */
  updated: number
  /** 已过期数 */
  expired: number
  /** 紧急数（<7天） */
  urgent: number
  /** 警告数（7-15天） */
  warning: number
  /** 提醒数（15-30天） */
  reminder: number
  /** 正常数（>30天） */
  normal: number
}
