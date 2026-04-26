/**
 * 人才盘点（9-box）类型定义（Phase C1b）
 */

/** 盘点会议状态 */
export type TalentReviewStatus = 'preparing' | 'in_progress' | 'completed' | 'archived'

/** 潜力等级（3 档） */
export type PotentialLevel = 'low' | 'medium' | 'high'

/** 业绩等级（3 档，自动从绩效档案映射） */
export type PerformanceLevel = 'low' | 'medium' | 'high'

/** 9-box 位置编码：行列组合 */
export type NineBoxCell =
  | 'LH' // 业绩低 + 潜力高
  | 'MH' // 业绩中 + 潜力高
  | 'HH' // 业绩高 + 潜力高（明日之星）
  | 'LM' // 业绩低 + 潜力中
  | 'MM' // 业绩中 + 潜力中
  | 'HM' // 业绩高 + 潜力中
  | 'LL' // 业绩低 + 潜力低
  | 'ML' // 业绩中 + 潜力低
  | 'HL' // 业绩高 + 潜力低（稳定贡献者）

/** 9-box 分类结果 */
export type NineBoxCategory =
  | 'star' // 明日之星
  | 'core' // 核心骨干
  | 'solid' // 稳定贡献者
  | 'high_potential' // 高潜新星
  | 'average' // 一般贡献者
  | 'observation' // 待观察
  | 'misfit' // 错位可培养
  | 'dilemma' // 待培养
  | 'underperformer' // 不合格

/** 应用建议 */
export type TalentApplySuggestion =
  | 'promote' // 晋升建议
  | 'rotate' // 轮岗建议
  | 'train' // 培养计划
  | 'pip' // 转入 PIP
  | 'retain' // 保留稳定
  | 'none' // 无建议

/**
 * 盘点条目（某次会议中某位员工的盘点结果）
 */
export interface TalentReviewEntry {
  /** 员工 ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 部门 */
  department: string
  /** 岗位 */
  position: string
  /** 岗位族 */
  jobFamily: string
  /** 绩效等级（从最近一次绩效档案读取） */
  performanceGrade: 'S' | 'A' | 'B' | 'C' | 'D'
  /** 业绩等级（3 档，自动映射：S/A→high, B→medium, C/D→low） */
  performanceLevel: PerformanceLevel
  /** 潜力等级（3 档，盘点会议期间评估） */
  potentialLevel: PotentialLevel
  /** 当前 9-box 位置 */
  currentCell: NineBoxCell
  /** 初始 9-box 位置（用于对比） */
  initialCell: NineBoxCell
  /** 9-box 分类结果 */
  category: NineBoxCategory
  /** 盘点评语 */
  reviewComment?: string
  /** 应用建议 */
  applySuggestion: TalentApplySuggestion
  /** 调整历史 */
  adjustHistory?: Array<{
    from: NineBoxCell
    to: NineBoxCell
    adjustBy: string
    adjustTime: string
    reason?: string
  }>
}

/**
 * 盘点会议
 */
export interface TalentReviewMeeting {
  id: number
  /** 会议编号 */
  meetingNo: string
  /** 会议名称 */
  meetingName: string
  /** 所属绩效周期 */
  cycleId: number
  cycleName: string
  /** 适用部门 */
  departments: string[]
  /** 主持人 */
  hostName: string
  hostId?: number
  /** 计划会议时间 */
  scheduledTime: string
  /** 参与盘点员工总数 */
  participantCount: number
  /** 状态 */
  status: TalentReviewStatus
  /** 盘点条目（工作台使用） */
  entries: TalentReviewEntry[]
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 会议查询参数
 */
export interface TalentReviewMeetingListParams {
  meetingName?: string
  cycleId?: number | null
  status?: TalentReviewStatus | ''
  page: number
  pageSize: number
}

/** ========== 字典 ========== */

export const TALENT_STATUS_LABEL: Record<TalentReviewStatus, string> = {
  preparing: '筹备中',
  in_progress: '进行中',
  completed: '已完成',
  archived: '已归档'
}

export const TALENT_STATUS_TYPE: Record<
  TalentReviewStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  preparing: 'info',
  in_progress: 'warning',
  completed: 'success',
  archived: 'info'
}

export const POTENTIAL_LEVEL_LABEL: Record<PotentialLevel, string> = {
  low: '低',
  medium: '中',
  high: '高'
}

export const PERFORMANCE_LEVEL_LABEL: Record<PerformanceLevel, string> = {
  low: '低',
  medium: '中',
  high: '高'
}

export const NINE_BOX_CATEGORY_LABEL: Record<NineBoxCategory, string> = {
  star: '明日之星',
  core: '核心骨干',
  solid: '稳定贡献者',
  high_potential: '高潜新星',
  average: '一般贡献者',
  observation: '待观察',
  misfit: '错位可培养',
  dilemma: '待培养',
  underperformer: '不合格'
}

export const NINE_BOX_CATEGORY_TYPE: Record<
  NineBoxCategory,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  star: 'success',
  core: 'primary',
  solid: 'info',
  high_potential: 'success',
  average: 'info',
  observation: 'warning',
  misfit: 'warning',
  dilemma: 'warning',
  underperformer: 'danger'
}

export const APPLY_SUGGESTION_LABEL: Record<TalentApplySuggestion, string> = {
  promote: '晋升建议',
  rotate: '轮岗建议',
  train: '培养计划',
  pip: '转入 PIP',
  retain: '保留稳定',
  none: '暂无建议'
}

/** 9-box 位置 → 分类 */
export const NINE_BOX_CELL_CATEGORY: Record<NineBoxCell, NineBoxCategory> = {
  HH: 'star',
  HM: 'core',
  HL: 'solid',
  MH: 'high_potential',
  MM: 'average',
  ML: 'observation',
  LH: 'misfit',
  LM: 'dilemma',
  LL: 'underperformer'
}

/** 9-box 位置 → 默认应用建议 */
export const NINE_BOX_CELL_DEFAULT_SUGGESTION: Record<NineBoxCell, TalentApplySuggestion> = {
  HH: 'promote',
  HM: 'retain',
  HL: 'retain',
  MH: 'train',
  MM: 'none',
  ML: 'none',
  LH: 'rotate',
  LM: 'train',
  LL: 'pip'
}

/** 业绩等级映射 */
export function mapPerformanceLevel(grade: 'S' | 'A' | 'B' | 'C' | 'D'): PerformanceLevel {
  if (grade === 'S' || grade === 'A') return 'high'
  if (grade === 'B') return 'medium'
  return 'low'
}

/** 组合成 9-box 位置 */
export function toNineBoxCell(perf: PerformanceLevel, pot: PotentialLevel): NineBoxCell {
  const perfCode = perf === 'high' ? 'H' : perf === 'medium' ? 'M' : 'L'
  const potCode = pot === 'high' ? 'H' : pot === 'medium' ? 'M' : 'L'
  return `${perfCode}${potCode}` as NineBoxCell
}

/** 解析 9-box 位置 */
export function parseNineBoxCell(cell: NineBoxCell): {
  performance: PerformanceLevel
  potential: PotentialLevel
} {
  const perfMap: Record<string, PerformanceLevel> = { H: 'high', M: 'medium', L: 'low' }
  const potMap: Record<string, PotentialLevel> = { H: 'high', M: 'medium', L: 'low' }
  return {
    performance: perfMap[cell[0]],
    potential: potMap[cell[1]]
  }
}
