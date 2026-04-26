/**
 * AI 智能匹配 Phase 5.1 类型定义
 */

/** 匹配维度 */
export type MatchDimension = 'skill' | 'experience' | 'education' | 'location' | 'salary'

/** 推荐等级：强匹配 / 一般匹配 / 待定 / 不匹配 */
export type MatchRecommendLevel = 'strong_match' | 'match' | 'maybe' | 'not_match'

/** 各维度评分 */
export interface DimensionScores {
  /** 技能匹配度（0-100） */
  skill: number
  /** 经验匹配度（0-100） */
  experience: number
  /** 学历匹配度（0-100） */
  education: number
  /** 地域匹配度（0-100） */
  location: number
  /** 薪资匹配度（0-100） */
  salary: number
}

/**
 * AI 匹配结果
 */
export interface AIMatchResult {
  id: number
  /** 简历 ID */
  resumeId: number
  /** 候选人姓名 */
  candidateName: string
  /** 职位 ID */
  jobId: number
  /** 职位名称 */
  jobTitle: string
  /** 部门 */
  department: string
  /** 总分（0-100） */
  totalScore: number
  /** 各维度评分 */
  dimensionScores: DimensionScores
  /** 匹配命中的关键词 */
  matchedKeywords: string[]
  /** 简历中缺失的关键词 */
  missedKeywords: string[]
  /** AI 建议 */
  aiSuggestion: string
  /** 推荐等级 */
  recommendLevel: MatchRecommendLevel
  /** 匹配时间 */
  matchTime: string
}

/**
 * 匹配规则
 */
export interface MatchingRule {
  id: number
  name: string
  /** 适用岗位族 */
  jobFamily: string
  /** 各维度权重（总和应为 100） */
  dimensionWeights: {
    skill: number
    experience: number
    education: number
    location: number
    salary: number
  }
  /** 核心技能关键词（加权高） */
  coreSkills: string[]
  /** 加分关键词 */
  bonusSkills: string[]
  /** 淘汰关键词（命中直接归零） */
  excludeKeywords: string[]
  /** 强匹配阈值（默认 80） */
  strongMatchThreshold: number
  /** 一般匹配阈值（默认 65） */
  matchThreshold: number
  /** 待定阈值（默认 50） */
  maybeThreshold: number
  /** 状态 */
  status: 0 | 1
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 匹配查询参数
 */
export interface AIMatchListParams {
  candidateName?: string
  jobTitle?: string
  recommendLevel?: MatchRecommendLevel | ''
  minScore?: number
  maxScore?: number
  page: number
  pageSize: number
}

/**
 * 批量匹配请求
 */
export interface BatchMatchRequest {
  jobId: number
  resumeIds: number[]
  ruleId?: number
}

/**
 * 匹配统计
 */
export interface AIMatchStats {
  totalMatches: number
  strongMatchCount: number
  matchCount: number
  maybeCount: number
  notMatchCount: number
  avgScore: number
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 字典（key 放宽为 string，便于索引 any 字段） */
export const RECOMMEND_LEVEL_MAP: Record<string, { label: string; type: ElTagType; color: string }> = {
  strong_match: { label: '强匹配', type: 'success', color: '#67c23a' },
  match: { label: '一般匹配', type: 'primary', color: '#409eff' },
  maybe: { label: '待定', type: 'warning', color: '#e6a23c' },
  not_match: { label: '不匹配', type: 'info', color: '#909399' }
}

export const DIMENSION_LABEL: Record<string, string> = {
  skill: '技能匹配',
  experience: '经验匹配',
  education: '学历匹配',
  location: '地域匹配',
  salary: '薪资匹配'
}
