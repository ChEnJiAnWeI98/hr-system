import type { AppRouteRecord } from '@/types/router'

export const recruitmentRoutes: AppRouteRecord = {
  path: '/recruitment',
  name: 'Recruitment',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.recruitment.title',
    icon: '&#xe82e;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'RecruitmentDemand',
      component: () => import('@/views/recruitment/demand/index.vue'),
      meta: {
        title: 'menus.recruitment.demand',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'job/list',
      name: 'JobPosting',
      component: () => import('@/views/recruitment/job/index.vue'),
      meta: {
        title: 'menus.recruitment.job',
        keepAlive: true,
        activePath: '/recruitment'
      }
    },
    {
      path: 'resume/list',
      name: 'Resume',
      component: () => import('@/views/recruitment/resume/index.vue'),
      meta: {
        title: 'menus.recruitment.resume',
        keepAlive: true,
        activePath: '/recruitment'
      }
    },
    {
      path: 'interview/list',
      name: 'Interview',
      component: () => import('@/views/recruitment/interview/index.vue'),
      meta: {
        title: 'menus.recruitment.interview',
        keepAlive: true,
        activePath: '/recruitment'
      }
    },
    {
      path: 'offer/list',
      name: 'Offer',
      component: () => import('@/views/recruitment/offer/index.vue'),
      meta: {
        title: 'menus.recruitment.offer',
        keepAlive: true,
        activePath: '/recruitment'
      }
    },
    {
      path: 'onboarding/list',
      name: 'Onboarding',
      component: () => import('@/views/recruitment/onboarding/index.vue'),
      meta: {
        title: 'menus.recruitment.onboarding',
        keepAlive: true,
        activePath: '/recruitment'
      }
    }
  ]
}
