import type { AttendanceRule, AttendanceRuleListParams } from '@/types/attendance'
import { createCrudMock } from '@/utils/crud'

// 规则类型映射
const ruleTypeMap: Record<number, string> = {
  1: '固定班制',
  2: '弹性工作制',
  3: '排班制'
}

// 状态映射
const statusMap: Record<number, string> = {
  1: '启用',
  0: '禁用'
}

// 初始数据
const initialData: AttendanceRule[] = [
  {
    id: 1,
    name: '标准工作制',
    type: 1,
    typeName: '固定班制',
    departmentIds: [1, 2, 3],
    departmentNames: '技术部、产品部、市场部',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleMinutes: 0,
    requireClockIn: true,
    lateMinutes: 10,
    earlyMinutes: 10,
    absentHours: 4,
    status: 1,
    statusName: '启用',
    remark: '标准朝九晚六工作制',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '弹性工作制',
    type: 2,
    typeName: '弹性工作制',
    departmentIds: [1],
    departmentNames: '技术部',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleMinutes: 60,
    requireClockIn: true,
    lateMinutes: 30,
    earlyMinutes: 30,
    absentHours: 4,
    status: 1,
    statusName: '启用',
    remark: '允许上下班时间前后浮动1小时',
    createTime: '2024-01-15 14:00:00',
    updateTime: '2024-01-15 14:00:00'
  },
  {
    id: 3,
    name: '客服排班制',
    type: 3,
    typeName: '排班制',
    departmentIds: [5],
    departmentNames: '客服部',
    workStartTime: '08:00',
    workEndTime: '20:00',
    flexibleMinutes: 0,
    requireClockIn: true,
    lateMinutes: 5,
    earlyMinutes: 5,
    absentHours: 2,
    status: 1,
    statusName: '启用',
    remark: '客服部门轮班制度',
    createTime: '2024-02-01 09:00:00',
    updateTime: '2024-02-01 09:00:00'
  },
  {
    id: 4,
    name: '管理层工作制',
    type: 2,
    typeName: '弹性工作制',
    departmentIds: [6],
    departmentNames: '管理层',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleMinutes: 120,
    requireClockIn: false,
    lateMinutes: 60,
    earlyMinutes: 60,
    absentHours: 8,
    status: 1,
    statusName: '启用',
    remark: '管理层弹性工作制，不强制打卡',
    createTime: '2024-02-10 11:00:00',
    updateTime: '2024-02-10 11:00:00'
  },
  {
    id: 5,
    name: '销售外勤制',
    type: 2,
    typeName: '弹性工作制',
    departmentIds: [4],
    departmentNames: '销售部',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleMinutes: 90,
    requireClockIn: true,
    lateMinutes: 30,
    earlyMinutes: 30,
    absentHours: 4,
    status: 1,
    statusName: '启用',
    remark: '销售人员外勤为主，弹性打卡',
    createTime: '2024-03-01 10:30:00',
    updateTime: '2024-03-01 10:30:00'
  },
  {
    id: 6,
    name: '财务标准制',
    type: 1,
    typeName: '固定班制',
    departmentIds: [7],
    departmentNames: '财务部',
    workStartTime: '08:30',
    workEndTime: '17:30',
    flexibleMinutes: 0,
    requireClockIn: true,
    lateMinutes: 5,
    earlyMinutes: 5,
    absentHours: 4,
    status: 1,
    statusName: '启用',
    remark: '财务部门固定工作时间',
    createTime: '2024-03-15 09:00:00',
    updateTime: '2024-03-15 09:00:00'
  },
  {
    id: 7,
    name: '人事标准制',
    type: 1,
    typeName: '固定班制',
    departmentIds: [8],
    departmentNames: '人事部',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleMinutes: 0,
    requireClockIn: true,
    lateMinutes: 10,
    earlyMinutes: 10,
    absentHours: 4,
    status: 1,
    statusName: '启用',
    createTime: '2024-04-01 10:00:00',
    updateTime: '2024-04-01 10:00:00'
  },
  {
    id: 8,
    name: '测试工作制（已停用）',
    type: 1,
    typeName: '固定班制',
    departmentIds: [1],
    departmentNames: '技术部',
    workStartTime: '10:00',
    workEndTime: '19:00',
    flexibleMinutes: 0,
    requireClockIn: true,
    lateMinutes: 15,
    earlyMinutes: 15,
    absentHours: 4,
    status: 0,
    statusName: '禁用',
    remark: '已停用的测试规则',
    createTime: '2024-01-10 15:00:00',
    updateTime: '2024-04-01 16:00:00'
  }
]

// 创建 CRUD Mock
const attendanceRuleMock = createCrudMock<AttendanceRule>(initialData, {
  searchFields: ['name']
})

/**
 * 获取考勤规则列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: AttendanceRuleListParams) {
  const { type, status, ...otherParams } = params
  let result = attendanceRuleMock.getList(otherParams)

  // 规则类型筛选
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    result.list = result.list.filter(item => item.type === typeValue)
  }

  // 状态筛选
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    result.list = result.list.filter(item => item.status === statusValue)
  }

  result.total = result.list.length
  return result
}

/**
 * 添加考勤规则 Mock 函数（带自定义处理）
 */
export function addAttendanceRuleMock(data: Partial<AttendanceRule>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    typeName: ruleTypeMap[data.type || 1] || '固定班制',
    statusName: statusMap[data.status || 1] || '启用',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as AttendanceRule
  return attendanceRuleMock.add(newData)
}

/**
 * 更新考勤规则 Mock 函数（带自定义处理）
 */
export function updateAttendanceRuleMock(data: Partial<AttendanceRule>) {
  const updateData = {
    ...data,
    typeName: data.type ? ruleTypeMap[data.type] : undefined,
    statusName: data.status !== undefined ? statusMap[data.status] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return attendanceRuleMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = attendanceRuleMock.getDetail
export const deleteAttendanceRuleMock = attendanceRuleMock.delete
export const batchDeleteAttendanceRulesMock = attendanceRuleMock.batchDelete
