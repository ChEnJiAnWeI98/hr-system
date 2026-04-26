import request from '@/utils/http'
import type { SalaryAdjustment, SalaryAdjustmentListParams, SalaryRecord, SalaryRecordListParams } from '@/types/salary'
import {
  getSalaryAdjustmentListMock,
  getSalaryAdjustmentDetailMock,
  addSalaryAdjustmentMock,
  updateSalaryAdjustmentMock,
  deleteSalaryAdjustmentMock,
  batchDeleteSalaryAdjustmentsMock,
  approveSalaryAdjustmentMock,
  getSalaryRecordListMock,
  getSalaryRecordDetailMock,
  sendPayslipMock,
  exportPayslipMock
} from '@/mock/salary'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取调薪申请列表
 */
export function getSalaryAdjustmentList(params: SalaryAdjustmentListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getSalaryAdjustmentListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: SalaryAdjustment[]
    total: number
  }>({
    url: '/admin/salary/adjustment/list',
    params
  })
}

/**
 * 获取调薪申请详情
 */
export function getSalaryAdjustmentDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getSalaryAdjustmentDetailMock(id)
          resolve({
            code: 200,
            message: 'success',
            data
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

  return request.get<SalaryAdjustment>({
    url: `/admin/salary/adjustment/detail/${id}`
  })
}

/**
 * 添加调薪申请
 */
export function addSalaryAdjustment(data: Partial<SalaryAdjustment>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addSalaryAdjustmentMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/salary/adjustment/add',
    data
  })
}

/**
 * 更新调薪申请
 */
export function updateSalaryAdjustment(data: Partial<SalaryAdjustment>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateSalaryAdjustmentMock(data)
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
    url: '/admin/salary/adjustment/update',
    data
  })
}

/**
 * 删除调薪申请
 */
export function deleteSalaryAdjustment(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteSalaryAdjustmentMock(id)
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
    url: `/admin/salary/adjustment/delete/${id}`
  })
}

/**
 * 批量删除调薪申请
 */
export function batchDeleteSalaryAdjustments(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteSalaryAdjustmentsMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/salary/adjustment/batch-delete',
    data: { ids }
  })
}

/**
 * 审批调薪申请
 */
export function approveSalaryAdjustment(id: number, data: { approvalResult: number; approvalComment?: string }) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveSalaryAdjustmentMock(id, data)
          resolve({
            code: 200,
            message: data.approvalResult === 1 ? '批准成功' : '已拒绝',
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
    url: `/admin/salary/adjustment/approve/${id}`,
    data
  })
}

/**
 * 获取工资记录列表
 */
export function getSalaryRecordList(params: SalaryRecordListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getSalaryRecordListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: SalaryRecord[]
    total: number
  }>({
    url: '/admin/salary/record/list',
    params
  })
}

/**
 * 获取工资记录详情
 */
export function getSalaryRecordDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getSalaryRecordDetailMock(id)
          resolve({
            code: 200,
            message: 'success',
            data
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

  return request.get<SalaryRecord>({
    url: `/admin/salary/record/detail/${id}`
  })
}

/**
 * 发放工资条
 */
export function sendPayslip(data: {
  salaryMonth: string
  sendMethod: string[]
  sendScope: string
  departmentIds?: number[]
  employeeIds?: number[]
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = sendPayslipMock(data)
        resolve({
          code: 200,
          message: '发放成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/salary/payslip/send',
    data
  })
}

/**
 * 导出工资条
 */
export function exportPayslip(params: SalaryRecordListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = exportPayslipMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/salary/payslip/export',
    params
  })
}
