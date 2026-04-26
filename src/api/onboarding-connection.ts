/**
 * 候选人入职衔接（Pre-Onboarding）API
 * 对应 types/recruitment.ts 的 Onboarding 类型
 * 服务于 views/recruitment/onboarding/index.vue
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { Onboarding } from '@/types/recruitment'
import {
  onboardingConnectionMock,
  sendFillLinkMock,
  simulateCandidateFillMock,
  updateMultiDeptTasksMock,
  triggerNoShowAlertMock,
  archiveNoShowMock
} from '@/mock/onboarding-connection'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/* ========== 基础 CRUD ========== */
const onboardingConnectionApi = createCrudApi<Onboarding>({
  baseUrl: '/admin/onboarding-connection',
  mockFns: onboardingConnectionMock
})

export const getOnboardingList = onboardingConnectionApi.getList
export const addOnboarding = onboardingConnectionApi.add
export const updateOnboarding = onboardingConnectionApi.update
export const deleteOnboarding = onboardingConnectionApi.delete
export const batchDeleteOnboarding = onboardingConnectionApi.batchDelete
export const updateOnboardingStatus = onboardingConnectionApi.updateStatus
export const getOnboardingDetail = onboardingConnectionApi.getDetail

/* ========== 别名（兼容旧代码）========== */
export const getOnboardingConnectionList = onboardingConnectionApi.getList
export const addOnboardingConnection = onboardingConnectionApi.add
export const updateOnboardingConnection = onboardingConnectionApi.update
export const deleteOnboardingConnection = onboardingConnectionApi.delete
export const batchDeleteOnboardingConnection = onboardingConnectionApi.batchDelete
export const updateOnboardingConnectionStatus = onboardingConnectionApi.updateStatus
export const getOnboardingConnectionDetail = onboardingConnectionApi.getDetail

/* ========== Phase 2.4 业务方法 ========== */

function mockResolve<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, 300)
  })
}

/**
 * 发送候选人自助填报链接
 */
export function sendFillLink(id: number, templateId: number, templateName: string) {
  if (USE_MOCK) {
    return mockResolve(() => sendFillLinkMock(id, templateId, templateName), '填报链接已生成')
  }
  return request.post({
    url: `/admin/onboarding-connection/${id}/send-fill-link`,
    data: { templateId, templateName }
  })
}

/**
 * 模拟候选人填报（Mock 演示用）
 */
export function simulateCandidateFill(id: number, progress: number) {
  if (USE_MOCK) {
    return mockResolve(() => simulateCandidateFillMock(id, progress), '模拟成功')
  }
  return request.post({
    url: `/admin/onboarding-connection/${id}/simulate-fill`,
    data: { progress }
  })
}

/**
 * 更新多部门任务
 */
export function updateMultiDeptTasks(id: number, tasksJson: string) {
  if (USE_MOCK) {
    return mockResolve(() => updateMultiDeptTasksMock(id, tasksJson), '任务已更新')
  }
  return request.put({
    url: `/admin/onboarding-connection/${id}/multi-dept-tasks`,
    data: { tasksJson }
  })
}

/**
 * 触发鸽子预警
 */
export function triggerNoShowAlert(id: number) {
  if (USE_MOCK) {
    return mockResolve(() => triggerNoShowAlertMock(id), '已触发预警')
  }
  return request.post({
    url: `/admin/onboarding-connection/${id}/no-show-alert`
  })
}

/**
 * 爽约归档
 */
export function archiveNoShow(id: number, reasonText: string) {
  if (USE_MOCK) {
    return mockResolve(() => archiveNoShowMock(id, reasonText), '已归档')
  }
  return request.post({
    url: `/admin/onboarding-connection/${id}/archive-no-show`,
    data: { reasonText }
  })
}
