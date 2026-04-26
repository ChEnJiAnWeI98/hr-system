import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type { Offer } from '@/types/recruitment'
import {
  offerMock,
  renderOfferContent,
  getOffersByCandidateNameMock,
  createOfferMock,
  bumpVersionOfferMock,
  candidateRejectOfferMock,
  candidateAcceptOfferMock,
  withdrawOfferMock
} from '@/mock/offer'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 300

function mockResolve<T>(fn: () => T, successMsg = '操作成功') {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message: successMsg, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, MOCK_DELAY)
  })
}

/**
 * Offer 管理 API
 */
export const offerApi = createCrudApi<Offer>({
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
 * 添加 Offer（Phase 2.3 增强：支持模板渲染）
 */
export const addOffer = (data: Partial<Offer>) => {
  if (USE_MOCK) {
    return mockResolve(() => createOfferMock(data, data.offerContent), 'Offer 已创建')
  }
  return request.post({ url: '/admin/offer/add', data })
}

/**
 * 更新 Offer
 */
export const updateOffer = offerApi.update

/**
 * Phase 2.3 新增：更新 Offer 并生成新版本（协商场景）
 */
export const updateOfferVersion = (id: number, data: Partial<Offer>, renderedContent?: string) => {
  if (USE_MOCK) {
    return mockResolve(() => bumpVersionOfferMock(id, data, renderedContent), 'Offer 已生成新版本')
  }
  return request.post({ url: `/admin/offer/${id}/bump-version`, data: { ...data, renderedContent } })
}

/**
 * 删除 Offer
 */
export const deleteOffer = offerApi.delete

/**
 * 批量删除 Offer
 */
export const batchDeleteOffers = offerApi.batchDelete

/**
 * Phase 2.3 新增：候选人接受 Offer
 */
export const candidateAcceptOffer = (id: number) => {
  if (USE_MOCK) {
    return mockResolve(() => candidateAcceptOfferMock(id), '候选人已接受 Offer')
  }
  return request.post({ url: `/admin/offer/${id}/accept` })
}

/**
 * Phase 2.3 新增：候选人拒绝 Offer（带拒绝原因字典）
 */
export const candidateRejectOffer = (id: number, reasonCode: string, reasonText: string) => {
  if (USE_MOCK) {
    return mockResolve(() => candidateRejectOfferMock(id, reasonCode, reasonText), '已记录拒绝原因')
  }
  return request.post({ url: `/admin/offer/${id}/reject`, data: { reasonCode, reasonText } })
}

/**
 * Phase 2.3 新增：变量替换预览（前端直接调用 Mock 函数即可，无需走网络）
 */
export const previewOfferRender = (template: string, vars: Record<string, string>): string => {
  return renderOfferContent(template, vars)
}

/**
 * 撤回 Offer（HR 主动撤回已发送但候选人尚未响应的 Offer）
 */
export const withdrawOffer = (id: number, reason: string) => {
  if (USE_MOCK) {
    return mockResolve(() => withdrawOfferMock(id, reason), 'Offer 已撤回')
  }
  return request.post({ url: `/admin/offer/${id}/withdraw`, data: { reason } })
}

/** 按候选人姓名查 Offer 记录（候选人详情页 Timeline 用）*/
export function getOffersByCandidateName(candidateName: string) {
  if (USE_MOCK) {
    return mockResolve<Offer[]>(() => getOffersByCandidateNameMock(candidateName))
  }
  return request.get<Offer[]>({
    url: '/admin/offer/by-candidate',
    params: { candidateName }
  })
}
