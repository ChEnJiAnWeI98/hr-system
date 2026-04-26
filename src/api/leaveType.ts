/**
 * 假期类型配置 API
 */

import { createCrudApi } from '@/utils/crud'
import type { LeaveType, LeaveTypeListParams } from '@/types/leave'
import {
  getListMock,
  getDetailMock,
  addLeaveTypeMock,
  updateLeaveTypeMock,
  deleteLeaveTypeMock,
  batchDeleteLeaveTypesMock
} from '@/mock/leaveType'

/**
 * 创建假期类型 CRUD API
 */
const leaveTypeApi = createCrudApi<LeaveType>({
  baseUrl: '/admin/leave-type',
  mockFns: {
    getList: getListMock,
    getDetail: getDetailMock,
    add: addLeaveTypeMock,
    update: updateLeaveTypeMock,
    delete: deleteLeaveTypeMock,
    batchDelete: batchDeleteLeaveTypesMock,
    updateStatus: (id: number, status: number) => {
      return updateLeaveTypeMock({ id, status })
    },
    getData: () => []
  }
})

/**
 * 获取假期类型列表
 */
export function getLeaveTypeList(params: LeaveTypeListParams) {
  return leaveTypeApi.getList(params)
}

/**
 * 获取假期类型详情
 */
export function getLeaveTypeDetail(id: number) {
  return leaveTypeApi.getDetail(id)
}

/**
 * 添加假期类型
 */
export function addLeaveType(data: Partial<LeaveType>) {
  return leaveTypeApi.add(data)
}

/**
 * 更新假期类型
 */
export function updateLeaveType(data: Partial<LeaveType>) {
  return leaveTypeApi.update(data)
}

/**
 * 删除假期类型
 */
export function deleteLeaveType(id: number) {
  return leaveTypeApi.delete(id)
}

/**
 * 批量删除假期类型
 */
export function batchDeleteLeaveTypes(ids: number[]) {
  return leaveTypeApi.batchDelete(ids)
}
