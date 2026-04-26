// @ts-nocheck
/**
 * 绩效档案 Mock 数据（Phase A9 升级版 + Wave 2 B+C 合并）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { PerformanceArchive, EmployeeArchiveView } from '@/types/performanceArchive'
import { EMPLOYEES } from '@/mock/core/employeePool'

const dims = (s1: number, s2: number, s3: number, s4: number) => [
  { dimension: '业绩成果', score: s1 },
  { dimension: '专业能力', score: s2 },
  { dimension: '团队协作', score: s3 },
  { dimension: '创新突破', score: s4 }
]

const initialData: PerformanceArchive[] = [
  // 张三 历年档案（4 条，用于趋势展示）
  {
    id: 1, archiveNo: 'ARCH20250330-201',
    employeeId: 201, employeeCode: 'E201', employeeName: '张三',
    departmentName: '技术部', positionName: '高级前端开发', jobFamily: '技术研发', level: 'P6',
    cycleId: 2, cycleName: '2025 年上半年绩效考核', cycleEndDate: '2025-06-30',
    finalScore: 82, rating: 'A', grade: 'A',
    dimensionScores: dims(82, 85, 80, 78),
    ranking: 3, totalInDepartment: 20,
    goalCompletionRate: 88,
    salaryAdjustment: 8, promotion: '—',
    events: [{ time: '2025-06-30', type: 'award', description: '获季度明星工程师奖' }],
    strengths: '技术方案清晰，善于沟通',
    weaknesses: '跨部门协作可以更主动',
    developmentPlan: '参加《架构设计》培训',
    hasPIP: false,
    createTime: '2025-06-30 18:00:00', archiveTime: '2025-07-02 10:00:00'
  },
  {
    id: 2, archiveNo: 'ARCH20251231-201',
    employeeId: 201, employeeCode: 'E201', employeeName: '张三',
    departmentName: '技术部', positionName: '高级前端开发', jobFamily: '技术研发', level: 'P6',
    cycleId: 1, cycleName: '2024 年度绩效考核', cycleEndDate: '2024-12-31',
    finalScore: 85, rating: 'A', grade: 'A',
    dimensionScores: dims(85, 86, 82, 85),
    ranking: 2, totalInDepartment: 18,
    goalCompletionRate: 92,
    salaryAdjustment: 10, promotion: 'P5→P6 晋升',
    events: [{ time: '2025-01-15', type: 'promotion', description: '晋升为 P6' }],
    strengths: '技术深度扎实',
    weaknesses: '影响力可以更大',
    hasPIP: false,
    createTime: '2024-12-31 18:00:00', archiveTime: '2025-01-10 10:00:00'
  },
  {
    id: 3, archiveNo: 'ARCH20260405-201',
    employeeId: 201, employeeCode: 'E201', employeeName: '张三',
    departmentName: '技术部', positionName: '高级前端开发', jobFamily: '技术研发', level: 'P6',
    cycleId: 3, cycleName: '2026 Q1 OKR 季度考核', cycleEndDate: '2026-03-31',
    finalScore: 86, rating: 'A', grade: 'A',
    dimensionScores: dims(85, 82, 88, 75),
    ranking: 2, totalInDepartment: 22,
    goalCompletionRate: 90,
    salaryAdjustment: 0, promotion: '—',
    events: [{ time: '2026-04-05', type: 'cycle_end', description: 'Q1 OKR 周期归档' }],
    strengths: '技术深度扎实，问题定位敏锐',
    weaknesses: '可更多参与跨团队协作',
    developmentPlan: 'Q2 至少 2 场技术分享',
    hasPIP: false,
    createTime: '2026-04-05 18:00:00', archiveTime: '2026-04-05 18:00:00'
  },
  // 赵销售 历年档案
  {
    id: 4, archiveNo: 'ARCH20260405-301',
    employeeId: 301, employeeCode: 'E301', employeeName: '赵销售',
    departmentName: '销售部', positionName: '销售经理', jobFamily: '运营市场', level: 'M3',
    cycleId: 8, cycleName: '2026 Q1 销售团队 KPI 考核', cycleEndDate: '2026-03-31',
    finalScore: 87, rating: 'S', grade: 'S',
    dimensionScores: [
      { dimension: '业绩达成', score: 92 },
      { dimension: '客户服务', score: 82 },
      { dimension: '团队协作', score: 78 }
    ],
    ranking: 1, totalInDepartment: 20,
    goalCompletionRate: 107,
    salaryAdjustment: 15, promotion: '季度 MVP',
    events: [{ time: '2026-04-01', type: 'award', description: '校准会调至 S 级（超额完成）' }],
    strengths: '销售业绩出色',
    weaknesses: '客户拜访记录填写不完整',
    hasPIP: false,
    createTime: '2026-04-05 18:00:00', archiveTime: '2026-04-05 18:00:00'
  },
  // 李前端档案
  {
    id: 5, archiveNo: 'ARCH20260405-202',
    employeeId: 202, employeeCode: 'E202', employeeName: '李前端',
    departmentName: '技术部', positionName: '中级前端开发', jobFamily: '技术研发', level: 'P5',
    cycleId: 3, cycleName: '2026 Q1 OKR 季度考核', cycleEndDate: '2026-03-31',
    finalScore: 78, rating: 'B', grade: 'B',
    dimensionScores: dims(75, 78, 82, 72),
    ranking: 10, totalInDepartment: 22,
    goalCompletionRate: 80,
    salaryAdjustment: 5, promotion: '—',
    strengths: '学习能力强',
    weaknesses: '深度有待提升',
    hasPIP: false,
    createTime: '2026-04-05 18:00:00', archiveTime: '2026-04-05 18:00:00'
  },
  // 吴测试（近期有 C，需关注）
  {
    id: 6, archiveNo: 'ARCH20260405-250',
    employeeId: 250, employeeCode: 'E250', employeeName: '吴测试',
    departmentName: '技术部', positionName: '测试工程师', jobFamily: '技术研发', level: 'P5',
    cycleId: 3, cycleName: '2026 Q1 OKR 季度考核', cycleEndDate: '2026-03-31',
    finalScore: 71, rating: 'B', grade: 'B',
    dimensionScores: dims(70, 72, 75, 65),
    ranking: 18, totalInDepartment: 22,
    goalCompletionRate: 72,
    salaryAdjustment: 0, promotion: '—',
    events: [{ time: '2026-03-28', type: 'calibration', description: '校准会由 C 调至 B（近期压测表现良好）' }],
    strengths: '稳定承担自动化测试',
    weaknesses: '主动学习意愿待提升；创新突破维度低',
    hasPIP: false,
    createTime: '2026-04-05 18:00:00', archiveTime: '2026-04-05 18:00:00'
  },
  {
    id: 7, archiveNo: 'ARCH20250630-250',
    employeeId: 250, employeeCode: 'E250', employeeName: '吴测试',
    departmentName: '技术部', positionName: '测试工程师', jobFamily: '技术研发', level: 'P5',
    cycleId: 2, cycleName: '2025 年上半年绩效考核', cycleEndDate: '2025-06-30',
    finalScore: 68, rating: 'C', grade: 'C',
    dimensionScores: dims(65, 70, 70, 60),
    ranking: 19, totalInDepartment: 20,
    goalCompletionRate: 70,
    salaryAdjustment: 0, promotion: '—',
    events: [{ time: '2025-07-01', type: 'pip', description: '启动 3 个月 PIP 改进计划' }],
    strengths: '细致认真',
    weaknesses: '主动性不足',
    hasPIP: true,
    createTime: '2025-06-30 18:00:00', archiveTime: '2025-07-02 10:00:00'
  }
]

/** Wave 2 B+C 合并：基于员工池生成全员历年档案（2024 年度 / 2025 年度 / 2026 Q1） */
function generatePoolArchives(startId: number): PerformanceArchive[] {
  const cycles = [
    { id: 101, name: '2024 年度绩效考核', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 102, name: '2025 年度绩效考核', startDate: '2025-01-01', endDate: '2025-12-31' },
    { id: 103, name: '2026 Q1 绩效考核', startDate: '2026-01-01', endDate: '2026-03-31' }
  ]
  const archives: PerformanceArchive[] = []
  let id = startId

  // 参与考核的最低在职时长（约 2.5 个月，兼顾季度周期 89 天的自然长度）
  const MIN_OVERLAP_DAYS = 75

  for (const cycle of cycles) {
    for (const emp of EMPLOYEES) {
      if (!emp.entryDate) continue
      // 员工离职日（terminated 员工取 contractEndDate；其他视为远期未离职）
      const empEnd = emp.status === 'terminated' && emp.contractEndDate ? emp.contractEndDate : '9999-12-31'
      // 计算员工在职段与周期的重叠区间
      const overlapStart = emp.entryDate > cycle.startDate ? emp.entryDate : cycle.startDate
      const overlapEnd = empEnd < cycle.endDate ? empEnd : cycle.endDate
      if (overlapStart > overlapEnd) continue
      const overlapDays = (new Date(overlapEnd).getTime() - new Date(overlapStart).getTime()) / (1000 * 60 * 60 * 24)
      if (overlapDays < MIN_OVERLAP_DAYS) continue

      // 确定性生成 rating 和 score
      const hash = (emp.id * 9301 + cycle.id * 131 + 49297) % 100
      let rating: 'S' | 'A' | 'B' | 'C' | 'D'
      let baseScore: number
      if (hash < 5) { rating = 'S'; baseScore = 93 }
      else if (hash < 25) { rating = 'A'; baseScore = 85 }
      else if (hash < 75) { rating = 'B'; baseScore = 75 }
      else if (hash < 95) { rating = 'C'; baseScore = 65 }
      else { rating = 'D'; baseScore = 55 }

      const drift = (emp.id * 7 + cycle.id * 3) % 7 - 3 // -3..+3
      const finalScore = baseScore + drift
      const dim1 = finalScore + ((emp.id * 3) % 5) - 2
      const dim2 = finalScore + ((emp.id * 5) % 5) - 2
      const dim3 = finalScore + ((emp.id * 7) % 5) - 2
      const dim4 = finalScore + ((emp.id * 11) % 5) - 2
      const archiveTime = cycle.endDate.slice(0, 7) + '-05 10:00:00'

      archives.push({
        id: id++,
        archiveNo: `ARCH${cycle.endDate.replace(/-/g, '')}-${emp.id}`,
        employeeId: emp.id,
        employeeCode: emp.employeeNo,
        employeeName: emp.nameZh,
        departmentName: emp.orgName,
        positionName: emp.positionName,
        jobFamily: emp.jobFamily,
        level: emp.level,
        cycleId: cycle.id,
        cycleName: cycle.name,
        cycleEndDate: cycle.endDate,
        finalScore,
        rating,
        grade: rating,
        dimensionScores: dims(dim1, dim2, dim3, dim4),
        ranking: ((emp.id * 17) % 30) + 1,
        totalInDepartment: 30,
        goalCompletionRate: Math.min(100, Math.max(50, finalScore + 5)),
        salaryAdjustment: rating === 'S' ? 15 : rating === 'A' ? 10 : rating === 'B' ? 5 : 0,
        promotion: rating === 'S' && hash % 10 === 0 ? '职级晋升' : '—',
        events: [],
        strengths: rating === 'S' || rating === 'A' ? '目标超预期达成，影响力强' : rating === 'B' ? '稳定可靠，完成本职' : '尚需提升',
        weaknesses: rating === 'C' || rating === 'D' ? '关键指标未达标' : '可在跨部门协作上进一步提升',
        hasPIP: rating === 'D',
        createTime: cycle.endDate + ' 18:00:00',
        archiveTime
      } as PerformanceArchive)
    }
  }
  return archives
}

const alignedInitial = alignEmployeeFields(initialData)
const poolArchives = generatePoolArchives(10000)

export const performanceArchiveMock = createCrudMock<PerformanceArchive>(
  [...alignedInitial, ...poolArchives],
  {
    searchFields: ['employeeName', 'departmentName', 'cycleName'],
    sortField: 'archiveTime'
  }
)

/**
 * 获取员工汇总视图（聚合历年档案）
 */
export function getEmployeeArchiveViewMock(employeeId: number): EmployeeArchiveView | null {
  const all = performanceArchiveMock.getData().filter((a) => a.employeeId === employeeId)
  if (all.length === 0) return null

  // 按时间升序
  const archives = [...all].sort((a, b) => (a.cycleEndDate || '').localeCompare(b.cycleEndDate || ''))
  const first = archives[0]

  const gradeCounts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 }
  let sumScore = 0
  for (const a of archives) {
    const g = a.grade || (a.rating as any)
    if (gradeCounts[g] !== undefined) gradeCounts[g]++
    sumScore += a.finalScore || 0
  }
  const avgScore = Math.round(sumScore / archives.length)
  const recentTrend = archives.slice(-4).map((a) => a.finalScore || 0)

  // 高潜判定：连续 2+ 周期 S/A 且无 PIP
  const recent2 = archives.slice(-2)
  const isHiPo = recent2.length >= 2 &&
    recent2.every((a) => a.grade === 'S' || a.grade === 'A' || a.rating === 'S' || a.rating === 'A') &&
    archives.every((a) => !a.hasPIP)

  // 需关注判定：近 2 周期有 C/D
  const needsAttention = recent2.some((a) => a.grade === 'C' || a.grade === 'D' || a.rating === 'C' || a.rating === 'D')

  return {
    employeeId,
    employeeName: first.employeeName,
    departmentName: first.departmentName,
    positionName: first.positionName,
    archives,
    stats: {
      totalCycles: archives.length,
      gradeCounts,
      avgScore,
      recentTrend,
      isHiPo,
      needsAttention
    }
  }
}

/**
 * 识别高潜员工列表
 */
export function getHiPoListMock() {
  const all = performanceArchiveMock.getData()
  const empIds = Array.from(new Set(all.map((a) => a.employeeId)))
  return empIds
    .map((id) => getEmployeeArchiveViewMock(id))
    .filter((v) => v && v.stats.isHiPo)
    .map((v) => ({
      employeeId: v!.employeeId,
      employeeName: v!.employeeName,
      departmentName: v!.departmentName,
      positionName: v!.positionName,
      avgScore: v!.stats.avgScore,
      recentTrend: v!.stats.recentTrend,
      totalCycles: v!.stats.totalCycles
    }))
}

/**
 * 识别需关注员工
 */
export function getAttentionListMock() {
  const all = performanceArchiveMock.getData()
  const empIds = Array.from(new Set(all.map((a) => a.employeeId)))
  return empIds
    .map((id) => getEmployeeArchiveViewMock(id))
    .filter((v) => v && v.stats.needsAttention)
    .map((v) => ({
      employeeId: v!.employeeId,
      employeeName: v!.employeeName,
      departmentName: v!.departmentName,
      positionName: v!.positionName,
      avgScore: v!.stats.avgScore,
      recentTrend: v!.stats.recentTrend,
      gradeCounts: v!.stats.gradeCounts
    }))
}
