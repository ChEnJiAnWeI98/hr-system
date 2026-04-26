import type { TrainingPlan, TrainingPlanListParams } from '@/types/training'
import { createCrudApi } from '@/utils/crud'
import { trainingPlanMock } from '@/mock/trainingPlan'

/**
 * 培训计划管理 API
 */
export const trainingPlanApi = createCrudApi<TrainingPlan>({
  baseUrl: '/admin/training/plan',
  mockFns: trainingPlanMock
})

/**
 * 获取培训计划列表
 */
export const getTrainingPlanList = trainingPlanApi.getList

/**
 * 获取培训计划详情
 */
export const getTrainingPlanDetail = trainingPlanApi.getDetail

/**
 * 添加培训计划
 */
export const addTrainingPlan = trainingPlanApi.add

/**
 * 更新培训计划
 */
export const updateTrainingPlan = trainingPlanApi.update

/**
 * 删除培训计划
 */
export const removeTrainingPlan = trainingPlanApi.remove

/**
 * 批量删除培训计划
 */
export const batchDeleteTrainingPlan = (ids: number[]) => {
  if (trainingPlanApi.remove) {
    return Promise.all(ids.map(id => trainingPlanApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}
