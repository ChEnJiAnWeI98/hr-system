// @ts-nocheck
/**
 * 1on1 / 持续反馈 Mock（Phase B1）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type {
  OneOnOne,
  FeedbackRecord,
  BadgeType,
  Recognition
} from '@/types/performanceOneOnOne'

/* ========== 1on1 记录 ========== */
const initialOneOnOnes: OneOnOne[] = [
  {
    id: 1,
    oneOnOneNo: 'O2O20260410001',
    employeeId: 201,
    employeeName: '张三',
    departmentName: '技术部',
    leaderId: 101,
    leaderName: '李技术总监',
    initiator: 'leader',
    plannedTime: '2026-04-10 14:00:00',
    actualTime: '2026-04-10 14:05:00',
    duration: 30,
    employeePrep: '1. Q2 订单系统重构的资源问题\n2. 下半年的晋升路径',
    leaderPrep: '1. 询问对 Q2 资源分配的看法\n2. 发展建议',
    minutes: '讨论了订单系统重构 Q2 的人力分配问题，同意补充 1 名后端；张三希望年底冲 P7，计划参加架构师训练营；上季度技术分享只完成 1 次（目标 3 次），Q2 需加强',
    keyDecisions: '补充 1 名后端资源；Q3 报名架构师训练营',
    followUpTasks: [
      { content: '张 HR 跟进新增后端 HC', dueDate: '2026-04-20' },
      { content: '提交架构师训练营申请', dueDate: '2026-06-30' }
    ],
    status: 'completed',
    createTime: '2026-04-08 10:00:00',
    updateTime: '2026-04-10 15:00:00'
  },
  {
    id: 2,
    oneOnOneNo: 'O2O20260415001',
    employeeId: 202,
    employeeName: '李前端',
    departmentName: '技术部',
    leaderId: 101,
    leaderName: '李技术总监',
    initiator: 'employee',
    plannedTime: '2026-04-24 15:00:00',
    employeePrep: '最近遇到了一些技术选型的困惑，想和 Leader 讨论',
    status: 'pending',
    createTime: '2026-04-15 11:00:00',
    updateTime: '2026-04-15 11:00:00'
  },
  {
    id: 3,
    oneOnOneNo: 'O2O20260418001',
    employeeId: 203,
    employeeName: '周运维',
    departmentName: '技术部',
    leaderId: 101,
    leaderName: '李技术总监',
    initiator: 'leader',
    plannedTime: '2026-04-18 10:00:00',
    actualTime: '2026-04-18 10:00:00',
    duration: 45,
    minutes: '讨论了运维工具升级方向，KR 没对齐好，需要重新细化目标',
    keyDecisions: '两周内重新提交 OKR',
    followUpTasks: [{ content: '重新提交 OKR', dueDate: '2026-04-25' }],
    status: 'completed',
    createTime: '2026-04-17 10:00:00',
    updateTime: '2026-04-18 11:00:00'
  },
  {
    id: 4,
    oneOnOneNo: 'O2O20260401001',
    employeeId: 301,
    employeeName: '赵销售',
    departmentName: '销售部',
    leaderId: 302,
    leaderName: '刘销售主管',
    initiator: 'leader',
    plannedTime: '2026-04-03 15:00:00',
    actualTime: '2026-04-03 15:10:00',
    duration: 25,
    minutes: 'Q1 业绩亮眼，客户拜访记录填写需要加强；Q2 争取再拓展华东 5 家新客户',
    keyDecisions: 'Q2 销售额目标 380 万',
    status: 'completed',
    createTime: '2026-04-01 10:00:00',
    updateTime: '2026-04-03 16:00:00'
  }
]

export const oneOnOneMock = createCrudMock<OneOnOne>(alignEmployeeFields(initialOneOnOnes), {
  searchFields: ['employeeName', 'leaderName', 'oneOnOneNo'],
  sortField: 'plannedTime'
})

/* ========== 即时反馈 ========== */
const initialFeedbacks: FeedbackRecord[] = [
  {
    id: 1,
    feedbackNo: 'FB20260418001',
    fromId: 101,
    fromName: '李技术总监',
    toId: 201,
    toName: '张三',
    toDepartment: '技术部',
    type: 'appreciation',
    content: '今天的性能调优方案拆解特别清晰，团队受益匪浅！',
    context: '订单系统 P99 优化评审',
    visibility: 'with_leader',
    createTime: '2026-04-18 16:30:00'
  },
  {
    id: 2,
    feedbackNo: 'FB20260417001',
    fromId: 202,
    fromName: '李前端',
    toId: 201,
    toName: '张三',
    toDepartment: '技术部',
    type: 'appreciation',
    content: '感谢代码 review 时给的详细建议，修完后性能提升明显',
    visibility: 'private',
    createTime: '2026-04-17 14:00:00'
  },
  {
    id: 3,
    feedbackNo: 'FB20260416001',
    fromId: 101,
    fromName: '李技术总监',
    toId: 203,
    toName: '周运维',
    toDepartment: '技术部',
    type: 'suggestion',
    content: 'OKR 可以更具体些，目标值需要量化',
    context: 'Q2 OKR 目标评审',
    visibility: 'private',
    createTime: '2026-04-16 14:00:00'
  },
  {
    id: 4,
    feedbackNo: 'FB20260415001',
    fromId: 302,
    fromName: '刘销售主管',
    toId: 301,
    toName: '赵销售',
    toDepartment: '销售部',
    type: 'appreciation',
    content: 'Q1 销售目标超额达成 7%，全组第一，继续保持！',
    visibility: 'public',
    createTime: '2026-04-15 17:00:00'
  },
  {
    id: 5,
    feedbackNo: 'FB20260414001',
    fromId: 302,
    fromName: '刘销售主管',
    toId: 301,
    toName: '赵销售',
    toDepartment: '销售部',
    type: 'correction',
    content: 'CRM 里有 3 个客户拜访没记录，请及时补上',
    visibility: 'private',
    createTime: '2026-04-14 11:00:00'
  }
]

export const feedbackMock = createCrudMock<FeedbackRecord>(initialFeedbacks, {
  searchFields: ['fromName', 'toName', 'content'],
  sortField: 'createTime'
})

/* ========== 徽章类型 ========== */
const initialBadgeTypes: BadgeType[] = [
  { id: 1, code: 'team_player', name: '团队合作之星', icon: '🤝', valueTag: '团队合作', points: 10, description: '积极配合团队、推动跨团队协作', enabled: 1 },
  { id: 2, code: 'innovator', name: '创新先锋', icon: '💡', valueTag: '创新突破', points: 15, description: '提出有价值的创新想法或方案', enabled: 1 },
  { id: 3, code: 'customer_first', name: '用户至上', icon: '❤️', valueTag: '用户至上', points: 10, description: '以客户/用户为中心解决问题', enabled: 1 },
  { id: 4, code: 'problem_solver', name: '问题解决专家', icon: '🛠', valueTag: '执行力', points: 10, description: '有效解决复杂问题、消除团队阻碍', enabled: 1 },
  { id: 5, code: 'mentor', name: '最佳导师', icon: '🎓', valueTag: '人才培养', points: 15, description: '耐心带教、培养新人快速成长', enabled: 1 },
  { id: 6, code: 'quarter_mvp', name: '季度 MVP', icon: '🏆', valueTag: '卓越', points: 50, description: '季度最佳贡献者（限 Leader/HR 颁发）', enabled: 1 }
]

export const badgeTypeMock = createCrudMock<BadgeType>(initialBadgeTypes, {
  searchFields: ['name', 'code']
})

/* ========== 认可徽章记录 ========== */
const initialRecognitions: Recognition[] = [
  {
    id: 1,
    badgeTypeCode: 'team_player',
    badgeTypeName: '团队合作之星',
    badgeIcon: '🤝',
    fromId: 202, fromName: '李前端', fromRole: 'peer',
    toId: 201, toName: '张三', toDepartment: '技术部',
    reason: 'Code review 一丝不苟，帮我定位了关键 bug',
    points: 10,
    createTime: '2026-04-17 15:00:00'
  },
  {
    id: 2,
    badgeTypeCode: 'mentor',
    badgeTypeName: '最佳导师',
    badgeIcon: '🎓',
    fromId: 210, fromName: '陈后端', fromRole: 'peer',
    toId: 201, toName: '张三', toDepartment: '技术部',
    reason: '入职指导非常耐心，1 个月帮我上手了订单系统',
    points: 15,
    createTime: '2026-04-16 18:00:00'
  },
  {
    id: 3,
    badgeTypeCode: 'innovator',
    badgeTypeName: '创新先锋',
    badgeIcon: '💡',
    fromId: 101, fromName: '李技术总监', fromRole: 'leader',
    toId: 201, toName: '张三', toDepartment: '技术部',
    reason: '提出了双活架构方案，显著提升了系统可用性',
    points: 15,
    createTime: '2026-04-15 14:00:00'
  },
  {
    id: 4,
    badgeTypeCode: 'quarter_mvp',
    badgeTypeName: '季度 MVP',
    badgeIcon: '🏆',
    fromId: 302, fromName: '刘销售主管', fromRole: 'leader',
    toId: 301, toName: '赵销售', toDepartment: '销售部',
    reason: 'Q1 超额达成销售指标 7%，组内第一',
    points: 50,
    createTime: '2026-04-05 10:00:00'
  },
  {
    id: 5,
    badgeTypeCode: 'customer_first',
    badgeTypeName: '用户至上',
    badgeIcon: '❤️',
    fromId: 310, fromName: '销售 VP', fromRole: 'leader',
    toId: 301, toName: '赵销售', toDepartment: '销售部',
    reason: '为 A 类客户专门加班做了技术方案支持',
    points: 10,
    createTime: '2026-03-28 17:00:00'
  },
  {
    id: 6,
    badgeTypeCode: 'problem_solver',
    badgeTypeName: '问题解决专家',
    badgeIcon: '🛠',
    fromId: 201, fromName: '张三', fromRole: 'peer',
    toId: 203, toName: '周运维', toDepartment: '技术部',
    reason: '线上故障 15 分钟内定位并修复',
    points: 10,
    createTime: '2026-04-10 23:30:00'
  }
]

export const recognitionMock = createCrudMock<Recognition>(initialRecognitions, {
  searchFields: ['toName', 'fromName', 'reason'],
  sortField: 'createTime'
})

/* ========== 业务方法 ========== */

export function scheduleOneOnOneMock(id: number, plannedTime: string) {
  const m = oneOnOneMock.getDetail(id)
  if (!m) throw new Error('1on1 不存在')
  m.plannedTime = plannedTime
  m.updateTime = new Date().toLocaleString('zh-CN')
  oneOnOneMock.update(m)
  return m
}

export function completeOneOnOneMock(id: number, data: Partial<OneOnOne>) {
  const m = oneOnOneMock.getDetail(id)
  if (!m) throw new Error('1on1 不存在')
  Object.assign(m, data)
  m.status = 'completed'
  m.actualTime = m.actualTime || new Date().toLocaleString('zh-CN')
  m.updateTime = new Date().toLocaleString('zh-CN')
  oneOnOneMock.update(m)
  return m
}

/**
 * 获取员工徽章墙汇总
 */
export function getBadgeWallMock(employeeId: number) {
  const myRecognitions = recognitionMock.getData().filter((r) => r.toId === employeeId)
  const totalPoints = myRecognitions.reduce((s, r) => s + r.points, 0)

  // 按徽章类型分组
  const groupMap = new Map<string, { code: string; name: string; icon: string; count: number; totalPoints: number }>()
  for (const r of myRecognitions) {
    if (!groupMap.has(r.badgeTypeCode)) {
      groupMap.set(r.badgeTypeCode, {
        code: r.badgeTypeCode, name: r.badgeTypeName, icon: r.badgeIcon, count: 0, totalPoints: 0
      })
    }
    const g = groupMap.get(r.badgeTypeCode)!
    g.count++
    g.totalPoints += r.points
  }
  return {
    employeeId,
    totalBadges: myRecognitions.length,
    totalPoints,
    groupedBadges: [...groupMap.values()].sort((a, b) => b.count - a.count),
    recentRecognitions: myRecognitions.slice(0, 10)
  }
}

/**
 * 团队徽章排行榜
 */
export function getBadgeLeaderboardMock() {
  const all = recognitionMock.getData()
  const empMap = new Map<number, { employeeId: number; employeeName: string; department: string; badges: number; points: number }>()
  for (const r of all) {
    if (!empMap.has(r.toId)) {
      empMap.set(r.toId, {
        employeeId: r.toId, employeeName: r.toName, department: r.toDepartment,
        badges: 0, points: 0
      })
    }
    const e = empMap.get(r.toId)!
    e.badges++
    e.points += r.points
  }
  return [...empMap.values()].sort((a, b) => b.points - a.points)
}

/**
 * 1on1 统计
 */
export function getOneOnOneStatsMock() {
  const all = oneOnOneMock.getData()
  const completedCount = all.filter((m) => m.status === 'completed').length
  const pendingCount = all.filter((m) => m.status === 'pending').length
  // 覆盖率（独立员工/（员工 + Leader 对的总数）- 演示固定）
  const uniqueEmployees = new Set(all.map((m) => m.employeeId)).size
  const avgDuration = all
    .filter((m) => m.duration)
    .reduce((s, m) => s + (m.duration || 0), 0) / Math.max(1, all.filter((m) => m.duration).length)
  return {
    total: all.length,
    completedCount,
    pendingCount,
    uniqueEmployees,
    avgDuration: Math.round(avgDuration)
  }
}
