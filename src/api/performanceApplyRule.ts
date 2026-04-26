/**
 * 绩效结果应用联动 API（Phase B5）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  PerformanceApplyRule,
  RuleExecutionRecord
} from '@/types/performanceApplyRule'
import {
  applyRuleMock,
  ruleRecordMock,
  confirmRecordMock,
  toggleRuleStatusMock,
  getApplyStatsMock
} from '@/mock/performanceApplyRule'

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

export const applyRuleApi = createCrudApi<PerformanceApplyRule>({
  baseUrl: '/admin/performance/apply-rule',
  mockFns: applyRuleMock
})

export const getApplyRuleList = applyRuleApi.getList
export const addApplyRule = applyRuleApi.add
export const updateApplyRule = applyRuleApi.update
export const deleteApplyRule = applyRuleApi.delete

export const ruleRecordApi = createCrudApi<RuleExecutionRecord>({
  baseUrl: '/admin/performance/apply-rule/record',
  mockFns: ruleRecordMock
})

export const getRuleRecords = ruleRecordApi.getList

export function confirmRecord(id: number, approved: boolean, confirmedBy = '张HR') {
  if (USE_MOCK) return mockResolve(() => confirmRecordMock(id, approved, confirmedBy), approved ? '已确认' : '已拒绝')
  return request.post({ url: `/admin/performance/apply-rule/record/${id}/confirm`, data: { approved, confirmedBy } })
}

export function toggleRuleStatus(id: number, status: string) {
  if (USE_MOCK) return mockResolve(() => toggleRuleStatusMock(id, status), '状态已更新')
  return request.put({ url: `/admin/performance/apply-rule/${id}/status`, data: { status } })
}

export function getApplyStats() {
  if (USE_MOCK) return mockResolve(() => getApplyStatsMock())
  return request.get({ url: '/admin/performance/apply-rule/stats' })
}
