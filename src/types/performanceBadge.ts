/**
 * 徽章认可 管理端类型定义（Phase C4）
 */

/** 徽章类别 */
export type BadgeCategory = 'value' | 'achievement' | 'collaboration' | 'innovation' | 'custom'

/** 颁发可见性 */
export type BadgeVisibility = 'public' | 'team' | 'private'

/**
 * 徽章类型
 */
export interface BadgeType {
  id: number
  /** 徽章编码 */
  badgeCode: string
  /** 徽章名称 */
  badgeName: string
  /** 图标（emoji 或图标代码） */
  icon: string
  /** 类别 */
  category: BadgeCategory
  /** 描述 */
  description: string
  /** 积分值 */
  pointValue: number
  /** 月度颁发上限（0 = 不限） */
  monthlyLimit: number
  /** 是否启用 */
  status: 0 | 1
  /** 排序 */
  sortOrder: number
  createTime: string
  updateTime: string
}

/**
 * Leader 颁发配额
 */
export interface BadgeQuota {
  id: number
  /** Leader 姓名 */
  leaderName: string
  leaderId: number
  /** 所属部门 */
  department: string
  /** 月度基础配额（常规颁发数量） */
  monthlyQuota: number
  /** 额外配额（Leader 额外颁发权限，只限高价值徽章） */
  extraQuota: number
  /** 本月已用 */
  usedThisMonth: number
  /** 本月额外已用 */
  extraUsedThisMonth: number
  /** 重置日期 */
  resetDate: string
  status: 0 | 1
  createTime: string
  updateTime: string
}

/**
 * 颁发记录
 */
export interface BadgeAward {
  id: number
  /** 徽章编码 */
  badgeCode: string
  /** 徽章名称 */
  badgeName: string
  /** 图标 */
  icon: string
  /** 积分值 */
  pointValue: number
  /** 颁发人 */
  fromName: string
  fromId: number
  /** 接收人 */
  toName: string
  toId: number
  toDepartment: string
  /** 颁发理由 */
  reason: string
  /** 可见性 */
  visibility: BadgeVisibility
  /** 是否使用额外配额 */
  isExtra: boolean
  /** 颁发时间 */
  awardTime: string
  createTime: string
}

/**
 * 奖金联动规则
 */
export interface BadgeBonusRule {
  id: number
  /** 规则名称 */
  ruleName: string
  /** 适用周期（如年度） */
  cyclePeriod: string
  /** Top 10% 加成百分比 */
  top10Bonus: number
  /** Top 25% 加成百分比 */
  top25Bonus: number
  /** 生效时间 */
  effectiveTime: string
  /** 描述 */
  description: string
  status: 0 | 1
  createTime: string
  updateTime: string
}

/**
 * 列表查询参数
 */
export interface BadgeTypeListParams {
  badgeName?: string
  category?: BadgeCategory | ''
  status?: 0 | 1 | null
  page: number
  pageSize: number
}

export interface BadgeAwardListParams {
  fromName?: string
  toName?: string
  badgeCode?: string
  page: number
  pageSize: number
}

/** 字典 */
export const BADGE_CATEGORY_LABEL: Record<BadgeCategory, string> = {
  value: '价值观',
  achievement: '业绩成就',
  collaboration: '协作精神',
  innovation: '创新突破',
  custom: '自定义'
}

export const BADGE_CATEGORY_TYPE: Record<
  BadgeCategory,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  value: 'warning',
  achievement: 'success',
  collaboration: 'primary',
  innovation: 'danger',
  custom: 'info'
}

export const VISIBILITY_LABEL: Record<BadgeVisibility, string> = {
  public: '全员可见',
  team: '仅团队可见',
  private: '仅当事人可见'
}
