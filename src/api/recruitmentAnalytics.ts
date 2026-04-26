/**
 * 招聘数据分析 API (Phase 3.1)
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  AnalyticsQueryParams,
  RecruitmentDashboardStats,
  RecruitmentFunnelData,
  ChannelEffectRow,
  ChannelCostRecord,
  TimeToFillRow,
  InterviewerEfficiencyRow,
  DemandCompletionRow,
  AnalyticsExportParams
} from '@/types/recruitmentAnalytics'
import {
  getFunnelMock,
  getDashboardStatsMock,
  getChannelEffectMock,
  getTimeToFillMock,
  getInterviewerEfficiencyMock,
  getDemandCompletionMock,
  channelCostCrudMock
} from '@/mock/recruitmentAnalytics'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(data: T, message = 'success'): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, message, data })
    }, 300)
  })
}

/** 获取驾驶舱核心指标 */
export function getDashboardStats(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<RecruitmentDashboardStats>(getDashboardStatsMock(params))
  }
  return request.get<RecruitmentDashboardStats>({
    url: '/admin/recruitment/analytics/dashboard',
    params
  })
}

/** 获取招聘漏斗数据 */
export function getFunnelData(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<RecruitmentFunnelData>(getFunnelMock(params))
  }
  return request.get<RecruitmentFunnelData>({
    url: '/admin/recruitment/analytics/funnel',
    params
  })
}

/** 获取渠道效果分析 */
export function getChannelEffect(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<ChannelEffectRow[]>(getChannelEffectMock(params))
  }
  return request.get<ChannelEffectRow[]>({
    url: '/admin/recruitment/analytics/channel-effect',
    params
  })
}

/** 获取周期分析（Time-to-Fill / Time-to-Hire） */
export function getTimeToFillData(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<TimeToFillRow[]>(getTimeToFillMock(params))
  }
  return request.get<TimeToFillRow[]>({
    url: '/admin/recruitment/analytics/time-to-fill',
    params
  })
}

/** 获取面试官效率 */
export function getInterviewerEfficiency(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<InterviewerEfficiencyRow[]>(getInterviewerEfficiencyMock(params))
  }
  return request.get<InterviewerEfficiencyRow[]>({
    url: '/admin/recruitment/analytics/interviewer',
    params
  })
}

/** 获取需求完成率 */
export function getDemandCompletion(params: AnalyticsQueryParams = {}) {
  if (USE_MOCK) {
    return mockResolve<DemandCompletionRow[]>(getDemandCompletionMock(params))
  }
  return request.get<DemandCompletionRow[]>({
    url: '/admin/recruitment/analytics/demand-completion',
    params
  })
}

/** 导出招聘分析报表（Mock：返回提示文字） */
export function exportAnalyticsReport(params: AnalyticsExportParams) {
  if (USE_MOCK) {
    return mockResolve({ url: '', filename: `招聘分析_${params.module}.${params.format}` }, '导出成功')
  }
  return request.post({
    url: '/admin/recruitment/analytics/export',
    data: params
  })
}

/** 渠道成本记录 CRUD（独立模块） */
export const channelCostApi = createCrudApi<ChannelCostRecord>({
  baseUrl: '/admin/recruitment/analytics/channel-cost',
  mockFns: channelCostCrudMock
})
