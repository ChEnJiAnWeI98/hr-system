/**
 * 能力模型 类型定义（Phase C1a）
 */

/** 能力类别 */
export type CompetencyCategory = 'general' | 'professional' | 'management'

/** 能力等级 */
export type CompetencyLevel = 1 | 2 | 3 | 4 | 5

/**
 * 等级行为描述（L1 ~ L5）
 */
export interface CompetencyLevelDesc {
  /** 等级 1~5 */
  level: CompetencyLevel
  /** 等级名称（如"入门"、"熟练"、"精通"） */
  levelName: string
  /** 行为化描述 */
  behavior: string
}

/**
 * 能力项
 */
export interface Competency {
  id: number
  /** 能力编码 */
  competencyCode: string
  /** 能力名称 */
  competencyName: string
  /** 能力类别 */
  category: CompetencyCategory
  /** 适用岗位族（多选） */
  jobFamilies: string[]
  /** 能力描述 */
  description: string
  /** 5 级行为化描述 */
  levels: CompetencyLevelDesc[]
  /** 启用状态：0-禁用，1-启用 */
  status: 0 | 1
  /** 排序 */
  sortOrder: number
  /** 创建人 */
  createdBy?: string
  createTime: string
  updateTime: string
}

/**
 * 查询参数
 */
export interface CompetencyListParams {
  competencyName?: string
  category?: CompetencyCategory | ''
  jobFamily?: string
  status?: 0 | 1 | null
  page: number
  pageSize: number
}

/** 字典：能力类别 */
export const COMPETENCY_CATEGORY_LABEL: Record<CompetencyCategory, string> = {
  general: '通用能力',
  professional: '专业能力',
  management: '管理能力'
}

export const COMPETENCY_CATEGORY_TYPE: Record<
  CompetencyCategory,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  general: 'info',
  professional: 'primary',
  management: 'warning'
}

/** 岗位族选项 */
export const JOB_FAMILY_OPTIONS = [
  { label: '技术研发', value: '技术研发' },
  { label: '产品设计', value: '产品设计' },
  { label: '运营市场', value: '运营市场' },
  { label: '销售岗位', value: '销售岗位' },
  { label: '职能支持', value: '职能支持' },
  { label: '管理岗位', value: '管理岗位' }
]

/** 默认 5 级等级名称 */
export const DEFAULT_LEVEL_NAMES = ['入门', '基础', '熟练', '精通', '专家']

/**
 * 创建默认 5 级描述
 */
export function createDefaultLevels(): CompetencyLevelDesc[] {
  return DEFAULT_LEVEL_NAMES.map((name, idx) => ({
    level: (idx + 1) as CompetencyLevel,
    levelName: name,
    behavior: ''
  }))
}
