/**
 * 绩效档案 API（Phase A9 升级版）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { PerformanceArchive, EmployeeArchiveView } from '@/types/performanceArchive'
import {
  performanceArchiveMock,
  getEmployeeArchiveViewMock,
  getHiPoListMock,
  getAttentionListMock
} from '@/mock/performanceArchive'

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

export const performanceArchiveApi = createCrudApi<PerformanceArchive>({
  baseUrl: '/admin/performance/archive',
  mockFns: performanceArchiveMock
})

export const getPerformanceArchiveList = performanceArchiveApi.getList
export const getPerformanceArchiveDetail = performanceArchiveApi.getDetail
export const addPerformanceArchive = performanceArchiveApi.add
export const updatePerformanceArchive = performanceArchiveApi.update
export const deletePerformanceArchive = performanceArchiveApi.delete
export const batchDeletePerformanceArchives = performanceArchiveApi.batchDelete

/** 获取员工档案聚合视图 */
export function getEmployeeArchiveView(employeeId: number) {
  if (USE_MOCK) return mockResolve<EmployeeArchiveView | null>(() => getEmployeeArchiveViewMock(employeeId))
  return request.get({ url: `/admin/performance/archive/employee/${employeeId}` })
}

/** 高潜员工清单 */
export function getHiPoList() {
  if (USE_MOCK) return mockResolve(() => getHiPoListMock())
  return request.get({ url: '/admin/performance/archive/hipo' })
}

/** 需关注员工清单 */
export function getAttentionList() {
  if (USE_MOCK) return mockResolve(() => getAttentionListMock())
  return request.get({ url: '/admin/performance/archive/attention' })
}
