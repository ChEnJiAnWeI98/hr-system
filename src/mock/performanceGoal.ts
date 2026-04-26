// @ts-nocheck
/**
 * 目标管理 Mock 数据（Phase A3 升级版）
 */
import type {
  PerformanceGoal,
  KeyResult,
  GoalProgressLog,
  GoalTemplate
} from '@/types/performanceGoal'
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'

function buildKRs(items: Array<[string, string, string, number, number]>): KeyResult[] {
  return items.map(([desc, target, current, weight, progress]) => ({
    description: desc,
    targetValue: target,
    currentValue: current,
    weight,
    progress
  }))
}

// ========== 初始数据（覆盖公司/部门/个人三层 + OKR/KPI 双模式 + 各种状态）==========
const initialData: PerformanceGoal[] = [
  // 公司级 OKR（技术研发 CTO）
  {
    id: 1,
    goalNo: 'GOAL20260101001',
    employeeId: 100,
    employeeName: '王 CTO',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'company',
    goalTitle: '打造行业领先的技术平台',
    goalDescription: '通过核心系统重构 + 技术能力升级，在 Q2 内使系统可用性、性能、创新指标进入行业第一梯队',
    weight: 100,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['核心系统可用性', '99.99%', '99.95%', 40, 75],
      ['P0 接口 P99 延迟', '<200ms', '280ms', 30, 50],
      ['重构 3 个核心模块', '3 个', '1 个', 30, 33]
    ]),
    progress: 55,
    status: 1,
    statusName: '进行中',
    approvalStatus: 1,
    approverName: 'CEO',
    approveTime: '2026-04-10 10:00:00',
    approveComment: '认可方向，期待 Q2 交付',
    frozen: 0,
    lastProgressUpdate: '2026-04-18 14:00:00',
    lastUpdatedBy: '王 CTO',
    createTime: '2026-04-05 10:00:00',
    updateTime: '2026-04-18 14:00:00'
  },
  // 部门级 OKR（技术部负责人）
  {
    id: 2,
    goalNo: 'GOAL20260101002',
    employeeId: 101,
    employeeName: '李技术总监',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'department',
    parentGoalId: 1,
    parentGoalTitle: '打造行业领先的技术平台',
    goalTitle: '核心系统性能重构',
    goalDescription: '牵头核心订单系统 + 用户中心的重构项目',
    weight: 100,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['订单系统 QPS', '从 5000 提升至 15000', '8500', 50, 35],
      ['用户中心重构上线', '4 月完成', '进行中', 30, 60],
      ['团队代码覆盖率', '>= 75%', '68%', 20, 80]
    ]),
    progress: 50,
    status: 1,
    statusName: '进行中',
    approvalStatus: 1,
    approverName: '王 CTO',
    approveTime: '2026-04-12 10:00:00',
    approveComment: '同意，按计划推进',
    frozen: 0,
    lastProgressUpdate: '2026-04-19 09:30:00',
    lastUpdatedBy: '李技术总监',
    createTime: '2026-04-08 10:00:00',
    updateTime: '2026-04-19 09:30:00'
  },
  // 个人级 OKR（技术骨干 张三）
  {
    id: 3,
    goalNo: 'GOAL20260101003',
    employeeId: 201,
    employeeName: '张三',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    parentGoalId: 2,
    parentGoalTitle: '核心系统性能重构',
    goalTitle: '订单系统性能优化',
    goalDescription: '牵头订单核心接口的性能优化专项',
    weight: 60,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['下单接口 P99', '<150ms', '220ms', 50, 40],
      ['查询接口 QPS', '提升 3 倍', '提升 2 倍', 30, 66],
      ['技术方案评审通过', '3 个方案', '1 个', 20, 33]
    ]),
    progress: 46,
    status: 1,
    statusName: '进行中',
    approvalStatus: 1,
    approverName: '李技术总监',
    approveTime: '2026-04-15 10:00:00',
    approveComment: '目标清晰，加油',
    frozen: 0,
    lastProgressUpdate: '2026-04-18 16:00:00',
    lastUpdatedBy: '张三',
    createTime: '2026-04-10 10:00:00',
    updateTime: '2026-04-18 16:00:00'
  },
  // 个人级 OKR（张三的第二个目标）
  {
    id: 4,
    goalNo: 'GOAL20260101004',
    employeeId: 201,
    employeeName: '张三',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    parentGoalId: 2,
    parentGoalTitle: '核心系统性能重构',
    goalTitle: '技术分享与团队带教',
    goalDescription: '每月至少一次团队分享 + 带教一位新人',
    weight: 40,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['月度技术分享', '3 场', '1 场', 50, 33],
      ['新人带教', '1 位完成上手', '进行中', 50, 50]
    ]),
    progress: 42,
    status: 1,
    statusName: '进行中',
    approvalStatus: 1,
    approverName: '李技术总监',
    approveTime: '2026-04-15 10:00:00',
    frozen: 0,
    createTime: '2026-04-10 10:05:00',
    updateTime: '2026-04-15 16:00:00'
  },
  // 个人级 KPI（销售代表 赵销售）
  {
    id: 5,
    goalNo: 'GOAL20260101005',
    employeeId: 301,
    employeeName: '赵销售',
    departmentId: 3,
    departmentName: '销售部',
    jobFamily: '运营市场',
    cycleId: 5,
    cycleName: '2026 年度 KPI 考核',
    goalType: 2,
    goalTypeName: 'KPI',
    goalCategory: 'personal',
    goalTitle: '销售额目标',
    goalDescription: '完成 Q2 销售指标，重点拓展华东区域',
    weight: 60,
    targetValue: '800 万',
    currentValue: '320 万',
    progress: 40,
    status: 1,
    statusName: '进行中',
    approvalStatus: 1,
    approverName: '销售总监',
    approveTime: '2026-01-15 10:00:00',
    frozen: 0,
    lastProgressUpdate: '2026-04-15 18:00:00',
    lastUpdatedBy: '赵销售',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-04-15 18:00:00'
  },
  {
    id: 6,
    goalNo: 'GOAL20260101006',
    employeeId: 301,
    employeeName: '赵销售',
    departmentId: 3,
    departmentName: '销售部',
    jobFamily: '运营市场',
    cycleId: 5,
    cycleName: '2026 年度 KPI 考核',
    goalType: 2,
    goalTypeName: 'KPI',
    goalCategory: 'personal',
    goalTitle: '新客户开拓',
    goalDescription: '拓展华东区域新客户',
    weight: 40,
    targetValue: '20 家',
    currentValue: '8 家',
    progress: 40,
    status: 1,
    approvalStatus: 1,
    approverName: '销售总监',
    approveTime: '2026-01-15 10:00:00',
    frozen: 0,
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-04-01 10:00:00'
  },
  // 待审批状态目标
  {
    id: 7,
    goalNo: 'GOAL20260101007',
    employeeId: 202,
    employeeName: '李前端',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    parentGoalId: 2,
    parentGoalTitle: '核心系统性能重构',
    goalTitle: '前端性能监控体系建设',
    goalDescription: '建立前端性能监控平台，覆盖所有核心页面',
    weight: 50,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['监控平台上线', '完成', '待开始', 40, 0],
      ['核心页面 LCP', '<2s', '3s', 30, 30],
      ['监控告警准确率', '>=90%', '—', 30, 0]
    ]),
    progress: 10,
    status: 0,
    approvalStatus: 0,
    frozen: 0,
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-18 10:00:00'
  },
  // 已驳回状态目标
  {
    id: 8,
    goalNo: 'GOAL20260101008',
    employeeId: 203,
    employeeName: '周运维',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    goalTitle: '运维工具升级',
    goalDescription: '升级运维工具，目标过于宽泛',
    weight: 30,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([['工具升级', '待定', '', 100, 0]]),
    progress: 0,
    status: 0,
    approvalStatus: 2,
    approverName: '李技术总监',
    approveTime: '2026-04-16 14:00:00',
    approveComment: 'KR 不够具体，请细化到可量化指标',
    frozen: 0,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-16 14:00:00'
  },
  // 已冻结（周期已进入评估中）
  {
    id: 9,
    goalNo: 'GOAL20260101009',
    employeeId: 201,
    employeeName: '张三',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    goalTitle: 'Q1 核心项目交付',
    goalDescription: 'Q1 已完成，周期已归档',
    weight: 100,
    targetValue: '',
    currentValue: '',
    keyResults: buildKRs([
      ['项目 A 上线', '3 月', '3 月上线', 50, 100],
      ['Bug 数 <= 5', '<=5', '3 个', 30, 100],
      ['性能达标', '达标', '达标', 20, 100]
    ]),
    progress: 100,
    status: 2,
    approvalStatus: 1,
    frozen: 1,
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-04-05 10:00:00'
  }
]

export const performanceGoalMock = createCrudMock<PerformanceGoal>(alignEmployeeFields(initialData), {
  searchFields: ['goalTitle', 'goalDescription', 'employeeName', 'departmentName'],
  sortField: 'updateTime'
})

/* ========== 进度更新日志 ========== */
const initialLogs: GoalProgressLog[] = [
  {
    id: 1,
    goalId: 3,
    beforeProgress: 30,
    afterProgress: 46,
    beforeValue: '下单 P99: 280ms',
    afterValue: '下单 P99: 220ms',
    highlights: '完成了查询索引优化，QPS 提升显著',
    issues: '下单接口仍有 Slow SQL，需要进一步排查',
    nextPlan: '下周完成 SQL 优化 + 压测验证',
    updatedBy: '张三',
    updatedById: 201,
    updateTime: '2026-04-18 16:00:00'
  },
  {
    id: 2,
    goalId: 2,
    beforeProgress: 30,
    afterProgress: 50,
    highlights: '订单系统重构完成 30%，用户中心已开始',
    issues: '资源紧张，需要补充 1~2 位后端',
    nextPlan: '下周完成用户中心原型',
    updatedBy: '李技术总监',
    updatedById: 101,
    updateTime: '2026-04-19 09:30:00'
  },
  {
    id: 3,
    goalId: 5,
    beforeProgress: 25,
    afterProgress: 40,
    beforeValue: '200 万',
    afterValue: '320 万',
    highlights: '新签一家年订单 80 万的客户',
    issues: '部分客户回款节奏较慢',
    nextPlan: '加速回款 + 推进 3 家储备客户',
    updatedBy: '赵销售',
    updatedById: 301,
    updateTime: '2026-04-15 18:00:00'
  }
]

export const goalProgressLogMock = createCrudMock<GoalProgressLog>(alignEmployeeFields(initialLogs), {
  searchFields: ['highlights', 'issues', 'nextPlan', 'updatedBy'],
  sortField: 'updateTime'
})

/* ========== 目标模板库 ========== */
const initialTemplates: GoalTemplate[] = [
  {
    id: 1,
    templateName: '技术骨干 · OKR · 系统性能优化',
    jobFamily: '技术研发',
    level: 'P5-P7',
    goalType: 1,
    goalTitle: '核心系统性能优化',
    goalDescription: '提升所负责系统的性能、稳定性、可观测性',
    keyResults: [
      { description: '核心接口 P99 延迟下降 X%', targetValue: '—', currentValue: '', weight: 40, progress: 0 },
      { description: '可用性达到 99.XX%', targetValue: '—', currentValue: '', weight: 30, progress: 0 },
      { description: '完成 N 个技术分享', targetValue: '—', currentValue: '', weight: 30, progress: 0 }
    ],
    suggestedWeight: 40,
    remark: '适用技术骨干，建议权重 30~50%',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    templateName: '产品经理 · OKR · 核心产品迭代',
    jobFamily: '产品设计',
    level: 'P5-P7',
    goalType: 1,
    goalTitle: '核心产品迭代',
    goalDescription: '牵头核心产品的版本迭代和效果验证',
    keyResults: [
      { description: '完成 N 个核心功能上线', targetValue: '—', currentValue: '', weight: 40, progress: 0 },
      { description: '核心指标提升 X%', targetValue: '—', currentValue: '', weight: 40, progress: 0 },
      { description: '用户满意度 NPS >= X', targetValue: '—', currentValue: '', weight: 20, progress: 0 }
    ],
    suggestedWeight: 50,
    remark: '产品主责项目使用',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    templateName: '销售 · KPI · 销售额与回款',
    jobFamily: '运营市场',
    level: '全部',
    goalType: 2,
    goalTitle: '销售额目标',
    goalDescription: '完成销售回款目标',
    targetValue: '年度销售额 X 万元；回款率 >= 90%',
    suggestedWeight: 60,
    remark: '销售岗位核心 KPI',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 4,
    templateName: 'HR · KPI · 招聘交付',
    jobFamily: '职能支持',
    level: '全部',
    goalType: 2,
    goalTitle: '招聘交付',
    goalDescription: '按期交付部门招聘需求',
    targetValue: '季度完成 X 个岗位交付；Time-to-Hire <= 30 天',
    suggestedWeight: 40,
    remark: 'HR 招聘专员使用',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 5,
    templateName: '管理岗 · 混合 · 团队建设',
    jobFamily: '管理岗位',
    level: '总监及以上',
    goalType: 1,
    goalTitle: '团队建设与人才培养',
    goalDescription: '团队氛围、梯队建设、核心人才保留',
    keyResults: [
      { description: '团队 NPS >= X', targetValue: '—', currentValue: '', weight: 40, progress: 0 },
      { description: '梯队关键岗位继任者就绪', targetValue: '—', currentValue: '', weight: 40, progress: 0 },
      { description: '核心人才保留率 >= X%', targetValue: '—', currentValue: '', weight: 20, progress: 0 }
    ],
    suggestedWeight: 25,
    remark: '管理者必备目标',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  }
]

export const goalTemplateMock = createCrudMock<GoalTemplate>(initialTemplates, {
  searchFields: ['templateName', 'jobFamily', 'goalTitle']
})

/* ========== 业务操作 ========== */

/**
 * 审批目标
 */
export function approveGoalMock(id: number, approved: boolean, comment: string, approver: string, approverId: number) {
  const goal = performanceGoalMock.getDetail(id)
  if (!goal) throw new Error('目标不存在')
  if (goal.frozen === 1) throw new Error('目标已冻结，不可审批')
  goal.approvalStatus = approved ? 1 : 2
  goal.approverName = approver
  goal.approverId = approverId
  goal.approveTime = new Date().toLocaleString('zh-CN')
  goal.approveComment = comment
  goal.updateTime = goal.approveTime
  performanceGoalMock.update(goal)
  return goal
}

/**
 * 重新提交（已驳回 → 重新提交 → 待审批）
 */
export function resubmitGoalMock(id: number) {
  const goal = performanceGoalMock.getDetail(id)
  if (!goal) throw new Error('目标不存在')
  if (goal.approvalStatus !== 2) throw new Error('仅已驳回目标可重新提交')
  goal.approvalStatus = 3
  goal.updateTime = new Date().toLocaleString('zh-CN')
  performanceGoalMock.update(goal)
  return goal
}

/**
 * 更新进度（保留进度历史）
 */
export function updateGoalProgressMock(
  id: number,
  data: {
    afterProgress: number
    afterValue?: string
    keyResultsUpdate?: KeyResult[]
    highlights?: string
    issues?: string
    nextPlan?: string
    updatedBy: string
    updatedById: number
  }
) {
  const goal = performanceGoalMock.getDetail(id)
  if (!goal) throw new Error('目标不存在')
  if (goal.frozen === 1) throw new Error('目标已冻结，不可更新进度')
  if (goal.approvalStatus !== 1) throw new Error('仅已批准的目标可更新进度')

  const now = new Date().toLocaleString('zh-CN')

  // 记录进度日志
  const logs = goalProgressLogMock.getData()
  const nextLogId = Math.max(...logs.map((l) => l.id), 0) + 1
  const newLog: GoalProgressLog = {
    id: nextLogId,
    goalId: id,
    beforeProgress: goal.progress,
    afterProgress: data.afterProgress,
    beforeValue: goal.currentValue,
    afterValue: data.afterValue || goal.currentValue,
    highlights: data.highlights,
    issues: data.issues,
    nextPlan: data.nextPlan,
    updatedBy: data.updatedBy,
    updatedById: data.updatedById,
    updateTime: now
  }
  logs.push(newLog)

  // 更新目标
  goal.progress = data.afterProgress
  if (data.afterValue !== undefined) goal.currentValue = data.afterValue
  if (data.keyResultsUpdate) goal.keyResults = data.keyResultsUpdate
  if (data.afterProgress >= 100) goal.status = 2
  else if (data.afterProgress > 0) goal.status = 1
  goal.lastProgressUpdate = now
  goal.lastUpdatedBy = data.updatedBy
  goal.updateTime = now
  performanceGoalMock.update(goal)
  return { goal, log: newLog }
}

/**
 * 冻结目标（周期进入评估阶段时批量触发）
 */
export function freezeGoalsByCycleMock(cycleId: number) {
  const all = performanceGoalMock.getData()
  let count = 0
  for (const g of all) {
    if (g.cycleId === cycleId && g.frozen !== 1) {
      g.frozen = 1
      g.updateTime = new Date().toLocaleString('zh-CN')
      count++
    }
  }
  return { frozenCount: count }
}

/**
 * 从模板创建目标
 */
export function createGoalFromTemplateMock(templateId: number, overrides: Partial<PerformanceGoal>) {
  const tpl = goalTemplateMock.getDetail(templateId)
  if (!tpl) throw new Error('模板不存在')
  const all = performanceGoalMock.getData()
  const nextId = Math.max(...all.map((g) => g.id), 0) + 1
  const now = new Date().toLocaleString('zh-CN')

  const newGoal: PerformanceGoal = {
    id: nextId,
    goalNo: `GOAL${now.slice(0, 4) + now.slice(5, 7) + now.slice(8, 10)}${String(nextId).padStart(4, '0')}`,
    employeeId: overrides.employeeId || 0,
    employeeName: overrides.employeeName || '',
    departmentId: overrides.departmentId,
    departmentName: overrides.departmentName || '',
    jobFamily: tpl.jobFamily,
    cycleId: overrides.cycleId || 0,
    cycleName: overrides.cycleName || '',
    goalType: tpl.goalType,
    goalTypeName: tpl.goalType === 1 ? 'OKR' : 'KPI',
    goalCategory: overrides.goalCategory || 'personal',
    parentGoalId: overrides.parentGoalId,
    parentGoalTitle: overrides.parentGoalTitle,
    goalTitle: tpl.goalTitle,
    goalDescription: tpl.goalDescription,
    weight: overrides.weight || tpl.suggestedWeight || 50,
    targetValue: tpl.targetValue || '',
    currentValue: '',
    keyResults: tpl.keyResults ? JSON.parse(JSON.stringify(tpl.keyResults)) : undefined,
    progress: 0,
    status: 0,
    approvalStatus: 0,
    frozen: 0,
    createTime: now,
    updateTime: now
  }
  all.push(newGoal)
  return newGoal
}
