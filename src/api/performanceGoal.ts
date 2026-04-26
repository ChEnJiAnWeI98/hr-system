import type { PerformanceGoal, PerformanceGoalListParams } from '@/types/performanceGoal'
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  getListMock,
  getDetailMock,
  addMock,
  updateMock,
  deleteMock,
  batchDeleteMock
} from '@/mock/performanceGoal'

// 创建 CRUD API
const performanceGoalApi = createCrudApi<PerformanceGoal>({
  baseUrl: '/admin/performance/goal',
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

// 导出 API 函数
export const {
  getList,
  getDetail,
  add: addPerformanceGoal,
  update: updatePerformanceGoal,
  delete: deletePerformanceGoal,
  batchDelete: batchDeletePerformanceGoals
} = performanceGoalApi

// 导出别名（兼容页面使用）
export const addItem = addPerformanceGoal
export const updateItem = updatePerformanceGoal
export const deleteItem = deletePerformanceGoal
export const batchDeleteItems = batchDeletePerformanceGoals
