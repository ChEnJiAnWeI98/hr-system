/**
 * 绩效评估类型定义
 */

/**
 * 绩效评估
 */
export interface PerformanceEvaluation {
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
  /** 自评分数 */
  selfScore: number
  /** 上级评分 */
  managerScore: number
  /** 同级评分（360度） */
  peerScore: number
  /** 下级评分（360度） */
  subordinateScore: number
  /** 最终得分 */
  finalScore: number
  /** 评级：优秀/良好/合格/待改进 */
  rating: string
  /** 评估状态：0-待自评 1-待上级评 2-待360度评 3-已完成 */
  evaluationStatus?: number
  /** 状态（别名） */
  status?: number
  /** 评估状态名称 */
  evaluationStatusName?: string
  /** 评语 */
  comments: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效评估列表查询参数
 */
export interface PerformanceEvaluationListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 部门名称 */
  departmentName?: string
  /** 考核周期ID - 支持 number | string | null */
  cycleId?: number | string | null
  /** 评级 */
  rating?: string
  /** 评估状态 - 支持 number | string | null */
  evaluationStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
