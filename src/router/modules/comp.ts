import type { AppRouteRecord } from '@/types/router'

/**
 * 04 薪酬管理（V2.0 重构 Phase 6 · Batch A 拆出社保后）
 *
 * Phase 2 合并自：salary + social-security
 * Phase 6 · Batch A：社保拆出为独立一级 `/social`
 *
 * Views 保留在 `views/salary/`（Phase 2.6 不搬目录）
 */
export const compRoutes: AppRouteRecord = {
  path: '/comp',
  name: 'Comp',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.comp.title',
    icon: '&#xe6ff;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'structure',
      name: 'CompStructure',
      component: () => import('@/views/comp/structure/index.vue'),
      meta: { title: 'menus.comp.structure', keepAlive: true, menuCode: 'comp:structure' }
    },
    {
      path: 'payroll',
      name: 'CompPayroll',
      component: () => import('@/views/comp/payroll/index.vue'),
      meta: { title: 'menus.comp.payroll', keepAlive: true, menuCode: 'comp:payroll' }
    },
    {
      path: 'payslip',
      name: 'CompPayslip',
      component: () => import('@/views/comp/payslip/index.vue'),
      meta: { title: 'menus.comp.payslip', keepAlive: true, menuCode: 'comp:payslip' }
    },
    {
      path: 'tax',
      name: 'CompTax',
      component: () => import('@/views/comp/tax/index.vue'),
      meta: { title: 'menus.comp.tax', keepAlive: true, menuCode: 'comp:tax' }
    },
    {
      path: 'welfare',
      name: 'CompWelfare',
      component: () => import('@/views/comp/welfare/index.vue'),
      meta: { title: 'menus.comp.welfare', keepAlive: true, menuCode: 'comp:welfare' }
    },
    {
      path: 'report',
      name: 'CompReport',
      component: () => import('@/views/comp/report/index.vue'),
      meta: { title: 'menus.comp.report', keepAlive: true, menuCode: 'comp:report' }
    },
    {
      path: 'adjustment',
      name: 'CompAdjustment',
      component: () => import('@/views/comp/adjustment/index.vue'),
      meta: { title: 'menus.comp.adjustment', keepAlive: true, menuCode: 'comp:adjustment' }
    }
  ]
}
