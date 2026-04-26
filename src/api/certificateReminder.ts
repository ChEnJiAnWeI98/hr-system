import request from '@/utils/http'
import type { CertificateReminder, CertificateReminderListParams } from '@/types/certificateReminder'
import { certificateReminderMock } from '@/mock/certificateReminder'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取证件到期提醒列表
 */
export function getCertificateReminderList(params: CertificateReminderListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = certificateReminderMock.getList(params)
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
    url: '/employee/certificate-reminder/list',
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
        const data = certificateReminderMock.getDetail(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '证件提醒记录不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<CertificateReminder>({
    url: `/employee/certificate-reminder/${id}`
  })
}

/**
 * 新增证件到期提醒
 */
export function addCertificateReminder(data: Partial<CertificateReminder>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = certificateReminderMock.add(data)
        resolve({
          code: 200,
          message: '新增成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/employee/certificate-reminder/add',
    data
  })
}

/**
 * 更新证件到期提醒
 */
export function updateCertificateReminder(data: Partial<CertificateReminder> & { id: number }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = certificateReminderMock.update(data)
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
    url: '/employee/certificate-reminder/update',
    data
  })
}

/**
 * 删除证件到期提醒
 */
export function deleteCertificateReminder(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          certificateReminderMock.delete(id)
          resolve({
            code: 200,
            message: '删除成功'
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

  return request.del({
    url: `/employee/certificate-reminder/${id}`
  })
}

/**
 * 发送提醒
 */
export function sendReminder(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = certificateReminderMock.getDetail(id)
          if (data) {
            // 更新提醒状态和次数
            certificateReminderMock.update({
              id,
              reminderStatus: 2,
              reminderStatusName: '已提醒',
              reminderCount: data.reminderCount + 1,
              lastReminderTime: new Date().toLocaleString('zh-CN')
            })
            resolve({
              code: 200,
              message: '提醒发送成功'
            })
          } else {
            reject({
              code: 404,
              message: '证件提醒记录不存在'
            })
          }
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: `/employee/certificate-reminder/${id}/send`
  })
}
