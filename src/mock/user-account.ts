/**
 * 用户账号 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { UserAccount } from '@/types/system'

/**
 * 初始数据
 */
const initialData: UserAccount[] = [
  {
    id: 1,
    username: 'admin',
    realName: '超级管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    departmentId: 1,
    departmentName: '总经办',
    roleIds: [1],
    roleNames: ['超级管理员'],
    status: 1,
    lastLoginTime: '2026-04-07 09:30:00',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-04-07 09:30:00'
  },
  {
    id: 2,
    username: 'hr_manager',
    realName: 'HR管理员',
    phone: '13800138001',
    email: 'hr@example.com',
    departmentId: 2,
    departmentName: '人力资源部',
    roleIds: [2],
    roleNames: ['HR管理员'],
    status: 1,
    lastLoginTime: '2026-04-06 14:20:00',
    createTime: '2026-01-05 11:00:00',
    updateTime: '2026-04-06 14:20:00'
  },
  {
    id: 3,
    username: 'dept_leader',
    realName: '部门负责人',
    phone: '13800138002',
    email: 'leader@example.com',
    departmentId: 3,
    departmentName: '技术部',
    roleIds: [3],
    roleNames: ['部门负责人'],
    status: 1,
    lastLoginTime: '2026-04-05 16:45:00',
    createTime: '2026-01-10 09:00:00',
    updateTime: '2026-04-05 16:45:00'
  },
  {
    id: 4,
    username: 'employee1',
    realName: '普通员工1',
    phone: '13800138003',
    email: 'employee1@example.com',
    departmentId: 3,
    departmentName: '技术部',
    roleIds: [4],
    roleNames: ['普通员工'],
    status: 1,
    lastLoginTime: '2026-04-07 08:00:00',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-04-07 08:00:00'
  },
  {
    id: 5,
    username: 'employee2',
    realName: '普通员工2',
    phone: '13800138004',
    email: 'employee2@example.com',
    departmentId: 4,
    departmentName: '市场部',
    roleIds: [4],
    roleNames: ['普通员工'],
    status: 0,
    lastLoginTime: '2026-03-20 17:30:00',
    createTime: '2026-02-15 14:00:00',
    updateTime: '2026-03-25 10:00:00'
  }
]

/**
 * 创建 CRUD Mock 函数
 */
export const userAccountMock = createCrudMock<UserAccount>(initialData, {
  searchFields: ['username', 'realName', 'phone']
})

/**
 * 重置密码 Mock 函数
 */
export function resetPasswordMock(id: number) {
  const user = userAccountMock.getDetail(id)
  if (!user) {
    throw new Error('用户不存在')
  }
  return {
    id,
    newPassword: '123456'
  }
}

/**
 * 启用/禁用 Mock 函数
 */
export function toggleStatusMock(id: number, status: number) {
  return userAccountMock.updateStatus(id, status)
}
