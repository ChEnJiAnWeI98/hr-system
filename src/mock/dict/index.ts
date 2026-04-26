/**
 * 字典总入口：汇总所有字典 Mock 数据
 * Phase 1.1 覆盖 22 种基础字典
 */
import type { DictEntry } from '@/types/system/dictionary'
import { BASIC_DICTS } from './basicDict'
import { ORG_DICTS } from './orgDict'
import { EMPLOYEE_DICTS } from './employeeDict'
import { ATTENDANCE_DICTS } from './attendanceDict'
import { COMP_DICTS } from './compDict'

/** 所有字典汇总（22 种） */
export const ALL_DICTS: DictEntry[] = [
  ...BASIC_DICTS, //    9 种
  ...ORG_DICTS, //      3 种
  ...EMPLOYEE_DICTS, // 4 种
  ...ATTENDANCE_DICTS, // 3 种
  ...COMP_DICTS //      3 种
]

/** 字典编码枚举（便于类型提示） */
export const DICT_CODES = {
  // 基础（9）
  GENDER: 'GENDER',
  EDUCATION: 'EDUCATION',
  MARITAL_STATUS: 'MARITAL_STATUS',
  POLITICAL_STATUS: 'POLITICAL_STATUS',
  NATION: 'NATION',
  NATIONALITY: 'NATIONALITY',
  CERTIFICATE_TYPE: 'CERTIFICATE_TYPE',
  EMERGENCY_RELATION: 'EMERGENCY_RELATION',
  LANGUAGE_LEVEL: 'LANGUAGE_LEVEL',
  // 组织岗位（3）
  ORG_TYPE: 'ORG_TYPE',
  ORG_NATURE: 'ORG_NATURE',
  JOB_FAMILY: 'JOB_FAMILY',
  // 员工（4）
  EMP_STATUS: 'EMP_STATUS',
  CONTRACT_TYPE: 'CONTRACT_TYPE',
  TRANSFER_TYPE: 'TRANSFER_TYPE',
  LEAVE_REASON_TYPE: 'LEAVE_REASON_TYPE',
  // 考勤假期（3）
  LEAVE_TYPE: 'LEAVE_TYPE',
  OVERTIME_TYPE: 'OVERTIME_TYPE',
  ATTENDANCE_STATUS: 'ATTENDANCE_STATUS',
  // 薪酬福利（3）
  SALARY_ITEM: 'SALARY_ITEM',
  SOCIAL_ITEM: 'SOCIAL_ITEM',
  WELFARE_ITEM: 'WELFARE_ITEM'
} as const

export type DictCode = (typeof DICT_CODES)[keyof typeof DICT_CODES]
