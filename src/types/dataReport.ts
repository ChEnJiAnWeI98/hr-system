/**
 * 数据报表模块类型定义
 */

/**
 * 驾驶舱查询参数
 */
export interface DashboardParams {
  /** 时间范围 */
  timeRange: 'month' | 'quarter' | 'year' | 'custom'
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
}

/**
 * 驾驶舱数据
 */
export interface DashboardData {
  /** 在职人数 */
  employeeCount: number
  /** 离职率 */
  turnoverRate: number
  /** 招聘进度 */
  recruitmentProgress: number
  /** 出勤率 */
  attendanceRate: number
  /** 人力成本 */
  laborCost: number
  /** 新增人数 */
  newEmployees: number
  /** 离职人数 */
  resignedEmployees: number
  /** 平均司龄 */
  avgTenure: number
  /** 人员变化趋势 */
  employeeTrend: TrendData[]
  /** 人力成本趋势 */
  laborCostTrend: TrendData[]
}

/**
 * 趋势数据
 */
export interface TrendData {
  /** 日期 */
  date: string
  /** 在职人数 */
  employeeCount?: number
  /** 新增人数 */
  newEmployees?: number
  /** 离职人数 */
  resignedEmployees?: number
  /** 人力成本 */
  laborCost?: number
}

/**
 * 报表导出参数
 */
export interface ExportReportParams {
  /** 报表类型 */
  reportType: 'dashboard' | 'personnel' | 'recruitment' | 'attendance' | 'salary'
  /** 导出格式 */
  format: 'excel' | 'pdf' | string
  /** 维度 */
  dimension?: 'department' | 'gender' | 'education' | 'age' | 'seniority' | string
  /** 部门 */
  department?: string
  /** 级别 */
  level?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
}

/**
 * 人员分析查询参数
 */
export interface PersonnelAnalysisParams {
  /** 分析维度 */
  dimension: 'department' | 'gender' | 'education' | 'age' | 'seniority' | string
  /** 部门 */
  department?: string
  /** 级别 */
  level?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
}
