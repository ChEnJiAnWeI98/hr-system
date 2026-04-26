import type { AppRouteRecord } from '@/types/router'

/**
 * 05 社保公积金（V2.0 重构 Phase 6 · Batch A）
 *
 * 来源：从 04 薪酬福利拆出
 * 理由：对齐国内 HR SaaS 主流（北森/金蝶/用友/钉钉），五险一金独立法规体系独立成一级
 *
 * 菜单结构（5 个二级）：
 *   - 社保方案（insurance-config）
 *   - 公积金方案（provident-fund）
 *   - 员工参保（employee）
 *   - 月度计算（monthly，含申报导出 Drawer）
 *   - 统计分析（statistics）
 *
 * 组件复用：`views/social-security/*` 原目录保持不搬迁（对齐 Phase 4.x 决策）
 * 月度计算：新增包装页 `views/social/monthly/index.vue`（InsuranceBill + 申报导出 Drawer）
 */
export const socialRoutes: AppRouteRecord = {
  path: '/social',
  name: 'Social',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.social.title',
    icon: '&#xe7a9;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'insurance-config',
      name: 'SocialInsuranceConfig',
      component: () => import('@/views/social-security/insurance-config/index.vue'),
      meta: {
        title: 'menus.social.insuranceConfig',
        keepAlive: true,
        menuCode: 'social:insurance-config'
      }
    },
    {
      path: 'provident-fund',
      name: 'SocialProvidentFund',
      component: () => import('@/views/social-security/provident-fund/index.vue'),
      meta: {
        title: 'menus.social.providentFund',
        keepAlive: true,
        menuCode: 'social:provident-fund'
      }
    },
    {
      path: 'employee',
      name: 'SocialEmployee',
      component: () => import('@/views/social-security/employee-insurance/index.vue'),
      meta: {
        title: 'menus.social.employee',
        keepAlive: true,
        menuCode: 'social:employee'
      }
    },
    {
      path: 'monthly',
      name: 'SocialMonthly',
      component: () => import('@/views/social/monthly/index.vue'),
      meta: {
        title: 'menus.social.monthly',
        keepAlive: true,
        menuCode: 'social:monthly'
      }
    },
    {
      path: 'statistics',
      name: 'SocialStatistics',
      component: () => import('@/views/social-security/statistics/index.vue'),
      meta: {
        title: 'menus.social.statistics',
        keepAlive: true,
        menuCode: 'social:statistics'
      }
    }
  ]
}
