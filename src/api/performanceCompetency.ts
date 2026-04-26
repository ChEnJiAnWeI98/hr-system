/**
 * 能力模型 API（Phase C1a）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import { competencyMock, getEmployeeCompetencyScore } from '@/mock/performanceCompetency'
import type { Competency } from '@/types/performanceCompetency'

const crud = createCrudApi<Competency>({
  baseUrl: '/admin/performance/competency',
  mockFns: competencyMock
})

export const getCompetencyList = crud.getList
export const addCompetency = crud.add
export const updateCompetency = crud.update
export const deleteCompetency = crud.delete
export const batchDeleteCompetency = crud.batchDelete
export const updateCompetencyStatus = crud.updateStatus
export const getCompetencyDetail = crud.getDetail

/**
 * 获取员工能力评估分数（用于雷达图）
 */
export function getCompetencyRadarData(employeeId: number | string, competencyIds: number[]) {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: getEmployeeCompetencyScore(employeeId, competencyIds)
        })
      }, 300)
    })
  }
  // 真实 API 暂不实现
  return Promise.resolve({ code: 200, data: [] })
}
