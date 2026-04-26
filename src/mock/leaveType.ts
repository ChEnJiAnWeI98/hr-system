/**
 * 假期类型配置 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { LeaveType } from '@/types/leave'

/**
 * 初始假期类型数据
 */
const initialLeaveTypes: LeaveType[] = [
  {
    id: 1,
    leaveTypeName: '年假',
    leaveTypeCode: 'ANNUAL_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 0.5,
    maxDays: 15,
    allowCrossYear: 0,
    allowAccumulate: 1,
    validityPeriod: 12,
    ruleDescription: '员工每年享有带薪年假，根据工龄计算，最多15天。需提前3天申请，经部门主管批准后生效。',
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    leaveTypeName: '病假',
    leaveTypeCode: 'SICK_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 0.5,
    maxDays: 30,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '员工因病需要休息时可申请病假，需提供医院证明。3天以内由部门主管批准，超过3天需人事部门审批。',
    status: 1,
    createTime: '2024-01-15 10:05:00',
    updateTime: '2024-01-15 10:05:00'
  },
  {
    id: 3,
    leaveTypeName: '事假',
    leaveTypeCode: 'PERSONAL_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 1,
    countAsAttendance: 0,
    minUnit: 0.5,
    maxDays: 10,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '员工因私事需要请假时可申请事假，按天扣除工资。需提前1天申请，经部门主管批准后生效。',
    status: 1,
    createTime: '2024-01-15 10:10:00',
    updateTime: '2024-01-15 10:10:00'
  },
  {
    id: 4,
    leaveTypeName: '婚假',
    leaveTypeCode: 'MARRIAGE_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 1,
    maxDays: 3,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '员工结婚可享受3天带薪婚假，晚婚可延长至15天。需提供结婚证明，提前7天申请。',
    status: 1,
    createTime: '2024-01-15 10:15:00',
    updateTime: '2024-01-15 10:15:00'
  },
  {
    id: 5,
    leaveTypeName: '产假',
    leaveTypeCode: 'MATERNITY_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 1,
    maxDays: 98,
    allowCrossYear: 1,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '女职工生育享受98天产假，其中产前可以休假15天。难产的，增加产假15天。需提供医院证明。',
    status: 1,
    createTime: '2024-01-15 10:20:00',
    updateTime: '2024-01-15 10:20:00'
  },
  {
    id: 6,
    leaveTypeName: '陪产假',
    leaveTypeCode: 'PATERNITY_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 1,
    maxDays: 15,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '男职工配偶生育可享受15天陪产假。需提供配偶生育证明，提前7天申请。',
    status: 1,
    createTime: '2024-01-15 10:25:00',
    updateTime: '2024-01-15 10:25:00'
  },
  {
    id: 7,
    leaveTypeName: '丧假',
    leaveTypeCode: 'BEREAVEMENT_LEAVE',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 1,
    maxDays: 3,
    allowCrossYear: 0,
    allowAccumulate: 0,
    validityPeriod: 12,
    ruleDescription: '员工直系亲属（父母、配偶、子女）去世可享受3天丧假。需提供相关证明材料。',
    status: 1,
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    id: 8,
    leaveTypeName: '调休',
    leaveTypeCode: 'TIME_OFF',
    unit: 0,
    needApproval: 1,
    deductSalary: 0,
    countAsAttendance: 1,
    minUnit: 0.5,
    maxDays: 5,
    allowCrossYear: 0,
    allowAccumulate: 1,
    validityPeriod: 3,
    ruleDescription: '员工加班或节假日工作可申请调休，调休时长根据加班时长计算。需在3个月内使用完毕。',
    status: 1,
    createTime: '2024-01-15 10:35:00',
    updateTime: '2024-01-15 10:35:00'
  }
]

/**
 * 创建假期类型 CRUD Mock
 */
const leaveTypeMock = createCrudMock<LeaveType>(initialLeaveTypes, {
  searchFields: ['leaveTypeName', 'leaveTypeCode']
})

/**
 * 获取假期类型列表 Mock 函数
 */
export function getListMock(params: any) {
  return leaveTypeMock.getList(params)
}

/**
 * 获取假期类型详情 Mock 函数
 */
export function getDetailMock(id: number) {
  return leaveTypeMock.getDetail(id)
}

/**
 * 添加假期类型 Mock 函数
 */
export function addLeaveTypeMock(data: Partial<LeaveType>) {
  return leaveTypeMock.add(data)
}

/**
 * 更新假期类型 Mock 函数
 */
export function updateLeaveTypeMock(data: Partial<LeaveType>) {
  return leaveTypeMock.update(data)
}

/**
 * 删除假期类型 Mock 函数
 */
export function deleteLeaveTypeMock(id: number) {
  return leaveTypeMock.delete(id)
}

/**
 * 批量删除假期类型 Mock 函数
 */
export function batchDeleteLeaveTypesMock(ids: number[]) {
  return leaveTypeMock.batchDelete(ids)
}
