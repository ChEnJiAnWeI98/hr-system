/**
 * 招聘预算管理 API (Phase 5.10)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  RecruitmentBudget,
  BudgetAlert,
  BudgetExpense,
  BudgetOverview
} from '@/types/recruitmentBudget'
import {
  budgetCrudMock,
  budgetAlertCrudMock,
  budgetExpenseCrudMock,
  getBudgetOverviewMock,
  acknowledgeAlertMock
} from '@/mock/recruitmentBudget'

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

/** 预算 CRUD */
export const budgetApi = createCrudApi<RecruitmentBudget>({
  baseUrl: '/admin/recruitment-budget/item',
  mockFns: budgetCrudMock
})

/** 告警历史 CRUD */
export const budgetAlertApi = createCrudApi<BudgetAlert>({
  baseUrl: '/admin/recruitment-budget/alert',
  mockFns: budgetAlertCrudMock
})

/** 消耗明细 CRUD */
export const budgetExpenseApi = createCrudApi<BudgetExpense>({
  baseUrl: '/admin/recruitment-budget/expense',
  mockFns: budgetExpenseCrudMock
})

/** 总览 */
export function getBudgetOverview(year = 2026) {
  if (USE_MOCK) return mockResolve<BudgetOverview>(() => getBudgetOverviewMock(year))
  return request.get<BudgetOverview>({ url: '/admin/recruitment-budget/overview', params: { year } })
}

/** 确认告警 */
export function acknowledgeAlert(id: number, byName: string) {
  if (USE_MOCK) return mockResolve(() => acknowledgeAlertMock(id, byName), '已确认')
  return request.post({ url: '/admin/recruitment-budget/alert/acknowledge', data: { id, byName } })
}
