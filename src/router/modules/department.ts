import { AppRouteRecord } from '@/types/router'

export const departmentRoutes: AppRouteRecord = {
  path: '/department',
  name: 'Department',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.department.title',
    icon: '&#xe813;',
    isFirstLevel: true
  },
  redirect: '/department/list',
  children: [
    {
      path: '',
      name: 'DepartmentIndex',
      component: () => import('@/views/department/index.vue'),
      meta: {
        title: 'menus.department.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'list',
      name: 'DepartmentList',
      component: () => import('@/views/department/index.vue'),
      meta: {
        title: 'menus.department.title',
        keepAlive: true
      }
    },
    {
      path: 'create/new',
      name: 'DepartmentCreate',
      component: () => import('@/views/department/create.vue'),
      meta: {
        title: 'menus.department.create',
        keepAlive: false,
        isHide: true,
        activePath: '/department/list'
      }
    },
    {
      path: 'edit/:id',
      name: 'DepartmentEdit',
      component: () => import('@/views/department/create.vue'),
      meta: {
        title: 'menus.department.edit',
        keepAlive: false,
        isHide: true,
        activePath: '/department/list'
      }
    }
  ]
}
