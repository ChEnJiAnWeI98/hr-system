// @ts-nocheck
/**
 * 绩效任务中心 Mock（Phase B4）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { PerformanceTask } from '@/types/performanceTask'

const initialData: PerformanceTask[] = [
  // 员工视角
  {
    id: 1, taskNo: 'TODO20260415001',
    type: 'set_goal', title: '设定 Q2 OKR 目标',
    description: '请在 4/15 前完成 Q2 个人 OKR 设定并提交上级审批',
    assigneeId: 210, assigneeName: '陈后端', assigneeRole: 'employee',
    relatedObject: { type: 'cycle', id: 4, name: '2026 Q2 OKR 季度考核' },
    priority: 'urgent', dueTime: '2026-04-20 18:00:00',
    remindAt: ['-3d', '-1d', '0'], redirectUrl: '/perf/goal',
    status: 'pending',
    createTime: '2026-04-15 10:00:00', updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 2, taskNo: 'TODO20260418001',
    type: 'self_review', title: '完成 Q1 自评',
    assigneeId: 203, assigneeName: '周运维', assigneeRole: 'employee',
    relatedObject: { type: 'evaluation', id: 3, name: 'EVAL20260401003' },
    priority: 'urgent', dueTime: '2026-04-20 18:00:00',
    redirectUrl: '/perf/evaluation',
    status: 'pending',
    createTime: '2026-04-18 10:00:00', updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 3, taskNo: 'TODO20260418002',
    type: 'pip_weekly_update', title: '本周 PIP 周更',
    description: '第 11 周，请更新改进目标进度',
    assigneeId: 250, assigneeName: '吴测试', assigneeRole: 'employee',
    relatedObject: { type: 'pip', id: 1, name: 'PIP20260201001' },
    priority: 'important', dueTime: '2026-04-19 18:00:00',
    redirectUrl: '/perf/pip',
    status: 'pending',
    createTime: '2026-04-18 09:00:00', updateTime: '2026-04-18 09:00:00'
  },
  {
    id: 4, taskNo: 'TODO20260410001',
    type: 'confirm_meeting_notes', title: '确认面谈纪要',
    assigneeId: 301, assigneeName: '赵销售', assigneeRole: 'employee',
    relatedObject: { type: 'meeting', id: 2, name: 'TALK20260410002' },
    priority: 'important', dueTime: '2026-04-14 18:00:00',
    redirectUrl: '/perf/meeting',
    status: 'pending',
    createTime: '2026-04-10 10:00:00', updateTime: '2026-04-10 10:00:00'
  },
  {
    id: 5, taskNo: 'TODO20260417001',
    type: 'submit_360_feedback', title: '为张三提交 360 反馈',
    assigneeId: 220, assigneeName: '林数据', assigneeRole: 'employee',
    relatedObject: { type: '360', id: 5 },
    priority: 'normal', dueTime: '2026-04-25 18:00:00',
    redirectUrl: '/perf/review-360/x',
    status: 'completed', completedAt: '2026-03-24 14:00:00',
    createTime: '2026-03-20 10:00:00', updateTime: '2026-03-24 14:00:00'
  },

  // Leader 视角
  {
    id: 6, taskNo: 'TODO20260418003',
    type: 'approve_goal', title: '审批陈后端的 Q2 目标',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: 'goal', id: 7, name: 'GOAL20260101007' },
    priority: 'important', dueTime: '2026-04-20 18:00:00',
    redirectUrl: '/perf/goal',
    status: 'pending',
    createTime: '2026-04-18 10:00:00', updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 7, taskNo: 'TODO20260417002',
    type: 'review_subordinate', title: '评分下属：李前端、周运维',
    description: '2 位下属等待直属上级评分',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: 'evaluation', id: 2 },
    priority: 'urgent', dueTime: '2026-04-23 18:00:00',
    redirectUrl: '/perf/evaluation',
    status: 'pending',
    createTime: '2026-04-17 10:00:00', updateTime: '2026-04-17 10:00:00'
  },
  {
    id: 8, taskNo: 'TODO20260415002',
    type: 'approve_360_reviewers', title: '核准李前端的 360 评估人名单',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: '360', id: 2 },
    priority: 'important', dueTime: '2026-04-19 18:00:00',
    redirectUrl: '/perf/review-360/x',
    status: 'pending',
    createTime: '2026-04-15 11:00:00', updateTime: '2026-04-15 11:00:00'
  },
  {
    id: 9, taskNo: 'TODO20260418004',
    type: 'conduct_one_on_one', title: '进行 1on1：李前端',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: 'one_on_one', id: 2 },
    priority: 'normal', dueTime: '2026-04-24 15:00:00',
    redirectUrl: '/perf/feedback-one-on-one',
    status: 'pending',
    createTime: '2026-04-18 10:00:00', updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 10, taskNo: 'TODO20260420001',
    type: 'pip_monthly_review', title: '吴测试的 3 月 PIP 月评估',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: 'pip', id: 1 },
    priority: 'important', dueTime: '2026-05-01 18:00:00',
    redirectUrl: '/perf/pip',
    status: 'pending',
    createTime: '2026-04-20 10:00:00', updateTime: '2026-04-20 10:00:00'
  },
  {
    id: 11, taskNo: 'TODO20260416001',
    type: 'review_subordinate', title: '评分下属：孙七',
    assigneeId: 101, assigneeName: '李技术总监', assigneeRole: 'leader',
    relatedObject: { type: 'evaluation', id: 6 },
    priority: 'urgent', dueTime: '2026-04-15 18:00:00',
    redirectUrl: '/perf/evaluation',
    status: 'overdue',
    createTime: '2026-04-10 10:00:00', updateTime: '2026-04-18 10:00:00'
  },

  // HR 视角
  {
    id: 12, taskNo: 'TODO20260418005',
    type: 'monitor_evaluation', title: '监控 Q2 评估整体进度',
    description: '2026 Q2 OKR 当前评估进度 45%，需要关注推进',
    assigneeId: 3, assigneeName: '张HR', assigneeRole: 'hr',
    relatedObject: { type: 'cycle', id: 4 },
    priority: 'important', dueTime: '2026-06-25 18:00:00',
    redirectUrl: '/perf/evaluation',
    status: 'pending',
    createTime: '2026-04-18 10:00:00', updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 13, taskNo: 'TODO20260415003',
    type: 'organize_calibration', title: '组织 Q2 技术部校准会',
    assigneeId: 3, assigneeName: '张HR', assigneeRole: 'hr',
    relatedObject: { type: 'calibration_meeting', id: 2 },
    priority: 'normal', dueTime: '2026-06-28 14:00:00',
    redirectUrl: '/perf/calibration',
    status: 'pending',
    createTime: '2026-04-15 10:00:00', updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 14, taskNo: 'TODO20260418006',
    type: 'advance_cycle', title: '推进周期状态：2025 Q4 公示期结束',
    assigneeId: 3, assigneeName: '张HR', assigneeRole: 'hr',
    relatedObject: { type: 'cycle', id: 9 },
    priority: 'urgent', dueTime: '2026-01-10 18:00:00',
    redirectUrl: '/perf/cycle',
    status: 'pending',
    createTime: '2026-01-08 10:00:00', updateTime: '2026-04-18 10:00:00'
  },
  {
    id: 15, taskNo: 'TODO20260419001',
    type: 'handle_appeal', title: '审批孙运营的 PIP 启动申诉',
    assigneeId: 3, assigneeName: '张HR', assigneeRole: 'hr',
    relatedObject: { type: 'pip', id: 5 },
    priority: 'urgent', dueTime: '2026-04-23 18:00:00',
    redirectUrl: '/perf/pip',
    status: 'pending',
    createTime: '2026-04-19 10:00:00', updateTime: '2026-04-19 10:00:00'
  }
]

export const performanceTaskMock = createCrudMock<PerformanceTask>(initialData, {
  searchFields: ['title', 'assigneeName'],
  sortField: 'dueTime'
})

/* ========== 业务方法 ========== */

export function completeTaskMock(id: number) {
  const t = performanceTaskMock.getDetail(id)
  if (!t) throw new Error('任务不存在')
  t.status = 'completed'
  t.completedAt = new Date().toLocaleString('zh-CN')
  t.updateTime = t.completedAt
  performanceTaskMock.update(t)
  return t
}

export function applyDelayMock(id: number, newDueTime: string, reason: string) {
  const t = performanceTaskMock.getDetail(id)
  if (!t) throw new Error('任务不存在')
  // PIP / 校准 / 公示类任务不允许延期
  const forbidTypes = ['pip_weekly_update', 'pip_monthly_review', 'calibration_meeting', 'publish_result', 'advance_cycle']
  if (forbidTypes.includes(t.type)) throw new Error('该类型任务不允许延期')

  if (!t.delayHistory) t.delayHistory = []
  t.delayHistory.push({
    applyTime: new Date().toLocaleString('zh-CN'),
    newDueTime,
    reason,
    approved: true // 演示：自动批准
  })
  t.dueTime = newDueTime
  t.status = 'delayed'
  t.updateTime = new Date().toLocaleString('zh-CN')
  performanceTaskMock.update(t)
  return t
}

export function getTaskStatsMock() {
  const all = performanceTaskMock.getData()
  const urgent = all.filter((t) => t.priority === 'urgent' && t.status === 'pending').length
  const overdue = all.filter((t) => t.status === 'overdue').length
  const byRole = {
    employee: all.filter((t) => t.assigneeRole === 'employee' && t.status === 'pending').length,
    leader: all.filter((t) => t.assigneeRole === 'leader' && t.status === 'pending').length,
    hr: all.filter((t) => t.assigneeRole === 'hr' && t.status === 'pending').length
  }
  const pending = all.filter((t) => t.status === 'pending').length
  const completed = all.filter((t) => t.status === 'completed').length
  const completionRate = all.length > 0 ? Math.round((completed / all.length) * 100) : 0
  return { total: all.length, pending, completed, urgent, overdue, byRole, completionRate }
}
