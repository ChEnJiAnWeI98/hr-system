/**
 * 绩效周期 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { PerformanceCycle } from '@/types/performance'

// 初始数据
const mockPerformanceCycles: PerformanceCycle[] = [
  {
    id: 1,
    cycleName: '2024年度绩效考核',
    cycleType: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 3,
    participantCount: 150,
    remark: '2024年度绩效考核周期',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    cycleName: '2025年上半年绩效考核',
    cycleType: 2,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    status: 3,
    participantCount: 160,
    remark: '2025年上半年绩效考核周期',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00'
  },
  {
    id: 3,
    cycleName: '2025年下半年绩效考核',
    cycleType: 2,
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    status: 3,
    participantCount: 165,
    remark: '2025年下半年绩效考核周期',
    createTime: '2025-07-01 10:00:00',
    updateTime: '2025-07-01 10:00:00'
  },
  {
    id: 4,
    cycleName: '2025年第四季度绩效考核',
    cycleType: 3,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    status: 3,
    participantCount: 165,
    remark: '2025年第四季度绩效考核周期',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 5,
    cycleName: '2026年第一季度绩效考核',
    cycleType: 3,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 2,
    participantCount: 170,
    remark: '2026年第一季度绩效考核周期',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 6,
    cycleName: '2026年第二季度绩效考核',
    cycleType: 3,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 1,
    participantCount: 175,
    remark: '2026年第二季度绩效考核周期',
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-01-15 10:00:00'
  },
  {
    id: 7,
    cycleName: '2026年上半年绩效考核',
    cycleType: 2,
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    status: 2,
    participantCount: 175,
    remark: '2026年上半年绩效考核周期',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 8,
    cycleName: '2026年度绩效考核',
    cycleType: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 2,
    participantCount: 180,
    remark: '2026年度绩效考核周期',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 9,
    cycleName: '2026年第三季度绩效考核',
    cycleType: 3,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 1,
    participantCount: 180,
    remark: '2026年第三季度绩效考核周期',
    createTime: '2026-06-15 10:00:00',
    updateTime: '2026-06-15 10:00:00'
  },
  {
    id: 10,
    cycleName: '2027年度绩效考核',
    cycleType: 1,
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    status: 1,
    participantCount: 200,
    remark: '2027年度绩效考核周期',
    createTime: '2026-12-01 10:00:00',
    updateTime: '2026-12-01 10:00:00'
  }
]

/**
 * 创建 CRUD Mock 函数
 */
export const performanceCycleMock = createCrudMock<PerformanceCycle>(mockPerformanceCycles, {
  searchFields: ['cycleName', 'remark'],
  sortField: 'createTime'
})
