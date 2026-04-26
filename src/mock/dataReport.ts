import type { DashboardParams, DashboardData } from '@/types/dataReport'

/**
 * 获取驾驶舱数据 Mock 函数
 */
export function getDashboardDataMock(params: DashboardParams): DashboardData {
  const { timeRange } = params

  // 根据时间范围生成不同的趋势数据
  let trendData: any[] = []

  if (timeRange === 'month') {
    // 本月数据（30天）
    trendData = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1
      return {
        date: `2026-04-${day.toString().padStart(2, '0')}`,
        employeeCount: 520 + Math.floor(i * 0.5),
        newEmployees: Math.floor(Math.random() * 3),
        resignedEmployees: Math.floor(Math.random() * 2),
        laborCost: 1500000 + i * 10000
      }
    })
  } else if (timeRange === 'quarter') {
    // 本季度数据（3个月）
    trendData = [
      { date: '2026-01', employeeCount: 500, newEmployees: 15, resignedEmployees: 8, laborCost: 1400000 },
      { date: '2026-02', employeeCount: 507, newEmployees: 18, resignedEmployees: 11, laborCost: 1420000 },
      { date: '2026-03', employeeCount: 514, newEmployees: 20, resignedEmployees: 13, laborCost: 1450000 },
      { date: '2026-04', employeeCount: 521, newEmployees: 22, resignedEmployees: 15, laborCost: 1480000 }
    ]
  } else if (timeRange === 'year') {
    // 本年度数据（12个月）
    trendData = [
      { date: '2025-05', employeeCount: 450, newEmployees: 25, resignedEmployees: 10, laborCost: 1200000 },
      { date: '2025-06', employeeCount: 465, newEmployees: 28, resignedEmployees: 13, laborCost: 1230000 },
      { date: '2025-07', employeeCount: 470, newEmployees: 20, resignedEmployees: 15, laborCost: 1250000 },
      { date: '2025-08', employeeCount: 475, newEmployees: 22, resignedEmployees: 17, laborCost: 1270000 },
      { date: '2025-09', employeeCount: 480, newEmployees: 24, resignedEmployees: 19, laborCost: 1300000 },
      { date: '2025-10', employeeCount: 485, newEmployees: 26, resignedEmployees: 21, laborCost: 1330000 },
      { date: '2025-11', employeeCount: 490, newEmployees: 23, resignedEmployees: 18, laborCost: 1360000 },
      { date: '2025-12', employeeCount: 495, newEmployees: 25, resignedEmployees: 20, laborCost: 1380000 },
      { date: '2026-01', employeeCount: 500, newEmployees: 15, resignedEmployees: 8, laborCost: 1400000 },
      { date: '2026-02', employeeCount: 507, newEmployees: 18, resignedEmployees: 11, laborCost: 1420000 },
      { date: '2026-03', employeeCount: 514, newEmployees: 20, resignedEmployees: 13, laborCost: 1450000 },
      { date: '2026-04', employeeCount: 521, newEmployees: 22, resignedEmployees: 15, laborCost: 1480000 }
    ]
  } else {
    // 自定义时间范围（默认返回本月数据）
    trendData = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1
      return {
        date: `2026-04-${day.toString().padStart(2, '0')}`,
        employeeCount: 520 + Math.floor(i * 0.5),
        newEmployees: Math.floor(Math.random() * 3),
        resignedEmployees: Math.floor(Math.random() * 2),
        laborCost: 1500000 + i * 10000
      }
    })
  }

  // 人员变化趋势
  const employeeTrend = trendData.map(item => ({
    date: item.date,
    employeeCount: item.employeeCount,
    newEmployees: item.newEmployees,
    resignedEmployees: item.resignedEmployees
  }))

  // 人力成本趋势
  const laborCostTrend = trendData.map(item => ({
    date: item.date,
    laborCost: item.laborCost
  }))

  return {
    employeeCount: 521,
    turnoverRate: 2.8,
    recruitmentProgress: 85.5,
    attendanceRate: 96.8,
    laborCost: 1480000,
    newEmployees: 22,
    resignedEmployees: 15,
    avgTenure: 3.5,
    employeeTrend,
    laborCostTrend
  }
}
