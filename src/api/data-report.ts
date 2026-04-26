/**
 * 数据报表与分析 API
 */

import request from '@/utils/http'
import type {
  DashboardParams,
  DashboardData
} from '@/types/dataReport'
import type {
  PersonnelAnalysisParams,
  PersonnelAnalysisData,
  SalaryAnalysisParams,
  SalaryAnalysisData,
  RecruitmentFunnelParams,
  RecruitmentFunnelData,
  AttendanceReportParams,
  AttendanceReportData,
  ExportReportParams
} from '@/types/data-report'
import {
  getDashboardDataMock,
  getPersonnelAnalysisMock,
  getSalaryAnalysisMock,
  getRecruitmentFunnelMock,
  getAttendanceReportMock
} from '@/mock/data-report'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取HR驾驶舱数据
 */
export function getDashboardData(params?: DashboardParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getDashboardDataMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<DashboardData>({
    url: '/admin/data-report/dashboard',
    params
  })
}

/**
 * 获取人员分析数据
 */
export function getPersonnelAnalysis(params: PersonnelAnalysisParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getPersonnelAnalysisMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<PersonnelAnalysisData>({
    url: '/admin/data-report/personnel-analysis',
    params
  })
}

/**
 * 获取薪酬分析数据
 */
export function getSalaryAnalysis(params: SalaryAnalysisParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getSalaryAnalysisMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<SalaryAnalysisData>({
    url: '/admin/data-report/salary-analysis',
    params
  })
}

/**
 * 获取招聘漏斗数据
 */
export function getRecruitmentFunnel(params: RecruitmentFunnelParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getRecruitmentFunnelMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<RecruitmentFunnelData>({
    url: '/admin/data-report/recruitment-funnel',
    params
  })
}

/**
 * 获取考勤报表数据
 */
export function getAttendanceReport(params: AttendanceReportParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getAttendanceReportMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<AttendanceReportData>({
    url: '/admin/data-report/attendance-report',
    params
  })
}

/**
 * 导出报表
 */
export function exportReport(params: ExportReportParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // Mock 返回一个空的 Blob
        const blob = new Blob(['Mock Report Data'], { type: 'application/octet-stream' })
        resolve(blob)
      }, 300)
    })
  }

  return request.post({
    url: '/admin/data-report/export',
    data: params,
    responseType: 'blob'
  })
}
