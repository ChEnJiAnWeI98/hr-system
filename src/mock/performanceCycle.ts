// @ts-nocheck
/**
 * 绩效周期 Mock 数据（Phase A1 升级版）
 */

import { createCrudMock } from '@/utils/crud'
import type { PerformanceCycle } from '@/types/performance'

/**
 * 生成过程跟踪节点（季度周期取月末；年度/半年取双月末）
 * 通过遍历月份而非累加日期，避免 JS Date 跨月边界的死循环陷阱
 */
function buildTrackingNodes(cycleType: number, startDate: string, endDate: string): string {
  const nodes: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  // 循环上限：防御性保护，防止极端输入导致卡死
  const MAX_ITERATIONS = 24

  if (cycleType === 3) {
    // 季度：每月末
    let year = start.getFullYear()
    let month = start.getMonth() // 0-indexed
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const monthEnd = new Date(year, month + 1, 0) // 该月最后一天
      if (monthEnd > end) break
      if (monthEnd >= start) nodes.push(monthEnd.toISOString().slice(0, 10))
      month++
      if (month > 11) {
        month = 0
        year++
      }
    }
  } else if (cycleType === 1 || cycleType === 2) {
    // 年度/半年：每两月末
    let year = start.getFullYear()
    let month = start.getMonth() + 1 // 从下一月开始
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const monthEnd = new Date(year, month + 1, 0)
      if (monthEnd > end) break
      if (monthEnd >= start) nodes.push(monthEnd.toISOString().slice(0, 10))
      month += 2
      while (month > 11) {
        month -= 12
        year++
      }
    }
  }
  return JSON.stringify(nodes)
}

const defaultDistribution = JSON.stringify({ S: 10, A: 20, B: 40, C: 20, D: 10, tolerance: 2 })

// 初始数据（Phase A1 升级字段 + 覆盖 7 态状态机）
const mockPerformanceCycles: PerformanceCycle[] = [
  {
    id: 1,
    cycleNo: 'PERF2024Y001',
    cycleName: '2024 年度绩效考核',
    cycleType: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    goalDeadline: '2024-01-31',
    trackingNodes: buildTrackingNodes(1, '2024-01-01', '2024-12-31'),
    evalStartDate: '2024-12-01',
    evalEndDate: '2024-12-15',
    calibrationDate: '2024-12-20',
    archiveDate: '2024-12-31',
    status: 7,
    participantCount: 150,
    remark: '2024 年度绩效考核周期（已归档）',
    applyScope: JSON.stringify({ scope: 'all' }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术通用' }, { templateId: 3, templateName: '管理岗' }]),
    goalMode: 'mixed',
    distributionConfig: defaultDistribution,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-12-31 18:00:00'
  },
  {
    id: 2,
    cycleNo: 'PERF2025H001',
    cycleName: '2025 年上半年绩效考核',
    cycleType: 2,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    goalDeadline: '2025-01-20',
    trackingNodes: buildTrackingNodes(2, '2025-01-01', '2025-06-30'),
    evalStartDate: '2025-06-01',
    evalEndDate: '2025-06-15',
    calibrationDate: '2025-06-22',
    archiveDate: '2025-06-30',
    status: 7,
    participantCount: 160,
    remark: '2025 年上半年绩效考核（已归档）',
    applyScope: JSON.stringify({ scope: 'all' }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术通用' }]),
    goalMode: 'mixed',
    distributionConfig: defaultDistribution,
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-06-30 18:00:00'
  },
  {
    id: 3,
    cycleNo: 'PERF2026Q001',
    cycleName: '2026 Q1 OKR 季度考核',
    cycleType: 3,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    goalDeadline: '2026-01-15',
    trackingNodes: buildTrackingNodes(3, '2026-01-01', '2026-03-31'),
    evalStartDate: '2026-03-15',
    evalEndDate: '2026-03-25',
    calibrationDate: '2026-03-28',
    archiveDate: '2026-04-05',
    status: 7,
    participantCount: 175,
    remark: '2026 Q1 OKR 季度考核（已归档）',
    applyScope: JSON.stringify({ jobFamilies: ['技术研发', '产品设计'] }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术-P5-P7' }, { templateId: 2, templateName: '产品-P5-P7' }]),
    goalMode: 'okr',
    distributionConfig: defaultDistribution,
    createTime: '2025-12-20 10:00:00',
    updateTime: '2026-04-05 18:00:00'
  },
  {
    id: 4,
    cycleNo: 'PERF2026Q002',
    cycleName: '2026 Q2 OKR 季度考核',
    cycleType: 3,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    goalDeadline: '2026-04-15',
    trackingNodes: buildTrackingNodes(3, '2026-04-01', '2026-06-30'),
    evalStartDate: '2026-06-15',
    evalEndDate: '2026-06-25',
    calibrationDate: '2026-06-28',
    archiveDate: '2026-07-05',
    status: 3, // 过程跟踪中
    participantCount: 180,
    remark: '当前正在进行的 OKR 周期',
    applyScope: JSON.stringify({ jobFamilies: ['技术研发', '产品设计'] }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术-P5-P7' }, { templateId: 2, templateName: '产品-P5-P7' }]),
    goalMode: 'okr',
    distributionConfig: defaultDistribution,
    clonedFromId: 3,
    createTime: '2026-03-25 10:00:00',
    updateTime: '2026-04-18 09:00:00'
  },
  {
    id: 5,
    cycleNo: 'PERF2026Y001',
    cycleName: '2026 年度 KPI 考核',
    cycleType: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    goalDeadline: '2026-02-15',
    trackingNodes: buildTrackingNodes(1, '2026-01-01', '2026-12-31'),
    evalStartDate: '2026-12-01',
    evalEndDate: '2026-12-20',
    calibrationDate: '2026-12-28',
    archiveDate: '2027-01-10',
    status: 3, // 过程跟踪中（年度周期）
    participantCount: 200,
    remark: '年度 KPI 全员考核周期',
    applyScope: JSON.stringify({ scope: 'all' }),
    templateGroup: JSON.stringify([{ templateId: 4, templateName: '销售-全体' }, { templateId: 5, templateName: '职能-通用' }]),
    goalMode: 'kpi',
    distributionConfig: defaultDistribution,
    createTime: '2025-12-01 10:00:00',
    updateTime: '2026-04-10 09:00:00'
  },
  {
    id: 6,
    cycleNo: 'PERF2026Q003',
    cycleName: '2026 Q3 OKR 季度考核',
    cycleType: 3,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    goalDeadline: '2026-07-15',
    trackingNodes: buildTrackingNodes(3, '2026-07-01', '2026-09-30'),
    evalStartDate: '2026-09-15',
    evalEndDate: '2026-09-25',
    calibrationDate: '2026-09-28',
    archiveDate: '2026-10-05',
    status: 1, // 未开始
    participantCount: 185,
    remark: '2026 Q3 OKR 季度考核（未开始）',
    applyScope: JSON.stringify({ jobFamilies: ['技术研发', '产品设计'] }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术-P5-P7' }, { templateId: 2, templateName: '产品-P5-P7' }]),
    goalMode: 'okr',
    distributionConfig: defaultDistribution,
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-15 10:00:00'
  },
  {
    id: 7,
    cycleNo: 'PERF2026M004',
    cycleName: '2026-04 月度 PIP 考核',
    cycleType: 4,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    goalDeadline: '2026-04-05',
    trackingNodes: JSON.stringify(['2026-04-15', '2026-04-25']),
    evalStartDate: '2026-04-28',
    evalEndDate: '2026-04-30',
    calibrationDate: '2026-05-02',
    archiveDate: '2026-05-05',
    status: 4, // 评估中
    participantCount: 3,
    remark: 'PIP 专用月度考核，参与人数少',
    applyScope: JSON.stringify({ employeeIds: [1024, 1058, 1102] }),
    templateGroup: JSON.stringify([{ templateId: 6, templateName: 'PIP 专用模板' }]),
    goalMode: 'kpi',
    distributionConfig: JSON.stringify({ S: 0, A: 0, B: 50, C: 30, D: 20, tolerance: 10 }),
    createTime: '2026-03-28 10:00:00',
    updateTime: '2026-04-28 09:00:00'
  },
  {
    id: 8,
    cycleNo: 'PERF2026S001',
    cycleName: '2026 Q1 销售团队 KPI 考核',
    cycleType: 3,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    goalDeadline: '2026-01-15',
    trackingNodes: buildTrackingNodes(3, '2026-01-01', '2026-03-31'),
    evalStartDate: '2026-03-15',
    evalEndDate: '2026-03-25',
    calibrationDate: '2026-03-28',
    archiveDate: '2026-04-05',
    status: 5, // 校准中
    participantCount: 48,
    remark: '销售团队 KPI 考核，当前在校准阶段',
    applyScope: JSON.stringify({ departments: ['销售部', '市场部'] }),
    templateGroup: JSON.stringify([{ templateId: 4, templateName: '销售-全体' }]),
    goalMode: 'kpi',
    distributionConfig: defaultDistribution,
    createTime: '2025-12-20 10:00:00',
    updateTime: '2026-04-01 15:00:00'
  },
  {
    id: 9,
    cycleNo: 'PERF2025Y002',
    cycleName: '2025 年度 KPI 考核（公示中）',
    cycleType: 1,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    goalDeadline: '2025-02-15',
    trackingNodes: buildTrackingNodes(1, '2025-01-01', '2025-12-31'),
    evalStartDate: '2025-12-01',
    evalEndDate: '2025-12-20',
    calibrationDate: '2025-12-28',
    archiveDate: '2026-01-10',
    status: 6, // 公示中
    participantCount: 200,
    remark: '2025 年度考核，公示期 5 个工作日',
    applyScope: JSON.stringify({ scope: 'all' }),
    templateGroup: JSON.stringify([{ templateId: 5, templateName: '职能-通用' }]),
    goalMode: 'mixed',
    distributionConfig: defaultDistribution,
    createTime: '2024-12-01 10:00:00',
    updateTime: '2025-12-29 18:00:00'
  },
  {
    id: 10,
    cycleNo: 'PERF2026H001',
    cycleName: '2026 年上半年半年度考核',
    cycleType: 2,
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    goalDeadline: '2026-01-31',
    trackingNodes: buildTrackingNodes(2, '2026-01-01', '2026-06-30'),
    evalStartDate: '2026-06-10',
    evalEndDate: '2026-06-22',
    calibrationDate: '2026-06-26',
    archiveDate: '2026-07-05',
    status: 2, // 目标设定中
    participantCount: 195,
    remark: '半年度全员考核',
    applyScope: JSON.stringify({ scope: 'all' }),
    templateGroup: JSON.stringify([{ templateId: 1, templateName: '技术通用' }, { templateId: 5, templateName: '职能-通用' }]),
    goalMode: 'mixed',
    distributionConfig: defaultDistribution,
    createTime: '2025-12-15 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  }
]

export const performanceCycleMock = createCrudMock<PerformanceCycle>(mockPerformanceCycles, {
  searchFields: ['cycleName', 'remark', 'cycleNo'],
  sortField: 'createTime'
})

/* ========== 业务操作 Mock ========== */

/**
 * 推进周期状态（下一阶段）
 */
export function advanceCycleStatusMock(id: number) {
  const cycle = performanceCycleMock.getDetail(id)
  if (!cycle) throw new Error('周期不存在')
  const nextStatusMap: Record<number, number | null> = {
    1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: null
  }
  const next = nextStatusMap[cycle.status]
  if (next === null || next === undefined) throw new Error('周期已归档，不可再推进')
  cycle.status = next
  cycle.updateTime = new Date().toLocaleString('zh-CN')
  performanceCycleMock.update(cycle)
  return cycle
}

/**
 * 复用周期（基于现有周期快速创建新周期）
 */
export function cloneCycleMock(sourceId: number, overrides: Partial<PerformanceCycle>) {
  const source = performanceCycleMock.getDetail(sourceId)
  if (!source) throw new Error('源周期不存在')
  const all = performanceCycleMock.getData()
  const nextId = Math.max(...all.map((c) => c.id), 0) + 1
  const newCycle: PerformanceCycle = {
    ...source,
    id: nextId,
    cycleName: overrides.cycleName || source.cycleName + ' - 副本',
    cycleNo: overrides.cycleNo || `PERF${new Date().getFullYear()}X${String(nextId).padStart(3, '0')}`,
    startDate: overrides.startDate || source.startDate,
    endDate: overrides.endDate || source.endDate,
    status: 1, // 新周期必须从未开始态
    participantCount: 0,
    clonedFromId: sourceId,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  all.push(newCycle)
  return newCycle
}

/**
 * 归档解锁（仅 HRD 可操作）
 */
export function unarchiveCycleMock(id: number) {
  const cycle = performanceCycleMock.getDetail(id)
  if (!cycle) throw new Error('周期不存在')
  if (cycle.status !== 7) throw new Error('仅已归档周期可解锁')
  cycle.status = 6
  cycle.updateTime = new Date().toLocaleString('zh-CN')
  performanceCycleMock.update(cycle)
  return cycle
}
