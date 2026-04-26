/**
 * 人才盘点 Mock 数据（Phase C1b）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  TalentReviewMeeting,
  TalentReviewEntry,
  NineBoxCell,
  PotentialLevel
} from '@/types/performanceTalentReview'
import {
  NINE_BOX_CELL_CATEGORY,
  NINE_BOX_CELL_DEFAULT_SUGGESTION,
  mapPerformanceLevel,
  toNineBoxCell
} from '@/types/performanceTalentReview'

/** 构造盘点条目 */
const buildEntry = (
  empId: number,
  name: string,
  dept: string,
  position: string,
  jobFamily: string,
  grade: 'S' | 'A' | 'B' | 'C' | 'D',
  potential: PotentialLevel
): TalentReviewEntry => {
  const perfLevel = mapPerformanceLevel(grade)
  const cell = toNineBoxCell(perfLevel, potential)
  return {
    employeeId: empId,
    employeeName: name,
    department: dept,
    position: position,
    jobFamily: jobFamily,
    performanceGrade: grade,
    performanceLevel: perfLevel,
    potentialLevel: potential,
    currentCell: cell,
    initialCell: cell,
    category: NINE_BOX_CELL_CATEGORY[cell],
    reviewComment: '',
    applySuggestion: NINE_BOX_CELL_DEFAULT_SUGGESTION[cell],
    adjustHistory: []
  }
}

/** 预置盘点会议 */
const initialData: TalentReviewMeeting[] = [
  {
    id: 1,
    meetingNo: 'TR-2026Q1-001',
    meetingName: '2026 Q1 技术研发中心人才盘点',
    cycleId: 1,
    cycleName: '2026 Q1 季度绩效',
    departments: ['技术研发中心'],
    hostName: '王总监',
    hostId: 101,
    scheduledTime: '2026-04-15 14:00',
    participantCount: 12,
    status: 'in_progress',
    entries: [
      buildEntry(1001, '张伟', '技术研发中心', '后端工程师', '技术研发', 'S', 'high'),
      buildEntry(1002, '李娜', '技术研发中心', '前端工程师', '技术研发', 'A', 'high'),
      buildEntry(1003, '王强', '技术研发中心', '架构师', '技术研发', 'A', 'medium'),
      buildEntry(1004, '赵静', '技术研发中心', '后端工程师', '技术研发', 'B', 'high'),
      buildEntry(1005, '孙磊', '技术研发中心', '前端工程师', '技术研发', 'B', 'medium'),
      buildEntry(1006, '周梅', '技术研发中心', '测试工程师', '技术研发', 'B', 'low'),
      buildEntry(1007, '吴昊', '技术研发中心', '后端工程师', '技术研发', 'A', 'low'),
      buildEntry(1008, '郑琪', '技术研发中心', '前端工程师', '技术研发', 'C', 'medium'),
      buildEntry(1009, '钱峰', '技术研发中心', '测试工程师', '技术研发', 'C', 'low'),
      buildEntry(1010, '刘洋', '技术研发中心', '后端工程师', '技术研发', 'D', 'low'),
      buildEntry(1011, '陈欣', '技术研发中心', '前端工程师', '技术研发', 'S', 'medium'),
      buildEntry(1012, '杨帆', '技术研发中心', '算法工程师', '技术研发', 'A', 'high')
    ],
    remark: '本次盘点聚焦 P6~P7 梯队发现与培养',
    createTime: '2026-04-08 09:00:00',
    updateTime: '2026-04-12 10:30:00'
  },
  {
    id: 2,
    meetingNo: 'TR-2026Q1-002',
    meetingName: '2026 Q1 产品设计中心人才盘点',
    cycleId: 1,
    cycleName: '2026 Q1 季度绩效',
    departments: ['产品设计中心'],
    hostName: '陈总监',
    hostId: 102,
    scheduledTime: '2026-04-18 10:00',
    participantCount: 8,
    status: 'preparing',
    entries: [
      buildEntry(2001, '徐红', '产品设计中心', '产品经理', '产品设计', 'A', 'high'),
      buildEntry(2002, '冯磊', '产品设计中心', '产品经理', '产品设计', 'B', 'high'),
      buildEntry(2003, '薛丹', '产品设计中心', 'UX 设计师', '产品设计', 'A', 'medium'),
      buildEntry(2004, '沈杰', '产品设计中心', '产品经理', '产品设计', 'B', 'medium'),
      buildEntry(2005, '韩雪', '产品设计中心', 'UI 设计师', '产品设计', 'B', 'low'),
      buildEntry(2006, '朱涛', '产品设计中心', '产品经理', '产品设计', 'S', 'medium'),
      buildEntry(2007, '秦芳', '产品设计中心', 'UX 设计师', '产品设计', 'C', 'medium'),
      buildEntry(2008, '许刚', '产品设计中心', '产品助理', '产品设计', 'C', 'low')
    ],
    remark: '',
    createTime: '2026-04-10 09:00:00',
    updateTime: '2026-04-10 09:00:00'
  },
  {
    id: 3,
    meetingNo: 'TR-2025Q4-001',
    meetingName: '2025 Q4 全员人才盘点（历史）',
    cycleId: 2,
    cycleName: '2025 Q4 季度绩效',
    departments: ['技术研发中心', '产品设计中心', '运营市场中心'],
    hostName: '李 HRD',
    hostId: 100,
    scheduledTime: '2026-01-20 09:00',
    participantCount: 6,
    status: 'completed',
    entries: [
      buildEntry(1001, '张伟', '技术研发中心', '后端工程师', '技术研发', 'A', 'high'),
      buildEntry(1002, '李娜', '技术研发中心', '前端工程师', '技术研发', 'A', 'medium'),
      buildEntry(2001, '徐红', '产品设计中心', '产品经理', '产品设计', 'S', 'high'),
      buildEntry(3001, '马超', '运营市场中心', '市场运营', '运营市场', 'A', 'high'),
      buildEntry(3002, '魏静', '运营市场中心', '内容运营', '运营市场', 'B', 'medium'),
      buildEntry(3003, '任彬', '运营市场中心', '商务经理', '销售岗位', 'B', 'low')
    ],
    remark: '已完成，结果已应用到年终激励',
    createTime: '2026-01-15 09:00:00',
    updateTime: '2026-01-22 17:00:00'
  }
]

export const talentReviewMock = createCrudMock<TalentReviewMeeting>(initialData, {
  idField: 'id',
  searchFields: ['meetingName', 'meetingNo'],
  sortField: 'scheduledTime'
})

/**
 * 更新盘点条目（拖拽调档时调用）
 */
export function updateTalentEntry(
  meetingId: number,
  employeeId: number,
  updates: Partial<TalentReviewEntry> & { adjustBy?: string; reason?: string }
): TalentReviewEntry {
  const meeting = talentReviewMock.getDetail(meetingId)
  if (!meeting) throw new Error('会议不存在')
  const entry = meeting.entries.find((e) => e.employeeId === employeeId)
  if (!entry) throw new Error('员工不存在')

  // 记录调整历史
  if (updates.currentCell && updates.currentCell !== entry.currentCell) {
    entry.adjustHistory = entry.adjustHistory || []
    entry.adjustHistory.push({
      from: entry.currentCell,
      to: updates.currentCell,
      adjustBy: updates.adjustBy || '盘点主持人',
      adjustTime: new Date().toLocaleString('zh-CN'),
      reason: updates.reason
    })
    // 同步更新 category 和默认建议
    entry.category = NINE_BOX_CELL_CATEGORY[updates.currentCell]
    entry.applySuggestion = NINE_BOX_CELL_DEFAULT_SUGGESTION[updates.currentCell]
  }

  Object.assign(entry, updates)
  talentReviewMock.update(meeting)
  return entry
}

/**
 * 统计盘点分布（用于汇总图）
 */
export function calcDistribution(meetingId: number): Record<string, number> {
  const meeting = talentReviewMock.getDetail(meetingId)
  if (!meeting) return {}
  const dist: Record<string, number> = {}
  meeting.entries.forEach((e) => {
    dist[e.currentCell] = (dist[e.currentCell] || 0) + 1
  })
  return dist
}
