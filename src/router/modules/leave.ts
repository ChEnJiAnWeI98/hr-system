import type { AppRouteRecord } from '@/types/router'

/**
 * 假勤管理路由
 */
export const leaveRoutes: AppRouteRecord = {
  path: '/leave',
  name: 'Leave',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.leave.title',
    icon: '&#xe751;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'config',
      name: 'LeaveConfig',
      component: () => import('@/views/leave/config/index.vue'),
      meta: {
        title: 'menus.leave.config',
        keepAlive: true
      }
    },
    {
      path: 'quota',
      name: 'LeaveQuota',
      component: () => import('@/views/leave/quota/index.vue'),
      meta: {
        title: 'menus.leave.quota',
        keepAlive: true
      }
    },
    {
      path: 'application',
      name: 'LeaveApplication',
      component: () => import('@/views/leave/application/index.vue'),
      meta: {
        title: 'menus.leave.application',
        keepAlive: true
      }
    },
    {
      path: 'time-off',
      name: 'LeaveTimeOff',
      component: () => import('@/views/leave/time-off/index.vue'),
      meta: {
        title: 'menus.leave.timeOff',
        keepAlive: true
      }
    },
    {
      path: 'ledger',
      name: 'LeaveLedger',
      component: () => import('@/views/leave/ledger/index.vue'),
      meta: {
        title: 'menus.leave.ledger',
        keepAlive: true
      }
    }
  ]
}
