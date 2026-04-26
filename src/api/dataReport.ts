import request from '@/utils/http'
import type { DashboardParams, DashboardData, ExportReportParams } from '@/types/dataReport'
import { getDashboardDataMock } from '@/mock/dataReport'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取驾驶舱数据
 */
export function getDashboardData(params: DashboardParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getDashboardDataMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<DashboardData>({
    url: '/admin/data-report/dashboard',
    params
  })
}

/**
 * 导出报表
 */
export function exportReport(params: ExportReportParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功',
          data: {
            url: '/mock/export/dashboard-report.xlsx'
          }
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/data-report/export',
    data: params
  })
}
