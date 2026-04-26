import request from '@/utils/http'
import type { OvertimeApplication, OvertimeApplicationListParams } from '@/types/attendance'
import {
  getListMock,
  getDetailMock,
  addOvertimeApplicationMock,
  updateOvertimeApplicationMock,
  deleteOvertimeApplicationMock,
  batchDeleteOvertimeApplicationsMock,
  approveOvertimeApplicationMock,
  rejectOvertimeApplicationMock
} from '@/mock/overtime'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取加班申请列表
 */
export function getOvertimeApplicationList(params: OvertimeApplicationListParams) {
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
    list: OvertimeApplication[]
    total: number
  }>({
    url: '/admin/attendance/overtime/list',
    params
  })
}

/**
 * 获取加班申请详情
 */
export function getOvertimeApplicationDetail(id: number) {
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

  return request.get<OvertimeApplication>({
    url: `/admin/attendance/overtime/detail/${id}`
  })
}

/**
 * 添加加班申请
 */
export function addOvertimeApplication(data: Partial<OvertimeApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addOvertimeApplicationMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/attendance/overtime/add',
    data
  })
}

/**
 * 更新加班申请
 */
export function updateOvertimeApplication(data: Partial<OvertimeApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateOvertimeApplicationMock(data)
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
    url: '/admin/attendance/overtime/update',
    data
  })
}

/**
 * 删除加班申请
 */
export function deleteOvertimeApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteOvertimeApplicationMock(id)
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
    url: `/admin/attendance/overtime/delete/${id}`
  })
}

/**
 * 批量删除加班申请
 */
export function batchDeleteOvertimeApplications(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteOvertimeApplicationsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/attendance/overtime/batch-delete',
    data: { ids }
  })
}

/**
 * 批准加班申请
 */
export function approveOvertimeApplication(id: number, data: { approvalComment?: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveOvertimeApplicationMock(id, data)
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
    url: `/admin/attendance/overtime/approve/${id}`,
    data
  })
}

/**
 * 拒绝加班申请
 */
export function rejectOvertimeApplication(id: number, data: { approvalComment: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = rejectOvertimeApplicationMock(id, data)
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
    url: `/admin/attendance/overtime/reject/${id}`,
    data
  })
}
