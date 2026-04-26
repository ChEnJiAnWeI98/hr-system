/**
 * 绩效改进计划 PIP API（Phase B2）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  PerformancePIP,
  PIPWeeklyTrack,
  PIPMonthlyReview
} from '@/types/performancePIP'
import {
  pipMock,
  pipWeeklyMock,
  pipMonthlyMock,
  signPIPMock,
  submitWeeklyTrackMock,
  submitMonthlyReviewMock,
  finalizePIPMock,
  getPIPStatsMock
} from '@/mock/performancePIP'

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

export const pipApi = createCrudApi<PerformancePIP>({
  baseUrl: '/admin/performance/pip',
  mockFns: pipMock
})
export const getPIPList = pipApi.getList
export const addPIP = pipApi.add
export const updatePIP = pipApi.update
export const deletePIP = pipApi.delete
export const getPIPDetail = pipApi.getDetail

export const pipWeeklyApi = createCrudApi<PIPWeeklyTrack>({
  baseUrl: '/admin/performance/pip/weekly',
  mockFns: pipWeeklyMock
})
export const getPIPWeeklyList = pipWeeklyApi.getList

export const pipMonthlyApi = createCrudApi<PIPMonthlyReview>({
  baseUrl: '/admin/performance/pip/monthly',
  mockFns: pipMonthlyMock
})
export const getPIPMonthlyList = pipMonthlyApi.getList

export function signPIP(id: number, signed: boolean, refuseReason?: string) {
  if (USE_MOCK) return mockResolve(() => signPIPMock(id, signed, refuseReason), signed ? '已签署' : '已拒签')
  return request.post({ url: `/admin/performance/pip/${id}/sign`, data: { signed, refuseReason } })
}

export function submitWeeklyTrack(pipId: number, data: any) {
  if (USE_MOCK) return mockResolve(() => submitWeeklyTrackMock(pipId, data), '已提交')
  return request.post({ url: `/admin/performance/pip/${pipId}/weekly`, data })
}

export function submitMonthlyReview(
  pipId: number,
  month: number,
  result: 'above_expected' | 'meet_expected' | 'below_expected',
  comment: string,
  hrComment?: string
) {
  if (USE_MOCK) return mockResolve(() => submitMonthlyReviewMock(pipId, month, result, comment, hrComment), '已评估')
  return request.post({ url: `/admin/performance/pip/${pipId}/monthly`, data: { month, result, comment, hrComment } })
}

export function finalizePIP(id: number, result: 'passed' | 'extended' | 'failed', reason: string) {
  if (USE_MOCK) return mockResolve(() => finalizePIPMock(id, result, reason), '结果已判定')
  return request.post({ url: `/admin/performance/pip/${id}/finalize`, data: { result, reason } })
}

export function getPIPStats() {
  if (USE_MOCK) return mockResolve(() => getPIPStatsMock())
  return request.get({ url: '/admin/performance/pip/stats' })
}
