/**
 * 通知配置 API
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { NotificationConfig, ListParams } from '@/types/system'
import { notificationMock } from '@/mock/notification'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 创建基础 CRUD API
 */
const baseApi = createCrudApi<NotificationConfig>({
  baseUrl: '/admin/system/notification',
  mockFns: notificationMock
})

/**
 * 获取通知配置列表
 */
export function getNotificationList(params: ListParams) {
  return baseApi.getList(params)
}

/**
 * 添加通知配置
 */
export function addNotification(data: Partial<NotificationConfig>) {
  return baseApi.add(data)
}

/**
 * 更新通知配置
 */
export function updateNotification(data: Partial<NotificationConfig>) {
  return baseApi.update(data)
}

/**
 * 删除通知配置
 */
export function deleteNotification(id: number) {
  return baseApi.delete(id)
}

/**
 * 批量删除通知配置
 */
export function batchDeleteNotification(ids: number[]) {
  return baseApi.batchDelete(ids)
}

/**
 * 获取通知配置详情
 */
export function getNotificationDetail(id: number) {
  return baseApi.getDetail(id)
}

/**
 * 启用/禁用通知配置
 */
export function toggleNotificationStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        notificationMock.updateStatus(id, status)
        resolve({
          code: 200,
          message: status === 1 ? '启用成功' : '禁用成功'
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/system/notification/toggle-status',
    data: { id, status }
  })
}

/**
 * 测试通知
 */
export function testNotification(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const detail = notificationMock.getDetail(id)
        if (!detail) {
          resolve({
            code: 404,
            message: '通知配置不存在'
          })
          return
        }
        resolve({
          code: 200,
          message: '测试通知已发送',
          data: {
            scenarioName: detail.scenarioName,
            channel: detail.channel,
            sendTime: new Date().toLocaleString('zh-CN')
          }
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/system/notification/test',
    data: { id }
  })
}
