/**
 * 用户账号
 */
export interface UserAccount {
  id: number
  username: string
  realName: string
  phone: string
  email: string
  departmentId?: number
  departmentName?: string
  roleIds: number[]
  roleNames: string[]
  status: number // 1-启用 0-禁用
  lastLoginTime: string
  createTime: string
  updateTime: string
}

/**
 * 角色
 */
export interface Role {
  id: number
  roleName: string
  roleCode: string
  description: string
  menuIds: number[]
  status: number // 1-启用 0-禁用
  isSystem: number // 1-系统内置 0-自定义
  createTime: string
  updateTime: string
}

/**
 * 菜单权限
 */
export interface Menu {
  id: number
  parentId: number
  menuName: string
  menuCode: string
  menuType: number // 1-目录 2-菜单 3-按钮
  path: string
  icon: string
  sort: number
  status: number
  children?: Menu[]
}

/**
 * 数据字典分类
 */
export interface DictCategory {
  id: number
  categoryName: string
  categoryCode: string
  description: string
  sort: number
  status: number
  createTime: string
  updateTime: string
  children?: DictCategory[]
}

/**
 * 数据字典项
 */
export interface DictItem {
  id: number
  categoryId: number
  dictLabel: string
  dictValue: string
  sort: number
  status: number // 1-启用 0-禁用
  remark: string
  createTime: string
  updateTime: string
}

/**
 * 操作日志
 */
export interface OperationLog {
  id: string
  operatorName: string
  operatorId: number
  module: string
  operationType: string // 新增、修改、删除、查询、登录、登出
  operationContent: string
  requestParams: string
  ipAddress: string
  operationTime: string
  executionTime: number // 毫秒
  operationResult: number // 1-成功 0-失败
  errorMessage: string
}

/**
 * 通知配置
 */
export interface NotificationConfig {
  id: number
  scenarioCode: string
  scenarioName: string
  channel: string // 站内信、邮件、短信、企业微信
  template: string
  advanceDays: number
  status: number // 1-启用 0-禁用
  createTime: string
  updateTime: string
}

/**
 * 系统参数
 */
export interface SystemParam {
  id: number
  paramName: string
  paramCode: string
  paramValue: string
  paramType: string // 文本、数字、布尔、文件
  paramGroup: string
  description: string
  createTime: string
  updateTime: string
}

/**
 * 列表查询参数
 */
export interface ListParams {
  page: number
  pageSize: number
  [key: string]: any
}
