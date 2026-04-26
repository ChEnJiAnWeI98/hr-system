import type { LeaveQuota, LeaveQuotaListParams } from '@/types/leave'
import { createCrudMock } from '@/utils/crud/mockHelper'

// 初始数据
const initialData: LeaveQuota[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 10,
    usedQuota: 3,
    remainingQuota: 7,
    year: 2026,
    grantReason: '工龄满3年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentName: '技术部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    totalQuota: 10,
    usedQuota: 2,
    remainingQuota: 8,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentName: '产品部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 7,
    usedQuota: 5,
    remainingQuota: 2,
    year: 2026,
    grantReason: '工龄满2年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 4,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentName: '产品部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    totalQuota: 10,
    usedQuota: 0,
    remainingQuota: 10,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 5,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentName: '市场部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 5,
    usedQuota: 1,
    remainingQuota: 4,
    year: 2026,
    grantReason: '工龄满1年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 6,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentName: '市场部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    totalQuota: 5,
    usedQuota: 2,
    remainingQuota: 3,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 7,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentName: '人事部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 10,
    usedQuota: 8,
    remainingQuota: 2,
    year: 2026,
    grantReason: '工龄满3年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 8,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentName: '人事部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    totalQuota: 10,
    usedQuota: 3,
    remainingQuota: 7,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 9,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    departmentName: '财务部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 7,
    usedQuota: 0,
    remainingQuota: 7,
    year: 2026,
    grantReason: '工龄满2年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 10,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    departmentName: '财务部',
    leaveTypeId: 4,
    leaveTypeName: '调休',
    totalQuota: 3,
    usedQuota: 1,
    remainingQuota: 2,
    year: 2026,
    grantReason: '加班调休',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 11,
    employeeId: 6,
    employeeName: '周八',
    employeeCode: 'EMP006',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 5,
    usedQuota: 5,
    remainingQuota: 0,
    year: 2026,
    grantReason: '工龄满1年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 12,
    employeeId: 6,
    employeeName: '周八',
    employeeCode: 'EMP006',
    departmentName: '技术部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    totalQuota: 10,
    usedQuota: 1,
    remainingQuota: 9,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 13,
    employeeId: 7,
    employeeName: '吴九',
    employeeCode: 'EMP007',
    departmentName: '产品部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 10,
    usedQuota: 4,
    remainingQuota: 6,
    year: 2026,
    grantReason: '工龄满3年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 14,
    employeeId: 7,
    employeeName: '吴九',
    employeeCode: 'EMP007',
    departmentName: '产品部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    totalQuota: 5,
    usedQuota: 0,
    remainingQuota: 5,
    year: 2026,
    grantReason: '年度标准额度',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 15,
    employeeId: 8,
    employeeName: '郑十',
    employeeCode: 'EMP008',
    departmentName: '市场部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    totalQuota: 7,
    usedQuota: 2,
    remainingQuota: 5,
    year: 2026,
    grantReason: '工龄满2年',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  }
]

// 创建 CRUD Mock
const leaveQuotaMock = createCrudMock<LeaveQuota>(initialData, {
  searchFields: ['employeeName', 'employeeCode']
})

/**
 * 获取假期额度列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: LeaveQuotaListParams) {
  const { leaveTypeId, year, ...otherParams } = params
  let result = leaveQuotaMock.getList(otherParams)

  // 假期类型筛选
  if (leaveTypeId !== undefined && leaveTypeId !== null && leaveTypeId !== '') {
    const leaveTypeIdValue = typeof leaveTypeId === 'string' ? parseInt(leaveTypeId) : leaveTypeId
    result.list = result.list.filter(item => item.leaveTypeId === leaveTypeIdValue)
  }

  // 年份筛选
  if (year !== undefined && year !== null && year !== '') {
    const yearValue = typeof year === 'string' ? parseInt(year) : year
    result.list = result.list.filter(item => item.year === yearValue)
  }

  result.total = result.list.length
  return result
}

// 导出基础 CRUD 函数
export const getDetailMock = leaveQuotaMock.getDetail
export const addLeaveQuotaMock = leaveQuotaMock.add
export const updateLeaveQuotaMock = leaveQuotaMock.update
export const deleteLeaveQuotaMock = leaveQuotaMock.delete
export const batchDeleteLeaveQuotasMock = leaveQuotaMock.batchDelete

/**
 * 发放假期额度 Mock 函数
 */
export function grantLeaveQuotaMock(data: {
  employeeIds: number[]
  leaveTypeId: number
  leaveTypeName: string
  totalQuota: number
  year: number
  grantReason: string
}) {
  const { employeeIds, leaveTypeId, leaveTypeName, totalQuota, year, grantReason } = data
  const newQuotas: LeaveQuota[] = []

  // 模拟员工数据
  const employees = [
    { id: 1, name: '张三', code: 'EMP001', department: '技术部' },
    { id: 2, name: '李四', code: 'EMP002', department: '产品部' },
    { id: 3, name: '王五', code: 'EMP003', department: '市场部' },
    { id: 4, name: '赵六', code: 'EMP004', department: '人事部' },
    { id: 5, name: '孙七', code: 'EMP005', department: '财务部' },
    { id: 6, name: '周八', code: 'EMP006', department: '技术部' },
    { id: 7, name: '吴九', code: 'EMP007', department: '产品部' },
    { id: 8, name: '郑十', code: 'EMP008', department: '市场部' }
  ]

  employeeIds.forEach(employeeId => {
    const employee = employees.find(e => e.id === employeeId)
    if (employee) {
      const newQuota: LeaveQuota = {
        id: Date.now() + Math.random(),
        employeeId,
        employeeName: employee.name,
        employeeCode: employee.code,
        departmentName: employee.department,
        leaveTypeId,
        leaveTypeName,
        totalQuota,
        usedQuota: 0,
        remainingQuota: totalQuota,
        year,
        grantReason,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }
      newQuotas.push(newQuota)
      leaveQuotaMock.add(newQuota)
    }
  })

  return newQuotas
}

/**
 * 调整假期额度 Mock 函数
 */
export function adjustLeaveQuotaMock(data: {
  id: number
  adjustType: 'increase' | 'decrease'
  adjustQuota: number
  adjustReason: string
}) {
  const { id, adjustType, adjustQuota, adjustReason } = data
  const quota = leaveQuotaMock.getDetail(id)

  if (!quota) {
    throw new Error('假期额度不存在')
  }

  // 计算新的总额度
  const newTotalQuota = adjustType === 'increase'
    ? quota.totalQuota + adjustQuota
    : quota.totalQuota - adjustQuota

  // 确保总额度不小于已使用额度
  if (newTotalQuota < quota.usedQuota) {
    throw new Error('调整后的总额度不能小于已使用额度')
  }

  // 更新额度
  const updatedQuota: LeaveQuota = {
    ...quota,
    totalQuota: newTotalQuota,
    remainingQuota: newTotalQuota - quota.usedQuota,
    grantReason: `${quota.grantReason}；${adjustReason}`,
    updateTime: new Date().toLocaleString('zh-CN')
  }

  leaveQuotaMock.update(updatedQuota)
  return updatedQuota
}
