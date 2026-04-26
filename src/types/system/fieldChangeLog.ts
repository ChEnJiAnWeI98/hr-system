/**
 * 字段变更日志类型定义（Phase 5.8+）
 *
 * 业务定位：员工档案关键字段（薪资/岗位/组织/合同/联系方式等）变更的合规审计
 * 与操作日志（operation-log）的区别：
 *   - 操作日志记录"动作"（谁在何时做了什么操作）
 *   - 字段变更日志记录"数据前后差异"（哪个字段从 A 改为 B）
 */

/** 实体类型 */
export type EntityTypeCode =
  | 'employee' // 员工档案
  | 'organization' // 组织
  | 'contract' // 合同
  | 'position' // 岗位
  | 'compensation' // 薪酬
  | 'role' // 角色

/** 变更来源 */
export type ChangeSource =
  | 'transfer' // 异动单触发
  | 'salary_adjust' // 调薪单触发
  | 'contract_renewal' // 合同续签
  | 'offboarding' // 离职流程触发
  | 'onboarding' // 入职办理触发
  | 'direct_edit' // HR 直接修改
  | 'system_auto' // 系统自动触发（如合同到期）

/**
 * 字段变更日志
 */
export interface FieldChangeLog {
  id: number
  /** 实体类型（员工/组织/合同等） */
  entityType: string
  entityTypeCode: EntityTypeCode
  /** 实体 ID（员工 ID、合同 ID 等） */
  entityId: number
  /** 实体名称（员工姓名、组织名等） */
  entityName: string

  /** 字段技术名（如 baseSalary） */
  fieldName: string
  /** 字段业务名（如 基本工资） */
  fieldLabel: string
  /** 变更前值 */
  oldValue: string
  /** 变更后值 */
  newValue: string
  /** 变更原因 */
  changeReason?: string

  /** 变更来源 */
  source: ChangeSource
  /** 来源单号（异动单/调薪单等） */
  sourceDocNo?: string

  /** 操作者 */
  operatorId: number
  operatorName: string
  operatorRole: string

  /** IP 地址 */
  ipAddress: string
  /** 变更时间 */
  operateTime: string
}

/**
 * 查询参数
 */
export interface FieldChangeLogListParams {
  /** 实体类型筛选 */
  entityTypeCode?: EntityTypeCode | ''
  /** 实体名称（模糊） */
  entityName?: string
  /** 字段名称（模糊） */
  fieldLabel?: string
  /** 操作人 */
  operatorName?: string
  /** 变更来源 */
  source?: ChangeSource | ''
  /** 时间范围 - 开始 */
  dateStart?: string
  /** 时间范围 - 结束 */
  dateEnd?: string
  page: number
  pageSize: number
}

/** 实体类型标签 */
export const ENTITY_TYPE_LABEL: Record<EntityTypeCode, string> = {
  employee: '员工档案',
  organization: '组织',
  contract: '合同',
  position: '岗位',
  compensation: '薪酬',
  role: '角色权限'
}

/** 变更来源标签 */
export const CHANGE_SOURCE_LABEL: Record<ChangeSource, string> = {
  transfer: '异动单',
  salary_adjust: '调薪单',
  contract_renewal: '合同续签',
  offboarding: '离职流程',
  onboarding: '入职办理',
  direct_edit: 'HR 直接修改',
  system_auto: '系统自动'
}

/** 变更来源 Tag 类型 */
export const CHANGE_SOURCE_TYPE: Record<ChangeSource, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
  transfer: 'primary',
  salary_adjust: 'warning',
  contract_renewal: 'success',
  offboarding: 'danger',
  onboarding: 'success',
  direct_edit: 'info',
  system_auto: 'info'
}
