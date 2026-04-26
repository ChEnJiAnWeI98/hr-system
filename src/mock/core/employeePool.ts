/**
 * 200 名员工生成脚本（Phase 1.4）
 *
 * 固定种子确定性生成，保证每次执行结果一致。
 *
 * 分布设计：
 * - 组织：按岗位族匹配对应组织
 * - 岗位族：技术 90 / 产品 40 / 运营 30 / 职能 20 / 管理 20 = 200
 * - 职级：正态分布，峰值 P5~P6
 * - 状态：193 正式 / 3 试用期 / 2 调动中 / 2 离职中
 * - 上下级：按组织 + 职级自动分配
 * - HRBP：人力资源部 P7+ 员工，managedOrgIds 覆盖所有事业部
 */

import type { Employee } from '@/types/employee/profile'
import { ORGANIZATIONS } from './organizationTree'
import { POSITIONS, LEVEL_SPECS } from './positionMatrix'
import {
  SEED,
  createRandom,
  COMMON_SURNAMES,
  NAME_CHARS,
  REGION_CODES,
  WORK_LOCATIONS,
  generateIdCard
} from './seed'

const rand = createRandom(SEED)

/** 岗位族 → 目标组织 ID 映射
 *  员工下沉到叶子组（team 级），确保每个中心都有子组承载员工
 *  管理族挂在事业部/子公司级别（业务上合理：管理者在更高层） */
const FAMILY_TO_ORG: Record<string, number[]> = {
  TECH: [10, 11], // 后端组 / 前端组
  PROD: [13, 14], // 产品经理组 / UX 设计组
  OPS: [15], // 运营组
  SALES: [16], // 市场组
  FUNC: [17, 18], // 招聘组 / HRBP 组
  MGMT: [2, 3, 4, 5] // 管理族挂在事业部/子公司级别
}

/** 岗位族目标人数 */
const FAMILY_TARGET: Record<string, number> = {
  TECH: 90,
  PROD: 40,
  OPS: 20,
  SALES: 10,
  FUNC: 20,
  MGMT: 20
}

/** 职级分布权重（按 rank 优先，P5~P6 峰值）*/
const LEVEL_WEIGHT_PRO: Record<string, number> = {
  P2: 5,
  P3: 15,
  P4: 18,
  P5: 22,
  P6: 20,
  P7: 12,
  P8: 5,
  P9: 2,
  P10: 1
}
const LEVEL_WEIGHT_MGMT: Record<string, number> = {
  M1: 35,
  M2: 30,
  M3: 20,
  M4: 10,
  M5: 5
}

/** 状态分布（200 人）
 *
 * 顺序很重要：regular 排在前面（保护"按 index 取人"的早期 mock 不出问题），
 * 特殊状态（offboarding / terminated）排在末尾，方便 mock 用 filter 选取。
 *
 * terminated 数量按 offboarding mock 的实际 completed 记录数（15 条）一比一匹配，
 * 避免 alignEmployeeFields 循环对齐导致同一员工被分配多条离职。
 *
 * - regular: 176 → EMPLOYEES[0..175]
 * - probation: 3 → EMPLOYEES[176..178]
 * - transferring: 2 → EMPLOYEES[179..180]
 * - offboarding: 4 → EMPLOYEES[181..184]（离职流程进行中）
 * - terminated: 15 → EMPLOYEES[185..199]（已完成离职）
 */
const STATUS_DIST = [
  { count: 176, status: 'regular' as const },
  { count: 3, status: 'probation' as const },
  { count: 2, status: 'transferring' as const },
  { count: 4, status: 'offboarding' as const },
  { count: 15, status: 'terminated' as const }
]

/** 按权重选择职级 */
function pickLevel(track: 'professional' | 'management', family: string): string {
  const weights = track === 'management' ? LEVEL_WEIGHT_MGMT : LEVEL_WEIGHT_PRO
  const items = Object.entries(weights).map(([value, weight]) => ({ value, weight }))
  return rand.pickWeighted(items)
}

/** 根据岗位族 + 职级选一个匹配的岗位 */
function pickPosition(family: string, level: string) {
  const levelRank = LEVEL_SPECS.find((l) => l.code === level)?.rank ?? 5
  const candidates = POSITIONS.filter((p) => {
    if (p.familyCode !== family) return false
    const minRank = LEVEL_SPECS.find((l) => l.code === p.levelMin)?.rank ?? 0
    const maxRank = LEVEL_SPECS.find((l) => l.code === p.levelMax)?.rank ?? 10
    return levelRank >= minRank && levelRank <= maxRank
  })
  if (candidates.length === 0) {
    // 兜底
    return POSITIONS.find((p) => p.familyCode === family) || POSITIONS[0]
  }
  return rand.pick(candidates)
}

/** 生成中文姓名 */
function pickName(): string {
  const surname = rand.pick(COMMON_SURNAMES)
  const useSingleChar = rand.next() < 0.3
  if (useSingleChar) {
    return surname + rand.pick(NAME_CHARS)
  }
  return surname + rand.pick(NAME_CHARS) + rand.pick(NAME_CHARS)
}

/** 生成生日（1965~2003 正态分布峰值 1990） */
function pickBirthDate(): string {
  const yearSpan = 2003 - 1965
  const yearNorm = rand.nextNormal(0.66, 0.15) // 0.66 对应 ~1990
  const year = 1965 + Math.floor(yearNorm * yearSpan)
  const month = rand.nextInt(1, 12)
  const daysInMonth = new Date(year, month, 0).getDate()
  const day = rand.nextInt(1, daysInMonth)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** 生成入职日期（2012~2025） */
function pickEntryDate(): string {
  const year = 2012 + Math.floor(rand.nextNormal(0.7, 0.22) * (2025 - 2012))
  const month = rand.nextInt(1, 12)
  const day = rand.nextInt(1, 28)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** 计算年龄 */
function calcAge(birthDate: string): number {
  const now = new Date('2026-04-21')
  const [y, m, d] = birthDate.split('-').map(Number)
  const age = now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0)
  return Math.max(age, 18)
}

/** 计算司龄 */
function calcSeniority(entryDate: string): number {
  const now = new Date('2026-04-21')
  const entry = new Date(entryDate)
  const ms = now.getTime() - entry.getTime()
  return Math.max(0, +(ms / (1000 * 60 * 60 * 24 * 365)).toFixed(1))
}

/** 生成手机号（固定格式基于 ID） */
function genMobile(id: number): string {
  const prefixes = ['138', '139', '150', '156', '158', '186', '188', '199']
  const prefix = prefixes[id % prefixes.length]
  const mid = String((id * 9301 + 49297) % 10000).padStart(4, '0')
  const tail = String((id * 13 + 7) % 10000).padStart(4, '0')
  return prefix + mid + tail
}

/** 生成邮箱 */
function genEmail(employeeNo: string, nameEn?: string): string {
  const prefix = nameEn || employeeNo.toLowerCase()
  return `${prefix}@zhonghe.com`
}

/** 按岗位族 → 可选工作地点 */
function pickWorkLocation(family: string): string {
  if (family === 'MGMT' || family === 'FUNC') {
    return rand.pick(['北京', '上海'])
  }
  return rand.pick(WORK_LOCATIONS)
}

/** 计算薪酬（按职级 + 岗位族）*/
function calcSalary(level: string, family: string): {
  baseSalary: number
  positionSalary: number
  performanceBase: number
  socialBase: number
} {
  const levelRank = LEVEL_SPECS.find((l) => l.code === level)?.rank ?? 5
  // 基础薪酬（月薪）
  const familyFactor: Record<string, number> = {
    TECH: 1.3,
    PROD: 1.2,
    SALES: 1.0,
    OPS: 1.0,
    FUNC: 1.0,
    MGMT: 1.1
  }
  const base = 8000 + (levelRank - 2) * 2500
  const factor = familyFactor[family] ?? 1.0
  const baseSalary = Math.round(base * factor / 1000) * 1000
  const positionSalary = Math.round((baseSalary * 0.5) / 500) * 500
  const performanceBase = Math.round((baseSalary * 0.4) / 500) * 500
  const socialBase = Math.round(baseSalary)
  return { baseSalary, positionSalary, performanceBase, socialBase }
}

/** 主生成函数 */
function generateEmployees(): Employee[] {
  rand.reset(SEED) // 确保每次重新生成结果一致
  const employees: Employee[] = []

  // ========== Step 1：先分配岗位族配额 ==========
  const familyAssignments: Array<{ family: string }> = []
  for (const [family, target] of Object.entries(FAMILY_TARGET)) {
    for (let i = 0; i < target; i++) {
      familyAssignments.push({ family })
    }
  }

  // ========== Step 2：按状态分布扁平化 ==========
  const statusList: Employee['status'][] = []
  for (const item of STATUS_DIST) {
    for (let i = 0; i < item.count; i++) {
      statusList.push(item.status)
    }
  }
  // 用独立 rand shuffle statusList，避免"后置族（如 MGMT）全部落到特殊状态"的尴尬。
  // 独立种子（SEED+1）确保主 rand 流不受影响——姓名/岗位等字段保持稳定。
  const statusRand = createRandom(SEED + 1)
  for (let i = statusList.length - 1; i > 0; i--) {
    const j = statusRand.nextInt(0, i)
    ;[statusList[i], statusList[j]] = [statusList[j], statusList[i]]
  }

  // ========== Step 3：生成每个员工 ==========
  for (let i = 0; i < 200; i++) {
    const id = 1001 + i
    const employeeNo = `YG2020${String(i + 1).padStart(4, '0')}`
    const family = familyAssignments[i].family
    const status = statusList[i] || 'regular'

    // 职级
    const track: 'professional' | 'management' = family === 'MGMT' ? 'management' : 'professional'
    const level = pickLevel(track, family)

    // 岗位
    const position = pickPosition(family, level)

    // 组织
    const orgIds = FAMILY_TO_ORG[family] || [6]
    const orgId = rand.pick(orgIds)
    const org = ORGANIZATIONS.find((o) => o.id === orgId)!

    // 姓名
    const nameZh = pickName()

    // 生日 / 入职
    const birthDate = pickBirthDate()
    const entryDate = pickEntryDate()

    // 身份证
    const regionCode = rand.pick(REGION_CODES)
    const certificateNo = generateIdCard(birthDate, regionCode, id)

    // 入职相关日期
    const [entryY, entryM, entryD] = entryDate.split('-').map(Number)
    const regularYear = entryY
    const regularMonth = entryM + 3 > 12 ? entryM + 3 - 12 : entryM + 3
    const regularDate = `${regularMonth <= entryM ? regularYear + 1 : regularYear}-${String(regularMonth).padStart(2, '0')}-${String(entryD).padStart(2, '0')}`

    // 薪酬
    const salary = calcSalary(level, family)

    // 雇佣类型
    // ⚠️ 必须无条件消耗 1 次 rand，让员工池姓名/属性不依赖 STATUS_DIST 的具体数量分布。
    // 否则修改 STATUS_DIST 会从某个 i 开始让 rand 状态错位，连锁打乱后续所有员工的姓名等字段。
    const internRoll = rand.next()
    const employmentType = status === 'probation' ? 'regular' : internRoll < 0.05 ? 'intern' : 'regular'

    const emp: Employee = {
      id,
      employeeNo,
      // 基本
      nameZh,
      gender: rand.next() < 0.55 ? 'M' : 'F',
      birthDate,
      age: calcAge(birthDate),
      certificateType: 'id_card',
      certificateNo,
      nation: rand.next() < 0.92 ? 'N01' : `N${String(rand.nextInt(2, 56)).padStart(2, '0')}`,
      nationality: 'CN',
      maritalStatus: rand.next() < 0.55 ? 'married' : 'single',
      politicalStatus: rand.pickWeighted([
        { value: 'mass', weight: 55 },
        { value: 'cpc_member', weight: 20 },
        { value: 'youth_league', weight: 22 },
        { value: 'democratic_party', weight: 3 }
      ]),
      education: rand.pickWeighted([
        { value: 'college', weight: 12 },
        { value: 'bachelor', weight: 55 },
        { value: 'master', weight: 28 },
        { value: 'doctor', weight: 5 }
      ]),
      graduatedSchool: rand.pick([
        '清华大学', '北京大学', '复旦大学', '浙江大学', '上海交通大学',
        '南京大学', '武汉大学', '中山大学', '北京航空航天大学', '华中科技大学',
        '同济大学', '西安交通大学', '哈尔滨工业大学', '天津大学', '电子科技大学'
      ]),
      major: rand.pick(['计算机科学与技术', '软件工程', '信息管理', '工商管理', '市场营销', '人力资源', '电子工程', '数学', '统计学']),
      mobile: genMobile(id),
      email: genEmail(employeeNo),
      homeAddress: `${pickWorkLocation(family)}市${rand.pick(['朝阳区', '海淀区', '浦东新区', '福田区', '西湖区', '武侯区'])}${rand.pick(['昆仑路', '长安路', '香山路', '人民路'])}${rand.nextInt(1, 999)}号`,
      emergencyContact: {
        name: pickName(),
        relation: rand.pick(['parent', 'spouse', 'sibling']),
        mobile: genMobile(id + 10000)
      },

      // 岗位
      orgId,
      orgName: org.orgName,
      orgPath: org.path,
      positionId: position.id,
      positionName: position.positionName,
      jobFamily: family,
      jobSequence: position.sequenceCode,
      level,
      levelTrack: track,
      supervisorId: undefined, // 稍后按组织分配
      hrbpId: undefined, // 稍后统一分配
      workLocation: pickWorkLocation(family),
      employmentType,

      // 生命周期
      entryDate,
      regularizationDate: status === 'probation' ? undefined : regularDate,
      seniority: calcSeniority(entryDate),
      status,

      // 合同
      currentContractId: id, // 简单 1:1
      contractType: 'fixed',
      contractStartDate: entryDate,
      contractEndDate: `${entryY + 3}-${String(entryM).padStart(2, '0')}-${String(entryD).padStart(2, '0')}`,

      // 薪酬
      ...salary,

      createTime: entryDate + ' 09:00:00',
      updateTime: '2026-04-01 10:00:00'
    }

    employees.push(emp)
  }

  // ========== Step 4：分配直属上级 ==========
  // 规则：同组织内，找比自己职级高 1~2 级的员工作为上级
  employees.forEach((emp) => {
    const sameOrgHigherLevel = employees.filter((other) => {
      if (other.id === emp.id) return false
      if (other.orgId !== emp.orgId) return false
      const myRank = LEVEL_SPECS.find((l) => l.code === emp.level)?.rank ?? 5
      const otherRank = LEVEL_SPECS.find((l) => l.code === other.level)?.rank ?? 5
      return otherRank > myRank && otherRank - myRank <= 3
    })
    if (sameOrgHigherLevel.length > 0) {
      emp.supervisorId = rand.pick(sameOrgHigherLevel).id
    } else {
      // 找父组织里的管理者
      const parentOrg = ORGANIZATIONS.find((o) => o.id === ORGANIZATIONS.find((x) => x.id === emp.orgId)?.parentId)
      if (parentOrg) {
        const parentManagers = employees.filter((other) => {
          if (other.id === emp.id) return false
          return other.orgId === parentOrg.id && other.jobFamily === 'MGMT'
        })
        if (parentManagers.length) {
          emp.supervisorId = rand.pick(parentManagers).id
        }
      }
    }
  })

  // ========== Step 5：HRBP 分配（人力资源部 P7+ 员工担任） ==========
  const hrbpCandidates = employees.filter((e) => e.orgId === 9 && (e.level === 'P7' || e.level === 'P8' || e.level === 'M2' || e.level === 'M3'))
  // 至少确保有 3 个 HRBP
  if (hrbpCandidates.length < 3) {
    // 把 orgId=9 中最高级的 3 个强制升级为 P7+
    const hrEmps = employees.filter((e) => e.orgId === 9)
    hrEmps.slice(0, 3).forEach((e) => {
      e.level = 'P7'
      e.positionId = POSITIONS.find((p) => p.positionCode === 'POSFUNC003')?.id || e.positionId
      e.positionName = 'HRBP'
      e.jobSequence = 'FUNC_HR'
      hrbpCandidates.push(e)
    })
  }

  // managedOrgIds 分配：3~5 个 HRBP 覆盖事业部 + 子公司（2, 3, 4, 5, 12）
  const hrbpOrgGroups = [
    [2, 6, 10, 11], // 技术事业部 + 其下组织
    [3, 7], // 产品事业部 + 其下
    [4, 8, 5, 9, 12] // 其他（商业/职能/AI）
  ]
  hrbpCandidates.slice(0, 3).forEach((hrbp, idx) => {
    hrbp.managedOrgIds = hrbpOrgGroups[idx] || []
  })

  // 给所有员工分配 HRBP
  employees.forEach((emp) => {
    const hrbp = hrbpCandidates.find((h) =>
      h.managedOrgIds?.includes(emp.orgId)
    )
    if (hrbp && emp.id !== hrbp.id) {
      emp.hrbpId = hrbp.id
    }
  })

  return employees
}

/** ================================================================
 * Wave 2 A 路线补丁（2026-04-23）
 * - B5-a 修复：入职 > 6 个月的 probation 员工自动转正
 * - B1 / C6 修复：基于"首签期限 + 是否到期"真实生成合同池
 * ================================================================ */

const TODAY = '2026-04-23'

/** 日期工具：entryDate + N 年 */
function addYearsToDate(date: string, years: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${y + years}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** 日期工具：某日 +1 天 */
function addOneDay(date: string): string {
  const d = new Date(date + 'T00:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

/** 日期工具：某日 + N 个月 */
function addMonthsToDate(date: string, months: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const total = m + months
  const newY = y + Math.floor((total - 1) / 12)
  const newM = ((total - 1) % 12) + 1
  return `${newY}-${String(newM).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** 首签期限（权重）：1/2/3/5 年 */
function pickFirstTermYears(r: ReturnType<typeof createRandom>): number {
  return r.pickWeighted<number>([
    { value: 1, weight: 5 },
    { value: 2, weight: 25 },
    { value: 3, weight: 55 },
    { value: 5, weight: 15 }
  ])
}

/** 续签期限（权重）：3/5 年 */
function pickRenewalTermYears(r: ReturnType<typeof createRandom>): number {
  return r.pickWeighted<number>([
    { value: 3, weight: 40 },
    { value: 5, weight: 60 }
  ])
}

/** 试用期月数（按首签期限换算，参考《劳动合同法》第 19 条） */
function probationMonthsByTerm(termYears: number): number {
  if (termYears < 1) return 0
  if (termYears < 3) return 2
  return 3
}

/** 合同池记录（简化版，用于 contract.ts 接入）*/
export interface PoolContract {
  id: number
  contractNo: string
  employeeId: number
  employeeName: string
  employeeNo: string
  department: string
  type: 1 // ContractTypeEnum.LABOR
  templateId: number
  templateName: string
  content: string
  signDate: string
  startDate: string
  endDate: string
  probationPeriod?: number
  workLocation: string
  workContent: string
  salary: string
  status: number // 4=履约中 / 5=已续签 / 6=已终止
  signMethod: number
  attachments: string[]
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

const CONTRACT_CONTENT_TEMPLATE =
  '<h2>劳动合同</h2><p>甲方（用人单位）：中禾科技有限公司</p><p>乙方（劳动者）：{{employeeName}}</p><p>根据《中华人民共和国劳动合同法》及有关法律法规规定，甲乙双方签订本劳动合同。</p>'

/** terminated 员工的离职日（按 offboarding mock 的分布预置，单独种子生成避免扰动主流）*/
function buildTerminationDates(count: number): string[] {
  // 15 个 terminated 员工的离职日分布：2025-01 ~ 2026-03 范围
  const terminationRand = createRandom(SEED + 2)
  const results: string[] = []
  for (let i = 0; i < count; i++) {
    // 2025-01 到 2026-03，共 15 个月
    const monthOffset = terminationRand.nextInt(0, 14)
    const baseY = 2025
    const baseM = 1 + monthOffset
    const y = baseY + Math.floor((baseM - 1) / 12)
    const m = ((baseM - 1) % 12) + 1
    const d = terminationRand.nextInt(1, 28)
    results.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return results
}

/** 构造合同记录 */
function buildContract(
  id: number,
  emp: Employee,
  startDate: string,
  endDate: string,
  status: number,
  probationMonths: number,
  signDate?: string,
  remark?: string
): PoolContract {
  const contractNo = `HT${startDate.slice(0, 4)}${String(id).padStart(5, '0')}`
  const salaryStr = `月薪${emp.baseSalary || 10000}元`
  return {
    id,
    contractNo,
    employeeId: emp.id,
    employeeName: emp.nameZh,
    employeeNo: emp.employeeNo,
    department: emp.orgName,
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: CONTRACT_CONTENT_TEMPLATE.replace('{{employeeName}}', emp.nameZh),
    signDate: signDate || startDate,
    startDate,
    endDate,
    probationPeriod: probationMonths > 0 ? probationMonths : undefined,
    workLocation: emp.workLocation || '北京',
    workContent: `${emp.positionName}岗位职责`,
    salary: salaryStr,
    status,
    signMethod: 1,
    attachments: [],
    createBy: '系统生成',
    createTime: startDate + ' 09:00:00',
    updateBy: '系统生成',
    updateTime: startDate + ' 09:00:00',
    ...(remark ? { remark } : {})
  }
}

/** 基于员工池生成合同池（会直接 mutate 员工的 currentContractId / contractStartDate / contractEndDate） */
function generatePoolContracts(employees: Employee[]): PoolContract[] {
  const contractRand = createRandom(SEED + 3)
  const contracts: PoolContract[] = []
  let contractIdSeed = 1001

  // 为 terminated 员工预生成离职日
  const terminatedIndexes = employees
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => e.status === 'terminated')
    .map(({ i }) => i)
  const terminationDates = buildTerminationDates(terminatedIndexes.length)
  const terminationDateMap = new Map<number, string>()
  terminatedIndexes.forEach((idx, k) => {
    terminationDateMap.set(employees[idx].id, terminationDates[k])
  })

  for (const emp of employees) {
    const firstTerm = pickFirstTermYears(contractRand)
    const firstStart = emp.entryDate
    const firstEnd = addYearsToDate(firstStart, firstTerm)
    const probation = probationMonthsByTerm(firstTerm)

    // 已离职员工：合同状态 = 已终止，endDate = min(离职日, 首签到期日)
    if (emp.status === 'terminated') {
      const termDate = terminationDateMap.get(emp.id)!
      if (termDate <= firstEnd) {
        // 离职在首签内：只有一份合同，已终止
        const c = buildContract(contractIdSeed++, emp, firstStart, termDate, 6, probation, firstStart, '员工离职终止')
        contracts.push(c)
        emp.currentContractId = c.id
        emp.contractStartDate = firstStart
        emp.contractEndDate = termDate
      } else {
        // 首签已到期，续签后又离职：两份合同（首签已续签 + 续签已终止）
        const c1 = buildContract(contractIdSeed++, emp, firstStart, firstEnd, 5, probation, firstStart, '合同到期续签')
        const renewTerm = pickRenewalTermYears(contractRand)
        const secondStart = addOneDay(firstEnd)
        const secondOriginalEnd = addYearsToDate(secondStart, renewTerm)
        const secondEnd = termDate < secondOriginalEnd ? termDate : secondOriginalEnd
        const c2 = buildContract(contractIdSeed++, emp, secondStart, secondEnd, 6, 0, secondStart, '员工离职终止')
        contracts.push(c1, c2)
        emp.currentContractId = c2.id
        emp.contractStartDate = secondStart
        emp.contractEndDate = secondEnd
      }
      continue
    }

    // 在职类员工（含 offboarding）：按"首签是否到期"走（续签也可能再到期，循环直到最新一份未到期）
    if (firstEnd < TODAY) {
      // 首签已到期 → 滚动续签至最新一份未到期
      const terms: Array<{ start: string; end: string }> = [{ start: firstStart, end: firstEnd }]
      let cursor = firstEnd
      while (cursor < TODAY) {
        const renewTerm = pickRenewalTermYears(contractRand)
        const nextStart = addOneDay(cursor)
        const nextEnd = addYearsToDate(nextStart, renewTerm)
        terms.push({ start: nextStart, end: nextEnd })
        cursor = nextEnd
      }
      // 最后一份履约中（status=4），之前的都是已续签（status=5）
      terms.forEach((t, idx) => {
        const isFinal = idx === terms.length - 1
        const isFirst = idx === 0
        const c = buildContract(
          contractIdSeed++,
          emp,
          t.start,
          t.end,
          isFinal ? 4 : 5,
          isFirst ? probation : 0,
          t.start,
          isFinal ? undefined : '合同到期续签'
        )
        contracts.push(c)
        if (isFinal) {
          emp.currentContractId = c.id
          emp.contractStartDate = t.start
          emp.contractEndDate = t.end
        }
      })
    } else {
      // 首签未到期 → 只有一份
      const c = buildContract(contractIdSeed++, emp, firstStart, firstEnd, 4, probation, firstStart)
      contracts.push(c)
      emp.currentContractId = c.id
      emp.contractStartDate = firstStart
      emp.contractEndDate = firstEnd
    }
  }
  return contracts
}

/** B5-a 修复：入职 > 6 个月的 probation 员工自动转正 */
function applyProbationAutoRegularization(employees: Employee[]): void {
  for (const emp of employees) {
    if (emp.status !== 'probation' || !emp.entryDate) continue
    const probationEnd = addMonthsToDate(emp.entryDate, 6)
    if (probationEnd < TODAY) {
      emp.status = 'regular'
      emp.regularizationDate = probationEnd
    }
  }
}

/** 导出固定的 200 员工 Mock 数据 */
export const EMPLOYEES: Employee[] = generateEmployees()

// Post-processing：顺序敏感
// 1) 先修试用期（B5-a）
applyProbationAutoRegularization(EMPLOYEES)
// 2) 再生成合同池（会回填 currentContractId / contractStartDate / contractEndDate）
export const POOL_CONTRACTS: PoolContract[] = generatePoolContracts(EMPLOYEES)

/** 辅助：按组织路径展开的可见 ID 列表 */
export function getEmployeesByOrgPath(orgPath: string, employees: Employee[] = EMPLOYEES): Employee[] {
  return employees.filter((e) => e.orgPath.startsWith(orgPath))
}
