import request from '@/utils/http'
import type { FieldWorkRecord, FieldWorkRecordListParams } from '@/types/attendance'
import {
  getListMock,
  getDetailMock,
  addFieldWorkRecordMock,
  updateFieldWorkRecordMock,
  deleteFieldWorkRecordMock,
  batchDeleteFieldWorkRecordsMock,
  endFieldWorkMock
} from '@/mock/fieldWork'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取外勤记录列表
 */
export function getFieldWorkRecordList(params: FieldWorkRecordListParams) {
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
    list: FieldWorkRecord[]
    total: number
  }>({
    url: '/admin/attendance/fieldwork/list',
    params
  })
}

/**
 * 获取外勤记录详情
 */
export function getFieldWorkRecordDetail(id: number) {
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

  return request.get<FieldWorkRecord>({
    url: `/admin/attendance/fieldwork/detail/${id}`
  })
}

/**
 * 添加外勤记录
 */
export function addFieldWorkRecord(data: Partial<FieldWorkRecord>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addFieldWorkRecordMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/attendance/fieldwork/add',
    data
  })
}

/**
 * 更新外勤记录
 */
export function updateFieldWorkRecord(data: Partial<FieldWorkRecord>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateFieldWorkRecordMock(data)
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
    url: '/admin/attendance/fieldwork/update',
    data
  })
}

/**
 * 删除外勤记录
 */
export function deleteFieldWorkRecord(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteFieldWorkRecordMock(id)
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
    url: `/admin/attendance/fieldwork/delete/${id}`
  })
}

/**
 * 批量删除外勤记录
 */
export function batchDeleteFieldWorkRecords(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteFieldWorkRecordsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/attendance/fieldwork/batch-delete',
    data: { ids }
  })
}

/**
 * 结束外勤
 */
export function endFieldWork(id: number, data: { endTime: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = endFieldWorkMock(id, data)
          resolve({
            code: 200,
            message: '外勤已结束',
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

  return request.post({
    url: `/admin/attendance/fieldwork/end/${id}`,
    data
  })
}
