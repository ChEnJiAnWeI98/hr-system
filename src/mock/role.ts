/**
 * 角色权限管理 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { Role, Menu } from '@/types/system'

/**
 * 初始角色数据
 */
const initialRoles: Role[] = [
  {
    id: 1,
    roleName: '超级管理员',
    roleCode: 'super_admin',
    description: '系统内置角色，拥有所有权限',
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    status: 1,
    isSystem: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    roleName: 'HR管理员',
    roleCode: 'hr_admin',
    description: '负责人力资源管理，包括员工、部门、考勤等',
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    status: 1,
    isSystem: 0,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    roleName: '部门负责人',
    roleCode: 'dept_manager',
    description: '部门负责人，可查看和管理本部门员工信息',
    menuIds: [1, 2, 3, 4, 5],
    status: 1,
    isSystem: 0,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    roleName: '普通员工',
    roleCode: 'employee',
    description: '普通员工，只能查看个人信息和提交申请',
    menuIds: [1, 2],
    status: 1,
    isSystem: 0,
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00'
  }
]

/**
 * 菜单树数据
 */
const menuTree: Menu[] = [
  {
    id: 1,
    parentId: 0,
    menuName: '组织架构',
    menuCode: 'organization',
    menuType: 1,
    path: '/organization',
    icon: '&#xe88a;',
    sort: 1,
    status: 1,
    children: [
      {
        id: 2,
        parentId: 1,
        menuName: '员工管理',
        menuCode: 'organization:user',
        menuType: 2,
        path: '/organization/user',
        icon: '',
        sort: 1,
        status: 1,
        children: [
          {
            id: 3,
            parentId: 2,
            menuName: '新增员工',
            menuCode: 'organization:user:add',
            menuType: 3,
            path: '',
            icon: '',
            sort: 1,
            status: 1
          },
          {
            id: 4,
            parentId: 2,
            menuName: '编辑员工',
            menuCode: 'organization:user:edit',
            menuType: 3,
            path: '',
            icon: '',
            sort: 2,
            status: 1
          },
          {
            id: 5,
            parentId: 2,
            menuName: '删除员工',
            menuCode: 'organization:user:delete',
            menuType: 3,
            path: '',
            icon: '',
            sort: 3,
            status: 1
          }
        ]
      },
      {
        id: 6,
        parentId: 1,
        menuName: '部门管理',
        menuCode: 'organization:department',
        menuType: 2,
        path: '/organization/department',
        icon: '',
        sort: 2,
        status: 1,
        children: [
          {
            id: 7,
            parentId: 6,
            menuName: '新增部门',
            menuCode: 'organization:department:add',
            menuType: 3,
            path: '',
            icon: '',
            sort: 1,
            status: 1
          },
          {
            id: 8,
            parentId: 6,
            menuName: '编辑部门',
            menuCode: 'organization:department:edit',
            menuType: 3,
            path: '',
            icon: '',
            sort: 2,
            status: 1
          },
          {
            id: 9,
            parentId: 6,
            menuName: '删除部门',
            menuCode: 'organization:department:delete',
            menuType: 3,
            path: '',
            icon: '',
            sort: 3,
            status: 1
          }
        ]
      },
      {
        id: 10,
        parentId: 1,
        menuName: '职位管理',
        menuCode: 'organization:position',
        menuType: 2,
        path: '/organization/position',
        icon: '',
        sort: 3,
        status: 1
      }
    ]
  },
  {
    id: 11,
    parentId: 0,
    menuName: '权限管理',
    menuCode: 'permission',
    menuType: 1,
    path: '/permission',
    icon: '&#xe88b;',
    sort: 2,
    status: 1,
    children: [
      {
        id: 12,
        parentId: 11,
        menuName: '角色管理',
        menuCode: 'permission:role',
        menuType: 2,
        path: '/permission/role',
        icon: '',
        sort: 1,
        status: 1,
        children: [
          {
            id: 13,
            parentId: 12,
            menuName: '新增角色',
            menuCode: 'permission:role:add',
            menuType: 3,
            path: '',
            icon: '',
            sort: 1,
            status: 1
          },
          {
            id: 14,
            parentId: 12,
            menuName: '编辑角色',
            menuCode: 'permission:role:edit',
            menuType: 3,
            path: '',
            icon: '',
            sort: 2,
            status: 1
          },
          {
            id: 15,
            parentId: 12,
            menuName: '删除角色',
            menuCode: 'permission:role:delete',
            menuType: 3,
            path: '',
            icon: '',
            sort: 3,
            status: 1
          },
          {
            id: 16,
            parentId: 12,
            menuName: '分配权限',
            menuCode: 'permission:role:assign',
            menuType: 3,
            path: '',
            icon: '',
            sort: 4,
            status: 1
          }
        ]
      },
      {
        id: 17,
        parentId: 11,
        menuName: '菜单管理',
        menuCode: 'permission:menu',
        menuType: 2,
        path: '/permission/menu',
        icon: '',
        sort: 2,
        status: 1,
        children: [
          {
            id: 18,
            parentId: 17,
            menuName: '新增菜单',
            menuCode: 'permission:menu:add',
            menuType: 3,
            path: '',
            icon: '',
            sort: 1,
            status: 1
          },
          {
            id: 19,
            parentId: 17,
            menuName: '编辑菜单',
            menuCode: 'permission:menu:edit',
            menuType: 3,
            path: '',
            icon: '',
            sort: 2,
            status: 1
          },
          {
            id: 20,
            parentId: 17,
            menuName: '删除菜单',
            menuCode: 'permission:menu:delete',
            menuType: 3,
            path: '',
            icon: '',
            sort: 3,
            status: 1
          }
        ]
      }
    ]
  }
]

/**
 * 创建角色 CRUD Mock
 */
const roleMock = createCrudMock<Role>(initialRoles, {
  searchFields: ['roleName', 'roleCode']
})

/**
 * 获取菜单树 Mock 函数
 */
export function getMenuTreeMock(): Menu[] {
  return menuTree
}

/**
 * 更新角色权限 Mock 函数
 */
export function updatePermissionMock(id: number, menuIds: number[]): Role {
  const role = roleMock.getDetail(id)
  if (!role) {
    throw new Error('角色不存在')
  }
  return roleMock.update({
    id,
    menuIds
  })
}

export default roleMock
