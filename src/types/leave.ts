/**
 * 假勤管理模块类型定义
 */

/**
 * 假期类型配置
 */
export interface LeaveType {
  /** ID */
  id: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 假期类型编码 */
  leaveTypeCode: string
  /** 计量单位 (0=天, 1=小时) */
  unit: number
  /** 是否需要审批 (0=否, 1=是) */
  needApproval: number
  /** 是否扣薪 (0=否, 1=是) */
  deductSalary: number
  /** 是否计入出勤 (0=否, 1=是) */
  countAsAttendance: number
  /** 最小请假单位 (天/小时) */
  minUnit: number
  /** 最大请假天数 */
  maxDays: number
  /** 是否允许跨年 (0=否, 1=是) */
  allowCrossYear: number
  /** 是否允许累积 (0=否, 1=是) */
  allowAccumulate: number
  /** 有效期 (月) */
  validityPeriod: number
  /** 规则说明 */
  ruleDescription: string
  /** 状态 (0=禁用, 1=启用) */
  status: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 假期类型列表查询参数
 */
export interface LeaveTypeListParams {
  /** 假期类型名称 */
  leaveTypeName?: string
  /** 假期类型编码 */
  leaveTypeCode?: string
  /** 状态 - 支持 number | string | null */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 假期额度
 */
export interface LeaveQuota {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeCode: string
  /** 部门名称 */
  departmentName: string
  /** 假期类型ID */
  leaveTypeId: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 总额度 (天/小时) */
  totalQuota: number
  /** 已使用额度 (天/小时) */
  usedQuota: number
  /** 剩余额度 (天/小时) */
  remainingQuota: number
  /** 年份 */
  year: number
  /** 发放原因 */
  grantReason: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 假期额度列表查询参数
 */
export interface LeaveQuotaListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工工号 */
  employeeCode?: string
  /** 部门名称 */
  departmentName?: string
  /** 假期类型ID - 支持 number | string | null */
  leaveTypeId?: number | string | null
  /** 年份 - 支持 number | string | null */
  year?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 请假申请
 */
export interface LeaveApplication {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeCode: string
  /** 部门名称 */
  departmentName: string
  /** 假期类型ID */
  leaveTypeId: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 请假天数 */
  leaveDays: number
  /** 请假原因 */
  reason: string
  /** 附件 (JSON数组) */
  attachments: string
  /** 审批状态 (0=待审批, 1=已批准, 2=已拒绝) */
  approvalStatus: number
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: string
  /** 审批意见 */
  approvalComment: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 请假申请列表查询参数
 */
export interface LeaveApplicationListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工工号 */
  employeeCode?: string
  /** 部门名称 */
  departmentName?: string
  /** 假期类型ID - 支持 number | string | null */
  leaveTypeId?: number | string | null
  /** 审批状态 - 支持 number | string | null */
  approvalStatus?: number | string | null
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 调休记录
 */
export interface TimeOff {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeCode: string
  /** 部门名称 */
  departmentName: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 调休天数 */
  timeOffDays: number
  /** 来源 (0=加班调休, 1=节假日加班调休) */
  source: number
  /** 调休原因 */
  reason: string
  /** 审批状态 (0=待审批, 1=已批准, 2=已拒绝) */
  approvalStatus: number
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: string
  /** 审批意见 */
  approvalComment: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 调休记录列表查询参数
 */
export interface TimeOffListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工工号 */
  employeeCode?: string
  /** 部门名称 */
  departmentName?: string
  /** 来源 - 支持 number | string | null */
  source?: number | string | null
  /** 审批状态 - 支持 number | string | null */
  approvalStatus?: number | string | null
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 假期发放记录
 */
export interface LeaveGrantRecord {
  /** 发放日期 */
  grantDate: string
  /** 发放额度 */
  grantQuota: number
  /** 发放原因 */
  grantReason: string
  /** 操作人 */
  operator: string
}

/**
 * 假期使用记录
 */
export interface LeaveUsageRecord {
  /** 使用日期 */
  usageDate: string
  /** 使用额度 */
  usageQuota: number
  /** 使用原因 */
  usageReason: string
  /** 关联申请ID */
  applicationId: number
}

/**
 * 假期调整记录
 */
export interface LeaveAdjustRecord {
  /** 调整日期 */
  adjustDate: string
  /** 调整额度 (正数=增加, 负数=减少) */
  adjustQuota: number
  /** 调整原因 */
  adjustReason: string
  /** 操作人 */
  operator: string
}

/**
 * 假期台账
 */
export interface LeaveLedger {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeCode: string
  /** 部门名称 */
  departmentName: string
  /** 假期类型ID */
  leaveTypeId: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 年份 */
  year: number
  /** 总额度 */
  totalQuota: number
  /** 已使用额度 */
  usedQuota: number
  /** 剩余额度 */
  remainingQuota: number
  /** 发放记录 */
  grantRecords?: LeaveGrantRecord[]
  /** 使用记录 */
  usageRecords?: LeaveUsageRecord[]
  /** 调整记录 */
  adjustRecords?: LeaveAdjustRecord[]
}

/**
 * 假期台账列表查询参数
 */
export interface LeaveLedgerListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 员工工号 */
  employeeCode?: string
  /** 部门名称 */
  departmentName?: string
  /** 假期类型ID - 支持 number | string | null */
  leaveTypeId?: number | string | null
  /** 年份 - 支持 number | string | null */
  year?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
