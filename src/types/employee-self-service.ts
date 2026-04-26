/**
 * 员工自助服务类型定义
 */

/**
 * 个人信息
 */
export interface EmployeeProfile {
  id: number
  /** 工号 */
  employeeNo: string
  /** 姓名 */
  name: string
  /** 头像 */
  avatar?: string
  /** 部门 */
  department: string
  /** 职位 */
  position: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 紧急联系人 */
  emergencyContact?: string
  /** 紧急联系电话 */
  emergencyPhone?: string
  /** 家庭住址 */
  address?: string
  /** 入职日期 */
  hireDate: string
  /** 性别 */
  gender: string
  /** 出生日期 */
  birthDate: string
  /** 身份证号 */
  idCard: string
}

/**
 * 工资条
 */
export interface Payslip {
  id: number
  /** 工资月份 */
  month: string
  /** 应发工资 */
  grossSalary: number
  /** 实发工资 */
  netSalary: number
  /** 基本工资 */
  baseSalary: number
  /** 绩效工资 */
  performanceSalary: number
  /** 岗位津贴 */
  positionAllowance: number
  /** 交通补贴 */
  transportAllowance: number
  /** 餐补 */
  mealAllowance: number
  /** 社保扣款 */
  socialInsurance: number
  /** 公积金扣款 */
  housingFund: number
  /** 个税 */
  tax: number
  /** 其他扣款 */
  otherDeduction: number
  /** 备注 */
  remark?: string
}

/**
 * 工资条查询参数
 */
export interface PayslipQueryParams {
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
 * 假期类型
 */
export interface LeaveType {
  id: number
  /** 假期类型名称 */
  name: string
  /** 总额度 */
  totalQuota: number
  /** 已使用 */
  usedQuota: number
  /** 剩余额度 */
  remainingQuota: number
  /** 有效期 */
  validUntil: string
  /** 单位 */
  unit: string
}

/**
 * 假期明细
 */
export interface LeaveDetail {
  id: number
  /** 假期类型 */
  leaveType: string
  /** 操作类型 */
  operationType: string
  /** 数量 */
  amount: number
  /** 操作时间 */
  operationTime: string
  /** 备注 */
  remark?: string
}

/**
 * 请假申请
 */
export interface LeaveApplication {
  /** 假期类型ID */
  leaveTypeId: number
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 请假天数 */
  days: number
  /** 请假事由 */
  reason: string
  /** 附件 */
  attachments?: string[]
}

/**
 * 申请类型
 */
export enum ApplicationType {
  LEAVE = 1,
  OVERTIME = 2,
  BUSINESS_TRIP = 3,
  REIMBURSEMENT = 4,
  RESIGNATION = 5,
  OTHER = 6
}

/**
 * 申请状态
 */
export enum ApplicationStatus {
  DRAFT = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

/**
 * 申请记录
 */
export interface Application {
  id: number
  /** 申请标题 */
  title: string
  /** 申请类型 */
  type: ApplicationType
  /** 申请类型名称 */
  typeName: string
  /** 申请状态 */
  status: ApplicationStatus
  /** 申请状态名称 */
  statusName: string
  /** 申请时间 */
  applyTime: string
  /** 申请内容 */
  content: string
  /** 附件 */
  attachments?: string[]
  /** 审批进度 */
  approvalProgress: ApprovalNode[]
}

/**
 * 审批节点
 */
export interface ApprovalNode {
  id: number
  /** 审批人 */
  approver: string
  /** 审批状态 */
  status: string
  /** 审批意见 */
  opinion?: string
  /** 审批时间 */
  approvalTime?: string
}

/**
 * 申请查询参数
 */
export interface ApplicationQueryParams {
  /** 申请类型 */
  type?: number | string | null
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
 * 新建申请
 */
export interface CreateApplication {
  /** 申请类型 */
  type: ApplicationType
  /** 申请标题 */
  title: string
  /** 申请内容 */
  content: string
  /** 附件 */
  attachments?: string[]
}

/**
 * 待办任务类型
 */
export enum TodoTaskType {
  APPROVAL = 1,
  NOTIFICATION = 2,
  REMINDER = 3
}

/**
 * 待办任务状态
 */
export enum TodoTaskStatus {
  UNREAD = 0,
  READ = 1,
  PROCESSED = 2
}

/**
 * 待办任务
 */
export interface TodoTask {
  id: number
  /** 任务标题 */
  title: string
  /** 任务类型 */
  type: TodoTaskType
  /** 任务类型名称 */
  typeName: string
  /** 任务状态 */
  status: TodoTaskStatus
  /** 任务状态名称 */
  statusName: string
  /** 创建时间 */
  createTime: string
  /** 任务内容 */
  content: string
  /** 关联ID */
  relatedId?: number
}

/**
 * 待办任务查询参数
 */
export interface TodoTaskQueryParams {
  /** 任务类型 */
  type?: number | string | null
  /** 任务状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 处理待办任务
 */
export interface ProcessTodoTask {
  /** 任务ID */
  id: number
  /** 处理意见 */
  opinion: string
}
