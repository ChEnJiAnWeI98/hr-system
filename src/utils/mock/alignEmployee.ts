/**
 * Mock 数据员工字段对齐工具（Phase 2.10）
 *
 * 用途：把旧业务 Mock 里硬编码的员工姓名/部门/岗位字段，自动对齐到 200 员工池
 *
 * 使用方式：
 *   // 原有数据定义
 *   const rawContracts = [
 *     { id: 1, contractNo: 'HT001', startDate: '2024-01-01', ... },
 *     { id: 2, contractNo: 'HT002', ... }
 *   ]
 *   // 一行对齐员工字段
 *   export const CONTRACTS = alignEmployeeFields(rawContracts, { startIndex: 0 })
 *
 * 效果：按数组索引从员工池依次取员工，覆盖员工相关字段（employeeId/employeeName/department 等）
 */

import { EMPLOYEES } from '@/mock/core/employeePool'

export interface AlignOptions {
  /** 从员工池的哪个索引开始取（默认 0） */
  startIndex?: number
  /** 只对齐某些字段（默认全部覆盖） */
  onlyFields?: string[]
  /** 跳过某些字段（即使存在也不覆盖） */
  skipFields?: string[]
  /** 过滤条件：只从员工池里满足条件的员工中取 */
  filter?: (emp: (typeof EMPLOYEES)[number]) => boolean
  /**
   * 额外的"角色字段"对齐
   * 用于一条记录里有多个角色的场景（如招聘需求有审批人+用人经理+HR）
   * key = 目标字段名，value = 员工池起始索引（从索引位置依次取员工填充）
   * 例：{ approverName: 0, hiringManagerName: 10 } 表示审批人从员工池 0 号开始取，用人经理从 10 号开始取
   */
  roles?: Record<
    string,
    | number
    | {
        startIndex: number
        /** 取员工的哪个字段（默认 nameZh） */
        empField?: 'nameZh' | 'orgName' | 'positionName' | 'mobile' | 'email' | 'employeeNo' | 'level'
        /** 筛选员工池（如只取 HR/管理族） */
        filter?: (emp: (typeof EMPLOYEES)[number]) => boolean
      }
  >
}

/**
 * 批量对齐员工字段
 */
export function alignEmployeeFields<T extends Record<string, any>>(
  records: T[],
  options: AlignOptions = {}
): T[] {
  const { startIndex = 0, onlyFields, skipFields = [], filter, roles } = options

  // 候选员工池
  const pool = filter ? EMPLOYEES.filter(filter) : EMPLOYEES
  if (pool.length === 0) {
    console.warn('[alignEmployeeFields] 员工池为空，返回原数据')
    return records
  }

  return records.map((record, i) => {
    const emp = pool[(startIndex + i) % pool.length]

    // 待覆盖的字段映射（主员工）
    const overrides: Record<string, any> = {
      employeeId: emp.id,
      employeeNo: emp.employeeNo,
      employeeCode: emp.employeeNo, // 旧 mock 里工号字段叫 employeeCode
      employeeName: emp.nameZh,
      nameZh: emp.nameZh,
      department: emp.orgName,
      departmentName: emp.orgName,
      deptName: emp.orgName,
      orgId: emp.orgId,
      orgName: emp.orgName,
      position: emp.positionName,
      positionName: emp.positionName,
      positionId: emp.positionId,
      level: emp.level,
      jobFamily: emp.jobFamily,
      mobile: emp.mobile,
      email: emp.email
    }

    // 按选项过滤
    const finalOverrides: Record<string, any> = {}
    for (const k of Object.keys(overrides)) {
      if (onlyFields && !onlyFields.includes(k)) continue
      if (skipFields.includes(k)) continue
      // 只覆盖原 record 里存在的字段（不新增字段，避免打破业务结构）
      // 唯一例外：总是加 employeeId（后续业务迁移的入口）
      if (k === 'employeeId' || k in record) {
        finalOverrides[k] = overrides[k]
      }
    }

    // 🔸 处理额外的"角色字段"（每个字段可能对齐到不同员工）
    if (roles) {
      for (const roleKey of Object.keys(roles)) {
        const spec = roles[roleKey]
        const specObj = typeof spec === 'number' ? { startIndex: spec } : spec
        const roleStart = specObj.startIndex ?? 0
        const empField = specObj.empField ?? 'nameZh'
        const rolePool = specObj.filter ? EMPLOYEES.filter(specObj.filter) : EMPLOYEES
        if (rolePool.length === 0) continue
        const roleEmp = rolePool[(roleStart + i) % rolePool.length]
        finalOverrides[roleKey] = (roleEmp as any)[empField]
      }
    }

    return { ...record, ...finalOverrides }
  })
}

/**
 * 按员工 ID 精确对齐单条记录
 */
export function alignByEmployeeId<T extends Record<string, any>>(
  record: T,
  employeeId: number
): T {
  const emp = EMPLOYEES.find((e) => e.id === employeeId)
  if (!emp) return record
  return alignEmployeeFields([record], {
    startIndex: EMPLOYEES.indexOf(emp)
  })[0]
}

/** 便捷：从员工池取指定角色的员工（如 HR / 部门负责人） */
export const getSampleEmployees = {
  /** 取前 N 个 */
  first(n: number) {
    return EMPLOYEES.slice(0, n)
  },
  /** 按岗位族筛选 */
  byFamily(family: string, limit = 50) {
    return EMPLOYEES.filter((e) => e.jobFamily === family).slice(0, limit)
  },
  /** HR 部门员工（orgId=9） */
  hrStaff(limit = 10) {
    return EMPLOYEES.filter((e) => e.orgId === 9).slice(0, limit)
  },
  /** 管理族员工（可做审批人） */
  managers(limit = 20) {
    return EMPLOYEES.filter((e) => e.jobFamily === 'MGMT').slice(0, limit)
  }
}
