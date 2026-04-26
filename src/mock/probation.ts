/**
 * 试用期管理 Mock 数据（Phase 4.x 业务重构）
 *
 * 数据源原则：
 *   - 当前 status='probation' 员工 → 自动生成"试用期"记录
 *   - 部分 regular 员工（最近入职的）→ 生成"转正"历史记录
 *   - 部分 terminated 员工 → 生成"试用未通过"历史记录（演示用）
 *   - 1 个演示"延长试用期"记录
 */
import type { Probation, ProbationListParams } from '@/types/probation'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 基于员工池构建初始 Probation 记录 */
function buildInitialProbations(): Probation[] {
  const list: Probation[] = []
  let id = 1

  // 1. 所有 probation 员工：试用期中，入职日期统一为 2026-04-17
  EMPLOYEES.filter((e) => e.status === 'probation').forEach((e) => {
    const entryDate = '2026-04-17'
    const [y, m, d] = entryDate.split('-').map(Number)
    const regularYear = m + 3 > 12 ? y + 1 : y
    const regularMonth = ((m + 3 - 1) % 12) + 1
    const regularDate = `${regularYear}-${String(regularMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    list.push({
      id: id++,
      employeeId: e.id,
      employeeName: e.nameZh,
      employeeCode: e.employeeNo,
      departmentId: e.orgId,
      departmentName: e.orgName,
      positionId: e.positionId || 0,
      positionName: e.positionName,
      entryDate,
      probationMonths: 3,
      regularDate,
      status: 'trial',
      remark: '入职办理时自动创建',
      createTime: `${entryDate} 09:00:00`,
      updateTime: `${entryDate} 09:00:00`
    })
  })

  // 2. 1 条延长试用期（从 regular 员工里挑 1 个模拟）
  const extendedCandidate = EMPLOYEES.filter((e) => e.status === 'regular')[0]
  if (extendedCandidate) {
    list.push({
      id: id++,
      employeeId: extendedCandidate.id,
      employeeName: extendedCandidate.nameZh,
      employeeCode: extendedCandidate.employeeNo,
      departmentId: extendedCandidate.orgId,
      departmentName: extendedCandidate.orgName,
      positionId: extendedCandidate.positionId || 0,
      positionName: extendedCandidate.positionName,
      entryDate: '2025-10-15',
      probationMonths: 3,
      regularDate: '2026-01-15',
      status: 'extended',
      evaluationScore: 68,
      evaluationComment: '业务能力达标但协作配合度待提升，延长试用期 2 个月观察',
      evaluatorName: '部门经理',
      evaluationTime: '2026-01-10 15:00:00',
      extensionMonths: 2,
      extensionReason: '需进一步观察跨部门协作表现',
      remark: '延长至 2026-03-15',
      createTime: '2025-10-15 09:00:00',
      updateTime: '2026-01-10 15:00:00'
    })
  }

  // 3. 2 条已转正历史（从 regular 员工里挑）
  EMPLOYEES.filter((e) => e.status === 'regular')
    .slice(1, 3)
    .forEach((e, i) => {
      list.push({
        id: id++,
        employeeId: e.id,
        employeeName: e.nameZh,
        employeeCode: e.employeeNo,
        departmentId: e.orgId,
        departmentName: e.orgName,
        positionId: e.positionId || 0,
        positionName: e.positionName,
        entryDate: '2025-06-01',
        probationMonths: 3,
        regularDate: '2025-09-01',
        status: 'passed',
        evaluationScore: [90, 85][i],
        evaluationComment: ['工作认真负责，业务能力强，同意转正', '表现优秀，同意转正'][i],
        evaluatorName: '部门经理',
        evaluationTime: '2025-08-28 14:00:00',
        remark: '',
        createTime: '2025-06-01 09:00:00',
        updateTime: '2025-08-28 14:00:00'
      })
    })

  // 4. 1 条试用未通过历史（从 terminated 员工里挑 1 个）
  const failedCandidate = EMPLOYEES.filter((e) => e.status === 'terminated')[0]
  if (failedCandidate) {
    list.push({
      id: id++,
      employeeId: failedCandidate.id,
      employeeName: failedCandidate.nameZh,
      employeeCode: failedCandidate.employeeNo,
      departmentId: failedCandidate.orgId,
      departmentName: failedCandidate.orgName,
      positionId: failedCandidate.positionId || 0,
      positionName: failedCandidate.positionName,
      entryDate: '2025-08-01',
      probationMonths: 3,
      regularDate: '2025-11-01',
      status: 'failed',
      evaluationScore: 45,
      evaluationComment: '未达到岗位基本要求',
      evaluatorName: '部门经理',
      evaluationTime: '2025-10-25 16:00:00',
      failureReason: '核心技能未达标，无法胜任岗位',
      remark: '已触发离职流程',
      createTime: '2025-08-01 09:00:00',
      updateTime: '2025-10-25 16:00:00'
    })
  }

  return list
}

// 数据存储
let probations: Probation[] = buildInitialProbations()

/** 新增一条试用期记录（由入职流程自动调用，非用户手动操作） */
export function addProbationFromOnboarding(emp: {
  employeeId: number
  employeeName: string
  employeeCode: string
  departmentId: number
  departmentName: string
  positionId: number
  positionName: string
  entryDate: string
  probationMonths: number
}) {
  const [y, m, d] = emp.entryDate.split('-').map(Number)
  const regularYear = m + emp.probationMonths > 12 ? y + 1 : y
  const regularMonth = ((m + emp.probationMonths - 1) % 12) + 1
  const regularDate = `${regularYear}-${String(regularMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const newId = Math.max(...probations.map((p) => p.id), 0) + 1
  const record: Probation = {
    id: newId,
    ...emp,
    regularDate,
    status: 'trial',
    remark: '入职办理完成自动创建',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  probations.push(record)
  return record
}

/** 分页列表 */
export function getProbationListMock(params: ProbationListParams) {
  const {
    employeeName,
    employeeCode,
    departmentId,
    status,
    regularDateStart,
    regularDateEnd,
    page = 1,
    pageSize = 20
  } = params
  let list = probations.slice()
  if (employeeName) list = list.filter((p) => p.employeeName.includes(employeeName))
  if (employeeCode) list = list.filter((p) => p.employeeCode.includes(employeeCode))
  if (departmentId) list = list.filter((p) => p.departmentId === Number(departmentId))
  if (status) list = list.filter((p) => p.status === status)
  if (regularDateStart) list = list.filter((p) => p.regularDate >= regularDateStart)
  if (regularDateEnd) list = list.filter((p) => p.regularDate <= regularDateEnd)
  const total = list.length
  const start = (Number(page) - 1) * Number(pageSize)
  return {
    list: list.slice(start, start + Number(pageSize)),
    total
  }
}

export function getProbationDetailMock(id: number): Probation | null {
  return probations.find((p) => p.id === id) || null
}

/** 转正评估：根据结果扭转状态 */
export function evaluateProbationMock(
  id: number,
  data: {
    evaluationScore: number
    evaluationComment: string
    result: 'passed' | 'extended' | 'failed'
    extensionMonths?: number
    extensionReason?: string
    failureReason?: string
  }
): Probation {
  const record = probations.find((p) => p.id === id)
  if (!record) throw new Error('试用期记录不存在')
  record.evaluationScore = data.evaluationScore
  record.evaluationComment = data.evaluationComment
  record.evaluationTime = new Date().toLocaleString('zh-CN')
  record.evaluatorName = record.evaluatorName || 'HR'
  record.status = data.result
  if (data.result === 'extended') {
    record.extensionMonths = data.extensionMonths
    record.extensionReason = data.extensionReason
  }
  if (data.result === 'failed') {
    record.failureReason = data.failureReason
  }
  record.updateTime = new Date().toLocaleString('zh-CN')
  return record
}

/** 延长试用期 */
export function extendProbationMock(id: number, months: number, reason: string): Probation {
  const record = probations.find((p) => p.id === id)
  if (!record) throw new Error('试用期记录不存在')
  record.status = 'extended'
  record.extensionMonths = months
  record.extensionReason = reason
  record.updateTime = new Date().toLocaleString('zh-CN')
  return record
}

/** 编辑（仅 trial/extended 允许修改） */
export function updateProbationMock(id: number, data: Partial<Probation>): Probation {
  const record = probations.find((p) => p.id === id)
  if (!record) throw new Error('试用期记录不存在')
  if (record.status !== 'trial' && record.status !== 'extended') {
    throw new Error('已转正或试用未通过的记录不可编辑')
  }
  Object.assign(record, data, { updateTime: new Date().toLocaleString('zh-CN') })
  return record
}
