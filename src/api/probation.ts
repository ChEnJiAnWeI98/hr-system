import request from '@/utils/http'
import type { Probation, ProbationListParams, ProbationForm, RegularizationForm } from '@/types/probation'
import {
  getProbationListMock,
  getProbationDetailMock,
  addProbationMock,
  updateProbationMock,
  deleteProbationMock,
  evaluateProbationMock
} from '@/mock/probation'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取试用期列表
 */
export function getProbationList(params: ProbationListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getProbationListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Probation[]
    total: number
  }>({
    url: '/admin/probation/list',
    params
  })
}

/**
 * 获取试用期详情
 */
export function getProbationDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getProbationDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '数据不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<Probation>({
    url: `/admin/probation/${id}`
  })
}

/**
 * 添加试用期记录
 */
export function addProbation(data: ProbationForm) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addProbationMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/probation/add',
    data
  })
}

/**
 * 更新试用期记录
 */
export function updateProbation(data: ProbationForm) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateProbationMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/probation/update',
    data
  })
}

/**
 * 删除试用期记录
 */
export function deleteProbation(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteProbationMock(id)
          resolve({
            code: 200,
            message: '删除成功'
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/probation/${id}`
  })
}

/**
 * 转正评估
 */
export function evaluateProbation(data: RegularizationForm) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = evaluateProbationMock(data)
          resolve({
            code: 200,
            message: '评估成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/probation/evaluate',
    data
  })
}
