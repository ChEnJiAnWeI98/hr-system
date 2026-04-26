/**
 * RBAC 权限 类型定义（Phase 1.5）
 *
 * 三层权限模型：
 * - 菜单权限：角色能看到哪些菜单
 * - 数据权限：角色能看到哪些业务数据（本人/部门/全员等）
 * - 字段权限：角色能看到哪些字段（特别是薪酬/身份证等敏感字段）
 */

/** 数据权限范围 */
export type DataScope =
  | 'self' //              仅本人
  | 'subordinate' //       直属下属
  | 'self_and_subordinate' // 本人 + 直属下属（含间接下属）
  | 'department' //        本部门（含子部门）
  | 'department_exclusive' // 本部门（不含子部门）
  | 'custom_org' //        自定义组织（HRBP 用 managedOrgIds）
  | 'all' //               全员

/** 字段显示方式 */
export type FieldVisibility = 'visible' | 'masked' | 'hidden'

/**
 * 字段权限规则
 */
export interface FieldPermissionRule {
  /** 敏感字段（身份证/手机等）展示方式 */
  sensitiveFields: FieldVisibility
  /** 薪酬字段展示方式 */
  salaryFields: FieldVisibility
  /** 自定义字段规则 */
  customFields?: Record<string, FieldVisibility>
}

/**
 * 角色
 */
export interface Role {
  id: number
  /** 角色编码（系统唯一标识） */
  roleCode: string
  /** 角色名称 */
  roleName: string
  /** 描述 */
  description: string
  /** 是否系统预置（预置角色不可删） */
  isSystem: boolean
  /** 菜单权限 - 可见菜单编码列表 */
  menuCodes: string[]
  /** 数据权限范围 */
  dataScope: DataScope
  /** 字段权限规则 */
  fieldPermission: FieldPermissionRule
  /** 排序 */
  sortOrder: number
  status: 0 | 1
  createTime: string
  updateTime: string
}

/**
 * 菜单定义（用于 RBAC 配置）
 */
export interface MenuDefinition {
  /** 菜单编码 */
  code: string
  /** 菜单名称 */
  name: string
  /** 所属一级菜单分组 */
  groupCode: string
  /** 所属一级菜单名称 */
  groupName: string
  /** 菜单路径 */
  path: string
  /** 是否核心菜单（所有角色默认包含） */
  isCore?: boolean
}

/**
 * 查询参数
 */
export interface RoleListParams {
  roleName?: string
  status?: 0 | 1 | null
}

/** 数据范围 label */
export const DATA_SCOPE_LABEL: Record<DataScope, string> = {
  self: '仅本人',
  subordinate: '直属下属',
  self_and_subordinate: '本人 + 下属',
  department: '本部门（含子部门）',
  department_exclusive: '本部门（不含子部门）',
  custom_org: '自定义组织（HRBP 分管）',
  all: '全员'
}

export const DATA_SCOPE_COLOR: Record<
  DataScope,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  self: 'info',
  subordinate: 'primary',
  self_and_subordinate: 'primary',
  department: 'warning',
  department_exclusive: 'warning',
  custom_org: 'warning',
  all: 'danger'
}

/** 字段可见性 label */
export const FIELD_VISIBILITY_LABEL: Record<FieldVisibility, string> = {
  visible: '可见',
  masked: '脱敏',
  hidden: '隐藏'
}
