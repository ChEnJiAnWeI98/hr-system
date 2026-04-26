/**
 * 人才盘点 API（Phase C1b）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  talentReviewMock,
  updateTalentEntry,
  calcDistribution
} from '@/mock/performanceTalentReview'
import type { TalentReviewMeeting, TalentReviewEntry } from '@/types/performanceTalentReview'

const crud = createCrudApi<TalentReviewMeeting>({
  baseUrl: '/admin/performance/talent-review',
  mockFns: talentReviewMock
})

export const getTalentMeetingList = crud.getList
export const addTalentMeeting = crud.add
export const updateTalentMeeting = crud.update
export const deleteTalentMeeting = crud.delete
export const getTalentMeetingDetail = crud.getDetail

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 更新盘点条目（拖拽调档）
 */
export function updateTalentReviewEntry(
  meetingId: number,
  employeeId: number,
  updates: Partial<TalentReviewEntry> & { adjustBy?: string; reason?: string }
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const entry = updateTalentEntry(meetingId, employeeId, updates)
          resolve({ code: 200, message: '更新成功', data: entry })
        } catch (e: any) {
          reject({ code: 500, message: e.message })
        }
      }, 200)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

/**
 * 获取盘点分布统计
 */
export function getTalentDistribution(meetingId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: calcDistribution(meetingId) })
      }, 200)
    })
  }
  return Promise.resolve({ code: 200, data: {} })
}
