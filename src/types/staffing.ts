/**
 * 编制管理类型定义
 */

/**
 * 编制信息
 */
export interface Staffing {
  /** 编制ID */
  id: number
  /** 年度 */
  year?: number
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 编制人数 */
  headcount: number
  /** 在编人数（从员工档案统计，查询时动态计算） */
  currentCount?: number
  /** 缺编人数（计算字段：编制人数 - 在编人数，负数为0） */
  shortage?: number
  /** 超编人数（计算字段：在编人数 - 编制人数，负数为0） */
  overstaffing?: number
  /** 编制状态（计算字段：0-正常 1-缺编 2-超编） */
  status?: number
  /** 备注说明 */
  remark?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 编制查询参数
 */
export interface StaffingQueryParams {
  /** 年度 */
  year?: number | string | null
  /** 部门ID */
  departmentId?: number | string | null
  /** 编制状态 0-正常 1-缺编 2-超编 */
  status?: number | string | null
  /** 当前页码 */
  page?: number
  /** 每页大小 */
  pageSize?: number
}

/**
 * 编制调整记录
 */
export interface StaffingAdjustmentRecord {
  /** 记录ID */
  id: number
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 调整时间 */
  adjustTime: string
  /** 调整前人数 */
  beforeCount: number
  /** 调整后人数 */
  afterCount: number
  /** 调整原因 */
  reason: string
  /** 操作人 */
  operator: string
  /** 创建时间 */
  createTime?: string
}

/**
 * 编制调整记录查询参数
 */
export interface StaffingAdjustmentQueryParams {
  /** 部门ID */
  departmentId?: number | string | null
  /** 当前页码 */
  page?: number
  /** 每页大小 */
  pageSize?: number
}

/**
 * 编制统计信息
 */
export interface StaffingStatistics {
  /** 总编制人数 */
  totalHeadcount: number
  /** 总在编人数 */
  totalCurrentCount: number
  /** 总缺编人数 */
  totalShortage: number
  /** 总超编人数 */
  totalOverstaffing: number
  /** 正常部门数 */
  normalCount: number
  /** 缺编部门数 */
  shortageCount: number
  /** 超编部门数 */
  overstaffingCount: number
}
