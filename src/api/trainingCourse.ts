import type { TrainingCourse, TrainingCourseListParams } from '@/types/training'
import { createCrudApi } from '@/utils/crud'
import { trainingCourseMock } from '@/mock/trainingCourse'

/**
 * 培训课程管理 API
 */
export const trainingCourseApi = createCrudApi<TrainingCourse>({
  baseUrl: '/admin/training/course',
  mockFns: trainingCourseMock
})

/**
 * 获取培训课程列表
 */
export const getTrainingCourseList = trainingCourseApi.getList

/**
 * 获取培训课程详情
 */
export const getTrainingCourseDetail = trainingCourseApi.getDetail

/**
 * 添加培训课程
 */
export const addTrainingCourse = trainingCourseApi.add

/**
 * 更新培训课程
 */
export const updateTrainingCourse = trainingCourseApi.update

/**
 * 删除培训课程
 */
export const removeTrainingCourse = trainingCourseApi.remove

/**
 * 批量删除培训课程
 */
export const batchDeleteTrainingCourse = (ids: number[]) => {
  if (trainingCourseApi.remove) {
    return Promise.all(ids.map(id => trainingCourseApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}

// 导出别名（兼容页面使用）
export const getList = getTrainingCourseList
export const getDetail = getTrainingCourseDetail
export const addItem = addTrainingCourse
export const updateItem = updateTrainingCourse
export const deleteItem = removeTrainingCourse
export const batchDeleteItems = batchDeleteTrainingCourse
