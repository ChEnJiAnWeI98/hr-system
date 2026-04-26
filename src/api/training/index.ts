/**
 * 培训与发展 API 汇总（Phase 4.8~4.11）
 *
 * 对应模块：
 * - 课程管理（course）
 * - 培训计划（plan）
 * - 培训记录（record）
 * - 证书管理（certificate）
 * - 能力评估（assessment，Phase 4.10）
 * - 继任计划（keyPosition + successionCandidate，Phase 4.11）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import { courseMock } from '@/mock/training/course'
import { planMock } from '@/mock/training/plan'
import {
  getRecordList,
  getRecordsByPlan,
  getRecordsByEmployee,
  getEmployeeTrainingSummary,
  rebuildRecords
} from '@/mock/training/record'
import { certificateMock, getCertsByEmployee } from '@/mock/training/certificate'
import {
  assessmentMock,
  getAssessmentsByEmployee,
  getDefaultItemsFor
} from '@/mock/training/assessment'
import {
  keyPositionMock,
  successionCandidateMock,
  getCandidatesByPosition,
  getHighPotentialFromNineBox
} from '@/mock/training/succession'
import type {
  Course,
  TrainingPlan,
  Certificate,
  CompetencyAssessment,
  KeyPosition,
  SuccessionCandidate
} from '@/types/training'

// ==========================================================================
// 课程管理
// ==========================================================================
const courseCrud = createCrudApi<Course>({
  baseUrl: '/admin/training/course',
  mockFns: courseMock
})
export const getCourseList = courseCrud.getList
export const addCourse = courseCrud.add
export const updateCourse = courseCrud.update
export const deleteCourse = courseCrud.delete
export const batchDeleteCourse = courseCrud.batchDelete

// ==========================================================================
// 培训计划
// ==========================================================================
const planCrud = createCrudApi<TrainingPlan>({
  baseUrl: '/admin/training/plan',
  mockFns: planMock
})
export const getTrainingPlanList = planCrud.getList
export const addTrainingPlan = planCrud.add
export const updateTrainingPlan = planCrud.update
export const deleteTrainingPlan = planCrud.delete
export const batchDeleteTrainingPlan = planCrud.batchDelete
export const getTrainingPlanDetail = planCrud.getDetail

// ==========================================================================
// 证书管理
// ==========================================================================
const certCrud = createCrudApi<Certificate>({
  baseUrl: '/admin/training/certificate',
  mockFns: certificateMock
})
export const getCertificateList = certCrud.getList
export const addCertificate = certCrud.add
export const updateCertificate = certCrud.update
export const deleteCertificate = certCrud.delete
export const batchDeleteCertificate = certCrud.batchDelete

// ==========================================================================
// 培训记录（按需查询，无 CRUD 新增）
// ==========================================================================
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockPromise = <T>(fn: () => T, msg = '成功', delay = 300) =>
  new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, data: fn(), message: msg })
      } catch (e: any) {
        reject({ code: 500, message: e.message })
      }
    }, delay)
  })

/** 获取培训记录列表（支持筛选 + 分页） */
export function getTrainingRecordList(params: any) {
  if (USE_MOCK) return mockPromise(() => getRecordList(params))
  return Promise.resolve({ code: 200, data: { list: [], total: 0 } })
}

/** 获取某计划下的所有培训记录（用于计划详情 Drawer） */
export function getTrainingRecordsByPlanApi(planId: number) {
  if (USE_MOCK) return mockPromise(() => getRecordsByPlan(planId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 获取某员工的培训记录（用于员工档案 Tab 6 培训） */
export function getEmployeeTrainingRecordsApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getRecordsByEmployee(employeeId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 获取某员工的培训汇总 */
export function getEmployeeTrainingSummaryApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getEmployeeTrainingSummary(employeeId))
  return Promise.resolve({ code: 200, data: null })
}

/** 获取某员工的证书 */
export function getEmployeeCertificatesApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getCertsByEmployee(employeeId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 触发记录缓存重建（计划变更后调用） */
export function rebuildTrainingRecords() {
  rebuildRecords()
}

// ==========================================================================
// 能力评估（Phase 4.10）
// ==========================================================================
const assessmentCrud = createCrudApi<CompetencyAssessment>({
  baseUrl: '/admin/training/assessment',
  mockFns: assessmentMock
})
export const getAssessmentList = assessmentCrud.getList
export const addAssessment = assessmentCrud.add
export const updateAssessment = assessmentCrud.update
export const deleteAssessment = assessmentCrud.delete
export const batchDeleteAssessment = assessmentCrud.batchDelete
export const getAssessmentDetail = assessmentCrud.getDetail

/** 获取某员工的历史评估（用于员工档案） */
export function getEmployeeAssessmentsApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getAssessmentsByEmployee(employeeId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 新增评估时：根据员工岗位族带出默认能力项 */
export function getDefaultAssessmentItemsApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getDefaultItemsFor(employeeId))
  return Promise.resolve({ code: 200, data: [] })
}

// ==========================================================================
// 继任计划（Phase 4.11）
// ==========================================================================
const keyPositionCrud = createCrudApi<KeyPosition>({
  baseUrl: '/admin/training/key-position',
  mockFns: keyPositionMock
})
export const getKeyPositionList = keyPositionCrud.getList
export const addKeyPosition = keyPositionCrud.add
export const updateKeyPosition = keyPositionCrud.update
export const deleteKeyPosition = keyPositionCrud.delete

const candidateCrud = createCrudApi<SuccessionCandidate>({
  baseUrl: '/admin/training/succession-candidate',
  mockFns: successionCandidateMock
})
export const getCandidateList = candidateCrud.getList
export const addCandidate = candidateCrud.add
export const updateCandidate = candidateCrud.update
export const deleteCandidate = candidateCrud.delete

/** 按关键岗位获取候选人（按准备度排序） */
export function getCandidatesByPositionApi(keyPositionId: number) {
  if (USE_MOCK) return mockPromise(() => getCandidatesByPosition(keyPositionId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 获取 9-box 高潜员工（用于"从 9-box 拉取候选人"功能） */
export function getHighPotentialFromNineBoxApi(keyPositionId: number) {
  if (USE_MOCK) return mockPromise(() => getHighPotentialFromNineBox(keyPositionId))
  return Promise.resolve({ code: 200, data: [] })
}
