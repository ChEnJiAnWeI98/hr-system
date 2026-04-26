/**
 * 人员异动 API（Phase 3.1）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  transferMock,
  approveTransferMock,
  effectTransferMock,
  cancelTransferMock,
  getTransfersByEmployee
} from '@/mock/employee/transfer'
import type { EmployeeTransfer } from '@/types/employee/transfer'

const crud = createCrudApi<EmployeeTransfer>({
  baseUrl: '/admin/employee/transfer',
  mockFns: transferMock
})

export const getTransferList = crud.getList
export const addTransfer = crud.add
export const updateTransfer = crud.update
export const deleteTransfer = crud.delete
export const getTransferDetail = crud.getDetail

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function approveTransferApi(
  id: number,
  stage: 'level1' | 'level2',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = approveTransferMock(id, stage, action, approverName, approverId, comment)
          resolve({ code: 200, data, message: '审批成功' })
        } catch (e: any) {
          reject({ code: 500, message: e.message })
        }
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

export function effectTransferApi(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = effectTransferMock(id)
          resolve({ code: 200, data, message: '已生效' })
        } catch (e: any) {
          reject({ code: 500, message: e.message })
        }
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

export function cancelTransferApi(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = cancelTransferMock(id)
        resolve({ code: 200, data, message: '已撤销' })
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

export function getTransfersByEmployeeApi(employeeId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: getTransfersByEmployee(employeeId) })
      }, 200)
    })
  }
  return Promise.resolve({ code: 200, data: [] })
}
