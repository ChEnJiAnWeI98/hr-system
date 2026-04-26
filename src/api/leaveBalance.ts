import type {
  LeaveBalance,
  LeaveBalanceDetail,
  LeaveApplication,
  LeaveApplicationParams
} from '@/types/employeeSelfService'
import request from '@/utils/http'
import { leaveBalanceMock } from '@/mock/leaveBalance'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取假期余额列表
 */
export function getLeaveBalanceList() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = leaveBalanceMock.getList({})
        resolve({
          code: 200,
          message: '获取成功',
          data: data.list
        })
      }, 300)
    })
  }

  return request.get<LeaveBalance[]>({
    url: '/admin/employee-self-service/leave-balance/list'
  })
}

/**
 * 获取假期明细
 */
export function getLeaveBalanceDetail(leaveTypeId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // Mock 假期明细数据
        const details: LeaveBalanceDetail[] = [
          {
            id: 1,
            leaveTypeId,
            leaveTypeName: '年假',
            changeType: '发放',
            changeAmount: 10,
            balanceBefore: 0,
            balanceAfter: 10,
            reason: '2026年度年假发放',
            changeTime: '2026-01-01 00:00:00',
            relatedApplicationId: undefined
          },
          {
            id: 2,
            leaveTypeId,
            leaveTypeName: '年假',
            changeType: '使用',
            changeAmount: -3,
            balanceBefore: 10,
            balanceAfter: 7,
            reason: '请假申请',
            changeTime: '2026-03-15 10:00:00',
            relatedApplicationId: 101
          }
        ]
        resolve({
          code: 200,
          message: '获取成功',
          data: details
        })
      }, 300)
    })
  }

  return request.get<LeaveBalanceDetail[]>({
    url: `/admin/employee-self-service/leave-balance/detail/${leaveTypeId}`
  })
}

/**
 * 提交请假申请
 */
export function submitLeaveApplication(data: LeaveApplicationParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const newApplication: LeaveApplication = {
          id: Date.now(),
          employeeId: 1001,
          employeeName: '张三',
          employeeNo: 'EMP001',
          leaveTypeId: data.leaveTypeId,
          leaveTypeName: '年假',
          startTime: data.startTime,
          endTime: data.endTime,
          leaveDays: 3,
          reason: data.reason,
          attachments: data.attachments,
          status: 0,
          approvalProgress: '待审批',
          createTime: new Date().toLocaleString('zh-CN'),
          updateTime: new Date().toLocaleString('zh-CN')
        }
        resolve({
          code: 200,
          message: '提交成功',
          data: newApplication
        })
      }, 300)
    })
  }

  return request.post<LeaveApplication>({
    url: '/admin/employee-self-service/leave-balance/apply',
    data
  })
}

/**
 * 获取请假记录
 */
export function getLeaveApplicationList(params: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // Mock 请假记录数据
        const list: LeaveApplication[] = [
          {
            id: 1,
            employeeId: 1001,
            employeeName: '张三',
            employeeNo: 'EMP001',
            leaveTypeId: 1,
            leaveTypeName: '年假',
            startTime: '2026-03-15 09:00:00',
            endTime: '2026-03-17 18:00:00',
            leaveDays: 3,
            reason: '家庭事务',
            attachments: [],
            status: 2,
            approvalProgress: '已通过',
            createTime: '2026-03-10 10:00:00',
            updateTime: '2026-03-11 14:00:00'
          },
          {
            id: 2,
            employeeId: 1001,
            employeeName: '张三',
            employeeNo: 'EMP001',
            leaveTypeId: 2,
            leaveTypeName: '病假',
            startTime: '2026-02-20 09:00:00',
            endTime: '2026-02-21 18:00:00',
            leaveDays: 2,
            reason: '感冒发烧',
            attachments: ['病假条.jpg'],
            status: 2,
            approvalProgress: '已通过',
            createTime: '2026-02-19 16:00:00',
            updateTime: '2026-02-20 09:30:00'
          }
        ]

        const { page = 1, pageSize = 20 } = params
        const start = (page - 1) * pageSize
        const end = start + Number(pageSize)

        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: list.slice(start, end),
            total: list.length
          }
        })
      }, 300)
    })
  }

  return request.get<{ list: LeaveApplication[]; total: number }>({
    url: '/admin/employee-self-service/leave-balance/applications',
    params
  })
}
