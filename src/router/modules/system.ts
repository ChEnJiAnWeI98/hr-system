import type { AppRouteRecord } from '@/types/router'

/**
 * 系统管理路由
 */
export const systemRoutes: AppRouteRecord = {
  path: '/system',
  name: 'System',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.system.title',
    icon: '&#xe72b;',
    isFirstLevel: true
  },
  children: [
    // 用户账号管理
    {
      path: 'user-account',
      name: 'SystemUserAccount',
      component: () => import('@/views/system/user-account/index.vue'),
      meta: {
        title: 'menus.system.userAccount',
        keepAlive: true
      }
    },
    {
      path: 'user-account/create/new',
      name: 'SystemUserAccountCreate',
      component: () => import('@/views/system/user-account/create.vue'),
      meta: {
        title: 'menus.system.userAccountCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/system/user-account'
      }
    },
    {
      path: 'user-account/edit/:id',
      name: 'SystemUserAccountEdit',
      component: () => import('@/views/system/user-account/create.vue'),
      meta: {
        title: 'menus.system.userAccountEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/system/user-account'
      }
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: 'menus.system.role',
        keepAlive: true
      }
    },
    {
      path: 'role/create/new',
      name: 'SystemRoleCreate',
      component: () => import('@/views/system/role/create.vue'),
      meta: {
        title: 'menus.system.roleCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/system/role'
      }
    },
    {
      path: 'role/edit/:id',
      name: 'SystemRoleEdit',
      component: () => import('@/views/system/role/create.vue'),
      meta: {
        title: 'menus.system.roleEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/system/role'
      }
    },
    {
      path: 'role/permission/:id',
      name: 'SystemRolePermission',
      component: () => import('@/views/system/role/permission.vue'),
      meta: {
        title: 'menus.system.rolePermission',
        keepAlive: false,
        isHide: true,
        activePath: '/system/role'
      }
    },
    {
      path: 'dictionary',
      name: 'SystemDictionary',
      component: () => import('@/views/system/dictionary/index.vue'),
      meta: {
        title: 'menus.system.dictionary',
        keepAlive: true
      }
    },
    {
      path: 'operation-log',
      name: 'SystemOperationLog',
      component: () => import('@/views/system/operation-log/index.vue'),
      meta: {
        title: 'menus.system.operationLog',
        keepAlive: true
      }
    },
    {
      path: 'notification',
      name: 'SystemNotification',
      component: () => import('@/views/system/notification/index.vue'),
      meta: {
        title: 'menus.system.notification',
        keepAlive: true
      }
    },
    {
      path: 'param',
      name: 'SystemParam',
      component: () => import('@/views/system/param/index.vue'),
      meta: {
        title: 'menus.system.param',
        keepAlive: true
      }
    }
  ]
}
