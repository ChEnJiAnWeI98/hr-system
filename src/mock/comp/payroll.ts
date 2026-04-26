/**
 * 薪资核算 Mock 数据（Phase 4.2）
 *
 * 策略（V2.0 plan 风险项 #3 应对）：
 *   - 只预置 3 个历史批次元数据（2026-02/03/04）
 *   - 核算记录按需生成（访问某批次时才生成该批次 200 条）
 *   - 结果基于固定种子保证确定性
 *
 * 绩效等级来源（plan 风险项 #1 应对）：
 *   - 不从 performanceArchive 查（旧 employeeId 与员工池不匹配）
 *   - 基于员工 ID 种子按分布生成：S 5% / A 20% / B 50% / C 20% / D 5%
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  PayrollBatch,
  PayrollRecord,
  PayrollBatchStatus,
  PayrollItem
} from '@/types/comp/payroll'
import { PERFORMANCE_COEFFICIENT, SOCIAL_SELF_RATE, FUND_SELF_RATE } from '@/types/comp/payroll'
import { calcMonthlyTax } from '@/types/comp/tax'
import { EMPLOYEES } from '@/mock/core/employeePool'
import type { Employee } from '@/types/employee/profile'

/**
 * 根据员工 ID 种子生成确定性绩效等级
 */
function getPerformanceGrade(employeeId: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  const hash = (employeeId * 9301 + 49297) % 100
  if (hash < 5) return 'S'
  if (hash < 25) return 'A'
  if (hash < 75) return 'B'
  if (hash < 95) return 'C'
  return 'D'
}

/** 根据员工 ID + 周期生成加班费（确定性） */
function getOvertimePay(employeeId: number, period: string): number {
  const periodNum = parseInt(period.replace('-', ''))
  const hash = (employeeId * 13 + periodNum * 7) % 10
  if (hash < 6) return 0 // 60% 员工没加班
  if (hash < 9) return [0, 200, 500, 800, 1200][hash - 6] || 500
  return 2000
}

/** 按月份 YYYY-MM 计算某员工的核算记录 */
export function calcPayrollForEmployee(emp: Employee, batchId: number, period: string): PayrollRecord {
  const grade = getPerformanceGrade(emp.id)
  const coefficient = PERFORMANCE_COEFFICIENT[grade]

  // 薪资项
  const base = emp.baseSalary || 0
  const position = emp.positionSalary || 0
  const perfBase = emp.performanceBase || 0
  const performancePay = Math.round(perfBase * coefficient)
  const overtime = getOvertimePay(emp.id, period)
  const mealAllowance = 600
  const transportAllowance = emp.level.startsWith('M') ? 800 : 400

  // 应发
  const gross =
    base + position + performancePay + overtime + mealAllowance + transportAllowance

  // 社保公积金（基于社保基数）
  const socialBase = emp.socialBase || base
  const socialSelf = Math.round(socialBase * SOCIAL_SELF_RATE)
  const fundSelf = Math.round(socialBase * FUND_SELF_RATE)

  // 个税（基于应发 - 社保 - 公积金 - 5000 起征点）
  const tax = calcMonthlyTax(gross, socialSelf, fundSelf)

  const deduction = tax + socialSelf + fundSelf
  const net = Math.max(0, gross - deduction)

  const items: PayrollItem[] = [
    { code: 'base_salary', name: '基本工资', direction: 'addition', amount: base },
    { code: 'position_salary', name: '岗位工资', direction: 'addition', amount: position },
    {
      code: 'performance_salary',
      name: `绩效工资（${grade} × ${coefficient}）`,
      direction: 'addition',
      amount: performancePay
    },
    { code: 'overtime_pay', name: '加班费', direction: 'addition', amount: overtime },
    { code: 'meal_allowance', name: '餐补', direction: 'addition', amount: mealAllowance },
    {
      code: 'transport_allowance',
      name: '交通补贴',
      direction: 'addition',
      amount: transportAllowance
    },
    { code: 'income_tax', name: '个人所得税', direction: 'deduction', amount: tax },
    { code: 'social_self', name: '社保个人部分', direction: 'deduction', amount: socialSelf },
    { code: 'fund_self', name: '公积金个人部分', direction: 'deduction', amount: fundSelf }
  ]

  return {
    id: emp.id * 100 + parseInt(period.split('-')[1]),
    batchId,
    batchNo: '',
    employeeId: emp.id,
    employeeName: emp.nameZh,
    employeeNo: emp.employeeNo,
    orgName: emp.orgName,
    positionName: emp.positionName,
    level: emp.level,
    period,
    performanceGrade: grade,
    performanceCoefficient: coefficient,
    items,
    grossAmount: gross,
    deductionAmount: deduction,
    netAmount: net,
    status: 'released',
    createTime: `${period}-28 17:00:00`,
    updateTime: `${period}-28 17:00:00`
  }
}

/**
 * 判断员工在指定月份是否在职（Wave 2 B+C 合并路线）
 *
 * 规则：
 * - 月份 < 入职月 → 未入职
 * - terminated 员工且月份 > 离职月 → 已离职（历史月份仍生成工资条）
 * - 其他状态 → 在职（含 regular/probation/transferring/seconded/offboarding）
 *
 * 注：terminated 员工的 contractEndDate 即离职日（见 employeePool 合同生成逻辑）
 */
function isActiveInMonth(emp: Employee, yearMonth: string): boolean {
  const entryMonth = (emp.entryDate || '').slice(0, 7)
  if (!entryMonth || yearMonth < entryMonth) return false
  if (emp.status === 'terminated' && emp.contractEndDate) {
    const terminationMonth = emp.contractEndDate.slice(0, 7)
    if (yearMonth > terminationMonth) return false
  }
  return true
}

/** 按批次 ID 动态生成核算记录（按需，按"当月在职"过滤）*/
export function generateBatchRecords(batchId: number, period: string): PayrollRecord[] {
  const batchNo = `PR${period.replace('-', '')}001`
  return EMPLOYEES.filter((e) => isActiveInMonth(e, period)).map((e) => {
    const r = calcPayrollForEmployee(e, batchId, period)
    r.batchNo = batchNo
    return r
  })
}

/** 批次统计（从动态生成的记录汇总） */
function summarizeBatch(batchId: number, period: string) {
  const records = generateBatchRecords(batchId, period)
  return {
    totalEmployees: records.length,
    totalGross: records.reduce((s, r) => s + r.grossAmount, 0),
    totalDeduction: records.reduce((s, r) => s + r.deductionAmount, 0),
    totalNet: records.reduce((s, r) => s + r.netAmount, 0)
  }
}

/** 生成近 12 个月批次清单（2025-05 ~ 2026-04） */
function buildPeriodList(): string[] {
  const list: string[] = []
  // 从 2026-04 倒推 12 个月
  let y = 2026
  let m = 4
  for (let i = 0; i < 12; i++) {
    list.unshift(`${y}-${String(m).padStart(2, '0')}`)
    m -= 1
    if (m === 0) {
      m = 12
      y -= 1
    }
  }
  return list
}

/** 预置 12 个历史批次（全员 × 近 12 个月，按当月在职过滤）*/
function buildInitialBatches(): PayrollBatch[] {
  const periods = buildPeriodList()
  // 最新一期（2026-04）状态 approved，其他全部 released
  const statuses: PayrollBatchStatus[] = periods.map((_, i) =>
    i === periods.length - 1 ? 'approved' : 'released'
  )
  return periods.map((period, idx) => {
    const summary = summarizeBatch(idx + 1, period)
    return {
      id: idx + 1,
      batchNo: `PR${period.replace('-', '')}001`,
      period,
      orgIds: [],
      orgNames: '全公司',
      status: statuses[idx],
      totalEmployees: summary.totalEmployees,
      totalGross: summary.totalGross,
      totalDeduction: summary.totalDeduction,
      totalNet: summary.totalNet,
      creatorName: 'HR-Lisa',
      creatorId: 9001,
      hrbpApprover: statuses[idx] !== 'draft' ? 'HRBP 王' : undefined,
      hrbpApproverId: 9002,
      hrbpApprovalTime: statuses[idx] !== 'draft' ? `${period}-25 10:00:00` : undefined,
      hrdApprover: statuses[idx] === 'released' || statuses[idx] === 'approved' ? 'HRD 陈' : undefined,
      hrdApproverId: 9003,
      hrdApprovalTime:
        statuses[idx] === 'released' || statuses[idx] === 'approved'
          ? `${period}-26 14:00:00`
          : undefined,
      releaseTime: statuses[idx] === 'released' ? `${period}-28 17:00:00` : undefined,
      createTime: `${period}-20 09:00:00`,
      updateTime: `${period}-28 17:00:00`
    }
  })
}

export const payrollBatchMock = createCrudMock<PayrollBatch>(buildInitialBatches(), {
  idField: 'id',
  searchFields: ['batchNo', 'period']
})

/** 按批次 ID 获取所有核算记录（每次都动态生成） */
export function getBatchRecordsMock(batchId: number): PayrollRecord[] {
  const batch = payrollBatchMock.getDetail(batchId)
  if (!batch) return []
  return generateBatchRecords(batch.id, batch.period).map((r) => ({ ...r, batchNo: batch.batchNo }))
}

/** 按员工 ID 查询工资条历史（跨批次） */
export function getPayslipsByEmployee(employeeId: number): PayrollRecord[] {
  const batches = payrollBatchMock.getData()
  const result: PayrollRecord[] = []
  for (const b of batches) {
    if (b.status !== 'released' && b.status !== 'approved') continue
    const recs = generateBatchRecords(b.id, b.period).filter((r) => r.employeeId === employeeId)
    result.push(...recs.map((r) => ({ ...r, batchNo: b.batchNo })))
  }
  return result.sort((a, b) => b.period.localeCompare(a.period))
}

/** 执行核算（改变批次状态） */
export function executeBatchMock(batchId: number): PayrollBatch {
  const batch = payrollBatchMock.getDetail(batchId)
  if (!batch) throw new Error('批次不存在')
  if (batch.status !== 'draft') throw new Error('只有草稿状态才能执行核算')
  const summary = summarizeBatch(batch.id, batch.period)
  batch.status = 'calculated'
  batch.totalEmployees = summary.totalEmployees
  batch.totalGross = summary.totalGross
  batch.totalDeduction = summary.totalDeduction
  batch.totalNet = summary.totalNet
  payrollBatchMock.update(batch)
  return batch
}

/** 审批批次 */
export function approveBatchMock(
  batchId: number,
  stage: 'hrbp' | 'hrd',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number
): PayrollBatch {
  const batch = payrollBatchMock.getDetail(batchId)
  if (!batch) throw new Error('批次不存在')
  const now = new Date().toLocaleString('zh-CN')
  if (stage === 'hrbp') {
    batch.hrbpApprover = approverName
    batch.hrbpApproverId = approverId
    batch.hrbpApprovalTime = now
    batch.status = action === 'approved' ? 'reviewing' : 'draft'
  } else {
    batch.hrdApprover = approverName
    batch.hrdApproverId = approverId
    batch.hrdApprovalTime = now
    batch.status = action === 'approved' ? 'approved' : 'draft'
  }
  payrollBatchMock.update(batch)
  return batch
}

/** 发放 */
export function releaseBatchMock(batchId: number): PayrollBatch {
  const batch = payrollBatchMock.getDetail(batchId)
  if (!batch) throw new Error('批次不存在')
  if (batch.status !== 'approved') throw new Error('只有审批通过的批次才能发放')
  batch.status = 'released'
  batch.releaseTime = new Date().toLocaleString('zh-CN')
  payrollBatchMock.update(batch)
  return batch
}
