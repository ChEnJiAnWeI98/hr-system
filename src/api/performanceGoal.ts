/**
 * 目标管理 API（Phase A3 升级版）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  PerformanceGoal,
  GoalProgressLog,
  GoalTemplate,
  KeyResult
} from '@/types/performanceGoal'
import {
  performanceGoalMock,
  goalProgressLogMock,
  goalTemplateMock,
  approveGoalMock,
  resubmitGoalMock,
  updateGoalProgressMock,
  freezeGoalsByCycleMock,
  createGoalFromTemplateMock
} from '@/mock/performanceGoal'

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

/* ========== 目标 CRUD ========== */
const performanceGoalApi = createCrudApi<PerformanceGoal>({
  baseUrl: '/admin/performance/goal',
  mockFns: performanceGoalMock
})

// 新命名
export const getPerformanceGoalList = performanceGoalApi.getList
export const getPerformanceGoalDetail = performanceGoalApi.getDetail
export const addPerformanceGoal = performanceGoalApi.add
export const updatePerformanceGoal = performanceGoalApi.update
export const deletePerformanceGoal = performanceGoalApi.delete
export const batchDeletePerformanceGoals = performanceGoalApi.batchDelete

// 兼容原命名
export const getList = performanceGoalApi.getList
export const getDetail = performanceGoalApi.getDetail
export const addItem = performanceGoalApi.add
export const updateItem = performanceGoalApi.update
export const deleteItem = performanceGoalApi.delete
export const batchDeleteItems = performanceGoalApi.batchDelete

/* ========== 进度日志 CRUD ========== */
export const goalProgressLogApi = createCrudApi<GoalProgressLog>({
  baseUrl: '/admin/performance/goal-progress',
  mockFns: goalProgressLogMock
})

export const getGoalProgressLogs = goalProgressLogApi.getList

/* ========== 目标模板 CRUD ========== */
export const goalTemplateApi = createCrudApi<GoalTemplate>({
  baseUrl: '/admin/performance/goal-template',
  mockFns: goalTemplateMock
})

export const getGoalTemplates = goalTemplateApi.getList

/* ========== 业务方法 ========== */

/**
 * 审批目标
 */
export function approveGoal(
  id: number,
  approved: boolean,
  comment: string,
  approver = '直属上级',
  approverId = 999
) {
  if (USE_MOCK) {
    return mockResolve(
      () => approveGoalMock(id, approved, comment, approver, approverId),
      approved ? '已批准' : '已驳回'
    )
  }
  return request.post({
    url: `/admin/performance/goal/${id}/approve`,
    data: { approved, comment, approver, approverId }
  })
}

/**
 * 重新提交
 */
export function resubmitGoal(id: number) {
  if (USE_MOCK) return mockResolve(() => resubmitGoalMock(id), '已重新提交')
  return request.post({ url: `/admin/performance/goal/${id}/resubmit` })
}

/**
 * 更新进度
 */
export function updateGoalProgress(
  id: number,
  data: {
    afterProgress: number
    afterValue?: string
    keyResultsUpdate?: KeyResult[]
    highlights?: string
    issues?: string
    nextPlan?: string
    updatedBy?: string
    updatedById?: number
  }
) {
  const payload = {
    afterProgress: data.afterProgress,
    afterValue: data.afterValue,
    keyResultsUpdate: data.keyResultsUpdate,
    highlights: data.highlights,
    issues: data.issues,
    nextPlan: data.nextPlan,
    updatedBy: data.updatedBy || '当前用户',
    updatedById: data.updatedById || 0
  }
  if (USE_MOCK) return mockResolve(() => updateGoalProgressMock(id, payload), '进度已更新')
  return request.post({
    url: `/admin/performance/goal/${id}/update-progress`,
    data: payload
  })
}

/**
 * 批量冻结周期内的所有目标
 */
export function freezeGoalsByCycle(cycleId: number) {
  if (USE_MOCK) return mockResolve(() => freezeGoalsByCycleMock(cycleId), '已冻结')
  return request.post({
    url: `/admin/performance/goal/freeze-by-cycle`,
    data: { cycleId }
  })
}

/**
 * 从模板创建目标
 */
export function createGoalFromTemplate(templateId: number, overrides: Partial<PerformanceGoal>) {
  if (USE_MOCK) return mockResolve(() => createGoalFromTemplateMock(templateId, overrides), '已创建')
  return request.post({
    url: `/admin/performance/goal/from-template`,
    data: { templateId, overrides }
  })
}
