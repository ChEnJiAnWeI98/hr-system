/**
 * 培训记录 Mock 数据（Phase 4.9）
 *
 * 基于 plan.ts 里的 enrolledEmployees 自动生成记录
 * 出勤 / 成绩 / 结业状态按确定性种子计算，保证多次访问结果一致
 */
import type { TrainingRecord, TrainingPlan } from '@/types/training'
import { EMPLOYEES } from '@/mock/core/employeePool'
import { getAllPlans, getPlanById } from './plan'
import { getCourseById } from './course'

/** 确定性 hash（避免随机数据） */
function hash(a: number, b: number): number {
  return (a * 9301 + b * 49297 + 11) % 100
}

/** 基于员工 ID + 计划 ID 生成确定性的考核数据 */
function genRecordFor(plan: TrainingPlan, employeeId: number, idCounter: number): TrainingRecord {
  const emp = EMPLOYEES.find((e) => e.id === employeeId)
  const course = getCourseById(plan.courseId)
  const h = hash(employeeId, plan.id)
  const h2 = hash(plan.id, employeeId)

  const isCompleted = plan.status === 'completed'
  const isInProgress = plan.status === 'in_progress'

  /** 出勤率：90% */
  const attended = h < 90

  /** 成绩：出勤才有分数；否则 0 */
  let score: number | undefined = undefined
  if (attended && (isCompleted || isInProgress)) {
    // 60 ~ 98 分
    score = 60 + (h2 % 39)
  }

  let completionStatus: TrainingRecord['completionStatus'] = 'pending'
  let completionTime: string | undefined
  if (isCompleted) {
    if (!attended) {
      completionStatus = 'failed'
    } else if (score !== undefined && score >= 75) {
      completionStatus = 'passed'
      completionTime = plan.endDate + ' 17:30:00'
    } else {
      completionStatus = 'failed'
    }
  }

  const feedback = attended && isCompleted ? 3 + (h2 % 3) : undefined // 3~5 星
  const actualDuration = attended ? course?.duration || 0 : 0

  return {
    id: idCounter,
    planId: plan.id,
    planName: plan.planName,
    courseId: plan.courseId,
    courseName: plan.courseName,
    courseCategory: course?.category || 'general',
    employeeId,
    employeeName: emp?.nameZh || '',
    orgName: emp?.orgName || '',
    enrollTime: plan.createTime,
    attended,
    score,
    completionStatus,
    completionTime,
    actualDuration,
    feedback,
    remark: completionStatus === 'failed' && !attended ? '请假未出勤' : undefined,
    createTime: plan.createTime
  }
}

/** 全量生成所有计划的记录 */
function buildAllRecords(): TrainingRecord[] {
  const all: TrainingRecord[] = []
  let counter = 1
  for (const plan of getAllPlans()) {
    for (const empId of plan.enrolledEmployees) {
      all.push(genRecordFor(plan, empId, counter++))
    }
  }
  return all
}

let _cache: TrainingRecord[] | null = null
function ensure(): TrainingRecord[] {
  if (!_cache) _cache = buildAllRecords()
  return _cache
}

/** 重建缓存（计划变更时调用） */
export function rebuildRecords(): void {
  _cache = buildAllRecords()
}

/** 列表（支持筛选 + 分页） */
export function getRecordList(params: any = {}) {
  const {
    page = 1,
    pageSize = 20,
    planId,
    employeeId,
    employeeName,
    completionStatus,
    courseCategory,
    attended
  } = params || {}
  let list = ensure().slice()

  if (planId) list = list.filter((r) => r.planId === Number(planId))
  if (employeeId) list = list.filter((r) => r.employeeId === Number(employeeId))
  if (employeeName) list = list.filter((r) => r.employeeName.includes(employeeName))
  if (completionStatus) list = list.filter((r) => r.completionStatus === completionStatus)
  if (courseCategory) list = list.filter((r) => r.courseCategory === courseCategory)
  if (attended !== undefined && attended !== null && attended !== '') {
    const v = String(attended) === 'true'
    list = list.filter((r) => r.attended === v)
  }

  // 按 createTime 倒序 + 员工 ID 升序
  list.sort((a, b) => {
    if (b.createTime === a.createTime) return a.employeeId - b.employeeId
    return b.createTime.localeCompare(a.createTime)
  })

  const total = list.length
  const start = (Number(page) - 1) * Number(pageSize)
  const end = start + Number(pageSize)
  return { list: list.slice(start, end), total }
}

/** 按计划获取记录（用于 Drawer 明细） */
export function getRecordsByPlan(planId: number): TrainingRecord[] {
  return ensure().filter((r) => r.planId === planId)
}

/** 按员工获取记录（用于员工档案 Tab 6 培训） */
export function getRecordsByEmployee(employeeId: number): TrainingRecord[] {
  return ensure().filter((r) => r.employeeId === employeeId)
}

/** 统计：某员工的培训汇总 */
export function getEmployeeTrainingSummary(employeeId: number) {
  const records = getRecordsByEmployee(employeeId)
  const totalHours = records.reduce((s, r) => s + (r.actualDuration || 0), 0)
  const passedCount = records.filter((r) => r.completionStatus === 'passed').length
  const failedCount = records.filter((r) => r.completionStatus === 'failed').length
  const pendingCount = records.filter((r) => r.completionStatus === 'pending').length
  return {
    total: records.length,
    totalHours,
    passedCount,
    failedCount,
    pendingCount,
    records
  }
}
