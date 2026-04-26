/**
 * 操作日志 API
 */

import request from '@/utils/http'
import type { OperationLog, ListParams } from '@/types/system'
import operationLogMock from '@/mock/operation-log'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取操作日志列表
 */
export function getList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = operationLogMock.getList(params)
        resolve({
          code: 200,
          message: '获取列表成功',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: OperationLog[]
    total: number
  }>({
    url: '/admin/system/operation-log/list',
    params
  })
}

/**
 * 导出操作日志
 */
export function exportLog(params: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功',
          data: {
            url: '/download/operation-log-export.xlsx',
            filename: `操作日志_${new Date().getTime()}.xlsx`
          }
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/system/operation-log/export',
    data: params,
    responseType: 'blob'
  })
}
