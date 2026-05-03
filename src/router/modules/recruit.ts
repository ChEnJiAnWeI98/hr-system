import type { AppRouteRecord } from '@/types/router'

/**
 * 02 招聘与入职（V2.0 重构 Phase 2）
 *
 * 合并自：recruitment + recruitment-ops + recruitment-settings（+ talent-experience 砍掉）
 *
 * Views 暂保留在 `views/recruitment/` 下（Phase 2.2 不搬目录，只改路由引用）
 */
export const recruitRoutes: AppRouteRecord = {
  path: '/recruit',
  name: 'Recruit',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.recruit.title',
    icon: '&#xe82e;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'demand',
      name: 'RecruitDemand',
      component: () => import('@/views/recruitment/demand/index.vue'),
      meta: { title: 'menus.recruit.demand', keepAlive: true, menuCode: 'recruit:demand' }
    },
    {
      path: 'demand-pool',
      name: 'RecruitDemandPool',
      component: () => import('@/views/recruitment/demand-pool/index.vue'),
      meta: {
        title: 'menus.recruit.demandPool',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/demand'
      }
    },
    {
      path: 'demand-completion',
      name: 'RecruitDemandCompletion',
      component: () => import('@/views/recruitment/demand-completion/index.vue'),
      meta: {
        title: 'menus.recruit.demandCompletion',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/demand'
      }
    },
    {
      path: 'job',
      name: 'RecruitJob',
      component: () => import('@/views/recruitment/job/index.vue'),
      meta: { title: 'menus.recruit.job', keepAlive: true, menuCode: 'recruit:job' }
    },
    {
      path: 'resume',
      name: 'RecruitResume',
      component: () => import('@/views/recruitment/resume/index.vue'),
      meta: { title: 'menus.recruit.resume', keepAlive: true, menuCode: 'recruit:resume' }
    },
    {
      path: 'ai-matching',
      name: 'RecruitAIMatching',
      component: () => import('@/views/recruitment/ai-matching/index.vue'),
      meta: {
        title: 'menus.recruit.aiMatching',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/resume'
      }
    },
    {
      path: 'resume/detail/:id',
      name: 'RecruitResumeDetail',
      component: () => import('@/views/recruitment/resume/detail.vue'),
      meta: {
        title: 'menus.recruit.resumeDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/recruit/resume'
      }
    },
    {
      path: 'interview',
      name: 'RecruitInterview',
      component: () => import('@/views/recruitment/interview/index.vue'),
      meta: { title: 'menus.recruit.interview', keepAlive: true, menuCode: 'recruit:interview' }
    },
    {
      path: 'interview-stats',
      name: 'RecruitInterviewStats',
      component: () => import('@/views/recruitment/interview-stats/index.vue'),
      meta: {
        title: 'menus.recruit.interviewStats',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/interview',
        menuCode: 'recruit:interview'
      }
    },
    {
      path: 'offer',
      name: 'RecruitOffer',
      component: () => import('@/views/recruitment/offer/index.vue'),
      meta: { title: 'menus.recruit.offer', keepAlive: true, menuCode: 'recruit:offer' }
    },
    {
      path: 'onboarding',
      name: 'RecruitOnboarding',
      component: () => import('@/views/recruitment/onboarding/index.vue'),
      meta: { title: 'menus.recruit.onboarding', keepAlive: true, menuCode: 'recruit:onboarding' }
    },
    // 招聘运营（Phase 2.2 会做 Tab 融合，当前暂时展开各子页）
    {
      path: 'ops-background-check',
      name: 'RecruitOpsBackgroundCheck',
      component: () => import('@/views/recruitment/background-check/index.vue'),
      meta: {
        title: 'menus.recruit.backgroundCheck',
        keepAlive: true,
        menuCode: 'recruit:ops'
      }
    },
    {
      path: 'background-check-package',
      name: 'RecruitBackgroundCheckPackage',
      component: () => import('@/views/recruitment/background-check/index.vue'),
      meta: {
        title: 'menus.recruit.backgroundCheckPackage',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/ops-background-check',
        menuCode: 'recruit:ops'
      }
    },
    {
      path: 'background-check-cost',
      name: 'RecruitBackgroundCheckCost',
      component: () => import('@/views/recruitment/background-check/index.vue'),
      meta: {
        title: 'menus.recruit.backgroundCheckCost',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/ops-background-check',
        menuCode: 'recruit:ops'
      }
    },
    {
      path: 'settings-automation',
      name: 'RecruitSettingsAutomation',
      component: () => import('@/views/recruitment/automation/index.vue'),
      meta: {
        title: 'menus.recruit.automation',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/settings-config',
        menuCode: 'recruit:settings'
      }
    },
    {
      path: 'ops-budget',
      name: 'RecruitOpsBudget',
      component: () => import('@/views/recruitment/budget/index.vue'),
      meta: { title: 'menus.recruit.budget', keepAlive: true, menuCode: 'recruit:ops' }
    },
    {
      path: 'ops-talent-pool',
      name: 'RecruitOpsTalentPool',
      component: () => import('@/views/recruitment/talent-pool/index.vue'),
      meta: { title: 'menus.recruit.talentPool', keepAlive: true, menuCode: 'recruit:ops' }
    },
    {
      path: 'settings-referral-rules',
      name: 'RecruitSettingsReferralRules',
      component: () => import('@/views/recruitment/referral-rules/index.vue'),
      meta: {
        title: 'menus.recruit.referralRule',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/settings-config',
        menuCode: 'recruit:settings'
      }
    },
    {
      path: 'ops-nps',
      name: 'RecruitOpsNps',
      component: () => import('@/views/recruitment/nps/index.vue'),
      meta: { title: 'menus.recruit.nps', keepAlive: true, menuCode: 'recruit:ops' }
    },
    {
      path: 'ops-analytics',
      name: 'RecruitOpsAnalytics',
      component: () => import('@/views/recruitment/analytics/index.vue'),
      meta: { title: 'menus.recruit.analytics', keepAlive: true, menuCode: 'recruit:ops' }
    },
    // 招聘配置
    {
      path: 'settings-config',
      name: 'RecruitSettingsConfig',
      component: () => import('@/views/recruitment/config/index.vue'),
      meta: { title: 'menus.recruit.config', keepAlive: true, menuCode: 'recruit:settings' }
    },
    {
      path: 'settings-integrations',
      name: 'RecruitSettingsIntegrations',
      component: () => import('@/views/recruitment/integrations/index.vue'),
      meta: {
        title: 'menus.recruit.integrations',
        keepAlive: true,
        isHide: true,
        activePath: '/recruit/settings-config'
      }
    }
  ]
}
