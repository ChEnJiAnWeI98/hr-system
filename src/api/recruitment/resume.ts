import request from '@/utils/http'
import type { Resume, ResumeListParams, ScheduleInterviewParams } from '@/types/recruitment'
import {
  getResumeListMock,
  getResumeDetailMock,
  importResumeMock,
  batchStoreResumeMock,
  batchDeleteResumeMock,
  scheduleInterviewMock,
  rejectResumeMock
} from '@/mock/recruitment/resume'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取简历列表
 */
export function getResumeList(params: ResumeListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getResumeListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Resume[]
    total: number
  }>({
    url: '/admin/recruitment/resume/list',
    params
  })
}

/**
 * 获取简历详情
 */
export function getResumeDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getResumeDetailMock(id)
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

  return request.get<Resume>({
    url: `/admin/recruitment/resume/detail/${id}`
  })
}

/**
 * 导入简历
 */
export function importResume(file: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = importResumeMock(file)
        resolve({
          code: 200,
          message: '导入成功',
          data
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/resume/import',
    data: file
  })
}

/**
 * 批量入库
 */
export function batchStoreResume(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchStoreResumeMock(ids)
        resolve({
          code: 200,
          message: '入库成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/resume/batch-store',
    data: { ids }
  })
}

/**
 * 批量删除简历
 */
export function batchDeleteResume(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteResumeMock(ids)
        resolve({
          code: 200,
          message: '删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/recruitment/resume/batch-delete',
    data: { ids }
  })
}

/**
 * 安排面试
 */
export function scheduleInterview(data: ScheduleInterviewParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          scheduleInterviewMock(data)
          resolve({
            code: 200,
            message: '安排面试成功'
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
    url: '/admin/recruitment/resume/schedule-interview',
    data
  })
}

/**
 * 淘汰简历
 */
export function rejectResume(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          rejectResumeMock(id)
          resolve({
            code: 200,
            message: '淘汰成功'
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
    url: `/admin/recruitment/resume/reject/${id}`
  })
}
