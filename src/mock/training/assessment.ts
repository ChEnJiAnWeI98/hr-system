/**
 * 能力评估 Mock 数据（Phase 4.10）
 *
 * 基于 Phase C1a 能力模型（performanceCompetency）扩展打分。
 * 数据策略：为 ~8 名不同岗位族的员工预置 2 个评估期的记录，自动生成确定性分数。
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  CompetencyAssessment,
  CompetencyAssessmentItem
} from '@/types/training'
import { competencyMock } from '@/mock/performanceCompetency'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 确定性 hash（复用 record 里的模式） */
function hash(a: number, b: number): number {
  return (a * 9301 + b * 49297 + 11) % 100
}

/** 员工岗位族 → 能力库岗位族字符串的映射（能力库用中文字符串）*/
const FAMILY_TO_COMPETENCY_NAME: Record<string, string> = {
  TECH: '技术研发',
  PROD: '产品设计',
  OPS: '运营市场',
  SALES: '销售岗位',
  FUNC: '职能支持',
  MGMT: '管理岗位'
}

/** 从能力库为某岗位族员工抽取 6 个能力项 */
function pickCompetencies(jobFamily: string): number[] {
  const familyName = FAMILY_TO_COMPETENCY_NAME[jobFamily] || '职能支持'
  const all = competencyMock.getData()
  const matched = all.filter(
    (c) => c.status === 1 && (c.jobFamilies.includes(familyName) || c.jobFamilies.length === 0)
  )
  return matched.slice(0, 6).map((c) => c.id)
}

/** 基于员工 ID + 能力 ID 生成确定性分数（3.0 ~ 4.8，保留 1 位小数） */
function scoreOf(employeeId: number, competencyId: number): number {
  const h = hash(employeeId, competencyId)
  return Number((3.0 + (h % 19) / 10).toFixed(1))
}

/** 构造单条评估项 */
function buildItem(empId: number, cId: number): CompetencyAssessmentItem {
  const comp = competencyMock.getData().find((c) => c.id === cId)
  const score = scoreOf(empId, cId)
  const targetLevel = 4
  return {
    competencyId: cId,
    competencyName: comp?.competencyName || '',
    score,
    targetLevel,
    gap: Number((targetLevel - score).toFixed(1)),
    comment: score >= 4 ? '已达标' : score >= 3.5 ? '接近目标，需重点关注' : '建议列入下期培养计划'
  }
}

/** 构造单条评估记录 */
function buildAssessment(
  id: number,
  empIdx: number,
  period: string,
  assessmentType: CompetencyAssessment['assessmentType'],
  assessorIdx: number,
  status: CompetencyAssessment['status'] = 'submitted'
): CompetencyAssessment {
  const emp = EMPLOYEES[empIdx]
  const assessor = EMPLOYEES[assessorIdx]
  const competencyIds = pickCompetencies(emp.jobFamily)
  const items = competencyIds.map((cid) => buildItem(emp.id, cid))
  const avg = items.reduce((s, i) => s + i.score, 0) / items.length
  const overallComment =
    avg >= 4
      ? `${emp.nameZh}整体能力优秀（均值 ${avg.toFixed(1)}），建议纳入高潜培养池`
      : avg >= 3.5
        ? `${emp.nameZh}整体能力达标（均值 ${avg.toFixed(1)}），关键能力继续强化`
        : `${emp.nameZh}存在能力差距（均值 ${avg.toFixed(1)}），建议针对性培训`
  return {
    id,
    employeeId: emp.id,
    employeeName: emp.nameZh,
    orgName: emp.orgName,
    assessmentPeriod: period,
    assessmentType,
    items,
    overallComment,
    assessorId: assessor.id,
    assessorName: assessor.nameZh,
    status,
    submitTime: status === 'submitted' || status === 'approved' ? '2026-04-05 17:00:00' : undefined,
    createTime: period.includes('Q1') ? '2026-03-25 09:00:00' : '2026-04-10 09:00:00',
    updateTime: period.includes('Q1') ? '2026-04-05 17:00:00' : '2026-04-18 11:00:00'
  }
}

/** 预置评估记录 */
const initialData: CompetencyAssessment[] = [
  // 2026 Q1 评估（已提交）
  buildAssessment(1, 0, '2026 Q1', 'supervisor', 20),
  buildAssessment(2, 1, '2026 Q1', 'supervisor', 20),
  buildAssessment(3, 2, '2026 Q1', 'supervisor', 21),
  buildAssessment(4, 3, '2026 Q1', 'supervisor', 21),
  buildAssessment(5, 4, '2026 Q1', 'self', 4),
  buildAssessment(6, 30, '2026 Q1', 'supervisor', 50),
  buildAssessment(7, 31, '2026 Q1', 'supervisor', 50),
  buildAssessment(8, 80, '2026 Q1', 'supervisor', 100),
  buildAssessment(9, 81, '2026 Q1', 'synthesis', 100, 'approved'),

  // 2026 H1 评估（进行中 / 部分已提交）
  buildAssessment(10, 0, '2026 H1', 'supervisor', 20, 'submitted'),
  buildAssessment(11, 1, '2026 H1', 'self', 1, 'draft'),
  buildAssessment(12, 30, '2026 H1', 'supervisor', 50, 'submitted')
]

export const assessmentMock = createCrudMock<CompetencyAssessment>(initialData, {
  searchFields: ['employeeName', 'assessmentPeriod', 'assessorName', 'orgName'],
  sortField: 'createTime'
})

/** 按员工获取评估记录 */
export function getAssessmentsByEmployee(employeeId: number): CompetencyAssessment[] {
  return assessmentMock.getData().filter((a) => a.employeeId === employeeId)
}

/** 构造一次评估的默认 items（新增时自动带出岗位族能力项） */
export function getDefaultItemsFor(employeeId: number): CompetencyAssessmentItem[] {
  const emp = EMPLOYEES.find((e) => e.id === employeeId)
  if (!emp) return []
  const cids = pickCompetencies(emp.jobFamily)
  return cids.map((cid) => {
    const comp = competencyMock.getData().find((c) => c.id === cid)
    return {
      competencyId: cid,
      competencyName: comp?.competencyName || '',
      score: 3.0,
      targetLevel: 4,
      gap: 1.0,
      comment: ''
    }
  })
}
