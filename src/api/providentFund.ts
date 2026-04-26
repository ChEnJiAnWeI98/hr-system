import request from '@/utils/http'
import type { ProvidentFund, ProvidentFundListParams } from '@/types/socialSecurity'
import {
  getProvidentFundListMock,
  getProvidentFundDetailMock,
  addProvidentFundMock,
  updateProvidentFundMock,
  deleteProvidentFundMock
} from '@/mock/providentFund'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取公积金列表
 */
export function getProvidentFundList(params: ProvidentFundListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getProvidentFundListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: ProvidentFund[]
    total: number
  }>({
    url: '/admin/social-security/provident-fund/list',
    params
  })
}

/**
 * 获取公积金详情
 */
export function getProvidentFundDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getProvidentFundDetailMock(id)
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

  return request.get<ProvidentFund>({
    url: `/admin/social-security/provident-fund/detail/${id}`
  })
}

/**
 * 添加公积金记录
 */
export function addProvidentFund(data: Partial<ProvidentFund>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addProvidentFundMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/social-security/provident-fund/add',
    data
  })
}

/**
 * 更新公积金记录
 */
export function updateProvidentFund(data: Partial<ProvidentFund>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateProvidentFundMock(data)
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
    url: '/admin/social-security/provident-fund/update',
    data
  })
}

/**
 * 删除公积金记录
 */
export function deleteProvidentFund(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteProvidentFundMock(id)
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
    url: `/admin/social-security/provident-fund/delete/${id}`
  })
}

/**
 * 批量删除公积金记录
 */
export function batchDeleteProvidentFund(ids: number[]) {
  return Promise.all(ids.map(id => deleteProvidentFund(id)))
}
