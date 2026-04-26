import type { AppRouteRecord } from '@/types/router'

/**
 * 绩效管理路由
 */
export const performanceRoutes: AppRouteRecord = {
  path: '/performance',
  name: 'Performance',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.performance.title',
    icon: '&#xe721;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'PerformanceCycle',
      component: () => import('@/views/performance/cycle/index.vue'),
      meta: {
        title: 'menus.performance.cycle',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'goal/list',
      name: 'PerformanceGoal',
      component: () => import('@/views/performance/goal/index.vue'),
      meta: {
        title: 'menus.performance.goal',
        keepAlive: true,
        isHide: true,
        activePath: '/performance'
      }
    },
    {
      path: 'evaluation/list',
      name: 'PerformanceEvaluation',
      component: () => import('@/views/performance/evaluation/index.vue'),
      meta: {
        title: 'menus.performance.evaluation',
        keepAlive: true,
        isHide: true,
        activePath: '/performance'
      }
    },
    {
      path: 'calibration/list',
      name: 'PerformanceCalibration',
      component: () => import('@/views/performance/calibration/index.vue'),
      meta: {
        title: 'menus.performance.calibration',
        keepAlive: true,
        isHide: true,
        activePath: '/performance'
      }
    },
    {
      path: 'archive/list',
      name: 'PerformanceArchive',
      component: () => import('@/views/performance/archive/index.vue'),
      meta: {
        title: 'menus.performance.archive',
        keepAlive: true,
        isHide: true,
        activePath: '/performance'
      }
    }
  ]
}
