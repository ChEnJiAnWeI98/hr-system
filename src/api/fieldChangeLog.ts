/**
 * 字段变更日志 API
 */
import request from '@/utils/http'
import type { FieldChangeLog, FieldChangeLogListParams } from '@/types/system/fieldChangeLog'
import {
  getFieldChangeLogListMock,
  getFieldChangeLogDetailMock
} from '@/mock/fieldChangeLog'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** 获取字段变更日志列表 */
export function getList(params: FieldChangeLogListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getFieldChangeLogListMock(params)
        resolve({ code: 200, message: 'success', data })
      }, 300)
    })
  }

  return request.get<{ list: FieldChangeLog[]; total: number }>({
    url: '/admin/system/field-change-log/list',
    params
  })
}

/** 获取单条详情 */
export function getDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getFieldChangeLogDetailMock(id)
        resolve({ code: 200, message: 'success', data })
      }, 300)
    })
  }

  return request.get<FieldChangeLog>({
    url: `/admin/system/field-change-log/${id}`
  })
}

/** 导出字段变更日志 */
export function exportLog(params: FieldChangeLogListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功',
          data: {
            filename: `字段变更日志_${new Date().getTime()}.xlsx`
          }
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/system/field-change-log/export',
    data: params,
    responseType: 'blob'
  })
}
