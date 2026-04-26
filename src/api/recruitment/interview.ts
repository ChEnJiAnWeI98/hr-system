import request from '@/utils/http'
import type { Interview, InterviewListParams, InterviewEvaluation } from '@/types/recruitment'
import {
  getInterviewListMock,
  getInterviewsByCandidateNameMock,
  addInterviewMock,
  updateInterviewMock,
  deleteInterviewMock,
  batchDeleteInterviewMock,
  cancelInterviewMock,
  evaluateInterviewMock,
  getInterviewEvaluationsMock,
  getMyEvaluationMock,
  saveInterviewEvaluationMock
} from '@/mock/recruitment/interview'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 300

function mockResolve<T>(fn: () => T, successMsg = 'success') {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message: successMsg, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, MOCK_DELAY)
  })
}

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

// ============ Phase 2.2 新增：多人协同评价 API ============

/**
 * 获取面试的所有评价
 * @param currentUserId 当前用户ID（用于过滤：他人未提交的不可见）
 */
export function getInterviewEvaluations(interviewId: number, currentUserId?: number) {
  if (USE_MOCK) {
    return mockResolve(() => getInterviewEvaluationsMock(interviewId, currentUserId), '获取成功')
  }
  return request.get({
    url: `/admin/recruitment/interview/${interviewId}/evaluations`,
    params: { currentUserId }
  })
}

/**
 * 获取当前用户对某场面试的评价（如果有）
 */
export function getMyEvaluation(interviewId: number, interviewerId: number) {
  if (USE_MOCK) {
    return mockResolve(() => getMyEvaluationMock(interviewId, interviewerId), '获取成功')
  }
  return request.get({
    url: `/admin/recruitment/interview/${interviewId}/evaluation/my`,
    params: { interviewerId }
  })
}

/**
 * 保存评价（草稿或提交）
 * @param submit true=提交并对其他面试官可见 / false=草稿保存
 */
export function saveInterviewEvaluation(data: Partial<InterviewEvaluation>, submit = false) {
  if (USE_MOCK) {
    return mockResolve(
      () => saveInterviewEvaluationMock(data, submit),
      submit ? '评价已提交' : '草稿已保存'
    )
  }
  return request.post({
    url: '/admin/recruitment/interview/evaluation/save',
    data: { ...data, submit }
  })
}

/** 按候选人姓名查全部面试记录（候选人详情页 Timeline 用）*/
export function getInterviewsByCandidateName(candidateName: string) {
  if (USE_MOCK) {
    return mockResolve<Interview[]>(() => getInterviewsByCandidateNameMock(candidateName))
  }
  return request.get<Interview[]>({
    url: '/admin/recruitment/interview/by-candidate',
    params: { candidateName }
  })
}
