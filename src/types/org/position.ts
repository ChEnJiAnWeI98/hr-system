/**
 * 岗位体系 类型定义（Phase 1.3）
 *
 * 三层结构：
 *   岗位族（Job Family）
 *    └ 岗位序列（Job Sequence）
 *        └ 岗位（Position）
 *            适用职级范围（Level Range）
 *
 * 职级体系：
 *   专业序列 P1 ~ P10
 *   管理序列 M1 ~ M5
 */

/** 岗位族编码（对应字典 JOB_FAMILY） */
export type JobFamilyCode = 'TECH' | 'PROD' | 'SALES' | 'OPS' | 'FUNC' | 'MGMT'

/** 职级通道 */
export type LevelTrack = 'professional' | 'management'

/**
 * 职级
 */
export interface LevelSpec {
  /** 职级编码 P1~P10 / M1~M5 */
  code: string
  /** 显示名 */
  name: string
  /** 通道 */
  track: LevelTrack
  /** 排序（数值越大级别越高） */
  rank: number
}

/**
 * 岗位序列
 */
export interface JobSequence {
  /** 序列编码 */
  code: string
  /** 序列名称 */
  name: string
  /** 所属岗位族 */
  familyCode: JobFamilyCode
  /** 描述 */
  description?: string
  /** 适用职级范围（min / max） */
  levelMin: string
  levelMax: string
}

/**
 * 岗位
 */
export interface Position {
  id: number
  /** 岗位编码 */
  positionCode: string
  /** 岗位名称 */
  positionName: string
  /** 岗位族 */
  familyCode: JobFamilyCode
  /** 岗位序列 */
  sequenceCode: string
  /** 适用职级范围 */
  levelMin: string
  levelMax: string
  /** 职责描述 */
  jobDescription: string
  /** 任职资格 */
  qualification: string
  /** 岗位等级（用于显示） */
  status: 0 | 1
  /** 排序 */
  sortOrder: number
  createTime: string
  updateTime: string
}

/** 岗位矩阵（序列 × 职级） */
export interface PositionMatrixCell {
  sequenceCode: string
  levelCode: string
  positions: Position[]
}

/** 查询参数 */
export interface PositionListParams {
  positionName?: string
  familyCode?: JobFamilyCode | ''
  sequenceCode?: string
  levelCode?: string
  status?: 0 | 1 | null
}

/** 字典 */
export const LEVEL_TRACK_LABEL: Record<LevelTrack, string> = {
  professional: '专业通道',
  management: '管理通道'
}
