import request from '@/utils/http'
import type { LeaveQuota, LeaveQuotaListParams } from '@/types/leave'
import {
  getListMock,
  getDetailMock,
  addLeaveQuotaMock,
  updateLeaveQuotaMock,
  deleteLeaveQuotaMock,
  batchDeleteLeaveQuotasMock,
  grantLeaveQuotaMock,
  adjustLeaveQuotaMock
} from '@/mock/leaveQuota'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取假期额度列表
 */
export function getLeaveQuotaList(params: LeaveQuotaListParams) {
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
    list: LeaveQuota[]
    total: number
  }>({
    url: '/admin/leave/quota/list',
    params
  })
}

/**
 * 获取假期额度详情
 */
export function getLeaveQuotaDetail(id: number) {
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

  return request.get<LeaveQuota>({
    url: `/admin/leave/quota/detail/${id}`
  })
}

/**
 * 添加假期额度
 */
export function addLeaveQuota(data: Partial<LeaveQuota>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addLeaveQuotaMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/leave/quota/add',
    data
  })
}

/**
 * 更新假期额度
 */
export function updateLeaveQuota(data: Partial<LeaveQuota>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateLeaveQuotaMock(data)
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
    url: '/admin/leave/quota/update',
    data
  })
}

/**
 * 删除假期额度
 */
export function deleteLeaveQuota(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteLeaveQuotaMock(id)
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
    url: `/admin/leave/quota/delete/${id}`
  })
}

/**
 * 批量删除假期额度
 */
export function batchDeleteLeaveQuotas(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteLeaveQuotasMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/leave/quota/batch-delete',
    data: { ids }
  })
}

/**
 * 发放假期额度
 */
export function grantLeaveQuota(data: {
  employeeIds: number[]
  leaveTypeId: number
  leaveTypeName: string
  totalQuota: number
  year: number
  grantReason: string
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = grantLeaveQuotaMock(data)
        resolve({
          code: 200,
          message: '发放成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/leave/quota/grant',
    data
  })
}

/**
 * 调整假期额度
 */
export function adjustLeaveQuota(data: {
  id: number
  adjustType: 'increase' | 'decrease'
  adjustQuota: number
  adjustReason: string
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = adjustLeaveQuotaMock(data)
          resolve({
            code: 200,
            message: '调整成功',
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
    url: '/admin/leave/quota/adjust',
    data
  })
}
