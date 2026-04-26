/**
 * 绩效评估 API（Phase A5 升级版）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { PerformanceEvaluation } from '@/types/performanceEvaluation'
import type { NodeScoreDetail } from '@/types/performanceEvaluation'
import {
  performanceEvaluationMock,
  saveEvalDraftMock,
  submitEvalNodeMock,
  escalateEvalMock,
  reassignScorerMock,
  getEvalStatsMock
} from '@/mock/performanceEvaluation'

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

const performanceEvaluationApi = createCrudApi<PerformanceEvaluation>({
  baseUrl: '/admin/performance/evaluation',
  mockFns: performanceEvaluationMock
})

export const getPerformanceEvaluationList = performanceEvaluationApi.getList
export const getPerformanceEvaluationDetail = performanceEvaluationApi.getDetail
export const addPerformanceEvaluation = performanceEvaluationApi.add
export const updatePerformanceEvaluation = performanceEvaluationApi.update
export const deletePerformanceEvaluation = performanceEvaluationApi.delete
export const batchDeletePerformanceEvaluation = performanceEvaluationApi.batchDelete

/** 保存草稿 */
export function saveEvalDraft(evalId: number, nodeOrder: number, dimensionScores: NodeScoreDetail[], comment?: string) {
  if (USE_MOCK) return mockResolve(() => saveEvalDraftMock(evalId, nodeOrder, dimensionScores, comment), '草稿已保存')
  return request.post({
    url: `/admin/performance/evaluation/${evalId}/draft`,
    data: { nodeOrder, dimensionScores, comment }
  })
}

/** 提交节点 */
export function submitEvalNode(evalId: number, nodeOrder: number, dimensionScores: NodeScoreDetail[], comment?: string) {
  if (USE_MOCK) return mockResolve(() => submitEvalNodeMock(evalId, nodeOrder, dimensionScores, comment), '已提交')
  return request.post({
    url: `/admin/performance/evaluation/${evalId}/submit-node`,
    data: { nodeOrder, dimensionScores, comment }
  })
}

/** 超期升级到 HRBP */
export function escalateEval(evalId: number) {
  if (USE_MOCK) return mockResolve(() => escalateEvalMock(evalId), '已升级至 HRBP')
  return request.post({ url: `/admin/performance/evaluation/${evalId}/escalate` })
}

/** 重新指派评分人 */
export function reassignScorer(evalId: number, nodeOrder: number, scorerId: number, scorerName: string) {
  if (USE_MOCK) {
    return mockResolve(() => reassignScorerMock(evalId, nodeOrder, scorerId, scorerName), '已重新指派')
  }
  return request.post({
    url: `/admin/performance/evaluation/${evalId}/reassign`,
    data: { nodeOrder, scorerId, scorerName }
  })
}

/** 统计 */
export function getEvalStats() {
  if (USE_MOCK) return mockResolve(() => getEvalStatsMock())
  return request.get({ url: '/admin/performance/evaluation/stats' })
}
