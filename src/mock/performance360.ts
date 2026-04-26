// @ts-nocheck
/**
 * 360 度评估 Mock 数据（Phase A6）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  ReviewerRelation,
  ReviewFeedback,
  ReviewAggregatedResult,
  ReviewerType
} from '@/types/performance360'
import { REVIEWER_TYPE_MAP, DEFAULT_360_DIMENSIONS } from '@/types/performance360'

/* ========== 评估关系预置数据 ========== */
// 场景 1：张三（评估 1）的 360 - 6 个评估人
const rels: ReviewerRelation[] = [
  {
    id: 1, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 101, reviewerName: '李技术总监', reviewerDept: '技术部',
    reviewerType: 'superior', nominationSource: 'self', approverName: '张HR',
    approveTime: '2026-03-20 10:00:00', status: 'submitted',
    createTime: '2026-03-18 10:00:00'
  },
  {
    id: 2, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 202, reviewerName: '李前端', reviewerDept: '技术部',
    reviewerType: 'peer', nominationSource: 'self', approverName: '李技术总监',
    approveTime: '2026-03-20 10:00:00', status: 'submitted',
    createTime: '2026-03-18 10:00:00'
  },
  {
    id: 3, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 203, reviewerName: '周运维', reviewerDept: '技术部',
    reviewerType: 'peer', nominationSource: 'self', approverName: '李技术总监',
    approveTime: '2026-03-20 10:00:00', status: 'submitted',
    createTime: '2026-03-18 10:00:00'
  },
  {
    id: 4, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 210, reviewerName: '陈后端', reviewerDept: '技术部',
    reviewerType: 'subordinate', nominationSource: 'superior', approverName: '李技术总监',
    approveTime: '2026-03-20 10:00:00', status: 'submitted',
    createTime: '2026-03-18 10:00:00'
  },
  {
    id: 5, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 220, reviewerName: '林数据', reviewerDept: '数据部',
    reviewerType: 'cross', nominationSource: 'self', approverName: '李技术总监',
    approveTime: '2026-03-20 10:00:00', status: 'submitted',
    createTime: '2026-03-18 10:00:00'
  },
  {
    id: 6, evaluationId: 1, subjectId: 201, subjectName: '张三', subjectDept: '技术部',
    cycleId: 3, reviewerId: 221, reviewerName: '李产品', reviewerDept: '产品部',
    reviewerType: 'cross', nominationSource: 'self', approverName: '李技术总监',
    approveTime: '2026-03-20 10:00:00', status: 'declined',
    rejectReason: '因交集有限，对候选人了解不足，婉拒',
    createTime: '2026-03-18 10:00:00'
  },
  // 场景 2：李前端（评估 2）的 360 - 待核准
  {
    id: 7, evaluationId: 2, subjectId: 202, subjectName: '李前端', subjectDept: '技术部',
    cycleId: 4, reviewerId: 101, reviewerName: '李技术总监', reviewerDept: '技术部',
    reviewerType: 'superior', nominationSource: 'self', status: 'approved',
    approverName: '张HR', approveTime: '2026-04-17 10:00:00',
    createTime: '2026-04-16 10:00:00'
  },
  {
    id: 8, evaluationId: 2, subjectId: 202, subjectName: '李前端', subjectDept: '技术部',
    cycleId: 4, reviewerId: 201, reviewerName: '张三', reviewerDept: '技术部',
    reviewerType: 'peer', nominationSource: 'self', status: 'proposed',
    createTime: '2026-04-16 10:00:00'
  },
  {
    id: 9, evaluationId: 2, subjectId: 202, subjectName: '李前端', subjectDept: '技术部',
    cycleId: 4, reviewerId: 203, reviewerName: '周运维', reviewerDept: '技术部',
    reviewerType: 'peer', nominationSource: 'self', status: 'proposed',
    createTime: '2026-04-16 10:00:00'
  },
  {
    id: 10, evaluationId: 2, subjectId: 202, subjectName: '李前端', subjectDept: '技术部',
    cycleId: 4, reviewerId: 222, reviewerName: '郑设计', reviewerDept: '设计部',
    reviewerType: 'cross', nominationSource: 'self', status: 'proposed',
    createTime: '2026-04-16 10:00:00'
  }
]

export const reviewerRelationMock = createCrudMock<ReviewerRelation>(rels, {
  searchFields: ['subjectName', 'reviewerName']
})

/* ========== 反馈预置数据 ========== */

function buildDims(s: [number, number, number, number, number, number]) {
  return DEFAULT_360_DIMENSIONS.map((dim, i) => ({ dimension: dim, score: s[i] }))
}

const feedbacks: ReviewFeedback[] = [
  {
    id: 1, relationId: 1,
    dimensionScores: buildDims([4.5, 4.5, 5, 5, 4, 4.5]),
    overallScore: 89,
    strengths: '技术深度扎实，问题定位敏锐；多次在关键项目中发挥骨干作用',
    improvements: '可更多参与跨团队协作，扩大影响力',
    anonymous: 0, quality: 'normal', submitTime: '2026-03-22 14:00:00'
  },
  {
    id: 2, relationId: 2,
    dimensionScores: buildDims([4, 4.5, 4.5, 4, 3.5, 4]),
    overallScore: 82,
    strengths: '代码质量高，乐于分享技术',
    improvements: '有时推进复杂任务略有保守',
    anonymous: 1, quality: 'normal', submitTime: '2026-03-23 10:00:00'
  },
  {
    id: 3, relationId: 3,
    dimensionScores: buildDims([4, 4, 4.5, 5, 3.5, 4]),
    overallScore: 82,
    strengths: '团队协作非常到位，愿意帮助运维排查上线问题',
    improvements: '技术分享频次可以更高',
    anonymous: 1, quality: 'normal', submitTime: '2026-03-23 16:00:00'
  },
  {
    id: 4, relationId: 4,
    dimensionScores: buildDims([4.5, 4.5, 4.5, 5, 4, 4.5]),
    overallScore: 89,
    strengths: '作为导师耐心细致，明显带动了新人的成长',
    improvements: '期待更多系统架构层面的深度输出',
    anonymous: 1, quality: 'normal', submitTime: '2026-03-24 10:00:00'
  },
  {
    id: 5, relationId: 5,
    dimensionScores: buildDims([4, 4, 4.5, 4, 3.5, 4]),
    overallScore: 80,
    strengths: '对接数据需求响应快',
    improvements: '提供接口文档可以更完整',
    anonymous: 1, quality: 'normal', submitTime: '2026-03-24 14:00:00'
  }
]

export const reviewFeedbackMock = createCrudMock<ReviewFeedback>(feedbacks, {
  searchFields: []
})

/* ========== 业务操作 ========== */

/**
 * 员工自选评估人
 */
export function nominateReviewersMock(
  evaluationId: number,
  subjectId: number,
  subjectName: string,
  reviewers: Array<Partial<ReviewerRelation>>,
  source: 'self' | 'superior' | 'hr' = 'self'
) {
  const all = reviewerRelationMock.getData()
  let nextId = Math.max(...all.map((r) => r.id), 0) + 1
  const now = new Date().toLocaleString('zh-CN')
  const created: ReviewerRelation[] = []
  for (const r of reviewers) {
    const rel: ReviewerRelation = {
      id: nextId++,
      evaluationId,
      subjectId,
      subjectName,
      subjectDept: r.subjectDept || '',
      cycleId: r.cycleId || 0,
      reviewerId: r.reviewerId || 0,
      reviewerName: r.reviewerName || '',
      reviewerDept: r.reviewerDept || '',
      reviewerType: r.reviewerType || 'peer',
      nominationSource: source,
      status: source === 'hr' ? 'approved' : 'proposed',
      createTime: now
    }
    all.push(rel)
    created.push(rel)
  }
  return created
}

/**
 * 核准 / 拒绝评估人提名
 */
export function approveReviewerMock(id: number, approved: boolean, approverName: string, reason?: string) {
  const rel = reviewerRelationMock.getDetail(id)
  if (!rel) throw new Error('关系不存在')
  rel.status = approved ? 'approved' : 'rejected'
  rel.approverName = approverName
  rel.approveTime = new Date().toLocaleString('zh-CN')
  if (!approved) rel.rejectReason = reason
  reviewerRelationMock.update(rel)
  return rel
}

/**
 * 评估人婉拒
 */
export function declineReviewerMock(id: number, reason: string) {
  const rel = reviewerRelationMock.getDetail(id)
  if (!rel) throw new Error('关系不存在')
  rel.status = 'declined'
  rel.rejectReason = reason
  reviewerRelationMock.update(rel)
  return rel
}

/**
 * 提交反馈
 */
export function submitFeedbackMock(
  relationId: number,
  data: {
    dimensionScores: Array<{ dimension: string; score: number }>
    strengths?: string
    improvements?: string
  }
) {
  const rel = reviewerRelationMock.getDetail(relationId)
  if (!rel) throw new Error('关系不存在')
  if (rel.status !== 'approved') throw new Error('仅已核准的关系可提交反馈')

  // 质量检查
  const totalWords = (data.strengths || '').length + (data.improvements || '').length
  const uniqueScores = new Set(data.dimensionScores.map((d) => d.score)).size
  const quality: 'normal' | 'low' = totalWords < 20 || uniqueScores === 1 ? 'low' : 'normal'

  // 综合分（1-5 → ×20）
  const avg = data.dimensionScores.reduce((s, d) => s + d.score, 0) / data.dimensionScores.length
  const overallScore = Math.round(avg * 20)

  // 匿名性：上级实名、其他匿名
  const anonymous: 0 | 1 = rel.reviewerType === 'superior' ? 0 : 1

  const all = reviewFeedbackMock.getData()
  const nextId = Math.max(...all.map((f) => f.id), 0) + 1
  const fb: ReviewFeedback = {
    id: nextId,
    relationId,
    dimensionScores: data.dimensionScores,
    overallScore,
    strengths: data.strengths,
    improvements: data.improvements,
    anonymous,
    quality,
    submitTime: new Date().toLocaleString('zh-CN')
  }
  all.push(fb)

  // 更新关系状态
  rel.status = 'submitted'
  reviewerRelationMock.update(rel)

  return fb
}

/**
 * 获取被评估人的聚合结果
 */
export function getAggregatedResultMock(subjectId: number, evaluationId: number): ReviewAggregatedResult | null {
  const allRels = reviewerRelationMock.getData().filter((r) => r.subjectId === subjectId && r.evaluationId === evaluationId)
  if (allRels.length === 0) return null

  const submittedRelIds = allRels.filter((r) => r.status === 'submitted').map((r) => r.id)
  const allFbs = reviewFeedbackMock.getData().filter((f) => submittedRelIds.includes(f.relationId))

  const counts: Record<ReviewerType, number> = {
    subordinate: 0, peer: 0, cross: 0, superior: 0
  }
  const sumByType: Record<ReviewerType, { sum: number; n: number }> = {
    subordinate: { sum: 0, n: 0 }, peer: { sum: 0, n: 0 }, cross: { sum: 0, n: 0 }, superior: { sum: 0, n: 0 }
  }

  for (const fb of allFbs) {
    const rel = allRels.find((r) => r.id === fb.relationId)
    if (!rel) continue
    const type = rel.reviewerType
    counts[type]++
    sumByType[type].sum += fb.overallScore
    sumByType[type].n++
  }

  const avgScores: Record<ReviewerType, number> = {
    subordinate: sumByType.subordinate.n > 0 ? Math.round(sumByType.subordinate.sum / sumByType.subordinate.n) : 0,
    peer: sumByType.peer.n > 0 ? Math.round(sumByType.peer.sum / sumByType.peer.n) : 0,
    cross: sumByType.cross.n > 0 ? Math.round(sumByType.cross.sum / sumByType.cross.n) : 0,
    superior: sumByType.superior.n > 0 ? Math.round(sumByType.superior.sum / sumByType.superior.n) : 0
  }

  // 加权综合分
  let weightedScore = 0
  let totalWeight = 0
  for (const type of ['subordinate', 'peer', 'cross', 'superior'] as ReviewerType[]) {
    if (avgScores[type] > 0) {
      const w = REVIEWER_TYPE_MAP[type].weight
      weightedScore += avgScores[type] * w
      totalWeight += w
    }
  }
  if (totalWeight > 0) weightedScore = Math.round(weightedScore / totalWeight)

  // 各维度平均（跨评估人）
  const dimMap = new Map<string, { sum: number; n: number }>()
  for (const fb of allFbs) {
    for (const d of fb.dimensionScores) {
      if (!dimMap.has(d.dimension)) dimMap.set(d.dimension, { sum: 0, n: 0 })
      const m = dimMap.get(d.dimension)!
      m.sum += d.score
      m.n++
    }
  }
  const dimensionAverage = [...dimMap.entries()].map(([dimension, v]) => ({
    dimension,
    score: v.n > 0 ? Number((v.sum / v.n).toFixed(2)) : 0
  }))

  // 文字反馈
  const strengths = allFbs.filter((f) => f.strengths).map((f) => f.strengths!)
  const improvements = allFbs.filter((f) => f.improvements).map((f) => f.improvements!)

  // 提交率
  const submissionRate = allRels.length > 0 ? Math.round((allFbs.length / allRels.length) * 100) : 0

  return {
    subjectId,
    subjectName: allRels[0].subjectName,
    evaluationId,
    cycleId: allRels[0].cycleId,
    counts,
    avgScores,
    weightedScore,
    dimensionAverage,
    strengths,
    improvements,
    submissionRate
  }
}
