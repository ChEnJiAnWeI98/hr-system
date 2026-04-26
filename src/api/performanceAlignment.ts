/**
 * 目标对齐视图 API（Phase A4）
 */
import request from '@/utils/http'
import type { AlignmentQueryParams, AlignmentStats, OKRTreeNode } from '@/types/performanceAlignment'
import {
  buildOKRTreeMock,
  getAlignmentStatsMock,
  createAlignmentMock,
  removeAlignmentMock
} from '@/mock/performanceAlignment'

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

/** 获取 OKR 对齐树 */
export function getOKRTree(params: AlignmentQueryParams = {}) {
  if (USE_MOCK) return mockResolve<OKRTreeNode[]>(() => buildOKRTreeMock(params))
  return request.get<OKRTreeNode[]>({ url: '/admin/performance/alignment/tree', params })
}

/** 获取对齐统计 */
export function getAlignmentStats(params: AlignmentQueryParams = {}) {
  if (USE_MOCK) return mockResolve<AlignmentStats>(() => getAlignmentStatsMock(params))
  return request.get<AlignmentStats>({ url: '/admin/performance/alignment/stats', params })
}

/** 建立对齐关系 */
export function createAlignment(childId: number, parentId: number) {
  if (USE_MOCK) return mockResolve(() => createAlignmentMock(childId, parentId), '已建立对齐关系')
  return request.post({ url: '/admin/performance/alignment', data: { childId, parentId } })
}

/** 取消对齐关系 */
export function removeAlignment(childId: number) {
  if (USE_MOCK) return mockResolve(() => removeAlignmentMock(childId), '已取消对齐')
  return request.del({ url: `/admin/performance/alignment/${childId}` })
}
