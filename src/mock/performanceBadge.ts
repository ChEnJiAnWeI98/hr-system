/**
 * 徽章 Mock 数据（Phase C4）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  BadgeType,
  BadgeQuota,
  BadgeAward,
  BadgeBonusRule
} from '@/types/performanceBadge'

// ============ 徽章类型 ============
const badgeTypeData: BadgeType[] = [
  {
    id: 1,
    badgeCode: 'BDG-VAL-001',
    badgeName: '客户第一',
    icon: '🏆',
    category: 'value',
    description: '在客户满意度、响应速度等方面表现突出',
    pointValue: 20,
    monthlyLimit: 3,
    status: 1,
    sortOrder: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 2,
    badgeCode: 'BDG-VAL-002',
    badgeName: '极致追求',
    icon: '💎',
    category: 'value',
    description: '对产品/服务质量有极致要求，主动打磨细节',
    pointValue: 20,
    monthlyLimit: 3,
    status: 1,
    sortOrder: 2,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 3,
    badgeCode: 'BDG-ACH-001',
    badgeName: '超额交付',
    icon: '🚀',
    category: 'achievement',
    description: '关键 KR 超额完成，业绩数据显著优于预期',
    pointValue: 30,
    monthlyLimit: 2,
    status: 1,
    sortOrder: 10,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 4,
    badgeCode: 'BDG-ACH-002',
    badgeName: '救火队员',
    icon: '🔥',
    category: 'achievement',
    description: '在紧急项目或线上事故中挺身而出解决问题',
    pointValue: 30,
    monthlyLimit: 2,
    status: 1,
    sortOrder: 11,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 5,
    badgeCode: 'BDG-COL-001',
    badgeName: '给力伙伴',
    icon: '🤝',
    category: 'collaboration',
    description: '主动帮助同事解决问题，团队协作中展现了担当',
    pointValue: 10,
    monthlyLimit: 10,
    status: 1,
    sortOrder: 20,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 6,
    badgeCode: 'BDG-COL-002',
    badgeName: '知识贡献',
    icon: '📚',
    category: 'collaboration',
    description: '输出技术文档/知识分享/培训等，沉淀组织资产',
    pointValue: 15,
    monthlyLimit: 5,
    status: 1,
    sortOrder: 21,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 7,
    badgeCode: 'BDG-INN-001',
    badgeName: '创新突破',
    icon: '💡',
    category: 'innovation',
    description: '提出创新方案并落地，带来可衡量的业务价值',
    pointValue: 40,
    monthlyLimit: 1,
    status: 1,
    sortOrder: 30,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 8,
    badgeCode: 'BDG-INN-002',
    badgeName: '技术攻坚',
    icon: '⚙️',
    category: 'innovation',
    description: '攻克行业级技术难题，推动关键技术突破',
    pointValue: 40,
    monthlyLimit: 1,
    status: 1,
    sortOrder: 31,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  }
]

export const badgeTypeMock = createCrudMock<BadgeType>(badgeTypeData, {
  idField: 'id',
  searchFields: ['badgeName', 'badgeCode'],
  sortField: 'sortOrder'
})

// ============ 颁发配额 ============
const badgeQuotaData: BadgeQuota[] = [
  {
    id: 1,
    leaderName: '王总监',
    leaderId: 101,
    department: '技术研发中心',
    monthlyQuota: 10,
    extraQuota: 2,
    usedThisMonth: 7,
    extraUsedThisMonth: 1,
    resetDate: '2026-05-01',
    status: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-20 15:30:00'
  },
  {
    id: 2,
    leaderName: '陈总监',
    leaderId: 102,
    department: '产品设计中心',
    monthlyQuota: 8,
    extraQuota: 2,
    usedThisMonth: 5,
    extraUsedThisMonth: 0,
    resetDate: '2026-05-01',
    status: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 3,
    leaderName: '李总监',
    leaderId: 103,
    department: '运营市场中心',
    monthlyQuota: 6,
    extraQuota: 1,
    usedThisMonth: 6,
    extraUsedThisMonth: 1,
    resetDate: '2026-05-01',
    status: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-19 11:20:00'
  },
  {
    id: 4,
    leaderName: '张经理',
    leaderId: 201,
    department: '技术研发中心 / 后端组',
    monthlyQuota: 5,
    extraQuota: 0,
    usedThisMonth: 3,
    extraUsedThisMonth: 0,
    resetDate: '2026-05-01',
    status: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-17 14:30:00'
  },
  {
    id: 5,
    leaderName: '赵经理',
    leaderId: 202,
    department: '技术研发中心 / 前端组',
    monthlyQuota: 5,
    extraQuota: 0,
    usedThisMonth: 4,
    extraUsedThisMonth: 0,
    resetDate: '2026-05-01',
    status: 1,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-19 16:00:00'
  }
]

export const badgeQuotaMock = createCrudMock<BadgeQuota>(badgeQuotaData, {
  idField: 'id',
  searchFields: ['leaderName', 'department']
})

// ============ 颁发记录 ============
const badgeAwardData: BadgeAward[] = [
  {
    id: 1,
    badgeCode: 'BDG-ACH-001',
    badgeName: '超额交付',
    icon: '🚀',
    pointValue: 30,
    fromName: '王总监',
    fromId: 101,
    toName: '张伟',
    toId: 1001,
    toDepartment: '技术研发中心',
    reason: 'Q1 核心 KR 超额 15%，独立推动了新缓存架构上线，QPS 提升 40%',
    visibility: 'public',
    isExtra: false,
    awardTime: '2026-04-15 16:30',
    createTime: '2026-04-15 16:30:00'
  },
  {
    id: 2,
    badgeCode: 'BDG-COL-001',
    badgeName: '给力伙伴',
    icon: '🤝',
    pointValue: 10,
    fromName: '陈总监',
    fromId: 102,
    toName: '徐红',
    toId: 2001,
    toDepartment: '产品设计中心',
    reason: '主动协助新同事熟悉业务流程，分享了多份产品资料',
    visibility: 'team',
    isExtra: false,
    awardTime: '2026-04-12 11:00',
    createTime: '2026-04-12 11:00:00'
  },
  {
    id: 3,
    badgeCode: 'BDG-INN-001',
    badgeName: '创新突破',
    icon: '💡',
    pointValue: 40,
    fromName: '王总监',
    fromId: 101,
    toName: '李娜',
    toId: 1002,
    toDepartment: '技术研发中心',
    reason: '提出并落地 AI 代码审查方案，使团队代码质量提升 25%',
    visibility: 'public',
    isExtra: true,
    awardTime: '2026-04-10 09:30',
    createTime: '2026-04-10 09:30:00'
  },
  {
    id: 4,
    badgeCode: 'BDG-VAL-002',
    badgeName: '极致追求',
    icon: '💎',
    pointValue: 20,
    fromName: '陈总监',
    fromId: 102,
    toName: '朱涛',
    toId: 2006,
    toDepartment: '产品设计中心',
    reason: '对详情页交互打磨 5 轮，最终用户满意度提升明显',
    visibility: 'public',
    isExtra: false,
    awardTime: '2026-04-08 14:20',
    createTime: '2026-04-08 14:20:00'
  },
  {
    id: 5,
    badgeCode: 'BDG-ACH-002',
    badgeName: '救火队员',
    icon: '🔥',
    pointValue: 30,
    fromName: '李总监',
    fromId: 103,
    toName: '马超',
    toId: 3001,
    toDepartment: '运营市场中心',
    reason: '周末紧急处理线上活动问题，快速恢复服务',
    visibility: 'public',
    isExtra: false,
    awardTime: '2026-04-05 21:00',
    createTime: '2026-04-05 21:00:00'
  },
  {
    id: 6,
    badgeCode: 'BDG-COL-002',
    badgeName: '知识贡献',
    icon: '📚',
    pointValue: 15,
    fromName: '张经理',
    fromId: 201,
    toName: '陈欣',
    toId: 1011,
    toDepartment: '技术研发中心',
    reason: '组织了 3 场前端技术分享，沉淀了 5 份规范文档',
    visibility: 'team',
    isExtra: false,
    awardTime: '2026-04-03 15:30',
    createTime: '2026-04-03 15:30:00'
  }
]

export const badgeAwardMock = createCrudMock<BadgeAward>(badgeAwardData, {
  idField: 'id',
  searchFields: ['fromName', 'toName', 'badgeName', 'reason'],
  sortField: 'awardTime'
})

// ============ 奖金联动规则 ============
const badgeBonusRuleData: BadgeBonusRule[] = [
  {
    id: 1,
    ruleName: '2026 年度徽章奖金加成规则',
    cyclePeriod: '2026 年度',
    top10Bonus: 15,
    top25Bonus: 8,
    effectiveTime: '2026-01-01',
    description: '按全年累计徽章积分排名：Top 10% 额外加成 15% 年终奖，Top 25% 额外加成 8%',
    status: 1,
    createTime: '2025-12-20 10:00:00',
    updateTime: '2025-12-20 10:00:00'
  },
  {
    id: 2,
    ruleName: '2025 年度徽章奖金加成规则（历史）',
    cyclePeriod: '2025 年度',
    top10Bonus: 12,
    top25Bonus: 6,
    effectiveTime: '2025-01-01',
    description: '已归档',
    status: 0,
    createTime: '2024-12-20 10:00:00',
    updateTime: '2026-01-15 10:00:00'
  }
]

export const badgeBonusRuleMock = createCrudMock<BadgeBonusRule>(badgeBonusRuleData, {
  idField: 'id',
  searchFields: ['ruleName', 'cyclePeriod']
})
