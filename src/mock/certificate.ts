import type { CertificateReminder, CertificateReminderListParams, CertificateUpdateRecord, CertificateStatistics } from '@/types/certificate'

// 证件到期提醒数据存储
let reminders: CertificateReminder[] = [
  {
    id: 1,
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: '张三',
    departmentName: '技术部',
    certificateType: 1,
    certificateTypeName: '身份证',
    certificateNumber: '110101199005151234',
    expiryDate: '2030-05-15',
    remainingDays: 1502,
    urgencyLevel: 1,
    urgencyLevelName: '正常',
    reminderStatus: 1,
    reminderStatusName: '待处理',
    reminderCount: 0,
    lastReminderTime: '',
    remark: '',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2024-01-15 09:00:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeCode: 'EMP002',
    employeeName: '李四',
    departmentName: '产品部',
    certificateType: 2,
    certificateTypeName: '劳动合同',
    certificateNumber: 'HT20210310001',
    expiryDate: '2026-05-20',
    remainingDays: 46,
    urgencyLevel: 1,
    urgencyLevelName: '正常',
    reminderStatus: 1,
    reminderStatusName: '待处理',
    reminderCount: 0,
    lastReminderTime: '',
    remark: '',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2024-01-15 09:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeCode: 'EMP003',
    employeeName: '王五',
    departmentName: '技术部',
    certificateType: 3,
    certificateTypeName: '资质证书',
    certificateNumber: 'ZS20240115001',
    expiryDate: '2026-04-25',
    remainingDays: 21,
    urgencyLevel: 2,
    urgencyLevelName: '提醒',
    reminderStatus: 2,
    reminderStatusName: '已提醒',
    reminderCount: 1,
    lastReminderTime: '2026-04-03 10:00:00',
    remark: '已发送邮件提醒',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2026-04-03 10:00:00'
  },
  {
    id: 4,
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: '张三',
    departmentName: '技术部',
    certificateType: 2,
    certificateTypeName: '劳动合同',
    certificateNumber: 'HT20200115001',
    expiryDate: '2026-04-15',
    remainingDays: 11,
    urgencyLevel: 3,
    urgencyLevelName: '警告',
    reminderStatus: 2,
    reminderStatusName: '已提醒',
    reminderCount: 2,
    lastReminderTime: '2026-04-02 09:00:00',
    remark: '已发送系统消息和邮件',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2026-04-02 09:00:00'
  },
  {
    id: 5,
    employeeId: 2,
    employeeCode: 'EMP002',
    employeeName: '李四',
    departmentName: '产品部',
    certificateType: 4,
    certificateTypeName: '健康证',
    certificateNumber: 'JK20250310001',
    expiryDate: '2026-04-08',
    remainingDays: 4,
    urgencyLevel: 4,
    urgencyLevelName: '紧急',
    reminderStatus: 2,
    reminderStatusName: '已提醒',
    reminderCount: 3,
    lastReminderTime: '2026-04-03 14:00:00',
    remark: '已发送多次提醒，需尽快更新',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2026-04-03 14:00:00'
  },
  {
    id: 6,
    employeeId: 4,
    employeeCode: 'EMP004',
    employeeName: '赵六',
    departmentName: '市场部',
    certificateType: 1,
    certificateTypeName: '身份证',
    certificateNumber: '110101198811253456',
    expiryDate: '2026-04-01',
    remainingDays: -3,
    urgencyLevel: 5,
    urgencyLevelName: '已过期',
    reminderStatus: 4,
    reminderStatusName: '已忽略',
    reminderCount: 5,
    lastReminderTime: '2026-03-31 09:00:00',
    remark: '员工已离职，忽略提醒',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2026-04-01 10:00:00'
  }
]

// 证件更新记录数据存储
let updateRecords: CertificateUpdateRecord[] = [
  {
    id: 1,
    employeeId: 3,
    employeeCode: 'EMP003',
    employeeName: '王五',
    certificateType: 3,
    certificateTypeName: '资质证书',
    oldCertificateNumber: 'ZS20210115001',
    newCertificateNumber: 'ZS20240115001',
    oldExpiryDate: '2024-01-15',
    newExpiryDate: '2027-01-15',
    updateReason: '证书到期续期',
    updatedBy: '张三',
    updateTime: '2024-01-10 10:00:00',
    attachment: ''
  }
]

let nextReminderId = 7
let nextRecordId = 2

/**
 * 获取证件到期提醒列表 Mock 函数
 */
export function getCertificateReminderListMock(params: CertificateReminderListParams) {
  const {
    employeeCode,
    employeeName,
    departmentId,
    certificateType,
    urgencyLevel,
    reminderStatus,
    expiryDateStart,
    expiryDateEnd,
    page = 1,
    pageSize = 20
  } = params
  let filteredData = [...reminders]

  // 筛选
  if (employeeCode) {
    filteredData = filteredData.filter(item => item.employeeCode.includes(employeeCode))
  }
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    // 这里简化处理，实际应该根据部门ID筛选
    filteredData = filteredData.filter(item => item.departmentName.includes(String(deptId)))
  }
  if (certificateType !== undefined && certificateType !== null && certificateType !== '') {
    const certType = typeof certificateType === 'string' ? parseInt(certificateType) : certificateType
    filteredData = filteredData.filter(item => item.certificateType === certType)
  }
  if (urgencyLevel !== undefined && urgencyLevel !== null && urgencyLevel !== '') {
    const level = typeof urgencyLevel === 'string' ? parseInt(urgencyLevel) : urgencyLevel
    filteredData = filteredData.filter(item => item.urgencyLevel === level)
  }
  if (reminderStatus !== undefined && reminderStatus !== null && reminderStatus !== '') {
    const status = typeof reminderStatus === 'string' ? parseInt(reminderStatus) : reminderStatus
    filteredData = filteredData.filter(item => item.reminderStatus === status)
  }
  if (expiryDateStart) {
    filteredData = filteredData.filter(item => item.expiryDate >= expiryDateStart)
  }
  if (expiryDateEnd) {
    filteredData = filteredData.filter(item => item.expiryDate <= expiryDateEnd)
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
 * 获取证件到期提醒详情 Mock 函数
 */
export function getCertificateReminderDetailMock(id: number) {
  return reminders.find(item => item.id === id) || null
}

/**
 * 更新提醒状态 Mock 函数
 */
export function updateReminderStatusMock(id: number, status: number, remark?: string) {
  const index = reminders.findIndex(item => item.id === id)
  if (index !== -1) {
    reminders[index] = {
      ...reminders[index],
      reminderStatus: status,
      reminderStatusName: getReminderStatusName(status),
      remark: remark || reminders[index].remark,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return reminders[index]
  }
  throw new Error('数据不存在')
}

/**
 * 批量提醒 Mock 函数
 */
export function batchRemindMock(ids: number[], reminderMethod: number[]) {
  const successIds: number[] = []
  const failIds: number[] = []

  ids.forEach(id => {
    const index = reminders.findIndex(item => item.id === id)
    if (index !== -1) {
      reminders[index] = {
        ...reminders[index],
        reminderStatus: 2,
        reminderStatusName: '已提醒',
        reminderCount: reminders[index].reminderCount + 1,
        lastReminderTime: new Date().toLocaleString('zh-CN'),
        remark: `已通过${reminderMethod.map(m => getReminderMethodName(m)).join('、')}发送提醒`,
        updateTime: new Date().toLocaleString('zh-CN')
      }
      successIds.push(id)
    } else {
      failIds.push(id)
    }
  })

  return {
    successIds,
    failIds,
    successCount: successIds.length,
    failCount: failIds.length
  }
}

/**
 * 更新证件信息 Mock 函数
 */
export function updateCertificateMock(data: any) {
  const { id, employeeId, certificateType, newCertificateNumber, newExpiryDate, updateReason, attachment } = data

  // 查找原证件提醒记录
  const reminder = reminders.find(item => item.id === id)
  if (!reminder) {
    throw new Error('证件提醒记录不存在')
  }

  // 创建更新记录
  const updateRecord: CertificateUpdateRecord = {
    id: nextRecordId++,
    employeeId: reminder.employeeId,
    employeeCode: reminder.employeeCode,
    employeeName: reminder.employeeName,
    certificateType: reminder.certificateType,
    certificateTypeName: reminder.certificateTypeName,
    oldCertificateNumber: reminder.certificateNumber,
    newCertificateNumber,
    oldExpiryDate: reminder.expiryDate,
    newExpiryDate,
    updateReason,
    updatedBy: '当前用户',
    updateTime: new Date().toLocaleString('zh-CN'),
    attachment: attachment || ''
  }
  updateRecords.push(updateRecord)

  // 更新提醒记录
  const index = reminders.findIndex(item => item.id === id)
  const remainingDays = calculateRemainingDays(newExpiryDate)
  const urgencyLevel = calculateUrgencyLevel(remainingDays)

  reminders[index] = {
    ...reminders[index],
    certificateNumber: newCertificateNumber,
    expiryDate: newExpiryDate,
    remainingDays,
    urgencyLevel,
    urgencyLevelName: getUrgencyLevelName(urgencyLevel),
    reminderStatus: 3,
    reminderStatusName: '已更新',
    remark: updateReason,
    updateTime: new Date().toLocaleString('zh-CN')
  }

  return {
    reminder: reminders[index],
    updateRecord
  }
}

/**
 * 获取证件更新记录列表 Mock 函数
 */
export function getCertificateUpdateRecordListMock(params: any) {
  const { employeeCode, employeeName, certificateType, page = 1, pageSize = 20 } = params
  let filteredData = [...updateRecords]

  // 筛选
  if (employeeCode) {
    filteredData = filteredData.filter(item => item.employeeCode.includes(employeeCode))
  }
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (certificateType !== undefined && certificateType !== null && certificateType !== '') {
    const certType = typeof certificateType === 'string' ? parseInt(certificateType) : certificateType
    filteredData = filteredData.filter(item => item.certificateType === certType)
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
 * 获取证件统计数据 Mock 函数
 */
export function getCertificateStatisticsMock() {
  const statistics: CertificateStatistics = {
    total: reminders.length,
    pending: reminders.filter(item => item.reminderStatus === 1).length,
    reminded: reminders.filter(item => item.reminderStatus === 2).length,
    updated: reminders.filter(item => item.reminderStatus === 3).length,
    expired: reminders.filter(item => item.urgencyLevel === 5).length,
    urgent: reminders.filter(item => item.urgencyLevel === 4).length,
    warning: reminders.filter(item => item.urgencyLevel === 3).length,
    reminder: reminders.filter(item => item.urgencyLevel === 2).length,
    normal: reminders.filter(item => item.urgencyLevel === 1).length
  }
  return statistics
}

/**
 * 计算剩余天数
 */
function calculateRemainingDays(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * 计算紧急程度
 */
function calculateUrgencyLevel(remainingDays: number): number {
  if (remainingDays < 0) return 5 // 已过期
  if (remainingDays < 7) return 4 // 紧急
  if (remainingDays < 15) return 3 // 警告
  if (remainingDays < 30) return 2 // 提醒
  return 1 // 正常
}

/**
 * 获取紧急程度名称
 */
function getUrgencyLevelName(level: number): string {
  const levelMap: Record<number, string> = {
    1: '正常',
    2: '提醒',
    3: '警告',
    4: '紧急',
    5: '已过期'
  }
  return levelMap[level] || ''
}

/**
 * 获取提醒状态名称
 */
function getReminderStatusName(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待处理',
    2: '已提醒',
    3: '已更新',
    4: '已忽略'
  }
  return statusMap[status] || ''
}

/**
 * 获取提醒方式名称
 */
function getReminderMethodName(method: number): string {
  const methodMap: Record<number, string> = {
    1: '系统消息',
    2: '邮件',
    3: '企业微信'
  }
  return methodMap[method] || ''
}
