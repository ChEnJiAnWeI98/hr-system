import type { InsuranceBill, InsuranceBillListParams } from '@/types/socialSecurity'
import { createCrudApi } from '@/utils/crud'
import { insuranceBillMock } from '@/mock/insuranceBill'

/**
 * 社保账单管理 API
 */
export const insuranceBillApi = createCrudApi<InsuranceBill>({
  baseUrl: '/admin/social-security/insurance-bill',
  mockFns: insuranceBillMock
})

/**
 * 获取社保账单列表
 */
export const getInsuranceBillList = insuranceBillApi.getList

/**
 * 获取社保账单详情
 */
export const getInsuranceBillDetail = insuranceBillApi.getDetail

/**
 * 添加社保账单
 */
export const addInsuranceBill = insuranceBillApi.add

/**
 * 更新社保账单
 */
export const updateInsuranceBill = insuranceBillApi.update

/**
 * 删除社保账单
 */
export const removeInsuranceBill = insuranceBillApi.remove

/**
 * 批量删除社保账单
 */
export const batchDeleteInsuranceBill = (ids: number[]) => {
  if (insuranceBillApi.remove) {
    return Promise.all(ids.map(id => insuranceBillApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}
