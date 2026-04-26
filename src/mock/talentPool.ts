/**
 * 人才库 Mock 数据
 * 包含候选人档案、人才池、查重、拉黑、冷冻、激活等专用操作
 */

import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  TalentProfile,
  TalentPool,
  DedupeCheckParams,
  DedupeCheckResult,
  TalentProfileListParams
} from '@/types/talentPool'

// ============ 人才池初始数据 ============
const talentPoolsInit: TalentPool[] = [
  {
    id: 1,
    poolName: '总人才库',
    poolType: 'system',
    description: '系统预置，所有入库候选人默认加入',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'all',
    createTime: '2025-12-01 10:00:00',
    updateTime: '2025-12-01 10:00:00'
  },
  {
    id: 2,
    poolName: '前端技术人才池',
    poolType: 'jobFamily',
    description: '前端开发、前端架构相关候选人',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'all',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-01-10 10:00:00'
  },
  {
    id: 3,
    poolName: '后端技术人才池',
    poolType: 'jobFamily',
    description: 'Java / Go / Python 后端开发相关候选人',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'all',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-01-10 10:00:00'
  },
  {
    id: 4,
    poolName: '产品设计人才池',
    poolType: 'jobFamily',
    description: '产品经理、UI/UX 设计候选人',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'all',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-01-10 10:00:00'
  },
  {
    id: 5,
    poolName: '2026 校招池',
    poolType: 'activity',
    description: '2026 年应届生招聘专用池',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'department',
    createTime: '2026-02-15 10:00:00',
    updateTime: '2026-02-15 10:00:00'
  },
  {
    id: 6,
    poolName: 'ABC 猎头专属池',
    poolType: 'hunter',
    description: 'ABC 猎头公司推荐候选人',
    ownerId: 3,
    ownerName: '张HR',
    status: 1,
    visibility: 'owner',
    createTime: '2026-03-01 10:00:00',
    updateTime: '2026-03-01 10:00:00'
  }
]

export const talentPoolMock = createCrudMock<TalentPool>(talentPoolsInit, {
  searchFields: ['poolName', 'description']
})

// ============ 候选人档案初始数据 ============
const talentProfilesInit: TalentProfile[] = [
  {
    id: 1,
    talentNo: 'TP202604001',
    name: '陈志远',
    gender: 'male',
    birthDate: '1993-05-12',
    mobile: '13900001001',
    email: 'chenzhiyuan@example.com',
    currentCity: '北京',
    expectedCity: '北京,上海',
    highestDegree: '硕士',
    school: '清华大学',
    major: '软件工程',
    workYears: 7,
    currentCompany: '某知名互联网大厂',
    currentPosition: '高级前端工程师',
    expectedSalary: '35K-45K',
    skills: 'Vue3,TypeScript,React,Node.js,性能优化',
    tags: '985/211院校,技术骨干,字节前员工',
    poolIds: '1,2',
    ownerId: 3,
    ownerName: '张HR',
    source: 'hunter',
    sourceDetail: 'ABC 猎头推荐',
    profileStatus: 'redlist',
    statusReason: '技术能力强，文化契合度高，重点关注',
    applyCount: 2,
    lastApplyTime: '2026-03-15 10:00:00',
    applyHistory: [
      { applyDate: '2026-03-15', positionName: '前端架构师', department: '技术部', status: '已Offer', resultTime: '2026-04-01' },
      { applyDate: '2025-11-20', positionName: '高级前端工程师', department: '技术部', status: '面试中（P5）', resultTime: '2025-12-05' }
    ],
    createTime: '2025-11-20 10:00:00',
    updateTime: '2026-04-01 10:00:00'
  },
  {
    id: 2,
    talentNo: 'TP202604002',
    name: '李思彤',
    gender: 'female',
    birthDate: '1995-08-23',
    mobile: '13900001002',
    email: 'lisitong@example.com',
    currentCity: '上海',
    expectedCity: '上海,杭州',
    highestDegree: '本科',
    school: '同济大学',
    major: '计算机科学',
    workYears: 5,
    currentCompany: '某金融科技公司',
    currentPosition: 'Java 工程师',
    expectedSalary: '25K-35K',
    skills: 'Java,Spring Boot,MyBatis,Redis,MySQL',
    tags: '金融行业,稳定',
    poolIds: '1,3',
    ownerId: 3,
    ownerName: '张HR',
    source: 'apply',
    sourceDetail: 'Boss直聘',
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: '2026-04-10 10:00:00',
    applyHistory: [
      { applyDate: '2026-04-10', positionName: '后端工程师', department: '技术部', status: '面试中', resultTime: '' }
    ],
    createTime: '2026-04-10 10:00:00',
    updateTime: '2026-04-12 10:00:00'
  },
  {
    id: 3,
    talentNo: 'TP202604003',
    name: '王浩然',
    gender: 'male',
    birthDate: '1992-03-15',
    mobile: '13900001003',
    email: 'wanghaoran@example.com',
    currentCity: '深圳',
    expectedCity: '深圳,广州',
    highestDegree: '本科',
    school: '中山大学',
    major: '软件工程',
    workYears: 8,
    currentCompany: '某电商平台',
    currentPosition: '产品经理',
    expectedSalary: '30K-40K',
    skills: 'B端产品设计,需求分析,Axure,Figma,数据分析',
    tags: 'B端产品,大厂经验',
    poolIds: '1,4',
    ownerId: 3,
    ownerName: '张HR',
    source: 'refer',
    sourceDetail: '内推人：李经理',
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: '2026-04-05 10:00:00',
    applyHistory: [
      { applyDate: '2026-04-05', positionName: '产品经理', department: '产品部', status: '面试中', resultTime: '' }
    ],
    createTime: '2026-04-05 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 4,
    talentNo: 'TP202604004',
    name: '张伟杰',
    gender: 'male',
    mobile: '13900001004',
    email: 'zhangweijie@example.com',
    currentCity: '北京',
    highestDegree: '大专',
    school: '北京工业职业技术学院',
    major: '计算机应用',
    workYears: 3,
    expectedSalary: '10K-15K',
    skills: 'PHP,MySQL,Linux',
    tags: '自学能力强',
    poolIds: '1',
    ownerId: 3,
    ownerName: '张HR',
    source: 'apply',
    sourceDetail: '智联招聘',
    profileStatus: 'blacklist',
    statusReason: '多次面试爽约，经核实无合理原因',
    applyCount: 3,
    lastApplyTime: '2026-02-10 10:00:00',
    applyHistory: [
      { applyDate: '2026-02-10', positionName: '后端工程师', department: '技术部', status: '已淘汰', resultTime: '2026-02-12' },
      { applyDate: '2025-09-15', positionName: 'PHP 工程师', department: '技术部', status: '已淘汰', resultTime: '2025-09-20' },
      { applyDate: '2025-05-12', positionName: '后端工程师', department: '技术部', status: '已淘汰', resultTime: '2025-05-15' }
    ],
    createTime: '2025-05-12 10:00:00',
    updateTime: '2026-02-12 10:00:00'
  },
  {
    id: 5,
    talentNo: 'TP202604005',
    name: '刘静雯',
    gender: 'female',
    birthDate: '1998-07-08',
    mobile: '13900001005',
    email: 'liujingwen@example.com',
    currentCity: '杭州',
    expectedCity: '杭州',
    highestDegree: '硕士',
    school: '浙江大学',
    major: '计算机',
    workYears: 0,
    expectedSalary: '18K-25K',
    skills: 'Python,机器学习,深度学习,Tensorflow',
    tags: '应届生,算法方向,科研背景',
    poolIds: '1,5',
    ownerId: 3,
    ownerName: '张HR',
    source: 'activity',
    sourceDetail: '2026 校招宣讲会',
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: '2026-03-20 10:00:00',
    applyHistory: [
      { applyDate: '2026-03-20', positionName: '算法工程师（校招）', department: '技术部', status: '面试中', resultTime: '' }
    ],
    createTime: '2026-03-20 10:00:00',
    updateTime: '2026-03-20 10:00:00'
  },
  {
    id: 6,
    talentNo: 'TP202604006',
    name: '赵明辉',
    gender: 'male',
    birthDate: '1990-11-30',
    mobile: '13900001006',
    email: 'zhaominghui@example.com',
    currentCity: '成都',
    highestDegree: '本科',
    school: '电子科技大学',
    major: '通信工程',
    workYears: 10,
    currentCompany: '某通信公司',
    currentPosition: '技术总监',
    expectedSalary: '60K-80K',
    skills: '技术管理,架构设计,团队建设',
    tags: '技术管理,高管候选人',
    poolIds: '1,6',
    ownerId: 3,
    ownerName: '张HR',
    source: 'hunter',
    sourceDetail: 'ABC 猎头推荐',
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: '2026-04-01 10:00:00',
    applyHistory: [
      { applyDate: '2026-04-01', positionName: '技术总监', department: '技术部', status: 'CEO 面', resultTime: '' }
    ],
    createTime: '2026-04-01 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 7,
    talentNo: 'TP202604007',
    name: '孙悦',
    gender: 'female',
    mobile: '13900001007',
    email: 'sunyue@example.com',
    currentCity: '北京',
    highestDegree: '本科',
    school: '北京理工大学',
    major: '视觉传达',
    workYears: 4,
    currentCompany: '某设计公司',
    currentPosition: 'UI设计师',
    expectedSalary: '18K-25K',
    skills: 'Figma,Sketch,交互设计,视觉设计,品牌设计',
    tags: 'UI设计,作品集优秀',
    poolIds: '1,4',
    ownerId: 3,
    ownerName: '张HR',
    source: 'search',
    sourceDetail: 'LinkedIn 主动搜寻',
    profileStatus: 'frozen',
    frozenUntil: '2026-10-01',
    statusReason: '当前暂无合适岗位，6 个月后再联系',
    applyCount: 1,
    lastApplyTime: '2026-01-15 10:00:00',
    applyHistory: [
      { applyDate: '2026-01-15', positionName: 'UI设计师', department: '产品部', status: '已淘汰', resultTime: '2026-01-25' }
    ],
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-04-01 10:00:00'
  },
  {
    id: 8,
    talentNo: 'TP202604008',
    name: '周雨田',
    gender: 'male',
    mobile: '13900001008',
    email: 'zhouyutian@example.com',
    currentCity: '武汉',
    expectedCity: '武汉,北京',
    highestDegree: '本科',
    school: '武汉大学',
    major: '计算机',
    workYears: 6,
    currentCompany: '某游戏公司',
    currentPosition: '资深测试工程师',
    expectedSalary: '20K-28K',
    skills: '自动化测试,性能测试,Python,JMeter',
    tags: '测试专家',
    poolIds: '1',
    ownerId: 3,
    ownerName: '张HR',
    source: 'apply',
    sourceDetail: '拉勾网',
    profileStatus: 'active',
    applyCount: 1,
    lastApplyTime: '2026-04-18 10:00:00',
    applyHistory: [
      { applyDate: '2026-04-18', positionName: '测试工程师', department: '技术部', status: '待筛选', resultTime: '' }
    ],
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-18 10:00:00'
  }
]

export const talentProfileMock = createCrudMock<TalentProfile>(talentProfilesInit, {
  searchFields: ['name', 'mobile', 'email', 'skills', 'tags', 'currentCompany', 'currentPosition']
})

/**
 * 获取候选人档案列表（带人才池过滤）
 */
export function getTalentProfileListMock(params: TalentProfileListParams) {
  let data = talentProfileMock.getData() as TalentProfile[]

  // 按人才池过滤
  if (params.poolId != null && params.poolId !== ('' as any)) {
    const pid = String(params.poolId)
    data = data.filter((p) => (p.poolIds || '').split(',').includes(pid))
  }

  // 按档案状态过滤
  if (params.profileStatus) {
    data = data.filter((p) => p.profileStatus === params.profileStatus)
  }

  // 按期望城市
  if (params.expectedCity) {
    data = data.filter((p) => (p.expectedCity || '').includes(params.expectedCity!))
  }

  // 最低工作年限
  if (params.minWorkYears != null && params.minWorkYears !== ('' as any)) {
    const min = Number(params.minWorkYears)
    data = data.filter((p) => (p.workYears || 0) >= min)
  }

  // 最低学历
  if (params.minDegree) {
    const rank: Record<string, number> = { 高中: 1, 大专: 2, 本科: 3, 硕士: 4, 博士: 5 }
    const minR = rank[params.minDegree] || 0
    data = data.filter((p) => (rank[p.highestDegree || ''] || 0) >= minR)
  }

  // 关键词：姓名/手机/邮箱/技能/标签/公司/职位
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    data = data.filter((p) =>
      [p.name, p.mobile, p.email, p.skills, p.tags, p.currentCompany, p.currentPosition]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(kw))
    )
  }

  // 来源
  if (params.source) {
    data = data.filter((p) => p.source === params.source)
  }

  const total = data.length
  const start = (params.page - 1) * params.pageSize
  const end = start + Number(params.pageSize)
  return { list: data.slice(start, end), total }
}

/**
 * 查重：基于手机号/邮箱/身份证三要素
 */
export function dedupeCheckMock(params: DedupeCheckParams): DedupeCheckResult {
  const data = talentProfileMock.getData() as TalentProfile[]
  if (params.mobile) {
    const m = data.find((p) => p.mobile === params.mobile)
    if (m) return { matched: true, profile: m, matchField: 'mobile' }
  }
  if (params.email) {
    const m = data.find((p) => p.email === params.email)
    if (m) return { matched: true, profile: m, matchField: 'email' }
  }
  if (params.idCard) {
    const m = data.find((p) => p.idCard === params.idCard)
    if (m) return { matched: true, profile: m, matchField: 'idCard' }
  }
  return { matched: false }
}

/**
 * 修改档案状态（拉黑 / 加红 / 冷冻 / 恢复活跃）
 */
export function updateProfileStatusMock(
  id: number,
  profileStatus: TalentProfile['profileStatus'],
  reason?: string,
  frozenUntil?: string
): TalentProfile {
  const data = talentProfileMock.getData() as TalentProfile[]
  const profile = data.find((p) => p.id === id)
  if (!profile) throw new Error('候选人档案不存在')
  profile.profileStatus = profileStatus
  profile.statusReason = reason
  if (profileStatus === 'frozen' && frozenUntil) {
    profile.frozenUntil = frozenUntil
  } else {
    profile.frozenUntil = undefined
  }
  profile.updateTime = new Date().toLocaleString('zh-CN')
  return profile
}

/**
 * 人才池内候选人数量统计（动态计算）
 */
export function getPoolCandidateCountsMock(): Record<number, number> {
  const profiles = talentProfileMock.getData() as TalentProfile[]
  const counts: Record<number, number> = {}
  const pools = talentPoolMock.getData() as TalentPool[]
  for (const pool of pools) counts[pool.id] = 0
  for (const p of profiles) {
    const ids = (p.poolIds || '').split(',').filter(Boolean).map(Number)
    for (const pid of ids) {
      if (pid in counts) counts[pid] = (counts[pid] || 0) + 1
    }
  }
  return counts
}
