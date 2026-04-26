import request from '@/utils/http'
import type {
  EmployeeProfile,
  Payslip,
  PayslipQueryParams,
  LeaveType,
  LeaveDetail,
  LeaveApplication,
  Application,
  ApplicationQueryParams,
  CreateApplication,
  TodoTask,
  TodoTaskQueryParams,
  ProcessTodoTask
} from '@/types/employee-self-service'
import {
  getProfileMock,
  updateProfileMock,
  uploadAvatarMock,
  getPayslipListMock,
  getLeaveBalanceListMock,
  getLeaveDetailMock,
  applyLeaveMock,
  getApplicationListMock,
  createApplicationMock,
  cancelApplicationMock,
  getTodoTaskListMock,
  processTodoTaskMock,
  markAsReadMock
} from '@/mock/employee-self-service'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取个人信息
 */
export function getProfile() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getProfileMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<EmployeeProfile>({
    url: '/employee/profile'
  })
}

/**
 * 更新个人信息
 */
export function updateProfile(data: Partial<EmployeeProfile>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = updateProfileMock(data)
        resolve({
          code: 200,
          message: '更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/employee/profile',
    data
  })
}

/**
 * 上传头像
 */
export function uploadAvatar(avatar: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = uploadAvatarMock(avatar)
        resolve({
          code: 200,
          message: '上传成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/employee/avatar',
    data: { avatar }
  })
}

/**
 * 获取工资条列表
 */
export function getPayslipList(params: PayslipQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getPayslipListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Payslip[]
    total: number
  }>({
    url: '/employee/payslip/list',
    params
  })
}

/**
 * 获取假期余额列表
 */
export function getLeaveBalanceList() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getLeaveBalanceListMock()
        resolve({
          code: 200,
          message: 'success',
          data: result.list
        })
      }, 300)
    })
  }

  return request.get<LeaveType[]>({
    url: '/employee/leave/balance'
  })
}

/**
 * 获取假期明细列表
 */
export function getLeaveDetailList(leaveTypeId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = getLeaveDetailMock(leaveTypeId)
        resolve({
          code: 200,
          message: 'success',
          data: result.list
        })
      }, 300)
    })
  }

  return request.get<LeaveDetail[]>({
    url: `/employee/leave/detail/${leaveTypeId}`
  })
}

/**
 * 申请请假
 */
export function applyLeave(data: LeaveApplication) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = applyLeaveMock(data)
        resolve({
          code: 200,
          message: '申请成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/employee/leave/apply',
    data
  })
}

/**
 * 获取申请列表
 */
export function getApplicationList(params: ApplicationQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getApplicationListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Application[]
    total: number
  }>({
    url: '/employee/application/list',
    params
  })
}

/**
 * 创建申请
 */
export function createApplication(data: CreateApplication) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = createApplicationMock(data)
        resolve({
          code: 200,
          message: '创建成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/employee/application/create',
    data
  })
}

/**
 * 撤回申请
 */
export function cancelApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          cancelApplicationMock(id)
          resolve({
            code: 200,
            message: '撤回成功'
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: `/employee/application/cancel/${id}`
  })
}

/**
 * 获取待办任务列表
 */
export function getTodoTaskList(params: TodoTaskQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTodoTaskListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: TodoTask[]
    total: number
  }>({
    url: '/employee/todo/list',
    params
  })
}

/**
 * 处理待办任务
 */
export function processTodoTask(data: ProcessTodoTask) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          processTodoTaskMock(data)
          resolve({
            code: 200,
            message: '处理成功'
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/employee/todo/process',
    data
  })
}

/**
 * 标记待办任务已读
 */
export function markTodoTaskRead(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          markAsReadMock(id)
          resolve({
            code: 200,
            message: '标记成功'
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: `/employee/todo/read/${id}`
  })
}
