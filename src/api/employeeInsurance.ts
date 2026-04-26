import type { EmployeeInsurance, EmployeeInsuranceListParams } from '@/types/socialSecurity'
import { createCrudApi } from '@/utils/crud'
import { employeeInsuranceMock } from '@/mock/employeeInsurance'

/**
 * 增减员管理 API
 */
export const employeeInsuranceApi = createCrudApi<EmployeeInsurance>({
  baseUrl: '/admin/social-security/employee-insurance',
  mockFns: employeeInsuranceMock
})

/**
 * 获取增减员列表
 */
export const getEmployeeInsuranceList = employeeInsuranceApi.getList

/**
 * 获取增减员详情
 */
export const getEmployeeInsuranceDetail = employeeInsuranceApi.getDetail

/**
 * 添加增减员
 */
export const addEmployeeInsurance = employeeInsuranceApi.add

/**
 * 更新增减员
 */
export const updateEmployeeInsurance = employeeInsuranceApi.update

/**
 * 删除增减员
 */
export const deleteEmployeeInsurance = employeeInsuranceApi.remove

/**
 * 批量删除增减员
 */
export const batchDeleteEmployeeInsurance = (ids: number[]) => {
  if (employeeInsuranceApi.remove) {
    return Promise.all(ids.map(id => employeeInsuranceApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}
