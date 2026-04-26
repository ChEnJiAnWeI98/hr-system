/**
 * 假期台账 API
 */
import request from '@/utils/http'
import type { LeaveLedger, LeaveLedgerListParams } from '@/types/leave'
import { getListMock, getDetailMock } from '@/mock/leaveLedger'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取假期台账列表
 */
export function getLeaveLedgerList(params: LeaveLedgerListParams) {
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
    list: LeaveLedger[]
    total: number
  }>({
    url: '/admin/leave/ledger/list',
    params
  })
}

/**
 * 获取假期台账详情
 */
export function getLeaveLedgerDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '台账不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<LeaveLedger>({
    url: `/admin/leave/ledger/detail/${id}`
  })
}
