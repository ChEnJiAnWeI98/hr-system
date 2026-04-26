/**
 * 绩效数据分析 类型定义（Phase B3）
 */
import type { EvalGrade } from '@/types/performanceEvaluation'

export interface AnalyticsQueryParams {
  cycleId?: number | null
  departmentName?: string
  jobFamily?: string
}

/** 等级分布 */
export interface GradeDistribution {
  total: number
  S: number
  A: number
  B: number
  C: number
  D: number
  ratios: { S: number; A: number; B: number; C: number; D: number }
}

/** 部门对比行 */
export interface DepartmentCompareRow {
  departmentName: string
  total: number
  avgScore: number
  gradeRatios: { S: number; A: number; B: number; C: number; D: number }
  SACount: number
  CDCount: number
}

/** 岗位族对比行 */
export interface JobFamilyCompareRow {
  jobFamily: string
  total: number
  avgScore: number
  highRate: number
}

/** 周期趋势点 */
export interface CycleTrendPoint {
  cycleId: number
  cycleName: string
  total: number
  avgScore: number
  SARate: number
  CDRate: number
}

/** 评估人画像 */
export interface ReviewerProfile {
  reviewerId: number
  reviewerName: string
  department: string
  reviewCount: number
  avgScore: number
  stdev: number
  /** 偏宽 / 偏严 / 中庸 */
  tendency: 'loose' | 'strict' | 'neutral'
  /** 打分分布 */
  scoreBuckets: { range: string; count: number }[]
}

/** 异常项 */
export interface AnomalyItem {
  type: 'score_wall' | 'grade_skew' | 'score_volatile' | 'low_diversity'
  severity: 'high' | 'medium' | 'low'
  target: string
  description: string
  detectedAt: string
}

/** 高潜 / 需关注员工 */
export interface EmpPotentialItem {
  employeeId: number
  employeeName: string
  department: string
  avgScore: number
  recentGrades: EvalGrade[]
  signalType: 'hipo' | 'attention'
  reason: string
}

/** 过程完成率 */
export interface ProcessCompletionRate {
  oooCoverage: number
  meetingCompleteRate: number
  meetingConfirmRate: number
  goalApprovedRate: number
  pipPassRate: number
}

/** 综合仪表盘 */
export interface AnalyticsDashboard {
  distribution: GradeDistribution
  departments: DepartmentCompareRow[]
  jobFamilies: JobFamilyCompareRow[]
  cycleTrend: CycleTrendPoint[]
  reviewerProfiles: ReviewerProfile[]
  anomalies: AnomalyItem[]
  hipoList: EmpPotentialItem[]
  attentionList: EmpPotentialItem[]
  processCompletion: ProcessCompletionRate
}
