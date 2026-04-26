/**
 * 薪酬福利 API 汇总（Phase 4.1~4.7）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import { salaryBandMock } from '@/mock/comp/structure'
import {
  payrollBatchMock,
  getBatchRecordsMock,
  getPayslipsByEmployee,
  executeBatchMock,
  approveBatchMock,
  releaseBatchMock
} from '@/mock/comp/payroll'
import type { SalaryBand } from '@/types/comp/structure'
import type { PayrollBatch } from '@/types/comp/payroll'

// 薪酬带宽
const bandCrud = createCrudApi<SalaryBand>({
  baseUrl: '/admin/comp/salary-band',
  mockFns: salaryBandMock
})
export const getSalaryBandList = bandCrud.getList
export const addSalaryBand = bandCrud.add
export const updateSalaryBand = bandCrud.update
export const deleteSalaryBand = bandCrud.delete

// 核算批次
const batchCrud = createCrudApi<PayrollBatch>({
  baseUrl: '/admin/comp/payroll-batch',
  mockFns: payrollBatchMock
})
export const getPayrollBatchList = batchCrud.getList
export const addPayrollBatch = batchCrud.add
export const getPayrollBatchDetail = batchCrud.getDetail
export const deletePayrollBatch = batchCrud.delete

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

/** 获取批次下所有核算记录 */
export function getBatchRecordsApi(batchId: number) {
  if (USE_MOCK) return mockPromise(() => getBatchRecordsMock(batchId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 获取员工的工资条历史 */
export function getEmployeePayslipsApi(employeeId: number) {
  if (USE_MOCK) return mockPromise(() => getPayslipsByEmployee(employeeId))
  return Promise.resolve({ code: 200, data: [] })
}

/** 执行核算 */
export function executePayrollApi(batchId: number) {
  if (USE_MOCK) return mockPromise(() => executeBatchMock(batchId), '核算完成')
  return Promise.resolve({ code: 200, data: null })
}

/** 审批核算 */
export function approvePayrollApi(
  batchId: number,
  stage: 'hrbp' | 'hrd',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number
) {
  if (USE_MOCK)
    return mockPromise(() => approveBatchMock(batchId, stage, action, approverName, approverId), '审批成功')
  return Promise.resolve({ code: 200, data: null })
}

/** 发放 */
export function releasePayrollApi(batchId: number) {
  if (USE_MOCK) return mockPromise(() => releaseBatchMock(batchId), '已发放')
  return Promise.resolve({ code: 200, data: null })
}
