/**
 * 数据报表与分析 Mock 数据
 */

import type {
  DashboardData,
  PersonnelAnalysisParams,
  PersonnelAnalysisData,
  SalaryAnalysisParams,
  SalaryAnalysisData,
  RecruitmentFunnelParams,
  RecruitmentFunnelData,
  AttendanceReportParams,
  AttendanceReportData
} from '@/types/data-report'

/**
 * 获取HR驾驶舱数据 Mock 函数
 */
export function getDashboardDataMock(params?: any): DashboardData {
  return {
    employeeCount: 1250,
    turnoverRate: 3.5,
    recruitmentProgress: 75,
    attendanceRate: 96.8,
    laborCost: 8500000,
    newEmployees: 45,
    resignedEmployees: 28,
    avgSeniority: 3.2,
    personnelTrend: [
      { month: '2025-05', count: 1180 },
      { month: '2025-06', count: 1195 },
      { month: '2025-07', count: 1205 },
      { month: '2025-08', count: 1198 },
      { month: '2025-09', count: 1210 },
      { month: '2025-10', count: 1220 },
      { month: '2025-11', count: 1215 },
      { month: '2025-12', count: 1225 },
      { month: '2026-01', count: 1235 },
      { month: '2026-02', count: 1240 },
      { month: '2026-03', count: 1245 },
      { month: '2026-04', count: 1250 }
    ],
    costTrend: [
      { month: '2025-05', cost: 7800000 },
      { month: '2025-06', cost: 8000000 },
      { month: '2025-07', cost: 8100000 },
      { month: '2025-08', cost: 7950000 },
      { month: '2025-09', cost: 8200000 },
      { month: '2025-10', cost: 8300000 },
      { month: '2025-11', cost: 8250000 },
      { month: '2025-12', cost: 8400000 },
      { month: '2026-01', cost: 8450000 },
      { month: '2026-02', cost: 8480000 },
      { month: '2026-03', cost: 8520000 },
      { month: '2026-04', cost: 8500000 }
    ]
  }
}

/**
 * 获取人员分析数据 Mock 函数
 */
export function getPersonnelAnalysisMock(params: PersonnelAnalysisParams): PersonnelAnalysisData {
  const { dimension } = params

  // 根据不同维度返回不同数据
  const dataMap: Record<string, { categories: string[]; values: number[] }> = {
    seniority: {
      categories: ['0-1年', '1-3年', '3-5年', '5-10年', '10年以上'],
      values: [320, 450, 280, 150, 50]
    },
    education: {
      categories: ['博士', '硕士', '本科', '专科', '高中及以下'],
      values: [35, 280, 720, 180, 35]
    },
    age: {
      categories: ['20-25岁', '26-30岁', '31-35岁', '36-40岁', '41-45岁', '46岁以上'],
      values: [180, 420, 350, 200, 70, 30]
    },
    gender: {
      categories: ['男', '女'],
      values: [720, 530]
    },
    department: {
      categories: ['技术部', '产品部', '市场部', '销售部', '人力资源部', '财务部', '行政部', '客服部'],
      values: [380, 120, 150, 280, 80, 60, 50, 130]
    }
  }

  const data = dataMap[dimension] || dataMap.seniority
  const total = data.values.reduce((sum, val) => sum + val, 0)
  const percentages = data.values.map(val => Number((val / total * 100).toFixed(1)))

  return {
    categories: data.categories,
    values: data.values,
    percentages
  }
}

/**
 * 获取薪酬分析数据 Mock 函数
 */
export function getSalaryAnalysisMock(params: SalaryAnalysisParams): SalaryAnalysisData {
  return {
    totalSalary: 8500000,
    avgSalary: 6800,
    medianSalary: 6200,
    distribution: [
      { range: '3000-5000', count: 180 },
      { range: '5000-8000', count: 520 },
      { range: '8000-12000', count: 380 },
      { range: '12000-20000', count: 140 },
      { range: '20000以上', count: 30 }
    ],
    costTrend: [
      { month: '2025-05', cost: 7800000 },
      { month: '2025-06', cost: 8000000 },
      { month: '2025-07', cost: 8100000 },
      { month: '2025-08', cost: 7950000 },
      { month: '2025-09', cost: 8200000 },
      { month: '2025-10', cost: 8300000 },
      { month: '2025-11', cost: 8250000 },
      { month: '2025-12', cost: 8400000 },
      { month: '2026-01', cost: 8450000 },
      { month: '2026-02', cost: 8480000 },
      { month: '2026-03', cost: 8520000 },
      { month: '2026-04', cost: 8500000 }
    ]
  }
}

/**
 * 获取招聘漏斗数据 Mock 函数
 */
export function getRecruitmentFunnelMock(params: RecruitmentFunnelParams): RecruitmentFunnelData {
  return {
    resumeReceived: 850,
    resumeScreened: 320,
    interviewScheduled: 180,
    offerSent: 85,
    onboarded: 45,
    screenRate: 37.6,
    interviewRate: 56.3,
    offerRate: 47.2,
    onboardRate: 52.9
  }
}

/**
 * 获取考勤报表数据 Mock 函数
 */
export function getAttendanceReportMock(params: AttendanceReportParams): AttendanceReportData {
  return {
    shouldAttendDays: 22,
    actualAttendDays: 21.3,
    lateCount: 45,
    earlyLeaveCount: 12,
    absentCount: 8,
    overtimeHours: 320,
    attendanceRate: 96.8,
    anomalyList: [
      {
        id: 1,
        employeeName: '张三',
        type: '迟到',
        date: '2026-04-01',
        reason: '交通拥堵'
      },
      {
        id: 2,
        employeeName: '李四',
        type: '早退',
        date: '2026-04-02',
        reason: '身体不适'
      },
      {
        id: 3,
        employeeName: '王五',
        type: '缺勤',
        date: '2026-04-03',
        reason: '家中有事'
      },
      {
        id: 4,
        employeeName: '赵六',
        type: '迟到',
        date: '2026-04-03',
        reason: '地铁故障'
      },
      {
        id: 5,
        employeeName: '孙七',
        type: '迟到',
        date: '2026-04-04',
        reason: '闹钟未响'
      },
      {
        id: 6,
        employeeName: '周八',
        type: '早退',
        date: '2026-04-05',
        reason: '家人生病'
      },
      {
        id: 7,
        employeeName: '吴九',
        type: '缺勤',
        date: '2026-04-06',
        reason: '个人原因'
      },
      {
        id: 8,
        employeeName: '郑十',
        type: '迟到',
        date: '2026-04-07',
        reason: '天气恶劣'
      },
      {
        id: 9,
        employeeName: '冯十一',
        type: '迟到',
        date: '2026-04-07',
        reason: '路上堵车'
      },
      {
        id: 10,
        employeeName: '陈十二',
        type: '早退',
        date: '2026-04-07',
        reason: '临时有事'
      }
    ]
  }
}

/**
 * 导出报表 Mock 函数
 */
export function exportReportMock(params: any): boolean {
  console.log('导出报表参数:', params)
  return true
}
