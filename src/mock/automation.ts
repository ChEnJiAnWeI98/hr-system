// @ts-nocheck
/**
 * 自动化规则引擎 Phase 5.8 Mock
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  AutomationRule,
  AutomationLog,
  RuleTemplate,
  AutomationStats,
  ActionResult
} from '@/types/automation'

/* ========== 规则 ========== */
const initialRules: AutomationRule[] = [
  {
    id: 1,
    name: '简历初筛 3 天提醒',
    description: '投递超过 3 天仍未初筛，自动提醒 HR',
    triggerType: 'resume_stuck',
    triggerConfig: { days: 3 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR', message: '有简历超 3 天未初筛，请及时处理' } }
    ],
    enabled: 1,
    priority: 8,
    triggerCount: 24,
    lastTriggerTime: '2026-04-18 09:00:00',
    createdByName: '张HR',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-01-10 10:00:00'
  },
  {
    id: 2,
    name: '面试后 48 小时未反馈预警',
    description: '面试结束 48 小时后面试官未提交评价，通知 HRBP',
    triggerType: 'interview_no_feedback',
    triggerConfig: { hours: 48 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR', message: '有面试评价超时未提交' } },
      { type: 'escalate_approval', config: { escalateTo: 'HRBP' } }
    ],
    enabled: 1,
    priority: 7,
    triggerCount: 12,
    lastTriggerTime: '2026-04-17 14:30:00',
    createdByName: '张HR',
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-01-15 10:00:00'
  },
  {
    id: 3,
    name: 'Offer 7 天未反馈自动失效',
    description: 'Offer 发送 7 天后候选人仍未响应，自动置为失效',
    triggerType: 'offer_no_response',
    triggerConfig: { days: 7 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR', message: 'Offer 已超 7 天未响应' } },
      { type: 'send_email', config: { to: 'candidate', template: 'offer_reminder' } },
      { type: 'auto_reject', config: { reasonCode: 'offer_expired' } }
    ],
    enabled: 1,
    priority: 9,
    triggerCount: 5,
    lastTriggerTime: '2026-04-15 10:00:00',
    createdByName: '张HR',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-02-01 10:00:00'
  },
  {
    id: 4,
    name: '低匹配度简历自动打标',
    description: 'AI 匹配总分低于 50 分的简历，自动打上"匹配度低"标签',
    triggerType: 'low_match',
    triggerConfig: { matchThreshold: 50 },
    actions: [
      { type: 'add_tag', config: { tag: '匹配度低', color: 'warning' } }
    ],
    enabled: 1,
    priority: 5,
    triggerCount: 38,
    lastTriggerTime: '2026-04-19 11:20:00',
    createdByName: '张HR',
    createTime: '2026-02-20 10:00:00',
    updateTime: '2026-02-20 10:00:00'
  },
  {
    id: 5,
    name: '入职前 3 天未确认预警',
    description: '距入职日不足 3 天、候选人资料填报进度 < 80%，触发预警',
    triggerType: 'onboard_no_confirm',
    triggerConfig: { days: 3, progressThreshold: 80 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR', message: '候选人可能爽约，请联系确认' } },
      { type: 'add_tag', config: { tag: '爽约风险', color: 'danger' } },
      { type: 'send_email', config: { to: 'candidate', template: 'onboard_reminder' } }
    ],
    enabled: 1,
    priority: 10,
    triggerCount: 8,
    lastTriggerTime: '2026-04-18 08:00:00',
    createdByName: '张HR',
    createTime: '2026-03-01 10:00:00',
    updateTime: '2026-03-01 10:00:00'
  },
  {
    id: 6,
    name: '需求超期 30 天提醒 HRD',
    description: '招聘需求批准后 30 天仍未完成，提醒 HRD 关注',
    triggerType: 'demand_overdue',
    triggerConfig: { days: 30 },
    actions: [
      { type: 'escalate_approval', config: { escalateTo: 'HRD' } }
    ],
    enabled: 0,
    priority: 6,
    triggerCount: 2,
    lastTriggerTime: '2026-04-10 09:00:00',
    createdByName: '张HR',
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-15 10:00:00'
  }
]

export const automationRuleCrudMock = createCrudMock<AutomationRule>(initialRules, {
  searchFields: ['name', 'description']
})

/* ========== 触发日志 ========== */
const initialLogs: AutomationLog[] = [
  {
    id: 1,
    ruleId: 1,
    ruleName: '简历初筛 3 天提醒',
    triggerType: 'resume_stuck',
    targetType: 'resume',
    targetId: 7,
    targetName: '孙八 - 前端开发工程师',
    matchedReason: '投递时间：2026-04-15 10:00，当前已超 4 天',
    actionResults: [
      { type: 'send_notification', result: 'success', message: '站内通知已发送给张HR' }
    ],
    overallResult: 'success',
    triggerTime: '2026-04-19 09:00:00'
  },
  {
    id: 2,
    ruleId: 5,
    ruleName: '入职前 3 天未确认预警',
    triggerType: 'onboard_no_confirm',
    targetType: 'onboarding',
    targetId: 3,
    targetName: '刘强 - Java开发工程师',
    matchedReason: '计划入职日 2026-04-22，距今 3 天；填报进度 10%（阈值 80%）',
    actionResults: [
      { type: 'send_notification', result: 'success', message: '预警已推送' },
      { type: 'add_tag', result: 'success', message: '已标记"爽约风险"' },
      { type: 'send_email', result: 'failed', message: '邮件服务未配置' }
    ],
    overallResult: 'failed',
    triggerTime: '2026-04-19 08:00:00'
  },
  {
    id: 3,
    ruleId: 4,
    ruleName: '低匹配度简历自动打标',
    triggerType: 'low_match',
    targetType: 'resume',
    targetId: 4,
    targetName: '赵六 - 前端开发工程师',
    matchedReason: 'AI 匹配总分 48 分（阈值 50 分）',
    actionResults: [
      { type: 'add_tag', result: 'success', message: '已打标签"匹配度低"' }
    ],
    overallResult: 'success',
    triggerTime: '2026-04-18 11:20:00'
  },
  {
    id: 4,
    ruleId: 2,
    ruleName: '面试后 48 小时未反馈预警',
    triggerType: 'interview_no_feedback',
    targetType: 'interview',
    targetId: 2,
    targetName: '李四 - Java开发工程师 · 2 面',
    matchedReason: '面试时间 2026-04-15 14:00，已超 72 小时未提交评价',
    actionResults: [
      { type: 'send_notification', result: 'success', message: '通知已发送' },
      { type: 'escalate_approval', result: 'success', message: '已升级至 HRBP' }
    ],
    overallResult: 'success',
    triggerTime: '2026-04-17 14:30:00'
  },
  {
    id: 5,
    ruleId: 3,
    ruleName: 'Offer 7 天未反馈自动失效',
    triggerType: 'offer_no_response',
    targetType: 'offer',
    targetId: 2,
    targetName: '李四 - Java开发工程师',
    matchedReason: 'Offer 发送于 2026-04-08，已超 7 天未响应',
    actionResults: [
      { type: 'send_notification', result: 'success', message: '通知已发送' },
      { type: 'send_email', result: 'success', message: '催办邮件已发送给候选人' },
      { type: 'auto_reject', result: 'skipped', message: '候选人于最后 1 小时内响应，动作跳过' }
    ],
    overallResult: 'success',
    triggerTime: '2026-04-15 10:00:00'
  },
  {
    id: 6,
    ruleId: 1,
    ruleName: '简历初筛 3 天提醒',
    triggerType: 'resume_stuck',
    targetType: 'resume',
    targetId: 5,
    targetName: '孙七 - 测试工程师',
    matchedReason: '投递时间：2026-04-14 09:30，当前已超 5 天',
    actionResults: [
      { type: 'send_notification', result: 'success', message: '通知已发送' }
    ],
    overallResult: 'success',
    triggerTime: '2026-04-19 09:00:00'
  }
]

export const automationLogCrudMock = createCrudMock<AutomationLog>(initialLogs, {
  searchFields: ['ruleName', 'targetName']
})

/* ========== 内置模板 ========== */
export const ruleTemplates: RuleTemplate[] = [
  {
    id: 1,
    name: '简历 24 小时初筛提醒',
    description: '候选人投递后 24 小时内未完成初筛动作，自动通知 HR',
    category: '简历筛选',
    triggerType: 'resume_stuck',
    triggerConfig: { hours: 24 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR', message: '有简历超 24 小时未初筛' } }
    ],
    recommendedFor: '响应速度要求高的场景（急招、热门岗位）'
  },
  {
    id: 2,
    name: '面试评价 24 小时催办',
    description: '面试结束 24 小时后面试官仍未提交评价，自动催办',
    category: '面试跟进',
    triggerType: 'interview_no_feedback',
    triggerConfig: { hours: 24 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'interviewer', message: '请及时提交面试评价' } },
      { type: 'send_email', config: { to: 'interviewer', template: 'feedback_reminder' } }
    ],
    recommendedFor: '面试官较忙、经常延迟提交评价的团队'
  },
  {
    id: 3,
    name: 'Offer 接受率保障',
    description: 'Offer 发送 3 天后未响应，自动发催办邮件 + 电话提醒',
    category: 'Offer 管理',
    triggerType: 'offer_no_response',
    triggerConfig: { days: 3 },
    actions: [
      { type: 'send_email', config: { to: 'candidate', template: 'offer_reminder' } },
      { type: 'send_notification', config: { targetRole: 'R_HR', message: '请联系候选人确认 Offer' } }
    ],
    recommendedFor: '高价值候选人 / 核心岗位'
  },
  {
    id: 4,
    name: '爽约风险实时识别',
    description: '入职前 5 天、3 天、1 天分别检查候选人状态，早期发现爽约风险',
    category: '入职保障',
    triggerType: 'onboard_no_confirm',
    triggerConfig: { days: 3, progressThreshold: 70 },
    actions: [
      { type: 'send_notification', config: { targetRole: 'R_HR' } },
      { type: 'add_tag', config: { tag: '爽约风险', color: 'danger' } },
      { type: 'send_email', config: { to: 'candidate', template: 'onboard_reminder' } }
    ],
    recommendedFor: '所有企业必备，尤其是 Offer 爽约率高的团队'
  },
  {
    id: 5,
    name: '招聘需求超时升级',
    description: '需求 30 天未完成，升级至 HRD；60 天未完成，升级至 CEO',
    category: '需求管理',
    triggerType: 'demand_overdue',
    triggerConfig: { days: 30 },
    actions: [
      { type: 'escalate_approval', config: { escalateTo: 'HRD' } }
    ],
    recommendedFor: '注重 SLA 的企业'
  },
  {
    id: 6,
    name: '匹配度低自动归档',
    description: 'AI 总分低于 40 分的简历自动淘汰，释放 HR 精力',
    category: '简历筛选',
    triggerType: 'low_match',
    triggerConfig: { matchThreshold: 40 },
    actions: [
      { type: 'auto_reject', config: { reasonCode: 'low_match' } },
      { type: 'add_tag', config: { tag: 'AI 自动淘汰', color: 'info' } }
    ],
    recommendedFor: '日均简历量大（>100 份/日）的团队'
  }
]

export function getRuleTemplatesMock(): RuleTemplate[] {
  return ruleTemplates
}

/* ========== 统计 ========== */
export function getAutomationStatsMock(): AutomationStats {
  const rules = automationRuleCrudMock.getData()
  const logs = automationLogCrudMock.getData()

  const totalRules = rules.length
  const enabledRules = rules.filter((r) => r.enabled === 1).length
  const last30DaysTriggers = logs.length
  const successCount = logs.filter((l) => l.overallResult === 'success').length
  const successRate =
    last30DaysTriggers > 0 ? Number(((successCount / last30DaysTriggers) * 100).toFixed(1)) : 0

  // Top 规则（按触发次数）
  const topRules = [...rules]
    .sort((a, b) => b.triggerCount - a.triggerCount)
    .slice(0, 5)
    .map((r) => ({ ruleId: r.id, ruleName: r.name, count: r.triggerCount }))

  return { totalRules, enabledRules, last30DaysTriggers, successRate, topRules }
}

/* ========== 手动触发规则（演示用） ========== */
export function manualTriggerRuleMock(ruleId: number): AutomationLog {
  const rule = automationRuleCrudMock.getDetail(ruleId)
  if (!rule) throw new Error('规则不存在')

  const logs = automationLogCrudMock.getData()
  const nextId = Math.max(...logs.map((l) => l.id), 0) + 1

  const newLog: AutomationLog = {
    id: nextId,
    ruleId: rule.id,
    ruleName: rule.name,
    triggerType: rule.triggerType,
    targetType: 'resume',
    targetId: 99,
    targetName: '演示对象 - 手动触发',
    matchedReason: `【手动演示】模拟匹配条件：${JSON.stringify(rule.triggerConfig)}`,
    actionResults: rule.actions.map((a) => ({
      type: a.type,
      result: 'success' as ActionResult,
      message: '演示执行成功'
    })),
    overallResult: 'success',
    triggerTime: new Date().toLocaleString('zh-CN')
  }
  logs.unshift(newLog)

  // 更新规则触发次数
  rule.triggerCount++
  rule.lastTriggerTime = newLog.triggerTime
  automationRuleCrudMock.update(rule)

  return newLog
}
