/**
 * 绩效校准类型定义
 */

/**
 * 绩效校准
 */
export interface PerformanceCalibration {
  /** ID */
  id: number
  /** 考核周期ID */
  cycleId: number
  /** 考核周期名称 */
  cycleName: string
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 优秀比例（百分比） */
  excellentRatio: number
  /** 良好比例（百分比） */
  goodRatio: number
  /** 合格比例（百分比） */
  qualifiedRatio: number
  /** 待改进比例（百分比） */
  improveRatio: number
  /** 总人数 */
  totalEmployees: number
  /** 优秀人数 */
  excellentCount: number
  /** 良好人数 */
  goodCount: number
  /** 合格人数 */
  qualifiedCount: number
  /** 待改进人数 */
  improveCount: number
  /** 状态：0-待校准 1-已校准 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 校准日期 */
  calibrationDate: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效校准列表查询参数
 */
export interface PerformanceCalibrationListParams {
  /** 考核周期名称 */
  cycleName?: string
  /** 部门名称 */
  departmentName?: string
  /** 状态 - 支持 number | string | null */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
