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
        keepAlive: true,
        menuCode: 'system:user'
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
        keepAlive: true,
        menuCode: 'system:role'
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
        keepAlive: true,
        menuCode: 'system:dictionary'
      }
    },
    {
      path: 'data-permission',
      name: 'SystemDataPermission',
      component: () => import('@/views/system/data-permission/index.vue'),
      meta: {
        title: 'menus.system.dataPermission',
        keepAlive: true,
        menuCode: 'system:data-permission'
      }
    },
    // 审批流（从原 approval-engine 降级）
    {
      path: 'approval-template',
      name: 'SystemApprovalTemplate',
      component: () => import('@/views/approval-engine/template/index.vue'),
      meta: {
        title: 'menus.system.approvalTemplate',
        keepAlive: true,
        menuCode: 'system:approval'
      }
    },
    {
      path: 'approval-template/designer/:id?',
      name: 'SystemApprovalTemplateDesigner',
      component: () => import('@/views/approval-engine/template/designer.vue'),
      meta: {
        title: 'menus.system.approvalDesigner',
        keepAlive: false,
        isHide: true,
        activePath: '/system/approval-template'
      }
    },
    {
      path: 'approval-instance',
      name: 'SystemApprovalInstance',
      component: () => import('@/views/approval-engine/instance/index.vue'),
      meta: {
        title: 'menus.system.approvalInstance',
        keepAlive: true,
        menuCode: 'system:approval'
      }
    },
    {
      path: 'approval-instance/detail/:id',
      name: 'SystemApprovalInstanceDetail',
      component: () => import('@/views/approval-engine/instance/detail.vue'),
      meta: {
        title: 'menus.system.approvalInstanceDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/system/approval-instance'
      }
    },
    {
      path: 'approval-todo',
      name: 'SystemApprovalTodo',
      component: () => import('@/views/approval-engine/todo/index.vue'),
      meta: {
        title: 'menus.system.approvalTodo',
        keepAlive: true,
        menuCode: 'system:approval'
      }
    },
    {
      path: 'approval-delegate',
      name: 'SystemApprovalDelegate',
      component: () => import('@/views/approval-engine/delegate/index.vue'),
      meta: {
        title: 'menus.system.approvalDelegate',
        keepAlive: true,
        menuCode: 'system:approval'
      }
    },
    {
      path: 'approval-statistics',
      name: 'SystemApprovalStatistics',
      component: () => import('@/views/approval-engine/statistics/index.vue'),
      meta: {
        title: 'menus.system.approvalStatistics',
        keepAlive: true,
        menuCode: 'system:approval'
      }
    },
    {
      path: 'operation-log',
      name: 'SystemOperationLog',
      component: () => import('@/views/system/operation-log/index.vue'),
      meta: {
        title: 'menus.system.operationLog',
        keepAlive: true,
        menuCode: 'system:log'
      }
    },
    {
      path: 'field-change-log',
      name: 'SystemFieldChangeLog',
      component: () => import('@/views/system/field-change-log/index.vue'),
      meta: {
        title: 'menus.system.fieldChangeLog',
        keepAlive: true,
        menuCode: 'system:field-change-log'
      }
    },
    {
      path: 'notification',
      name: 'SystemNotification',
      component: () => import('@/views/system/notification/index.vue'),
      meta: {
        title: 'menus.system.notification',
        keepAlive: true,
        menuCode: 'system:notification'
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
