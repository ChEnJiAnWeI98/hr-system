import type { AppRouteRecord } from '@/types/router'

/**
 * 03 考勤与假期（V2.0 重构 Phase 2）
 *
 * 合并自：attendance + leave
 * Views 暂保留在 `views/attendance/` 和 `views/leave/`
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
    // 考勤原有子页
    {
      path: 'rule',
      name: 'AttendanceRule',
      component: () => import('@/views/attendance/rule/index.vue'),
      meta: { title: 'menus.attendance.rule', keepAlive: true, menuCode: 'attendance:rule' }
    },
    {
      path: 'record',
      name: 'AttendanceRecord',
      component: () => import('@/views/attendance/record/index.vue'),
      meta: { title: 'menus.attendance.record', keepAlive: true, menuCode: 'attendance:record' }
    },
    {
      path: 'overtime',
      name: 'AttendanceOvertime',
      component: () => import('@/views/attendance/overtime/index.vue'),
      meta: { title: 'menus.attendance.overtime', keepAlive: true, menuCode: 'attendance:overtime' }
    },
    {
      path: 'fieldwork',
      name: 'AttendanceFieldwork',
      component: () => import('@/views/attendance/fieldwork/index.vue'),
      meta: { title: 'menus.attendance.fieldwork', keepAlive: true, menuCode: 'attendance:record' }
    },
    {
      path: 'makeup',
      name: 'AttendanceMakeup',
      component: () => import('@/views/attendance/makeup/index.vue'),
      meta: { title: 'menus.attendance.makeup', keepAlive: true, menuCode: 'attendance:record' }
    },
    {
      path: 'statistics',
      name: 'AttendanceStatistics',
      component: () => import('@/views/attendance/statistics/index.vue'),
      meta: { title: 'menus.attendance.statistics', keepAlive: true, menuCode: 'attendance:report' }
    },
    // 假期（从原 leave 一级降级为二级）
    {
      path: 'leave-config',
      name: 'AttendanceLeaveConfig',
      component: () => import('@/views/leave/config/index.vue'),
      meta: {
        title: 'menus.attendance.leaveConfig',
        keepAlive: true,
        menuCode: 'attendance:leave'
      }
    },
    {
      path: 'leave-quota',
      name: 'AttendanceLeaveQuota',
      component: () => import('@/views/leave/quota/index.vue'),
      meta: {
        title: 'menus.attendance.leaveQuota',
        keepAlive: true,
        menuCode: 'attendance:leave'
      }
    },
    {
      path: 'leave-application',
      name: 'AttendanceLeaveApplication',
      component: () => import('@/views/leave/application/index.vue'),
      meta: {
        title: 'menus.attendance.leaveApplication',
        keepAlive: true,
        menuCode: 'attendance:leave'
      }
    },
    {
      path: 'leave-time-off',
      name: 'AttendanceLeaveTimeOff',
      component: () => import('@/views/leave/time-off/index.vue'),
      meta: {
        title: 'menus.attendance.leaveTimeOff',
        keepAlive: true,
        menuCode: 'attendance:leave'
      }
    },
    {
      path: 'leave-ledger',
      name: 'AttendanceLeaveLedger',
      component: () => import('@/views/leave/ledger/index.vue'),
      meta: {
        title: 'menus.attendance.leaveLedger',
        keepAlive: true,
        menuCode: 'attendance:leave'
      }
    }
  ]
}
