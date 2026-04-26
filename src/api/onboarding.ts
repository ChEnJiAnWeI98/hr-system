import request from '@/utils/http'
import type {
  OnboardingApplication,
  OnboardingListParams,
  ApprovalRecord,
  DocumentItem,
  ProcedureItem
} from '@/types/onboarding'
import {
  getOnboardingListMock,
  getOnboardingDetailMock,
  addOnboardingMock,
  updateOnboardingMock,
  deleteOnboardingMock,
  approveOnboardingMock,
  updateDocumentsMock,
  updateProceduresMock,
  withdrawOnboardingMock,
  batchImportOnboardingMock
} from '@/mock/onboarding'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取入职申请列表
 */
export function getOnboardingList(params: OnboardingListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getOnboardingListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: OnboardingApplication[]
    total: number
  }>({
    url: '/admin/onboarding/list',
    params
  })
}

/**
 * 获取入职申请详情
 */
export function getOnboardingDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getOnboardingDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '数据不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<OnboardingApplication>({
    url: `/admin/onboarding/${id}`
  })
}

/**
 * 添加入职申请
 */
export function addOnboarding(data: Partial<OnboardingApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addOnboardingMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/onboarding/add',
    data
  })
}

/**
 * 更新入职申请
 */
export function updateOnboarding(data: Partial<OnboardingApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateOnboardingMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/onboarding/update',
    data
  })
}

/**
 * 删除入职申请
 */
export function deleteOnboarding(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteOnboardingMock(id)
          resolve({
            code: 200,
            message: '删除成功'
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/onboarding/${id}`
  })
}

/**
 * 审批入职申请
 */
export function approveOnboarding(data: { id: number; result: number; comment: string; approver?: string; approverId?: number }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveOnboardingMock(data as any)
          resolve({
            code: 200,
            message: '审批成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/onboarding/approve',
    data
  })
}

/**
 * 更新资料清单
 */
export function updateDocuments(data: { id: number; documents: Partial<DocumentItem>[] }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateDocumentsMock(data as any)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/onboarding/documents',
    data
  })
}

/**
 * 更新手续清单
 */
export function updateProcedures(data: { id: number; procedures: Partial<ProcedureItem>[] }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateProceduresMock(data as any)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/onboarding/procedures',
    data
  })
}

/**
 * 撤回入职申请
 */
export function withdrawOnboarding(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = withdrawOnboardingMock(id)
          resolve({
            code: 200,
            message: '撤回成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: `/admin/onboarding/withdraw/${id}`
  })
}

/**
 * 批量导入入职申请
 */
export function batchImportOnboarding(data: Partial<OnboardingApplication>[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = batchImportOnboardingMock(data)
          resolve({
            code: 200,
            message: '导入完成',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/onboarding/batch-import',
    data
  })
}

/**
 * 批量删除入职申请
 */
export function batchDeleteOnboarding(ids: number[]) {
  return Promise.all(ids.map(id => deleteOnboarding(id)))
}

// ============ Phase 2.4 新增 API ============

import {
  sendFillLinkMock,
  simulateCandidateFillMock,
  updateMultiDeptTasksMock,
  triggerNoShowAlertMock,
  archiveNoShowMock
} from '@/mock/onboarding'

function onboardingMockResolve<T>(fn: () => T, successMsg = '操作成功') {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message: successMsg, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, 300)
  })
}

/**
 * 发送 Pre-onboarding 填报链接
 */
export function sendFillLink(id: number, templateId: number, templateName: string) {
  if (USE_MOCK) {
    return onboardingMockResolve(() => sendFillLinkMock(id, templateId, templateName), '填报链接已生成')
  }
  return request.post({
    url: `/admin/onboarding/${id}/send-fill-link`,
    data: { templateId, templateName }
  })
}

/**
 * 模拟候选人填报（Mock 演示用）
 */
export function simulateCandidateFill(id: number, progress: number) {
  if (USE_MOCK) {
    return onboardingMockResolve(() => simulateCandidateFillMock(id, progress), '模拟成功')
  }
  return request.post({
    url: `/admin/onboarding/${id}/simulate-fill`,
    data: { progress }
  })
}

/**
 * 更新多部门任务
 */
export function updateMultiDeptTasks(id: number, tasksJson: string) {
  if (USE_MOCK) {
    return onboardingMockResolve(() => updateMultiDeptTasksMock(id, tasksJson), '任务已更新')
  }
  return request.put({
    url: `/admin/onboarding/${id}/multi-dept-tasks`,
    data: { tasksJson }
  })
}

/**
 * 触发鸽子预警
 */
export function triggerNoShowAlert(id: number) {
  if (USE_MOCK) {
    return onboardingMockResolve(() => triggerNoShowAlertMock(id), '已触发预警')
  }
  return request.post({ url: `/admin/onboarding/${id}/no-show-alert` })
}

/**
 * 爽约归档
 */
export function archiveNoShow(id: number, reasonText: string) {
  if (USE_MOCK) {
    return onboardingMockResolve(() => archiveNoShowMock(id, reasonText), '已归档')
  }
  return request.post({ url: `/admin/onboarding/${id}/archive-no-show`, data: { reasonText } })
}
