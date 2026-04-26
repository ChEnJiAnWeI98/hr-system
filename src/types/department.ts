/**
 * 部门管理类型定义
 */

/**
 * 部门信息
 */
export interface Department {
  /** 部门ID */
  id: number
  /** 部门名称 */
  name: string
  /** 部门编码 */
  code: string
  /** 上级部门ID */
  parentId: number | null
  /** 部门负责人ID */
  leaderId: number | null
  /** 部门负责人姓名 */
  leaderName?: string
  /** 编制人数 */
  headcount: number
  /** 在编人数 */
  currentCount: number
  /** 成立时间 */
  establishDate: string
  /** 职能描述 */
  description: string
  /** 排序号 */
  sort: number
  /** 状态 0-停用 1-启用 */
  status: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 子部门 */
  children?: Department[]
}

/**
 * 部门查询参数
 */
export interface DepartmentQueryParams {
  /** 部门名称 */
  name?: string
  /** 状态 */
  status?: number | string | null
}
