import { AppRouteRecord } from '@/types/router'

/**
 * 组织管理路由
 */
export const organizationManagementRoutes: AppRouteRecord = {
  path: '/organization',
  name: 'Organization',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.organization.title',
    icon: '&#xe813;',
    isFirstLevel: true
  },
  children: [
    // 部门管理
    {
      path: 'department',
      name: 'DepartmentManagement',
      component: () => import('@/views/department/index.vue'),
      meta: {
        title: 'menus.organization.department',
        keepAlive: true
      }
    },
    {
      path: 'department/create/new',
      name: 'DepartmentCreate',
      component: () => import('@/views/department/create.vue'),
      meta: {
        title: 'menus.organization.departmentCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/organization/department'
      }
    },
    {
      path: 'department/edit/:id',
      name: 'DepartmentEdit',
      component: () => import('@/views/department/create.vue'),
      meta: {
        title: 'menus.organization.departmentEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/organization/department'
      }
    },
    // 岗位管理
    {
      path: 'position',
      name: 'PositionManagement',
      component: () => import('@/views/position/index.vue'),
      meta: {
        title: 'menus.organization.position',
        keepAlive: true
      }
    },
    {
      path: 'position/create/new',
      name: 'PositionCreate',
      component: () => import('@/views/position/create.vue'),
      meta: {
        title: 'menus.organization.positionCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/organization/position'
      }
    },
    {
      path: 'position/edit/:id',
      name: 'PositionEdit',
      component: () => import('@/views/position/create.vue'),
      meta: {
        title: 'menus.organization.positionEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/organization/position'
      }
    },
    // 编制管理
    {
      path: 'staffing',
      name: 'StaffingManagement',
      component: () => import('@/views/staffing/index.vue'),
      meta: {
        title: 'menus.organization.staffing',
        keepAlive: true
      }
    },
    {
      path: 'staffing/edit/:id',
      name: 'StaffingEdit',
      component: () => import('@/views/staffing/edit.vue'),
      meta: {
        title: 'menus.organization.staffingEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/organization/staffing'
      }
    },
    // 组织架构图
    {
      path: 'org-chart',
      name: 'OrgChartView',
      component: () => import('@/views/org-chart/index.vue'),
      meta: {
        title: 'menus.organization.orgChart',
        keepAlive: true
      }
    }
  ]
}
