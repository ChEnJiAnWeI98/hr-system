import request from '@/utils/http'
import type { TimeOff, TimeOffListParams } from '@/types/leave'
import {
  getTimeOffListMock,
  getTimeOffDetailMock,
  addTimeOffMock,
  updateTimeOffMock,
  deleteTimeOffMock,
  batchDeleteTimeOffsMock,
  approveTimeOffMock,
  rejectTimeOffMock
} from '@/mock/timeOff'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取调休列表
 */
export function getTimeOffList(params: TimeOffListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTimeOffListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: TimeOff[]
    total: number
  }>({
    url: '/admin/timeOff/list',
    params
  })
}

/**
 * 获取调休详情
 */
export function getTimeOffDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getTimeOffDetailMock(id)
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

  return request.get<TimeOff>({
    url: `/admin/timeOff/${id}`
  })
}

/**
 * 添加调休
 */
export function addTimeOff(data: Partial<TimeOff>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addTimeOffMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/timeOff/add',
    data
  })
}

/**
 * 更新调休
 */
export function updateTimeOff(data: Partial<TimeOff>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateTimeOffMock(data)
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
    url: '/admin/timeOff/update',
    data
  })
}

/**
 * 删除调休
 */
export function deleteTimeOff(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteTimeOffMock(id)
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
    url: `/admin/timeOff/${id}`
  })
}

/**
 * 批量删除调休
 */
export function batchDeleteTimeOffs(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteTimeOffsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/timeOff/batchDelete',
    data: { ids }
  })
}

/**
 * 批准调休
 */
export function approveTimeOff(data: { id: number; approvalComment: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveTimeOffMock(data)
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
    url: '/admin/timeOff/approve',
    data
  })
}

/**
 * 拒绝调休
 */
export function rejectTimeOff(data: { id: number; approvalComment: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = rejectTimeOffMock(data)
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
    url: '/admin/timeOff/reject',
    data
  })
}
