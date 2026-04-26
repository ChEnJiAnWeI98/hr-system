import type { AppRouteRecord } from '@/types/router'

export const contractRoutes: AppRouteRecord = {
  path: '/contract',
  name: 'Contract',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.contract.title',
    icon: '&#xe7ae;',
    isFirstLevel: true
  },
  children: [
    // 合同列表（二级菜单）
    {
      path: 'list',
      name: 'ContractList',
      component: () => import('@/views/contract/list/index.vue'),
      meta: {
        title: 'menus.contract.list',
        keepAlive: true
      }
    },
    {
      path: 'list/create/new',
      name: 'ContractCreate',
      component: () => import('@/views/contract/list/create.vue'),
      meta: {
        title: 'menus.contract.create',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/edit/:id',
      name: 'ContractEdit',
      component: () => import('@/views/contract/list/create.vue'),
      meta: {
        title: 'menus.contract.edit',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/detail/:id',
      name: 'ContractDetail',
      component: () => import('@/views/contract/list/detail.vue'),
      meta: {
        title: 'menus.contract.detail',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/approve/:id',
      name: 'ContractApprove',
      component: () => import('@/views/contract/list/approve.vue'),
      meta: {
        title: 'menus.contract.approve',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/sign/:id',
      name: 'ContractSign',
      component: () => import('@/views/contract/list/sign.vue'),
      meta: {
        title: 'menus.contract.sign',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/renew/:id',
      name: 'ContractRenew',
      component: () => import('@/views/contract/list/renew.vue'),
      meta: {
        title: 'menus.contract.renew',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/change/:id',
      name: 'ContractChange',
      component: () => import('@/views/contract/list/change.vue'),
      meta: {
        title: 'menus.contract.change',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    {
      path: 'list/terminate/:id',
      name: 'ContractTerminate',
      component: () => import('@/views/contract/list/terminate.vue'),
      meta: {
        title: 'menus.contract.terminate',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/list'
      }
    },
    // 合同模板（二级菜单）
    {
      path: 'template',
      name: 'ContractTemplate',
      component: () => import('@/views/contract/template/index.vue'),
      meta: {
        title: 'menus.contract.template.title',
        keepAlive: true
      }
    },
    {
      path: 'template/create/new',
      name: 'ContractTemplateCreate',
      component: () => import('@/views/contract/template/create.vue'),
      meta: {
        title: 'menus.contract.template.create',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/template'
      }
    },
    {
      path: 'template/edit/:id',
      name: 'ContractTemplateEdit',
      component: () => import('@/views/contract/template/create.vue'),
      meta: {
        title: 'menus.contract.template.edit',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/template'
      }
    },
    {
      path: 'template/detail/:id',
      name: 'ContractTemplateDetail',
      component: () => import('@/views/contract/template/detail.vue'),
      meta: {
        title: 'menus.contract.template.detail',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/template'
      }
    },
    {
      path: 'template/versions/:id',
      name: 'ContractTemplateVersions',
      component: () => import('@/views/contract/template/versions.vue'),
      meta: {
        title: 'menus.contract.template.version',
        keepAlive: false,
        isHide: true,
        activePath: '/contract/template'
      }
    },
    // 合同归档（二级菜单）
    {
      path: 'archive',
      name: 'ContractArchive',
      component: () => import('@/views/contract/archive/index.vue'),
      meta: {
        title: 'menus.contract.archive.title',
        keepAlive: true
      }
    },
    // 合同统计（二级菜单）
    {
      path: 'statistics',
      name: 'ContractStatistics',
      component: () => import('@/views/contract/statistics/index.vue'),
      meta: {
        title: 'menus.contract.statistics.title',
        keepAlive: true
      }
    }
  ]
}
