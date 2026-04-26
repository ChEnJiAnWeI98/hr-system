/**
 * 徽章 API（Phase C4）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  badgeTypeMock,
  badgeQuotaMock,
  badgeAwardMock,
  badgeBonusRuleMock
} from '@/mock/performanceBadge'
import type {
  BadgeType,
  BadgeQuota,
  BadgeAward,
  BadgeBonusRule
} from '@/types/performanceBadge'

const typeCrud = createCrudApi<BadgeType>({
  baseUrl: '/admin/performance/badge-type',
  mockFns: badgeTypeMock
})
export const getBadgeTypeList = typeCrud.getList
export const addBadgeType = typeCrud.add
export const updateBadgeType = typeCrud.update
export const deleteBadgeType = typeCrud.delete
export const updateBadgeTypeStatus = typeCrud.updateStatus

const quotaCrud = createCrudApi<BadgeQuota>({
  baseUrl: '/admin/performance/badge-quota',
  mockFns: badgeQuotaMock
})
export const getBadgeQuotaList = quotaCrud.getList
export const addBadgeQuota = quotaCrud.add
export const updateBadgeQuota = quotaCrud.update
export const deleteBadgeQuota = quotaCrud.delete

const awardCrud = createCrudApi<BadgeAward>({
  baseUrl: '/admin/performance/badge-award',
  mockFns: badgeAwardMock
})
export const getBadgeAwardList = awardCrud.getList

const ruleCrud = createCrudApi<BadgeBonusRule>({
  baseUrl: '/admin/performance/badge-bonus-rule',
  mockFns: badgeBonusRuleMock
})
export const getBadgeBonusRuleList = ruleCrud.getList
export const addBadgeBonusRule = ruleCrud.add
export const updateBadgeBonusRule = ruleCrud.update
export const deleteBadgeBonusRule = ruleCrud.delete
