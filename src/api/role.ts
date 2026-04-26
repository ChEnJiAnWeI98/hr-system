/**
 * 角色权限管理 API
 */

import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import type { Role, Menu, ListParams } from '@/types/system'
import roleMock, { getMenuTreeMock, updatePermissionMock } from '@/mock/role'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 基础 CRUD API
 */
const roleApi = createCrudApi<Role>({
  baseUrl: '/admin/system/role',
  mockFns: roleMock
})

/**
 * 获取角色列表
 */
export function getRoleList(params: ListParams) {
  return roleApi.getList(params)
}

/**
 * 添加角色
 */
export function addRole(data: Partial<Role>) {
  return roleApi.add(data)
}

/**
 * 更新角色
 */
export function updateRole(data: Partial<Role>) {
  return roleApi.update(data)
}

/**
 * 删除角色
 */
export function deleteRole(id: number) {
  return roleApi.delete(id)
}

/**
 * 批量删除角色
 */
export function batchDeleteRoles(ids: number[]) {
  return roleApi.batchDelete(ids)
}

/**
 * 更新角色状态
 */
export function updateRoleStatus(id: number, status: number) {
  return roleApi.updateStatus(id, status)
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id: number) {
  return roleApi.getDetail(id)
}

/**
 * 获取菜单树
 */
export function getMenuTree() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getMenuTreeMock()
        resolve({
          code: 200,
          message: '获取菜单树成功',
          data
        })
      }, 300)
    })
  }

  return request.get<Menu[]>({
    url: '/admin/system/menu/tree'
  })
}

/**
 * 更新角色权限
 */
export function updatePermission(id: number, menuIds: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updatePermissionMock(id, menuIds)
          resolve({
            code: 200,
            message: '权限分配成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '权限分配失败'
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/system/role/permission',
    data: { id, menuIds }
  })
}
