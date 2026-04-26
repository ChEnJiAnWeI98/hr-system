/**
 * 人才库 API
 */

import { createCrudApi } from '@/utils/crud/apiHelper'
import request from '@/utils/http'
import type {
  TalentProfile,
  TalentPool,
  TalentProfileListParams,
  DedupeCheckParams
} from '@/types/talentPool'
import {
  talentProfileMock,
  talentPoolMock,
  getTalentProfileListMock,
  dedupeCheckMock,
  updateProfileStatusMock,
  getPoolCandidateCountsMock
} from '@/mock/talentPool'

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

// ============ 人才池 CRUD ============
export const talentPoolApi = createCrudApi<TalentPool>({
  baseUrl: '/admin/recruitment/talent-pool',
  mockFns: talentPoolMock
})

/** 获取人才池及各池候选人数量 */
export const getPoolsWithCount = async () => {
  if (USE_MOCK) {
    return mockResolve(() => {
      const pools = talentPoolMock.getData() as TalentPool[]
      const counts = getPoolCandidateCountsMock()
      return pools.map((p) => ({ ...p, candidateCount: counts[p.id] || 0 }))
    }, '获取人才池成功')
  }
  return request.get({ url: '/admin/recruitment/talent-pool/with-count' })
}

// ============ 候选人档案 CRUD ============
export const talentProfileApi = createCrudApi<TalentProfile>({
  baseUrl: '/admin/recruitment/talent-profile',
  mockFns: talentProfileMock
})

/** 获取候选人列表（支持人才池/状态/期望城市等多重筛选） */
export const getTalentProfileList = (params: TalentProfileListParams) => {
  if (USE_MOCK) {
    return mockResolve(() => getTalentProfileListMock(params), '获取列表成功')
  }
  return request.get({ url: '/admin/recruitment/talent-profile/list', params })
}

/** 候选人档案查重 */
export const dedupeCheck = (params: DedupeCheckParams) => {
  if (USE_MOCK) {
    return mockResolve(() => dedupeCheckMock(params), '查重完成')
  }
  return request.get({ url: '/admin/recruitment/talent-profile/dedupe', params })
}

/** 更改候选人档案状态（拉黑/加红/冷冻/恢复） */
export const updateProfileStatus = (
  id: number,
  profileStatus: TalentProfile['profileStatus'],
  reason?: string,
  frozenUntil?: string
) => {
  if (USE_MOCK) {
    return mockResolve(
      () => updateProfileStatusMock(id, profileStatus, reason, frozenUntil),
      '状态更新成功'
    )
  }
  return request.post({
    url: `/admin/recruitment/talent-profile/${id}/status`,
    data: { profileStatus, reason, frozenUntil }
  })
}
