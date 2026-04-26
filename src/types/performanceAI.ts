/**
 * AI 辅助 类型定义（Phase C3）
 */

/** AI 能力编码 */
export type AIAbilityCode =
  | 'okr_check' // OKR 质量检查
  | 'meeting_agenda' // 面谈提纲生成
  | 'risk_alert' // 高风险员工预警
  | 'feedback_rewrite' // 反馈改写（SBI）
  | 'comment_polish' // 评语优化（不是生成）
  | 'resume_parse' // 智能简历解析（全系统 - 招聘场景）
  | 'salary_sanity_check' // 薪酬合理性检查（全系统 - 薪酬场景）

/** AI 能力成熟度 */
export type AIMaturity = 'stable' | 'beta' | 'experimental'

/** 采纳结果 */
export type AdoptionResult = 'adopted' | 'modified_adopted' | 'rejected' | 'draft'

/**
 * AI 能力定义
 */
export interface AIAbility {
  id: number
  code: AIAbilityCode
  name: string
  icon: string
  description: string
  /** 适用场景 */
  useCase: string
  /** 成熟度 */
  maturity: AIMaturity
  /** 是否启用 */
  status: 0 | 1
  /** 样例输入（演示用） */
  sampleInput: string
  /** 样例输出（演示用） */
  sampleOutput: string
}

/**
 * AI 调用记录
 */
export interface AICallRecord {
  id: number
  /** 能力编码 */
  abilityCode: AIAbilityCode
  /** 能力名称 */
  abilityName: string
  /** 调用人 */
  operatorName: string
  operatorId: number
  /** 目标员工（如果适用） */
  targetEmployee?: string
  targetEmployeeId?: number
  /** 输入摘要 */
  inputSummary: string
  /** 输出摘要 */
  outputSummary: string
  /** 采纳结果 */
  adoptionResult: AdoptionResult
  /** 修改程度（0-100，0=完全未改，100=完全改写） */
  modificationDegree?: number
  /** 调用时间 */
  callTime: string
  createTime: string
}

/**
 * 查询参数
 */
export interface AICallRecordListParams {
  abilityCode?: AIAbilityCode | ''
  operatorName?: string
  adoptionResult?: AdoptionResult | ''
  page: number
  pageSize: number
}

/** 字典 */
export const AI_ABILITY_LABEL: Record<AIAbilityCode, string> = {
  okr_check: 'OKR 质量检查',
  meeting_agenda: '面谈提纲生成',
  risk_alert: '高风险员工预警',
  feedback_rewrite: '反馈改写',
  comment_polish: '评语优化',
  resume_parse: '智能简历解析',
  salary_sanity_check: '薪酬合理性检查'
}

export const MATURITY_LABEL: Record<AIMaturity, string> = {
  stable: '稳定',
  beta: 'Beta',
  experimental: '实验性'
}

export const MATURITY_TYPE: Record<
  AIMaturity,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  stable: 'success',
  beta: 'primary',
  experimental: 'warning'
}

export const ADOPTION_RESULT_LABEL: Record<AdoptionResult, string> = {
  adopted: '原样采纳',
  modified_adopted: '修改后采纳',
  rejected: '放弃',
  draft: '草稿未提交'
}

export const ADOPTION_RESULT_TYPE: Record<
  AdoptionResult,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  adopted: 'success',
  modified_adopted: 'primary',
  rejected: 'info',
  draft: 'warning'
}
