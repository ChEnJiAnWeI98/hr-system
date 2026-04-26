// @ts-nocheck
/**
 * 绩效结果应用联动 Mock（Phase B5）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { PerformanceApplyRule, RuleExecutionRecord } from '@/types/performanceApplyRule'

const initialRules: PerformanceApplyRule[] = [
  {
    id: 1,
    ruleNo: 'APR20260101001',
    name: '绩效奖金系数（默认）',
    category: 'bonus',
    condition: { type: 'grade', grades: ['S', 'A', 'B', 'C', 'D'] },
    action: {
      bonusCoefficient: 1.0,
      description: 'S=1.5 / A=1.2 / B=1.0 / C=0.6 / D=0.0'
    },
    applyScope: {},
    priority: 10,
    status: 'active',
    needDualConfirm: 1,
    remark: '全公司通用奖金系数规则',
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    ruleNo: 'APR20260101002',
    name: '年度 S 级调薪（10~20%）',
    category: 'raise',
    condition: { type: 'grade', grades: ['S'] },
    action: {
      raiseMin: 10,
      raiseMax: 20,
      description: 'S 级员工年度调薪区间 10~20%，由 HR 最终决策'
    },
    applyScope: {},
    priority: 9,
    status: 'active',
    needDualConfirm: 1,
    remark: '建议调薪幅度',
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    ruleNo: 'APR20260101003',
    name: '年度 A 级调薪（5~10%）',
    category: 'raise',
    condition: { type: 'grade', grades: ['A'] },
    action: { raiseMin: 5, raiseMax: 10, description: 'A 级员工建议调薪 5~10%' },
    applyScope: {},
    priority: 8,
    status: 'active',
    needDualConfirm: 1,
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 4,
    ruleNo: 'APR20260101004',
    name: '连续 2+ 周期 S/A 进入晋升池',
    category: 'promotion',
    condition: { type: 'consecutive_grade', grades: ['S', 'A'], consecutiveCycles: 2 },
    action: { promotionPool: 'hipo_pool', description: '自动加入高潜晋升候选池' },
    applyScope: {},
    priority: 7,
    status: 'active',
    needDualConfirm: 0,
    remark: '自动识别高潜员工',
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 5,
    ruleNo: 'APR20260101005',
    name: 'C/D 员工能力提升必修课',
    category: 'training',
    condition: { type: 'grade', grades: ['C', 'D'] },
    action: {
      trainingCourses: ['有效沟通', '时间管理', '主动性与责任感'],
      description: 'C/D 员工自动指派 3 门能力提升必修课'
    },
    applyScope: {},
    priority: 6,
    status: 'active',
    needDualConfirm: 0,
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 6,
    ruleNo: 'APR20260101006',
    name: 'S 级员工打"核心骨干"标签',
    category: 'talent_tag',
    condition: { type: 'grade', grades: ['S'] },
    action: { talentTag: '核心骨干', description: '员工档案自动打标签' },
    applyScope: {},
    priority: 5,
    status: 'active',
    needDualConfirm: 0,
    createdBy: '张HR',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 7,
    ruleNo: 'APR20260101007',
    name: '连续 2 周期 D 标记"待淘汰"',
    category: 'talent_tag',
    condition: { type: 'consecutive_grade', grades: ['D'], consecutiveCycles: 2 },
    action: { talentTag: '待淘汰', description: '标记+启动 PIP+HRBP 介入' },
    applyScope: {},
    priority: 4,
    status: 'pending_approval',
    needDualConfirm: 1,
    remark: '草拟中，等待 HRD 确认',
    createdBy: '张HR',
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-18 10:00:00'
  }
]

export const applyRuleMock = createCrudMock<PerformanceApplyRule>(initialRules, {
  searchFields: ['name', 'ruleNo'],
  sortField: 'priority'
})

const initialRecords: RuleExecutionRecord[] = [
  {
    id: 1, ruleId: 4, ruleName: '连续 2+ 周期 S/A 进入晋升池', category: 'promotion',
    employeeId: 201, employeeName: '张三',
    context: '2026 Q1 评估：A；2025 年度评估：A',
    executedAction: '加入高潜晋升池（hipo_pool）',
    downstreamStatus: 'executed',
    confirmedBy: '张HR', confirmedAt: '2026-04-06 10:00:00',
    executeTime: '2026-04-05 19:00:00'
  },
  {
    id: 2, ruleId: 2, ruleName: '年度 S 级调薪（10~20%）', category: 'raise',
    employeeId: 301, employeeName: '赵销售',
    context: '2026 Q1 评估：S（校准后）',
    executedAction: '生成调薪建议：+15%，待 HRD 确认',
    downstreamStatus: 'pending',
    executeTime: '2026-04-05 19:00:00'
  },
  {
    id: 3, ruleId: 1, ruleName: '绩效奖金系数（默认）', category: 'bonus',
    employeeId: 201, employeeName: '张三',
    context: '2026 Q1 评估：A',
    executedAction: '奖金系数 1.2，推送至薪酬模块',
    downstreamStatus: 'confirmed',
    confirmedBy: '张HR', confirmedAt: '2026-04-06 10:00:00',
    executeTime: '2026-04-05 19:00:00'
  },
  {
    id: 4, ruleId: 5, ruleName: 'C/D 员工能力提升必修课', category: 'training',
    employeeId: 250, employeeName: '吴测试',
    context: '2025 上半年评估：C',
    executedAction: '已指派 3 门必修课；当前完成率 65%',
    downstreamStatus: 'executed',
    confirmedBy: '培训管理员', confirmedAt: '2025-07-05 10:00:00',
    executeTime: '2025-07-02 19:00:00'
  },
  {
    id: 5, ruleId: 6, ruleName: 'S 级员工打"核心骨干"标签', category: 'talent_tag',
    employeeId: 301, employeeName: '赵销售',
    context: '2026 Q1 评估：S',
    executedAction: '员工档案新增"核心骨干"标签',
    downstreamStatus: 'executed',
    executeTime: '2026-04-05 19:00:00'
  }
]

export const ruleRecordMock = createCrudMock<RuleExecutionRecord>(alignEmployeeFields(initialRecords), {
  searchFields: ['ruleName', 'employeeName'],
  sortField: 'executeTime'
})

/* ========== 业务方法 ========== */

export function confirmRecordMock(id: number, approved: boolean, confirmedBy: string) {
  const r = ruleRecordMock.getDetail(id)
  if (!r) throw new Error('记录不存在')
  r.downstreamStatus = approved ? 'confirmed' : 'rejected'
  r.confirmedBy = confirmedBy
  r.confirmedAt = new Date().toLocaleString('zh-CN')
  ruleRecordMock.update(r)
  return r
}

export function toggleRuleStatusMock(id: number, status: string) {
  const rule = applyRuleMock.getDetail(id)
  if (!rule) throw new Error('规则不存在')
  rule.status = status as any
  rule.updateTime = new Date().toLocaleString('zh-CN')
  applyRuleMock.update(rule)
  return rule
}

export function getApplyStatsMock() {
  const records = ruleRecordMock.getData()
  const byCategory: Record<string, number> = {}
  for (const r of records) {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1
  }
  const pendingCount = records.filter((r) => r.downstreamStatus === 'pending').length
  const rules = applyRuleMock.getData()
  return {
    totalRules: rules.length,
    activeRules: rules.filter((r) => r.status === 'active').length,
    totalRecords: records.length,
    pendingCount,
    byCategory
  }
}
