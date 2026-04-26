/**
 * 培训计划 Mock 数据（Phase 4.9）
 *
 * 与 course.ts / record.ts 联动：
 * - planId 引用课程
 * - enrolledEmployees 列表驱动 record.ts 自动生成签到/考核数据
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { TrainingPlan } from '@/types/training'
import { EMPLOYEES } from '@/mock/core/employeePool'
import { getCourseById } from './course'

/** 从员工池按岗位族抽取 N 个员工 ID */
function pickByFamily(family: string, n: number, offset = 0): number[] {
  const pool = EMPLOYEES.filter(
    (e) => e.jobFamily === family && (e.status === 'regular' || e.status === 'probation')
  )
  return pool.slice(offset, offset + n).map((e) => e.id)
}

/** 全员抽样 */
function pickAll(n: number, offset = 0): number[] {
  const pool = EMPLOYEES.filter((e) => e.status === 'regular' || e.status === 'probation')
  return pool.slice(offset, offset + n).map((e) => e.id)
}

/** 按等级抽样（新晋管理者） */
function pickByLevel(levels: string[], n: number, offset = 0): number[] {
  const pool = EMPLOYEES.filter(
    (e) =>
      levels.includes(e.level) &&
      (e.status === 'regular' || e.status === 'probation')
  )
  return pool.slice(offset, offset + n).map((e) => e.id)
}

const onboarding = pickByLevel(['P1', 'P2', 'P3'], 15, 0)
const compliance = pickAll(50, 0) // 全员合规（示例 50 人）
const javaBackend = pickByFamily('TECH', 12, 0)
const feVue = pickByFamily('TECH', 10, 20)
const k8s = pickByFamily('TECH', 8, 40)
const productPm = pickByFamily('PROD', 10, 0)
const sales = pickByFamily('SALES', 8, 0)
const newManagers = pickByLevel(['M1'], 6, 0)
const midManagers = pickByLevel(['M2', 'M3'], 5, 0)
const commComm = pickAll(30, 50)

function planOf(
  id: number,
  planNo: string,
  planName: string,
  courseId: number,
  start: string,
  end: string,
  location: string,
  capacity: number,
  enrolled: number[],
  status: TrainingPlan['status'],
  organizerOffset = 0,
  targetFamilies?: string[]
): TrainingPlan {
  const course = getCourseById(courseId)
  const organizer = EMPLOYEES.filter((e) => e.jobFamily === 'FUNC')[organizerOffset] || EMPLOYEES[0]
  return {
    id,
    planNo,
    planName,
    courseId,
    courseName: course?.courseName || '',
    startDate: start,
    endDate: end,
    location,
    organizerName: organizer.nameZh,
    organizerId: organizer.id,
    instructorName: course?.instructorName || '',
    targetFamilies,
    enrolledEmployees: enrolled,
    capacity,
    enrolledCount: enrolled.length,
    status,
    description: `${course?.courseName || '培训'}（${start} ~ ${end}）`,
    createTime: `${start.slice(0, 7)}-01 09:00:00`,
    updateTime: `${start.slice(0, 7)}-01 09:00:00`
  }
}

const initialPlans: TrainingPlan[] = [
  planOf(
    1,
    'TP20260115001',
    '2026 年 1 月新员工入职培训',
    1,
    '2026-01-15',
    '2026-01-15',
    '总部 · A301 培训室',
    30,
    onboarding.slice(0, 15),
    'completed',
    0
  ),
  planOf(
    2,
    'TP20260301001',
    '2026 年度全员信息安全培训',
    2,
    '2026-03-01',
    '2026-03-15',
    '在线（e-learning）',
    300,
    compliance,
    'completed',
    1
  ),
  planOf(
    3,
    'TP20260315001',
    '后端 Java 工程化实战集训（春季）',
    3,
    '2026-03-15',
    '2026-03-22',
    '总部 · B201 实验室',
    20,
    javaBackend,
    'completed',
    2,
    ['TECH']
  ),
  planOf(
    4,
    'TP20260401001',
    '前端 Vue 3 + TS 进阶训练营',
    4,
    '2026-04-01',
    '2026-04-10',
    '在线（腾讯会议）',
    15,
    feVue,
    'in_progress',
    0,
    ['TECH']
  ),
  planOf(
    5,
    'TP20260410001',
    'K8s 云原生基础（4 月场）',
    5,
    '2026-04-10',
    '2026-04-18',
    '在线（腾讯会议）',
    15,
    k8s,
    'in_progress',
    1,
    ['TECH']
  ),
  planOf(
    6,
    'TP20260425001',
    '产品需求方法论实战（4 月）',
    6,
    '2026-04-25',
    '2026-04-26',
    '总部 · A401 会议室',
    15,
    productPm,
    'enrolling',
    2,
    ['PROD']
  ),
  planOf(
    7,
    'TP20260505001',
    '销售铁军·大客户谈判集训',
    7,
    '2026-05-05',
    '2026-05-10',
    '上海 · 外滩培训基地',
    15,
    sales,
    'enrolling',
    0,
    ['SALES']
  ),
  planOf(
    8,
    'TP20260515001',
    '新晋管理者第 1 期',
    8,
    '2026-05-15',
    '2026-05-22',
    '总部 · B301 大教室',
    10,
    newManagers,
    'published',
    1
  ),
  planOf(
    9,
    'TP20260601001',
    '中层管理者领导力工作坊（夏季）',
    9,
    '2026-06-01',
    '2026-06-05',
    '杭州 · 千岛湖培训中心',
    8,
    midManagers,
    'draft',
    2
  ),
  planOf(
    10,
    'TP20260420001',
    '职场沟通与高效协作（4 月场）',
    10,
    '2026-04-20',
    '2026-04-20',
    '在线（腾讯会议）',
    40,
    commComm,
    'in_progress',
    0
  )
]

export const planMock = createCrudMock<TrainingPlan>(initialPlans, {
  searchFields: ['planNo', 'planName', 'courseName', 'organizerName'],
  sortField: 'startDate'
})

export function getPlanById(id: number): TrainingPlan | undefined {
  return planMock.getData().find((p) => p.id === id)
}

export function getAllPlans(): TrainingPlan[] {
  return planMock.getData()
}
