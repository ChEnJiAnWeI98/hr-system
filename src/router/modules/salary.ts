import type { AppRouteRecord } from '@/types/router'

/**
 * 薪酬管理路由
 */
export const salaryRoutes: AppRouteRecord = {
  path: '/salary',
  name: 'Salary',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.salary.title',
    icon: '&#xe6ff;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'structure',
      name: 'SalaryStructure',
      component: () => import('@/views/salary/structure/index.vue'),
      meta: {
        title: 'menus.salary.structure',
        keepAlive: true
      }
    },
    {
      path: 'calculation',
      name: 'SalaryCalculation',
      component: () => import('@/views/salary/calculation/index.vue'),
      meta: {
        title: 'menus.salary.calculation',
        keepAlive: true
      }
    },
    {
      path: 'payslip',
      name: 'SalaryPayslip',
      component: () => import('@/views/salary/payslip/index.vue'),
      meta: {
        title: 'menus.salary.payslip',
        keepAlive: true
      }
    },
    {
      path: 'tax',
      name: 'SalaryTax',
      component: () => import('@/views/salary/tax/index.vue'),
      meta: {
        title: 'menus.salary.tax',
        keepAlive: true
      }
    },
    {
      path: 'adjustment',
      name: 'SalaryAdjustment',
      component: () => import('@/views/salary/adjustment/index.vue'),
      meta: {
        title: 'menus.salary.adjustment',
        keepAlive: true
      }
    }
  ]
}
