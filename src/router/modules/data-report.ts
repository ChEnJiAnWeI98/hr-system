import type { AppRouteRecord } from '@/types/router'

/**
 * 数据报表与分析路由
 */
export const dataReportRoutes: AppRouteRecord = {
  path: '/data-report',
  name: 'DataReport',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.dataReport.title',
    icon: '&#xe812;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'dashboard',
      name: 'DataReportDashboard',
      component: () => import('@/views/data-report/dashboard/index.vue'),
      meta: {
        title: 'menus.dataReport.dashboard',
        keepAlive: true
      }
    },
    {
      path: 'personnel',
      name: 'DataReportPersonnel',
      component: () => import('@/views/data-report/personnel/index.vue'),
      meta: {
        title: 'menus.dataReport.personnel',
        keepAlive: true
      }
    },
    {
      path: 'salary',
      name: 'DataReportSalary',
      component: () => import('@/views/data-report/salary/index.vue'),
      meta: {
        title: 'menus.dataReport.salary',
        keepAlive: true
      }
    },
    {
      path: 'recruitment',
      name: 'DataReportRecruitment',
      component: () => import('@/views/data-report/recruitment/index.vue'),
      meta: {
        title: 'menus.dataReport.recruitment',
        keepAlive: true
      }
    },
    {
      path: 'attendance',
      name: 'DataReportAttendance',
      component: () => import('@/views/data-report/attendance/index.vue'),
      meta: {
        title: 'menus.dataReport.attendance',
        keepAlive: true
      }
    }
  ]
}
