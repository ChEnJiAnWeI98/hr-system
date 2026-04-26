/**
 * 个税申报管理 API
 */

import request from '@/utils/http'
import type {
  TaxDeclaration,
  TaxDeclarationDetail,
  TaxDeclarationListParams,
  GenerateTaxDeclarationParams
} from '@/types/taxDeclaration'
import {
  getTaxDeclarationListMock,
  getTaxDeclarationDetailMock,
  generateTaxDeclarationMock
} from '@/mock/taxDeclaration'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取个税申报列表
 */
export function getTaxDeclarationList(params: TaxDeclarationListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTaxDeclarationListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: TaxDeclaration[]
    total: number
  }>({
    url: '/admin/tax-declaration/list',
    params
  })
}

/**
 * 获取个税申报详情
 */
export function getTaxDeclarationDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getTaxDeclarationDetailMock(id)
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

  return request.get<TaxDeclarationDetail>({
    url: `/admin/tax-declaration/detail/${id}`
  })
}

/**
 * 生成个税申报
 */
export function generateTaxDeclaration(params: GenerateTaxDeclarationParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = generateTaxDeclarationMock(params)
        resolve({
          code: 200,
          message: '生成申报成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/tax-declaration/generate',
    data: params
  })
}
