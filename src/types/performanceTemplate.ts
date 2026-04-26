/**
 * 评估表模板 类型定义（Phase A2）
 */

/** 评估类型 */
export type TemplateEvalType = 'okr' | 'kpi' | 'mixed'

/** 评估节点类型 */
export type EvalNodeType = 'self' | 'direct' | 'skip' | 'hr'

/**
 * 子指标（维度下一层）
 */
export interface SubIndicator {
  /** 子指标名称 */
  name: string
  /** 权重（0-100，同一维度下所有子指标权重和 = 100）*/
  weight: number
  /** 5 级评分引导文案（1 分 / 2 分 / 3 分 / 4 分 / 5 分） */
  scoringGuide?: {
    s1?: string
    s2?: string
    s3?: string
    s4?: string
    s5?: string
  }
}

/**
 * 评估维度
 */
export interface EvalDimension {
  /** 维度名 */
  name: string
  /** 维度权重（0-100，所有维度权重和 = 100） */
  weight: number
  /** 维度描述 */
  description?: string
  /** 子指标列表 */
  subIndicators: SubIndicator[]
}

/**
 * 评估节点
 */
export interface EvalNode {
  /** 节点类型 */
  nodeType: EvalNodeType
  /** 节点名称（可自定义，默认按类型） */
  nodeName: string
  /** 该节点对综合得分的权重（0-100，所有节点权重和 = 100） */
  weight: number
  /** 顺序（1 ~ N） */
  order: number
  /** 截止天数（从节点开始日算起） */
  deadlineDays?: number
}

/**
 * 等级映射
 */
export interface GradeMapping {
  /** 等级 */
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  /** 分数下限（含） */
  minScore: number
  /** 分数上限（含） */
  maxScore: number
  /** 等级描述 */
  label: string
}

/**
 * 评估表模板
 */
export interface PerformanceTemplate {
  id: number
  /** 模板编号 */
  templateNo: string
  /** 模板名称 */
  templateName: string
  /** 适用岗位族 */
  jobFamily: string
  /** 适用职级（如 P5-P7 / P8+ / 总监及以上）*/
  level: string
  /** 评估类型 */
  evalType: TemplateEvalType
  /** 评估维度列表（JSON 存储） */
  dimensions: EvalDimension[]
  /** 评估节点列表（JSON 存储） */
  evalNodes: EvalNode[]
  /** 等级映射（JSON 存储） */
  gradeMapping: GradeMapping[]
  /** 启用状态：0-禁用，1-启用 */
  status: 0 | 1
  /** 版本号 */
  version: number
  /** 是否被周期引用（一旦被引用即不可编辑，需复制新版本） */
  inUse?: boolean
  /** 备注 */
  remark?: string
  /** 创建人 */
  createdBy?: string
  createTime: string
  updateTime: string
}

/**
 * 模板查询参数
 */
export interface PerformanceTemplateListParams {
  templateName?: string
  jobFamily?: string
  level?: string
  evalType?: TemplateEvalType | ''
  status?: 0 | 1 | null
  page: number
  pageSize: number
}

/** 字典 */
export const EVAL_TYPE_LABEL: Record<TemplateEvalType, string> = {
  okr: 'OKR 评估',
  kpi: 'KPI 评估',
  mixed: '混合评估'
}

export const EVAL_NODE_LABEL: Record<EvalNodeType, string> = {
  self: '自评',
  direct: '直属上级评',
  skip: '隔级上级评',
  hr: 'HR 归档'
}

/**
 * 默认 4 级串行节点
 */
export const DEFAULT_EVAL_NODES: EvalNode[] = [
  { nodeType: 'self', nodeName: '自评', weight: 10, order: 1, deadlineDays: 5 },
  { nodeType: 'direct', nodeName: '直属上级评', weight: 60, order: 2, deadlineDays: 7 },
  { nodeType: 'skip', nodeName: '隔级上级评', weight: 30, order: 3, deadlineDays: 5 },
  { nodeType: 'hr', nodeName: 'HR 归档', weight: 0, order: 4, deadlineDays: 3 }
]

/**
 * 默认等级映射
 */
export const DEFAULT_GRADE_MAPPING: GradeMapping[] = [
  { grade: 'S', minScore: 90, maxScore: 100, label: '卓越' },
  { grade: 'A', minScore: 80, maxScore: 89, label: '优秀' },
  { grade: 'B', minScore: 70, maxScore: 79, label: '达标' },
  { grade: 'C', minScore: 60, maxScore: 69, label: '待改进' },
  { grade: 'D', minScore: 0, maxScore: 59, label: '不合格' }
]
