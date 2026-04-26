/**
 * 请假申请 API
 */

import request from '@/utils/http'
import type { LeaveApplication, LeaveApplicationListParams } from '@/types/leave'
import {
  getListMock,
  getDetailMock,
  addLeaveApplicationMock,
  updateLeaveApplicationMock,
  deleteLeaveApplicationMock,
  batchDeleteLeaveApplicationsMock,
  approveLeaveApplicationMock,
  rejectLeaveApplicationMock,
  withdrawLeaveApplicationMock
} from '@/mock/leaveApplication'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取请假申请列表
 */
export function getLeaveApplicationList(params: LeaveApplicationListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: LeaveApplication[]
    total: number
  }>({
    url: '/admin/leave-application/list',
    params
  })
}

/**
 * 获取请假申请详情
 */
export function getLeaveApplicationDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getDetailMock(id)
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

  return request.get<LeaveApplication>({
    url: `/admin/leave-application/detail/${id}`
  })
}

/**
 * 添加请假申请
 */
export function addLeaveApplication(data: Partial<LeaveApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addLeaveApplicationMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/leave-application/add',
    data
  })
}

/**
 * 更新请假申请
 */
export function updateLeaveApplication(data: Partial<LeaveApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateLeaveApplicationMock(data)
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
    url: '/admin/leave-application/update',
    data
  })
}

/**
 * 删除请假申请
 */
export function deleteLeaveApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteLeaveApplicationMock(id)
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
    url: `/admin/leave-application/delete/${id}`
  })
}

/**
 * 批量删除请假申请
 */
export function batchDeleteLeaveApplications(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          batchDeleteLeaveApplicationsMock(ids)
          resolve({
            code: 200,
            message: '批量删除成功'
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/leave-application/batch-delete',
    data: { ids }
  })
}

/**
 * 批准请假申请
 */
export function approveLeaveApplication(id: number, data: { approvalComment?: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveLeaveApplicationMock(id, data)
          resolve({
            code: 200,
            message: '批准成功',
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
    url: `/admin/leave-application/approve/${id}`,
    data
  })
}

/**
 * 拒绝请假申请
 */
export function rejectLeaveApplication(id: number, data: { approvalComment: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = rejectLeaveApplicationMock(id, data)
          resolve({
            code: 200,
            message: '已拒绝',
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
    url: `/admin/leave-application/reject/${id}`,
    data
  })
}

/**
 * 撤回请假申请
 */
export function withdrawLeaveApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = withdrawLeaveApplicationMock(id)
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
    url: `/admin/leave-application/withdraw/${id}`
  })
}
