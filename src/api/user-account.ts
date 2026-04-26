/**
 * 用户账号 API
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { UserAccount } from '@/types/system'
import { userAccountMock, resetPasswordMock, toggleStatusMock } from '@/mock/user-account'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 基础 CRUD API
 */
const userAccountApi = createCrudApi<UserAccount>({
  baseUrl: '/admin/system/user-account',
  mockFns: userAccountMock
})

/**
 * 获取列表
 */
export const getList = userAccountApi.getList

/**
 * 添加用户账号
 */
export const addUserAccount = userAccountApi.add

/**
 * 更新用户账号
 */
export const updateUserAccount = userAccountApi.update

/**
 * 删除用户账号
 */
export const deleteUserAccount = userAccountApi.delete

/**
 * 批量删除用户账号
 */
export const batchDeleteUserAccount = userAccountApi.batchDelete

/**
 * 获取详情
 */
export const getDetail = userAccountApi.getDetail

/**
 * 重置密码
 */
export function resetPassword(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = resetPasswordMock(id)
          resolve({
            code: 200,
            message: '密码重置成功，新密码为：123456',
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
    url: `/admin/system/user-account/reset-password/${id}`
  })
}

/**
 * 启用/禁用用户账号
 */
export function toggleStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = toggleStatusMock(id, status)
          resolve({
            code: 200,
            message: status === 1 ? '启用成功' : '禁用成功',
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
    url: `/admin/system/user-account/toggle-status`,
    data: { id, status }
  })
}
