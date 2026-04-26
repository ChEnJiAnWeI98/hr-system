import type { AppRouteRecord } from '@/types/router'

/**
 * 审批流引擎路由
 */
export const approvalEngineRoutes: AppRouteRecord = {
  path: '/approval-engine',
  name: 'ApprovalEngine',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.approvalEngine.title',
    icon: '&#xe6cf;',
    isFirstLevel: true
  },
  children: [
    // 流程模板
    {
      path: 'template',
      name: 'ApprovalTemplateList',
      component: () => import('@/views/approval-engine/template/index.vue'),
      meta: {
        title: 'menus.approvalEngine.template',
        keepAlive: true
      }
    },
    {
      path: 'template/designer/:id?',
      name: 'ApprovalTemplateDesigner',
      component: () => import('@/views/approval-engine/template/designer.vue'),
      meta: {
        title: 'menus.approvalEngine.templateDesigner',
        keepAlive: false,
        isHide: true,
        activePath: '/approval-engine/template'
      }
    },
    // 审批实例
    {
      path: 'instance',
      name: 'ApprovalInstanceList',
      component: () => import('@/views/approval-engine/instance/index.vue'),
      meta: {
        title: 'menus.approvalEngine.instance',
        keepAlive: true
      }
    },
    {
      path: 'instance/detail/:id',
      name: 'ApprovalInstanceDetail',
      component: () => import('@/views/approval-engine/instance/detail.vue'),
      meta: {
        title: 'menus.approvalEngine.instanceDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/approval-engine/instance'
      }
    },
    // 待办审批
    {
      path: 'todo',
      name: 'ApprovalTodoList',
      component: () => import('@/views/approval-engine/todo/index.vue'),
      meta: {
        title: 'menus.approvalEngine.todo',
        keepAlive: true
      }
    },
    // 代理设置
    {
      path: 'delegate',
      name: 'ApprovalDelegateList',
      component: () => import('@/views/approval-engine/delegate/index.vue'),
      meta: {
        title: 'menus.approvalEngine.delegate',
        keepAlive: true
      }
    },
    // 统计分析
    {
      path: 'statistics',
      name: 'ApprovalStatistics',
      component: () => import('@/views/approval-engine/statistics/index.vue'),
      meta: {
        title: 'menus.approvalEngine.statistics',
        keepAlive: true
      }
    }
  ]
}
