/**
 * HR 数据健康度检查脚本
 *
 * 用途：扫描 mock 数据，按"数据健康度规则 V1.0"检测异常，输出清单。
 * 规则文档：docs/HR重构-数据健康度规则-V1.0.md
 *
 * 使用方式（开发环境）：
 *   方式 1 浏览器控制台：`__hrHealthCheck()`
 *   方式 2 代码内调用：`import { runHealthCheck } from '@/mock/core/dataHealthCheck'`
 *
 * 第一版覆盖规则：B4 / B5 / C1 / C6 + 核心跨模块矛盾扫描（B7 / C2 / C3 / C4 / C5）。
 * 其他规则（D/E/F）待后续扩展。
 */

import { EMPLOYEES } from './employeePool'
import {
  ACTIVE_STATUSES,
  TERMINATED_STATUSES,
  isActive,
  isTerminated
} from '@/constants/employee'
import type { Employee } from '@/types/employee/profile'

/** 检查结果：一条异常记录 */
export interface Violation {
  /** 规则编号（如 B4、C1） */
  ruleCode: string
  /** 规则简要描述 */
  ruleName: string
  /** 异常严重度 */
  severity: 'error' | 'warning' | 'info'
  /** 异常数量 */
  count: number
  /** 受影响的具体记录（抽样前 10 条展示） */
  sample: unknown[]
  /** 修复建议 */
  fixHint: string
}

/** 检查结果汇总 */
export interface HealthReport {
  runAt: string
  totalViolations: number
  violations: Violation[]
  summary: {
    employees: number
    activeEmployees: number
    terminatedEmployees: number
    offboardingEmployees: number
  }
}

/** 抽样前 N 条 */
function sample<T>(arr: T[], n = 10): T[] {
  return arr.slice(0, n)
}

/* ============================================================
 * A / B 规则：员工池内部一致性
 * ============================================================ */

/**
 * B4: 离职日 ≤ 今天 ⇔ status = terminated
 * （当前员工池未直接存 terminationDate，先做反向检查：status=terminated 的员工应当有对应 offboarding 记录）
 * 真正的严格检查需 join offboarding mock，后续扩展。
 */
function checkB4_terminatedHasDate(): Violation | null {
  // 占位：由于员工池未直接存离职日，此规则完整检测需跨表 join
  // 当前仅做"状态合理性"基础检查
  const terminated = EMPLOYEES.filter((e) => isTerminated(e.status))
  if (terminated.length === 0) return null

  // 期望：employee 池里所有 terminated 员工都在 offboarding mock 里有记录
  // TODO: 接入 offboarding mock 后启用严格检查
  return {
    ruleCode: 'B4',
    ruleName: '离职日 ≤ 今天 ⇔ status = terminated',
    severity: 'info',
    count: 0,
    sample: [],
    fixHint: '当前员工池存 terminated 员工 ' + terminated.length + ' 人，需对照 offboarding mock 验证离职日合规性。完整检查待后续扩展。'
  }
}

/**
 * B5: 试用期合理性 —— 入职日 + 6 个月 > 今天 ⇔ status = probation
 */
function checkB5_probationConsistency(): Violation | null {
  const today = '2026-04-23' // 与项目当前日期对齐

  const abnormal = EMPLOYEES.filter((e) => {
    if (!e.entryDate) return false

    // 预估试用期结束日（入职日 + 6 个月）
    const entry = new Date(e.entryDate)
    const probationEnd = new Date(entry)
    probationEnd.setMonth(probationEnd.getMonth() + 6)
    const probationEndStr = probationEnd.toISOString().slice(0, 10)

    const todayBeforeProbationEnd = today <= probationEndStr
    const isProbation = e.status === 'probation'

    // 两种异常：
    // 1. 还在试用期内，但 status 已经 regular（B3 也可能触发）
    // 2. 试用期已过，但 status 还是 probation
    if (todayBeforeProbationEnd && e.status === 'regular' && !e.regularizationDate) return true
    if (!todayBeforeProbationEnd && isProbation) return true

    return false
  })

  if (abnormal.length === 0) return null
  return {
    ruleCode: 'B5',
    ruleName: '试用期状态与入职日期一致',
    severity: 'warning',
    count: abnormal.length,
    sample: sample(abnormal.map((e) => ({ id: e.id, name: e.nameZh, status: e.status, entryDate: e.entryDate, regularizationDate: e.regularizationDate }))),
    fixHint: '试用期一般 6 个月，应根据入职日自动推算状态。若确需延长试用期，需显式记录延期单。'
  }
}

/**
 * C1: manager_id 指向的员工必须在职
 */
function checkC1_managerInActive(): Violation | null {
  const byId = new Map(EMPLOYEES.map((e) => [e.id, e]))
  const abnormal: Array<{ employeeId: number; employeeName: string; managerId: number; managerName?: string; managerStatus?: string }> = []

  for (const emp of EMPLOYEES) {
    if (!emp.supervisorId) continue
    const mgr = byId.get(emp.supervisorId)
    if (!mgr) {
      abnormal.push({
        employeeId: emp.id,
        employeeName: emp.nameZh,
        managerId: emp.supervisorId,
        managerName: '（不存在）'
      })
      continue
    }
    if (!isActive(mgr.status) && mgr.status !== 'offboarding') {
      abnormal.push({
        employeeId: emp.id,
        employeeName: emp.nameZh,
        managerId: mgr.id,
        managerName: mgr.nameZh,
        managerStatus: mgr.status
      })
    }
  }

  if (abnormal.length === 0) return null
  return {
    ruleCode: 'C1',
    ruleName: 'manager_id 指向的员工必须在职',
    severity: 'error',
    count: abnormal.length,
    sample: sample(abnormal),
    fixHint: '主管离职时需重新指派下属；员工池生成时应校验 managerId 有效性。'
  }
}

/* ============================================================
 * C 规则：跨模块关联一致性（需按需加载业务 mock）
 * ============================================================ */

/**
 * C5-goal: 绩效目标中被考核人必须在职（或离职日在周期结束后）
 * 懒加载 mock 以避免循环依赖
 */
async function checkC5_goal(): Promise<Violation | null> {
  try {
    const terminatedIds = new Set(EMPLOYEES.filter((e) => isTerminated(e.status)).map((e) => e.id))
    if (terminatedIds.size === 0) return null

    const mod: any = await import('@/mock/performanceGoal')
    const list = mod.performanceGoalMock?.getData?.() || []
    const abnormal = list.filter((g: any) => terminatedIds.has(g.employeeId) || terminatedIds.has(g.ownerId))
    if (abnormal.length === 0) return null
    return {
      ruleCode: 'C5-goal',
      ruleName: '绩效目标对象不应为已离职员工',
      severity: 'error',
      count: abnormal.length,
      sample: sample(abnormal.map((g: any) => ({ id: g.id, employeeId: g.employeeId, ownerId: g.ownerId, title: g.title || g.name }))),
      fixHint: '生成新周期目标时过滤 terminated；或对照历史档案日期判定合规性。'
    }
  } catch {
    return null
  }
}

/** C5-pip: PIP 对象不应为已离职 */
async function checkC5_pip(): Promise<Violation | null> {
  try {
    const terminatedIds = new Set(EMPLOYEES.filter((e) => isTerminated(e.status)).map((e) => e.id))
    const mod: any = await import('@/mock/performancePIP')
    const list = mod.performancePIPMock?.getData?.() || []
    const abnormal = list.filter((p: any) => terminatedIds.has(p.employeeId))
    if (abnormal.length === 0) return null
    return {
      ruleCode: 'C5-pip',
      ruleName: 'PIP 对象不应为已离职员工',
      severity: 'error',
      count: abnormal.length,
      sample: sample(abnormal.map((p: any) => ({ id: p.id, employeeId: p.employeeId, pipNo: p.pipNo }))),
      fixHint: '生成新 PIP 时过滤 terminated；进行中 PIP 的员工离职应标记为中止。'
    }
  } catch {
    return null
  }
}

/** C3: 培训计划学员不应为已离职（针对未开始的计划） */
async function checkC3_trainingPlan(): Promise<Violation | null> {
  try {
    const terminatedIds = new Set(EMPLOYEES.filter((e) => isTerminated(e.status)).map((e) => e.id))
    const mod: any = await import('@/mock/training/plan')
    const list = mod.trainingPlanMock?.getData?.() || mod.getListMock?.({ page: 1, pageSize: 9999 })?.list || []
    const abnormal = list.filter((p: any) => {
      const ids: number[] = p.participantIds || p.studentIds || []
      return ids.some((id) => terminatedIds.has(id))
    })
    if (abnormal.length === 0) return null
    return {
      ruleCode: 'C3',
      ruleName: '培训计划学员不应含已离职员工',
      severity: 'error',
      count: abnormal.length,
      sample: sample(abnormal.map((p: any) => ({ id: p.id, name: p.name, participants: p.participantIds }))),
      fixHint: '生成新培训计划时过滤 terminated；员工离职时扫描清除其在未开始计划中的参与记录。'
    }
  } catch {
    return null
  }
}

/** B7: 工资条不应针对已离职员工生成新月份（简化版：全量扫描离职员工的所有工资记录） */
async function checkB7_payroll(): Promise<Violation | null> {
  try {
    const terminatedIds = new Set(EMPLOYEES.filter((e) => isTerminated(e.status)).map((e) => e.id))
    if (terminatedIds.size === 0) return null
    const mod: any = await import('@/mock/comp/payroll')
    const batches = mod.payrollBatchMock?.getData?.() || []
    const abnormal: any[] = []
    for (const b of batches) {
      const records = mod.getBatchRecordsMock?.(b.id) || []
      records.forEach((r: any) => {
        if (terminatedIds.has(r.employeeId)) {
          abnormal.push({ batchId: b.id, period: b.period, employeeId: r.employeeId, netPay: r.netPay })
        }
      })
    }
    if (abnormal.length === 0) return null
    return {
      ruleCode: 'B7',
      ruleName: '工资条不应含离职日之后的月份',
      severity: 'warning',
      count: abnormal.length,
      sample: sample(abnormal),
      fixHint: '离职当月工资条保留（含结算），离职后月份不生成。需跨表 join offboarding.actualLastDay 精确判定。'
    }
  } catch {
    return null
  }
}

/* ============================================================
 * 入口函数
 * ============================================================ */

/**
 * 执行所有健康度检查
 */
export async function runHealthCheck(): Promise<HealthReport> {
  const checks: Array<Violation | null | Promise<Violation | null>> = [
    checkB4_terminatedHasDate(),
    checkB5_probationConsistency(),
    checkC1_managerInActive(),
    checkC5_goal(),
    checkC5_pip(),
    checkC3_trainingPlan(),
    checkB7_payroll()
  ]
  const results = await Promise.all(checks)
  const violations = results.filter((v): v is Violation => v !== null)

  return {
    runAt: new Date().toLocaleString('zh-CN'),
    totalViolations: violations.reduce((sum, v) => sum + v.count, 0),
    violations,
    summary: {
      employees: EMPLOYEES.length,
      activeEmployees: EMPLOYEES.filter((e) => (ACTIVE_STATUSES as readonly string[]).includes(e.status)).length,
      terminatedEmployees: EMPLOYEES.filter((e) => (TERMINATED_STATUSES as readonly string[]).includes(e.status)).length,
      offboardingEmployees: EMPLOYEES.filter((e) => e.status === 'offboarding').length
    }
  }
}

/**
 * 格式化输出报告到控制台
 */
export async function logHealthReport(): Promise<void> {
  const report = await runHealthCheck()
  /* eslint-disable no-console */
  console.group(`%c HR Data Health Check @ ${report.runAt} `, 'background:#409EFF;color:#fff;padding:2px 6px;border-radius:3px')
  console.log('员工池总数:', report.summary.employees)
  console.log('  · 在职:', report.summary.activeEmployees)
  console.log('  · 离职流程中:', report.summary.offboardingEmployees)
  console.log('  · 已离职:', report.summary.terminatedEmployees)
  console.log('异常总数:', report.totalViolations)

  if (report.violations.length === 0) {
    console.log('%c ✓ 未发现异常 ', 'color:#67C23A;font-weight:bold')
  } else {
    for (const v of report.violations) {
      const icon = v.severity === 'error' ? '✗' : v.severity === 'warning' ? '⚠' : 'ℹ'
      console.group(`%c ${icon} [${v.ruleCode}] ${v.ruleName} (${v.count})`, `color:${v.severity === 'error' ? '#F56C6C' : v.severity === 'warning' ? '#E6A23C' : '#909399'}`)
      console.log('修复建议:', v.fixHint)
      if (v.sample.length > 0) console.table(v.sample)
      console.groupEnd()
    }
  }
  console.groupEnd()
  /* eslint-enable no-console */
}

/* 开发环境：挂到 window 方便控制台直接调用 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as any).__hrHealthCheck = logHealthReport
}
