/**
 * 目标管理类型定义
 */

/**
 * 目标管理数据项
 */
export interface PerformanceGoal {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 考核周期ID */
  cycleId: number
  /** 考核周期名称 */
  cycleName: string
  /** 目标类型：1-OKR 2-KPI */
  goalType: number
  /** 目标类型名称 */
  goalTypeName?: string
  /** 目标标题 */
  goalTitle: string
  /** 目标描述 */
  goalDescription: string
  /** 权重（百分比） */
  weight: number
  /** 目标值 */
  targetValue: string
  /** 当前值 */
  currentValue: string
  /** 完成进度（百分比） */
  progress: number
  /** 状态：0-未开始 1-进行中 2-已完成 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 列表查询参数
 */
export interface PerformanceGoalListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 部门名称 */
  departmentName?: string
  /** 考核周期ID - 支持 number | string | null */
  cycleId?: number | string | null
  /** 目标类型 - 支持 number | string | null */
  goalType?: number | string | null
  /** 状态 - 支持 number | string | null */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
