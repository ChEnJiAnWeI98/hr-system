/**
 * 绩效校准类型定义（Phase A7 升级版）
 * 强制分布 S/A/B/C/D + 校准会议 + 调档记录
 */
import type { EvalGrade } from '@/types/performanceEvaluation'

/** 校准会议状态 */
export type CalibrationMeetingStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled'

/**
 * 强制分布配置
 */
export interface DistributionConfig {
  S: number
  A: number
  B: number
  C: number
  D: number
  /** 容差 ±% */
  tolerance: number
}

/**
 * 校准记录（每次调档留痕）
 */
export interface CalibrationRecord {
  id: number
  /** 关联评估 ID */
  evaluationId: number
  employeeId: number
  employeeName: string
  departmentName: string
  /** 原始得分 */
  originalScore: number
  /** 调整前等级 */
  beforeGrade: EvalGrade
  /** 调整后等级 */
  afterGrade: EvalGrade
  /** 调整原因 */
  reason: string
  /** 关联校准会议 ID */
  meetingId?: number
  /** 调整人 */
  adjustedBy: string
  adjustedById: number
  adjustTime: string
}

/**
 * 校准会议
 */
export interface CalibrationMeeting {
  id: number
  meetingNo: string
  /** 周期 ID */
  cycleId: number
  cycleName: string
  /** 会议主题 */
  title: string
  /** 会议时间 */
  meetingTime: string
  /** 参会人（JSON: [{id, name, role}]）*/
  attendees: Array<{ id: number; name: string; role: string }>
  /** 覆盖范围（部门列表） */
  departments: string[]
  /** 会议纪要 */
  minutes?: string
  /** 会议状态 */
  status: CalibrationMeetingStatus
  /** 调档数量 */
  adjustCount?: number
  createTime: string
  updateTime: string
}

/**
 * 部门校准汇总（用于部门对标视图）
 */
export interface DepartmentCalibrationSummary {
  departmentId?: number
  departmentName: string
  totalEmployees: number
  /** 各等级人数 */
  gradeDistribution: {
    S: number
    A: number
    B: number
    C: number
    D: number
  }
  /** 各等级比例（%） */
  gradeRatios: {
    S: number
    A: number
    B: number
    C: number
    D: number
  }
  /** 部门平均分 */
  avgScore: number
  /** 与强制分布的偏差（绝对值 %）*/
  deviation: number
  /** 是否符合强制分布 */
  compliant: boolean
}

/* 原兼容类型保留 */
export interface PerformanceCalibration {
  id: number
  cycleId: number
  cycleName: string
  departmentId: number
  departmentName: string
  excellentRatio: number
  goodRatio: number
  qualifiedRatio: number
  improveRatio: number
  totalEmployees: number
  excellentCount: number
  goodCount: number
  qualifiedCount: number
  improveCount: number
  status: number
  statusName?: string
  calibrationDate: string
  createTime: string
  updateTime: string
}

export interface PerformanceCalibrationListParams {
  cycleName?: string
  departmentName?: string
  status?: number | string | null
  page: number
  pageSize: number
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const MEETING_STATUS_MAP: Record<string, { label: string; type: ElTagType }> = {
  planning: { label: '计划中', type: 'info' },
  in_progress: { label: '进行中', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' }
}

/** 默认强制分布配置 */
export const DEFAULT_DISTRIBUTION: DistributionConfig = {
  S: 10, A: 20, B: 40, C: 20, D: 10, tolerance: 2
}
