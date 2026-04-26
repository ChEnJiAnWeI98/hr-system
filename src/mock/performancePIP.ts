// @ts-nocheck
/**
 * 绩效改进计划 PIP Mock（Phase B2）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type {
  PerformancePIP,
  PIPWeeklyTrack,
  PIPMonthlyReview,
  PIPGoalItem
} from '@/types/performancePIP'

function buildGoals(items: Array<[string, string, string, number]>): PIPGoalItem[] {
  return items.map(([desc, criteria, deadline, progress], idx) => ({
    order: idx + 1,
    description: desc,
    criteria,
    deadline,
    progress
  }))
}

const initialData: PerformancePIP[] = [
  // 进行中 PIP（第 2 月进行中）
  {
    id: 1,
    pipNo: 'PIP20260201001',
    employeeId: 250,
    employeeName: '吴测试',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '测试工程师',
    initiatedReason: '2025 年上半年评估为 C 级；1on1 反馈缺乏主动性',
    evaluationId: 100,
    startDate: '2026-02-01',
    expectedEndDate: '2026-05-01',
    goals: buildGoals([
      ['提升自动化测试覆盖率', '测试覆盖率 >= 75%（当前 60%）', '2026-03-31', 60],
      ['每月至少 1 次测试方案分享', '完成 3 次分享', '2026-04-30', 66],
      ['主动承担线上故障复盘', '每月至少 1 次复盘输出', '2026-04-30', 50]
    ]),
    hrId: 3, hrName: '张HR',
    leaderId: 101, leaderName: '李技术总监',
    signStatus: 'signed', signTime: '2026-02-03 14:00:00',
    status: 'in_progress',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-04-15 16:00:00'
  },
  // 规划中（HR 刚发起，待员工签署）
  {
    id: 2,
    pipNo: 'PIP20260415001',
    employeeId: 260,
    employeeName: '王产品助理',
    departmentId: 2,
    departmentName: '产品部',
    positionName: '产品助理',
    initiatedReason: '2026 Q1 评估为 C 级；跨部门协作反馈较差',
    evaluationId: 101,
    startDate: '2026-04-20',
    expectedEndDate: '2026-07-20',
    goals: buildGoals([
      ['提升跨部门协作能力', '每月主动发起 2 次跨部门同步，得到 3+ 同事正向反馈', '2026-07-20', 0],
      ['完成产品基础知识专项学习', '完成 3 门课程 + 考核 >= 80 分', '2026-06-30', 0],
      ['独立负责 1 个小模块需求', '需求评审通过 + 上线无重大缺陷', '2026-07-15', 0]
    ]),
    hrId: 3, hrName: '张HR',
    leaderId: 280, leaderName: '陈产品总监',
    signStatus: 'not_signed',
    status: 'planning',
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  // 已完成（通过）
  {
    id: 3,
    pipNo: 'PIP20260101001',
    employeeId: 270,
    employeeName: '林前端',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '前端开发',
    initiatedReason: '2025 Q4 评估为 D 级',
    startDate: '2026-01-05',
    expectedEndDate: '2026-04-05',
    actualEndDate: '2026-04-05',
    goals: buildGoals([
      ['核心页面性能优化', 'LCP <= 2s', '2026-03-31', 100],
      ['代码质量提升', 'PR review 通过率 >= 90%', '2026-04-05', 100],
      ['主动参与技术分享', '完成 2 次分享', '2026-04-05', 100]
    ]),
    hrId: 3, hrName: '张HR',
    leaderId: 101, leaderName: '李技术总监',
    signStatus: 'signed', signTime: '2026-01-08 10:00:00',
    status: 'completed',
    result: 'passed',
    resultReason: '改进目标全部达成，月度评估连续 2 个月达预期、1 个月超预期，建议回归正常绩效轨道',
    resultTime: '2026-04-05 18:00:00',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-04-05 18:00:00'
  },
  // 已延期
  {
    id: 4,
    pipNo: 'PIP20260101002',
    employeeId: 271,
    employeeName: '刘后端',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '后端开发',
    initiatedReason: '2025 Q4 评估为 D 级',
    startDate: '2026-01-10',
    expectedEndDate: '2026-05-10',
    goals: buildGoals([
      ['业务熟悉度', '独立承接 2 个中等难度需求', '2026-04-10', 70],
      ['代码质量', '减少线上 Bug 50%', '2026-04-10', 60]
    ]),
    hrId: 3, hrName: '张HR',
    leaderId: 101, leaderName: '李技术总监',
    signStatus: 'signed', signTime: '2026-01-12 14:00:00',
    status: 'extended',
    resultReason: '3 个月节点改进明显但未完全达标，延长 1 个月',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-04-10 18:00:00'
  },
  // 拒绝签署
  {
    id: 5,
    pipNo: 'PIP20260418001',
    employeeId: 272,
    employeeName: '孙运营',
    departmentId: 4,
    departmentName: '运营部',
    positionName: '运营专员',
    initiatedReason: '2026 Q1 评估为 D 级；关键 KPI 未达成',
    startDate: '2026-04-22',
    expectedEndDate: '2026-07-22',
    goals: [],
    hrId: 3, hrName: '张HR',
    leaderId: 400, leaderName: '运营总监',
    signStatus: 'refused',
    refuseReason: '对评估结果有异议，已走申诉流程',
    status: 'planning',
    appealStatus: 'filed',
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-19 10:00:00'
  }
]

export const pipMock = createCrudMock<PerformancePIP>(alignEmployeeFields(initialData), {
  searchFields: ['employeeName', 'pipNo', 'departmentName'],
  sortField: 'updateTime'
})

/* ========== 周跟踪 ========== */
const initialWeekly: PIPWeeklyTrack[] = [
  {
    id: 1, pipId: 1, week: 1,
    employeeUpdate: '本周梳理了自动化测试现状，识别出覆盖率低的模块；完成 5 个测试用例编写',
    leaderFeedback: '进度符合预期，建议下周重点关注接口层的覆盖',
    goalProgress: { 1: 15, 2: 0, 3: 0 },
    submitTime: '2026-02-07 17:00:00'
  },
  {
    id: 2, pipId: 1, week: 4,
    employeeUpdate: '完成接口层自动化测试框架搭建；本月完成第 1 次测试分享',
    leaderFeedback: '有明显进步，分享内容质量不错',
    goalProgress: { 1: 35, 2: 33, 3: 20 },
    submitTime: '2026-02-28 17:00:00'
  },
  {
    id: 3, pipId: 1, week: 8,
    employeeUpdate: '覆盖率达 70%；参与了 2 次生产故障复盘',
    leaderFeedback: '复盘输出质量不错，主动性在提升',
    goalProgress: { 1: 55, 2: 50, 3: 50 },
    submitTime: '2026-03-28 17:00:00'
  },
  {
    id: 4, pipId: 1, week: 10,
    employeeUpdate: '继续推进覆盖率提升；完成第 2 次测试分享',
    leaderFeedback: '保持节奏，下月争取达到 75%',
    goalProgress: { 1: 60, 2: 66, 3: 50 },
    submitTime: '2026-04-11 17:00:00'
  },
  // PIP 3 的周跟踪（已完成）
  {
    id: 5, pipId: 3, week: 1,
    employeeUpdate: '开始梳理核心页面性能问题清单',
    leaderFeedback: '进度正常',
    goalProgress: { 1: 15, 2: 10, 3: 0 },
    submitTime: '2026-01-12 17:00:00'
  },
  {
    id: 6, pipId: 3, week: 6,
    employeeUpdate: '主要页面 LCP 从 3.5s 降至 2.2s',
    leaderFeedback: '效果显著',
    goalProgress: { 1: 70, 2: 50, 3: 50 },
    submitTime: '2026-02-16 17:00:00'
  },
  {
    id: 7, pipId: 3, week: 12,
    employeeUpdate: '全部目标达成',
    leaderFeedback: '表现超出预期',
    goalProgress: { 1: 100, 2: 100, 3: 100 },
    submitTime: '2026-03-31 17:00:00'
  }
]

export const pipWeeklyMock = createCrudMock<PIPWeeklyTrack>(initialWeekly, {
  searchFields: ['employeeUpdate', 'leaderFeedback'],
  sortField: 'submitTime'
})

/* ========== 月度评估 ========== */
const initialMonthly: PIPMonthlyReview[] = [
  { id: 1, pipId: 1, month: 1, result: 'meet_expected', comment: '第一个月进展符合预期，学习态度积极', hrComment: '继续保持', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-03-01 15:00:00' },
  { id: 2, pipId: 1, month: 2, result: 'meet_expected', comment: '第二个月继续稳步推进，覆盖率提升明显', hrComment: '按计划推进', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-04-01 15:00:00' },
  { id: 3, pipId: 3, month: 1, result: 'meet_expected', comment: '性能优化思路清晰，产出符合预期', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-02-05 15:00:00' },
  { id: 4, pipId: 3, month: 2, result: 'above_expected', comment: 'LCP 优化效果超预期', hrComment: '表现出色', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-03-05 15:00:00' },
  { id: 5, pipId: 3, month: 3, result: 'above_expected', comment: '全部达成，甚至主动优化了其他页面', hrComment: '建议结束 PIP，回归正常', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-04-05 15:00:00' },
  { id: 6, pipId: 4, month: 1, result: 'below_expected', comment: '进度缓慢，主动性不足', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-02-10 15:00:00' },
  { id: 7, pipId: 4, month: 2, result: 'meet_expected', comment: '有进步', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-03-10 15:00:00' },
  { id: 8, pipId: 4, month: 3, result: 'meet_expected', comment: '基本达标但未完全符合，建议延期 1 月观察', reviewerId: 101, reviewerName: '李技术总监', reviewTime: '2026-04-10 15:00:00' }
]

export const pipMonthlyMock = createCrudMock<PIPMonthlyReview>(initialMonthly, {
  searchFields: ['comment'],
  sortField: 'reviewTime'
})

/* ========== 业务方法 ========== */

export function signPIPMock(id: number, signed: boolean, refuseReason?: string) {
  const p = pipMock.getDetail(id)
  if (!p) throw new Error('PIP 不存在')
  if (signed) {
    p.signStatus = 'signed'
    p.signTime = new Date().toLocaleString('zh-CN')
    p.status = 'in_progress'
  } else {
    p.signStatus = 'refused'
    p.refuseReason = refuseReason
  }
  p.updateTime = new Date().toLocaleString('zh-CN')
  pipMock.update(p)
  return p
}

export function submitWeeklyTrackMock(pipId: number, data: Omit<PIPWeeklyTrack, 'id' | 'submitTime'>) {
  const all = pipWeeklyMock.getData()
  const nextId = Math.max(...all.map((w) => w.id), 0) + 1
  const track: PIPWeeklyTrack = {
    id: nextId,
    pipId,
    ...data,
    submitTime: new Date().toLocaleString('zh-CN')
  }
  all.push(track)

  // 更新 PIP 目标的最新进度
  const p = pipMock.getDetail(pipId)
  if (p && p.goals) {
    for (const goal of p.goals) {
      if (data.goalProgress[goal.order] !== undefined) {
        goal.progress = data.goalProgress[goal.order]
      }
    }
    p.updateTime = track.submitTime
    pipMock.update(p)
  }
  return track
}

export function submitMonthlyReviewMock(
  pipId: number,
  month: number,
  result: 'above_expected' | 'meet_expected' | 'below_expected',
  comment: string,
  hrComment?: string
) {
  const all = pipMonthlyMock.getData()
  const nextId = Math.max(...all.map((m) => m.id), 0) + 1
  const review: PIPMonthlyReview = {
    id: nextId,
    pipId,
    month,
    result,
    comment,
    hrComment,
    reviewerId: 101,
    reviewerName: '直属上级',
    reviewTime: new Date().toLocaleString('zh-CN')
  }
  all.push(review)
  return review
}

export function finalizePIPMock(
  id: number,
  result: 'passed' | 'extended' | 'failed',
  reason: string
) {
  const p = pipMock.getDetail(id)
  if (!p) throw new Error('PIP 不存在')
  p.result = result
  p.resultReason = reason
  p.resultTime = new Date().toLocaleString('zh-CN')
  p.status = result === 'extended' ? 'extended' : 'completed'
  if (result !== 'extended') p.actualEndDate = p.resultTime
  p.updateTime = p.resultTime
  pipMock.update(p)
  return p
}

export function getPIPStatsMock() {
  const all = pipMock.getData()
  const total = all.length
  const inProgress = all.filter((p) => p.status === 'in_progress').length
  const extendedCount = all.filter((p) => p.status === 'extended').length
  const completed = all.filter((p) => p.status === 'completed').length
  const passedCount = all.filter((p) => p.result === 'passed').length
  const failedCount = all.filter((p) => p.result === 'failed').length
  const passRate = completed > 0 ? Number(((passedCount / (passedCount + failedCount || 1)) * 100).toFixed(1)) : 0
  return { total, inProgress, extendedCount, completed, passedCount, failedCount, passRate }
}
