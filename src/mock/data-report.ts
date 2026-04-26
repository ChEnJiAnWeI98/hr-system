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
    avgTenure: 3.2,
    employeeTrend: [
      { date: '2025-05', count: 1180 },
      { date: '2025-06', count: 1195 },
      { date: '2025-07', count: 1205 },
      { date: '2025-08', count: 1198 },
      { date: '2025-09', count: 1210 },
      { date: '2025-10', count: 1220 },
      { date: '2025-11', count: 1215 },
      { date: '2025-12', count: 1225 },
      { date: '2026-01', count: 1235 },
      { date: '2026-02', count: 1240 },
      { date: '2026-03', count: 1245 },
      { date: '2026-04', count: 1250 }
    ],
    laborCostTrend: [
      { date: '2025-05', cost: 7800000 },
      { date: '2025-06', cost: 8000000 },
      { date: '2025-07', cost: 8100000 },
      { date: '2025-08', cost: 7950000 },
      { date: '2025-09', cost: 8200000 },
      { date: '2025-10', cost: 8300000 },
      { date: '2025-11', cost: 8250000 },
      { date: '2025-12', cost: 8400000 },
      { date: '2026-01', cost: 8450000 },
      { date: '2026-02', cost: 8480000 },
      { date: '2026-03', cost: 8520000 },
      { date: '2026-04', cost: 8500000 }
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
      { date: '2025-05', cost: 7800000 },
      { date: '2025-06', cost: 8000000 },
      { date: '2025-07', cost: 8100000 },
      { date: '2025-08', cost: 7950000 },
      { date: '2025-09', cost: 8200000 },
      { date: '2025-10', cost: 8300000 },
      { date: '2025-11', cost: 8250000 },
      { date: '2025-12', cost: 8400000 },
      { date: '2026-01', cost: 8450000 },
      { date: '2026-02', cost: 8480000 },
      { date: '2026-03', cost: 8520000 },
      { date: '2026-04', cost: 8500000 }
    ]
  }
}

/**
 * 获取招聘漏斗数据 Mock 函数
 */
export function getRecruitmentFunnelMock(params: RecruitmentFunnelParams): RecruitmentFunnelData {
  const compareMode = params?.compareMode || 'chain'

  // 本期
  const current = {
    resumeSubmitted: 850,
    resumeScreened: 460,
    interviewScheduled: 220,
    offerSent: 85,
    onboarded: 48,
    screenRate: 54.1,
    interviewRate: 47.8,
    offerRate: 38.6,
    onboardRate: 56.5
  }

  // 上期（环比=上一周期 / 同比=去年同期）
  const previous =
    compareMode === 'year'
      ? {
          resumeSubmitted: 650,
          resumeScreened: 320,
          interviewScheduled: 160,
          offerSent: 62,
          onboarded: 32,
          screenRate: 49.2,
          interviewRate: 50.0,
          offerRate: 38.8,
          onboardRate: 51.6
        }
      : {
          resumeSubmitted: 780,
          resumeScreened: 410,
          interviewScheduled: 195,
          offerSent: 72,
          onboarded: 38,
          screenRate: 52.6,
          interviewRate: 47.6,
          offerRate: 36.9,
          onboardRate: 52.8
        }

  const calcChange = (cur: number, prev: number): number | null => {
    if (prev === 0) return null
    return Number((((cur - prev) / prev) * 100).toFixed(1))
  }

  const curKpi = {
    onboarded: current.onboarded,
    totalConversion: Number(((current.onboarded / current.resumeSubmitted) * 100).toFixed(1)),
    avgTimeToHire: 32,
    offerAcceptRate: 72.9,
    demandFillRate: 68.5,
    cph: 7850
  }

  const prevKpi =
    compareMode === 'year'
      ? {
          onboarded: previous.onboarded,
          totalConversion: Number(((previous.onboarded / previous.resumeSubmitted) * 100).toFixed(1)),
          avgTimeToHire: 38,
          offerAcceptRate: 68.2,
          demandFillRate: 60.3,
          cph: 9200
        }
      : {
          onboarded: previous.onboarded,
          totalConversion: Number(((previous.onboarded / previous.resumeSubmitted) * 100).toFixed(1)),
          avgTimeToHire: 35,
          offerAcceptRate: 70.4,
          demandFillRate: 65.8,
          cph: 8400
        }

  // 近 6 个月趋势
  const now = new Date()
  const sampleOnboarded = [32, 38, 35, 42, 51, 48]
  const sampleFillRates = [54, 61, 58, 66, 72, 68]
  const monthlyTrend = [] as { month: string; onboardedCount: number; fillRate: number }[]
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    monthlyTrend.push({
      month: `${yyyy}-${mm}`,
      onboardedCount: sampleOnboarded[5 - i],
      fillRate: sampleFillRates[5 - i]
    })
  }

  // TOP5 + 其他
  const channelTop5 = [
    { channel: 'Boss直聘', onboardedCount: 20, percentage: 41.7 },
    { channel: '猎聘', onboardedCount: 14, percentage: 29.2 },
    { channel: '内推', onboardedCount: 12, percentage: 25.0 },
    { channel: '智联招聘', onboardedCount: 8, percentage: 16.7 },
    { channel: 'LinkedIn', onboardedCount: 3, percentage: 6.3 },
    { channel: '其他', onboardedCount: 6, percentage: 12.5 }
  ]

  const periodLabel =
    params?.period === 'month'
      ? '本月'
      : params?.period === 'quarter'
        ? '本季度'
        : params?.period === 'year'
          ? '本年度'
          : params?.startDate && params?.endDate
            ? `${params.startDate} ~ ${params.endDate}`
            : '本月'

  const previousPeriodLabel =
    compareMode === 'year'
      ? '去年同期'
      : params?.period === 'month'
        ? '上月'
        : params?.period === 'quarter'
          ? '上季度'
          : params?.period === 'year'
            ? '去年'
            : '上一周期'

  return {
    periodLabel,
    previousPeriodLabel,
    kpi: {
      onboarded: {
        current: curKpi.onboarded,
        previous: prevKpi.onboarded,
        changeRate: calcChange(curKpi.onboarded, prevKpi.onboarded),
        direction: 'positive'
      },
      totalConversion: {
        current: curKpi.totalConversion,
        previous: prevKpi.totalConversion,
        changeRate: calcChange(curKpi.totalConversion, prevKpi.totalConversion),
        direction: 'positive'
      },
      avgTimeToHire: {
        current: curKpi.avgTimeToHire,
        previous: prevKpi.avgTimeToHire,
        changeRate: calcChange(curKpi.avgTimeToHire, prevKpi.avgTimeToHire),
        direction: 'negative'
      },
      offerAcceptRate: {
        current: curKpi.offerAcceptRate,
        previous: prevKpi.offerAcceptRate,
        changeRate: calcChange(curKpi.offerAcceptRate, prevKpi.offerAcceptRate),
        direction: 'positive'
      },
      demandFillRate: {
        current: curKpi.demandFillRate,
        previous: prevKpi.demandFillRate,
        changeRate: calcChange(curKpi.demandFillRate, prevKpi.demandFillRate),
        direction: 'positive'
      },
      cph: {
        current: curKpi.cph,
        previous: prevKpi.cph,
        changeRate: calcChange(curKpi.cph, prevKpi.cph),
        direction: 'negative'
      }
    },
    funnelCurrent: current,
    funnelPrevious: previous,
    monthlyTrend,
    channelTop5
  }
}

/**
 * 获取考勤报表数据 Mock 函数
 */
export function getAttendanceReportMock(params: AttendanceReportParams): any {
  const anomalyList = [
    {
      id: 1,
      employeeName: '张三',
      exceptionType: '迟到',
      exceptionDate: '2026-04-01',
      exceptionRemark: '早上地铁1号线信号故障，导致列车延误约20分钟，到公司时已经9:15了，抱歉给团队带来不便'
    },
    {
      id: 2,
      employeeName: '李四',
      exceptionType: '早退',
      exceptionDate: '2026-04-02',
      exceptionRemark: '下午突然感觉身体不适，头晕恶心，向主管请假后提前离开去医院检查，已提交病假单'
    },
    {
      id: 3,
      employeeName: '王五',
      exceptionType: '缺勤',
      exceptionDate: '2026-04-03',
      exceptionRemark: '家中老人突发疾病需要紧急送医，当天无法到岗，已电话告知部门领导并补办请假手续'
    },
    {
      id: 4,
      employeeName: '赵六',
      exceptionType: '迟到',
      exceptionDate: '2026-04-03',
      exceptionRemark: '早高峰时段地铁2号线发生设备故障，站台人员拥挤无法上车，换乘其他线路后迟到约15分钟'
    },
    {
      id: 5,
      employeeName: '孙七',
      exceptionType: '迟到',
      exceptionDate: '2026-04-04',
      exceptionRemark: '昨晚加班到凌晨2点完成项目紧急需求，早上闹钟没听到，醒来已经8:50，立即赶往公司'
    },
    {
      id: 6,
      employeeName: '周八',
      exceptionType: '早退',
      exceptionDate: '2026-04-05',
      exceptionRemark: '接到家人电话，母亲在家突然晕倒，需要立即赶回家处理，已向直属领导汇报并获得批准'
    },
    {
      id: 7,
      employeeName: '吴九',
      exceptionType: '缺勤',
      exceptionDate: '2026-04-06',
      exceptionRemark: '因个人重要事务需要处理，提前一天已向部门申请事假，但系统审批流程未完成，特此说明'
    },
    {
      id: 8,
      employeeName: '郑十',
      exceptionType: '迟到',
      exceptionDate: '2026-04-07',
      exceptionRemark: '当天北京遭遇暴雨天气，多条道路积水严重，公交车改道行驶，原本40分钟的路程花了1个半小时'
    },
    {
      id: 9,
      employeeName: '冯十一',
      exceptionType: '迟到',
      exceptionDate: '2026-04-07',
      exceptionRemark: '早上出门时发现车辆无法启动，临时改乘网约车，但早高峰时段路上严重拥堵，迟到约25分钟'
    },
    {
      id: 10,
      employeeName: '陈十二',
      exceptionType: '早退',
      exceptionDate: '2026-04-07',
      exceptionRemark: '下午接到孩子学校老师电话，孩子在学校突发高烧需要家长接回，已向主管说明情况并获准提前离开'
    }
  ]

  return {
    statistics: {
      shouldAttendDays: 22,
      actualAttendDays: 21.3,
      lateCount: 45,
      earlyLeaveCount: 12,
      absentCount: 8,
      overtimeHours: 320,
      attendanceRate: 96.8
    },
    exceptionList: anomalyList,
    total: anomalyList.length,
    chartData: {
      categories: ['第1周', '第2周', '第3周', '第4周'],
      shouldAttend: [5, 5, 5, 5],
      actualAttend: [4.8, 4.9, 5, 4.9],
      late: [2, 3, 1, 2],
      earlyLeave: [1, 0, 1, 1],
      absent: [0, 1, 0, 1],
      overtime: [8, 10, 12, 9]
    }
  }
}

/**
 * 导出报表 Mock 函数
 */
export function exportReportMock(params: any): boolean {
  console.log('导出报表参数:', params)
  return true
}
