/**
 * 离职管理 API（Phase 3.2）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  offboardingMock,
  approveOffboardingMock,
  updateHandoverItemMock,
  completeHandoverMock,
  completeOffboardingMock,
  cancelOffboardingMock,
  saveExitInterviewMock,
  issueCertificateMock,
  getOffboardingsByEmployee
} from '@/mock/employee/offboarding'
import type { EmployeeOffboarding } from '@/types/employee/offboarding'

const crud = createCrudApi<EmployeeOffboarding>({
  baseUrl: '/admin/employee/offboarding',
  mockFns: offboardingMock
})

export const getOffboardingList = crud.getList
export const addOffboarding = crud.add
export const updateOffboarding = crud.update
export const deleteOffboarding = crud.delete
export const getOffboardingDetail = crud.getDetail

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockPromise = <T>(fn: () => T, msg = '成功', delay = 300) =>
  new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, data: fn(), message: msg })
      } catch (e: any) {
        reject({ code: 500, message: e.message })
      }
    }, delay)
  })

export function approveOffboardingApi(
  id: number,
  stage: 'dept' | 'hr',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
) {
  if (USE_MOCK)
    return mockPromise(() =>
      approveOffboardingMock(id, stage, action, approverName, approverId, comment)
    )
  return Promise.resolve({ code: 200, data: null })
}

export function updateHandoverItemApi(
  id: number,
  itemId: number,
  status: 'pending' | 'in_progress' | 'completed',
  receiverId?: number,
  receiverName?: string
) {
  if (USE_MOCK)
    return mockPromise(() =>
      updateHandoverItemMock(id, itemId, status, receiverId, receiverName)
    )
  return Promise.resolve({ code: 200, data: null })
}

export function completeHandoverApi(id: number) {
  if (USE_MOCK) return mockPromise(() => completeHandoverMock(id), '交接完成，等待离职日')
  return Promise.resolve({ code: 200, data: null })
}

export function completeOffboardingApi(id: number) {
  if (USE_MOCK) return mockPromise(() => completeOffboardingMock(id), '离职流程已完成')
  return Promise.resolve({ code: 200, data: null })
}

export function cancelOffboardingApi(id: number) {
  if (USE_MOCK) return mockPromise(() => cancelOffboardingMock(id), '已撤销')
  return Promise.resolve({ code: 200, data: null })
}

export function saveExitInterviewApi(
  id: number,
  interview: EmployeeOffboarding['exitInterview']
) {
  if (USE_MOCK) return mockPromise(() => saveExitInterviewMock(id, interview), '面谈记录已保存')
  return Promise.resolve({ code: 200, data: null })
}

export function issueCertificateApi(id: number) {
  if (USE_MOCK) return mockPromise(() => issueCertificateMock(id), '离职证明已出具')
  return Promise.resolve({ code: 200, data: null })
}

export function getOffboardingsByEmployeeApi(employeeId: number) {
  if (USE_MOCK)
    return new Promise<any>((resolve) => {
      setTimeout(() => resolve({ code: 200, data: getOffboardingsByEmployee(employeeId) }), 200)
    })
  return Promise.resolve({ code: 200, data: [] })
}
