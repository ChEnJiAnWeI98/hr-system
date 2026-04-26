import request from '@/utils/http'
import type { AttendanceRule, AttendanceRuleListParams } from '@/types/attendance'
import {
  getListMock,
  getDetailMock,
  addAttendanceRuleMock,
  updateAttendanceRuleMock,
  deleteAttendanceRuleMock,
  batchDeleteAttendanceRulesMock
} from '@/mock/attendanceRule'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取考勤规则列表
 */
export function getAttendanceRuleList(params: AttendanceRuleListParams) {
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
    list: AttendanceRule[]
    total: number
  }>({
    url: '/admin/attendance/rule/list',
    params
  })
}

/**
 * 获取考勤规则详情
 */
export function getAttendanceRuleDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getDetailMock(id)
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

  return request.get<AttendanceRule>({
    url: `/admin/attendance/rule/detail/${id}`
  })
}

/**
 * 添加考勤规则
 */
export function addAttendanceRule(data: Partial<AttendanceRule>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addAttendanceRuleMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/attendance/rule/add',
    data
  })
}

/**
 * 更新考勤规则
 */
export function updateAttendanceRule(data: Partial<AttendanceRule>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateAttendanceRuleMock(data)
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
    url: '/admin/attendance/rule/update',
    data
  })
}

/**
 * 删除考勤规则
 */
export function deleteAttendanceRule(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteAttendanceRuleMock(id)
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
    url: `/admin/attendance/rule/delete/${id}`
  })
}

/**
 * 批量删除考勤规则
 */
export function batchDeleteAttendanceRules(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteAttendanceRulesMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/attendance/rule/batch-delete',
    data: { ids }
  })
}
