/**
 * 招聘数据分析 Phase 3.1 类型定义
 * 对应需求说明书 11.3.6 招聘数据分析
 */

/** 分析周期类型 */
export type AnalyticsPeriod = 'month' | 'quarter' | 'year' | 'custom'

/** 通用查询参数 */
export interface AnalyticsQueryParams {
  period?: AnalyticsPeriod
  startDate?: string
  endDate?: string
  departmentId?: number | string | null
  jobFamily?: string
  channel?: string
}

/** 驾驶舱核心指标 */
export interface RecruitmentDashboardStats {
  /** 进行中的需求数 */
  activeDemandCount: number
  /** 本周期新增需求 */
  newDemandCount: number
  /** 已发布职位数 */
  publishedJobCount: number
  /** 本周期新增简历 */
  newResumeCount: number
  /** 本周期安排面试 */
  interviewCount: number
  /** 本周期已发 Offer */
  offerCount: number
  /** 本周期已入职 */
  onboardedCount: number
  /** 本周期爽约数 */
  noShowCount: number
  /** 爽约率（百分数，保留 1 位） */
  noShowRate: number
  /** 需求完成率（已入职 / 需求名额） */
  demandFillRate: number
  /** 平均招聘周期（天） */
  avgTimeToHire: number
  /** Offer 接受率 */
  offerAcceptRate: number
}

/** 招聘漏斗数据 */
export interface RecruitmentFunnelData {
  resumeSubmitted: number
  resumeScreened: number
  interviewScheduled: number
  interviewPassed: number
  offerSent: number
  offerAccepted: number
  onboarded: number
}

/** 漏斗转化阶段明细 */
export interface FunnelStage {
  stage: string
  count: number
  rate: string
}

/** 渠道分析行 */
export interface ChannelEffectRow {
  /** 渠道名称（如 Boss直聘 / 猎聘 / 内推） */
  channel: string
  /** 渠道投递数 */
  resumeCount: number
  /** 进入面试数 */
  interviewCount: number
  /** 发放 Offer */
  offerCount: number
  /** 入职数 */
  onboardedCount: number
  /** 本周期投入（元） */
  cost: number
  /** CPH 单人招聘成本 */
  cph: number
  /** ROI = 入职数 / 成本 * 1w（入职/万元） */
  roi: number
  /** 转化率（入职/投递） */
  conversionRate: number
}

/** 渠道成本登记 */
export interface ChannelCostRecord {
  id: number
  channel: string
  /** 月份 YYYY-MM */
  month: string
  /** 投入金额（元） */
  amount: number
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/** 周期分析行（按岗位族/部门聚合） */
export interface TimeToFillRow {
  /** 维度名称（岗位族或部门） */
  dimension: string
  /** 招聘数量 */
  hireCount: number
  /** Time-to-Fill（职位发布→首个 Offer，天） */
  timeToFill: number
  /** Time-to-Hire（需求提出→首个入职，天） */
  timeToHire: number
  /** 超期占比 */
  overtimeRate: number
}

/** 面试官效率行 */
export interface InterviewerEfficiencyRow {
  interviewer: string
  /** 累计面试场次 */
  interviewCount: number
  /** 通过数（result=1） */
  passCount: number
  /** 不通过数（result=3） */
  failCount: number
  /** 通过率 */
  passRate: number
  /** 延期/取消数 */
  cancelCount: number
  /** 平均评分 */
  avgRating: number
}

/** 需求完成率行 */
export interface DemandCompletionRow {
  demandNo: string
  positionName: string
  departmentName: string
  recruitCount: number
  onboardedCount: number
  fillRate: number
  daysElapsed: number
  status: string
}

/** 导出参数 */
export interface AnalyticsExportParams extends AnalyticsQueryParams {
  /** 导出模块 */
  module: 'funnel' | 'channel' | 'time' | 'interviewer' | 'demand' | 'dashboard'
  /** 导出格式 */
  format: 'excel' | 'pdf'
}
