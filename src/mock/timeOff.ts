import type { TimeOff, TimeOffListParams } from '@/types/leave'

let timeOffData: TimeOff[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'E001',
    departmentName: '技术部',
    startTime: '2024-01-15 09:00:00',
    endTime: '2024-01-15 18:00:00',
    timeOffDays: 1,
    source: 0,
    reason: '周末加班调休',
    approvalStatus: 1,
    approver: '李经理',
    approvalTime: '2024-01-16 10:00:00',
    approvalComment: '同意',
    createTime: '2024-01-14 15:00:00',
    updateTime: '2024-01-16 10:00:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'E002',
    departmentName: '产品部',
    startTime: '2024-01-20 09:00:00',
    endTime: '2024-01-20 18:00:00',
    timeOffDays: 1,
    source: 1,
    reason: '春节加班调休',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: '2024-01-18 14:00:00',
    updateTime: '2024-01-18 14:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'E003',
    departmentName: '市场部',
    startTime: '2024-02-01 09:00:00',
    endTime: '2024-02-02 18:00:00',
    timeOffDays: 2,
    source: 0,
    reason: '连续加班调休',
    approvalStatus: 1,
    approver: '张总监',
    approvalTime: '2024-01-25 11:00:00',
    approvalComment: '批准',
    createTime: '2024-01-24 16:00:00',
    updateTime: '2024-01-25 11:00:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'E004',
    departmentName: '人力资源部',
    startTime: '2024-02-05 09:00:00',
    endTime: '2024-02-05 18:00:00',
    timeOffDays: 1,
    source: 1,
    reason: '国庆加班调休',
    approvalStatus: 2,
    approver: '刘主管',
    approvalTime: '2024-02-03 09:00:00',
    approvalComment: '调休时间与项目冲突，建议调整',
    createTime: '2024-02-02 10:00:00',
    updateTime: '2024-02-03 09:00:00'
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'E005',
    departmentName: '财务部',
    startTime: '2024-02-10 09:00:00',
    endTime: '2024-02-10 18:00:00',
    timeOffDays: 1,
    source: 0,
    reason: '周末值班调休',
    approvalStatus: 1,
    approver: '陈经理',
    approvalTime: '2024-02-08 14:00:00',
    approvalComment: '同意调休',
    createTime: '2024-02-07 11:00:00',
    updateTime: '2024-02-08 14:00:00'
  }
]

let nextId = 6

/**
 * 获取调休列表 Mock 函数
 */
export function getTimeOffListMock(params: TimeOffListParams) {
  const { employeeName, departmentName, source, approvalStatus, startDate, endDate, page = 1, pageSize = 20 } = params
  let filteredData = [...timeOffData]

  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (departmentName) {
    filteredData = filteredData.filter(item => item.departmentName.includes(departmentName))
  }
  if (source !== undefined && source !== null && source !== '') {
    const sourceValue = typeof source === 'string' ? parseInt(source) : source
    filteredData = filteredData.filter(item => item.source === sourceValue)
  }
  if (approvalStatus !== undefined && approvalStatus !== null && approvalStatus !== '') {
    const statusValue = typeof approvalStatus === 'string' ? parseInt(approvalStatus) : approvalStatus
    filteredData = filteredData.filter(item => item.approvalStatus === statusValue)
  }
  if (startDate) {
    filteredData = filteredData.filter(item => item.startTime >= startDate)
  }
  if (endDate) {
    filteredData = filteredData.filter(item => item.startTime <= endDate)
  }

  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

/**
 * 获取调休详情 Mock 函数
 */
export function getTimeOffDetailMock(id: number) {
  const item = timeOffData.find(item => item.id === id)
  if (!item) {
    throw new Error('调休记录不存在')
  }
  return item
}

/**
 * 添加调休 Mock 函数
 */
export function addTimeOffMock(data: Partial<TimeOff>) {
  const newItem: TimeOff = {
    id: nextId++,
    employeeId: data.employeeId || 0,
    employeeName: data.employeeName || '',
    employeeCode: data.employeeCode || '',
    departmentName: data.departmentName || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    timeOffDays: data.timeOffDays || 0,
    source: data.source || 0,
    reason: data.reason || '',
    approvalStatus: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  timeOffData.push(newItem)
  return newItem
}

/**
 * 更新调休 Mock 函数
 */
export function updateTimeOffMock(data: Partial<TimeOff>) {
  const index = timeOffData.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('调休记录不存在')
  }
  timeOffData[index] = {
    ...timeOffData[index],
    ...data,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return timeOffData[index]
}

/**
 * 删除调休 Mock 函数
 */
export function deleteTimeOffMock(id: number) {
  const index = timeOffData.findIndex(item => item.id === id)
  if (index === -1) {
    throw new Error('调休记录不存在')
  }
  timeOffData.splice(index, 1)
  return true
}

/**
 * 批量删除调休 Mock 函数
 */
export function batchDeleteTimeOffsMock(ids: number[]) {
  ids.forEach(id => {
    const index = timeOffData.findIndex(item => item.id === id)
    if (index !== -1) {
      timeOffData.splice(index, 1)
    }
  })
  return true
}

/**
 * 批准调休 Mock 函数
 */
export function approveTimeOffMock(data: { id: number; approvalComment: string }) {
  const index = timeOffData.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('调休记录不存在')
  }
  timeOffData[index] = {
    ...timeOffData[index],
    approvalStatus: 1,
    approvalComment: data.approvalComment,
    approver: '当前用户',
    approvalTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return timeOffData[index]
}

/**
 * 拒绝调休 Mock 函数
 */
export function rejectTimeOffMock(data: { id: number; approvalComment: string }) {
  const index = timeOffData.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('调休记录不存在')
  }
  timeOffData[index] = {
    ...timeOffData[index],
    approvalStatus: 2,
    approvalComment: data.approvalComment,
    approver: '当前用户',
    approvalTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return timeOffData[index]
}
