/**
 * 目标管理类型定义（Phase A3 升级版）
 * 支持 OKR + KPI 双模式、三层分解、KR 数组、父目标关联、审批、冻结、进度记录
 */

/** 目标模式：OKR / KPI（1=OKR 2=KPI，保留原数值语义）*/
export type GoalMode = 1 | 2

/** 目标层级：公司 / 部门 / 个人（仅 OKR 使用；KPI 默认 personal） */
export type GoalCategory = 'company' | 'department' | 'personal'

/** 审批状态：0-待审批 1-已批准 2-已驳回 3-重新提交 */
export type GoalApprovalStatus = 0 | 1 | 2 | 3

/** 进度状态：0-未开始 1-进行中 2-已完成 3-已取消 */
export type GoalStatus = 0 | 1 | 2 | 3

/**
 * OKR 关键成果（Key Result）
 */
export interface KeyResult {
  /** KR 描述 */
  description: string
  /** 目标值 */
  targetValue: string
  /** 当前值 */
  currentValue: string
  /** 权重（同一 O 下所有 KR 权重和 = 100） */
  weight: number
  /** 完成率（0-100） */
  progress: number
  /** 备注 */
  remark?: string
}

/**
 * 目标管理数据项
 */
export interface PerformanceGoal {
  id: number
  /** 目标编号：GOAL + 年月日 + 4 位流水 */
  goalNo?: string
  /** 员工 ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 部门 ID */
  departmentId?: number
  /** 部门名称 */
  departmentName: string
  /** 岗位族（用于 OKR/KPI 模式自动匹配） */
  jobFamily?: string
  /** 考核周期 ID */
  cycleId: number
  /** 考核周期名称 */
  cycleName: string

  /** 目标类型：1-OKR 2-KPI */
  goalType: GoalMode
  /** 目标类型名称（冗余展示） */
  goalTypeName?: string
  /** 目标层级（OKR 用；KPI 默认 personal） */
  goalCategory?: GoalCategory
  /** 父目标 ID（对齐关系；可选，不强制） */
  parentGoalId?: number
  /** 父目标名称（冗余展示） */
  parentGoalTitle?: string

  /** 目标标题 */
  goalTitle: string
  /** 目标描述 */
  goalDescription: string
  /** 权重（百分比，同一员工所有目标权重和 = 100） */
  weight: number

  /** KPI 模式：目标值 */
  targetValue: string
  /** KPI 模式：当前值 */
  currentValue: string
  /** OKR 模式：KR 数组（JSON） */
  keyResults?: KeyResult[]

  /** 完成进度（百分比，0-100）— OKR：各 KR 加权平均；KPI：手工更新 */
  progress: number

  /** 目标进度状态 */
  status: GoalStatus
  /** 状态名称（冗余） */
  statusName?: string

  /** 审批状态 */
  approvalStatus: GoalApprovalStatus
  /** 审批人工号 / 姓名 */
  approverId?: number
  approverName?: string
  /** 审批时间 */
  approveTime?: string
  /** 审批意见 */
  approveComment?: string

  /** 是否冻结（评估开始后冻结，冻结后不能改结构）*/
  frozen?: 0 | 1

  /** 最近进度更新时间 */
  lastProgressUpdate?: string
  /** 最近进度更新人 */
  lastUpdatedBy?: string

  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 列表查询参数
 */
export interface PerformanceGoalListParams {
  employeeName?: string
  departmentId?: number | string | null
  departmentName?: string
  cycleId?: number | string | null
  goalType?: GoalMode | string | null
  goalCategory?: GoalCategory | ''
  approvalStatus?: GoalApprovalStatus | string | null
  status?: GoalStatus | string | null
  page: number
  pageSize: number
}

/**
 * 进度更新日志
 */
export interface GoalProgressLog {
  id: number
  goalId: number
  /** 更新前进度 */
  beforeProgress: number
  /** 更新后进度 */
  afterProgress: number
  /** 更新前当前值（或 KR 汇总快照）*/
  beforeValue?: string
  /** 更新后当前值 */
  afterValue?: string
  /** 本阶段亮点 */
  highlights?: string
  /** 遇到的问题 */
  issues?: string
  /** 下阶段计划 */
  nextPlan?: string
  /** 更新人 */
  updatedBy: string
  updatedById: number
  updateTime: string
}

/**
 * 目标模板（快速创建常用目标）
 */
export interface GoalTemplate {
  id: number
  templateName: string
  jobFamily: string
  level: string
  /** OKR / KPI */
  goalType: GoalMode
  /** 模板目标标题 */
  goalTitle: string
  /** 模板描述（可引导员工思考） */
  goalDescription: string
  /** KPI 目标值（KPI 模板用）*/
  targetValue?: string
  /** OKR 示例 KR 列表（OKR 模板用） */
  keyResults?: KeyResult[]
  /** 建议权重 */
  suggestedWeight?: number
  remark?: string
  createTime: string
  updateTime: string
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const GOAL_MODE_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: 'OKR', type: 'success' },
  2: { label: 'KPI', type: 'warning' }
}

export const GOAL_CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  company: { label: '公司目标', icon: '🏢' },
  department: { label: '部门目标', icon: '👥' },
  personal: { label: '个人目标', icon: '👤' }
}

export const GOAL_APPROVAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '待审批', type: 'warning' },
  1: { label: '已批准', type: 'success' },
  2: { label: '已驳回', type: 'danger' },
  3: { label: '重新提交', type: 'primary' }
}

export const GOAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '未开始', type: 'info' },
  1: { label: '进行中', type: 'primary' },
  2: { label: '已完成', type: 'success' },
  3: { label: '已取消', type: 'info' }
}

/**
 * 根据岗位族自动匹配模式（技术/产品/研发 → OKR；销售/运营/职能 → KPI）
 */
export function matchGoalMode(jobFamily?: string): GoalMode {
  if (!jobFamily) return 1
  if (['技术研发', '产品设计'].includes(jobFamily)) return 1
  return 2
}
