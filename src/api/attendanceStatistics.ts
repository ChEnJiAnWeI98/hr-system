import request from '@/utils/http'
import type { AttendanceStatistics, AttendanceStatisticsListParams } from '@/types/attendance'
import { getListMock, getDetailMock } from '@/mock/attendanceStatistics'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取考勤统计列表
 */
export function getAttendanceStatisticsList(params: AttendanceStatisticsListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: AttendanceStatistics[]
    total: number
  }>({
    url: '/admin/attendance/statistics/list',
    params
  })
}

/**
 * 获取考勤统计详情
 */
export function getAttendanceStatisticsDetail(employeeId: number, statisticsMonth: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getDetailMock(employeeId)
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.get<AttendanceStatistics>({
    url: `/admin/attendance/statistics/detail/${employeeId}`,
    params: { statisticsMonth }
  })
}
