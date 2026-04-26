/**
 * 绩效周期类型定义
 */

/**
 * 绩效周期
 */
export interface PerformanceCycle {
  /** ID */
  id: number
  /** 周期名称 */
  cycleName: string
  /** 周期类型：1-季度 2-半年度 3-年度 */
  cycleType: number
  /** 周期类型名称 */
  cycleTypeName?: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
  /** 状态：0-未开始 1-进行中 2-已结束 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 周期描述 */
  description: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效周期列表查询参数
 */
export interface PerformanceCycleListParams {
  /** 周期名称 */
  cycleName?: string
  /** 周期类型 */
  cycleType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
