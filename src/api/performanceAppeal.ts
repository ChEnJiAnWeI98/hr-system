/**
 * 绩效申诉 API（Phase C2）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  appealMock,
  approveAppeal,
  withdrawAppeal,
  getAppealAnalytics
} from '@/mock/performanceAppeal'
import type { PerformanceAppeal } from '@/types/performanceAppeal'

const crud = createCrudApi<PerformanceAppeal>({
  baseUrl: '/admin/performance/appeal',
  mockFns: appealMock
})

export const getAppealList = crud.getList
export const addAppeal = crud.add
export const updateAppeal = crud.update
export const deleteAppeal = crud.delete
export const getAppealDetail = crud.getDetail

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 审批申诉
 */
export function approveAppealApi(
  id: number,
  stage: 'level1' | 'level2' | 'committee',
  action: 'approved' | 'rejected' | 'overturn' | 'maintain',
  approverName: string,
  comment: string,
  newGrade?: 'S' | 'A' | 'B' | 'C' | 'D',
  newScore?: number
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = approveAppeal(id, stage, action, approverName, comment, newGrade, newScore)
          resolve({ code: 200, data, message: '审批成功' })
        } catch (e: any) {
          reject({ code: 500, message: e.message })
        }
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

/**
 * 撤回申诉
 */
export function withdrawAppealApi(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = withdrawAppeal(id)
        resolve({ code: 200, data, message: '已撤回' })
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}

/**
 * 申诉分析数据
 */
export function getAppealAnalyticsApi() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: getAppealAnalytics() })
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}
