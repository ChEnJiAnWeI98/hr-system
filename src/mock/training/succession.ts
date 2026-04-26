/**
 * 继任计划 Mock 数据（Phase 4.11）
 *
 * - 关键岗位：从员工池选 M2+ 的岗位作为"关键岗位"
 * - 候选人：部分从 9-box 盘点结果的高潜格子（HH/MH/HM）自动拉取，部分手动添加
 * - 9-box 数据来源：talentReviewMock（已完成的盘点会议）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { KeyPosition, SuccessionCandidate, SuccessionReadiness } from '@/types/training'
import { EMPLOYEES } from '@/mock/core/employeePool'
import { talentReviewMock } from '@/mock/performanceTalentReview'
import type { NineBoxCell } from '@/types/performanceTalentReview'

/** 高潜格子（用于从 9-box 自动拉候选人） */
const HIGH_POTENTIAL_CELLS: NineBoxCell[] = ['HH', 'MH', 'HM']

/** 取某岗位族 + 某等级区间的员工 */
function findByFamilyLevel(family: string, levels: string[]): (typeof EMPLOYEES)[number] | undefined {
  return EMPLOYEES.find((e) => e.jobFamily === family && levels.includes(e.level))
}

/** 预置关键岗位 */
const keyPositions: KeyPosition[] = [
  {
    id: 1,
    positionId: 1001,
    positionName: '技术 VP / CTO',
    currentIncumbentId: findByFamilyLevel('TECH', ['M5', 'M4'])?.id || EMPLOYEES[0].id,
    currentIncumbentName: findByFamilyLevel('TECH', ['M5', 'M4'])?.nameZh || '',
    criticality: 'high',
    description: '负责技术战略、核心技术决策、技术团队搭建，直接影响产品交付和技术竞争力',
    createTime: '2026-01-05 10:00:00'
  },
  {
    id: 2,
    positionId: 1002,
    positionName: '产品 VP',
    currentIncumbentId: findByFamilyLevel('PROD', ['M5', 'M4'])?.id || EMPLOYEES[1].id,
    currentIncumbentName: findByFamilyLevel('PROD', ['M5', 'M4'])?.nameZh || '',
    criticality: 'high',
    description: '负责产品战略、重大产品决策、产品团队管理',
    createTime: '2026-01-05 10:00:00'
  },
  {
    id: 3,
    positionId: 1003,
    positionName: '销售总监',
    currentIncumbentId: findByFamilyLevel('SALES', ['M3', 'M4'])?.id || EMPLOYEES[2].id,
    currentIncumbentName: findByFamilyLevel('SALES', ['M3', 'M4'])?.nameZh || '',
    criticality: 'high',
    description: '负责销售团队建设、业绩达成、大客户关系维护',
    createTime: '2026-01-05 10:00:00'
  },
  {
    id: 4,
    positionId: 1004,
    positionName: '架构师团队负责人',
    currentIncumbentId: findByFamilyLevel('TECH', ['M3'])?.id || EMPLOYEES[3].id,
    currentIncumbentName: findByFamilyLevel('TECH', ['M3'])?.nameZh || '',
    criticality: 'high',
    description: '负责核心架构设计、技术选型决策、架构师团队培养',
    createTime: '2026-01-10 10:00:00'
  },
  {
    id: 5,
    positionId: 1005,
    positionName: '运营总监',
    currentIncumbentId: findByFamilyLevel('OPS', ['M3', 'M4'])?.id || EMPLOYEES[4].id,
    currentIncumbentName: findByFamilyLevel('OPS', ['M3', 'M4'])?.nameZh || '',
    criticality: 'medium',
    description: '负责市场运营、品牌建设、用户增长',
    createTime: '2026-01-10 10:00:00'
  },
  {
    id: 6,
    positionId: 1006,
    positionName: 'HR VP',
    currentIncumbentId: findByFamilyLevel('FUNC', ['M4', 'M3'])?.id || EMPLOYEES[5].id,
    currentIncumbentName: findByFamilyLevel('FUNC', ['M4', 'M3'])?.nameZh || '',
    criticality: 'high',
    description: '负责组织发展、人才战略、企业文化建设',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: 7,
    positionId: 1007,
    positionName: '财务总监',
    currentIncumbentId: findByFamilyLevel('FUNC', ['M3'])?.id || EMPLOYEES[6].id,
    currentIncumbentName: findByFamilyLevel('FUNC', ['M3'])?.nameZh || '',
    criticality: 'high',
    description: '负责财务战略、预算管理、风险控制',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: 8,
    positionId: 1008,
    positionName: '产品线负责人（企业版）',
    currentIncumbentId: findByFamilyLevel('PROD', ['M2'])?.id || EMPLOYEES[7].id,
    currentIncumbentName: findByFamilyLevel('PROD', ['M2'])?.nameZh || '',
    criticality: 'medium',
    description: '负责企业版产品线规划、关键客户需求对接',
    createTime: '2026-01-20 10:00:00'
  }
]

export const keyPositionMock = createCrudMock<KeyPosition>(keyPositions, {
  searchFields: ['positionName', 'currentIncumbentName'],
  sortField: 'criticality'
})

/** 构造候选人 */
function candidateOf(
  id: number,
  keyPositionId: number,
  empIdx: number,
  readiness: SuccessionReadiness,
  source: '9box' | 'manual',
  nineBoxCell?: NineBoxCell,
  nominatorIdx: number = 0,
  comment?: string
): SuccessionCandidate {
  const emp = EMPLOYEES[empIdx] || EMPLOYEES[0]
  const nominator = EMPLOYEES[nominatorIdx] || EMPLOYEES[0]
  return {
    id,
    keyPositionId,
    candidateEmployeeId: emp.id,
    candidateName: emp.nameZh,
    candidateOrgName: emp.orgName,
    candidatePositionName: emp.positionName,
    candidateLevel: emp.level,
    readiness,
    source,
    nineBoxCell,
    nominatorName: nominator.nameZh,
    nominationTime: '2026-04-01 14:00:00',
    comment:
      comment ||
      (readiness === 'ready'
        ? '能力已达标，绩效连续高位，可随时接替'
        : readiness === 'developing'
          ? '核心能力达标，需补齐 1~2 项短板，预计 12~18 个月内可接替'
          : '潜力突出，需 3~5 年系统培养')
  }
}

/** 预置候选人 */
const candidates: SuccessionCandidate[] = [
  // 1 = 技术 VP / CTO 候选人（技术族 M3+）
  candidateOf(1, 1, findByFamilyLevel('TECH', ['M3']) ? EMPLOYEES.findIndex((e) => e === findByFamilyLevel('TECH', ['M3'])) : 10, 'ready', '9box', 'HH', 0, '架构能力突出，已独立负责 2 次战略级技术选型'),
  candidateOf(2, 1, 15, 'developing', '9box', 'MH', 0, '技术深度优秀，管理经验需补充'),
  candidateOf(3, 1, 25, 'long_term', 'manual', undefined, 5, '潜力候选，需系统性提升架构广度'),

  // 2 = 产品 VP 候选人
  candidateOf(4, 2, 40, 'ready', '9box', 'HH', 1, '已主导 3 个产品线战略规划，跨部门协同能力强'),
  candidateOf(5, 2, 45, 'developing', '9box', 'HM', 1, '业务理解深，需补充行业视野'),
  candidateOf(6, 2, 55, 'long_term', 'manual', undefined, 10),

  // 3 = 销售总监候选人
  candidateOf(7, 3, 60, 'ready', '9box', 'HH', 2, '业绩连续 3 年 S 级，大客户关系稳固'),
  candidateOf(8, 3, 65, 'developing', 'manual', undefined, 10),

  // 4 = 架构师团队负责人候选人
  candidateOf(9, 4, 20, 'ready', '9box', 'MH', 3, '设计能力扎实，带过 5 人小组'),
  candidateOf(10, 4, 22, 'developing', 'manual', undefined, 3),

  // 5 = 运营总监候选人
  candidateOf(11, 5, 70, 'developing', '9box', 'HM', 4, '运营方法论扎实，需提升品牌视野'),
  candidateOf(12, 5, 75, 'long_term', 'manual', undefined, 4),

  // 6 = HR VP 候选人
  candidateOf(13, 6, 85, 'ready', '9box', 'HH', 5, '组织发展经验丰富，OKR 推动能力强'),
  candidateOf(14, 6, 90, 'developing', 'manual', undefined, 5),

  // 7 = 财务总监候选人
  candidateOf(15, 7, 95, 'developing', '9box', 'MH', 6, '财务专业扎实，需补充战略视野'),

  // 8 = 产品线负责人候选人
  candidateOf(16, 8, 50, 'ready', '9box', 'HH', 1),
  candidateOf(17, 8, 52, 'developing', 'manual', undefined, 1)
]

export const successionCandidateMock = createCrudMock<SuccessionCandidate>(candidates, {
  searchFields: ['candidateName', 'candidateOrgName'],
  sortField: 'readiness'
})

/** 按关键岗位获取候选人 */
export function getCandidatesByPosition(keyPositionId: number): SuccessionCandidate[] {
  return successionCandidateMock
    .getData()
    .filter((c) => c.keyPositionId === keyPositionId)
    .sort((a, b) => {
      const order = { ready: 0, developing: 1, long_term: 2 }
      return order[a.readiness] - order[b.readiness]
    })
}

/** 从 9-box 拉取高潜员工（排除已经是候选人 / 当前任职人的） */
export function getHighPotentialFromNineBox(
  keyPositionId: number
): Array<{
  employeeId: number
  employeeName: string
  orgName: string
  positionName: string
  level: string
  nineBoxCell: NineBoxCell
  meetingName: string
}> {
  const existing = successionCandidateMock
    .getData()
    .filter((c) => c.keyPositionId === keyPositionId)
    .map((c) => c.candidateEmployeeId)
  const keyPos = keyPositionMock.getDetail(keyPositionId)
  const excludeIds = new Set([...existing, keyPos?.currentIncumbentId].filter(Boolean) as number[])

  const result: Array<{
    employeeId: number
    employeeName: string
    orgName: string
    positionName: string
    level: string
    nineBoxCell: NineBoxCell
    meetingName: string
  }> = []

  talentReviewMock.getData().forEach((meeting) => {
    meeting.entries.forEach((entry) => {
      if (HIGH_POTENTIAL_CELLS.includes(entry.currentCell) && !excludeIds.has(entry.employeeId)) {
        result.push({
          employeeId: entry.employeeId,
          employeeName: entry.employeeName,
          orgName: entry.department,
          positionName: entry.position,
          level: 'P6',
          nineBoxCell: entry.currentCell,
          meetingName: meeting.meetingName
        })
      }
    })
  })

  return result
}
