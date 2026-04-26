/**
 * 福利管理 Mock 数据（Phase 4.5）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { WelfareProgram, WelfareGrant } from '@/types/comp/welfare'
import { EMPLOYEES } from '@/mock/core/employeePool'

const initialPrograms: WelfareProgram[] = [
  {
    id: 1,
    code: 'WEL-FESTIVAL',
    name: '节日福利',
    category: 'festival',
    budgetAmount: 500000,
    scope: 'all',
    frequency: 'festival',
    description: '春节/端午/中秋/国庆 4 大节日发放福利（实物礼盒 + 购物卡）',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    code: 'WEL-BIRTHDAY',
    name: '生日福利',
    category: 'birthday',
    budgetAmount: 60000,
    scope: 'all',
    frequency: 'monthly',
    description: '员工生日当月发放 500 元蛋糕卡 + 专属贺卡',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    code: 'WEL-HEALTH',
    name: '年度体检',
    category: 'health_check',
    budgetAmount: 200000,
    scope: 'all',
    frequency: 'annually',
    description: '每年 Q2 安排全员年度体检，高管体检套餐升级',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 4,
    code: 'WEL-TRAVEL',
    name: '员工旅游',
    category: 'travel',
    budgetAmount: 800000,
    scope: 'all',
    frequency: 'annually',
    description: '每年 Q4 组织全员团建旅游，人均 ¥4000',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 5,
    code: 'WEL-INSURANCE',
    name: '商业保险',
    category: 'insurance',
    budgetAmount: 400000,
    scope: 'all',
    frequency: 'annually',
    description: '为员工购买补充商业保险（重疾 + 意外 + 医疗）',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 6,
    code: 'WEL-FAMILY',
    name: '家庭关爱',
    category: 'family',
    budgetAmount: 150000,
    scope: 'byLevel',
    scopeValues: ['M1', 'M2', 'M3', 'M4', 'M5'],
    frequency: 'annually',
    description: '管理岗以上员工配偶 + 子女医疗补贴',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: 7,
    code: 'WEL-ANNUAL',
    name: '年会/团建',
    category: 'annual_dinner',
    budgetAmount: 300000,
    scope: 'all',
    frequency: 'annually',
    description: '年末年会 + 季度团建',
    status: 1,
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  }
]

export const welfareProgramMock = createCrudMock<WelfareProgram>(initialPrograms, {
  idField: 'id',
  searchFields: ['name', 'code']
})

/**
 * 判断员工在指定日期是否在职（Wave 2 B+C 合并）
 * - 日期 < 入职日 → 未在职
 * - terminated 员工且日期 > 离职日 → 已离职
 * - 其他 → 在职
 */
function isActiveOnDate(emp: (typeof EMPLOYEES)[number], date: string): boolean {
  if (!emp.entryDate || date < emp.entryDate) return false
  if (emp.status === 'terminated' && emp.contractEndDate) {
    if (date > emp.contractEndDate) return false
  }
  return true
}

/**
 * 生成福利发放记录（Wave 2 B+C 合并：覆盖全员工池）
 *
 * 模式：
 * - 节日福利：2025 春节 + 2026 春节（按员工在职状态过滤）
 * - 生日福利：每员工在近 12 个月生日月发 1 次
 * - 年度体检：2025 Q2 + 2026 Q2
 * - 家庭关爱：管理岗年度发放
 */
function buildGrants(): WelfareGrant[] {
  const grants: WelfareGrant[] = []
  let id = 1
  const grantMethods: WelfareGrant['grantMethod'][] = ['cash', 'voucher', 'physical', 'service']

  // 春节福利（2025-02-05 春节前 / 2026-02-10 春节前）
  const springFestivals = [
    { date: '2025-02-05', year: 2025, remark: '2025 春节福利礼盒' },
    { date: '2026-02-10', year: 2026, remark: '2026 春节福利礼盒' }
  ]
  for (const sf of springFestivals) {
    EMPLOYEES.forEach((e) => {
      if (!isActiveOnDate(e, sf.date)) return
      grants.push({
        id: id++,
        programId: 1,
        programName: '节日福利',
        category: 'festival',
        employeeId: e.id,
        employeeName: e.nameZh,
        orgName: e.orgName,
        grantTime: sf.date + ' 14:00:00',
        amount: 800,
        grantMethod: 'physical',
        status: 'granted',
        remark: sf.remark,
        createTime: sf.date + ' 14:00:00'
      })
    })
  }

  // 生日福利（按员工生日月份，近 12 个月内发放）
  EMPLOYEES.forEach((e, i) => {
    if (!e.birthDate) return
    const birthMonth = e.birthDate.slice(5, 7) // MM
    // 确定最近一次生日月的发放日期（2025-05 ~ 2026-04 范围内）
    let year = 2026
    let grantDate = `${year}-${birthMonth}-15`
    if (grantDate > '2026-04-23') {
      year = 2025
      grantDate = `${year}-${birthMonth}-15`
    }
    if (grantDate < '2025-05-01') return // 超出窗口
    if (!isActiveOnDate(e, grantDate)) return
    grants.push({
      id: id++,
      programId: 2,
      programName: '生日福利',
      category: 'birthday',
      employeeId: e.id,
      employeeName: e.nameZh,
      orgName: e.orgName,
      grantTime: grantDate + ' 10:00:00',
      amount: 500,
      grantMethod: 'voucher',
      status: 'granted',
      remark: '生日蛋糕卡',
      createTime: grantDate + ' 10:00:00'
    })
  })

  // 年度体检（2025-03-10 / 2026-03-10）
  const healthChecks = [
    { date: '2025-03-10', remark: '2025 年度体检' },
    { date: '2026-03-10', remark: '2026 年度体检' }
  ]
  for (const hc of healthChecks) {
    EMPLOYEES.forEach((e, i) => {
      if (!isActiveOnDate(e, hc.date)) return
      grants.push({
        id: id++,
        programId: 3,
        programName: '年度体检',
        category: 'health_check',
        employeeId: e.id,
        employeeName: e.nameZh,
        orgName: e.orgName,
        grantTime: hc.date + ' 09:00:00',
        amount: e.level.startsWith('M') ? 2000 : 800,
        grantMethod: grantMethods[i % 4],
        status: 'granted',
        remark: e.level.startsWith('M') ? '管理岗体检套餐' : hc.remark,
        createTime: hc.date + ' 09:00:00'
      })
    })
  }

  // 家庭关爱（仅管理岗，2026-Q1）
  EMPLOYEES.forEach((e) => {
    if (!e.level.startsWith('M')) return
    const grantDate = '2026-01-25'
    if (!isActiveOnDate(e, grantDate)) return
    grants.push({
      id: id++,
      programId: 6,
      programName: '家庭关爱',
      category: 'family',
      employeeId: e.id,
      employeeName: e.nameZh,
      orgName: e.orgName,
      grantTime: grantDate + ' 11:00:00',
      amount: 3000,
      grantMethod: 'cash',
      status: 'granted',
      remark: '管理岗家属补贴',
      createTime: grantDate + ' 11:00:00'
    })
  })

  return grants
}

export const welfareGrantMock = createCrudMock<WelfareGrant>(
  alignEmployeeFields(buildGrants()),
  {
    idField: 'id',
    searchFields: ['employeeName', 'programName']
  }
)

/** 按员工 ID 查询福利 */
export function getWelfaresByEmployee(employeeId: number): WelfareGrant[] {
  return welfareGrantMock
    .getData()
    .filter((g) => g.employeeId === employeeId)
    .sort((a, b) => b.grantTime.localeCompare(a.grantTime))
}
