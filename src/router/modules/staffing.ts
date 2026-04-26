import { AppRouteRecord } from '@/types/router'

export const staffingRoutes: AppRouteRecord = {
  path: '/staffing',
  name: 'Staffing',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.staffing.title',
    icon: '&#xe88a;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'StaffingList',
      component: () => import('@/views/staffing/index.vue'),
      meta: {
        title: 'menus.staffing.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'edit/:id',
      name: 'StaffingEdit',
      component: () => import('@/views/staffing/edit.vue'),
      meta: {
        title: 'menus.staffing.edit',
        keepAlive: false,
        isHide: true,
        activePath: '/staffing'
      }
    }
  ]
}
