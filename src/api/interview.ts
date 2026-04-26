/**
 * 面试管理 API
 */

import { createCrudApi } from '@/utils/crud/apiHelper'
import type { Interview, InterviewListParams } from '@/types/interview'
import { interviewMock } from '@/mock/interview'

/**
 * 面试管理 API
 */
export const interviewApi = createCrudApi<Interview>({
  baseUrl: '/admin/interview',
  mockFns: interviewMock
})

/**
 * 获取面试列表
 */
export const getInterviewList = (params: InterviewListParams) => {
  return interviewApi.getList(params)
}

/**
 * 添加面试
 */
export const addInterview = (data: Partial<Interview>) => {
  return interviewApi.add(data)
}

/**
 * 更新面试
 */
export const updateInterview = (data: Partial<Interview>) => {
  return interviewApi.update(data)
}

/**
 * 删除面试
 */
export const deleteInterview = (id: number) => {
  return interviewApi.delete(id)
}

/**
 * 批量删除面试
 */
export const batchDeleteInterview = (ids: number[]) => {
  return interviewApi.batchDelete(ids)
}

/**
 * 更新面试状态
 */
export const updateInterviewStatus = (id: number, status: number) => {
  return interviewApi.updateStatus(id, status)
}

/**
 * 获取面试详情
 */
export const getInterviewDetail = (id: number) => {
  return interviewApi.getDetail(id)
}
