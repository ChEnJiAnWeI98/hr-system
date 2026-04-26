import { createCrudApi } from '@/utils/crud/apiHelper'
import { offerMock } from '@/mock/offer'

/**
 * Offer 管理 API
 */
export const offerApi = createCrudApi({
  baseUrl: '/admin/offer',
  mockFns: offerMock
})

/**
 * 获取 Offer 列表
 */
export const getOfferList = offerApi.getList

/**
 * 获取 Offer 详情
 */
export const getOfferDetail = offerApi.getDetail

/**
 * 添加 Offer
 */
export const addOffer = offerApi.add

/**
 * 更新 Offer
 */
export const updateOffer = offerApi.update

/**
 * 删除 Offer
 */
export const deleteOffer = offerApi.delete

/**
 * 批量删除 Offer
 */
export const batchDeleteOffers = offerApi.batchDelete
