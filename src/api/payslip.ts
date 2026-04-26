import type { Payslip, PayslipListParams } from '@/types/employeeSelfService'
import { createCrudApi } from '@/utils/crud'
import { payslipMock } from '@/mock/payslip'
import request from '@/utils/http'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 工资条 API
 */
export const payslipApi = createCrudApi({
  baseUrl: '/admin/employee-self-service/payslip',
  mockFns: payslipMock
})

/**
 * 获取工资条列表
 */
export const getPayslipList = payslipApi.getList

/**
 * 获取工资条详情
 */
export const getPayslipDetail = payslipApi.getDetail

/**
 * 下载工资条
 */
export function downloadPayslip(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '下载成功',
          data: {
            url: `https://example.com/payslip/${id}.pdf`,
            filename: `工资条_${id}.pdf`
          }
        })
      }, 300)
    })
  }

  return request.get<{ url: string; filename: string }>({
    url: `/admin/employee-self-service/payslip/download/${id}`
  })
}

/**
 * 批量导出工资条
 */
export function exportPayslips(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功',
          data: {
            url: 'https://example.com/payslips.zip',
            filename: `工资条_${ids.length}条.zip`
          }
        })
      }, 300)
    })
  }

  return request.post<{ url: string; filename: string }>({
    url: '/admin/employee-self-service/payslip/export',
    data: { ids }
  })
}
