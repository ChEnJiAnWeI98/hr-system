/**
 * 绩效面谈 API（Phase A8）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { PerformanceMeeting } from '@/types/performanceMeeting'
import {
  performanceMeetingMock,
  scheduleMeetingMock,
  submitMeetingNotesMock,
  employeeConfirmMock,
  resolveDisputeMock,
  getMeetingStatsMock
} from '@/mock/performanceMeeting'

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

const performanceMeetingApi = createCrudApi<PerformanceMeeting>({
  baseUrl: '/admin/performance/meeting',
  mockFns: performanceMeetingMock
})

export const getPerformanceMeetingList = performanceMeetingApi.getList
export const getPerformanceMeetingDetail = performanceMeetingApi.getDetail
export const addPerformanceMeeting = performanceMeetingApi.add
export const updatePerformanceMeeting = performanceMeetingApi.update
export const deletePerformanceMeeting = performanceMeetingApi.delete

/** 预约 */
export function scheduleMeeting(id: number, scheduledTime: string) {
  if (USE_MOCK) return mockResolve(() => scheduleMeetingMock(id, scheduledTime), '已预约')
  return request.post({ url: `/admin/performance/meeting/${id}/schedule`, data: { scheduledTime } })
}

/** 提交纪要 */
export function submitMeetingNotes(id: number, notes: Partial<PerformanceMeeting>) {
  if (USE_MOCK) return mockResolve(() => submitMeetingNotesMock(id, notes), '纪要已提交')
  return request.post({ url: `/admin/performance/meeting/${id}/notes`, data: notes })
}

/** 员工确认/异议 */
export function employeeConfirm(id: number, confirmed: boolean, dispute?: string) {
  if (USE_MOCK) return mockResolve(() => employeeConfirmMock(id, confirmed, dispute), confirmed ? '已确认' : '已提交异议')
  return request.post({ url: `/admin/performance/meeting/${id}/confirm`, data: { confirmed, dispute } })
}

/** 异议协商处理 */
export function resolveDispute(id: number, updatedNotes: Partial<PerformanceMeeting>) {
  if (USE_MOCK) return mockResolve(() => resolveDisputeMock(id, updatedNotes), '异议已处理')
  return request.post({ url: `/admin/performance/meeting/${id}/resolve`, data: updatedNotes })
}

/** 统计 */
export function getMeetingStats() {
  if (USE_MOCK) return mockResolve(() => getMeetingStatsMock())
  return request.get({ url: '/admin/performance/meeting/stats' })
}
