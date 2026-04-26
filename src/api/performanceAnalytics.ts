/**
 * 绩效数据分析 API（Phase B3）
 */
import request from '@/utils/http'
import type { AnalyticsQueryParams, AnalyticsDashboard } from '@/types/performanceAnalytics'
import { getDashboardMock } from '@/mock/performanceAnalytics'

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

export function getAnalyticsDashboard(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) return mockResolve<AnalyticsDashboard>(() => getDashboardMock(params))
  return request.get<AnalyticsDashboard>({ url: '/admin/performance/analytics/dashboard', params })
}

export function exportAnalytics(params: AnalyticsQueryParams & { format: 'excel' | 'pdf' }) {
  if (USE_MOCK) {
    return mockResolve(() => ({ url: '', filename: `绩效分析_${params.format}.${params.format}` }), '导出成功')
  }
  return request.post({ url: '/admin/performance/analytics/export', data: params })
}
