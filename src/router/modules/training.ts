import type { AppRouteRecord } from '@/types/router'

/**
 * 培训管理路由
 */
export const trainingRoutes: AppRouteRecord = {
  path: '/training',
  name: 'Training',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.training.title',
    icon: '&#xe73e;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'TrainingPlan',
      component: () => import('@/views/training/plan/index.vue'),
      meta: {
        title: 'menus.training.plan',
        keepAlive: true,
        isHide: true
      }
    }
  ]
}
