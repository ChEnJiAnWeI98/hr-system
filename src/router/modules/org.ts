import type { AppRouteRecord } from '@/types/router'

/**
 * 01 组织管理（从原 hrm 拆分）
 * 包含：组织架构 / 岗位体系 / 编制管理
 */
export const orgRoutes: AppRouteRecord = {
  path: '/org',
  name: 'Org',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.org.title',
    icon: '&#xe724;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'organization',
      name: 'OrgOrganization',
      component: () => import('@/views/org/organization/index.vue'),
      meta: {
        title: 'menus.org.organization',
        keepAlive: true,
        menuCode: 'org:organization'
      }
    },
    {
      path: 'position',
      name: 'OrgPosition',
      component: () => import('@/views/org/position/index.vue'),
      meta: {
        title: 'menus.org.position',
        keepAlive: true,
        menuCode: 'org:position'
      }
    },
    {
      path: 'headcount',
      name: 'OrgHeadcount',
      component: () => import('@/views/org/headcount/index.vue'),
      meta: {
        title: 'menus.org.headcount',
        keepAlive: true,
        menuCode: 'org:headcount'
      }
    }
  ]
}
