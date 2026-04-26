/**
 * 系统参数 API
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { SystemParam, ListParams } from '@/types/system'
import systemParamMock, { getByGroupMock, batchUpdateMock } from '@/mock/system-param'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 创建基础 CRUD API
 */
const systemParamApi = createCrudApi<SystemParam>({
  baseUrl: '/admin/system/param',
  mockFns: systemParamMock
})

/**
 * 获取列表
 */
export function getList(params: ListParams) {
  return systemParamApi.getList(params)
}

/**
 * 添加参数
 */
export function addParam(data: Partial<SystemParam>) {
  return systemParamApi.add(data)
}

/**
 * 更新参数
 */
export function updateParam(data: Partial<SystemParam>) {
  return systemParamApi.update(data)
}

/**
 * 删除参数
 */
export function deleteParam(id: number) {
  return systemParamApi.delete(id)
}

/**
 * 批量删除参数
 */
export function batchDeleteParams(ids: number[]) {
  return systemParamApi.batchDelete(ids)
}

/**
 * 获取参数详情
 */
export function getDetail(id: number) {
  return systemParamApi.getDetail(id)
}

/**
 * 按分组获取参数
 */
export function getByGroup(group: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getByGroupMock(group)
        resolve({
          code: 200,
          message: '获取成功',
          data
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/system/param/group',
    params: { group }
  })
}

/**
 * 批量更新参数
 */
export function batchUpdate(params: Partial<SystemParam>[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = batchUpdateMock(params)
        resolve({
          code: 200,
          message: '批量更新成功',
          data
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/system/param/batch-update',
    data: { params }
  })
}
