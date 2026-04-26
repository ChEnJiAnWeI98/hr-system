/**
 * AI 智能匹配 API (Phase 5.1)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { AIMatchResult, MatchingRule, AIMatchStats } from '@/types/aiMatching'
import {
  aiMatchResultCrudMock,
  matchingRuleCrudMock,
  batchMatchMock,
  recommendJobsMock,
  getMatchStatsMock
} from '@/mock/aiMatching'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(fn: () => T, message = 'success', delay = 800): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data: fn() })
      } catch (error: any) {
        reject({ code: 500, message: error.message })
      }
    }, delay)
  })
}

/** 匹配历史 CRUD */
export const aiMatchResultApi = createCrudApi<AIMatchResult>({
  baseUrl: '/admin/ai-matching/result',
  mockFns: aiMatchResultCrudMock
})

/** 匹配规则 CRUD */
export const matchingRuleApi = createCrudApi<MatchingRule>({
  baseUrl: '/admin/ai-matching/rule',
  mockFns: matchingRuleCrudMock
})

/**
 * 批量匹配：一个职位 × 多份简历
 */
export function batchMatch(data: {
  jobId: number
  jobTitle: string
  department: string
  resumes: Array<{ id: number; candidateName: string }>
  ruleId?: number
}) {
  if (USE_MOCK) {
    return mockResolve(
      () => batchMatchMock(data.jobId, data.jobTitle, data.department, data.resumes, data.ruleId),
      `匹配完成：共评估 ${data.resumes.length} 份简历`,
      1200
    )
  }
  return request.post({ url: '/admin/ai-matching/batch-match', data })
}

/**
 * 职位推荐：一份简历 × 多个职位
 */
export function recommendJobs(data: {
  resumeId: number
  candidateName: string
  jobs: Array<{ id: number; title: string; department: string }>
  ruleId?: number
}) {
  if (USE_MOCK) {
    return mockResolve(
      () => recommendJobsMock(data.resumeId, data.candidateName, data.jobs, data.ruleId),
      `推荐完成：共评估 ${data.jobs.length} 个职位`,
      1200
    )
  }
  return request.post({ url: '/admin/ai-matching/recommend-jobs', data })
}

/** 统计 */
export function getMatchStats() {
  if (USE_MOCK) {
    return mockResolve<AIMatchStats>(() => getMatchStatsMock(), 'success', 200)
  }
  return request.get<AIMatchStats>({ url: '/admin/ai-matching/stats' })
}
