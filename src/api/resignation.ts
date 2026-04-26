/**
 * 离职管理 API
 */

import request from '@/utils/http'
import type {
  Resignation,
  ResignationListParams,
  ApproveResignationParams,
  UpdateHandoverParams,
  CompleteProceduresParams
} from '@/types/resignation'
import {
  getResignationListMock,
  getResignationDetailMock,
  addResignationMock,
  updateResignationMock,
  deleteResignationMock,
  batchDeleteResignationsMock,
  approveResignationMock,
  updateHandoverMock,
  completeProceduresMock,
  withdrawResignationMock
} from '@/mock/resignation'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取离职申请列表
 */
export function getResignationList(params: ResignationListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getResignationListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Resignation[]
    total: number
  }>({
    url: '/admin/resignation/list',
    params
  })
}

/**
 * 获取离职申请详情
 */
export function getResignationDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getResignationDetailMock(id)
          resolve({
            code: 200,
            message: 'success',
            data
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

  return request.get<Resignation>({
    url: `/admin/resignation/detail/${id}`
  })
}

/**
 * 发起离职申请
 */
export function addResignation(data: Partial<Resignation>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addResignationMock(data)
        resolve({
          code: 200,
          message: '申请成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/resignation/add',
    data
  })
}

/**
 * 更新离职申请
 */
export function updateResignation(data: Partial<Resignation>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateResignationMock(data)
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
    url: '/admin/resignation/update',
    data
  })
}

/**
 * 删除离职申请
 */
export function deleteResignation(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteResignationMock(id)
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
    url: `/admin/resignation/delete/${id}`
  })
}

/**
 * 批量删除离职申请
 */
export function batchDeleteResignations(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteResignationsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/resignation/batch-delete',
    data: { ids }
  })
}

/**
 * 审批离职申请
 */
export function approveResignation(data: ApproveResignationParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveResignationMock(data)
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
    url: '/admin/resignation/approve',
    data
  })
}

/**
 * 更新交接清单
 */
export function updateHandover(data: UpdateHandoverParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateHandoverMock(data)
          resolve({
            code: 200,
            message: '交接清单更新成功',
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
    url: '/admin/resignation/update-handover',
    data
  })
}

/**
 * 完成离职手续
 */
export function completeProcedures(data: CompleteProceduresParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = completeProceduresMock(data)
          resolve({
            code: 200,
            message: '手续办理成功',
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
    url: '/admin/resignation/complete-procedures',
    data
  })
}

/**
 * 撤回离职申请
 */
export function withdrawResignation(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = withdrawResignationMock(id)
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
    url: `/admin/resignation/withdraw/${id}`
  })
}
