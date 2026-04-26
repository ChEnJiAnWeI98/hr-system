/**
 * 360 度评估 API（Phase A6）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  ReviewerRelation,
  ReviewFeedback,
  ReviewAggregatedResult
} from '@/types/performance360'
import {
  reviewerRelationMock,
  reviewFeedbackMock,
  nominateReviewersMock,
  approveReviewerMock,
  declineReviewerMock,
  submitFeedbackMock,
  getAggregatedResultMock
} from '@/mock/performance360'

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

/** 关系 CRUD */
export const reviewerRelationApi = createCrudApi<ReviewerRelation>({
  baseUrl: '/admin/performance/360/relation',
  mockFns: reviewerRelationMock
})

export const getReviewerRelations = reviewerRelationApi.getList

/** 反馈 CRUD */
export const reviewFeedbackApi = createCrudApi<ReviewFeedback>({
  baseUrl: '/admin/performance/360/feedback',
  mockFns: reviewFeedbackMock
})

export const getReviewFeedbacks = reviewFeedbackApi.getList

/** 员工提名评估人 */
export function nominateReviewers(
  evaluationId: number,
  subjectId: number,
  subjectName: string,
  reviewers: Array<Partial<ReviewerRelation>>,
  source: 'self' | 'superior' | 'hr' = 'self'
) {
  if (USE_MOCK) {
    return mockResolve(
      () => nominateReviewersMock(evaluationId, subjectId, subjectName, reviewers, source),
      '评估人已提名'
    )
  }
  return request.post({
    url: '/admin/performance/360/nominate',
    data: { evaluationId, subjectId, subjectName, reviewers, source }
  })
}

/** 核准 / 拒绝评估人 */
export function approveReviewer(id: number, approved: boolean, approverName = '直属上级', reason?: string) {
  if (USE_MOCK) {
    return mockResolve(() => approveReviewerMock(id, approved, approverName, reason), approved ? '已核准' : '已拒绝')
  }
  return request.post({
    url: `/admin/performance/360/relation/${id}/approve`,
    data: { approved, approverName, reason }
  })
}

/** 评估人婉拒 */
export function declineReviewer(id: number, reason: string) {
  if (USE_MOCK) return mockResolve(() => declineReviewerMock(id, reason), '已婉拒')
  return request.post({ url: `/admin/performance/360/relation/${id}/decline`, data: { reason } })
}

/** 提交反馈 */
export function submitReviewFeedback(
  relationId: number,
  data: {
    dimensionScores: Array<{ dimension: string; score: number }>
    strengths?: string
    improvements?: string
  }
) {
  if (USE_MOCK) return mockResolve(() => submitFeedbackMock(relationId, data), '反馈已提交')
  return request.post({ url: `/admin/performance/360/relation/${relationId}/feedback`, data })
}

/** 获取聚合结果 */
export function getAggregatedResult(subjectId: number, evaluationId: number) {
  if (USE_MOCK) return mockResolve<ReviewAggregatedResult | null>(() => getAggregatedResultMock(subjectId, evaluationId))
  return request.get<ReviewAggregatedResult>({
    url: '/admin/performance/360/aggregate',
    params: { subjectId, evaluationId }
  })
}
