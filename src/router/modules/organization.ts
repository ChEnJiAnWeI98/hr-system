import type { AppRouteRecord } from '@/types/router'

/**
 * 组织架构图路由
 */
export const organizationRoutes: AppRouteRecord = {
  path: '/org-chart',
  name: 'OrgChart',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.orgChart.title',
    icon: '&#xe724;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'OrgChartView',
      component: () => import('@/views/org-chart/index.vue'),
      meta: {
        title: 'menus.orgChart.title',
        keepAlive: true,
        isHide: true
      }
    }
  ]
}
