/**
 * 组织架构图 API
 */
import request from '@/utils/http'
import type { OrgChartTreeResponse } from '@/types/org-chart'
import { getOrgChartTreeMock } from '@/mock/org-chart'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取组织架构树
 */
export function getOrgChartTree() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getOrgChartTreeMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<OrgChartTreeResponse>({
    url: '/admin/org-chart/tree'
  })
}
