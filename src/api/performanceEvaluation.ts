import type { PerformanceEvaluation, PerformanceEvaluationListParams } from '@/types/performanceEvaluation'
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  getListMock,
  getDetailMock,
  addMock,
  updateMock,
  deleteMock,
  batchDeleteMock
} from '@/mock/performanceEvaluation'

// 创建 CRUD API
const performanceEvaluationApi = createCrudApi<PerformanceEvaluation>({
  baseUrl: '/admin/performance/evaluation',
  mockFns: {
    getList: getListMock,
    getDetail: getDetailMock,
    add: addMock,
    update: updateMock,
    delete: deleteMock,
    batchDelete: batchDeleteMock,
    updateStatus: (id: any, status: number) => {
      const item = getDetailMock(id)
      if (item) {
        return updateMock({ ...item, status })
      }
      throw new Error('数据不存在')
    },
    getData: () => []
  }
})

/**
 * 获取绩效评估列表
 */
export const getPerformanceEvaluationList = performanceEvaluationApi.getList

/**
 * 获取绩效评估详情
 */
export const getPerformanceEvaluationDetail = performanceEvaluationApi.getDetail

/**
 * 添加绩效评估
 */
export const addPerformanceEvaluation = performanceEvaluationApi.add

/**
 * 更新绩效评估
 */
export const updatePerformanceEvaluation = performanceEvaluationApi.update

/**
 * 删除绩效评估
 */
export const deletePerformanceEvaluation = performanceEvaluationApi.delete

/**
 * 批量删除绩效评估
 */
export const batchDeletePerformanceEvaluation = performanceEvaluationApi.batchDelete
