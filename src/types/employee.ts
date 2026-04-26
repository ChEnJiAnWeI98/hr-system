/**
 * 员工档案类型定义
 */

/**
 * 员工状态枚举
 */
export enum EmployeeStatus {
  /** 待入职 */
  PENDING = 0,
  /** 在职 */
  ACTIVE = 1,
  /** 试用期 */
  PROBATION = 2,
  /** 已离职 */
  RESIGNED = 3,
  /** 停用 */
  DISABLED = 4
}

/**
 * 员工性别枚举
 */
export enum EmployeeGender {
  /** 男 */
  MALE = 1,
  /** 女 */
  FEMALE = 2
}

/**
 * 教育经历
 */
export interface EducationRecord {
  id?: number
  schoolName: string
  major: string
  education: string
  degree?: string
  isFullTime?: number
  startDate: string
  endDate: string
}

/**
 * 工作经历
 */
export interface WorkRecord {
  id?: number
  companyName: string
  position: string
  startDate: string
  endDate: string
  description?: string
  leaveReason?: string
}

/**
 * 证件信息
 */
export interface CertificateRecord {
  id?: number
  type: string
  number: string
  issueDate: string
  expiryDate: string
}

/**
 * 紧急联系人
 */
export interface EmergencyContact {
  id?: number
  name: string
  relationship: string
  phone: string
  company?: string
  remark?: string
}

/**
 * 员工档案
 */
export interface Employee {
  /** ID */
  id: number
  /** 员工工号 */
  employeeNo: string
  /** 员工姓名 */
  name: string
  /** 性别 */
  gender: number
  /** 所属部门ID */
  departmentId: number
  /** 所属部门名称 */
  departmentName: string
  /** 岗位ID */
  positionId: number
  /** 岗位名称 */
  positionName: string
  /** 员工状态 */
  status: number
  /** 入职时间 */
  joinDate: string
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 身份证号 */
  idCard?: string
  /** 出生日期 */
  birthDate?: string
  /** 民族 */
  nation?: string
  /** 政治面貌 */
  politicalStatus?: string
  /** 婚姻状况 */
  maritalStatus?: number
  /** 户籍地址 */
  registeredAddress?: string
  /** 现居住地址 */
  currentAddress?: string
  /** 教育经历 */
  educationRecords?: EducationRecord[]
  /** 工作经历 */
  workRecords?: WorkRecord[]
  /** 证件信息 */
  certificateRecords?: CertificateRecord[]
  /** 紧急联系人 */
  emergencyContacts?: EmergencyContact[]
  /** 籍贯 */
  hometown?: string
  /** 现居住地址 */
  address?: string
  /** 紧急联系人 */
  emergencyContact?: string
  /** 紧急联系电话 */
  emergencyPhone?: string
  /** 学历 */
  education?: string
  /** 毕业院校 */
  school?: string
  /** 专业 */
  major?: string
  /** 工作经历 */
  workExperience?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 员工列表查询参数
 */
export interface EmployeeListParams {
  /** 关键字（员工姓名或工号） */
  keyword?: string
  /** 员工姓名（别名） */
  name?: string
  /** 员工工号（别名） */
  employeeNo?: string
  /** 所属部门ID */
  departmentId?: number | string | null
  /** 岗位ID */
  positionId?: number | string | null
  /** 员工状态 */
  status?: number | string | null
  /** 入职开始时间 */
  joinDateStart?: string
  /** 入职结束时间 */
  joinDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
