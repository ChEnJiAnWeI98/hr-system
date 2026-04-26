import request from '@/utils/http'
import type { MakeupClockInApplication, MakeupClockInApplicationListParams } from '@/types/attendance'
import {
  getListMock,
  getDetailMock,
  addMakeupClockInApplicationMock,
  updateMakeupClockInApplicationMock,
  deleteMakeupClockInApplicationMock,
  batchDeleteMakeupClockInApplicationsMock,
  approveMakeupClockInApplicationMock,
  rejectMakeupClockInApplicationMock
} from '@/mock/makeupClockIn'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取补卡申请列表
 */
export function getMakeupClockInApplicationList(params: MakeupClockInApplicationListParams) {
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
    list: MakeupClockInApplication[]
    total: number
  }>({
    url: '/admin/attendance/makeup/list',
    params
  })
}

/**
 * 获取补卡申请详情
 */
export function getMakeupClockInApplicationDetail(id: number) {
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

  return request.get<MakeupClockInApplication>({
    url: `/admin/attendance/makeup/detail/${id}`
  })
}

/**
 * 添加补卡申请
 */
export function addMakeupClockInApplication(data: Partial<MakeupClockInApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addMakeupClockInApplicationMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/attendance/makeup/add',
    data
  })
}

/**
 * 更新补卡申请
 */
export function updateMakeupClockInApplication(data: Partial<MakeupClockInApplication>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateMakeupClockInApplicationMock(data)
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
    url: '/admin/attendance/makeup/update',
    data
  })
}

/**
 * 删除补卡申请
 */
export function deleteMakeupClockInApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteMakeupClockInApplicationMock(id)
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
    url: `/admin/attendance/makeup/delete/${id}`
  })
}

/**
 * 批量删除补卡申请
 */
export function batchDeleteMakeupClockInApplications(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteMakeupClockInApplicationsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/attendance/makeup/batch-delete',
    data: { ids }
  })
}

/**
 * 批准补卡申请
 */
export function approveMakeupClockInApplication(id: number, data: { approvalComment?: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveMakeupClockInApplicationMock(id, data)
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
    url: `/admin/attendance/makeup/approve/${id}`,
    data
  })
}

/**
 * 拒绝补卡申请
 */
export function rejectMakeupClockInApplication(id: number, data: { approvalComment: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = rejectMakeupClockInApplicationMock(id, data)
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
    url: `/admin/attendance/makeup/reject/${id}`,
    data
  })
}
