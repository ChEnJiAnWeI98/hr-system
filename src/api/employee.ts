/**
 * 员工档案管理 API
 */

import request from '@/utils/http'
import type { Employee, EmployeeListParams } from '@/types/employee'
import {
  getEmployeeListMock,
  addEmployeeMock,
  updateEmployeeMock,
  getEmployeeDetailMock,
  updateEmployeeStatusMock,
  deleteEmployeeMock,
  batchDeleteEmployeesMock
} from '@/mock/employee'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取员工列表
 */
export function getEmployeeList(params: EmployeeListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getEmployeeListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Employee[]
    total: number
  }>({
    url: '/admin/employee/list',
    params
  })
}

/**
 * 获取员工详情
 */
export function getEmployeeDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getEmployeeDetailMock(id)
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

  return request.get<Employee>({
    url: `/admin/employee/detail/${id}`
  })
}

/**
 * 添加员工
 */
export function addEmployee(data: Partial<Employee>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addEmployeeMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/employee/add',
    data
  })
}

/**
 * 更新员工
 */
export function updateEmployee(data: Partial<Employee>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateEmployeeMock(data)
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
    url: '/admin/employee/update',
    data
  })
}

/**
 * 删除员工
 */
export function deleteEmployee(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteEmployeeMock(id)
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
    url: `/admin/employee/delete/${id}`
  })
}

/**
 * 批量删除员工
 */
export function batchDeleteEmployees(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteEmployeesMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/employee/batch-delete',
    data: { ids }
  })
}

/**
 * 更新员工状态
 */
export function updateEmployeeStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateEmployeeStatusMock(id, status)
          resolve({
            code: 200,
            message: '状态更新成功',
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
    url: `/admin/employee/status/${id}`,
    data: { status }
  })
}
