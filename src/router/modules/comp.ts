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
    // 个税管理（拆为 3 个独立路由 + ModuleTabBar）
    {
      path: 'tax-bracket',
      name: 'CompTaxBracket',
      component: () => import('@/views/comp/tax-bracket/index.vue'),
      meta: { title: 'menus.comp.tax', keepAlive: true, menuCode: 'comp:tax' }
    },
    {
      path: 'tax-deduction',
      name: 'CompTaxDeduction',
      component: () => import('@/views/comp/tax-deduction/index.vue'),
      meta: {
        title: 'menus.comp.taxDeduction',
        keepAlive: true,
        isHide: true,
        activePath: '/comp/tax-bracket',
        menuCode: 'comp:tax'
      }
    },
    {
      path: 'tax-settlement',
      name: 'CompTaxSettlement',
      component: () => import('@/views/comp/tax-settlement/index.vue'),
      meta: {
        title: 'menus.comp.taxSettlement',
        keepAlive: true,
        isHide: true,
        activePath: '/comp/tax-bracket',
        menuCode: 'comp:tax'
      }
    },
    // 福利管理（拆为 2 个独立路由 + ModuleTabBar）
    {
      path: 'welfare-program',
      name: 'CompWelfareProgram',
      component: () => import('@/views/comp/welfare-program/index.vue'),
      meta: { title: 'menus.comp.welfare', keepAlive: true, menuCode: 'comp:welfare' }
    },
    {
      path: 'welfare-grant',
      name: 'CompWelfareGrant',
      component: () => import('@/views/comp/welfare-grant/index.vue'),
      meta: {
        title: 'menus.comp.welfareGrant',
        keepAlive: true,
        isHide: true,
        activePath: '/comp/welfare-program',
        menuCode: 'comp:welfare'
      }
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
