/**
 * 员工生命周期状态常量
 *
 * 所有 mock 数据生成、列表筛选、数据一致性检查都应引用本文件的常量，
 * 避免多处内联字面量（`status === 'terminated'`）带来的维护成本。
 *
 * 规则对照：docs/HR重构-数据健康度规则-V1.0.md
 */

import type { EmployeeStatus } from '@/types/employee/profile'

/** 在职类状态：仍在公司内持续产生业务数据 */
export const ACTIVE_STATUSES: readonly EmployeeStatus[] = [
  'probation',
  'regular',
  'transferring',
  'seconded'
] as const

/** 待入职：尚未办理入职，业务数据不应涉及他 */
export const PENDING_STATUSES: readonly EmployeeStatus[] = ['pending_onboard'] as const

/** 离职流程中：已发起离职单，但离职日未到，仍在产生业务数据 */
export const OFFBOARDING_STATUSES: readonly EmployeeStatus[] = ['offboarding'] as const

/** 已彻底离职：数据冻结分界点，离职日之后不再产生新业务数据 */
export const TERMINATED_STATUSES: readonly EmployeeStatus[] = ['terminated'] as const

/**
 * 在"新业务数据生成"场景下"应排除"的员工状态
 * 使用场景：生成 2026 Q2 绩效档案、生成新工资批次、生成新考勤等
 */
export const EXCLUDE_FOR_NEW_BUSINESS: readonly EmployeeStatus[] = [
  'pending_onboard',
  'terminated'
] as const

/**
 * 判断员工的当前状态是否属于在职类（不含离职流程中）
 */
export function isActive(status: EmployeeStatus): boolean {
  return (ACTIVE_STATUSES as readonly string[]).includes(status)
}

/**
 * 判断员工是否应被排除（新业务数据生成时）
 */
export function shouldExcludeFromNewBusiness(status: EmployeeStatus): boolean {
  return (EXCLUDE_FOR_NEW_BUSINESS as readonly string[]).includes(status)
}

/**
 * 判断员工是否已彻底离职
 */
export function isTerminated(status: EmployeeStatus): boolean {
  return status === 'terminated'
}

/**
 * 判断员工在给定日期是否在职（精确版，需外部传入离职日）
 *
 * 使用场景：历史数据保留判断 —— 数据所属日期 ≤ 离职日即合理
 *
 * @param employeeStatus 员工当前状态
 * @param checkDate 要检查的日期（YYYY-MM-DD）
 * @param lastWorkDay 员工实际离职日（来自 offboarding.actualLastDay，可选）
 */
export function isActiveOnDate(
  employeeStatus: EmployeeStatus,
  checkDate: string,
  lastWorkDay?: string
): boolean {
  // 状态为在职类 → 在职
  if (isActive(employeeStatus)) return true

  // 状态为离职流程中 → 看离职日是否到
  if (employeeStatus === 'offboarding') {
    if (!lastWorkDay) return true // 还未定离职日，视为在职
    return checkDate <= lastWorkDay
  }

  // 状态为已彻底离职 → 看数据日期是否在离职日之前/当天
  if (employeeStatus === 'terminated') {
    if (!lastWorkDay) return false // 已离职但无日期，保守视为不在职
    return checkDate <= lastWorkDay
  }

  // 待入职 → 不在职
  return false
}
