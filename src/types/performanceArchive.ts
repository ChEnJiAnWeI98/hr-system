/**
 * 绩效档案类型定义（Phase A9 升级版）
 */
import type { EvalGrade } from '@/types/performanceEvaluation'

/**
 * 绩效档案快照（每个周期归档一条）
 */
export interface PerformanceArchive {
  id: number
  /** 档案编号 */
  archiveNo?: string
  employeeId: number
  employeeCode: string
  employeeName: string
  departmentId?: number
  departmentName: string
  positionName: string
  jobFamily?: string
  level?: string
  cycleId: number
  cycleName: string
  cycleEndDate?: string

  /** 综合得分 */
  finalScore: number
  /** 等级（S/A/B/C/D）— 前端需要兼容旧"rating"字段 */
  rating: string
  /** 等级（枚举化）*/
  grade?: EvalGrade

  /** 各维度得分（JSON） */
  dimensionScores?: Array<{ dimension: string; score: number }>

  /** 部门排名 */
  ranking: number
  totalInDepartment: number

  /** 目标完成率 */
  goalCompletionRate?: number

  /** 薪资调整比例（%） */
  salaryAdjustment: number
  /** 晋升情况 */
  promotion: string

  /** 关键事件（用于成长轨迹） */
  events?: Array<{ time: string; type: string; description: string }>

  /** 亮点 / 不足 / 发展计划（来自面谈纪要）*/
  strengths?: string
  weaknesses?: string
  developmentPlan?: string

  /** 是否有 PIP 历史 */
  hasPIP?: boolean

  createTime: string
  archiveTime?: string
}

/** 查询参数 */
export interface PerformanceArchiveListParams {
  employeeName?: string
  departmentName?: string
  cycleName?: string
  rating?: string
  grade?: EvalGrade | ''
  page: number
  pageSize: number
}

/**
 * 员工档案汇总视图（聚合某员工历年所有档案）
 */
export interface EmployeeArchiveView {
  employeeId: number
  employeeName: string
  departmentName: string
  positionName: string
  /** 所有档案（按时间升序）*/
  archives: PerformanceArchive[]
  /** 整体统计 */
  stats: {
    totalCycles: number
    /** 各等级次数 */
    gradeCounts: Record<string, number>
    /** 平均分 */
    avgScore: number
    /** 最近趋势（近 4 个周期） */
    recentTrend: number[]
    /** 是否高潜（连续 2+ 周期 S/A 且无 PIP）*/
    isHiPo: boolean
    /** 是否需关注（近 2 周期有 C/D）*/
    needsAttention: boolean
  }
}
