/**
 * 入职衔接 API
 */

import { createCrudApi } from '@/utils/crud/apiHelper'
import type { Onboarding } from '@/types/onboarding'
import { onboardingConnectionMock } from '@/mock/onboarding-connection'

// 创建 CRUD API
const onboardingConnectionApi = createCrudApi<Onboarding>({
  baseUrl: '/admin/onboarding-connection',
  mockFns: onboardingConnectionMock
})

/**
 * 获取入职衔接列表
 */
export const getOnboardingConnectionList = onboardingConnectionApi.getList

/**
 * 添加入职衔接
 */
export const addOnboardingConnection = onboardingConnectionApi.add

/**
 * 更新入职衔接
 */
export const updateOnboardingConnection = onboardingConnectionApi.update

/**
 * 删除入职衔接
 */
export const deleteOnboardingConnection = onboardingConnectionApi.delete

/**
 * 批量删除入职衔接
 */
export const batchDeleteOnboardingConnection = onboardingConnectionApi.batchDelete

/**
 * 更新入职衔接状态
 */
export const updateOnboardingConnectionStatus = onboardingConnectionApi.updateStatus

/**
 * 获取入职衔接详情
 */
export const getOnboardingConnectionDetail = onboardingConnectionApi.getDetail
