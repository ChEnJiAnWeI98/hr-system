/**
 * 绩效周期 API（Phase A1 升级版）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import {
  performanceCycleMock,
  advanceCycleStatusMock,
  cloneCycleMock,
  unarchiveCycleMock
} from '@/mock/performanceCycle'
import type { PerformanceCycle } from '@/types/performance'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data: fn() })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, 300)
  })
}

/**
 * CRUD API
 */
const performanceCycleApi = createCrudApi<PerformanceCycle>({
  baseUrl: '/admin/performance/cycle',
  mockFns: performanceCycleMock
})

export const getList = performanceCycleApi.getList
export const addItem = performanceCycleApi.add
export const updateItem = performanceCycleApi.update
export const deleteItem = performanceCycleApi.delete
export const batchDeleteItems = performanceCycleApi.batchDelete
export const getDetail = performanceCycleApi.getDetail

/**
 * 推进周期状态（下一阶段）
 */
export function advanceCycleStatus(id: number) {
  if (USE_MOCK) return mockResolve(() => advanceCycleStatusMock(id), '已推进到下一阶段')
  return request.post({ url: `/admin/performance/cycle/${id}/advance` })
}

/**
 * 复用周期（基于现有周期快速创建）
 */
export function cloneCycle(sourceId: number, overrides: Partial<PerformanceCycle>) {
  if (USE_MOCK) return mockResolve(() => cloneCycleMock(sourceId, overrides), '周期已复用')
  return request.post({ url: `/admin/performance/cycle/${sourceId}/clone`, data: overrides })
}

/**
 * 归档解锁（仅 HRD 可操作）
 */
export function unarchiveCycle(id: number) {
  if (USE_MOCK) return mockResolve(() => unarchiveCycleMock(id), '周期已解锁')
  return request.post({ url: `/admin/performance/cycle/${id}/unarchive` })
}
