/**
 * 内推体系 API (Phase 3.2)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  Referral,
  ReferralRewardRule,
  ReferralRewardOrder,
  ReferralLeaderboardRow,
  ReferralOpenJob,
  ReferralLinkInfo
} from '@/types/referral'
import {
  referralCrudMock,
  rewardRuleCrudMock,
  rewardOrderCrudMock,
  approveRewardOrderMock,
  payRewardOrderMock,
  getLeaderboardMock,
  generateReferralLinkMock,
  getOpenJobsMock,
  checkReferralDuplicateMock,
  submitReferralMock
} from '@/mock/referral'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(data: T, message = 'success'): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, message, data })
    }, 300)
  })
}

/* ========== 内推记录 ========== */
export const referralApi = createCrudApi<Referral>({
  baseUrl: '/admin/referral/record',
  mockFns: referralCrudMock
})

/** 提交内推（含 90 天重复校验） */
export function submitReferral(data: Partial<Referral>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const ret = submitReferralMock(data)
        resolve({ code: 200, data: ret, message: ret.isDuplicate ? '已提交（疑似重复推荐）' : '内推已提交' })
      }, 300)
    })
  }
  return request.post({ url: '/admin/referral/submit', data })
}

/** 90 天重复校验 */
export function checkReferralDuplicate(phone: string) {
  if (USE_MOCK) {
    return mockResolve(checkReferralDuplicateMock(phone))
  }
  return request.get({ url: '/admin/referral/check-duplicate', params: { phone } })
}

/** 生成专属链接 */
export function generateReferralLink(params: {
  jobId: number
  jobTitle: string
  referrerId: number
  referrerName: string
}) {
  if (USE_MOCK) {
    return mockResolve<ReferralLinkInfo>(generateReferralLinkMock(params))
  }
  return request.post({ url: '/admin/referral/generate-link', data: params })
}

/* ========== 内推职位池 ========== */
export function getOpenJobs() {
  if (USE_MOCK) {
    return mockResolve<ReferralOpenJob[]>(getOpenJobsMock())
  }
  return request.get<ReferralOpenJob[]>({ url: '/admin/referral/open-jobs' })
}

/* ========== 排行榜 ========== */
export function getReferralLeaderboard() {
  if (USE_MOCK) {
    return mockResolve<ReferralLeaderboardRow[]>(getLeaderboardMock())
  }
  return request.get<ReferralLeaderboardRow[]>({ url: '/admin/referral/leaderboard' })
}

/* ========== 奖励规则 CRUD ========== */
export const rewardRuleApi = createCrudApi<ReferralRewardRule>({
  baseUrl: '/admin/referral/reward-rule',
  mockFns: rewardRuleCrudMock
})

/* ========== 奖励结算单 CRUD + 审批 + 发放 ========== */
export const rewardOrderApi = createCrudApi<ReferralRewardOrder>({
  baseUrl: '/admin/referral/reward-order',
  mockFns: rewardOrderCrudMock
})

/** 审批结算单 */
export function approveRewardOrder(id: number, approved: boolean, remark?: string) {
  if (USE_MOCK) {
    return mockResolve(approveRewardOrderMock(id, approved, remark), approved ? '已通过' : '已拒绝')
  }
  return request.post({ url: '/admin/referral/reward-order/approve', data: { id, approved, remark } })
}

/** 发放结算单 */
export function payRewardOrder(id: number) {
  if (USE_MOCK) {
    return mockResolve(payRewardOrderMock(id), '已发放')
  }
  return request.post({ url: '/admin/referral/reward-order/pay', data: { id } })
}
