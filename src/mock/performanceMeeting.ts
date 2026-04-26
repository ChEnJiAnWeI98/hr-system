// @ts-nocheck
/**
 * 绩效面谈 Mock 数据（Phase A8）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { PerformanceMeeting } from '@/types/performanceMeeting'

const initialData: PerformanceMeeting[] = [
  // 已确认
  {
    id: 1,
    meetingNo: 'TALK20260410001',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    evaluationId: 1,
    employeeId: 201,
    employeeName: '张三',
    departmentId: 1,
    departmentName: '技术部',
    interviewerId: 101,
    interviewerName: '李技术总监',
    scheduledTime: '2026-04-10 14:00:00',
    actualTime: '2026-04-10 14:00:00',
    duration: 45,
    strengths: 'Q1 牵头的订单系统重构项目如期上线，技术方案扎实；团队内部代码评审积极性高；新人带教效果好，李前端独立上手速度快',
    weaknesses: '跨团队协作沟通仍偏被动，在与产品/数据部门对齐时有时需要 HR 推动；技术分享频次（目标 3 次/季）只做了 1 次',
    improvementSuggestions: '每月主动发起 1 次跨部门技术同步会；Q2 至少 2 场技术分享',
    developmentPlan: 'Q3 参加架构师训练营；推荐《系统架构设计》书单',
    nextPeriodGoals: 'Q2 完成订单系统 P99 至 150ms；主导 1 个核心模块重构；培养 1 位 P6 独立承担方向',
    employeeFeedback: '认可评价。希望 Q2 在核心项目资源协调上能得到更多支持',
    commitments: '每月 1 次 1on1；为订单项目追加 1 名后端；协助推进跨部门协作',
    employeeConfirmStatus: 'confirmed',
    confirmTime: '2026-04-13 10:00:00',
    status: 'confirmed',
    submitTime: '2026-04-10 16:30:00',
    createTime: '2026-04-08 10:00:00',
    updateTime: '2026-04-13 10:00:00'
  },
  // 已完成，待员工确认
  {
    id: 2,
    meetingNo: 'TALK20260410002',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    evaluationId: 5,
    employeeId: 301,
    employeeName: '赵销售',
    departmentId: 3,
    departmentName: '销售部',
    interviewerId: 302,
    interviewerName: '刘销售主管',
    scheduledTime: '2026-04-09 15:00:00',
    actualTime: '2026-04-09 15:00:00',
    duration: 30,
    strengths: 'Q1 超额完成销售额目标 320 万 / 目标 300 万；新签一家年订单 80 万客户',
    weaknesses: '部分客户回款节奏偏慢；客户拜访记录填写不完整',
    improvementSuggestions: '每周二固定回款跟进日；CRM 拜访记录 24h 内必须录入',
    developmentPlan: '下半年推荐参加高阶销售训练营',
    nextPeriodGoals: 'Q2 销售额 380 万；新客户开拓 10 家；回款率 ≥ 90%',
    employeeFeedback: '',
    commitments: 'Q2 追加 BDR 资源；每月提供 3 个高质量销售线索',
    employeeConfirmStatus: 'not_confirmed',
    status: 'completed',
    submitTime: '2026-04-09 17:00:00',
    createTime: '2026-04-07 10:00:00',
    updateTime: '2026-04-09 17:00:00'
  },
  // 有异议
  {
    id: 3,
    meetingNo: 'TALK20260410003',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    evaluationId: 100,
    employeeId: 250,
    employeeName: '吴测试',
    departmentId: 1,
    departmentName: '技术部',
    interviewerId: 101,
    interviewerName: '李技术总监',
    scheduledTime: '2026-04-10 10:00:00',
    actualTime: '2026-04-10 10:00:00',
    duration: 40,
    strengths: '稳定承担自动化测试工作；Q1 发布压测表现良好',
    weaknesses: '主动学习意愿有待提升；创新突破维度低',
    improvementSuggestions: '建议每月完成 1 本技术书籍学习 + 1 次测试方案分享',
    developmentPlan: '参加性能测试进阶培训',
    nextPeriodGoals: '自动化测试覆盖率 80%',
    employeeFeedback: '',
    commitments: '',
    employeeConfirmStatus: 'disputed',
    employeeDispute: '我认为 Q1 承担的压测工作被低估，1 月的 Q1 发布压测识别了 3 个严重性能隐患，属于重要贡献；对不足部分"创新突破维度低"的评价不认可',
    status: 'disputed',
    submitTime: '2026-04-10 12:00:00',
    createTime: '2026-04-09 10:00:00',
    updateTime: '2026-04-11 14:00:00'
  },
  // 已预约
  {
    id: 4,
    meetingNo: 'TALK20260418001',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    evaluationId: 2,
    employeeId: 202,
    employeeName: '李前端',
    departmentId: 1,
    departmentName: '技术部',
    interviewerId: 101,
    interviewerName: '李技术总监',
    scheduledTime: '2026-04-22 15:00:00',
    duration: 45,
    employeeConfirmStatus: 'not_confirmed',
    status: 'scheduled',
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-18 10:00:00'
  },
  // 待预约
  {
    id: 5,
    meetingNo: 'TALK20260419001',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    evaluationId: 3,
    employeeId: 203,
    employeeName: '周运维',
    departmentId: 1,
    departmentName: '技术部',
    interviewerId: 101,
    interviewerName: '李技术总监',
    employeeConfirmStatus: 'not_confirmed',
    status: 'pending',
    createTime: '2026-04-19 10:00:00',
    updateTime: '2026-04-19 10:00:00'
  },
  // 异议已处理
  {
    id: 6,
    meetingNo: 'TALK20260320001',
    cycleId: 2,
    cycleName: '2025 年上半年绩效考核',
    employeeId: 240,
    employeeName: '冯测试',
    departmentId: 1,
    departmentName: '技术部',
    interviewerId: 101,
    interviewerName: '李技术总监',
    scheduledTime: '2025-06-25 14:00:00',
    actualTime: '2025-06-25 14:00:00',
    duration: 50,
    strengths: '专业能力扎实',
    weaknesses: '跨部门协作有改进空间',
    improvementSuggestions: '每月参加 1 次产品评审会',
    developmentPlan: '推荐《有效沟通》培训',
    nextPeriodGoals: '完成 Q3 自动化回归',
    employeeFeedback: '异议已沟通理解',
    commitments: '支持 Q3 测试工具升级',
    employeeConfirmStatus: 'confirmed',
    employeeDispute: '（原异议：跨部门协作描述过于笼统）',
    confirmTime: '2025-07-01 10:00:00',
    status: 'resolved',
    submitTime: '2025-06-25 17:00:00',
    createTime: '2025-06-24 10:00:00',
    updateTime: '2025-07-01 10:00:00'
  }
]

export const performanceMeetingMock = createCrudMock<PerformanceMeeting>(alignEmployeeFields(initialData), {
  searchFields: ['meetingNo', 'employeeName', 'interviewerName'],
  sortField: 'updateTime'
})

/* ========== 业务方法 ========== */

/** 预约面谈 */
export function scheduleMeetingMock(id: number, scheduledTime: string) {
  const m = performanceMeetingMock.getDetail(id)
  if (!m) throw new Error('面谈不存在')
  m.scheduledTime = scheduledTime
  m.status = 'scheduled'
  m.updateTime = new Date().toLocaleString('zh-CN')
  performanceMeetingMock.update(m)
  return m
}

/** 提交纪要 */
export function submitMeetingNotesMock(id: number, notes: Partial<PerformanceMeeting>) {
  const m = performanceMeetingMock.getDetail(id)
  if (!m) throw new Error('面谈不存在')
  Object.assign(m, notes)
  m.status = 'completed'
  m.submitTime = new Date().toLocaleString('zh-CN')
  m.actualTime = m.actualTime || m.submitTime
  m.updateTime = m.submitTime
  performanceMeetingMock.update(m)
  return m
}

/** 员工确认纪要 */
export function employeeConfirmMock(id: number, confirmed: boolean, dispute?: string) {
  const m = performanceMeetingMock.getDetail(id)
  if (!m) throw new Error('面谈不存在')
  if (confirmed) {
    m.employeeConfirmStatus = 'confirmed'
    m.status = 'confirmed'
    m.confirmTime = new Date().toLocaleString('zh-CN')
  } else {
    m.employeeConfirmStatus = 'disputed'
    m.employeeDispute = dispute
    m.status = 'disputed'
  }
  m.updateTime = new Date().toLocaleString('zh-CN')
  performanceMeetingMock.update(m)
  return m
}

/** 异议处理（协商后修改纪要）*/
export function resolveDisputeMock(id: number, updatedNotes: Partial<PerformanceMeeting>) {
  const m = performanceMeetingMock.getDetail(id)
  if (!m) throw new Error('面谈不存在')
  Object.assign(m, updatedNotes)
  m.status = 'resolved'
  m.employeeConfirmStatus = 'confirmed'
  m.confirmTime = new Date().toLocaleString('zh-CN')
  m.updateTime = m.confirmTime
  performanceMeetingMock.update(m)
  return m
}

/** 面谈统计 */
export function getMeetingStatsMock() {
  const all = performanceMeetingMock.getData()
  const total = all.length
  const confirmedCount = all.filter((m) => m.employeeConfirmStatus === 'confirmed').length
  const disputedCount = all.filter((m) => m.employeeConfirmStatus === 'disputed').length
  const pendingCount = all.filter((m) => m.status === 'pending').length
  const avgDuration = all.filter((m) => m.duration).reduce((s, m) => s + (m.duration || 0), 0) / Math.max(1, all.filter((m) => m.duration).length)
  return {
    total,
    confirmedCount,
    disputedCount,
    pendingCount,
    avgDuration: Math.round(avgDuration),
    confirmRate: total > 0 ? Number(((confirmedCount / total) * 100).toFixed(1)) : 0
  }
}
