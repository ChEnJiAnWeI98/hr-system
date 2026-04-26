/**
 * 绩效评估类型定义（Phase A5 升级版）
 * 4 级串行节点：自评 → 直属上级 → 隔级上级 → HR 归档
 */
import type { EvalNodeType } from '@/types/performanceTemplate'

/** 节点填写状态：pending-待开始 / filling-填写中 / submitted-已提交 / overdue-超期 */
export type EvalNodeStatus = 'pending' | 'filling' | 'submitted' | 'overdue'

/** 整体评估状态：1-待自评 2-自评中 3-上级评 4-隔级评 5-HR 归档 6-已归档 7-已校准 */
export type EvalOverallStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** 等级：S/A/B/C/D */
export type EvalGrade = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * 单节点评分详情
 */
export interface NodeScoreDetail {
  /** 维度名 */
  dimension: string
  /** 维度权重 */
  weight: number
  /** 该维度得分 */
  score: number
  /** 评语 */
  comment?: string
}

/**
 * 评估节点记录
 */
export interface EvalNodeRecord {
  /** 节点类型 */
  nodeType: EvalNodeType
  /** 节点名称 */
  nodeName: string
  /** 节点顺序 */
  order: number
  /** 节点对综合得分的权重（%） */
  weight: number
  /** 节点状态 */
  status: EvalNodeStatus
  /** 评分人工号 / 姓名 */
  scorerId?: number
  scorerName?: string
  /** 各维度得分 */
  dimensionScores?: NodeScoreDetail[]
  /** 该节点加权综合分（Σ 维度权重×维度得分 / 100 × 20，转换为 0-100 分）*/
  weightedScore?: number
  /** 评语 / 工作总结 / 亮点 / 不足（JSON） */
  comment?: string
  /** 草稿保存时间 */
  draftSaveTime?: string
  /** 最终提交时间 */
  submitTime?: string
  /** 截止时间 */
  deadline?: string
}

/**
 * 绩效评估任务
 */
export interface PerformanceEvaluation {
  id: number
  /** 评估编号 */
  evaluationNo?: string
  /** 员工 ID / 姓名 / 部门 */
  employeeId: number
  employeeName: string
  departmentId?: number
  departmentName: string
  /** 岗位族 / 职级（用于匹配模板） */
  jobFamily?: string
  level?: string

  /** 周期 ID / 名称 */
  cycleId: number
  cycleName: string

  /** 关联的评估表模板 ID / 名称 */
  templateId?: number
  templateName?: string

  /** 4 级节点记录（JSON 存储） */
  nodeRecords: EvalNodeRecord[]

  /** 当前活跃节点（对应 nodeRecords 的 order） */
  currentNode?: number

  /** 综合得分（HR 归档时计算）*/
  finalScore?: number
  /** 初步评定等级 */
  initialGrade?: EvalGrade
  /** 最终等级（校准后）*/
  finalGrade?: EvalGrade

  /** 整体评估状态 */
  status: EvalOverallStatus
  statusName?: string

  /** ========== 兼容字段 ========== */
  /** 自评分数（向后兼容） */
  selfScore?: number
  /** 上级评分（向后兼容） */
  managerScore?: number
  /** 同级评分 */
  peerScore?: number
  /** 下级评分 */
  subordinateScore?: number
  /** 评级（向后兼容） */
  rating?: string
  /** 评语（向后兼容） */
  comments?: string
  /** 评估状态（向后兼容字段）*/
  evaluationStatus?: number
  evaluationStatusName?: string

  /** 超期标记 */
  overdue?: 0 | 1
  /** 升级到 HRBP 标记 */
  escalated?: 0 | 1

  createTime: string
  updateTime: string
}

/**
 * 查询参数
 */
export interface PerformanceEvaluationListParams {
  employeeName?: string
  departmentName?: string
  cycleId?: number | string | null
  grade?: EvalGrade | ''
  status?: EvalOverallStatus | string | null
  /** 视角：employee / manager / hr */
  viewAs?: 'employee' | 'manager' | 'hr'
  /** 当前用户 ID（视角筛选用）*/
  currentUserId?: number
  /** 仅超期 */
  overdueOnly?: boolean
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const EVAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: '待自评', type: 'info' },
  2: { label: '自评中', type: 'primary' },
  3: { label: '上级评中', type: 'warning' },
  4: { label: '隔级评中', type: 'warning' },
  5: { label: 'HR 归档中', type: 'primary' },
  6: { label: '已归档', type: 'success' },
  7: { label: '已校准', type: 'success' }
}

export const EVAL_NODE_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  pending: { label: '待开始', type: 'info' },
  filling: { label: '填写中', type: 'warning' },
  submitted: { label: '已提交', type: 'success' },
  overdue: { label: '超期', type: 'danger' }
}

export const GRADE_MAP: Record<string, { label: string; type: ElTagType; color: string }> = {
  S: { label: 'S 卓越', type: 'success', color: '#67c23a' },
  A: { label: 'A 优秀', type: 'primary', color: '#409eff' },
  B: { label: 'B 达标', type: 'info', color: '#909399' },
  C: { label: 'C 待改进', type: 'warning', color: '#e6a23c' },
  D: { label: 'D 不合格', type: 'danger', color: '#f56c6c' }
}

/**
 * 根据总分映射等级（默认映射）
 */
export function scoreToGrade(score: number): EvalGrade {
  if (score >= 90) return 'S'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  return 'D'
}
