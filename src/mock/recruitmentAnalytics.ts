// @ts-nocheck
/**
 * 招聘数据分析 Mock
 * 基于 resume / interview / offer / onboarding / jobPosting / recruitmentDemand 现有数据聚合
 * 部分指标（周期/渠道/成本）不在原 mock 中，用固定演示数据
 */
import type {
  AnalyticsQueryParams,
  RecruitmentDashboardStats,
  RecruitmentFunnelData,
  ChannelEffectRow,
  ChannelCostRecord,
  TimeToFillRow,
  InterviewerEfficiencyRow,
  DemandCompletionRow
} from '@/types/recruitmentAnalytics'
import { createCrudMock } from '@/utils/crud/mockHelper'

/**
 * 招聘漏斗数据（固定演示数据 - 真实环境应从各业务模块聚合）
 */
export function getFunnelMock(_params: AnalyticsQueryParams = {}): RecruitmentFunnelData {
  return {
    resumeSubmitted: 850,
    resumeScreened: 460,
    interviewScheduled: 220,
    interviewPassed: 120,
    offerSent: 85,
    offerAccepted: 62,
    onboarded: 48
  }
}

/**
 * 驾驶舱核心指标
 */
export function getDashboardStatsMock(_params: AnalyticsQueryParams = {}): RecruitmentDashboardStats {
  return {
    activeDemandCount: 12,
    newDemandCount: 7,
    publishedJobCount: 15,
    newResumeCount: 420,
    interviewCount: 180,
    offerCount: 85,
    onboardedCount: 48,
    noShowCount: 6,
    noShowRate: 12.5,
    demandFillRate: 68.5,
    avgTimeToHire: 32,
    offerAcceptRate: 72.9
  }
}

/**
 * 渠道效果数据（固定演示）
 * 渠道：Boss直聘 / 猎聘 / 智联招聘 / 前程无忧 / 内推 / 拉勾网 / LinkedIn
 */
export function getChannelEffectMock(_params: AnalyticsQueryParams = {}): ChannelEffectRow[] {
  const rows: Omit<ChannelEffectRow, 'cph' | 'roi' | 'conversionRate'>[] = [
    { channel: 'Boss直聘', resumeCount: 320, interviewCount: 78, offerCount: 32, onboardedCount: 20, cost: 80000 },
    { channel: '猎聘', resumeCount: 180, interviewCount: 52, offerCount: 22, onboardedCount: 14, cost: 120000 },
    { channel: '智联招聘', resumeCount: 145, interviewCount: 36, offerCount: 14, onboardedCount: 8, cost: 45000 },
    { channel: '前程无忧', resumeCount: 110, interviewCount: 28, offerCount: 10, onboardedCount: 5, cost: 36000 },
    { channel: '内推', resumeCount: 62, interviewCount: 38, offerCount: 18, onboardedCount: 12, cost: 24000 },
    { channel: '拉勾网', resumeCount: 75, interviewCount: 18, offerCount: 6, onboardedCount: 3, cost: 18000 },
    { channel: 'LinkedIn', resumeCount: 38, interviewCount: 12, offerCount: 5, onboardedCount: 3, cost: 32000 }
  ]

  return rows.map((r) => ({
    ...r,
    cph: r.onboardedCount > 0 ? Math.round(r.cost / r.onboardedCount) : 0,
    roi: r.cost > 0 ? Number(((r.onboardedCount / r.cost) * 10000).toFixed(2)) : 0,
    conversionRate:
      r.resumeCount > 0 ? Number(((r.onboardedCount / r.resumeCount) * 100).toFixed(2)) : 0
  }))
}

/**
 * 周期分析数据（按岗位族）
 */
export function getTimeToFillMock(_params: AnalyticsQueryParams = {}): TimeToFillRow[] {
  return [
    { dimension: '技术研发', hireCount: 18, timeToFill: 28, timeToHire: 42, overtimeRate: 16.7 },
    { dimension: '产品设计', hireCount: 12, timeToFill: 22, timeToHire: 35, overtimeRate: 8.3 },
    { dimension: '运营市场', hireCount: 9, timeToFill: 18, timeToHire: 26, overtimeRate: 0 },
    { dimension: '职能支持', hireCount: 6, timeToFill: 15, timeToHire: 22, overtimeRate: 0 },
    { dimension: '管理岗位', hireCount: 3, timeToFill: 45, timeToHire: 68, overtimeRate: 33.3 }
  ]
}

/**
 * 面试官效率数据
 */
export function getInterviewerEfficiencyMock(_params: AnalyticsQueryParams = {}): InterviewerEfficiencyRow[] {
  return [
    { interviewer: '李经理', interviewCount: 32, passCount: 18, failCount: 12, passRate: 56.3, cancelCount: 2, avgRating: 4.1 },
    { interviewer: '王总监', interviewCount: 28, passCount: 15, failCount: 10, passRate: 53.6, cancelCount: 3, avgRating: 4.3 },
    { interviewer: '赵总', interviewCount: 18, passCount: 8, failCount: 8, passRate: 44.4, cancelCount: 2, avgRating: 3.8 },
    { interviewer: '陈主管', interviewCount: 24, passCount: 14, failCount: 9, passRate: 58.3, cancelCount: 1, avgRating: 4.0 },
    { interviewer: '周经理', interviewCount: 20, passCount: 11, failCount: 7, passRate: 55.0, cancelCount: 2, avgRating: 4.2 },
    { interviewer: '张架构', interviewCount: 16, passCount: 7, failCount: 8, passRate: 43.8, cancelCount: 1, avgRating: 3.9 }
  ]
}

/**
 * 需求完成率数据
 */
export function getDemandCompletionMock(_params: AnalyticsQueryParams = {}): DemandCompletionRow[] {
  return [
    { demandNo: 'RD202604001', positionName: '前端工程师', departmentName: '技术部', recruitCount: 2, onboardedCount: 2, fillRate: 100, daysElapsed: 26, status: '已完成' },
    { demandNo: 'RD202604002', positionName: 'Java后端工程师', departmentName: '技术部', recruitCount: 3, onboardedCount: 2, fillRate: 66.7, daysElapsed: 28, status: '进行中' },
    { demandNo: 'RD202604003', positionName: '产品经理', departmentName: '产品部', recruitCount: 1, onboardedCount: 1, fillRate: 100, daysElapsed: 20, status: '已完成' },
    { demandNo: 'RD202604004', positionName: 'UI设计师', departmentName: '设计部', recruitCount: 2, onboardedCount: 1, fillRate: 50, daysElapsed: 32, status: '进行中' },
    { demandNo: 'RD202604005', positionName: '测试工程师', departmentName: '技术部', recruitCount: 2, onboardedCount: 0, fillRate: 0, daysElapsed: 18, status: '招聘中' },
    { demandNo: 'RD202604006', positionName: '运营专员', departmentName: '运营部', recruitCount: 3, onboardedCount: 2, fillRate: 66.7, daysElapsed: 22, status: '进行中' },
    { demandNo: 'RD202604007', positionName: 'HRBP', departmentName: '人事部', recruitCount: 1, onboardedCount: 0, fillRate: 0, daysElapsed: 45, status: '超期' }
  ]
}

/**
 * 渠道成本记录 - 独立 CRUD mock
 */
const initialCostRecords: ChannelCostRecord[] = [
  { id: 1, channel: 'Boss直聘', month: '2026-01', amount: 25000, remark: '季度包', createTime: '2026-01-05 10:00:00', updateTime: '2026-01-05 10:00:00' },
  { id: 2, channel: 'Boss直聘', month: '2026-02', amount: 28000, remark: '', createTime: '2026-02-05 10:00:00', updateTime: '2026-02-05 10:00:00' },
  { id: 3, channel: 'Boss直聘', month: '2026-03', amount: 27000, remark: '', createTime: '2026-03-05 10:00:00', updateTime: '2026-03-05 10:00:00' },
  { id: 4, channel: '猎聘', month: '2026-01', amount: 40000, remark: '年度VIP', createTime: '2026-01-10 10:00:00', updateTime: '2026-01-10 10:00:00' },
  { id: 5, channel: '猎聘', month: '2026-02', amount: 40000, remark: '', createTime: '2026-02-10 10:00:00', updateTime: '2026-02-10 10:00:00' },
  { id: 6, channel: '猎聘', month: '2026-03', amount: 40000, remark: '', createTime: '2026-03-10 10:00:00', updateTime: '2026-03-10 10:00:00' },
  { id: 7, channel: '智联招聘', month: '2026-01', amount: 15000, remark: '', createTime: '2026-01-15 10:00:00', updateTime: '2026-01-15 10:00:00' },
  { id: 8, channel: '智联招聘', month: '2026-02', amount: 15000, remark: '', createTime: '2026-02-15 10:00:00', updateTime: '2026-02-15 10:00:00' },
  { id: 9, channel: '智联招聘', month: '2026-03', amount: 15000, remark: '', createTime: '2026-03-15 10:00:00', updateTime: '2026-03-15 10:00:00' },
  { id: 10, channel: '内推', month: '2026-01', amount: 8000, remark: '奖励发放', createTime: '2026-01-20 10:00:00', updateTime: '2026-01-20 10:00:00' },
  { id: 11, channel: '内推', month: '2026-02', amount: 8000, remark: '', createTime: '2026-02-20 10:00:00', updateTime: '2026-02-20 10:00:00' },
  { id: 12, channel: '内推', month: '2026-03', amount: 8000, remark: '', createTime: '2026-03-20 10:00:00', updateTime: '2026-03-20 10:00:00' },
  { id: 13, channel: 'LinkedIn', month: '2026-01', amount: 12000, remark: '', createTime: '2026-01-25 10:00:00', updateTime: '2026-01-25 10:00:00' },
  { id: 14, channel: 'LinkedIn', month: '2026-02', amount: 10000, remark: '', createTime: '2026-02-25 10:00:00', updateTime: '2026-02-25 10:00:00' },
  { id: 15, channel: 'LinkedIn', month: '2026-03', amount: 10000, remark: '', createTime: '2026-03-25 10:00:00', updateTime: '2026-03-25 10:00:00' }
]

export const channelCostCrudMock = createCrudMock<ChannelCostRecord>(initialCostRecords, {
  searchFields: ['channel', 'month', 'remark']
})
