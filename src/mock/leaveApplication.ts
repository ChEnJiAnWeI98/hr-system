/**
 * 请假申请 Mock 数据
 */

import type { LeaveApplication, LeaveApplicationListParams } from '@/types/leave'

// 数据存储（使用 let 而不是 const，允许修改）
let leaveApplications: LeaveApplication[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    startTime: '2026-04-07 09:00',
    endTime: '2026-04-09 18:00',
    leaveDays: 3,
    reason: '家庭旅游',
    attachments: '',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2026-04-06 10:30',
    approvalComment: '同意',
    createTime: '2026-04-05 14:20',
    updateTime: '2026-04-06 10:30'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentName: '市场部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    startTime: '2026-04-06 09:00',
    endTime: '2026-04-06 18:00',
    leaveDays: 1,
    reason: '感冒发烧，需要休息',
    attachments: '/uploads/medical-cert-001.pdf',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2026-04-06 08:30',
    updateTime: '2026-04-06 08:30'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentName: '财务部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    startTime: '2026-04-08 14:00',
    endTime: '2026-04-08 18:00',
    leaveDays: 0.5,
    reason: '处理个人事务',
    attachments: '',
    approvalStatus: 2,
    approver: '赵总监',
    approvalTime: '2026-04-06 11:00',
    approvalComment: '当前工作繁忙，建议延后',
    createTime: '2026-04-05 16:00',
    updateTime: '2026-04-06 11:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentName: '人力资源部',
    leaveTypeId: 4,
    leaveTypeName: '调休',
    startTime: '2026-04-10 09:00',
    endTime: '2026-04-11 18:00',
    leaveDays: 2,
    reason: '上月加班调休',
    attachments: '',
    approvalStatus: 1,
    approver: '孙经理',
    approvalTime: '2026-04-06 09:15',
    approvalComment: '同意调休',
    createTime: '2026-04-05 10:00',
    updateTime: '2026-04-06 09:15'
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    departmentName: '技术部',
    leaveTypeId: 5,
    leaveTypeName: '婚假',
    startTime: '2026-04-15 09:00',
    endTime: '2026-04-24 18:00',
    leaveDays: 10,
    reason: '结婚',
    attachments: '/uploads/marriage-cert-001.pdf',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2026-04-04 15:30',
    updateTime: '2026-04-04 15:30'
  },
  {
    id: 6,
    employeeId: 6,
    employeeName: '周八',
    employeeCode: 'EMP006',
    departmentName: '市场部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    startTime: '2026-04-12 09:00',
    endTime: '2026-04-14 18:00',
    leaveDays: 3,
    reason: '回老家探亲',
    attachments: '',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2026-04-05 16:20',
    approvalComment: '批准',
    createTime: '2026-04-04 11:00',
    updateTime: '2026-04-05 16:20'
  },
  {
    id: 7,
    employeeId: 7,
    employeeName: '吴九',
    employeeCode: 'EMP007',
    departmentName: '技术部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    startTime: '2026-04-07 09:00',
    endTime: '2026-04-08 18:00',
    leaveDays: 2,
    reason: '急性肠胃炎',
    attachments: '/uploads/medical-cert-002.pdf',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2026-04-06 14:00',
    approvalComment: '注意休息',
    createTime: '2026-04-06 13:30',
    updateTime: '2026-04-06 14:00'
  },
  {
    id: 8,
    employeeId: 8,
    employeeName: '郑十',
    employeeCode: 'EMP008',
    departmentName: '财务部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    startTime: '2026-04-09 09:00',
    endTime: '2026-04-09 18:00',
    leaveDays: 1,
    reason: '家中有事',
    attachments: '',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2026-04-06 10:00',
    updateTime: '2026-04-06 10:00'
  },
  {
    id: 9,
    employeeId: 9,
    employeeName: '钱十一',
    employeeCode: 'EMP009',
    departmentName: '人力资源部',
    leaveTypeId: 6,
    leaveTypeName: '产假',
    startTime: '2026-04-20 09:00',
    endTime: '2026-07-18 18:00',
    leaveDays: 90,
    reason: '生育',
    attachments: '/uploads/birth-cert-001.pdf',
    approvalStatus: 1,
    approver: '孙经理',
    approvalTime: '2026-04-05 10:00',
    approvalComment: '祝贺，批准产假',
    createTime: '2026-04-03 14:00',
    updateTime: '2026-04-05 10:00'
  },
  {
    id: 10,
    employeeId: 10,
    employeeName: '陈十二',
    employeeCode: 'EMP010',
    departmentName: '市场部',
    leaveTypeId: 7,
    leaveTypeName: '陪产假',
    startTime: '2026-04-20 09:00',
    endTime: '2026-04-29 18:00',
    leaveDays: 10,
    reason: '妻子生育陪护',
    attachments: '/uploads/birth-cert-002.pdf',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2026-04-05 09:00',
    updateTime: '2026-04-05 09:00'
  },
  {
    id: 11,
    employeeId: 11,
    employeeName: '刘十三',
    employeeCode: 'EMP011',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    startTime: '2026-04-16 09:00',
    endTime: '2026-04-20 18:00',
    leaveDays: 5,
    reason: '外出旅游',
    attachments: '',
    approvalStatus: 2,
    approver: '李经理',
    approvalTime: '2026-04-06 15:00',
    approvalComment: '项目关键期，不批准',
    createTime: '2026-04-05 13:00',
    updateTime: '2026-04-06 15:00'
  },
  {
    id: 12,
    employeeId: 12,
    employeeName: '黄十四',
    employeeCode: 'EMP012',
    departmentName: '财务部',
    leaveTypeId: 4,
    leaveTypeName: '调休',
    startTime: '2026-04-11 09:00',
    endTime: '2026-04-11 18:00',
    leaveDays: 1,
    reason: '上周末加班调休',
    attachments: '',
    approvalStatus: 1,
    approver: '赵总监',
    approvalTime: '2026-04-06 11:30',
    approvalComment: '同意',
    createTime: '2026-04-06 09:00',
    updateTime: '2026-04-06 11:30'
  },
  {
    id: 13,
    employeeId: 13,
    employeeName: '杨十五',
    employeeCode: 'EMP013',
    departmentName: '人力资源部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    startTime: '2026-04-08 09:00',
    endTime: '2026-04-10 18:00',
    leaveDays: 3,
    reason: '扁桃体发炎',
    attachments: '/uploads/medical-cert-003.pdf',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2026-04-06 12:00',
    updateTime: '2026-04-06 12:00'
  },
  {
    id: 14,
    employeeId: 14,
    employeeName: '朱十六',
    employeeCode: 'EMP014',
    departmentName: '市场部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    startTime: '2026-04-13 09:00',
    endTime: '2026-04-13 12:00',
    leaveDays: 0.5,
    reason: '办理证件',
    attachments: '',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2026-04-06 13:00',
    approvalComment: '同意半天事假',
    createTime: '2026-04-06 10:30',
    updateTime: '2026-04-06 13:00'
  },
  {
    id: 15,
    employeeId: 15,
    employeeName: '林十七',
    employeeCode: 'EMP015',
    departmentName: '技术部',
    leaveTypeId: 8,
    leaveTypeName: '丧假',
    startTime: '2026-04-07 09:00',
    endTime: '2026-04-09 18:00',
    leaveDays: 3,
    reason: '祖父去世',
    attachments: '/uploads/death-cert-001.pdf',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2026-04-06 16:00',
    approvalComment: '节哀顺变',
    createTime: '2026-04-06 15:30',
    updateTime: '2026-04-06 16:00'
  }
]

let nextId = 16

/**
 * 获取列表 Mock 函数
 */
export function getListMock(params: LeaveApplicationListParams) {
  const {
    employeeName,
    employeeCode,
    leaveTypeId,
    approvalStatus,
    startTime,
    endTime,
    page = 1,
    pageSize = 20
  } = params
  let filteredData = [...leaveApplications]

  // 员工姓名筛选
  if (employeeName) {
    filteredData = filteredData.filter((item) =>
      item.employeeName.toLowerCase().includes(employeeName.toLowerCase())
    )
  }

  // 员工工号筛选
  if (employeeCode) {
    filteredData = filteredData.filter((item) =>
      item.employeeCode.toLowerCase().includes(employeeCode.toLowerCase())
    )
  }

  // 假期类型筛选
  if (leaveTypeId !== undefined && leaveTypeId !== null && leaveTypeId !== '') {
    const typeValue = typeof leaveTypeId === 'string' ? parseInt(leaveTypeId) : leaveTypeId
    filteredData = filteredData.filter((item) => item.leaveTypeId === typeValue)
  }

  // 审批状态筛选
  if (approvalStatus !== undefined && approvalStatus !== null && approvalStatus !== '') {
    const statusValue = typeof approvalStatus === 'string' ? parseInt(approvalStatus) : approvalStatus
    filteredData = filteredData.filter((item) => item.approvalStatus === statusValue)
  }

  // 开始时间范围筛选
  if (startTime) {
    filteredData = filteredData.filter((item) => item.startTime >= startTime)
  }

  // 结束时间范围筛选
  if (endTime) {
    filteredData = filteredData.filter((item) => item.endTime <= endTime)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

/**
 * 获取详情 Mock 函数
 */
export function getDetailMock(id: number) {
  const item = leaveApplications.find((item) => item.id === id)
  if (!item) {
    throw new Error('请假申请不存在')
  }
  return item
}

/**
 * 添加 Mock 函数
 */
export function addLeaveApplicationMock(data: Partial<LeaveApplication>) {
  const newItem: LeaveApplication = {
    id: nextId++,
    employeeId: data.employeeId || 0,
    employeeName: data.employeeName || '',
    employeeCode: data.employeeCode || '',
    departmentName: data.departmentName || '',
    leaveTypeId: data.leaveTypeId || 0,
    leaveTypeName: data.leaveTypeName || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    leaveDays: data.leaveDays || 0,
    reason: data.reason || '',
    attachments: data.attachments || '',
    approvalStatus: 0, // 新建时默认待审批
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  leaveApplications.push(newItem)
  return newItem
}

/**
 * 更新 Mock 函数
 */
export function updateLeaveApplicationMock(data: Partial<LeaveApplication>) {
  const index = leaveApplications.findIndex((item) => item.id === data.id)
  if (index !== -1) {
    leaveApplications[index] = {
      ...leaveApplications[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return leaveApplications[index]
  }
  throw new Error('请假申请不存在')
}

/**
 * 删除 Mock 函数
 */
export function deleteLeaveApplicationMock(id: number) {
  const index = leaveApplications.findIndex((item) => item.id === id)
  if (index !== -1) {
    leaveApplications.splice(index, 1)
    return true
  }
  throw new Error('请假申请不存在')
}

/**
 * 批量删除 Mock 函数
 */
export function batchDeleteLeaveApplicationsMock(ids: number[]) {
  ids.forEach((id) => {
    const index = leaveApplications.findIndex((item) => item.id === id)
    if (index !== -1) {
      leaveApplications.splice(index, 1)
    }
  })
  return true
}

/**
 * 批准请假申请 Mock 函数
 */
export function approveLeaveApplicationMock(id: number, data: { approvalComment?: string }) {
  const index = leaveApplications.findIndex((item) => item.id === id)
  if (index !== -1) {
    const item = leaveApplications[index]
    if (item.approvalStatus !== 0) {
      throw new Error('只能审批待审批状态的申请')
    }
    leaveApplications[index] = {
      ...item,
      approvalStatus: 1,
      approver: '当前用户',
      approvalTime: new Date().toLocaleString('zh-CN'),
      approvalComment: data.approvalComment || '同意',
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return leaveApplications[index]
  }
  throw new Error('请假申请不存在')
}

/**
 * 拒绝请假申请 Mock 函数
 */
export function rejectLeaveApplicationMock(id: number, data: { approvalComment: string }) {
  const index = leaveApplications.findIndex((item) => item.id === id)
  if (index !== -1) {
    const item = leaveApplications[index]
    if (item.approvalStatus !== 0) {
      throw new Error('只能审批待审批状态的申请')
    }
    leaveApplications[index] = {
      ...item,
      approvalStatus: 2,
      approver: '当前用户',
      approvalTime: new Date().toLocaleString('zh-CN'),
      approvalComment: data.approvalComment,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return leaveApplications[index]
  }
  throw new Error('请假申请不存在')
}

/**
 * 撤回请假申请 Mock 函数
 */
export function withdrawLeaveApplicationMock(id: number) {
  const index = leaveApplications.findIndex((item) => item.id === id)
  if (index !== -1) {
    const item = leaveApplications[index]
    if (item.approvalStatus !== 0) {
      throw new Error('只能撤回待审批状态的申请')
    }
    leaveApplications.splice(index, 1)
    return true
  }
  throw new Error('请假申请不存在')
}
