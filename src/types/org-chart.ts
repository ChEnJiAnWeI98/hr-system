/**
 * 组织架构图类型定义
 */

/**
 * 组织架构节点
 */
export interface OrgChartNode {
  /** 部门ID */
  id: number
  /** 部门名称 */
  name: string
  /** 部门负责人姓名 */
  leaderName: string
  /** 编制人数 */
  headcount: number
  /** 在职人数 */
  currentCount: number
  /** 上级部门ID */
  parentId: number | null
  /** 子部门列表 */
  children?: OrgChartNode[]
}

/**
 * 组织架构树响应
 */
export interface OrgChartTreeResponse {
  /** 组织架构树 */
  tree: OrgChartNode
}
