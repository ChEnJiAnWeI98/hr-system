/**
 * 评估表模板 API（Phase A2）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { PerformanceTemplate } from '@/types/performanceTemplate'
import { performanceTemplateMock, cloneTemplateMock } from '@/mock/performanceTemplate'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data: fn() })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, 300)
  })
}

const performanceTemplateApi = createCrudApi<PerformanceTemplate>({
  baseUrl: '/admin/performance/template',
  mockFns: performanceTemplateMock
})

export const getTemplateList = performanceTemplateApi.getList
export const addTemplate = performanceTemplateApi.add
export const updateTemplate = performanceTemplateApi.update
export const deleteTemplate = performanceTemplateApi.delete
export const batchDeleteTemplates = performanceTemplateApi.batchDelete
export const getTemplateDetail = performanceTemplateApi.getDetail

/**
 * 复制为新版本
 */
export function cloneTemplate(id: number) {
  if (USE_MOCK) return mockResolve(() => cloneTemplateMock(id), '已复制为新版本')
  return request.post({ url: `/admin/performance/template/${id}/clone` })
}

/**
 * 启用 / 禁用模板
 */
export function toggleTemplateStatus(id: number, status: 0 | 1) {
  if (USE_MOCK) return performanceTemplateApi.updateStatus(id, status)
  return request.put({ url: `/admin/performance/template/${id}/status`, data: { status } })
}
