/**
 * AI 辅助 API（Phase C3）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  aiAbilityMock,
  aiCallRecordMock,
  mockInvokeAI,
  updateAdoption
} from '@/mock/performanceAI'
import type { AIAbility, AICallRecord, AIAbilityCode } from '@/types/performanceAI'

const abilityCrud = createCrudApi<AIAbility>({
  baseUrl: '/admin/performance/ai-ability',
  mockFns: aiAbilityMock
})
export const getAIAbilityList = abilityCrud.getList

const recordCrud = createCrudApi<AICallRecord>({
  baseUrl: '/admin/performance/ai-call-record',
  mockFns: aiCallRecordMock
})
export const getAICallRecordList = recordCrud.getList

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 调用 AI 能力（Mock）
 */
export function invokeAIAbility(
  code: AIAbilityCode,
  input: string,
  operatorName: string,
  targetEmployee?: string
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = mockInvokeAI(code, input, operatorName, targetEmployee)
        resolve({ code: 200, data, message: 'AI 已生成结果，请确认后采纳' })
      }, 800) // 模拟 AI 调用延迟
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

/**
 * 更新采纳结果
 */
export function updateAIAdoption(
  recordId: number,
  result: 'adopted' | 'modified_adopted' | 'rejected',
  modificationDegree?: number
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = updateAdoption(recordId, result, modificationDegree)
        resolve({ code: 200, data, message: '已更新采纳结果' })
      }, 200)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}
