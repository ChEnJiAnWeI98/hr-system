/**
 * 自动化规则引擎 API (Phase 5.8)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { AutomationRule, AutomationLog, RuleTemplate, AutomationStats } from '@/types/automation'
import {
  automationRuleCrudMock,
  automationLogCrudMock,
  getRuleTemplatesMock,
  getAutomationStatsMock,
  manualTriggerRuleMock
} from '@/mock/automation'

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

/** 规则 CRUD */
export const automationRuleApi = createCrudApi<AutomationRule>({
  baseUrl: '/admin/automation/rule',
  mockFns: automationRuleCrudMock
})

/** 触发日志 CRUD（一般只查询）*/
export const automationLogApi = createCrudApi<AutomationLog>({
  baseUrl: '/admin/automation/log',
  mockFns: automationLogCrudMock
})

/** 获取内置模板 */
export function getRuleTemplates() {
  if (USE_MOCK) return mockResolve<RuleTemplate[]>(() => getRuleTemplatesMock())
  return request.get<RuleTemplate[]>({ url: '/admin/automation/templates' })
}

/** 获取统计 */
export function getAutomationStats() {
  if (USE_MOCK) return mockResolve<AutomationStats>(() => getAutomationStatsMock())
  return request.get<AutomationStats>({ url: '/admin/automation/stats' })
}

/** 手动触发规则（演示用）*/
export function manualTriggerRule(ruleId: number) {
  if (USE_MOCK) return mockResolve(() => manualTriggerRuleMock(ruleId), '规则已手动触发')
  return request.post({ url: `/admin/automation/rule/${ruleId}/trigger` })
}
