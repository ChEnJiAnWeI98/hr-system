/**
 * 背调集成 Phase 4.1 类型定义
 * 对应需求说明书 11.3.5 背调集成 + 业务规则 BG-001 ~ BG-006
 */

/** 背调订单状态：0-待发起 1-待授权 2-调查中 3-已完成 4-授权超期 5-已取消 */
export type BGStatus = 0 | 1 | 2 | 3 | 4 | 5

/** 背调服务商：1-北森背调 2-i背调 3-大易背调 4-手工模式 */
export type BGVendor = 1 | 2 | 3 | 4

/** 背调套餐等级：basic-基础 / standard-标准 / executive-高管 / custom-自定义 */
export type BGPackageLevel = 'basic' | 'standard' | 'executive' | 'custom'

/** 背调结论：1-通过 2-存疑 3-不通过 */
export type BGConclusion = 1 | 2 | 3

/** 风险等级：1-低 2-中 3-高 */
export type BGRiskLevel = 1 | 2 | 3

/** 调查项类型 */
export type BGItemType =
  | 'id_card'      // 身份核实
  | 'education'    // 学历验证
  | 'work_exp'     // 工作履历
  | 'civil_case'   // 民事诉讼
  | 'criminal'     // 刑事背景
  | 'finance'      // 金融信用
  | 'commercial'   // 工商关联
  | 'professional' // 职业资格

/** 调查项状态：pending-待调查 / checking-调查中 / passed-通过 / failed-未通过 / suspicious-存疑 */
export type BGItemStatus = 'pending' | 'checking' | 'passed' | 'failed' | 'suspicious'

/**
 * 背调单个调查项
 */
export interface BGCheckItem {
  id: number
  type: BGItemType
  name: string
  status: BGItemStatus
  /** 调查结论文字 */
  result: string
  remark?: string
}

/**
 * 背调套餐
 */
export interface BackgroundCheckPackage {
  id: number
  /** 套餐名称 */
  name: string
  /** 套餐等级 */
  level: BGPackageLevel
  /** 调查项（类型列表） */
  itemTypes: BGItemType[]
  /** 默认适用职级（如 P5-P7 / P8+ / 管理岗 / 全部） */
  defaultForLevel?: string
  /** 默认适用岗位族 */
  defaultForJobFamily?: string
  /** 单次成本（元） */
  cost: number
  /** 描述 */
  description?: string
  /** 状态：0-禁用 1-启用 */
  status: 0 | 1
  createTime: string
  updateTime: string
}

/**
 * 背调订单
 */
export interface BackgroundCheck {
  id: number
  orderNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 候选人手机 */
  phone: string
  /** 候选人邮箱 */
  email: string
  /** 候选人身份证（敏感信息，展示需脱敏） */
  idNumber: string
  /** 意向职位 */
  position: string
  /** 意向部门 */
  department: string
  /** 套餐 ID */
  packageId: number
  /** 套餐名称（冗余） */
  packageName: string
  /** 套餐等级（冗余） */
  packageLevel: BGPackageLevel
  /** 服务商 */
  vendor: BGVendor
  /** 订单状态 */
  status: BGStatus
  /** 授权链接（Mock） */
  authUrl?: string
  /** 授权发送时间 */
  authSendTime?: string
  /** 候选人授权完成时间 */
  authTime?: string
  /** 授权到期时间（BG-003：超过 7 天自动取消） */
  authExpireTime?: string
  /** 调查项明细 */
  checkItems: BGCheckItem[]
  /** 报告文件名（Mock PDF） */
  reportFileName?: string
  /** 报告 URL（Mock） */
  reportUrl?: string
  /** 核验结论 */
  conclusion?: BGConclusion
  /** 风险等级 */
  riskLevel?: BGRiskLevel
  /** 风险摘要 */
  riskSummary?: string
  /** 订单成本（元） */
  cost: number
  /** 创建人 ID */
  createdById: number
  /** 创建人姓名 */
  createdByName: string
  /** 取消原因 */
  cancelReason?: string
  createTime: string
  updateTime: string
  /** 调查完成时间 */
  completeTime?: string
  /**
   * 归档状态：archived 已归档（BG-006：2 年后归档）
   * null 或 undefined 表示未归档
   */
  archived?: boolean
  archiveTime?: string
}

/**
 * 订单查询参数
 */
export interface BackgroundCheckListParams {
  orderNo?: string
  candidateName?: string
  phone?: string
  status?: BGStatus | string | null
  vendor?: BGVendor | string | null
  packageLevel?: BGPackageLevel | ''
  createTimeStart?: string
  createTimeEnd?: string
  page: number
  pageSize: number
}

/**
 * 费用统计数据
 */
export interface BGCostStats {
  /** 本期订单总数 */
  totalOrders: number
  /** 本期完成数 */
  completedOrders: number
  /** 本期总费用 */
  totalCost: number
  /** 单订单平均费用 */
  avgCost: number
  /** 按服务商分布 */
  byVendor: Array<{ vendor: BGVendor; count: number; cost: number }>
  /** 按套餐等级分布 */
  byLevel: Array<{ level: BGPackageLevel; count: number; cost: number }>
  /** 近 6 个月趋势 */
  monthlyTrend: Array<{ month: string; orderCount: number; cost: number }>
}

/* ========== 字典常量 ========== */

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const BG_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '待发起', type: 'info' },
  1: { label: '待候选人授权', type: 'warning' },
  2: { label: '调查中', type: 'primary' },
  3: { label: '已完成', type: 'success' },
  4: { label: '授权超期', type: 'danger' },
  5: { label: '已取消', type: 'info' }
}

export const BG_VENDOR_MAP: Record<number, string> = {
  1: '北森背调',
  2: 'i背调',
  3: '大易背调',
  4: '手工模式'
}

export const BG_PACKAGE_LEVEL_MAP: Record<string, { label: string; type: ElTagType }> = {
  basic: { label: '基础', type: 'info' },
  standard: { label: '标准', type: 'warning' },
  executive: { label: '高管', type: 'danger' },
  custom: { label: '自定义', type: 'primary' }
}

export const BG_CONCLUSION_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: '通过', type: 'success' },
  2: { label: '存疑', type: 'warning' },
  3: { label: '不通过', type: 'danger' }
}

export const BG_RISK_LEVEL_MAP: Record<number, { label: string; type: ElTagType; color: string }> = {
  1: { label: '低风险', type: 'success', color: '#67c23a' },
  2: { label: '中风险', type: 'warning', color: '#e6a23c' },
  3: { label: '高风险', type: 'danger', color: '#f56c6c' }
}

export const BG_ITEM_TYPE_MAP: Record<string, string> = {
  id_card: '身份核实',
  education: '学历验证',
  work_exp: '工作履历',
  civil_case: '民事诉讼',
  criminal: '刑事背景',
  finance: '金融信用',
  commercial: '工商关联',
  professional: '职业资格'
}

export const BG_ITEM_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待调查', type: 'info' },
  checking: { label: '调查中', type: 'warning' },
  passed: { label: '通过', type: 'success' },
  failed: { label: '未通过', type: 'danger' },
  suspicious: { label: '存疑', type: 'primary' }
}

/**
 * 身份证脱敏（BG-005 审计合规）
 * 110101********1234
 */
export function maskIdNumber(id: string): string {
  if (!id || id.length < 10) return id
  return id.substring(0, 6) + '********' + id.substring(id.length - 4)
}

/**
 * 手机号脱敏
 * 138****8001
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7)
}
