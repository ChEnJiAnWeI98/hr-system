/**
 * 合同管理模块类型定义
 */

/**
 * 合同类型枚举
 */
export enum ContractTypeEnum {
  /** 劳动合同 */
  LABOR = 1,
  /** 保密协议 */
  CONFIDENTIALITY = 2,
  /** 竞业限制协议 */
  NON_COMPETE = 3,
  /** 培训协议 */
  TRAINING = 4,
  /** 其他 */
  OTHER = 5
}

/**
 * 合同状态枚举
 */
export enum ContractStatusEnum {
  /** 草稿 */
  DRAFT = 1,
  /** 待审批 */
  PENDING_APPROVAL = 2,
  /** 待签订 */
  PENDING_SIGN = 3,
  /** 生效中 */
  ACTIVE = 4,
  /** 已续签 */
  RENEWED = 5,
  /** 已终止 */
  TERMINATED = 6,
  /** 已到期 */
  EXPIRED = 7,
  /** 已归档 */
  ARCHIVED = 8
}

/**
 * 模板状态枚举
 */
export enum TemplateStatusEnum {
  /** 停用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}

/**
 * 签订方式枚举
 */
export enum SignMethodEnum {
  /** 电子签章 */
  ELECTRONIC = 1,
  /** 纸质合同 */
  PAPER = 2
}

/**
 * 变更类型枚举
 */
export enum ChangeTypeEnum {
  /** 薪资调整 */
  SALARY = 1,
  /** 岗位变动 */
  POSITION = 2,
  /** 工作地点变更 */
  LOCATION = 3,
  /** 其他 */
  OTHER = 4
}

/**
 * 终止类型枚举
 */
export enum TerminateTypeEnum {
  /** 员工主动离职 */
  EMPLOYEE_RESIGN = 1,
  /** 公司辞退 */
  COMPANY_DISMISS = 2,
  /** 协商解除 */
  MUTUAL_AGREEMENT = 3,
  /** 其他 */
  OTHER = 4
}

/**
 * 合同模板
 */
export interface ContractTemplate {
  /** 模板ID */
  id: number
  /** 模板名称 */
  name: string
  /** 合同类型 */
  type: number
  /** 适用范围 */
  scope: string
  /** 模板内容（富文本） */
  content: string
  /** 当前版本号 */
  version: string
  /** 状态 */
  status: number
  /** 备注 */
  remark?: string
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 合同模板查询参数
 */
export interface ContractTemplateQueryParams {
  /** 模板名称 */
  name?: string
  /** 合同类型 */
  type?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 合同模板版本
 */
export interface ContractTemplateVersion {
  /** 版本ID */
  id: number
  /** 模板ID */
  templateId: number
  /** 版本号 */
  version: string
  /** 模板内容 */
  content: string
  /** 修改内容说明 */
  changeLog: string
  /** 是否当前版本 */
  isCurrent: boolean
  /** 修改人 */
  updateBy: string
  /** 修改时间 */
  updateTime: string
}

/**
 * 合同
 */
export interface Contract {
  /** 合同ID */
  id: number
  /** 合同编号 */
  contractNo: string
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 工号 */
  employeeNo: string
  /** 部门 */
  department: string
  /** 合同类型 */
  type: number
  /** 模板ID */
  templateId: number
  /** 模板名称 */
  templateName: string
  /** 合同内容（富文本） */
  content: string
  /** 签订日期 */
  signDate?: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
  /** 试用期（月） */
  probationPeriod?: number
  /** 工作地点 */
  workLocation: string
  /** 工作内容 */
  workContent: string
  /** 薪资标准 */
  salary: string
  /** 续签原因 */
  renewReason?: string
  /** 变更说明 */
  changeDescription?: string
  /** 合同状态 */
  status: number
  /** 签订方式 */
  signMethod?: number
  /** 附件列表 */
  attachments?: string[]
  /** 备注 */
  remark?: string
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 合同查询参数
 */
export interface ContractQueryParams {
  /** 员工姓名 */
  employeeName?: string
  /** 工号 */
  employeeNo?: string
  /** 合同类型 */
  type?: number | string | null
  /** 合同状态 */
  status?: number | string | null
  /** 签订日期开始 */
  signDateStart?: string
  /** 签订日期结束 */
  signDateEnd?: string
  /** 归档日期开始 */
  archiveDateStart?: string
  /** 归档日期结束 */
  archiveDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 合同审批参数
 */
export interface ContractApprovalParams {
  /** 合同ID */
  id: number
  /** 审批结果（1-通过，2-驳回） */
  result: number
  /** 审批意见 */
  opinion: string
  /** 审批人 */
  approver?: string
  /** 审批时间 */
  approvalTime?: string
}

/**
 * 合同签订参数
 */
export interface ContractSignParams {
  /** 合同ID */
  id: number
  /** 签订方式 */
  signMethod: number
  /** 签订日期 */
  signDate: string
  /** 签订人 */
  signBy?: string
  /** 签订时间 */
  signTime?: string
  /** 附件列表（合同扫描件） */
  attachments?: string[]
  /** 备注 */
  remark?: string
}

/**
 * 合同续签参数
 */
export interface ContractRenewParams {
  /** 原合同ID */
  id: number
  /** 新合同编号 */
  contractNo: string
  /** 新开始日期 */
  startDate: string
  /** 新结束日期 */
  endDate: string
  /** 薪资标准 */
  salary: string
  /** 工作地点 */
  workLocation: string
  /** 工作内容 */
  workContent: string
  /** 续签原因 */
  reason: string
  /** 续签人 */
  renewBy?: string
  /** 续签时间 */
  renewTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 合同变更参数
 */
export interface ContractChangeParams {
  /** 合同ID */
  id: number
  /** 变更类型 */
  changeType: number
  /** 变更前信息 */
  beforeChange: string
  /** 变更后信息 */
  afterChange: string
  /** 变更原因 */
  reason: string
  /** 变更生效日期 */
  effectiveDate: string
  /** 变更人 */
  changeBy?: string
  /** 变更时间 */
  changeTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 合同终止参数
 */
export interface ContractTerminateParams {
  /** 合同ID */
  id: number
  /** 终止类型 */
  terminateType: number
  /** 终止原因 */
  reason: string
  /** 终止日期 */
  terminateDate: string
  /** 是否有经济补偿 */
  hasCompensation: boolean
  /** 补偿金额 */
  compensationAmount?: number
  /** 终止人 */
  terminateBy?: string
  /** 终止时间 */
  terminateTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 合同归档
 */
export interface ContractArchive {
  /** 归档ID */
  id: number
  /** 合同ID */
  contractId: number
  /** 合同编号 */
  contractNo: string
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 工号 */
  employeeNo: string
  /** 部门 */
  department: string
  /** 合同类型 */
  type: number
  /** 签订日期 */
  signDate: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
  /** 归档日期 */
  archiveDate: string
  /** 归档原因 */
  archiveReason: string
  /** 归档人 */
  archiveBy: string
}

/**
 * 合同归档查询参数
 */
export interface ContractArchiveQueryParams {
  /** 员工姓名 */
  employeeName?: string
  /** 工号 */
  employeeNo?: string
  /** 合同类型 */
  type?: number | string | null
  /** 归档日期开始 */
  archiveDateStart?: string
  /** 归档日期结束 */
  archiveDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 合同统计数据
 */
export interface ContractStatistics {
  /** 即将到期合同数（30天内） */
  expiringSoon: number
  /** 本月到期合同数 */
  expiringThisMonth: number
  /** 本年到期合同数 */
  expiringThisYear: number
  /** 合同总数 */
  total: number
  /** 生效中合同数 */
  active: number
  /** 待审批合同数 */
  pending: number
  /** 按类型统计 */
  byType: {
    type: number
    typeName: string
    count: number
  }[]
  /** 按状态统计 */
  byStatus: {
    status: number
    statusName: string
    count: number
  }[]
  /** 合同类型分布 */
  typeDistribution: {
    type: number
    typeName: string
    count: number
    percentage: number
  }[]
  /** 合同续签率统计 */
  renewalRate: {
    month: string
    totalExpired: number
    renewed: number
    rate: number
  }[]
  /** 合同数量趋势（最近12个月） */
  trend: {
    month: string
    count: number
  }[]
}

/**
 * 即将到期合同
 */
export interface ExpiringContract {
  /** 合同ID */
  id: number
  /** 员工姓名 */
  employeeName: string
  /** 工号 */
  employeeNo: string
  /** 部门 */
  department: string
  /** 合同类型 */
  type: number
  /** 结束日期 */
  endDate: string
  /** 剩余天数 */
  remainingDays: number
}

/**
 * 预定义变量
 */
export interface TemplateVariable {
  /** 变量名称 */
  name: string
  /** 变量代码 */
  code: string
  /** 变量说明 */
  description: string
  /** 示例值 */
  example: string
}

/**
 * 预定义变量列表
 */
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { name: '员工姓名', code: '{{员工姓名}}', description: '员工的真实姓名', example: '张三' },
  { name: '工号', code: '{{工号}}', description: '员工的工号', example: 'EMP001' },
  { name: '身份证号', code: '{{身份证号}}', description: '员工的身份证号码', example: '110101199001011234' },
  { name: '性别', code: '{{性别}}', description: '员工的性别', example: '男' },
  { name: '出生日期', code: '{{出生日期}}', description: '员工的出生日期', example: '1990-01-01' },
  { name: '联系电话', code: '{{联系电话}}', description: '员工的联系电话', example: '13800138000' },
  { name: '电子邮箱', code: '{{电子邮箱}}', description: '员工的电子邮箱', example: 'zhangsan@example.com' },
  { name: '部门', code: '{{部门}}', description: '员工所属部门', example: '技术部' },
  { name: '岗位', code: '{{岗位}}', description: '员工的岗位名称', example: '高级工程师' },
  { name: '入职日期', code: '{{入职日期}}', description: '员工的入职日期', example: '2023-01-01' },
  { name: '合同编号', code: '{{合同编号}}', description: '合同的唯一编号', example: 'HT202301010001' },
  { name: '签订日期', code: '{{签订日期}}', description: '合同的签订日期', example: '2023-01-01' },
  { name: '开始日期', code: '{{开始日期}}', description: '合同的开始日期', example: '2023-01-01' },
  { name: '结束日期', code: '{{结束日期}}', description: '合同的结束日期', example: '2025-12-31' },
  { name: '试用期', code: '{{试用期}}', description: '试用期时长（月）', example: '3个月' },
  { name: '工作地点', code: '{{工作地点}}', description: '工作地点', example: '北京市朝阳区' },
  { name: '薪资标准', code: '{{薪资标准}}', description: '薪资标准', example: '月薪15000元' }
]
