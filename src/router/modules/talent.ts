import type { AppRouteRecord } from '@/types/router'

/**
 * 07 人才发展（V2.0 重构 Phase 6 · Batch B）
 *
 * 拆出来源：
 *   - 人才盘点 ← 从 06 绩效管理（perf/talent-review）
 *   - 能力模型 ← 从 08 培训管理（training/competency）
 *   - 能力评估 ← 从 08 培训管理（training/assessment）
 *   - 继任计划 ← 从 08 培训管理（training/succession）
 *
 * 理由：对标北森「人才管理」、Workday「Talent & Performance」，人才发展是独立赛道
 *
 * 组件复用：`views/performance/talent-review/` / `views/performance/competency/` /
 *          `views/training/assessment/` / `views/training/succession/` 保持原位（对齐 Phase 4.x 决策）
 *
 * 路径命名：`/talent/review` 替代 `/talent/talent-review` 避免冗余前缀
 */
export const talentRoutes: AppRouteRecord = {
  path: '/talent',
  name: 'Talent',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.talent.title',
    icon: '&#xe7f0;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'review',
      name: 'TalentReview',
      component: () => import('@/views/performance/talent-review/index.vue'),
      meta: {
        title: 'menus.talent.review',
        keepAlive: true,
        menuCode: 'talent:review'
      }
    },
    {
      path: 'board/:id',
      name: 'TalentBoard',
      component: () => import('@/views/performance/talent-review/board.vue'),
      meta: {
        title: 'menus.talent.board',
        keepAlive: false,
        isHide: true,
        activePath: '/talent/review'
      }
    },
    {
      path: 'competency',
      name: 'TalentCompetency',
      component: () => import('@/views/performance/competency/index.vue'),
      meta: {
        title: 'menus.talent.competency',
        keepAlive: true,
        menuCode: 'talent:competency'
      }
    },
    {
      path: 'assessment',
      name: 'TalentAssessment',
      component: () => import('@/views/training/assessment/index.vue'),
      meta: {
        title: 'menus.talent.assessment',
        keepAlive: true,
        menuCode: 'talent:assessment'
      }
    },
    {
      path: 'succession',
      name: 'TalentSuccession',
      component: () => import('@/views/training/succession/index.vue'),
      meta: {
        title: 'menus.talent.succession',
        keepAlive: true,
        menuCode: 'talent:succession'
      }
    }
  ]
}
