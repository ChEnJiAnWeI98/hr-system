import request from '@/utils/http'
import type { Interview, InterviewListParams } from '@/types/recruitment'
import {
  getInterviewListMock,
  addInterviewMock,
  updateInterviewMock,
  deleteInterviewMock,
  batchDeleteInterviewMock,
  cancelInterviewMock,
  evaluateInterviewMock
} from '@/mock/recruitment/interview'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取面试列表
 */
export function getInterviewList(params: InterviewListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getInterviewListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Interview[]
    total: number
  }>({
    url: '/admin/recruitment/interview/list',
    params
  })
}

/**
 * 添加面试
 */
export function addInterview(data: Partial<Interview>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addInterviewMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/interview/add',
    data
  })
}

/**
 * 更新面试
 */
export function updateInterview(data: Partial<Interview>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateInterviewMock(data)
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
    url: '/admin/recruitment/interview/update',
    data
  })
}

/**
 * 删除面试
 */
export function deleteInterview(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteInterviewMock(id)
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
    url: `/admin/recruitment/interview/delete/${id}`
  })
}

/**
 * 批量删除面试
 */
export function batchDeleteInterview(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteInterviewMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/interview/batchDelete',
    data: { ids }
  })
}

/**
 * 取消面试
 */
export function cancelInterview(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = cancelInterviewMock(id)
          resolve({
            code: 200,
            message: '取消成功',
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
    url: `/admin/recruitment/interview/cancel/${id}`
  })
}

/**
 * 填写评价
 */
export function evaluateInterview(data: { id: number; rating: number; evaluation: string; result: number }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = evaluateInterviewMock(data)
          resolve({
            code: 200,
            message: '评价成功',
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
    url: '/admin/recruitment/interview/evaluate',
    data
  })
}
