/**
 * 考勤管理相关类型定义
 */

/**
 * 考勤规则类型
 */
export interface AttendanceRule {
  /** 规则ID */
  id: number
  /** 规则名称 */
  name: string
  /** 规则类型：1-固定班制 2-弹性工作制 3-排班制 */
  type: number
  /** 规则类型名称 */
  typeName?: string
  /** 适用部门ID列表 */
  departmentIds: number[]
  /** 适用部门名称 */
  departmentNames?: string
  /** 上班时间 */
  workStartTime: string
  /** 下班时间 */
  workEndTime: string
  /** 弹性时间（分钟） */
  flexibleMinutes?: number
  /** 是否需要打卡 */
  requireClockIn: boolean
  /** 迟到几分钟算迟到 */
  lateMinutes: number
  /** 早退几分钟算早退 */
  earlyMinutes: number
  /** 旷工几小时算旷工 */
  absentHours: number
  /** 状态：1-启用 0-禁用 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 考勤规则查询参数
 */
export interface AttendanceRuleListParams {
  /** 规则名称 */
  name?: string
  /** 规则类型 */
  type?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 打卡记录
 */
export interface AttendanceRecord {
  /** 记录ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 考勤日期 */
  attendanceDate: string
  /** 上班打卡时间 */
  clockInTime?: string
  /** 下班打卡时间 */
  clockOutTime?: string
  /** 上班打卡地点 */
  clockInLocation?: string
  /** 下班打卡地点 */
  clockOutLocation?: string
  /** 上班打卡照片 */
  clockInPhoto?: string
  /** 下班打卡照片 */
  clockOutPhoto?: string
  /** 工作时长（小时） */
  workHours: number
  /** 迟到时长（分钟） */
  lateMinutes: number
  /** 早退时长（分钟） */
  earlyMinutes: number
  /** 是否旷工 */
  isAbsent: boolean
  /** 状态：1-正常 2-迟到 3-早退 4-旷工 5-请假 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 打卡记录查询参数
 */
export interface AttendanceRecordListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 考勤日期开始 */
  attendanceDateStart?: string
  /** 考勤日期结束 */
  attendanceDateEnd?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 加班申请
 */
export interface OvertimeApplication {
  /** 申请ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 加班日期 */
  overtimeDate: string
  /** 加班开始时间 */
  startTime: string
  /** 加班结束时间 */
  endTime: string
  /** 加班时长（小时） */
  overtimeHours: number
  /** 加班类型：1-工作日加班 2-周末加班 3-节假日加班 */
  overtimeType: number
  /** 加班类型名称 */
  overtimeTypeName?: string
  /** 补偿方式：1-加班费 2-调休 */
  compensationType: number
  /** 补偿方式名称 */
  compensationTypeName?: string
  /** 加班原因 */
  reason: string
  /** 审批状态：1-待审批 2-已通过 3-已拒绝 */
  approvalStatus: number
  /** 审批状态名称 */
  approvalStatusName?: string
  /** 审批人 */
  approver?: string
  /** 审批时间 */
  approvalTime?: string
  /** 审批意见 */
  approvalComment?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 加班申请查询参数
 */
export interface OvertimeApplicationListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 加班日期开始 */
  overtimeDateStart?: string
  /** 加班日期结束 */
  overtimeDateEnd?: string
  /** 加班类型 */
  overtimeType?: number | string | null
  /** 审批状态 */
  approvalStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 外勤记录
 */
export interface FieldWorkRecord {
  /** 记录ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 外勤日期 */
  fieldWorkDate: string
  /** 外勤开始时间 */
  startTime: string
  /** 外勤结束时间 */
  endTime?: string
  /** 外勤地点 */
  location: string
  /** GPS坐标 */
  gpsCoordinates: string
  /** 外勤事由 */
  reason: string
  /** 外勤照片 */
  photos?: string
  /** 状态：1-进行中 2-已结束 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 外勤记录查询参数
 */
export interface FieldWorkRecordListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 外勤日期开始 */
  fieldWorkDateStart?: string
  /** 外勤日期结束 */
  fieldWorkDateEnd?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 补卡申请
 */
export interface MakeupClockInApplication {
  /** 申请ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 补卡日期 */
  makeupDate: string
  /** 补卡时间 */
  makeupTime: string
  /** 补卡类型：1-上班卡 2-下班卡 */
  makeupType: number
  /** 补卡类型名称 */
  makeupTypeName?: string
  /** 补卡原因 */
  reason: string
  /** 证明材料 */
  attachments?: string
  /** 审批状态：1-待审批 2-已通过 3-已拒绝 */
  approvalStatus: number
  /** 审批状态名称 */
  approvalStatusName?: string
  /** 审批人 */
  approver?: string
  /** 审批时间 */
  approvalTime?: string
  /** 审批意见 */
  approvalComment?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 补卡申请查询参数
 */
export interface MakeupClockInApplicationListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 补卡日期开始 */
  makeupDateStart?: string
  /** 补卡日期结束 */
  makeupDateEnd?: string
  /** 审批状态 */
  approvalStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 考勤统计
 */
export interface AttendanceStatistics {
  /** 统计ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 统计月份 */
  statisticsMonth: string
  /** 应出勤天数（工作日天数） */
  workDays: number
  /** 应出勤天数 */
  shouldAttendDays: number
  /** 实际出勤天数 */
  actualAttendDays: number
  /** 实际工作天数 */
  actualWorkDays: number
  /** 正常天数 */
  normalDays: number
  /** 迟到次数 */
  lateTimes: number
  /** 迟到天数 */
  lateDays: number
  /** 早退次数 */
  earlyTimes: number
  /** 早退天数 */
  earlyDays: number
  /** 旷工次数 */
  absentTimes: number
  /** 旷工天数 */
  absentDays: number
  /** 请假天数 */
  leaveDays: number
  /** 迟到总分钟数 */
  totalLateMinutes: number
  /** 总工作时长（小时） */
  totalWorkHours: number
  /** 加班天数 */
  overtimeDays: number
  /** 加班总时长（小时） */
  totalOvertimeHours: number
  /** 加班时长（小时） */
  overtimeHours: number
  /** 外勤天数 */
  fieldWorkDays: number
  /** 外勤次数 */
  fieldWorkTimes: number
  /** 补卡次数 */
  makeupClockInCount: number
  /** 补卡次数 */
  makeupTimes: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 考勤统计查询参数
 */
export interface AttendanceStatisticsListParams {
  /** 员工工号 */
  employeeCode?: string
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 统计月份 */
  statisticsMonth?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
