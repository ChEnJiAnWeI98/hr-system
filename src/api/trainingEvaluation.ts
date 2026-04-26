import type { TrainingEvaluation, TrainingEvaluationQueryParams } from '@/types/training'
import { createCrudApi } from '@/utils/crud'
import { trainingEvaluationMock } from '@/mock/trainingEvaluation'

/**
 * 培训评估管理 API
 */
export const trainingEvaluationApi = createCrudApi<TrainingEvaluation>({
  baseUrl: '/admin/training/evaluation',
  mockFns: trainingEvaluationMock
})

/**
 * 获取培训评估列表
 */
export const getTrainingEvaluationList = trainingEvaluationApi.getList

/**
 * 获取培训评估详情
 */
export const getTrainingEvaluationDetail = trainingEvaluationApi.getDetail

/**
 * 添加培训评估
 */
export const addTrainingEvaluation = trainingEvaluationApi.add

/**
 * 更新培训评估
 */
export const updateTrainingEvaluation = trainingEvaluationApi.update

/**
 * 删除培训评估
 */
export const removeTrainingEvaluation = trainingEvaluationApi.remove

/**
 * 批量删除培训评估
 */
export const batchDeleteTrainingEvaluation = (ids: number[]) => {
  if (trainingEvaluationApi.remove) {
    return Promise.all(ids.map(id => trainingEvaluationApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}

// 导出别名（兼容页面使用）
export const getList = getTrainingEvaluationList
export const getDetail = getTrainingEvaluationDetail
export const addItem = addTrainingEvaluation
export const updateItem = updateTrainingEvaluation
export const deleteItem = removeTrainingEvaluation
export const batchDeleteItems = batchDeleteTrainingEvaluation
