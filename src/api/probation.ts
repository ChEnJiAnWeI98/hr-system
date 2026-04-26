import request from '@/utils/http'
import type {
  Probation,
  ProbationListParams,
  ProbationForm,
  RegularizationForm
} from '@/types/probation'
import {
  getProbationListMock,
  getProbationDetailMock,
  updateProbationMock,
  evaluateProbationMock,
  extendProbationMock
} from '@/mock/probation'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockPromise = <T>(fn: () => T, msg = 'success', delay = 300) =>
  new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message: msg, data: fn() })
      } catch (e: any) {
        reject({ code: 400, message: e.message })
      }
    }, delay)
  })

/** 获取试用期列表 */
export function getProbationList(params: ProbationListParams) {
  if (USE_MOCK) return mockPromise(() => getProbationListMock(params))
  return request.get({ url: '/admin/probation/list', params })
}

/** 获取试用期详情 */
export function getProbationDetail(id: number) {
  if (USE_MOCK) return mockPromise(() => getProbationDetailMock(id))
  return request.get<Probation>({ url: `/admin/probation/${id}` })
}

/** 更新试用期记录（trial/extended 允许） */
export function updateProbation(data: ProbationForm) {
  if (USE_MOCK) return mockPromise(() => updateProbationMock(data.id!, data as any), '更新成功')
  return request.put({ url: '/admin/probation/update', data })
}

/** 转正评估 */
export function evaluateProbation(data: RegularizationForm) {
  if (USE_MOCK) {
    return mockPromise(
      () =>
        evaluateProbationMock(data.id, {
          evaluationScore: data.evaluationScore,
          evaluationComment: data.evaluationComment,
          result: data.result,
          extensionMonths: data.extensionMonths,
          extensionReason: data.extensionReason,
          failureReason: data.failureReason
        }),
      '评估成功'
    )
  }
  return request.post({ url: '/admin/probation/evaluate', data })
}

/** 延长试用期 */
export function extendProbation(id: number, months: number, reason: string) {
  if (USE_MOCK) return mockPromise(() => extendProbationMock(id, months, reason), '延长成功')
  return request.post({ url: '/admin/probation/extend', data: { id, months, reason } })
}
