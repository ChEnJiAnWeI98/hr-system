import { createCrudApi } from '@/utils/crud'
import type { Transfer } from '@/types/transfer'
import { transferMock } from '@/mock/transfer'

/**
 * 员工异动管理 API
 */
const transferApi = createCrudApi<Transfer>({
  baseUrl: '/admin/transfer',
  mockFns: transferMock,
  mockDelay: 300
})

/**
 * 获取异动列表
 */
export const getTransferList = transferApi.getList

/**
 * 获取异动详情
 */
export const getTransferDetail = transferApi.getDetail

/**
 * 添加异动
 */
export const addTransfer = transferApi.add

/**
 * 更新异动
 */
export const updateTransfer = transferApi.update

/**
 * 删除异动
 */
export const deleteTransfer = transferApi.delete

/**
 * 批量删除异动
 */
export const batchDeleteTransfer = transferApi.batchDelete

/**
 * 审批异动
 */
export function approveTransfer(data: { id: number; status: number; comment?: string }) {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = transferMock.updateStatus(data.id, data.status)
          // 更新审批信息
          if (data.comment) {
            const updated = transferMock.update({
              id: data.id,
              hrApprovalComment: data.comment,
              hrApprovalTime: new Date().toLocaleString('zh-CN')
            })
            resolve({
              code: 200,
              message: '审批成功',
              data: updated
            })
          } else {
            resolve({
              code: 200,
              message: '审批成功',
              data: result
            })
          }
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '审批失败'
          })
        }
      }, 300)
    })
  }

  return transferApi.updateStatus(data.id, data.status)
}

/**
 * 撤回异动
 */
export function withdrawTransfer(id: number) {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          // 状态改为已撤回 (5)
          const result = transferMock.updateStatus(id, 5)
          resolve({
            code: 200,
            message: '撤回成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '撤回失败'
          })
        }
      }, 300)
    })
  }

  return transferApi.updateStatus(id, 5)
}

/**
 * 生效异动
 */
export function effectiveTransfer(id: number) {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          // 状态改为已生效 (6)
          const result = transferMock.updateStatus(id, 6)
          resolve({
            code: 200,
            message: '生效成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '生效失败'
          })
        }
      }, 300)
    })
  }

  return transferApi.updateStatus(id, 6)
}
