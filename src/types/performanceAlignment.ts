/**
 * 目标对齐视图 类型定义（Phase A4）
 * 复用 performanceGoal 的 PerformanceGoal 数据作为节点源，本文件定义树节点与对齐关系
 */

/**
 * 目标对齐关系（子目标 → 父目标的多对多关系）
 */
export interface GoalAlignment {
  id: number
  /** 子目标 ID */
  childGoalId: number
  /** 父目标 ID */
  parentGoalId: number
  /** 支撑权重（子对父的支撑程度，%，可选） */
  supportWeight?: number
  /** 建立人 */
  createdBy: string
  /** 建立时间 */
  createTime: string
}

/**
 * OKR 对齐树节点（用于可视化渲染）
 */
export interface OKRTreeNode {
  /** 目标 ID */
  id: number
  /** 目标编号 */
  goalNo?: string
  /** 目标标题 */
  goalTitle: string
  /** 负责人 */
  owner: string
  /** 部门 */
  department: string
  /** 层级（company / department / personal） */
  category: string
  /** 完成度 0-100 */
  progress: number
  /** 审批状态 0-待审批 1-批准 2-驳回 */
  approvalStatus: number
  /** 子节点列表 */
  children?: OKRTreeNode[]
  /** 是否孤岛（没有父目标且非公司级） */
  isOrphan?: boolean
}

/**
 * 对齐统计
 */
export interface AlignmentStats {
  /** 全部目标数 */
  totalGoals: number
  /** 公司级目标数 */
  companyGoals: number
  /** 部门级目标数 */
  departmentGoals: number
  /** 个人级目标数 */
  personalGoals: number
  /** 已对齐目标数（有父目标）*/
  alignedCount: number
  /** 孤岛目标数（非公司级且无父目标）*/
  orphanCount: number
  /** 对齐率（%）*/
  alignmentRate: number
  /** 各部门对齐率 */
  byDepartment: Array<{
    department: string
    total: number
    aligned: number
    rate: number
  }>
}

/**
 * 对齐查询参数
 */
export interface AlignmentQueryParams {
  cycleId?: number | null
  departmentName?: string
  /** 进度最小值（用于筛选） */
  progressMin?: number
  progressMax?: number
}

/* ========== 工具函数 ========== */

/**
 * 根据进度值返回热力颜色
 */
export function progressColor(progress: number): string {
  if (progress >= 80) return '#67c23a'
  if (progress >= 50) return '#409eff'
  if (progress >= 30) return '#e6a23c'
  return '#f56c6c'
}
