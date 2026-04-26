import { createCrudApi } from '@/utils/crud/apiHelper'
import { performanceArchiveMock, getTrendMock } from '@/mock/performanceArchive'
import type { PerformanceArchive, PerformanceArchiveListParams } from '@/types/performanceArchive'
import request from '@/utils/http'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 绩效档案 API
 */
export const performanceArchiveApi = createCrudApi<PerformanceArchive>({
  baseUrl: '/admin/performance/archive',
  mockFns: performanceArchiveMock
})

/**
 * 获取绩效档案列表
 */
export const getPerformanceArchiveList = performanceArchiveApi.getList

/**
 * 获取绩效档案详情
 */
export const getPerformanceArchiveDetail = performanceArchiveApi.getDetail

/**
 * 添加绩效档案
 */
export const addPerformanceArchive = performanceArchiveApi.add

/**
 * 更新绩效档案
 */
export const updatePerformanceArchive = performanceArchiveApi.update

/**
 * 删除绩效档案
 */
export const deletePerformanceArchive = performanceArchiveApi.delete

/**
 * 批量删除绩效档案
 */
export const batchDeletePerformanceArchive = performanceArchiveApi.batchDelete

/**
 * 获取绩效趋势
 */
export function getPerformanceTrend(employeeCode: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTrendMock(employeeCode)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<Array<{ period: string; score: number; rating: string }>>({
    url: `/admin/performance/archive/trend/${employeeCode}`
  })
}
