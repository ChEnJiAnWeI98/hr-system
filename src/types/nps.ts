/**
 * 候选人满意度 NPS Phase 5.9 类型定义
 */

/** 调研节点：投递后 / 面试后 / 入职后 */
export type NPSStage = 'post_apply' | 'post_interview' | 'post_onboard'

/** NPS 分类：推荐者(9-10) / 中立者(7-8) / 贬损者(0-6) */
export type NPSCategory = 'promoter' | 'passive' | 'detractor'

/** 调研问题类型 */
export type NPSQuestionType = 'score' | 'single_choice' | 'multi_choice' | 'text'

/**
 * 调研问题
 */
export interface NPSQuestion {
  id: number
  /** 问题类型 */
  type: NPSQuestionType
  /** 问题标题 */
  title: string
  /** 是否必填 */
  required: boolean
  /** 选项（single_choice / multi_choice 时） */
  options?: string[]
  /** 占位提示 */
  placeholder?: string
}

/**
 * 调研模板
 */
export interface NPSTemplate {
  id: number
  /** 调研节点 */
  stage: NPSStage
  /** 模板名称 */
  name: string
  /** 主标题 */
  title: string
  /** 副标题/说明 */
  subtitle?: string
  /** 问题列表 */
  questions: NPSQuestion[]
  /** 是否启用 */
  enabled: 0 | 1
  /** 触发延迟（天） */
  triggerDelayDays: number
  createTime: string
  updateTime: string
}

/**
 * NPS 调研回复（候选人反馈）
 */
export interface NPSSurvey {
  id: number
  /** 调研节点 */
  stage: NPSStage
  /** 关联模板 ID */
  templateId: number
  /** 候选人姓名 */
  candidateName: string
  /** 候选人 ID（简历 ID） */
  candidateId: number
  /** 手机号 */
  phone: string
  /** 相关职位 */
  position: string
  /** 相关部门 */
  department: string
  /** NPS 分数（0-10） */
  score: number
  /** NPS 分类 */
  category: NPSCategory
  /** 文字反馈 */
  feedback: string
  /** 标签（自动提取或手工打标） */
  tags: string[]
  /** 所有问题的答案 JSON */
  answers: Record<string, any>
  /** 调研完成时间 */
  surveyTime: string
  createTime: string
}

/** 查询参数 */
export interface NPSSurveyListParams {
  stage?: NPSStage | ''
  category?: NPSCategory | ''
  candidateName?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

/**
 * NPS 总体统计
 */
export interface NPSStats {
  /** 总调研数 */
  totalSurveys: number
  /** 推荐者数 */
  promoterCount: number
  /** 中立者数 */
  passiveCount: number
  /** 贬损者数 */
  detractorCount: number
  /** 总体 NPS 值（-100 ~ 100） */
  npsScore: number
  /** 按节点 NPS */
  byStage: Array<{
    stage: NPSStage
    count: number
    promoterRate: number
    detractorRate: number
    npsScore: number
  }>
  /** 近 6 个月 NPS 趋势 */
  trend: Array<{ month: string; npsScore: number; totalSurveys: number }>
  /** Top 反馈标签 */
  topTags: Array<{ tag: string; count: number; category: NPSCategory }>
}

/**
 * 改进建议（基于贬损者反馈聚类）
 */
export interface NPSImprovement {
  id: number
  /** 问题类别 */
  category: string
  /** 反馈数量 */
  feedbackCount: number
  /** 涉及阶段 */
  stages: NPSStage[]
  /** 典型反馈摘录 */
  sampleFeedbacks: string[]
  /** 建议措施 */
  suggestedActions: string[]
  /** 优先级 */
  priority: 'high' | 'medium' | 'low'
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 字典 */
export const NPS_STAGE_MAP: Record<string, { label: string; description: string; color: string }> = {
  post_apply: { label: '投递后', description: '候选人投递 3 天后发送', color: '#409eff' },
  post_interview: { label: '面试后', description: '面试结束 1 天后发送', color: '#e6a23c' },
  post_onboard: { label: '入职后', description: '入职 7 天后发送', color: '#67c23a' }
}

export const NPS_CATEGORY_MAP: Record<string, { label: string; type: ElTagType; range: string; color: string }> = {
  promoter: { label: '推荐者', type: 'success', range: '9-10 分', color: '#67c23a' },
  passive: { label: '中立者', type: 'warning', range: '7-8 分', color: '#e6a23c' },
  detractor: { label: '贬损者', type: 'danger', range: '0-6 分', color: '#f56c6c' }
}

/** 计算 NPS 分类 */
export function calcNPSCategory(score: number): NPSCategory {
  if (score >= 9) return 'promoter'
  if (score >= 7) return 'passive'
  return 'detractor'
}

/** 计算 NPS 分数（推荐者% - 贬损者%） */
export function calcNPSScore(promoterCount: number, detractorCount: number, total: number): number {
  if (total === 0) return 0
  return Math.round(((promoterCount - detractorCount) / total) * 100)
}
