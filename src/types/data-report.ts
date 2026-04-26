/**
 * 数据报表与分析类型定义
 */

/**
 * HR驾驶舱数据
 */
export interface DashboardData {
  /** 在职人数 */
  employeeCount: number
  /** 离职率（%） */
  turnoverRate: number
  /** 招聘进度（%） */
  recruitmentProgress: number
  /** 出勤率（%） */
  attendanceRate: number
  /** 人力成本（元） */
  laborCost: number
  /** 新增人数 */
  newEmployees: number
  /** 离职人数 */
  resignedEmployees: number
  /** 平均司龄（年） */
  avgTenure: number
  /** 人员变化趋势 */
  employeeTrend: TrendData[]
  /** 人力成本趋势 */
  laborCostTrend: CostTrendData[]
}

/**
 * 趋势数据
 */
export interface TrendData {
  /** 月份 */
  date: string
  /** 人数 */
  count: number
}

/**
 * 成本趋势数据
 */
export interface CostTrendData {
  /** 月份 */
  date: string
  /** 成本（元） */
  cost: number
}

/**
 * 人员分析查询参数
 */
export interface PersonnelAnalysisParams {
  /** 分析维度：seniority-司龄/education-学历/age-年龄/gender-性别/department-部门 */
  dimension: 'seniority' | 'education' | 'age' | 'gender' | 'department'
  /** 部门筛选 */
  department?: string
  /** 职级筛选 */
  level?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
}

/**
 * 人员分析数据
 */
export interface PersonnelAnalysisData {
  /** 分类 */
  categories: string[]
  /** 数值 */
  values: number[]
  /** 百分比 */
  percentages: number[]
}

/**
 * 分析项
 */
export interface AnalysisItem {
  /** 标签 */
  label: string
  /** 数量 */
  count: number
}

/**
 * 薪酬分析查询参数
 */
export interface SalaryAnalysisParams {
  /** 时间范围：month-月度/quarter-季度/year-年度 */
  timeRange: 'month' | 'quarter' | 'year'
  /** 部门范围 */
  department?: string
}

/**
 * 薪酬分析数据
 */
export interface SalaryAnalysisData {
  /** 薪酬总额（元） */
  totalSalary: number
  /** 平均薪酬（元） */
  avgSalary: number
  /** 薪酬中位数（元） */
  medianSalary: number
  /** 薪酬分布 */
  distribution: SalaryDistribution[]
  /** 成本趋势 */
  costTrend: CostTrendData[]
}

/**
 * 薪酬分布
 */
export interface SalaryDistribution {
  /** 薪酬区间 */
  range: string
  /** 人数 */
  count: number
}

/**
 * 招聘漏斗报表查询参数（V1.1 管理层快照版）
 */
export interface RecruitmentFunnelParams {
  /** 统计周期：month-月度/quarter-季度/year-年度/custom-自定义 */
  period: 'month' | 'quarter' | 'year' | 'custom'
  /** 开始日期（自定义时使用） */
  startDate?: string
  /** 结束日期（自定义时使用） */
  endDate?: string
  /** 对比模式：chain-环比（上周期）/ year-同比（去年同期）；默认 chain */
  compareMode?: 'chain' | 'year'
  /** 部门范围（可多选，不传则全公司） */
  departmentIds?: number[]
}

/**
 * 漏斗单周期 5 阶段数据
 */
export interface FunnelStageData {
  /** 简历投递数 */
  resumeSubmitted: number
  /** 初筛通过数 */
  resumeScreened: number
  /** 面试安排数 */
  interviewScheduled: number
  /** Offer 发放数 */
  offerSent: number
  /** 入职确认数 */
  onboarded: number
  /** 初筛通过率（%） */
  screenRate: number
  /** 面试安排率（%） */
  interviewRate: number
  /** Offer 发放率（%） */
  offerRate: number
  /** 入职确认率（%） */
  onboardRate: number
}

/**
 * 单个 KPI 指标（含本期、上期、环比变化）
 */
export interface KpiMetric {
  /** 本期值 */
  current: number
  /** 上期值（对比期） */
  previous: number
  /**
   * 变化率（%），正数表示上升，负数表示下降；
   * previous 为 0 时返回 null
   */
  changeRate: number | null
  /** 指标方向：positive-正向（越大越好）/ negative-负向（越小越好） */
  direction: 'positive' | 'negative'
}

/**
 * 月度趋势单个数据点
 */
export interface MonthlyTrendPoint {
  /** 月份 YYYY-MM */
  month: string
  /** 月度入职人数 */
  onboardedCount: number
  /** 月度招聘完成率（%） */
  fillRate: number
}

/**
 * 渠道 TOP5 单项
 */
export interface ChannelTopRow {
  /** 渠道名称 */
  channel: string
  /** 本期该渠道入职人数 */
  onboardedCount: number
  /** 占本期总入职数比例（%） */
  percentage: number
}

/**
 * 招聘漏斗报表数据（V1.1 管理层快照版）
 *
 * 对应需求说明书 16.3.1 招聘漏斗报表字段表五组：
 * - 核心 KPI（6 个带环比）
 * - 双周期漏斗（current + previous）
 * - 月度趋势（近 6 个月）
 * - 渠道 TOP5
 */
export interface RecruitmentFunnelData {
  /** 统计周期起止（用于标题展示） */
  periodLabel: string
  /** 对比期起止（用于标题展示） */
  previousPeriodLabel: string

  /** 核心 KPI · 6 个指标 */
  kpi: {
    /** 本期入职人数 */
    onboarded: KpiMetric
    /** 总转化率（入职/投递）*/
    totalConversion: KpiMetric
    /** 平均招聘周期（天） */
    avgTimeToHire: KpiMetric
    /** Offer 接受率（%） */
    offerAcceptRate: KpiMetric
    /** 需求完成率（%） */
    demandFillRate: KpiMetric
    /** 单人招聘成本 CPH（元） */
    cph: KpiMetric
  }

  /** 双周期漏斗：本期 */
  funnelCurrent: FunnelStageData
  /** 双周期漏斗：上期 */
  funnelPrevious: FunnelStageData

  /** 月度趋势（近 6 个月，最后一个月为当前周期月） */
  monthlyTrend: MonthlyTrendPoint[]

  /** 渠道贡献 TOP5（按入职人数降序）+ "其他"聚合项 */
  channelTop5: ChannelTopRow[]
}

/**
 * 考勤报表查询参数
 */
export interface AttendanceReportParams {
  /** 查询月份 */
  month: string
  /** 部门范围 */
  department?: string
}

/**
 * 考勤报表数据
 */
export interface AttendanceReportData {
  /** 应出勤天数 */
  shouldAttendDays: number
  /** 实际出勤天数 */
  actualAttendDays: number
  /** 迟到次数 */
  lateCount: number
  /** 早退次数 */
  earlyLeaveCount: number
  /** 缺勤次数 */
  absentCount: number
  /** 加班时长（小时） */
  overtimeHours: number
  /** 出勤率（%） */
  attendanceRate: number
  /** 异常明细列表 */
  anomalyList: AttendanceAnomaly[]
}

/**
 * 考勤异常
 */
export interface AttendanceAnomaly {
  /** ID */
  id: number
  /** 员工姓名 */
  employeeName: string
  /** 异常类型 */
  type: string
  /** 日期 */
  date: string
  /** 原因 */
  reason: string
}

/**
 * 报表导出参数
 */
export interface ExportReportParams {
  /** 报表类型 */
  reportType: 'dashboard' | 'personnel' | 'salary' | 'recruitment' | 'attendance'
  /** 导出格式：excel/pdf */
  format: 'excel' | 'pdf'
  /** 其他筛选参数 */
  [key: string]: any
}
