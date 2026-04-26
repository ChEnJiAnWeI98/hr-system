import request from '@/utils/http'
import type { AttendanceRecord, AttendanceRecordListParams } from '@/types/attendance'
import {
  getListMock,
  getDetailMock,
  addAttendanceRecordMock,
  updateAttendanceRecordMock,
  deleteAttendanceRecordMock,
  batchDeleteAttendanceRecordsMock
} from '@/mock/attendanceRecord'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取打卡记录列表
 */
export function getAttendanceRecordList(params: AttendanceRecordListParams) {
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
    list: AttendanceRecord[]
    total: number
  }>({
    url: '/admin/attendance/record/list',
    params
  })
}

/**
 * 获取打卡记录详情
 */
export function getAttendanceRecordDetail(id: number) {
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

  return request.get<AttendanceRecord>({
    url: `/admin/attendance/record/detail/${id}`
  })
}

/**
 * 添加打卡记录
 */
export function addAttendanceRecord(data: Partial<AttendanceRecord>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addAttendanceRecordMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/attendance/record/add',
    data
  })
}

/**
 * 更新打卡记录
 */
export function updateAttendanceRecord(data: Partial<AttendanceRecord>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateAttendanceRecordMock(data)
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
    url: '/admin/attendance/record/update',
    data
  })
}

/**
 * 删除打卡记录
 */
export function deleteAttendanceRecord(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteAttendanceRecordMock(id)
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
    url: `/admin/attendance/record/delete/${id}`
  })
}

/**
 * 批量删除打卡记录
 */
export function batchDeleteAttendanceRecords(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteAttendanceRecordsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/attendance/record/batch-delete',
    data: { ids }
  })
}
