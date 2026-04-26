import type { AppRouteRecord } from '@/types/router'

/**
 * 02 员工管理（从原 hrm 拆分）
 * 包含：员工档案 / 人员异动 / 离职管理 / 试用期管理
 */
export const employeeRoutes: AppRouteRecord = {
  path: '/employee',
  name: 'Employee',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.employee.title',
    icon: '&#xe712;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'profile',
      name: 'EmployeeProfile',
      component: () => import('@/views/employee/profile/index.vue'),
      meta: {
        title: 'menus.employee.profile',
        keepAlive: true,
        menuCode: 'employee:profile'
      }
    },
    {
      path: 'profile/detail/:id',
      name: 'EmployeeProfileDetail',
      component: () => import('@/views/employee/profile/detail.vue'),
      meta: {
        title: 'menus.employee.profileDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/profile'
      }
    },
    {
      path: 'profile/edit/:id',
      name: 'EmployeeProfileEdit',
      component: () => import('@/views/employee/profile/detail.vue'),
      meta: {
        title: 'menus.employee.profileEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/profile'
      }
    },
    {
      path: 'transfer',
      name: 'EmployeeTransfer',
      component: () => import('@/views/employee/transfer/index.vue'),
      meta: {
        title: 'menus.employee.transfer',
        keepAlive: true,
        menuCode: 'employee:transfer'
      }
    },
    {
      path: 'offboarding',
      name: 'EmployeeOffboarding',
      component: () => import('@/views/employee/offboarding/index.vue'),
      meta: {
        title: 'menus.employee.offboarding',
        keepAlive: true,
        menuCode: 'employee:offboarding'
      }
    },
    {
      path: 'probation',
      name: 'EmployeeProbation',
      component: () => import('@/views/employee/probation/index.vue'),
      meta: {
        title: 'menus.employee.probation',
        keepAlive: true,
        menuCode: 'employee:probation'
      }
    },
    {
      path: 'probation/create/new',
      name: 'EmployeeProbationCreate',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/edit/:id',
      name: 'EmployeeProbationEdit',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/evaluate/:id',
      name: 'EmployeeProbationEvaluate',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEvaluate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/extend/:id',
      name: 'EmployeeProbationExtend',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationExtend',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/evaluation/detail/:id',
      name: 'EmployeeProbationEvaluationDetail',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEvaluationDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/extension/detail/:id',
      name: 'EmployeeProbationExtensionDetail',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationExtensionDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    }
  ]
}
