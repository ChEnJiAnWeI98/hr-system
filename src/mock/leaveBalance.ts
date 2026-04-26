// @ts-nocheck
import type { LeaveBalance } from '@/types/employeeSelfService'
import { createCrudMock } from '@/utils/crud'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'

// 初始数据 - 假期余额（年假、病假、事假、调休、婚假）
const initialData: LeaveBalance[] = [
  {
    id: 1,
    employeeId: 1001,
    employeeName: '张三',
    department: '技术部',
    leaveType: 1,
    leaveTypeName: '年假',
    totalDays: 10,
    usedDays: 3,
    remainingDays: 7,
    year: 2026,
    expiryDate: '2026-12-31',
    status: 1,
    remark: '2026年度年假',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-04-01 10:00:00'
  },
  {
    id: 2,
    employeeId: 1001,
    employeeName: '张三',
    department: '技术部',
    leaveType: 2,
    leaveTypeName: '病假',
    totalDays: 30,
    usedDays: 2,
    remainingDays: 28,
    year: 2026,
    expiryDate: '2026-12-31',
    status: 1,
    remark: '2026年度病假',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-03-15 14:30:00'
  },
  {
    id: 3,
    employeeId: 1001,
    employeeName: '张三',
    department: '技术部',
    leaveType: 3,
    leaveTypeName: '事假',
    totalDays: 0,
    usedDays: 1,
    remainingDays: 0,
    year: 2026,
    expiryDate: '2026-12-31',
    status: 1,
    remark: '事假无限制，已使用1天',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-02-20 09:00:00'
  },
  {
    id: 4,
    employeeId: 1001,
    employeeName: '张三',
    department: '技术部',
    leaveType: 4,
    leaveTypeName: '调休',
    totalDays: 5,
    usedDays: 1.5,
    remainingDays: 3.5,
    year: 2026,
    expiryDate: '2026-06-30',
    status: 1,
    remark: '加班调休累计',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-03-25 16:00:00'
  },
  {
    id: 5,
    employeeId: 1001,
    employeeName: '张三',
    department: '技术部',
    leaveType: 5,
    leaveTypeName: '婚假',
    totalDays: 10,
    usedDays: 0,
    remainingDays: 10,
    year: 2026,
    expiryDate: '2027-12-31',
    status: 1,
    remark: '婚假有效期2年',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  }
]

// 创建 CRUD Mock
export const leaveBalanceMock = createCrudMock<LeaveBalance>(alignEmployeeFields(initialData), {
  searchFields: ['employeeName', 'leaveTypeName']
})
