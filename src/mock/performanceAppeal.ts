/**
 * 绩效申诉 Mock 数据（Phase C2）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { PerformanceAppeal } from '@/types/performanceAppeal'

const initialData: PerformanceAppeal[] = [
  {
    id: 1,
    appealNo: 'AP-2026Q1-001',
    appellantName: '刘洋',
    appellantId: 1010,
    department: '技术研发中心',
    position: '后端工程师',
    cycleId: 1,
    cycleName: '2026 Q1 季度绩效',
    archiveId: 1010,
    originalGrade: 'D',
    originalScore: 55,
    appealType: 'performance_grade',
    reason:
      '本季度 KR2 因合作方技术方案变更导致延期，但已提前 2 周向直属上级报备，评估结果未体现客观因素',
    expectation: '重新评估客观因素后调整等级至 C',
    evidence: '邮件记录 3 封、周会纪要 2 份',
    status: 'submitted',
    resultLocked: true,
    submitTime: '2026-04-10 10:30',
    deadline: '2026-04-17 10:30',
    approvalRecords: [],
    createTime: '2026-04-10 10:30:00',
    updateTime: '2026-04-10 10:30:00'
  },
  {
    id: 2,
    appealNo: 'AP-2026Q1-002',
    appellantName: '许刚',
    appellantId: 2008,
    department: '产品设计中心',
    position: '产品助理',
    cycleId: 1,
    cycleName: '2026 Q1 季度绩效',
    archiveId: 2008,
    originalGrade: 'C',
    originalScore: 62,
    appealType: 'score',
    reason: '协作维度被打 3.0 分，但无具体事实依据，与团队成员的 360 评价不符',
    expectation: '重新评审协作维度分数',
    status: 'level1_approved',
    resultLocked: true,
    submitTime: '2026-04-08 14:20',
    deadline: '2026-04-15 14:20',
    approvalRecords: [
      {
        stage: 'level1',
        approverName: '陈总监',
        result: 'approved',
        comment: '申诉内容确有依据，建议进入二级评议',
        approvalTime: '2026-04-10 16:30'
      }
    ],
    createTime: '2026-04-08 14:20:00',
    updateTime: '2026-04-10 16:30:00'
  },
  {
    id: 3,
    appealNo: 'AP-2026Q1-003',
    appellantName: '郑琪',
    appellantId: 1008,
    department: '技术研发中心',
    position: '前端工程师',
    cycleId: 1,
    cycleName: '2026 Q1 季度绩效',
    archiveId: 1008,
    originalGrade: 'C',
    originalScore: 65,
    appealType: '360_review',
    reason: '360 评价中存在恶意攻击性语言，且与事实严重不符',
    expectation: '剔除恶意评价，对相关评价人警告',
    status: 'committee_reviewing',
    resultLocked: true,
    submitTime: '2026-04-05 09:00',
    deadline: '2026-04-12 09:00',
    approvalRecords: [
      {
        stage: 'level1',
        approverName: '王总监',
        result: 'approved',
        comment: '360 评价存在不当表述，建议 HR 介入',
        approvalTime: '2026-04-07 11:00'
      },
      {
        stage: 'level2',
        approverName: 'HR-Lisa',
        result: 'approved',
        comment: '评价内容确实违反 360 评价规范，已标记相关评价人',
        approvalTime: '2026-04-09 15:30'
      }
    ],
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-09 15:30:00'
  },
  {
    id: 4,
    appealNo: 'AP-2025Q4-012',
    appellantName: '赵静',
    appellantId: 1004,
    department: '技术研发中心',
    position: '后端工程师',
    cycleId: 2,
    cycleName: '2025 Q4 季度绩效',
    archiveId: 1004,
    originalGrade: 'B',
    originalScore: 75,
    appealType: 'performance_grade',
    reason: '历史申诉案例（已结案）：业绩目标超额完成但等级为 B，期望调整至 A',
    expectation: '调整等级至 A',
    status: 'overturned',
    resultLocked: false,
    submitTime: '2026-01-18 10:00',
    deadline: '2026-01-25 10:00',
    approvalRecords: [
      {
        stage: 'level1',
        approverName: '王总监',
        result: 'approved',
        comment: '业绩数据支持调档',
        approvalTime: '2026-01-20 14:00'
      },
      {
        stage: 'level2',
        approverName: 'HR-Lisa',
        result: 'approved',
        comment: '同意进入评议',
        approvalTime: '2026-01-22 09:30'
      },
      {
        stage: 'committee',
        approverName: '绩效评议委员会',
        result: 'overturn',
        comment: '经评议决定调整等级为 A',
        approvalTime: '2026-01-25 15:00'
      }
    ],
    newGrade: 'A',
    newScore: 82,
    createTime: '2026-01-18 10:00:00',
    updateTime: '2026-01-25 15:00:00'
  },
  {
    id: 5,
    appealNo: 'AP-2025Q4-008',
    appellantName: '周梅',
    appellantId: 1006,
    department: '技术研发中心',
    position: '测试工程师',
    cycleId: 2,
    cycleName: '2025 Q4 季度绩效',
    archiveId: 1006,
    originalGrade: 'B',
    originalScore: 72,
    appealType: 'other',
    reason: '对最终等级不认同',
    expectation: '调整等级',
    status: 'final_rejected',
    resultLocked: false,
    submitTime: '2026-01-20 15:30',
    deadline: '2026-01-27 15:30',
    approvalRecords: [
      {
        stage: 'level1',
        approverName: '王总监',
        result: 'rejected',
        comment: '申诉缺乏具体事实依据',
        approvalTime: '2026-01-22 10:00'
      }
    ],
    createTime: '2026-01-20 15:30:00',
    updateTime: '2026-01-22 10:00:00'
  }
]

export const appealMock = createCrudMock<PerformanceAppeal>(initialData, {
  idField: 'id',
  searchFields: ['appellantName', 'appealNo', 'department'],
  sortField: 'submitTime'
})

/**
 * 审批操作（推进流程）
 */
export function approveAppeal(
  id: number,
  stage: 'level1' | 'level2' | 'committee',
  action: 'approved' | 'rejected' | 'overturn' | 'maintain',
  approverName: string,
  comment: string,
  newGrade?: 'S' | 'A' | 'B' | 'C' | 'D',
  newScore?: number
): PerformanceAppeal {
  const appeal = appealMock.getDetail(id)
  if (!appeal) throw new Error('申诉不存在')

  appeal.approvalRecords.push({
    stage,
    approverName,
    result: action,
    comment,
    approvalTime: new Date().toLocaleString('zh-CN')
  })

  // 状态流转
  if (stage === 'level1') {
    appeal.status = action === 'approved' ? 'level1_approved' : 'level1_rejected'
    if (action === 'rejected') appeal.resultLocked = false
  } else if (stage === 'level2') {
    appeal.status = action === 'approved' ? 'level2_approved' : 'level2_rejected'
    if (action === 'rejected') appeal.resultLocked = false
  } else if (stage === 'committee') {
    if (action === 'overturn') {
      appeal.status = 'overturned'
      appeal.newGrade = newGrade
      appeal.newScore = newScore
      appeal.resultLocked = false
    } else {
      appeal.status = 'final_rejected'
      appeal.resultLocked = false
    }
  }

  appealMock.update(appeal)
  return appeal
}

/**
 * 员工撤回申诉
 */
export function withdrawAppeal(id: number): PerformanceAppeal {
  const appeal = appealMock.getDetail(id)
  if (!appeal) throw new Error('申诉不存在')
  appeal.status = 'withdrawn'
  appeal.resultLocked = false
  appealMock.update(appeal)
  return appeal
}

/**
 * 申诉统计数据
 */
export function getAppealAnalytics() {
  const all = appealMock.getData()
  const total = all.length
  const overturned = all.filter((a) => a.status === 'overturned').length
  const inProgress = all.filter(
    (a) =>
      a.status === 'submitted' ||
      a.status === 'level1_approved' ||
      a.status === 'level2_approved' ||
      a.status === 'committee_reviewing'
  ).length
  const closed = all.filter(
    (a) => a.status === 'final_rejected' || a.status === 'overturned' || a.status === 'withdrawn'
  ).length
  const overturnRate = total > 0 ? ((overturned / total) * 100).toFixed(1) : '0'

  // 按部门
  const deptMap: Record<string, number> = {}
  all.forEach((a) => {
    deptMap[a.department] = (deptMap[a.department] || 0) + 1
  })

  // 按类型
  const typeMap: Record<string, number> = {}
  all.forEach((a) => {
    typeMap[a.appealType] = (typeMap[a.appealType] || 0) + 1
  })

  return {
    total,
    overturned,
    inProgress,
    closed,
    overturnRate,
    byDepartment: deptMap,
    byType: typeMap
  }
}
