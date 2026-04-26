/**
 * 岗位管理 API
 */

import { createCrudApi } from '@/utils/crud/apiHelper'
import { positionMockFns } from '@/mock/position'
import type { Position } from '@/types/position'

/**
 * 岗位 API
 */
export const positionApi = createCrudApi<Position>({
  baseUrl: '/admin/position',
  mockFns: positionMockFns
})

/**
 * 获取岗位列表
 */
export const getPositionList = positionApi.getList

/**
 * 添加岗位
 */
export const addPosition = positionApi.add

/**
 * 更新岗位
 */
export const updatePosition = positionApi.update

/**
 * 删除岗位
 */
export const deletePosition = positionApi.delete

/**
 * 批量删除岗位
 */
export const batchDeletePositions = positionApi.batchDelete

/**
 * 更新岗位状态
 */
export const updatePositionStatus = positionApi.updateStatus

/**
 * 获取岗位详情
 */
export const getPositionDetail = positionApi.getDetail
