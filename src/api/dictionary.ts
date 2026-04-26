/**
 * 数据字典 API
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { DictCategory, DictItem, ListParams } from '@/types/system'
import {
  dictCategoryMock,
  dictItemMock,
  getCategoryTreeMock,
  getItemsByCategoryMock
} from '@/mock/dictionary'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 字典分类 API
 */
export const dictCategoryApi = createCrudApi<DictCategory>({
  baseUrl: '/admin/system/dict-category',
  mockFns: dictCategoryMock
})

/**
 * 字典项 API
 */
export const dictItemApi = createCrudApi<DictItem>({
  baseUrl: '/admin/system/dict-item',
  mockFns: dictItemMock
})

/**
 * 获取分类树
 */
export function getCategoryTree() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getCategoryTreeMock()
        resolve({
          code: 200,
          message: '获取分类树成功',
          data
        })
      }, 300)
    })
  }

  return request.get<DictCategory[]>({
    url: '/admin/system/dict-category/tree'
  })
}

/**
 * 根据分类获取字典项
 */
export function getItemsByCategory(params: { categoryId: number } & ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const allItems = getItemsByCategoryMock(params.categoryId)
        const { page = 1, pageSize = 20 } = params
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const list = allItems.slice(start, end)
        resolve({
          code: 200,
          message: '获取字典项成功',
          data: {
            list,
            total: allItems.length
          }
        })
      }, 300)
    })
  }

  return request.get<{ list: DictItem[]; total: number }>({
    url: `/admin/system/dict-item/category/${params.categoryId}`,
    params
  })
}
