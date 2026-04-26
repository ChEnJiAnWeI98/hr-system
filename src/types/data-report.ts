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
  avgSeniority: number
  /** 人员变化趋势 */
  personnelTrend: TrendData[]
  /** 人力成本趋势 */
  costTrend: CostTrendData[]
}

/**
 * 趋势数据
 */
export interface TrendData {
  /** 月份 */
  month: string
  /** 人数 */
  count: number
}

/**
 * 成本趋势数据
 */
export interface CostTrendData {
  /** 月份 */
  month: string
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
 * 招聘漏斗查询参数
 */
export interface RecruitmentFunnelParams {
  /** 统计周期：month-月度/quarter-季度/year-年度 */
  period: 'month' | 'quarter' | 'year'
}

/**
 * 招聘漏斗数据
 */
export interface RecruitmentFunnelData {
  /** 简历投递数 */
  resumeReceived: number
  /** 筛选通过数 */
  resumeScreened: number
  /** 面试安排数 */
  interviewScheduled: number
  /** Offer发放数 */
  offerSent: number
  /** 入职确认数 */
  onboarded: number
  /** 筛选通过率（%） */
  screenRate: number
  /** 面试安排率（%） */
  interviewRate: number
  /** Offer发放率（%） */
  offerRate: number
  /** 入职确认率（%） */
  onboardRate: number
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
