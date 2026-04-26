import request from '@/utils/http'
import type { SalaryStructure, SalaryStructureListParams } from '@/types/salary'
import {
  getListMock,
  getDetailMock,
  addSalaryStructureMock,
  updateSalaryStructureMock,
  deleteSalaryStructureMock,
  batchDeleteSalaryStructuresMock
} from '@/mock/salaryStructure'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取薪资结构列表
 */
export function getSalaryStructureList(params: SalaryStructureListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: SalaryStructure[]
    total: number
  }>({
    url: '/admin/salary/structure/list',
    params
  })
}

/**
 * 获取薪资结构详情
 */
export function getSalaryStructureDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getDetailMock(id)
          resolve({
            code: 200,
            message: 'success',
            data
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

  return request.get<SalaryStructure>({
    url: `/admin/salary/structure/detail/${id}`
  })
}

/**
 * 添加薪资结构
 */
export function addSalaryStructure(data: Partial<SalaryStructure>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addSalaryStructureMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/salary/structure/add',
    data
  })
}

/**
 * 更新薪资结构
 */
export function updateSalaryStructure(data: Partial<SalaryStructure>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateSalaryStructureMock(data)
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
    url: '/admin/salary/structure/update',
    data
  })
}

/**
 * 删除薪资结构
 */
export function deleteSalaryStructure(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteSalaryStructureMock(id)
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
    url: `/admin/salary/structure/delete/${id}`
  })
}

/**
 * 批量删除薪资结构
 */
export function batchDeleteSalaryStructures(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteSalaryStructuresMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/salary/structure/batch-delete',
    data: { ids }
  })
}
