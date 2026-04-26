// @ts-nocheck
/**
 * 绩效评估 Mock 数据（Phase A5 升级版）
 * 4 级串行节点流程：自评 → 直属上级 → 隔级上级 → HR 归档
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type {
  PerformanceEvaluation,
  EvalNodeRecord,
  NodeScoreDetail,
  EvalGrade
} from '@/types/performanceEvaluation'
import { scoreToGrade } from '@/types/performanceEvaluation'

function buildNodes(
  overall: number,
  dimensionResults: Record<number, NodeScoreDetail[]>,
  scorers: Record<number, { id: number; name: string }>
): EvalNodeRecord[] {
  const defs = [
    { nodeType: 'self', name: '自评', weight: 10, deadline: '2026-04-20' },
    { nodeType: 'direct', name: '直属上级评', weight: 60, deadline: '2026-04-23' },
    { nodeType: 'skip', name: '隔级上级评', weight: 30, deadline: '2026-04-25' },
    { nodeType: 'hr', name: 'HR 归档', weight: 0, deadline: '2026-04-27' }
  ]
  return defs.map((def, idx) => {
    const order = idx + 1
    let status: any = 'pending'
    if (order < overall) status = 'submitted'
    else if (order === overall) status = 'filling'
    const dims = dimensionResults[order]
    const scorer = scorers[order]
    const weightedScore = dims ? Math.round(dims.reduce((s, d) => s + (d.score * d.weight) / 100, 0)) : undefined
    return {
      nodeType: def.nodeType as any,
      nodeName: def.name,
      order,
      weight: def.weight,
      status,
      scorerId: scorer?.id,
      scorerName: scorer?.name,
      dimensionScores: dims,
      weightedScore,
      comment: dims && scorer ? `${def.name}：表现良好，细节处理到位` : undefined,
      submitTime: order < overall ? '2026-04-' + String(14 + order).padStart(2, '0') + ' 10:00:00' : undefined,
      deadline: def.deadline
    } as EvalNodeRecord
  })
}

function calcFinal(nodes: EvalNodeRecord[]): { score: number; grade: EvalGrade } {
  const totalW = nodes.filter((n) => n.weight > 0).reduce((s, n) => s + n.weight, 0)
  if (totalW === 0) return { score: 0, grade: 'C' }
  const score = Math.round(
    nodes
      .filter((n) => n.weight > 0 && n.weightedScore !== undefined)
      .reduce((s, n) => s + ((n.weightedScore || 0) * n.weight) / totalW, 0)
  )
  return { score, grade: scoreToGrade(score) }
}

const techDims = (s1: number, s2: number, s3: number, s4: number): NodeScoreDetail[] => [
  { dimension: '业绩成果', weight: 40, score: s1 },
  { dimension: '专业能力', weight: 30, score: s2 },
  { dimension: '团队协作', weight: 20, score: s3 },
  { dimension: '创新突破', weight: 10, score: s4 }
]

const salesDims = (s1: number, s2: number, s3: number): NodeScoreDetail[] => [
  { dimension: '业绩达成', weight: 70, score: s1 },
  { dimension: '客户服务', weight: 20, score: s2 },
  { dimension: '团队协作', weight: 10, score: s3 }
]

// ========== 评估 1：已归档 ==========
const eval1Nodes = buildNodes(
  5,
  {
    1: techDims(82, 88, 85, 70),
    2: techDims(85, 82, 88, 75),
    3: techDims(88, 80, 90, 72)
  },
  {
    1: { id: 201, name: '张三' },
    2: { id: 101, name: '李技术总监' },
    3: { id: 100, name: '王 CTO' },
    4: { id: 3, name: '张HR' }
  }
)
eval1Nodes[3].status = 'submitted'
eval1Nodes[3].submitTime = '2026-04-19 10:00:00'
const eval1Final = calcFinal(eval1Nodes)

// ========== 评估 2：隔级评中 ==========
const eval2Nodes = buildNodes(
  3,
  {
    1: techDims(80, 85, 82, 65),
    2: techDims(78, 80, 85, 70)
  },
  {
    1: { id: 202, name: '李前端' },
    2: { id: 101, name: '李技术总监' }
  }
)

// ========== 评估 3：自评已交、上级填写中 ==========
const eval3Nodes = buildNodes(2, { 1: techDims(75, 78, 80, 60) }, { 1: { id: 203, name: '周运维' } })
eval3Nodes[0].status = 'submitted'
eval3Nodes[1].status = 'filling'

// ========== 评估 4：待自评 ==========
const eval4Nodes = buildNodes(1, {}, {})
eval4Nodes[0].status = 'pending'

// ========== 评估 5：销售 KPI 已归档（3 节点模板） ==========
const eval5Nodes: EvalNodeRecord[] = [
  {
    nodeType: 'self', nodeName: '自评', order: 1, weight: 5, status: 'submitted',
    scorerId: 301, scorerName: '赵销售', dimensionScores: salesDims(90, 85, 80),
    weightedScore: 88, submitTime: '2026-03-18 10:00:00', deadline: '2026-03-20'
  },
  {
    nodeType: 'direct', nodeName: '销售主管评', order: 2, weight: 75, status: 'submitted',
    scorerId: 302, scorerName: '刘销售主管', dimensionScores: salesDims(92, 80, 75),
    weightedScore: 88, submitTime: '2026-03-22 10:00:00', deadline: '2026-03-25'
  },
  {
    nodeType: 'hr', nodeName: 'HR 归档', order: 3, weight: 20, status: 'submitted',
    scorerId: 3, scorerName: '张HR', dimensionScores: salesDims(90, 82, 78),
    weightedScore: 87, submitTime: '2026-03-28 10:00:00', deadline: '2026-03-30'
  }
]
const eval5Final = calcFinal(eval5Nodes)

// ========== 评估 6：超期 + 升级 ==========
const eval6Nodes = buildNodes(2, { 1: techDims(70, 72, 75, 60) }, { 1: { id: 204, name: '孙七' } })
eval6Nodes[0].status = 'submitted'
eval6Nodes[1].status = 'overdue'
eval6Nodes[1].deadline = '2026-04-15'
eval6Nodes[1].scorerName = '李技术总监'
eval6Nodes[1].scorerId = 101

const initialData: PerformanceEvaluation[] = [
  {
    id: 1,
    evaluationNo: 'EVAL20260401001',
    employeeId: 201,
    employeeName: '张三',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    level: 'P6',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    templateId: 1,
    templateName: '技术研发-P5~P7 评估表',
    nodeRecords: eval1Nodes,
    currentNode: 4,
    finalScore: eval1Final.score,
    initialGrade: eval1Final.grade,
    status: 6,
    statusName: '已归档',
    overdue: 0,
    escalated: 0,
    createTime: '2026-03-15 10:00:00',
    updateTime: '2026-04-19 10:00:00'
  },
  {
    id: 2,
    evaluationNo: 'EVAL20260401002',
    employeeId: 202,
    employeeName: '李前端',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    level: 'P5',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    templateId: 1,
    templateName: '技术研发-P5~P7 评估表',
    nodeRecords: eval2Nodes,
    currentNode: 3,
    status: 4,
    statusName: '隔级评中',
    overdue: 0,
    escalated: 0,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-18 14:00:00'
  },
  {
    id: 3,
    evaluationNo: 'EVAL20260401003',
    employeeId: 203,
    employeeName: '周运维',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    level: 'P5',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    templateId: 1,
    templateName: '技术研发-P5~P7 评估表',
    nodeRecords: eval3Nodes,
    currentNode: 2,
    status: 3,
    statusName: '上级评中',
    overdue: 0,
    escalated: 0,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-17 10:00:00'
  },
  {
    id: 4,
    evaluationNo: 'EVAL20260401004',
    employeeId: 210,
    employeeName: '陈后端',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    level: 'P5',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    templateId: 1,
    templateName: '技术研发-P5~P7 评估表',
    nodeRecords: eval4Nodes,
    currentNode: 1,
    status: 1,
    statusName: '待自评',
    overdue: 0,
    escalated: 0,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 5,
    evaluationNo: 'EVAL20260301005',
    employeeId: 301,
    employeeName: '赵销售',
    departmentId: 3,
    departmentName: '销售部',
    jobFamily: '运营市场',
    level: 'M3',
    cycleId: 8,
    cycleName: '2026 Q1 销售团队 KPI 考核',
    templateId: 4,
    templateName: '销售-全体 KPI 评估表',
    nodeRecords: eval5Nodes,
    currentNode: 3,
    finalScore: eval5Final.score,
    initialGrade: eval5Final.grade,
    status: 6,
    statusName: '已归档',
    overdue: 0,
    escalated: 0,
    createTime: '2026-03-15 10:00:00',
    updateTime: '2026-03-28 10:00:00'
  },
  {
    id: 6,
    evaluationNo: 'EVAL20260401006',
    employeeId: 204,
    employeeName: '孙七',
    departmentId: 1,
    departmentName: '技术部',
    jobFamily: '技术研发',
    level: 'P5',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    templateId: 1,
    templateName: '技术研发-P5~P7 评估表',
    nodeRecords: eval6Nodes,
    currentNode: 2,
    status: 3,
    statusName: '上级评中',
    overdue: 1,
    escalated: 1,
    createTime: '2026-04-10 10:00:00',
    updateTime: '2026-04-16 18:00:00'
  }
]

export const performanceEvaluationMock = createCrudMock<PerformanceEvaluation>(alignEmployeeFields(initialData), {
  searchFields: ['employeeName', 'departmentName', 'evaluationNo', 'cycleName'],
  sortField: 'updateTime'
})

/* ========== 业务操作 ========== */

export function saveEvalDraftMock(evalId: number, nodeOrder: number, dims: NodeScoreDetail[], comment?: string) {
  const e = performanceEvaluationMock.getDetail(evalId)
  if (!e) throw new Error('评估不存在')
  const node = e.nodeRecords.find((n) => n.order === nodeOrder)
  if (!node) throw new Error('节点不存在')
  node.dimensionScores = dims
  node.comment = comment
  node.status = 'filling'
  node.draftSaveTime = new Date().toLocaleString('zh-CN')
  if (dims.length > 0) {
    node.weightedScore = Math.round(dims.reduce((s, d) => s + (d.score * d.weight) / 100, 0))
  }
  e.updateTime = node.draftSaveTime
  performanceEvaluationMock.update(e)
  return e
}

export function submitEvalNodeMock(evalId: number, nodeOrder: number, dims: NodeScoreDetail[], comment?: string) {
  const e = performanceEvaluationMock.getDetail(evalId)
  if (!e) throw new Error('评估不存在')
  const node = e.nodeRecords.find((n) => n.order === nodeOrder)
  if (!node) throw new Error('节点不存在')
  if (node.status === 'submitted') throw new Error('节点已提交')

  const now = new Date().toLocaleString('zh-CN')
  node.dimensionScores = dims
  node.comment = comment
  node.status = 'submitted'
  node.submitTime = now
  if (dims.length > 0) {
    node.weightedScore = Math.round(dims.reduce((s, d) => s + (d.score * d.weight) / 100, 0))
  }

  const next = e.nodeRecords.find((n) => n.order === nodeOrder + 1)
  if (next) {
    next.status = 'filling'
    e.currentNode = next.order
    const statusMap: Record<string, number> = { self: 2, direct: 3, skip: 4, hr: 5 }
    e.status = (statusMap[next.nodeType] || 1) as any
  } else {
    e.status = 6
    const totalW = e.nodeRecords.filter((n) => n.weight > 0).reduce((s, n) => s + n.weight, 0)
    if (totalW > 0) {
      e.finalScore = Math.round(
        e.nodeRecords
          .filter((n) => n.weight > 0 && n.weightedScore !== undefined)
          .reduce((s, n) => s + ((n.weightedScore || 0) * n.weight) / totalW, 0)
      )
      e.initialGrade = scoreToGrade(e.finalScore)
    }
  }
  e.updateTime = now
  performanceEvaluationMock.update(e)
  return e
}

export function escalateEvalMock(evalId: number) {
  const e = performanceEvaluationMock.getDetail(evalId)
  if (!e) throw new Error('评估不存在')
  e.escalated = 1
  e.updateTime = new Date().toLocaleString('zh-CN')
  performanceEvaluationMock.update(e)
  return e
}

export function reassignScorerMock(evalId: number, nodeOrder: number, scorerId: number, scorerName: string) {
  const e = performanceEvaluationMock.getDetail(evalId)
  if (!e) throw new Error('评估不存在')
  const node = e.nodeRecords.find((n) => n.order === nodeOrder)
  if (!node) throw new Error('节点不存在')
  node.scorerId = scorerId
  node.scorerName = scorerName
  e.updateTime = new Date().toLocaleString('zh-CN')
  performanceEvaluationMock.update(e)
  return e
}

export function getEvalStatsMock() {
  const all = performanceEvaluationMock.getData()
  const total = all.length
  const doneCount = all.filter((e) => e.status === 6 || e.status === 7).length
  const overdueCount = all.filter((e) => e.overdue === 1).length
  const escalatedCount = all.filter((e) => e.escalated === 1).length
  const avgScore = doneCount > 0
    ? Math.round(all.filter((e) => e.finalScore).reduce((s, e) => s + (e.finalScore || 0), 0) / doneCount)
    : 0
  return { total, doneCount, overdueCount, escalatedCount, avgScore }
}
