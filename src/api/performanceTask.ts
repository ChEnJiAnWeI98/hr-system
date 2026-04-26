/**
 * 绩效任务中心 API（Phase B4）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { PerformanceTask } from '@/types/performanceTask'
import {
  performanceTaskMock,
  completeTaskMock,
  applyDelayMock,
  getTaskStatsMock
} from '@/mock/performanceTask'

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

export const taskApi = createCrudApi<PerformanceTask>({
  baseUrl: '/admin/performance/task',
  mockFns: performanceTaskMock
})

export const getTaskList = taskApi.getList
export const addTask = taskApi.add
export const updateTask = taskApi.update
export const deleteTask = taskApi.delete

export function completeTask(id: number) {
  if (USE_MOCK) return mockResolve(() => completeTaskMock(id), '任务已完成')
  return request.post({ url: `/admin/performance/task/${id}/complete` })
}

export function applyDelay(id: number, newDueTime: string, reason: string) {
  if (USE_MOCK) return mockResolve(() => applyDelayMock(id, newDueTime, reason), '延期已申请')
  return request.post({ url: `/admin/performance/task/${id}/delay`, data: { newDueTime, reason } })
}

export function getTaskStats() {
  if (USE_MOCK) return mockResolve(() => getTaskStatsMock())
  return request.get({ url: '/admin/performance/task/stats' })
}
