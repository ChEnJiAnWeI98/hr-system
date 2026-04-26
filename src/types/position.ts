/**
 * 岗位管理类型定义
 */

/**
 * 岗位信息
 */
export interface Position {
  /** 岗位ID */
  id: number
  /** 岗位名称 */
  name: string
  /** 所属部门ID */
  departmentId: number
  /** 所属部门名称 */
  departmentName?: string
  /** 岗位类别 1-管理类 2-技术类 3-业务类 4-职能类 5-销售类 6-客服类 7-其他 */
  category: number
  /** 职级 1-初级 2-中级 3-高级 4-专家 */
  level: number
  /** 职等 1-20 */
  grade: number
  /** 岗位说明书 */
  description: string
  /** 任职要求 */
  requirements: string
  /** 在职人数 */
  employeeCount: number
  /** 状态 0-停用 1-启用 */
  status: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 岗位查询参数
 */
export interface PositionQueryParams {
  /** 岗位名称 */
  name?: string
  /** 所属部门ID */
  departmentId?: number | string | null
  /** 职级 */
  level?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page?: number
  /** 每页大小 */
  pageSize?: number
}

/**
 * 岗位类别枚举
 */
export enum PositionCategory {
  /** 管理类 */
  MANAGEMENT = 1,
  /** 技术类 */
  TECHNICAL = 2,
  /** 业务类 */
  BUSINESS = 3,
  /** 职能类 */
  FUNCTIONAL = 4,
  /** 销售类 */
  SALES = 5,
  /** 客服类 */
  SERVICE = 6,
  /** 其他 */
  OTHER = 7
}

/**
 * 职级枚举
 */
export enum PositionLevel {
  /** 初级 */
  JUNIOR = 1,
  /** 中级 */
  INTERMEDIATE = 2,
  /** 高级 */
  SENIOR = 3,
  /** 专家 */
  EXPERT = 4
}
