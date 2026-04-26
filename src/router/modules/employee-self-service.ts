import type { AppRouteRecord } from '@/types/router'

/**
 * 员工自助服务路由
 */
export const employeeSelfServiceRoutes: AppRouteRecord = {
  path: '/employee-self-service',
  name: 'EmployeeSelfService',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.employeeSelfService.title',
    icon: '&#xe608;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'profile',
      name: 'EmployeeSelfServiceProfile',
      component: () => import('@/views/employee-self-service/profile/index.vue'),
      meta: {
        title: 'menus.employeeSelfService.profile',
        keepAlive: true
      }
    },
    {
      path: 'payslip',
      name: 'EmployeePayslip',
      component: () => import('@/views/employee-self-service/payslip/index.vue'),
      meta: {
        title: 'menus.employeeSelfService.payslip',
        keepAlive: true
      }
    },
    {
      path: 'leave-balance',
      name: 'EmployeeLeaveBalance',
      component: () => import('@/views/employee-self-service/leave-balance/index.vue'),
      meta: {
        title: 'menus.employeeSelfService.leaveBalance',
        keepAlive: true
      }
    },
    {
      path: 'application',
      name: 'EmployeeApplication',
      component: () => import('@/views/employee-self-service/application/index.vue'),
      meta: {
        title: 'menus.employeeSelfService.application',
        keepAlive: true
      }
    },
    {
      path: 'todo-task',
      name: 'EmployeeTodoTask',
      component: () => import('@/views/employee-self-service/todo-task/index.vue'),
      meta: {
        title: 'menus.employeeSelfService.todoTask',
        keepAlive: true
      }
    }
  ]
}
