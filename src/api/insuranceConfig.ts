import type { InsuranceConfig, InsuranceConfigListParams } from '@/types/socialSecurity'
import { createCrudApi } from '@/utils/crud'
import { insuranceConfigMock } from '@/mock/insuranceConfig'

/**
 * 参保配置管理 API
 */
export const insuranceConfigApi = createCrudApi<InsuranceConfig>({
  baseUrl: '/admin/social-security/insurance-config',
  mockFns: insuranceConfigMock
})

/**
 * 获取参保配置列表
 */
export const getInsuranceConfigList = insuranceConfigApi.getList

/**
 * 获取参保配置详情
 */
export const getInsuranceConfigDetail = insuranceConfigApi.getDetail

/**
 * 添加参保配置
 */
export const addInsuranceConfig = insuranceConfigApi.add

/**
 * 更新参保配置
 */
export const updateInsuranceConfig = insuranceConfigApi.update

/**
 * 删除参保配置
 */
export const removeInsuranceConfig = insuranceConfigApi.remove

/**
 * 批量删除参保配置
 */
export const batchDeleteInsuranceConfig = (ids: number[]) => {
  if (insuranceConfigApi.remove) {
    return Promise.all(ids.map(id => insuranceConfigApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}
