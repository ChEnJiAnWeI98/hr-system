import type { AppRouteRecord } from '@/types/router'

/**
 * 考勤管理路由
 */
export const attendanceRoutes: AppRouteRecord = {
  path: '/attendance',
  name: 'Attendance',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.attendance.title',
    icon: '&#xe749;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'rule',
      name: 'AttendanceRule',
      component: () => import('@/views/attendance/rule/index.vue'),
      meta: {
        title: 'menus.attendance.rule',
        keepAlive: true
      }
    },
    {
      path: 'record',
      name: 'AttendanceRecord',
      component: () => import('@/views/attendance/record/index.vue'),
      meta: {
        title: 'menus.attendance.record',
        keepAlive: true
      }
    },
    {
      path: 'overtime',
      name: 'AttendanceOvertime',
      component: () => import('@/views/attendance/overtime/index.vue'),
      meta: {
        title: 'menus.attendance.overtime',
        keepAlive: true
      }
    },
    {
      path: 'fieldwork',
      name: 'AttendanceFieldwork',
      component: () => import('@/views/attendance/fieldwork/index.vue'),
      meta: {
        title: 'menus.attendance.fieldwork',
        keepAlive: true
      }
    },
    {
      path: 'makeup',
      name: 'AttendanceMakeup',
      component: () => import('@/views/attendance/makeup/index.vue'),
      meta: {
        title: 'menus.attendance.makeup',
        keepAlive: true
      }
    },
    {
      path: 'statistics',
      name: 'AttendanceStatistics',
      component: () => import('@/views/attendance/statistics/index.vue'),
      meta: {
        title: 'menus.attendance.statistics',
        keepAlive: true
      }
    }
  ]
}
