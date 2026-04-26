/**
 * 工作台模块 API
 */

import request from '@/utils/http'
import type {
  UserInfo,
  WeatherInfo,
  EmployeeStats,
  ShortcutItem,
  ScheduleItem,
  WorkspaceQueryParams,
  ApprovalStats
} from '@/types/workspace'
import {
  getUserInfoMock,
  getWeatherInfoMock,
  getEmployeeStatsMock,
  getShortcutListMock,
  updateShortcutListMock,
  getScheduleListMock,
  addScheduleMock,
  updateScheduleMock,
  deleteScheduleMock,
  getApprovalStatsMock
} from '@/mock/workspace'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取用户信息
 */
export function getUserInfo() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getUserInfoMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<UserInfo>({
    url: '/admin/workspace/user-info'
  })
}

/**
 * 获取天气信息
 */
export function getWeatherInfo() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getWeatherInfoMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<WeatherInfo>({
    url: '/admin/workspace/weather'
  })
}

/**
 * 获取员工统计
 */
export function getEmployeeStats() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getEmployeeStatsMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<EmployeeStats>({
    url: '/admin/workspace/employee-stats'
  })
}

/**
 * 获取快捷入口列表
 */
export function getShortcutList() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getShortcutListMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ShortcutItem[]>({
    url: '/admin/workspace/shortcuts'
  })
}

/**
 * 更新快捷入口列表
 */
export function updateShortcutList(data: ShortcutItem[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = updateShortcutListMock(data)
        resolve({
          code: 200,
          message: '更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/workspace/shortcuts',
    data
  })
}

/**
 * 获取日程列表
 */
export function getScheduleList(params: WorkspaceQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getScheduleListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ScheduleItem[]>({
    url: '/admin/workspace/schedules',
    params
  })
}

/**
 * 新增日程
 */
export function addSchedule(data: Partial<ScheduleItem>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addScheduleMock(data)
        resolve({
          code: 200,
          message: '新增成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/workspace/schedule',
    data
  })
}

/**
 * 更新日程
 */
export function updateSchedule(data: Partial<ScheduleItem>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateScheduleMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
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

  return request.put({
    url: '/admin/workspace/schedule',
    data
  })
}

/**
 * 删除日程
 */
export function deleteSchedule(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteScheduleMock(id)
          resolve({
            code: 200,
            message: '删除成功'
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

  return request.del({
    url: `/admin/workspace/schedule/${id}`
  })
}

/**
 * 获取审批概况
 */
export function getApprovalStats() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getApprovalStatsMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ApprovalStats>({
    url: '/admin/workspace/approval-stats'
  })
}
