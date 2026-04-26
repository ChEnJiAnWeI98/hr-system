import request from '@/utils/http'
import type {
  CertificateReminder,
  CertificateReminderListParams,
  CertificateUpdateForm,
  BatchReminderParams,
  CertificateStatistics,
  CertificateUpdateRecord
} from '@/types/certificate'
import {
  getCertificateReminderListMock,
  getCertificateReminderDetailMock,
  updateReminderStatusMock,
  batchRemindMock,
  getCertificateStatisticsMock,
  updateCertificateMock,
  getCertificateUpdateRecordListMock
} from '@/mock/certificate'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取证件到期提醒列表
 */
export function getCertificateReminderList(params: CertificateReminderListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getCertificateReminderListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: CertificateReminder[]
    total: number
  }>({
    url: '/admin/certificate/reminder/list',
    params
  })
}

/**
 * 获取证件到期提醒详情
 */
export function getCertificateReminderDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getCertificateReminderDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '数据不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<CertificateReminder>({
    url: `/admin/certificate/reminder/${id}`
  })
}

/**
 * 更新证件到期提醒状态
 */
export function updateCertificateReminderStatus(id: number, status: number, remark?: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateReminderStatusMock(id, status, remark)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/certificate/reminder/status',
    data: { id, status, remark }
  })
}

/**
 * 批量提醒
 */
export function batchRemind(params: BatchReminderParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = batchRemindMock(params.ids, params.reminderMethod)
        resolve({
          code: 200,
          message: '提醒成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/certificate/reminder/batch',
    data: params
  })
}

/**
 * 获取证件统计数据
 */
export function getCertificateStatistics() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getCertificateStatisticsMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<CertificateStatistics>({
    url: '/admin/certificate/statistics'
  })
}

/**
 * 更新证件信息
 */
export function updateCertificate(data: CertificateUpdateForm) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateCertificateMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/certificate/update',
    data
  })
}

/**
 * 获取证件更新记录
 */
export function getCertificateUpdateRecords(employeeId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getCertificateUpdateRecordListMock(employeeId)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<CertificateUpdateRecord[]>({
    url: '/admin/certificate/update/records',
    params: { employeeId }
  })
}
