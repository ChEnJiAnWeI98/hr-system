/**
 * 员工档案 类型定义（Phase 1.4）
 * 宇宙中心 SSOT - 所有业务模块引用此员工数据
 */

/** 员工生命周期状态 */
export type EmployeeStatus =
  | 'pending_onboard' // 待入职
  | 'probation' // 试用期
  | 'regular' // 正式在职
  | 'transferring' // 调动中
  | 'seconded' // 借调中
  | 'offboarding' // 离职中
  | 'terminated' // 已离职

/** 雇佣类型 */
export type EmploymentType = 'regular' | 'intern' | 'outsourcing' | 'part_time'

/** 职级通道 */
export type LevelTrack = 'professional' | 'management'

/**
 * 紧急联系人
 */
export interface EmergencyContact {
  name: string
  /** 字典 EMERGENCY_RELATION */
  relation: string
  /** 敏感：脱敏显示 */
  mobile: string
}

/**
 * 员工档案
 */
export interface Employee {
  // ========== 系统字段 ==========
  id: number
  /** 员工编号（如 YG20260001） */
  employeeNo: string
  createTime: string
  updateTime: string

  // ========== Tab 1 基本信息 ==========
  /** 中文姓名 */
  nameZh: string
  /** 英文名（可选） */
  nameEn?: string
  /** 字典 GENDER */
  gender: 'M' | 'F' | 'OTHER'
  /** 出生日期 */
  birthDate: string
  /** 年龄（计算值） */
  age: number
  /** 字典 CERTIFICATE_TYPE */
  certificateType: string
  /** 证件号码（敏感：脱敏） */
  certificateNo: string
  /** 字典 NATION */
  nation: string
  /** 字典 NATIONALITY */
  nationality: string
  /** 字典 MARITAL_STATUS */
  maritalStatus: string
  /** 字典 POLITICAL_STATUS */
  politicalStatus: string
  /** 字典 EDUCATION */
  education: string
  graduatedSchool?: string
  major?: string
  /** 手机号（敏感：脱敏） */
  mobile: string
  email: string
  /** 家庭住址（敏感：脱敏） */
  homeAddress?: string
  /** 紧急联系人 */
  emergencyContact?: EmergencyContact

  // ========== Tab 2 岗位与组织 ==========
  /** 所在组织 ID */
  orgId: number
  /** 组织名称（冗余） */
  orgName: string
  /** 组织路径（冗余，便于权限判断） */
  orgPath: string
  /** 岗位 ID */
  positionId: number
  /** 岗位名称（冗余） */
  positionName: string
  /** 岗位族（冗余） */
  jobFamily: string
  /** 岗位序列（冗余） */
  jobSequence: string
  /** 职级编码（如 P6、M2） */
  level: string
  /** 职级通道 */
  levelTrack: LevelTrack
  /** 直属上级 employeeId */
  supervisorId?: number
  /** 归属 HRBP employeeId */
  hrbpId?: number
  /** 工作地点 */
  workLocation: string
  /** 雇佣类型 */
  employmentType: EmploymentType

  // ========== 生命周期 ==========
  /** 入职日期 */
  entryDate: string
  /** 转正日期 */
  regularizationDate?: string
  /** 司龄（年，计算值） */
  seniority: number
  /** 员工状态（状态机当前值） */
  status: EmployeeStatus

  // ========== 合同 Mini 信息（详情在合同模块） ==========
  currentContractId?: number
  /** 字典 CONTRACT_TYPE */
  contractType?: string
  contractStartDate?: string
  contractEndDate?: string

  // ========== 薪酬 Mini 信息（敏感：整列隐藏）==========
  baseSalary?: number
  positionSalary?: number
  performanceBase?: number
  socialBase?: number

  // ========== HRBP 分管（若该员工是 HRBP）==========
  /** 分管的组织 ID 列表（Q5=B 决策） */
  managedOrgIds?: number[]
}

/**
 * 员工查询参数
 */
export interface EmployeeListParams {
  /** 关键字搜索（姓名/员工号/手机/邮箱） */
  keyword?: string
  orgId?: number | null
  /** 是否含子部门（默认 true） */
  includeSubOrg?: boolean
  jobFamily?: string
  level?: string
  status?: EmployeeStatus | ''
  employmentType?: EmploymentType | ''
  page: number
  pageSize: number
}

/**
 * 员工花名册显示列（精简版）
 */
export interface EmployeeRosterItem {
  id: number
  employeeNo: string
  nameZh: string
  gender: 'M' | 'F' | 'OTHER'
  orgName: string
  positionName: string
  level: string
  entryDate: string
  seniority: number
  status: EmployeeStatus
  mobile: string
  email: string
}

/** 雇佣类型 label */
export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  regular: '正式员工',
  intern: '实习生',
  outsourcing: '外包',
  part_time: '兼职'
}
