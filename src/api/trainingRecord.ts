import type { TrainingRecord, TrainingRecordQueryParams } from '@/types/training'
import { createCrudApi } from '@/utils/crud'
import { trainingRecordMock } from '@/mock/trainingRecord'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 培训记录管理 API
 */
export const trainingRecordApi = createCrudApi<TrainingRecord>({
  baseUrl: '/admin/training/record',
  mockFns: trainingRecordMock
})

/**
 * 获取培训记录列表
 */
export const getTrainingRecordList = trainingRecordApi.getList

/**
 * 获取培训记录详情
 */
export const getTrainingRecordDetail = trainingRecordApi.getDetail

/**
 * 添加培训记录
 */
export const addTrainingRecord = trainingRecordApi.add

/**
 * 更新培训记录
 */
export const updateTrainingRecord = trainingRecordApi.update

/**
 * 删除培训记录
 */
export const removeTrainingRecord = trainingRecordApi.remove

/**
 * 批量删除培训记录
 */
export const batchDeleteTrainingRecord = (ids: number[]) => {
  if (trainingRecordApi.remove) {
    return Promise.all(ids.map(id => trainingRecordApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}

/**
 * 签到功能
 */
export const checkInTrainingRecord = (id: number) => {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, message: '签到成功', data: null })
      }, 300)
    })
  }
  return trainingRecordApi.update({ id, checkInStatus: 2 } as any)
}

// 导出别名（兼容页面使用）
export const getList = getTrainingRecordList
export const getDetail = getTrainingRecordDetail
export const addItem = addTrainingRecord
export const updateItem = updateTrainingRecord
export const deleteItem = removeTrainingRecord
export const deleteTrainingRecord = removeTrainingRecord
export const batchDeleteItems = batchDeleteTrainingRecord
export const batchDeleteTrainingRecords = batchDeleteTrainingRecord
