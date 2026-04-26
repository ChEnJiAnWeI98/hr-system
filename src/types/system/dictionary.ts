/**
 * 数据字典 类型定义（Phase 1.1）
 *
 * 统一管理全系统 22 种基础字典：
 * - 基础字典（性别/教育/婚姻/民族等 9 种）
 * - 组织岗位（3 种）
 * - 员工状态/合同/异动（4 种）
 * - 考勤假期（3 种）
 * - 薪酬福利（3 种）
 */

/** 字典分组 */
export type DictGroup =
  | 'basic' // 基础字典（性别、教育、婚姻等）
  | 'org' // 组织相关
  | 'position' // 岗位相关
  | 'employee' // 员工状态 / 合同 / 异动
  | 'attendance' // 考勤假期
  | 'comp' // 薪酬福利
  | 'training' // 培训证书（预留）
  | 'system' // 审批流等系统字典（预留）

/** 字典项 */
export interface DictItem {
  /** 字典值（存储用） */
  value: string | number
  /** 显示名 */
  label: string
  /** 排序 */
  sortOrder: number
  /** 启用状态：0=禁用 / 1=启用 */
  status: 0 | 1
  /** 父字典值（支持父子字典，如民族下 56 项） */
  parentValue?: string | number
  /** 扩展字段（用于存 type/color/icon 等） */
  extra?: Record<string, any>
}

/** 字典 */
export interface DictEntry {
  /** 字典编码（如 EDUCATION、EMP_STATUS） */
  dictCode: string
  /** 字典名称 */
  dictName: string
  /** 字典分组 */
  dictGroup: DictGroup
  /** 描述 */
  description?: string
  /** 是否系统字典（系统字典不可删除） */
  isSystem: boolean
  /** 是否允许编辑字典项 */
  editable: boolean
  /** 字典项列表 */
  items: DictItem[]
  /** 字典启用状态 */
  status: 0 | 1
  /** 排序 */
  sortOrder: number
}

/** 字典查询参数（管理页用） */
export interface DictListParams {
  dictName?: string
  dictCode?: string
  dictGroup?: DictGroup | ''
  status?: 0 | 1 | null
}

/** 字典分组 label */
export const DICT_GROUP_LABEL: Record<DictGroup, string> = {
  basic: '基础字典',
  org: '组织',
  position: '岗位',
  employee: '员工',
  attendance: '考勤假期',
  comp: '薪酬福利',
  training: '培训证书',
  system: '系统'
}
