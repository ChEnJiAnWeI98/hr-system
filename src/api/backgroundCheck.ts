/**
 * 背调集成 API (Phase 4.1)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  BackgroundCheck,
  BackgroundCheckPackage,
  BGCostStats
} from '@/types/backgroundCheck'
import {
  bgOrderCrudMock,
  bgPackageCrudMock,
  getBackgroundChecksByCandidateNameMock,
  sendAuthLinkMock,
  simulateAuthMock,
  simulateCompleteMock,
  cancelOrderMock,
  getCostStatsMock
} from '@/mock/backgroundCheck'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(data: T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message })
      }
    }, 300)
  })
}

function mockResolveFn<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message })
      }
    }, 300)
  })
}

/** 背调订单 CRUD */
export const bgOrderApi = createCrudApi<BackgroundCheck>({
  baseUrl: '/admin/background-check/order',
  mockFns: bgOrderCrudMock
})

/** 背调套餐 CRUD */
export const bgPackageApi = createCrudApi<BackgroundCheckPackage>({
  baseUrl: '/admin/background-check/package',
  mockFns: bgPackageCrudMock
})

/** 发送候选人授权链接 */
export function sendAuthLink(id: number) {
  if (USE_MOCK) return mockResolveFn(() => sendAuthLinkMock(id), '授权链接已发送')
  return request.post({ url: '/admin/background-check/send-auth', data: { id } })
}

/** 模拟候选人授权（Demo） */
export function simulateAuth(id: number) {
  if (USE_MOCK) return mockResolveFn(() => simulateAuthMock(id), '候选人已授权')
  return request.post({ url: '/admin/background-check/simulate-auth', data: { id } })
}

/** 模拟完成调查（Demo） */
export function simulateComplete(id: number) {
  if (USE_MOCK) return mockResolveFn(() => simulateCompleteMock(id), '调查已完成')
  return request.post({ url: '/admin/background-check/simulate-complete', data: { id } })
}

/** 取消订单 */
export function cancelBGOrder(id: number, reason: string) {
  if (USE_MOCK) return mockResolveFn(() => cancelOrderMock(id, reason), '订单已取消')
  return request.post({ url: '/admin/background-check/cancel', data: { id, reason } })
}

/** 费用统计 */
export function getBGCostStats() {
  if (USE_MOCK) return mockResolve<BGCostStats>(getCostStatsMock())
  return request.get<BGCostStats>({ url: '/admin/background-check/cost-stats' })
}

/** 按候选人姓名查背调订单（候选人详情页 Timeline 用）*/
export function getBackgroundChecksByCandidateName(candidateName: string) {
  if (USE_MOCK) {
    return mockResolve<BackgroundCheck[]>(getBackgroundChecksByCandidateNameMock(candidateName))
  }
  return request.get<BackgroundCheck[]>({
    url: '/admin/background-check/by-candidate',
    params: { candidateName }
  })
}
