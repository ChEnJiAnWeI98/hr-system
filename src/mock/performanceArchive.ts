// @ts-nocheck
import type { PerformanceArchive } from '@/types/performanceArchive'
import { createCrudMock } from '@/utils/crud/mockHelper'

/**
 * 初始绩效档案数据
 */
const initialData: PerformanceArchive[] = [
  {
    id: 1,
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: '张三',
    departmentName: '技术部',
    positionName: '高级工程师',
    cycleId: 1,
    cycleName: '2026年第一季度',
    finalScore: 95,
    rating: '优秀',
    ranking: 1,
    totalInDepartment: 50,
    salaryAdjustment: 15,
    promotion: '晋升为高级工程师',
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeCode: 'EMP002',
    employeeName: '李四',
    departmentName: '产品部',
    positionName: '产品经理',
    cycleId: 1,
    cycleName: '2026年第一季度',
    finalScore: 82,
    rating: '良好',
    ranking: 5,
    totalInDepartment: 30,
    salaryAdjustment: 8,
    promotion: '',
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeCode: 'EMP003',
    employeeName: '王五',
    departmentName: '技术部',
    positionName: '工程师',
    cycleId: 1,
    cycleName: '2026年第一季度',
    finalScore: 75,
    rating: '合格',
    ranking: 25,
    totalInDepartment: 50,
    salaryAdjustment: 3,
    promotion: '',
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeCode: 'EMP004',
    employeeName: '赵六',
    departmentName: '市场部',
    positionName: '市场专员',
    cycleId: 1,
    cycleName: '2026年第一季度',
    finalScore: 62,
    rating: '待改进',
    ranking: 28,
    totalInDepartment: 30,
    salaryAdjustment: 0,
    promotion: '',
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 5,
    employeeId: 5,
    employeeCode: 'EMP005',
    employeeName: '孙七',
    departmentName: '人事部',
    positionName: 'HR专员',
    cycleId: 1,
    cycleName: '2026年第一季度',
    finalScore: 85,
    rating: '良好',
    ranking: 3,
    totalInDepartment: 20,
    salaryAdjustment: 10,
    promotion: '',
    createTime: '2026-04-01 10:00:00'
  }
]

/**
 * 绩效档案 Mock
 */
export const performanceArchiveMock = createCrudMock<PerformanceArchive>(initialData, {
  searchFields: ['employeeName', 'departmentName', 'cycleName'],
  exactMatchFields: ['rating']
})

/**
 * 绩效趋势数据
 */
const trendData: Record<string, Array<{ period: string; score: number; rating: string }>> = {
  'EMP001': [
    { period: '2025-Q2', score: 88, rating: '良好' },
    { period: '2025-Q3', score: 90, rating: '优秀' },
    { period: '2025-Q4', score: 92, rating: '优秀' },
    { period: '2026-Q1', score: 95, rating: '优秀' }
  ],
  'EMP002': [
    { period: '2025-Q2', score: 78, rating: '合格' },
    { period: '2025-Q3', score: 80, rating: '良好' },
    { period: '2025-Q4', score: 81, rating: '良好' },
    { period: '2026-Q1', score: 82, rating: '良好' }
  ],
  'EMP003': [
    { period: '2025-Q2', score: 70, rating: '合格' },
    { period: '2025-Q3', score: 72, rating: '合格' },
    { period: '2025-Q4', score: 74, rating: '合格' },
    { period: '2026-Q1', score: 75, rating: '合格' }
  ],
  'EMP004': [
    { period: '2025-Q2', score: 60, rating: '待改进' },
    { period: '2025-Q3', score: 61, rating: '待改进' },
    { period: '2025-Q4', score: 63, rating: '待改进' },
    { period: '2026-Q1', score: 62, rating: '待改进' }
  ],
  'EMP005': [
    { period: '2025-Q2', score: 82, rating: '良好' },
    { period: '2025-Q3', score: 83, rating: '良好' },
    { period: '2025-Q4', score: 84, rating: '良好' },
    { period: '2026-Q1', score: 85, rating: '良好' }
  ]
}

/**
 * 获取绩效趋势 Mock 函数
 */
export function getTrendMock(employeeCode: string) {
  const trend = trendData[employeeCode]
  if (!trend) {
    return []
  }
  return trend
}
