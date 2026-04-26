import { AppRouteRecord } from '@/types/router'

export const positionRoutes: AppRouteRecord = {
  path: '/position',
  name: 'Position',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.position.title',
    icon: '&#xe88a;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'PositionList',
      component: () => import('@/views/position/index.vue'),
      meta: {
        title: 'menus.position.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'create/new',
      name: 'PositionCreate',
      component: () => import('@/views/position/create.vue'),
      meta: {
        title: 'menus.position.create',
        keepAlive: false,
        isHide: true,
        activePath: '/position'
      }
    },
    {
      path: 'edit/:id',
      name: 'PositionEdit',
      component: () => import('@/views/position/create.vue'),
      meta: {
        title: 'menus.position.edit',
        keepAlive: false,
        isHide: true,
        activePath: '/position'
      }
    }
  ]
}
