/**
 * 编制管理 API
 */

import { createCrudApi } from '@/utils/crud'
import {
  staffingMock,
  getStaffingStatisticsMock,
  addStaffingMock,
  updateStaffingMock,
  getAdjustmentRecordsMock
} from '@/mock/staffing'
import type { Staffing, StaffingStatistics, StaffingAdjustmentQueryParams } from '@/types/staffing'
import request from '@/utils/http'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 创建编制 CRUD API
 */
export const staffingApi = createCrudApi<Staffing>({
  baseUrl: '/admin/staffing',
  mockFns: {
    ...staffingMock,
    add: addStaffingMock,
    update: updateStaffingMock
  }
})

/**
 * 获取编制列表
 */
export const getStaffingList = staffingApi.getList

/**
 * 添加编制
 */
export const addStaffing = staffingApi.add

/**
 * 更新编制
 */
export const updateStaffing = staffingApi.update

/**
 * 删除编制
 */
export const deleteStaffing = staffingApi.delete

/**
 * 批量删除编制
 */
export const batchDeleteStaffing = staffingApi.batchDelete

/**
 * 获取编制详情
 */
export const getStaffingDetail = staffingApi.getDetail

/**
 * 获取编制统计信息
 */
export function getStaffingStatistics(params?: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getStaffingStatisticsMock(params)
        resolve({
          code: 200,
          message: '获取统计信息成功',
          data
        })
      }, 300)
    })
  }

  return request.get<StaffingStatistics>({
    url: '/admin/staffing/statistics',
    params
  })
}

/**
 * 获取编制调整记录
 */
export function getAdjustmentRecords(params: StaffingAdjustmentQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getAdjustmentRecordsMock(params)
        resolve({
          code: 200,
          message: '获取调整记录成功',
          data
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/staffing/adjustment-records',
    params
  })
}
