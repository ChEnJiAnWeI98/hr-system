/**
 * NPS 候选人满意度 API (Phase 5.9)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { NPSTemplate, NPSSurvey, NPSStats, NPSImprovement } from '@/types/nps'
import {
  npsTemplateCrudMock,
  npsSurveyCrudMock,
  getNPSStatsMock,
  getImprovementsMock,
  submitSurveyMock
} from '@/mock/nps'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data: fn() })
      } catch (error: any) {
        reject({ code: 500, message: error.message })
      }
    }, 300)
  })
}

/** 调研模板 CRUD */
export const npsTemplateApi = createCrudApi<NPSTemplate>({
  baseUrl: '/admin/nps/template',
  mockFns: npsTemplateCrudMock
})

/** 调研回复 CRUD */
export const npsSurveyApi = createCrudApi<NPSSurvey>({
  baseUrl: '/admin/nps/survey',
  mockFns: npsSurveyCrudMock
})

/** 统计 */
export function getNPSStats() {
  if (USE_MOCK) return mockResolve<NPSStats>(() => getNPSStatsMock())
  return request.get<NPSStats>({ url: '/admin/nps/stats' })
}

/** 改进建议聚类 */
export function getImprovements() {
  if (USE_MOCK) return mockResolve<NPSImprovement[]>(() => getImprovementsMock())
  return request.get<NPSImprovement[]>({ url: '/admin/nps/improvements' })
}

/** 候选人提交调研（Demo） */
export function submitSurvey(data: Partial<NPSSurvey>) {
  if (USE_MOCK) return mockResolve(() => submitSurveyMock(data), '调研已提交')
  return request.post({ url: '/admin/nps/survey/submit', data })
}
