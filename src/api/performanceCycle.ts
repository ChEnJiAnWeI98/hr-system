/**
 * 绩效周期 API
 */

import { createCrudApi } from '@/utils/crud'
import { performanceCycleMock } from '@/mock/performanceCycle'
import type { PerformanceCycle } from '@/types/performance'

/**
 * 创建 CRUD API 函数
 */
const performanceCycleApi = createCrudApi<PerformanceCycle>({
  baseUrl: '/admin/performance/cycle',
  mockFns: performanceCycleMock
})

// 导出所有方法
export const getList = performanceCycleApi.getList
export const addItem = performanceCycleApi.add
export const updateItem = performanceCycleApi.update
export const deleteItem = performanceCycleApi.delete
export const batchDeleteItems = performanceCycleApi.batchDelete
export const getDetail = performanceCycleApi.getDetail
