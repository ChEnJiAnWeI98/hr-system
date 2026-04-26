import type { AppRouteRecord } from '@/types/router'

/**
 * 08 培训管理（V2.0 重构 Phase 2 + Phase 4.8~4.9 · Phase 6 Batch B 拆出后）
 *
 * Phase 6 Batch B 迁出：
 *   - 能力模型 → 07 人才发展（talent/competency）
 *   - 能力评估 → 07 人才发展(talent/assessment）
 *   - 继任计划 → 07 人才发展（talent/succession）
 *
 * 菜单结构（4 个二级）：
 * - 课程管理
 * - 培训计划
 * - 培训记录
 * - 证书管理
 */
export const trainingRoutes: AppRouteRecord = {
  path: '/training',
  name: 'Training',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.training.title',
    icon: '&#xe80c;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'course',
      name: 'TrainingCourse',
      component: () => import('@/views/training/course/index.vue'),
      meta: {
        title: 'menus.training.course',
        keepAlive: true,
        menuCode: 'training:course'
      }
    },
    {
      path: 'plan',
      name: 'TrainingPlan',
      component: () => import('@/views/training/plan/index.vue'),
      meta: {
        title: 'menus.training.plan',
        keepAlive: true,
        menuCode: 'training:plan'
      }
    },
    {
      path: 'record',
      name: 'TrainingRecord',
      component: () => import('@/views/training/record/index.vue'),
      meta: {
        title: 'menus.training.record',
        keepAlive: true,
        menuCode: 'training:record'
      }
    },
    {
      path: 'certificate',
      name: 'TrainingCertificate',
      component: () => import('@/views/training/certificate/index.vue'),
      meta: {
        title: 'menus.training.certificate',
        keepAlive: true,
        menuCode: 'training:certificate'
      }
    }
  ]
}
