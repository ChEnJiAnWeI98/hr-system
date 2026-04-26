/**
 * 绩效管理相关类型定义
 */

/**
 * 绩效周期
 */
export interface PerformanceCycle {
  /** ID */
  id: number
  /** 周期编号：PERF + 年 + 周期类型 + 序号 */
  cycleNo?: string
  /** 周期名称 */
  cycleName: string
  /** 周期类型：1-年度，2-半年度，3-季度，4-月度，5-自定义 */
  cycleType: number
  /** 周期类型名称 */
  cycleTypeName?: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string

  /** ========== Phase A1：关键节点（6 个）========== */
  /** 目标设定截止日 */
  goalDeadline?: string
  /** 过程跟踪节点（季度周期月末 / 年度周期双月末；JSON 字符串存日期数组） */
  trackingNodes?: string
  /** 评估开始日 */
  evalStartDate?: string
  /** 评估截止日 */
  evalEndDate?: string
  /** 校准完成日 */
  calibrationDate?: string
  /** 归档完成日 */
  archiveDate?: string

  /**
   * 状态：1-未开始，2-目标设定中，3-过程跟踪中，4-评估中，5-校准中，6-公示中，7-已归档
   * 严格按顺序流转，不可跳过或回退
   */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 参与人数 */
  participantCount: number
  /** 备注 */
  remark: string

  /** ========== Phase A1：适用范围 & 评估表模板组 ========== */
  /** 适用范围（JSON：部门 ID 数组 / 岗位族 / 职级；为空表示全员） */
  applyScope?: string
  /** 关联评估表模板组（JSON：[{ templateId, templateName }]） */
  templateGroup?: string
  /** 目标模式：okr / kpi / mixed（默认 mixed）*/
  goalMode?: 'okr' | 'kpi' | 'mixed'
  /** 强制分布配置（JSON：{S:10, A:20, B:40, C:20, D:10, tolerance:2}）*/
  distributionConfig?: string
  /** 复用自哪个周期 ID（复用创建时回填）*/
  clonedFromId?: number

  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 周期类型字典
 */
export const CYCLE_TYPE_MAP: Record<number, string> = {
  1: '年度',
  2: '半年',
  3: '季度',
  4: '月度',
  5: '自定义'
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/**
 * 周期状态字典 - 7 态状态机
 */
export const CYCLE_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: '未开始', type: 'info' },
  2: { label: '目标设定中', type: 'warning' },
  3: { label: '过程跟踪中', type: 'primary' },
  4: { label: '评估中', type: 'warning' },
  5: { label: '校准中', type: 'warning' },
  6: { label: '公示中', type: 'success' },
  7: { label: '已归档', type: 'info' }
}

/**
 * 周期状态流转的合法下一状态
 */
export const CYCLE_NEXT_STATUS: Record<number, number | null> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: null
}

/**
 * 周期节点定义（用于甘特图渲染）
 */
export interface CycleMilestone {
  key: string
  label: string
  date?: string
  status: 'done' | 'current' | 'pending'
}

/**
 * 绩效周期查询参数
 */
export interface PerformanceCycleListParams {
  /** 周期名称 */
  cycleName?: string
  /** 周期类型 */
  cycleType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 绩效目标
 */
export interface PerformanceGoal {
  /** ID */
  id: number
  /** 周期ID */
  cycleId: number
  /** 周期名称 */
  cycleName: string
  /** 绩效周期（别名） */
  performancePeriod?: string
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门ID */
  departmentId?: number
  /** 部门名称 */
  departmentName: string
  /** 目标类型：1-个人目标，2-团队目标 */
  goalType: number
  /** 目标类型名称 */
  goalTypeName?: string
  /** 目标名称 */
  goalName: string
  /** 目标标题（别名） */
  goalTitle?: string
  /** 目标描述 */
  goalDescription: string
  /** 权重（百分比） */
  weight: number
  /** 目标值 */
  targetValue: string
  /** 实际完成值 */
  actualValue: string
  /** 当前值（别名） */
  currentValue?: string
  /** 完成率（百分比） */
  completionRate: number
  /** 进度（别名） */
  progress?: number
  /** 状态：1-草稿，2-待审核，3-已通过，4-已驳回 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效目标查询参数
 */
export interface PerformanceGoalListParams {
  /** 周期ID */
  cycleId?: number | string | null
  /** 员工姓名 */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 绩效周期（别名） */
  performancePeriod?: string
  /** 目标类型 */
  goalType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 绩效评估
 */
export interface PerformanceEvaluation {
  /** ID */
  id: number
  /** 周期ID */
  cycleId: number
  /** 周期名称 */
  cycleName: string
  /** 被评估人ID */
  employeeId: number
  /** 被评估人工号 */
  employeeCode: string
  /** 被评估人姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 评估人ID */
  evaluatorId: number
  /** 评估人姓名 */
  evaluatorName: string
  /** 自评分数 */
  selfScore: number
  /** 上级评分 */
  supervisorScore: number
  /** 同事评分 */
  peerScore: number
  /** 下级评分 */
  subordinateScore: number
  /** 最终得分 */
  finalScore: number
  /** 评估等级：A-优秀，B-良好，C-合格，D-待改进，E-不合格 */
  evaluationGrade: string
  /** 评估状态：1-待自评，2-待上级评，3-待同事评，4-待下级评，5-已完成 */
  evaluationStatus: number
  /** 评估状态名称 */
  evaluationStatusName?: string
  /** 评估意见 */
  evaluationComment: string
  /** 改进建议 */
  improvementSuggestion: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效评估查询参数
 */
export interface PerformanceEvaluationListParams {
  /** 周期ID */
  cycleId?: number | string | null
  /** 被评估人姓名 */
  employeeName?: string
  /** 评估等级 */
  evaluationGrade?: string
  /** 评估状态 */
  evaluationStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 绩效校准
 */
export interface PerformanceCalibration {
  /** ID */
  id: number
  /** 周期ID */
  cycleId: number
  /** 周期名称 */
  cycleName: string
  /** 校准会议名称 */
  meetingName: string
  /** 校准日期 */
  calibrationDate: string
  /** 参与人员 */
  participants: string
  /** 校准前分布 */
  beforeDistribution: string
  /** 校准后分布 */
  afterDistribution: string
  /** 调整人数 */
  adjustmentCount: number
  /** 校准说明 */
  calibrationNote: string
  /** 状态：1-待校准，2-已完成 */
  status: number
  /** 状态名称 */
  statusName?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效校准查询参数
 */
export interface PerformanceCalibrationListParams {
  /** 周期ID */
  cycleId?: number | string | null
  /** 会议名称 */
  meetingName?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 绩效档案
 */
export interface PerformanceArchive {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 周期ID */
  cycleId: number
  /** 周期名称 */
  cycleName: string
  /** 最终得分 */
  finalScore: number
  /** 评估等级 */
  evaluationGrade: string
  /** 排名 */
  ranking: number
  /** 总人数 */
  totalCount: number
  /** 排名百分比 */
  rankingPercentage: number
  /** 绩效奖金 */
  performanceBonus: number
  /** 评估意见 */
  evaluationComment: string
  /** 改进建议 */
  improvementSuggestion: string
  /** 归档时间 */
  archiveTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 绩效档案查询参数
 */
export interface PerformanceArchiveListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 周期ID */
  cycleId?: number | string | null
  /** 评估等级 */
  evaluationGrade?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
