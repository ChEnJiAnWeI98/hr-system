/**
 * 员工自助模块类型定义
 */

/**
 * 员工个人信息
 */
export interface EmployeeProfile {
  /** 员工ID */
  id: number
  /** 员工姓名 */
  name: string
  /** 员工工号 */
  employeeNo: string
  /** 部门名称 */
  departmentName: string
  /** 职位名称 */
  positionName: string
  /** 联系电话 */
  phone: string
  /** 电子邮箱 */
  email: string
  /** 紧急联系人 */
  emergencyContact?: string
  /** 紧急联系电话 */
  emergencyPhone?: string
  /** 家庭住址 */
  address?: string
  /** 头像URL */
  avatarUrl?: string
  /** 入职日期 */
  hireDate?: string
  /** 性别 */
  gender?: string
  /** 出生日期 */
  birthDate?: string
  /** 身份证号 */
  idCard?: string
  /** 学历 */
  education?: string
  /** 婚姻状况 */
  maritalStatus?: string
}

/**
 * 个人信息修改参数
 */
export interface EmployeeProfileUpdateParams {
  /** 员工ID */
  id: number
  /** 联系电话 */
  phone?: string
  /** 电子邮箱 */
  email?: string
  /** 紧急联系人 */
  emergencyContact?: string
  /** 紧急联系电话 */
  emergencyPhone?: string
  /** 家庭住址 */
  address?: string
  /** 头像URL */
  avatarUrl?: string
}

/**
 * 工资条
 */
export interface Payslip {
  /** 工资条ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeNo: string
  /** 工资月份（YYYY-MM） */
  salaryMonth: string
  /** 基本工资 */
  baseSalary: number
  /** 绩效工资 */
  performanceSalary: number
  /** 岗位津贴 */
  positionAllowance: number
  /** 加班工资 */
  overtimeSalary: number
  /** 应发工资 */
  grossSalary: number
  /** 个人所得税 */
  incomeTax: number
  /** 社保扣款 */
  socialInsurance: number
  /** 公积金扣款 */
  housingFund: number
  /** 其他扣款 */
  otherDeductions: number
  /** 实发工资 */
  netSalary: number
  /** 发放状态 */
  status: number
  /** 发放时间 */
  paymentDate?: string
  /** 创建时间 */
  createTime: string
}

/**
 * 工资条查询参数
 */
export interface PayslipListParams {
  /** 工资月份 */
  salaryMonth?: string
  /** 开始月份 */
  startMonth?: string
  /** 结束月份 */
  endMonth?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 假期余额
 */
export interface LeaveBalance {
  /** 假期类型ID */
  id: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 假期类型编码 */
  leaveTypeCode: string
  /** 总额度（天数或小时数） */
  totalQuota: number
  /** 已使用额度 */
  usedQuota: number
  /** 剩余额度 */
  remainingQuota: number
  /** 有效期开始时间 */
  validFrom: string
  /** 有效期结束时间 */
  validTo: string
  /** 单位（天/小时） */
  unit: string
}

/**
 * 假期明细
 */
export interface LeaveBalanceDetail {
  /** 明细ID */
  id: number
  /** 假期类型ID */
  leaveTypeId: number
  /** 假期类型名称 */
  leaveTypeName: string
  /** 变动类型（发放/使用/调整） */
  changeType: string
  /** 变动数量 */
  changeAmount: number
  /** 变动前余额 */
  balanceBefore: number
  /** 变动后余额 */
  balanceAfter: number
  /** 变动原因 */
  reason: string
  /** 变动时间 */
  changeTime: string
  /** 关联申请ID */
  relatedApplicationId?: number
}

/**
 * 请假申请
 */
export interface LeaveApplication {
  /** 请假申请ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeNo: string
  /** 请假类型ID */
  leaveTypeId: number
  /** 请假类型名称 */
  leaveTypeName: string
  /** 请假开始时间 */
  startTime: string
  /** 请假结束时间 */
  endTime: string
  /** 请假天数 */
  leaveDays: number
  /** 请假事由 */
  reason: string
  /** 请假附件 */
  attachments?: string[]
  /** 请假状态（0-待审批/1-审批中/2-已通过/3-已驳回/4-已撤回） */
  status: number
  /** 审批进度 */
  approvalProgress?: string
  /** 申请时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 请假申请参数
 */
export interface LeaveApplicationParams {
  /** 请假类型ID */
  leaveTypeId: number
  /** 请假开始时间 */
  startTime: string
  /** 请假结束时间 */
  endTime: string
  /** 请假事由 */
  reason: string
  /** 请假附件 */
  attachments?: string[]
}

/**
 * 申请
 */
export interface Application {
  /** 申请ID */
  id: number
  /** 申请编号 */
  applicationNo?: string
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 员工工号 */
  employeeNo?: string
  /** 部门 */
  department?: string
  /** 申请类型（加班申请/报销申请/出差申请/调岗申请等） */
  applicationType: string
  /** 申请类型名称 */
  applicationTypeName?: string
  /** 申请标题 */
  title: string
  /** 申请内容 */
  content: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 天数 */
  days?: number
  /** 金额 */
  amount?: number
  /** 申请附件 */
  attachments?: string[]
  /** 申请时间 */
  applyTime?: string
  /** 提交时间 */
  submitTime?: string
  /** 申请状态（0-待审批/1-审批中/2-已通过/3-已驳回/4-已撤回） */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 审批人 */
  approver?: string
  /** 审批人ID */
  approverId?: number
  /** 审批时间 */
  approveTime?: string
  /** 审批备注 */
  approveRemark?: string
  /** 备注 */
  remark?: string
  /** 审批进度 */
  approvalProgress?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 申请查询参数
 */
export interface ApplicationListParams {
  /** 申请类型 */
  applicationType?: string
  /** 申请状态 */
  status?: number | string | null
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
 * 申请提交参数
 */
export interface ApplicationSubmitParams {
  /** 申请类型 */
  applicationType: string
  /** 申请标题 */
  title: string
  /** 申请内容 */
  content: string
  /** 申请附件 */
  attachments?: string[]
}

/**
 * 待办任务
 */
export interface TodoTask {
  /** 待办任务ID */
  id: number
  /** 任务类型（审批任务/处理任务/通知任务） */
  taskType: string
  /** 任务标题 */
  title: string
  /** 任务内容 */
  content: string
  /** 任务状态（0-待处理/1-已处理/2-已读） */
  status: number
  /** 关联业务ID */
  relatedId?: number
  /** 关联业务类型 */
  relatedType?: string
  /** 任务创建时间 */
  createTime: string
  /** 任务处理时间 */
  processTime?: string
  /** 任务优先级 */
  priority?: number
  /** 任务截止时间 */
  deadline?: string
}

/**
 * 待办任务查询参数
 */
export interface TodoTaskListParams {
  /** 任务类型 */
  taskType?: string
  /** 任务状态 */
  status?: number | string | null
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
 * 任务处理参数
 */
export interface TodoTaskProcessParams {
  /** 任务ID */
  id: number
  /** 处理意见 */
  comment?: string
  /** 处理结果（通过/驳回） */
  result?: string
}

/**
 * 申请状态枚举
 */
export enum ApplicationStatus {
  /** 待审批 */
  PENDING = 0,
  /** 审批中 */
  APPROVING = 1,
  /** 已通过 */
  APPROVED = 2,
  /** 已驳回 */
  REJECTED = 3,
  /** 已撤回 */
  WITHDRAWN = 4
}

/**
 * 任务状态枚举
 */
export enum TodoTaskStatus {
  /** 待处理 */
  PENDING = 0,
  /** 已处理 */
  PROCESSED = 1,
  /** 已读 */
  READ = 2
}
