import type { AppRouteRecord } from '@/types/router'

/**
 * 工作台路由
 */
export const workspaceRoutes: AppRouteRecord = {
  path: '/workspace',
  name: 'Workspace',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.workspace.title',
    icon: '&#xe651;',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'WorkspacePage',
      component: () => import('@/views/workspace/index.vue'),
      meta: {
        title: 'menus.workspace.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'shortcut-config/new',
      name: 'WorkspaceShortcutConfig',
      component: () => import('@/views/workspace/shortcut-config.vue'),
      meta: {
        title: 'menus.workspace.shortcutConfig',
        keepAlive: false,
        isHide: true,
        activePath: '/workspace'
      }
    }
  ]
}
