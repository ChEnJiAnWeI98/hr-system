import type { AppRouteRecord } from '@/types/router'

/**
 * 06 绩效管理（V2.0 重构 Phase 2 · Phase 6 Batch B 拆出人才盘点后）
 *
 * 合并自：performance + performance-feedback + performance-analytics + performance-settings
 *
 * 跨模块迁移：
 *   - 能力模型 → 07 人才发展（talent/competency，Phase 6 Batch B）
 *   - 人才盘点 → 07 人才发展（talent/review，Phase 6 Batch B）
 *   - AI 辅助中心 → 09 数据洞察（insight/ai-assistant）
 *   - 绩效分析看板 → 09 数据洞察（insight/performance）
 *
 * 保留 Tab 融合（复用 _shared/ModuleTabBar）：
 *   - 目标管理 ⇌ 目标对齐
 *   - 绩效评估 ⇌ 360 度评估
 *   - 持续反馈（内部 Tab: 1on1 + 徽章）
 *   - 绩效配置（内部 Tab: 模板 + 应用规则 + 任务中心）
 */
export const perfRoutes: AppRouteRecord = {
  path: '/perf',
  name: 'Perf',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.perf.title',
    icon: '&#xe721;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'cycle',
      name: 'PerfCycle',
      component: () => import('@/views/performance/cycle/index.vue'),
      meta: { title: 'menus.perf.cycle', keepAlive: true, menuCode: 'perf:cycle' }
    },
    {
      path: 'goal',
      name: 'PerfGoal',
      component: () => import('@/views/performance/goal/index.vue'),
      meta: { title: 'menus.perf.goal', keepAlive: true, menuCode: 'perf:goal' }
    },
    {
      path: 'goal-alignment/x',
      name: 'PerfGoalAlignment',
      component: () => import('@/views/performance/goal-alignment/index.vue'),
      meta: {
        title: 'menus.perf.goalAlignment',
        keepAlive: true,
        isHide: true,
        activePath: '/perf/goal'
      }
    },
    {
      path: 'evaluation',
      name: 'PerfEvaluation',
      component: () => import('@/views/performance/evaluation/index.vue'),
      meta: { title: 'menus.perf.evaluation', keepAlive: true, menuCode: 'perf:evaluation' }
    },
    {
      path: 'review-360/x',
      name: 'PerfReview360',
      component: () => import('@/views/performance/review-360/index.vue'),
      meta: {
        title: 'menus.perf.review360',
        keepAlive: true,
        isHide: true,
        activePath: '/perf/evaluation'
      }
    },
    {
      path: 'calibration',
      name: 'PerfCalibration',
      component: () => import('@/views/performance/calibration/index.vue'),
      meta: { title: 'menus.perf.calibration', keepAlive: true, menuCode: 'perf:calibration' }
    },
    {
      path: 'meeting',
      name: 'PerfMeeting',
      component: () => import('@/views/performance/meeting/index.vue'),
      meta: { title: 'menus.perf.meeting', keepAlive: true, menuCode: 'perf:meeting' }
    },
    {
      path: 'archive',
      name: 'PerfArchive',
      component: () => import('@/views/performance/archive/index.vue'),
      meta: { title: 'menus.perf.archive', keepAlive: true, menuCode: 'perf:archive' }
    },
    // 持续反馈
    {
      path: 'feedback-one-on-one',
      name: 'PerfFeedbackOneOnOne',
      component: () => import('@/views/performance/one-on-one/index.vue'),
      meta: { title: 'menus.perf.oneOnOne', keepAlive: true, menuCode: 'perf:feedback' }
    },
    {
      path: 'feedback-badges',
      name: 'PerfFeedbackBadges',
      component: () => import('@/views/performance/badges/index.vue'),
      meta: { title: 'menus.perf.badges', keepAlive: true, menuCode: 'perf:feedback' }
    },
    // PIP / 申诉
    {
      path: 'pip',
      name: 'PerfPIP',
      component: () => import('@/views/performance/pip/index.vue'),
      meta: { title: 'menus.perf.pip', keepAlive: true, menuCode: 'perf:pip' }
    },
    {
      path: 'appeal',
      name: 'PerfAppeal',
      component: () => import('@/views/performance/appeal/index.vue'),
      meta: { title: 'menus.perf.appeal', keepAlive: true, menuCode: 'perf:appeal' }
    },
    // 绩效配置（模板 / 应用规则 / 任务中心）
    {
      path: 'settings-template',
      name: 'PerfSettingsTemplate',
      component: () => import('@/views/performance/template/index.vue'),
      meta: { title: 'menus.perf.template', keepAlive: true, menuCode: 'perf:settings' }
    },
    {
      path: 'settings-apply-rules',
      name: 'PerfSettingsApplyRules',
      component: () => import('@/views/performance/apply-rules/index.vue'),
      meta: { title: 'menus.perf.applyRules', keepAlive: true, menuCode: 'perf:settings' }
    },
    {
      path: 'settings-tasks',
      name: 'PerfSettingsTasks',
      component: () => import('@/views/performance/tasks/index.vue'),
      meta: { title: 'menus.perf.tasks', keepAlive: true, menuCode: 'perf:settings' }
    }
  ]
}
