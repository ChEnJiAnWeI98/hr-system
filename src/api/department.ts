/**
 * 部门管理 API
 */

import { createCrudApi } from '@/utils/crud'
import { departmentMock } from '@/mock/department'
import type { Department } from '@/types/department'

/**
 * 创建部门 CRUD API
 */
export const departmentApi = createCrudApi<Department>({
  baseUrl: '/admin/department',
  mockFns: departmentMock
})

/**
 * 获取部门树
 */
export const getDepartmentTree = departmentApi.getList

/**
 * 获取部门列表（别名）
 */
export const getDepartmentList = getDepartmentTree

/**
 * 添加部门
 */
export const addDepartment = departmentApi.add

/**
 * 更新部门
 */
export const updateDepartment = departmentApi.update

/**
 * 删除部门
 */
export const deleteDepartment = departmentApi.delete

/**
 * 更新部门状态
 */
export const updateDepartmentStatus = departmentApi.updateStatus

/**
 * 获取部门详情
 */
export const getDepartmentDetail = departmentApi.getDetail
