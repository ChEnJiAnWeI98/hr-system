// @ts-nocheck
/**
 * 内推体系 Mock 数据
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  Referral,
  ReferralRewardRule,
  ReferralRewardOrder,
  ReferralLeaderboardRow,
  ReferralOpenJob,
  ReferralLinkInfo
} from '@/types/referral'

/* ========== 内推记录 ========== */
const initialReferrals: Referral[] = [
  {
    id: 1,
    referralNo: 'REF202604001',
    referrerId: 1001,
    referrerName: '王研发',
    referrerDept: '技术部',
    candidateName: '孙八',
    candidatePhone: '13900139001',
    candidateEmail: 'sunba@example.com',
    jobId: 1,
    jobTitle: '前端开发工程师',
    channel: 1,
    linkToken: 'RLK-20260401-A1B2',
    status: 4,
    resumeId: 6,
    offerId: 7,
    onboardingId: 2,
    isDuplicate: false,
    remark: '前同事，技术扎实',
    createTime: '2026-04-01 10:00:00',
    updateTime: '2026-04-18 14:30:00',
    lastStatusTime: '2026-04-18 14:30:00'
  },
  {
    id: 2,
    referralNo: 'REF202604002',
    referrerId: 1002,
    referrerName: '陈产品',
    referrerDept: '产品部',
    candidateName: '林九',
    candidatePhone: '13900139002',
    candidateEmail: 'linjiu@example.com',
    jobId: 3,
    jobTitle: '产品经理',
    channel: 3,
    status: 3,
    resumeId: 7,
    offerId: 8,
    isDuplicate: false,
    remark: '',
    createTime: '2026-04-03 11:20:00',
    updateTime: '2026-04-16 17:00:00',
    lastStatusTime: '2026-04-16 17:00:00'
  },
  {
    id: 3,
    referralNo: 'REF202604003',
    referrerId: 1001,
    referrerName: '王研发',
    referrerDept: '技术部',
    candidateName: '周十',
    candidatePhone: '13900139003',
    candidateEmail: 'zhoushi@example.com',
    jobId: 2,
    jobTitle: 'Java后端工程师',
    channel: 1,
    linkToken: 'RLK-20260405-C3D4',
    status: 2,
    resumeId: 8,
    isDuplicate: false,
    remark: '',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-12 14:00:00',
    lastStatusTime: '2026-04-12 14:00:00'
  },
  {
    id: 4,
    referralNo: 'REF202604004',
    referrerId: 1003,
    referrerName: '赵运营',
    referrerDept: '运营部',
    candidateName: '吴十一',
    candidatePhone: '13900139004',
    candidateEmail: 'wushiyi@example.com',
    jobId: 4,
    jobTitle: 'UI设计师',
    channel: 2,
    linkToken: 'RLK-20260408-E5F6',
    status: 1,
    isDuplicate: false,
    remark: '校友',
    createTime: '2026-04-08 16:30:00',
    updateTime: '2026-04-08 16:30:00',
    lastStatusTime: '2026-04-08 16:30:00'
  },
  {
    id: 5,
    referralNo: 'REF202604005',
    referrerId: 1002,
    referrerName: '陈产品',
    referrerDept: '产品部',
    candidateName: '郑十二',
    candidatePhone: '13900139005',
    candidateEmail: 'zhengshier@example.com',
    jobId: 3,
    jobTitle: '产品经理',
    channel: 3,
    status: 6,
    isDuplicate: false,
    remark: '终面未通过',
    createTime: '2026-04-10 10:00:00',
    updateTime: '2026-04-17 18:00:00',
    lastStatusTime: '2026-04-17 18:00:00'
  },
  {
    id: 6,
    referralNo: 'REF202604006',
    referrerId: 1004,
    referrerName: '钱测试',
    referrerDept: '技术部',
    candidateName: '冯十三',
    candidatePhone: '13900139006',
    candidateEmail: 'fengshisan@example.com',
    jobId: 2,
    jobTitle: 'Java后端工程师',
    channel: 1,
    linkToken: 'RLK-20260412-G7H8',
    status: 5,
    resumeId: 9,
    onboardingId: 3,
    isDuplicate: false,
    remark: '内推入职+试用通过',
    createTime: '2026-01-12 10:00:00',
    updateTime: '2026-04-15 10:00:00',
    lastStatusTime: '2026-04-15 10:00:00'
  }
]

export const referralCrudMock = createCrudMock<Referral>(initialReferrals, {
  searchFields: ['referralNo', 'referrerName', 'candidateName', 'jobTitle'],
  sortField: 'createTime'
})

/* ========== 内推奖励规则 ========== */
const initialRewardRules: ReferralRewardRule[] = [
  {
    id: 1,
    name: '技术岗标准奖励',
    jobFamily: '技术研发',
    level: 'P5-P7',
    rewardType: 1,
    interviewAward: 200,
    offerAward: 1000,
    onboardAward: 3000,
    passProbationAward: 3000,
    status: 1,
    effectiveDate: '2026-01-01',
    remark: '技术岗位通用奖励方案',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    name: '高级技术岗奖励',
    jobFamily: '技术研发',
    level: 'P8+',
    rewardType: 1,
    interviewAward: 500,
    offerAward: 2000,
    onboardAward: 6000,
    passProbationAward: 6000,
    status: 1,
    effectiveDate: '2026-01-01',
    remark: '技术专家/架构师岗位',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 3,
    name: '产品设计岗奖励',
    jobFamily: '产品设计',
    level: '全部',
    rewardType: 1,
    interviewAward: 200,
    offerAward: 800,
    onboardAward: 2500,
    passProbationAward: 2500,
    status: 1,
    effectiveDate: '2026-01-01',
    remark: '',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 4,
    name: '管理岗奖励',
    jobFamily: '管理岗位',
    level: '全部',
    rewardType: 1,
    interviewAward: 1000,
    offerAward: 3000,
    onboardAward: 10000,
    passProbationAward: 10000,
    status: 1,
    effectiveDate: '2026-01-01',
    remark: '总监及以上',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 5,
    name: '积分激励方案',
    jobFamily: '职能支持',
    level: '全部',
    rewardType: 2,
    interviewAward: 50,
    offerAward: 200,
    onboardAward: 500,
    passProbationAward: 500,
    status: 1,
    effectiveDate: '2026-01-01',
    remark: '积分可在积分商城兑换',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  }
]

export const rewardRuleCrudMock = createCrudMock<ReferralRewardRule>(initialRewardRules, {
  searchFields: ['name', 'jobFamily', 'level']
})

/* ========== 奖励结算单 ========== */
const initialRewardOrders: ReferralRewardOrder[] = [
  {
    id: 1,
    orderNo: 'RWD202604001',
    referralId: 1,
    referralNo: 'REF202604001',
    referrerId: 1001,
    referrerName: '王研发',
    candidateName: '孙八',
    jobTitle: '前端开发工程师',
    stage: 'interview',
    rewardType: 1,
    amount: 200,
    status: 4,
    approverName: '张HR',
    approveTime: '2026-04-08 10:00:00',
    paidTime: '2026-04-10 10:00:00',
    createTime: '2026-04-07 10:00:00',
    updateTime: '2026-04-10 10:00:00'
  },
  {
    id: 2,
    orderNo: 'RWD202604002',
    referralId: 1,
    referralNo: 'REF202604001',
    referrerId: 1001,
    referrerName: '王研发',
    candidateName: '孙八',
    jobTitle: '前端开发工程师',
    stage: 'offer',
    rewardType: 1,
    amount: 1000,
    status: 4,
    approverName: '张HR',
    approveTime: '2026-04-14 10:00:00',
    paidTime: '2026-04-16 10:00:00',
    createTime: '2026-04-13 10:00:00',
    updateTime: '2026-04-16 10:00:00'
  },
  {
    id: 3,
    orderNo: 'RWD202604003',
    referralId: 1,
    referralNo: 'REF202604001',
    referrerId: 1001,
    referrerName: '王研发',
    candidateName: '孙八',
    jobTitle: '前端开发工程师',
    stage: 'onboard',
    rewardType: 1,
    amount: 3000,
    status: 2,
    approverName: '张HR',
    approveTime: '2026-04-18 15:00:00',
    createTime: '2026-04-18 14:40:00',
    updateTime: '2026-04-18 15:00:00'
  },
  {
    id: 4,
    orderNo: 'RWD202604004',
    referralId: 2,
    referralNo: 'REF202604002',
    referrerId: 1002,
    referrerName: '陈产品',
    candidateName: '林九',
    jobTitle: '产品经理',
    stage: 'offer',
    rewardType: 1,
    amount: 800,
    status: 1,
    createTime: '2026-04-16 17:10:00',
    updateTime: '2026-04-16 17:10:00'
  },
  {
    id: 5,
    orderNo: 'RWD202604005',
    referralId: 6,
    referralNo: 'REF202604006',
    referrerId: 1004,
    referrerName: '钱测试',
    candidateName: '冯十三',
    jobTitle: 'Java后端工程师',
    stage: 'pass_probation',
    rewardType: 1,
    amount: 3000,
    status: 1,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  }
]

export const rewardOrderCrudMock = createCrudMock<ReferralRewardOrder>(initialRewardOrders, {
  searchFields: ['orderNo', 'referrerName', 'candidateName', 'jobTitle']
})

/**
 * 审批结算单
 */
export function approveRewardOrderMock(id: number, approved: boolean, remark?: string): ReferralRewardOrder {
  const order = rewardOrderCrudMock.getDetail(id)
  if (!order) throw new Error('结算单不存在')
  order.status = approved ? 2 : 3
  order.approverName = '张HR'
  order.approveTime = new Date().toLocaleString('zh-CN')
  order.approveRemark = remark || ''
  order.updateTime = order.approveTime
  rewardOrderCrudMock.update(order)
  return order
}

/**
 * 发放结算单
 */
export function payRewardOrderMock(id: number): ReferralRewardOrder {
  const order = rewardOrderCrudMock.getDetail(id)
  if (!order) throw new Error('结算单不存在')
  if (order.status !== 2) throw new Error('仅已审批通过的结算单可发放')
  order.status = 4
  order.paidTime = new Date().toLocaleString('zh-CN')
  order.updateTime = order.paidTime
  rewardOrderCrudMock.update(order)
  return order
}

/* ========== 排行榜（聚合计算） ========== */
export function getLeaderboardMock(): ReferralLeaderboardRow[] {
  const referrals = referralCrudMock.getData()
  const orders = rewardOrderCrudMock.getData()
  const map = new Map<number, ReferralLeaderboardRow>()

  for (const r of referrals) {
    if (!map.has(r.referrerId)) {
      map.set(r.referrerId, {
        referrerId: r.referrerId,
        referrerName: r.referrerName,
        referrerDept: r.referrerDept,
        totalReferrals: 0,
        interviewCount: 0,
        offerCount: 0,
        onboardCount: 0,
        totalRewards: 0
      })
    }
    const row = map.get(r.referrerId)!
    row.totalReferrals++
    if ([2, 3, 4, 5].includes(r.status)) row.interviewCount++
    if ([3, 4, 5].includes(r.status)) row.offerCount++
    if ([4, 5].includes(r.status)) row.onboardCount++
  }

  for (const o of orders) {
    if (o.status === 4 && map.has(o.referrerId)) {
      map.get(o.referrerId)!.totalRewards += o.amount
    }
  }

  return [...map.values()].sort((a, b) => b.onboardCount - a.onboardCount || b.totalReferrals - a.totalReferrals)
}

/* ========== 生成内推链接（Mock） ========== */
export function generateReferralLinkMock(params: {
  jobId: number
  jobTitle: string
  referrerId: number
  referrerName: string
}): ReferralLinkInfo {
  const token = `RLK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  return {
    jobId: params.jobId,
    jobTitle: params.jobTitle,
    referrerId: params.referrerId,
    referrerName: params.referrerName,
    linkToken: token,
    linkUrl: `https://career.example.com/jobs/${params.jobId}?ref=${token}`,
    posterUrl: `https://career.example.com/poster/${params.jobId}?ref=${token}`,
    createTime: new Date().toLocaleString('zh-CN')
  }
}

/* ========== 内推职位池（基于 jobPosting.referralOpen=1 聚合） ========== */
export function getOpenJobsMock(): ReferralOpenJob[] {
  // 简化：直接返回固定列表，避免与 jobPosting mock 强耦合
  return [
    {
      jobId: 1,
      jobNo: 'JOB202604001',
      jobTitle: '前端开发工程师',
      departmentName: '技术部',
      workLocation: '北京市朝阳区',
      salaryRange: '15K-25K',
      jobFamily: '技术研发',
      rewardHint: '入职后可得 3000 元',
      referralCount: 2,
      onboardCount: 1,
      publishTime: '2026-04-01 09:00:00'
    },
    {
      jobId: 2,
      jobNo: 'JOB202604002',
      jobTitle: 'Java后端工程师',
      departmentName: '技术部',
      workLocation: '北京市海淀区',
      salaryRange: '18K-30K',
      jobFamily: '技术研发',
      rewardHint: '入职后可得 3000 元',
      referralCount: 2,
      onboardCount: 1,
      publishTime: '2026-04-01 10:00:00'
    },
    {
      jobId: 3,
      jobNo: 'JOB202604003',
      jobTitle: '产品经理',
      departmentName: '产品部',
      workLocation: '北京市朝阳区',
      salaryRange: '20K-35K',
      jobFamily: '产品设计',
      rewardHint: '入职后可得 2500 元',
      referralCount: 2,
      onboardCount: 0,
      publishTime: '2026-04-02 09:30:00'
    },
    {
      jobId: 4,
      jobNo: 'JOB202604004',
      jobTitle: 'UI设计师',
      departmentName: '设计部',
      workLocation: '北京市朝阳区',
      salaryRange: '12K-20K',
      jobFamily: '产品设计',
      rewardHint: '入职后可得 2500 元',
      referralCount: 1,
      onboardCount: 0,
      publishTime: '2026-04-02 10:30:00'
    }
  ]
}

/**
 * 90 天内重复校验（REF-007）
 */
export function checkReferralDuplicateMock(candidatePhone: string): { isDuplicate: boolean; existingReferrer?: string; existingDate?: string } {
  const referrals = referralCrudMock.getData()
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
  const match = referrals.find((r) => {
    if (r.candidatePhone !== candidatePhone) return false
    const t = new Date(r.createTime.replace(/-/g, '/')).getTime()
    return t > ninetyDaysAgo && [1, 2, 3, 4, 5].includes(r.status)
  })
  if (match) {
    return {
      isDuplicate: true,
      existingReferrer: match.referrerName,
      existingDate: match.createTime
    }
  }
  return { isDuplicate: false }
}

/**
 * 提交内推（Mock）
 */
export function submitReferralMock(data: Partial<Referral>): Referral {
  const dup = data.candidatePhone ? checkReferralDuplicateMock(data.candidatePhone) : { isDuplicate: false }
  const now = new Date().toLocaleString('zh-CN')
  const list = referralCrudMock.getData()
  const nextNo = `REF${now.slice(0, 4) + now.slice(5, 7)}${String(list.length + 1).padStart(3, '0')}`
  const newReferral: Referral = {
    id: Math.max(...list.map((r) => r.id), 0) + 1,
    referralNo: nextNo,
    referrerId: data.referrerId || 0,
    referrerName: data.referrerName || '',
    referrerDept: data.referrerDept || '',
    candidateName: data.candidateName || '',
    candidatePhone: data.candidatePhone || '',
    candidateEmail: data.candidateEmail || '',
    jobId: data.jobId || 0,
    jobTitle: data.jobTitle || '',
    channel: data.channel || 3,
    linkToken: data.linkToken,
    status: 1,
    isDuplicate: dup.isDuplicate,
    duplicateRemark: dup.isDuplicate ? `${dup.existingReferrer} 已于 ${dup.existingDate} 推荐` : '',
    remark: data.remark || '',
    createTime: now,
    updateTime: now,
    lastStatusTime: now
  }
  list.push(newReferral)
  return newReferral
}
