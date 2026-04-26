/**
 * 1on1 / 持续反馈 API（Phase B1）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  OneOnOne,
  FeedbackRecord,
  BadgeType,
  Recognition
} from '@/types/performanceOneOnOne'
import {
  oneOnOneMock,
  feedbackMock,
  badgeTypeMock,
  recognitionMock,
  scheduleOneOnOneMock,
  completeOneOnOneMock,
  getBadgeWallMock,
  getBadgeLeaderboardMock,
  getOneOnOneStatsMock
} from '@/mock/performanceOneOnOne'

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

export const oneOnOneApi = createCrudApi<OneOnOne>({
  baseUrl: '/admin/performance/one-on-one',
  mockFns: oneOnOneMock
})
export const getOneOnOneList = oneOnOneApi.getList
export const addOneOnOne = oneOnOneApi.add
export const updateOneOnOne = oneOnOneApi.update
export const deleteOneOnOne = oneOnOneApi.delete

export const feedbackApi = createCrudApi<FeedbackRecord>({
  baseUrl: '/admin/performance/feedback',
  mockFns: feedbackMock
})
export const getFeedbackList = feedbackApi.getList
export const addFeedback = feedbackApi.add
export const deleteFeedback = feedbackApi.delete

export const badgeTypeApi = createCrudApi<BadgeType>({
  baseUrl: '/admin/performance/badge-type',
  mockFns: badgeTypeMock
})
export const getBadgeTypes = badgeTypeApi.getList

export const recognitionApi = createCrudApi<Recognition>({
  baseUrl: '/admin/performance/recognition',
  mockFns: recognitionMock
})
export const getRecognitions = recognitionApi.getList
export const addRecognition = recognitionApi.add

export function scheduleOneOnOne(id: number, plannedTime: string) {
  if (USE_MOCK) return mockResolve(() => scheduleOneOnOneMock(id, plannedTime), '已预约')
  return request.post({ url: `/admin/performance/one-on-one/${id}/schedule`, data: { plannedTime } })
}

export function completeOneOnOne(id: number, data: Partial<OneOnOne>) {
  if (USE_MOCK) return mockResolve(() => completeOneOnOneMock(id, data), '已完成')
  return request.post({ url: `/admin/performance/one-on-one/${id}/complete`, data })
}

export function getBadgeWall(employeeId: number) {
  if (USE_MOCK) return mockResolve(() => getBadgeWallMock(employeeId))
  return request.get({ url: `/admin/performance/recognition/wall/${employeeId}` })
}

export function getBadgeLeaderboard() {
  if (USE_MOCK) return mockResolve(() => getBadgeLeaderboardMock())
  return request.get({ url: '/admin/performance/recognition/leaderboard' })
}

export function getOneOnOneStats() {
  if (USE_MOCK) return mockResolve(() => getOneOnOneStatsMock())
  return request.get({ url: '/admin/performance/one-on-one/stats' })
}
