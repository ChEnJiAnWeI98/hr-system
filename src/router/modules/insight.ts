import type { AppRouteRecord } from '@/types/router'

/**
 * 07 数据洞察（V2.0 重构 Phase 2）
 *
 * 合并自：
 *   - dataReport 全部迁入
 *   - performance-analytics 的 dashboard 迁入（人才盘点留在 perf）
 *   - performance-settings 的 AI 辅助中心迁入
 */
export const insightRoutes: AppRouteRecord = {
  path: '/insight',
  name: 'Insight',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.insight.title',
    icon: '&#xe812;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'dashboard',
      name: 'InsightDashboard',
      component: () => import('@/views/data-report/dashboard/index.vue'),
      meta: { title: 'menus.insight.dashboard', keepAlive: true, menuCode: 'insight:dashboard' }
    },
    {
      path: 'organization',
      name: 'InsightOrganization',
      component: () => import('@/views/data-report/personnel/index.vue'),
      meta: {
        title: 'menus.insight.organization',
        keepAlive: true,
        menuCode: 'insight:organization'
      }
    },
    {
      path: 'recruitment',
      name: 'InsightRecruitment',
      component: () => import('@/views/data-report/recruitment/index.vue'),
      meta: {
        title: 'menus.insight.recruitment',
        keepAlive: true,
        menuCode: 'insight:recruitment'
      }
    },
    {
      path: 'performance',
      name: 'InsightPerformance',
      component: () => import('@/views/performance/analytics/index.vue'),
      meta: {
        title: 'menus.insight.performance',
        keepAlive: true,
        menuCode: 'insight:performance'
      }
    },
    {
      path: 'compensation',
      name: 'InsightCompensation',
      component: () => import('@/views/data-report/salary/index.vue'),
      meta: {
        title: 'menus.insight.compensation',
        keepAlive: true,
        menuCode: 'insight:compensation'
      }
    },
    {
      path: 'attendance',
      name: 'InsightAttendance',
      component: () => import('@/views/data-report/attendance/index.vue'),
      meta: {
        title: 'menus.insight.attendance',
        keepAlive: true,
        menuCode: 'insight:attendance'
      }
    },
    {
      path: 'ai-assistant',
      name: 'InsightAIAssistant',
      component: () => import('@/views/performance/ai-assistant/index.vue'),
      meta: { title: 'menus.insight.ai', keepAlive: true, menuCode: 'insight:ai' }
    }
  ]
}
