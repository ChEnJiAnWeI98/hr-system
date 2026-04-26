// @ts-nocheck
import type { PerformanceCalibration, PerformanceCalibrationListParams } from '@/types/performanceCalibration'
import { createCrudMock } from '@/utils/crud/mockHelper'

/**
 * 初始数据
 */
const initialData: PerformanceCalibration[] = [
  {
    id: 1,
    cycleId: 1,
    cycleName: '2025年第一季度',
    departmentId: 1,
    departmentName: '技术部',
    excellentRatio: 20,
    goodRatio: 30,
    qualifiedRatio: 40,
    improveRatio: 10,
    totalEmployees: 50,
    excellentCount: 10,
    goodCount: 15,
    qualifiedCount: 20,
    improveCount: 5,
    status: 1,
    statusName: '已校准',
    calibrationDate: '2025-04-01',
    createTime: '2025-03-25 10:00:00',
    updateTime: '2025-04-01 14:30:00'
  },
  {
    id: 2,
    cycleId: 1,
    cycleName: '2025年第一季度',
    departmentId: 2,
    departmentName: '产品部',
    excellentRatio: 0,
    goodRatio: 0,
    qualifiedRatio: 0,
    improveRatio: 0,
    totalEmployees: 30,
    excellentCount: 0,
    goodCount: 0,
    qualifiedCount: 0,
    improveCount: 0,
    status: 0,
    statusName: '待校准',
    calibrationDate: '',
    createTime: '2025-03-25 10:00:00',
    updateTime: '2025-03-25 10:00:00'
  },
  {
    id: 3,
    cycleId: 2,
    cycleName: '2024年度',
    departmentId: 3,
    departmentName: '市场部',
    excellentRatio: 15,
    goodRatio: 35,
    qualifiedRatio: 40,
    improveRatio: 10,
    totalEmployees: 40,
    excellentCount: 6,
    goodCount: 14,
    qualifiedCount: 16,
    improveCount: 4,
    status: 1,
    statusName: '已校准',
    calibrationDate: '2025-01-15',
    createTime: '2025-01-10 09:00:00',
    updateTime: '2025-01-15 16:20:00'
  },
  {
    id: 4,
    cycleId: 1,
    cycleName: '2025年第一季度',
    departmentId: 4,
    departmentName: '人事部',
    excellentRatio: 0,
    goodRatio: 0,
    qualifiedRatio: 0,
    improveRatio: 0,
    totalEmployees: 15,
    excellentCount: 0,
    goodCount: 0,
    qualifiedCount: 0,
    improveCount: 0,
    status: 0,
    statusName: '待校准',
    calibrationDate: '',
    createTime: '2025-03-25 10:00:00',
    updateTime: '2025-03-25 10:00:00'
  },
  {
    id: 5,
    cycleId: 3,
    cycleName: '2024年第四季度',
    departmentId: 5,
    departmentName: '财务部',
    excellentRatio: 25,
    goodRatio: 30,
    qualifiedRatio: 35,
    improveRatio: 10,
    totalEmployees: 20,
    excellentCount: 5,
    goodCount: 6,
    qualifiedCount: 7,
    improveCount: 2,
    status: 1,
    statusName: '已校准',
    calibrationDate: '2025-01-05',
    createTime: '2024-12-28 10:00:00',
    updateTime: '2025-01-05 11:45:00'
  }
]

/**
 * 创建 CRUD Mock
 */
export const performanceCalibrationMock = createCrudMock<PerformanceCalibration, PerformanceCalibrationListParams>(
  initialData,
  {
    searchFields: ['cycleName', 'departmentName'],
    exactMatchFields: ['status']
  }
)
