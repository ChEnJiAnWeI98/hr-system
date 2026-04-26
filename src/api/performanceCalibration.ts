/**
 * 绩效校准 API（Phase A7 升级版）
 */
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud/apiHelper'
import type {
  PerformanceCalibration,
  CalibrationMeeting,
  CalibrationRecord
} from '@/types/performanceCalibration'
import {
  performanceCalibrationMock,
  calibrationMeetingMock,
  calibrationRecordMock,
  getDistributionSummaryMock,
  adjustGradeMock,
  advanceMeetingStatusMock
} from '@/mock/performanceCalibration'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function mockResolve<T>(fn: () => T, message = 'success'): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ code: 200, message, data: fn() })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, 300)
  })
}

export const performanceCalibrationApi = createCrudApi<PerformanceCalibration>({
  baseUrl: '/admin/performance/calibration',
  mockFns: performanceCalibrationMock
})

export const getPerformanceCalibrationList = performanceCalibrationApi.getList
export const getPerformanceCalibrationDetail = performanceCalibrationApi.getDetail
export const addPerformanceCalibration = performanceCalibrationApi.add
export const updatePerformanceCalibration = performanceCalibrationApi.update
export const deletePerformanceCalibration = performanceCalibrationApi.delete
export const batchDeletePerformanceCalibration = performanceCalibrationApi.batchDelete

/** 会议 CRUD */
export const calibrationMeetingApi = createCrudApi<CalibrationMeeting>({
  baseUrl: '/admin/performance/calibration/meeting',
  mockFns: calibrationMeetingMock
})

export const getCalibrationMeetings = calibrationMeetingApi.getList
export const addCalibrationMeeting = calibrationMeetingApi.add
export const updateCalibrationMeeting = calibrationMeetingApi.update
export const deleteCalibrationMeeting = calibrationMeetingApi.delete

/** 调档记录 CRUD */
export const calibrationRecordApi = createCrudApi<CalibrationRecord>({
  baseUrl: '/admin/performance/calibration/record',
  mockFns: calibrationRecordMock
})

export const getCalibrationRecords = calibrationRecordApi.getList

/** 获取分布汇总 */
export function getDistributionSummary(cycleId: number) {
  if (USE_MOCK) return mockResolve(() => getDistributionSummaryMock(cycleId))
  return request.get({
    url: '/admin/performance/calibration/distribution',
    params: { cycleId }
  })
}

/** 调档 */
export function adjustGrade(data: {
  evaluationId: number
  employeeName: string
  departmentName: string
  originalScore: number
  beforeGrade: string
  afterGrade: string
  reason: string
  meetingId?: number
  adjustedBy?: string
  adjustedById?: number
}) {
  if (USE_MOCK) return mockResolve(() => adjustGradeMock(data as any), '已调档')
  return request.post({ url: '/admin/performance/calibration/adjust', data })
}

/** 推进会议状态 */
export function advanceMeetingStatus(id: number) {
  if (USE_MOCK) return mockResolve(() => advanceMeetingStatusMock(id), '已推进')
  return request.post({ url: `/admin/performance/calibration/meeting/${id}/advance` })
}
