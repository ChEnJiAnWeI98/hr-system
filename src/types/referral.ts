/**
 * 内推体系 Phase 3.2 类型定义
 * 对应需求说明书 11.3.4 内推体系 + 业务规则 REF-001 ~ REF-008
 */

/** 内推来源渠道：1-链接 2-海报扫码 3-手动录入 */
export type ReferralChannel = 1 | 2 | 3

/** 内推状态：1-已推荐 2-进入面试 3-已发Offer 4-已入职 5-试用通过 6-已淘汰 7-已过期 */
export type ReferralStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** 奖励阶段：面试奖 / Offer 奖 / 入职奖 / 试用通过奖 */
export type RewardStage = 'interview' | 'offer' | 'onboard' | 'pass_probation'

/** 奖励形式：1-现金 2-积分 3-礼品 */
export type RewardType = 1 | 2 | 3

/** 奖励单状态：0-待触发 1-待审批 2-已通过 3-已拒绝 4-已发放 */
export type RewardOrderStatus = 0 | 1 | 2 | 3 | 4

/**
 * 内推记录
 */
export interface Referral {
  id: number
  /** 内推编号 */
  referralNo: string
  /** 推荐人 ID */
  referrerId: number
  /** 推荐人姓名 */
  referrerName: string
  /** 推荐人部门 */
  referrerDept: string
  /** 候选人姓名 */
  candidateName: string
  /** 候选人手机 */
  candidatePhone: string
  /** 候选人邮箱 */
  candidateEmail: string
  /** 职位 ID */
  jobId: number
  /** 职位名称 */
  jobTitle: string
  /** 内推渠道 */
  channel: ReferralChannel
  /** 内推链接 token（仅链接/海报渠道） */
  linkToken?: string
  /** 状态 */
  status: ReferralStatus
  /** 关联简历 ID（创建后回写） */
  resumeId?: number
  /** 关联 Offer ID（发 Offer 后回写） */
  offerId?: number
  /** 关联入职 ID（入职后回写） */
  onboardingId?: number
  /** 是否疑似重复（90 天内其他员工已推荐） */
  isDuplicate?: boolean
  /** 重复提示 */
  duplicateRemark?: string
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
  /** 状态最近变更时间 */
  lastStatusTime?: string
}

/**
 * 内推记录查询参数
 */
export interface ReferralListParams {
  referrerName?: string
  referrerId?: number
  candidateName?: string
  jobTitle?: string
  status?: ReferralStatus | string | null
  channel?: ReferralChannel | string | null
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

/**
 * 内推奖励规则
 */
export interface ReferralRewardRule {
  id: number
  /** 规则名称 */
  name: string
  /** 适用岗位族 */
  jobFamily: string
  /** 适用职级（如 P5/P6/P7/P8 或 "全部"） */
  level: string
  /** 奖励形式 */
  rewardType: RewardType
  /** 面试奖（元/积分，下同） */
  interviewAward: number
  /** Offer 奖 */
  offerAward: number
  /** 入职奖 */
  onboardAward: number
  /** 试用期通过奖 */
  passProbationAward: number
  /** 启用状态：0-禁用 1-启用 */
  status: 0 | 1
  /** 生效日期 */
  effectiveDate?: string
  /** 备注 */
  remark?: string
  createTime: string
  updateTime: string
}

/**
 * 奖励结算单
 */
export interface ReferralRewardOrder {
  id: number
  orderNo: string
  referralId: number
  referralNo: string
  referrerId: number
  referrerName: string
  candidateName: string
  jobTitle: string
  stage: RewardStage
  /** 奖励形式 */
  rewardType: RewardType
  /** 金额 */
  amount: number
  /** 状态 */
  status: RewardOrderStatus
  /** 审批人 */
  approverName?: string
  approveTime?: string
  approveRemark?: string
  /** 实际发放时间 */
  paidTime?: string
  createTime: string
  updateTime: string
}

/**
 * 排行榜行
 */
export interface ReferralLeaderboardRow {
  referrerId: number
  referrerName: string
  referrerDept: string
  /** 累计推荐数 */
  totalReferrals: number
  /** 面试成功数 */
  interviewCount: number
  /** Offer 数 */
  offerCount: number
  /** 入职数 */
  onboardCount: number
  /** 累计奖励（元） */
  totalRewards: number
}

/**
 * 生成内推链接响应
 */
export interface ReferralLinkInfo {
  jobId: number
  jobTitle: string
  referrerId: number
  referrerName: string
  linkToken: string
  linkUrl: string
  posterUrl: string
  createTime: string
}

/**
 * 内推开放职位卡片（职位池）
 */
export interface ReferralOpenJob {
  jobId: number
  jobNo: string
  jobTitle: string
  departmentName: string
  workLocation: string
  salaryRange: string
  jobFamily: string
  /** 匹配的奖励规则（若有） */
  rewardHint?: string
  /** 本职位累计推荐数 */
  referralCount: number
  /** 本职位累计入职数 */
  onboardCount: number
  publishTime: string
}

/** Element Plus Tag 类型别名 */
type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

/** 字典：内推状态标签 */
export const REFERRAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: '已推荐', type: 'info' },
  2: { label: '进入面试', type: 'warning' },
  3: { label: '已发Offer', type: 'primary' },
  4: { label: '已入职', type: 'success' },
  5: { label: '试用通过', type: 'success' },
  6: { label: '已淘汰', type: 'danger' },
  7: { label: '已过期', type: 'info' }
}

export const REWARD_STAGE_LABEL: Record<string, string> = {
  interview: '面试奖',
  offer: 'Offer 奖',
  onboard: '入职奖',
  pass_probation: '试用通过奖'
}

export const REWARD_TYPE_LABEL: Record<number, string> = {
  1: '现金',
  2: '积分',
  3: '礼品'
}

export const REWARD_ORDER_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '待触发', type: 'info' },
  1: { label: '待审批', type: 'warning' },
  2: { label: '审批通过', type: 'primary' },
  3: { label: '审批拒绝', type: 'danger' },
  4: { label: '已发放', type: 'success' }
}

export const REFERRAL_CHANNEL_LABEL: Record<number, string> = {
  1: '专属链接',
  2: '海报扫码',
  3: '手动录入'
}
