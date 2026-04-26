/**
 * 招聘配置 API
 * 统一封装 6 类配置的 CRUD（面试评价模板 / Offer 模板 / 通知模板 / 入职资料模板 / 招聘流程 / 渠道账号）
 */

import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  InterviewEvaluationTemplate,
  OfferTemplate,
  NotificationTemplate,
  OnboardingTemplate,
  RecruitmentProcessConfig,
  ChannelAccount
} from '@/types/recruitmentConfig'
import {
  interviewEvaluationTemplateMock,
  offerTemplateMock,
  notificationTemplateMock,
  onboardingTemplateMock,
  processConfigMock,
  channelAccountMock
} from '@/mock/recruitmentConfig'

// ============ 1. 面试评价模板 ============
export const interviewEvaluationTemplateApi = createCrudApi<InterviewEvaluationTemplate>({
  baseUrl: '/admin/recruitment/config/interview-template',
  mockFns: interviewEvaluationTemplateMock
})

// ============ 2. Offer 模板 ============
export const offerTemplateApi = createCrudApi<OfferTemplate>({
  baseUrl: '/admin/recruitment/config/offer-template',
  mockFns: offerTemplateMock
})

// ============ 3. 通知模板 ============
export const notificationTemplateApi = createCrudApi<NotificationTemplate>({
  baseUrl: '/admin/recruitment/config/notification-template',
  mockFns: notificationTemplateMock
})

// ============ 4. 入职资料模板 ============
export const onboardingTemplateApi = createCrudApi<OnboardingTemplate>({
  baseUrl: '/admin/recruitment/config/onboarding-template',
  mockFns: onboardingTemplateMock
})

// ============ 5. 招聘流程配置 ============
export const processConfigApi = createCrudApi<RecruitmentProcessConfig>({
  baseUrl: '/admin/recruitment/config/process',
  mockFns: processConfigMock
})

// ============ 6. 渠道账号 ============
export const channelAccountApi = createCrudApi<ChannelAccount>({
  baseUrl: '/admin/recruitment/config/channel-account',
  mockFns: channelAccountMock
})
