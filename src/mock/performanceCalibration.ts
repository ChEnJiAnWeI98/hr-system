// @ts-nocheck
/**
 * 绩效校准 Mock 数据（Phase A7 升级版）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type {
  PerformanceCalibration,
  CalibrationMeeting,
  CalibrationRecord,
  DepartmentCalibrationSummary,
  DistributionConfig
} from '@/types/performanceCalibration'
import { DEFAULT_DISTRIBUTION } from '@/types/performanceCalibration'
import { performanceEvaluationMock } from './performanceEvaluation'
import type { EvalGrade } from '@/types/performanceEvaluation'

/* ========== 原兼容数据 ========== */
const initialData: PerformanceCalibration[] = [
  {
    id: 1,
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    departmentId: 1,
    departmentName: '技术部',
    excellentRatio: 10, goodRatio: 20, qualifiedRatio: 40, improveRatio: 10,
    totalEmployees: 45, excellentCount: 5, goodCount: 9, qualifiedCount: 18, improveCount: 5,
    status: 1, statusName: '已校准',
    calibrationDate: '2026-03-28',
    createTime: '2026-03-25 10:00:00',
    updateTime: '2026-03-28 18:00:00'
  },
  {
    id: 2,
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    departmentId: 1,
    departmentName: '技术部',
    excellentRatio: 0, goodRatio: 0, qualifiedRatio: 0, improveRatio: 0,
    totalEmployees: 48, excellentCount: 0, goodCount: 0, qualifiedCount: 0, improveCount: 0,
    status: 0, statusName: '待校准',
    calibrationDate: '2026-06-28',
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 3,
    cycleId: 8,
    cycleName: '2026 Q1 销售团队 KPI 考核',
    departmentId: 3,
    departmentName: '销售部',
    excellentRatio: 15, goodRatio: 20, qualifiedRatio: 45, improveRatio: 5,
    totalEmployees: 20, excellentCount: 3, goodCount: 4, qualifiedCount: 9, improveCount: 1,
    status: 0, statusName: '校准中',
    calibrationDate: '2026-03-28',
    createTime: '2026-03-26 10:00:00',
    updateTime: '2026-04-01 15:00:00'
  }
]

export const performanceCalibrationMock = createCrudMock<PerformanceCalibration>(initialData, {
  searchFields: ['cycleName', 'departmentName'],
  sortField: 'updateTime'
})

/* ========== 校准会议 ========== */
const initialMeetings: CalibrationMeeting[] = [
  {
    id: 1,
    meetingNo: 'CALMTG20260326001',
    cycleId: 3,
    cycleName: '2026 Q1 OKR 季度考核',
    title: '2026 Q1 技术部校准会',
    meetingTime: '2026-03-28 14:00:00',
    attendees: [
      { id: 100, name: '王 CTO', role: 'CTO' },
      { id: 101, name: '李技术总监', role: '部门负责人' },
      { id: 3, name: '张HR', role: 'HR' },
      { id: 999, name: 'HRD', role: 'HRD' }
    ],
    departments: ['技术部'],
    minutes: '共 45 人参与校准；按强制分布调整了 4 位边界分数员工；重点讨论 2 名高潜员工晋升候选；1 名员工由 C 级调至 B 级（经理反映近期明显进步）',
    status: 'completed',
    adjustCount: 4,
    createTime: '2026-03-26 10:00:00',
    updateTime: '2026-03-28 18:00:00'
  },
  {
    id: 2,
    meetingNo: 'CALMTG20260601001',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    title: '2026 Q2 技术部校准会',
    meetingTime: '2026-06-28 14:00:00',
    attendees: [
      { id: 100, name: '王 CTO', role: 'CTO' },
      { id: 101, name: '李技术总监', role: '部门负责人' },
      { id: 3, name: '张HR', role: 'HR' }
    ],
    departments: ['技术部'],
    status: 'planning',
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 3,
    meetingNo: 'CALMTG20260326002',
    cycleId: 8,
    cycleName: '2026 Q1 销售团队 KPI 考核',
    title: '销售部 Q1 校准会',
    meetingTime: '2026-04-01 15:00:00',
    attendees: [
      { id: 310, name: '销售 VP', role: '业务负责人' },
      { id: 302, name: '刘销售主管', role: '部门主管' },
      { id: 3, name: '张HR', role: 'HR' }
    ],
    departments: ['销售部'],
    status: 'in_progress',
    adjustCount: 2,
    createTime: '2026-03-26 10:00:00',
    updateTime: '2026-04-01 15:00:00'
  }
]

export const calibrationMeetingMock = createCrudMock<CalibrationMeeting>(initialMeetings, {
  searchFields: ['title', 'meetingNo'],
  sortField: 'meetingTime'
})

/* ========== 校准调档记录 ========== */
const initialRecords: CalibrationRecord[] = [
  {
    id: 1, evaluationId: 1, employeeId: 201, employeeName: '张三', departmentName: '技术部',
    originalScore: 85, beforeGrade: 'A', afterGrade: 'A',
    reason: '评分符合强制分布区间，维持原等级',
    meetingId: 1, adjustedBy: '李技术总监', adjustedById: 101,
    adjustTime: '2026-03-28 15:00:00'
  },
  {
    id: 2, evaluationId: 5, employeeId: 301, employeeName: '赵销售', departmentName: '销售部',
    originalScore: 87, beforeGrade: 'A', afterGrade: 'S',
    reason: '销售额超额完成 Q1 目标 20%，新客户数翻倍，建议提升至 S',
    meetingId: 3, adjustedBy: '刘销售主管', adjustedById: 302,
    adjustTime: '2026-04-01 15:30:00'
  },
  {
    id: 3, evaluationId: 100, employeeId: 250, employeeName: '吴测试', departmentName: '技术部',
    originalScore: 69, beforeGrade: 'C', afterGrade: 'B',
    reason: '近 1 个月承担 Q1 发布压力测试，表现有明显进步，调至 B',
    meetingId: 1, adjustedBy: '李技术总监', adjustedById: 101,
    adjustTime: '2026-03-28 16:00:00'
  },
  {
    id: 4, evaluationId: 101, employeeId: 260, employeeName: '王产品助理', departmentName: '产品部',
    originalScore: 78, beforeGrade: 'B', afterGrade: 'C',
    reason: '横向协作反馈较多，需加强跨部门沟通能力',
    meetingId: 1, adjustedBy: '李技术总监', adjustedById: 101,
    adjustTime: '2026-03-28 16:30:00'
  }
]

export const calibrationRecordMock = createCrudMock<CalibrationRecord>(alignEmployeeFields(initialRecords), {
  searchFields: ['employeeName', 'reason'],
  sortField: 'adjustTime'
})

/* ========== 业务方法 ========== */

/**
 * 获取周期内所有评估任务的分布情况
 */
export function getDistributionSummaryMock(cycleId: number): {
  total: number
  distribution: { S: number; A: number; B: number; C: number; D: number }
  ratios: { S: number; A: number; B: number; C: number; D: number }
  config: DistributionConfig
  departments: DepartmentCalibrationSummary[]
} {
  const evals = performanceEvaluationMock.getData().filter((e) => e.cycleId === cycleId && e.initialGrade)
  const total = evals.length
  const dist = { S: 0, A: 0, B: 0, C: 0, D: 0 }
  const deptMap = new Map<string, any>()

  for (const e of evals) {
    const grade = (e.finalGrade || e.initialGrade) as EvalGrade
    if (grade) dist[grade]++
    if (!deptMap.has(e.departmentName)) {
      deptMap.set(e.departmentName, {
        departmentName: e.departmentName,
        totalEmployees: 0,
        gradeDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0 },
        scores: []
      })
    }
    const d = deptMap.get(e.departmentName)
    d.totalEmployees++
    d.gradeDistribution[grade]++
    if (e.finalScore) d.scores.push(e.finalScore)
  }

  const pct = (n: number) => (total > 0 ? Number(((n / total) * 100).toFixed(1)) : 0)
  const ratios = { S: pct(dist.S), A: pct(dist.A), B: pct(dist.B), C: pct(dist.C), D: pct(dist.D) }

  const departments: DepartmentCalibrationSummary[] = [...deptMap.values()].map((d) => {
    const n = d.totalEmployees
    const gradeRatios = {
      S: n > 0 ? Number(((d.gradeDistribution.S / n) * 100).toFixed(1)) : 0,
      A: n > 0 ? Number(((d.gradeDistribution.A / n) * 100).toFixed(1)) : 0,
      B: n > 0 ? Number(((d.gradeDistribution.B / n) * 100).toFixed(1)) : 0,
      C: n > 0 ? Number(((d.gradeDistribution.C / n) * 100).toFixed(1)) : 0,
      D: n > 0 ? Number(((d.gradeDistribution.D / n) * 100).toFixed(1)) : 0
    }
    const avgScore = d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0
    const target = DEFAULT_DISTRIBUTION
    const deviation =
      Math.abs(gradeRatios.S - target.S) +
      Math.abs(gradeRatios.A - target.A) +
      Math.abs(gradeRatios.B - target.B) +
      Math.abs(gradeRatios.C - target.C) +
      Math.abs(gradeRatios.D - target.D)
    return {
      departmentName: d.departmentName,
      totalEmployees: d.totalEmployees,
      gradeDistribution: d.gradeDistribution,
      gradeRatios,
      avgScore,
      deviation: Number(deviation.toFixed(1)),
      compliant: deviation <= target.tolerance * 5 * 2 // 粗略判断
    }
  })

  return {
    total,
    distribution: dist,
    ratios,
    config: DEFAULT_DISTRIBUTION,
    departments
  }
}

/**
 * 调档（拖拽改等级）
 */
export function adjustGradeMock(data: {
  evaluationId: number
  employeeName: string
  departmentName: string
  originalScore: number
  beforeGrade: EvalGrade
  afterGrade: EvalGrade
  reason: string
  meetingId?: number
  adjustedBy?: string
  adjustedById?: number
}) {
  if (data.beforeGrade === data.afterGrade) throw new Error('等级未变化，无需调档')
  if (!data.reason) throw new Error('必须填写调档原因')

  // 修改评估任务
  const e = performanceEvaluationMock.getDetail(data.evaluationId)
  if (e) {
    e.finalGrade = data.afterGrade
    e.status = 7 // 已校准
    e.updateTime = new Date().toLocaleString('zh-CN')
    performanceEvaluationMock.update(e)
  }

  // 记录调档日志
  const all = calibrationRecordMock.getData()
  const nextId = Math.max(...all.map((r) => r.id), 0) + 1
  const record: CalibrationRecord = {
    id: nextId,
    evaluationId: data.evaluationId,
    employeeId: e?.employeeId || 0,
    employeeName: data.employeeName,
    departmentName: data.departmentName,
    originalScore: data.originalScore,
    beforeGrade: data.beforeGrade,
    afterGrade: data.afterGrade,
    reason: data.reason,
    meetingId: data.meetingId,
    adjustedBy: data.adjustedBy || '校准人',
    adjustedById: data.adjustedById || 0,
    adjustTime: new Date().toLocaleString('zh-CN')
  }
  all.push(record)

  // 更新会议的调档数
  if (data.meetingId) {
    const m = calibrationMeetingMock.getDetail(data.meetingId)
    if (m) {
      m.adjustCount = (m.adjustCount || 0) + 1
      m.updateTime = record.adjustTime
      calibrationMeetingMock.update(m)
    }
  }

  return record
}

/**
 * 推进会议状态
 */
export function advanceMeetingStatusMock(id: number) {
  const m = calibrationMeetingMock.getDetail(id)
  if (!m) throw new Error('会议不存在')
  const next = { planning: 'in_progress', in_progress: 'completed', completed: null, cancelled: null }[m.status]
  if (!next) throw new Error('已是终态')
  m.status = next as any
  m.updateTime = new Date().toLocaleString('zh-CN')
  calibrationMeetingMock.update(m)
  return m
}
