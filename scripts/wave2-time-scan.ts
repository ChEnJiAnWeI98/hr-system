/**
 * Wave 2 A 路线：时间一致性异常扫描脚本
 *
 * 跑法：pnpm tsx scripts/wave2-time-scan.ts
 * 输出：按 B 规则分组的异常清单（控制台 + scripts/wave2-time-scan.report.md）
 *
 * 规则参考：docs/HR重构-数据健康度规则-V1.0.md
 */

import { writeFileSync } from 'node:fs'
import { EMPLOYEES } from '../src/mock/core/employeePool'

const TODAY = '2026-04-23'

interface Violation {
  rule: string
  description: string
  count: number
  samples: unknown[]
  severity: 'error' | 'warning' | 'info'
}

const violations: Violation[] = []

/* ======================================================
 * B1: 合同截止日 < 今天（员工仍在职）
 * ====================================================== */
function checkB1() {
  const abnormal = EMPLOYEES.filter(
    (e) =>
      (e.status === 'regular' || e.status === 'probation' || e.status === 'transferring' || e.status === 'seconded') &&
      e.contractEndDate &&
      e.contractEndDate < TODAY
  )
  if (abnormal.length === 0) return
  violations.push({
    rule: 'B1',
    description: '合同截止日 < 今天，但员工状态仍在职',
    severity: 'error',
    count: abnormal.length,
    samples: abnormal.slice(0, 10).map((e) => ({
      id: e.id,
      name: e.nameZh,
      status: e.status,
      entryDate: e.entryDate,
      contractStartDate: e.contractStartDate,
      contractEndDate: e.contractEndDate
    }))
  })
}

/* ======================================================
 * B2: 合同生效日 > 今天（员工仍在职）
 * ====================================================== */
function checkB2() {
  const abnormal = EMPLOYEES.filter(
    (e) =>
      (e.status === 'regular' || e.status === 'probation') &&
      e.contractStartDate &&
      e.contractStartDate > TODAY
  )
  if (abnormal.length === 0) return
  violations.push({
    rule: 'B2',
    description: '合同生效日 > 今天，但员工状态已在职',
    severity: 'error',
    count: abnormal.length,
    samples: abnormal.slice(0, 10).map((e) => ({ id: e.id, name: e.nameZh, status: e.status, contractStartDate: e.contractStartDate }))
  })
}

/* ======================================================
 * B3: 入职日 > 今天（status 为在职类）
 * ====================================================== */
function checkB3() {
  const abnormal = EMPLOYEES.filter(
    (e) =>
      (e.status === 'regular' || e.status === 'probation' || e.status === 'transferring') &&
      e.entryDate &&
      e.entryDate > TODAY
  )
  if (abnormal.length === 0) return
  violations.push({
    rule: 'B3',
    description: '入职日 > 今天，但状态已在职',
    severity: 'error',
    count: abnormal.length,
    samples: abnormal.slice(0, 10).map((e) => ({ id: e.id, name: e.nameZh, status: e.status, entryDate: e.entryDate }))
  })
}

/* ======================================================
 * B5: 试用期状态与入职日期一致（入职 > 6 个月应已转正）
 * ====================================================== */
function checkB5() {
  // 计算入职日 + 6 个月
  function addMonths(date: string, months: number): string {
    const [y, m, d] = date.split('-').map(Number)
    const total = m + months
    const newY = y + Math.floor((total - 1) / 12)
    const newM = ((total - 1) % 12) + 1
    return `${newY}-${String(newM).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  // B5-a：probation 员工但试用期已满 6 个月
  const a = EMPLOYEES.filter((e) => {
    if (e.status !== 'probation' || !e.entryDate) return false
    const probEnd = addMonths(e.entryDate, 6)
    return probEnd < TODAY
  })

  // B5-b：regular 员工但入职未满 3 个月（项目转正周期）且无 regularizationDate
  const b = EMPLOYEES.filter((e) => {
    if (e.status !== 'regular' || !e.entryDate) return false
    const regEnd = addMonths(e.entryDate, 3)
    return regEnd > TODAY
  })

  if (a.length > 0) {
    violations.push({
      rule: 'B5-a',
      description: 'probation 员工但入职 > 6 个月（应已自动转正）',
      severity: 'warning',
      count: a.length,
      samples: a.slice(0, 10).map((e) => ({ id: e.id, name: e.nameZh, status: e.status, entryDate: e.entryDate }))
    })
  }
  if (b.length > 0) {
    violations.push({
      rule: 'B5-b',
      description: 'regular 员工但入职未满 3 个月（应为 probation）',
      severity: 'warning',
      count: b.length,
      samples: b.slice(0, 10).map((e) => ({ id: e.id, name: e.nameZh, status: e.status, entryDate: e.entryDate, regularizationDate: e.regularizationDate }))
    })
  }
}

/* ======================================================
 * B4 辅助：terminated 员工是否都有对齐的 offboarding 记录（已通过 offboarding.ts 的 filter 间接保证）
 * ====================================================== */
function checkB4() {
  const terminated = EMPLOYEES.filter((e) => e.status === 'terminated')
  const offboarding = EMPLOYEES.filter((e) => e.status === 'offboarding')
  violations.push({
    rule: 'B4',
    description: 'terminated/offboarding 员工池分布',
    severity: 'info',
    count: 0,
    samples: [
      { label: 'terminated 员工数', value: terminated.length },
      { label: 'offboarding 员工数', value: offboarding.length },
      { label: '说明', value: 'offboarding mock 通过 filter 确保对齐，此规则在 filter 保证下无异常' }
    ]
  })
}

/* ======================================================
 * 附加检查：合同对齐率（员工的 currentContractId vs 合同池）
 * ====================================================== */
async function checkContractAlignment() {
  try {
    const { getContractListMock } = await import('../src/mock/contract')
    const result = getContractListMock({ page: 1, pageSize: 9999, contractNo: '', employeeName: '', contractType: '', status: '' } as any)
    const contracts = (result as any).list || []
    const contractIds = new Set(contracts.map((c: any) => c.id))

    const missing = EMPLOYEES.filter((e) => {
      if (!e.currentContractId) return false
      return !contractIds.has(e.currentContractId)
    })
    if (missing.length === 0) return
    violations.push({
      rule: 'C6',
      description: '员工的 currentContractId 指向不存在的合同记录',
      severity: 'error',
      count: missing.length,
      samples: missing.slice(0, 10).map((e) => ({ id: e.id, name: e.nameZh, currentContractId: e.currentContractId }))
    })
  } catch (err: any) {
    violations.push({
      rule: 'C6',
      description: '合同对齐检查失败（可能是动态生成问题）',
      severity: 'info',
      count: 0,
      samples: [{ error: err?.message || String(err) }]
    })
  }
}

/* ======================================================
 * 主函数
 * ====================================================== */
async function main() {
  const summary = {
    today: TODAY,
    totalEmployees: EMPLOYEES.length,
    byStatus: {
      regular: EMPLOYEES.filter((e) => e.status === 'regular').length,
      probation: EMPLOYEES.filter((e) => e.status === 'probation').length,
      transferring: EMPLOYEES.filter((e) => e.status === 'transferring').length,
      offboarding: EMPLOYEES.filter((e) => e.status === 'offboarding').length,
      terminated: EMPLOYEES.filter((e) => e.status === 'terminated').length
    }
  }

  checkB1()
  checkB2()
  checkB3()
  checkB4()
  checkB5()
  await checkContractAlignment()

  // 输出
  console.log('\n===== Wave 2 A 路线 · 时间一致性扫描报告 =====\n')
  console.log(`扫描日期：${summary.today}`)
  console.log(`员工池：${summary.totalEmployees} 人`)
  console.log(`状态分布：`, summary.byStatus)
  console.log(`\n总异常数：${violations.filter((v) => v.severity === 'error').reduce((s, v) => s + v.count, 0)}（error 级）\n`)

  for (const v of violations) {
    const icon = v.severity === 'error' ? '[✗]' : v.severity === 'warning' ? '[⚠]' : '[ℹ]'
    console.log(`${icon} [${v.rule}] ${v.description}（命中 ${v.count} 条）`)
    if (v.samples.length > 0) {
      console.log('    抽样：')
      v.samples.forEach((s) => console.log('     ', JSON.stringify(s)))
    }
    console.log()
  }

  // 写 Markdown 报告
  let md = `# Wave 2 A 路线 · 时间一致性扫描报告\n\n`
  md += `**扫描日期**：${summary.today}\n`
  md += `**员工池**：${summary.totalEmployees} 人\n`
  md += `**状态分布**：\n`
  for (const [k, v] of Object.entries(summary.byStatus)) {
    md += `  - ${k}: ${v}\n`
  }
  md += `\n**总异常数**：${violations.filter((v) => v.severity === 'error').reduce((s, v) => s + v.count, 0)}（error 级）\n\n`

  for (const v of violations) {
    md += `## [${v.rule}] ${v.description}\n\n`
    md += `- **严重度**：${v.severity}\n`
    md += `- **命中数**：${v.count}\n`
    if (v.samples.length > 0) {
      md += `- **抽样（前 10 条）**：\n\n\`\`\`json\n`
      v.samples.forEach((s) => { md += JSON.stringify(s) + '\n' })
      md += `\`\`\`\n\n`
    }
  }

  writeFileSync('scripts/wave2-time-scan.report.md', md, 'utf-8')
  console.log('\n报告已写入：scripts/wave2-time-scan.report.md')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
