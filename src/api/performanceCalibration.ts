import type { PerformanceCalibration, PerformanceCalibrationListParams } from '@/types/performanceCalibration'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { performanceCalibrationMock } from '@/mock/performanceCalibration'

/**
 * 绩效校准 API
 */
export const performanceCalibrationApi = createCrudApi<PerformanceCalibration>({
  baseUrl: '/admin/performance/calibration',
  mockFns: performanceCalibrationMock
})

/**
 * 获取绩效校准列表
 */
export const getPerformanceCalibrationList = performanceCalibrationApi.getList

/**
 * 获取绩效校准详情
 */
export const getPerformanceCalibrationDetail = performanceCalibrationApi.getDetail

/**
 * 添加绩效校准
 */
export const addPerformanceCalibration = performanceCalibrationApi.add

/**
 * 更新绩效校准
 */
export const updatePerformanceCalibration = performanceCalibrationApi.update

/**
 * 删除绩效校准
 */
export const deletePerformanceCalibration = performanceCalibrationApi.delete

/**
 * 批量删除绩效校准
 */
export const batchDeletePerformanceCalibration = performanceCalibrationApi.batchDelete
