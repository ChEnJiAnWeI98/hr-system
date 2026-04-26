// @ts-nocheck
/**
 * 绩效数据分析 Mock（Phase B3）
 * 基于 performanceEvaluationMock / performanceArchiveMock 等跨模块聚合
 */
import type {
  AnalyticsQueryParams,
  AnalyticsDashboard,
  GradeDistribution,
  DepartmentCompareRow,
  JobFamilyCompareRow,
  CycleTrendPoint,
  ReviewerProfile,
  AnomalyItem,
  EmpPotentialItem,
  ProcessCompletionRate
} from '@/types/performanceAnalytics'
import { performanceEvaluationMock } from './performanceEvaluation'
import { performanceArchiveMock, getHiPoListMock, getAttentionListMock } from './performanceArchive'
import { oneOnOneMock } from './performanceOneOnOne'
import { performanceMeetingMock } from './performanceMeeting'
import { performanceGoalMock } from './performanceGoal'
import { pipMock } from './performancePIP'

function calcDistribution(grades: string[]): GradeDistribution {
  const count = { S: 0, A: 0, B: 0, C: 0, D: 0 }
  for (const g of grades) if (count[g] !== undefined) count[g]++
  const total = grades.length
  const pct = (n: number) => (total > 0 ? Number(((n / total) * 100).toFixed(1)) : 0)
  return {
    total,
    ...count,
    ratios: { S: pct(count.S), A: pct(count.A), B: pct(count.B), C: pct(count.C), D: pct(count.D) }
  }
}

/** 总体分布（所有已归档评估任务） */
export function getDistributionMock(params: AnalyticsQueryParams = {}): GradeDistribution {
  let evals = performanceEvaluationMock.getData().filter((e) => e.initialGrade)
  if (params.cycleId) evals = evals.filter((e) => e.cycleId === params.cycleId)
  if (params.departmentName) evals = evals.filter((e) => e.departmentName === params.departmentName)
  const grades = evals.map((e) => e.finalGrade || e.initialGrade!) as string[]
  return calcDistribution(grades)
}

/** 部门对比 */
export function getDepartmentCompareMock(params: AnalyticsQueryParams = {}): DepartmentCompareRow[] {
  let evals = performanceEvaluationMock.getData().filter((e) => e.initialGrade)
  if (params.cycleId) evals = evals.filter((e) => e.cycleId === params.cycleId)

  const map = new Map<string, any>()
  for (const e of evals) {
    if (!map.has(e.departmentName)) {
      map.set(e.departmentName, {
        departmentName: e.departmentName,
        grades: [] as string[],
        scores: [] as number[]
      })
    }
    const d = map.get(e.departmentName)
    d.grades.push(e.finalGrade || e.initialGrade)
    if (e.finalScore) d.scores.push(e.finalScore)
  }

  return [...map.values()].map((d) => {
    const dist = calcDistribution(d.grades)
    return {
      departmentName: d.departmentName,
      total: dist.total,
      avgScore: d.scores.length ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
      gradeRatios: dist.ratios,
      SACount: dist.S + dist.A,
      CDCount: dist.C + dist.D
    } as DepartmentCompareRow
  })
}

/** 岗位族对比 */
export function getJobFamilyCompareMock(params: AnalyticsQueryParams = {}): JobFamilyCompareRow[] {
  let evals = performanceEvaluationMock.getData().filter((e) => e.initialGrade && e.jobFamily)
  if (params.cycleId) evals = evals.filter((e) => e.cycleId === params.cycleId)

  const map = new Map<string, any>()
  for (const e of evals) {
    if (!map.has(e.jobFamily!)) {
      map.set(e.jobFamily!, { jobFamily: e.jobFamily, grades: [], scores: [] })
    }
    const f = map.get(e.jobFamily!)
    f.grades.push(e.finalGrade || e.initialGrade)
    if (e.finalScore) f.scores.push(e.finalScore)
  }

  return [...map.values()].map((f) => {
    const dist = calcDistribution(f.grades)
    return {
      jobFamily: f.jobFamily,
      total: dist.total,
      avgScore: f.scores.length ? Math.round(f.scores.reduce((a, b) => a + b, 0) / f.scores.length) : 0,
      highRate: dist.ratios.S + dist.ratios.A
    }
  })
}

/** 周期趋势：从档案聚合 */
export function getCycleTrendMock(): CycleTrendPoint[] {
  const archives = performanceArchiveMock.getData()
  const map = new Map<number, any>()
  for (const a of archives) {
    if (!map.has(a.cycleId)) {
      map.set(a.cycleId, { cycleId: a.cycleId, cycleName: a.cycleName, grades: [], scores: [] })
    }
    const c = map.get(a.cycleId)
    c.grades.push(a.grade || a.rating)
    c.scores.push(a.finalScore)
  }
  return [...map.values()]
    .map((c) => {
      const dist = calcDistribution(c.grades)
      return {
        cycleId: c.cycleId,
        cycleName: c.cycleName,
        total: dist.total,
        avgScore: c.scores.length ? Math.round(c.scores.reduce((a, b) => a + b, 0) / c.scores.length) : 0,
        SARate: dist.ratios.S + dist.ratios.A,
        CDRate: dist.ratios.C + dist.ratios.D
      } as CycleTrendPoint
    })
    .sort((a, b) => a.cycleId - b.cycleId)
}

/** 评估人画像 */
export function getReviewerProfilesMock(): ReviewerProfile[] {
  const evals = performanceEvaluationMock.getData()
  const map = new Map<string, any>()
  for (const e of evals) {
    for (const n of e.nodeRecords || []) {
      if (n.status !== 'submitted' || !n.scorerId || !n.weightedScore) continue
      const key = `${n.scorerId}`
      if (!map.has(key)) {
        map.set(key, {
          reviewerId: n.scorerId,
          reviewerName: n.scorerName,
          department: e.departmentName,
          scores: []
        })
      }
      map.get(key).scores.push(n.weightedScore)
    }
  }

  return [...map.values()]
    .filter((r) => r.scores.length >= 1)
    .map((r) => {
      const avg = r.scores.reduce((a, b) => a + b, 0) / r.scores.length
      const variance = r.scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / r.scores.length
      const stdev = Math.sqrt(variance)

      let tendency: 'loose' | 'strict' | 'neutral' = 'neutral'
      if (avg > 85) tendency = 'loose'
      else if (avg < 70) tendency = 'strict'

      const buckets = [
        { range: '<60', count: 0 },
        { range: '60-69', count: 0 },
        { range: '70-79', count: 0 },
        { range: '80-89', count: 0 },
        { range: '90+', count: 0 }
      ]
      for (const s of r.scores) {
        if (s < 60) buckets[0].count++
        else if (s < 70) buckets[1].count++
        else if (s < 80) buckets[2].count++
        else if (s < 90) buckets[3].count++
        else buckets[4].count++
      }

      return {
        reviewerId: r.reviewerId,
        reviewerName: r.reviewerName,
        department: r.department,
        reviewCount: r.scores.length,
        avgScore: Math.round(avg),
        stdev: Number(stdev.toFixed(1)),
        tendency,
        scoreBuckets: buckets
      } as ReviewerProfile
    })
    .sort((a, b) => b.reviewCount - a.reviewCount)
}

/** 异常检测（简化实现） */
export function getAnomaliesMock(): AnomalyItem[] {
  const anomalies: AnomalyItem[] = []
  const profiles = getReviewerProfilesMock()

  // 撞墙：stdev < 3 且 reviewCount >= 3
  for (const p of profiles) {
    if (p.reviewCount >= 3 && p.stdev < 3) {
      anomalies.push({
        type: 'score_wall',
        severity: 'medium',
        target: `${p.reviewerName}（${p.department}）`,
        description: `${p.reviewerName} 评分标准差仅 ${p.stdev}，评分过于集中，可能存在"撞墙"打分`,
        detectedAt: new Date().toLocaleString('zh-CN')
      })
    }
    if (p.tendency === 'loose') {
      anomalies.push({
        type: 'grade_skew',
        severity: 'low',
        target: `${p.reviewerName}`,
        description: `${p.reviewerName} 平均分 ${p.avgScore}，偏宽，建议回到 75-80 中位`,
        detectedAt: new Date().toLocaleString('zh-CN')
      })
    }
    if (p.tendency === 'strict') {
      anomalies.push({
        type: 'grade_skew',
        severity: 'medium',
        target: `${p.reviewerName}`,
        description: `${p.reviewerName} 平均分 ${p.avgScore}，偏严，注意是否影响部门分布`,
        detectedAt: new Date().toLocaleString('zh-CN')
      })
    }
  }

  // 部门分布异常
  const deptRows = getDepartmentCompareMock()
  for (const d of deptRows) {
    if (d.total >= 3 && d.gradeRatios.S + d.gradeRatios.A > 60) {
      anomalies.push({
        type: 'grade_skew',
        severity: 'high',
        target: d.departmentName,
        description: `${d.departmentName} S/A 比例达 ${(d.gradeRatios.S + d.gradeRatios.A).toFixed(1)}%，偏离 30% 强制分布较远`,
        detectedAt: new Date().toLocaleString('zh-CN')
      })
    }
  }

  return anomalies
}

/** 过程完成率 */
export function getProcessCompletionMock(): ProcessCompletionRate {
  const oooTotal = oneOnOneMock.getData().length
  const oooUnique = new Set(oneOnOneMock.getData().map((o) => o.employeeId)).size
  const meetings = performanceMeetingMock.getData()
  const completedMeetings = meetings.filter((m) => ['completed', 'confirmed', 'resolved'].includes(m.status)).length
  const confirmedMeetings = meetings.filter((m) => m.employeeConfirmStatus === 'confirmed').length

  const goals = performanceGoalMock.getData()
  const goalApproved = goals.filter((g) => g.approvalStatus === 1).length

  const pips = pipMock.getData()
  const pipDone = pips.filter((p) => p.result === 'passed' || p.result === 'failed').length
  const pipPassed = pips.filter((p) => p.result === 'passed').length

  return {
    oooCoverage: oooTotal > 0 ? Math.round((oooUnique / 15) * 100) : 0, // 假设全员 15 人
    meetingCompleteRate: meetings.length > 0 ? Math.round((completedMeetings / meetings.length) * 100) : 0,
    meetingConfirmRate: completedMeetings > 0 ? Math.round((confirmedMeetings / completedMeetings) * 100) : 0,
    goalApprovedRate: goals.length > 0 ? Math.round((goalApproved / goals.length) * 100) : 0,
    pipPassRate: pipDone > 0 ? Math.round((pipPassed / pipDone) * 100) : 0
  }
}

/** 综合仪表盘 */
export function getDashboardMock(params: AnalyticsQueryParams = {}): AnalyticsDashboard {
  const hipoList: EmpPotentialItem[] = getHiPoListMock().map((h) => ({
    employeeId: h.employeeId,
    employeeName: h.employeeName,
    department: h.departmentName,
    avgScore: h.avgScore,
    recentGrades: [],
    signalType: 'hipo',
    reason: `连续 ${h.totalCycles} 个周期 S/A 且无 PIP`
  }))

  const attentionList: EmpPotentialItem[] = getAttentionListMock().map((a) => ({
    employeeId: a.employeeId,
    employeeName: a.employeeName,
    department: a.departmentName,
    avgScore: a.avgScore,
    recentGrades: [],
    signalType: 'attention',
    reason: '近 2 周期出现 C/D 记录'
  }))

  return {
    distribution: getDistributionMock(params),
    departments: getDepartmentCompareMock(params),
    jobFamilies: getJobFamilyCompareMock(params),
    cycleTrend: getCycleTrendMock(),
    reviewerProfiles: getReviewerProfilesMock(),
    anomalies: getAnomaliesMock(),
    hipoList,
    attentionList,
    processCompletion: getProcessCompletionMock()
  }
}
