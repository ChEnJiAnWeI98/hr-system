import type { OvertimeApplication, OvertimeApplicationListParams } from '@/types/attendance'
import { createCrudMock } from '@/utils/crud'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'

// 加班类型映射
const overtimeTypeMap: Record<number, string> = {
  1: '工作日加班',
  2: '周末加班',
  3: '节假日加班'
}

// 补偿方式映射
const compensationTypeMap: Record<number, string> = {
  1: '加班费',
  2: '调休'
}

// 审批状态映射
const approvalStatusMap: Record<number, string> = {
  0: '待审批',
  1: '已批准',
  2: '已拒绝'
}

// 初始数据
const initialData: OvertimeApplication[] = [
  {
    id: 1,
    employeeId: 1,
    employeeCode: 'E001',
    employeeName: '张三',
    departmentName: '技术部',
    overtimeDate: '2026-04-01',
    startTime: '19:00',
    endTime: '22:00',
    overtimeHours: 3,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 2,
    compensationTypeName: '调休',
    reason: '紧急修复生产环境Bug',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '李经理',
    approvalTime: '2026-04-01 18:30:00',
    approvalComment: '同意加班，注意休息',
    createTime: '2026-04-01 18:00:00',
    updateTime: '2026-04-01 18:30:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeCode: 'E002',
    employeeName: '李四',
    departmentName: '产品部',
    overtimeDate: '2026-04-05',
    startTime: '09:00',
    endTime: '18:00',
    overtimeHours: 8,
    overtimeType: 2,
    overtimeTypeName: '周末加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '产品需求评审会议',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '王总监',
    approvalTime: '2026-04-04 16:00:00',
    approvalComment: '批准',
    createTime: '2026-04-04 15:30:00',
    updateTime: '2026-04-04 16:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeCode: 'E003',
    employeeName: '王五',
    departmentName: '技术部',
    overtimeDate: '2026-04-02',
    startTime: '20:00',
    endTime: '23:00',
    overtimeHours: 3,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 2,
    compensationTypeName: '调休',
    reason: '项目上线部署',
    approvalStatus: 0,
    approvalStatusName: '待审批',
    createTime: '2026-04-02 19:30:00',
    updateTime: '2026-04-02 19:30:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    overtimeDate: '2026-04-06',
    startTime: '10:00',
    endTime: '16:00',
    overtimeHours: 6,
    overtimeType: 2,
    overtimeTypeName: '周末加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '参加行业展会',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '张经理',
    approvalTime: '2026-04-05 10:00:00',
    approvalComment: '同意',
    createTime: '2026-04-05 09:30:00',
    updateTime: '2026-04-05 10:00:00'
  },
  {
    id: 5,
    employeeId: 7,
    employeeCode: 'E007',
    employeeName: '吴九',
    departmentName: '技术部',
    overtimeDate: '2026-04-03',
    startTime: '19:00',
    endTime: '21:00',
    overtimeHours: 2,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 2,
    compensationTypeName: '调休',
    reason: '代码审查和优化',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '李经理',
    approvalTime: '2026-04-03 18:00:00',
    approvalComment: '批准',
    createTime: '2026-04-03 17:30:00',
    updateTime: '2026-04-03 18:00:00'
  },
  {
    id: 6,
    employeeId: 8,
    employeeCode: 'E008',
    employeeName: '郑十',
    departmentName: '产品部',
    overtimeDate: '2026-04-01',
    startTime: '19:30',
    endTime: '22:30',
    overtimeHours: 3,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '产品原型设计',
    approvalStatus: 2,
    approvalStatusName: '已拒绝',
    approver: '王总监',
    approvalTime: '2026-04-01 19:00:00',
    approvalComment: '该工作可在正常工作时间完成',
    createTime: '2026-04-01 18:30:00',
    updateTime: '2026-04-01 19:00:00'
  },
  {
    id: 7,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    overtimeDate: '2026-04-05',
    startTime: '09:00',
    endTime: '17:00',
    overtimeHours: 8,
    overtimeType: 2,
    overtimeTypeName: '周末加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '客户活动策划',
    approvalStatus: 0,
    approvalStatusName: '待审批',
    createTime: '2026-04-04 17:00:00',
    updateTime: '2026-04-04 17:00:00'
  },
  {
    id: 8,
    employeeId: 10,
    employeeCode: 'E010',
    employeeName: '陈十二',
    departmentName: '技术部',
    overtimeDate: '2026-04-04',
    startTime: '20:00',
    endTime: '24:00',
    overtimeHours: 4,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 2,
    compensationTypeName: '调休',
    reason: '数据库迁移',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '李经理',
    approvalTime: '2026-04-04 19:00:00',
    approvalComment: '同意，注意安全',
    createTime: '2026-04-04 18:30:00',
    updateTime: '2026-04-04 19:00:00'
  },
  {
    id: 9,
    employeeId: 11,
    employeeCode: 'E011',
    employeeName: '刘十三',
    departmentName: '人事部',
    overtimeDate: '2026-03-30',
    startTime: '19:00',
    endTime: '22:00',
    overtimeHours: 3,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '月度考勤统计',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '赵主管',
    approvalTime: '2026-03-30 18:30:00',
    approvalComment: '批准',
    createTime: '2026-03-30 18:00:00',
    updateTime: '2026-03-30 18:30:00'
  },
  {
    id: 10,
    employeeId: 12,
    employeeCode: 'E012',
    employeeName: '黄十四',
    departmentName: '财务部',
    overtimeDate: '2026-03-31',
    startTime: '19:00',
    endTime: '23:00',
    overtimeHours: 4,
    overtimeType: 1,
    overtimeTypeName: '工作日加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '月末财务结算',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '孙经理',
    approvalTime: '2026-03-31 18:00:00',
    approvalComment: '同意',
    createTime: '2026-03-31 17:30:00',
    updateTime: '2026-03-31 18:00:00'
  },
  {
    id: 11,
    employeeId: 1,
    employeeCode: 'E001',
    employeeName: '张三',
    departmentName: '技术部',
    overtimeDate: '2026-04-06',
    startTime: '10:00',
    endTime: '18:00',
    overtimeHours: 8,
    overtimeType: 2,
    overtimeTypeName: '周末加班',
    compensationType: 2,
    compensationTypeName: '调休',
    reason: '系统升级维护',
    approvalStatus: 0,
    approvalStatusName: '待审批',
    createTime: '2026-04-05 16:00:00',
    updateTime: '2026-04-05 16:00:00'
  },
  {
    id: 12,
    employeeId: 13,
    employeeCode: 'E013',
    employeeName: '林十五',
    departmentName: '技术部',
    overtimeDate: '2026-04-01',
    startTime: '09:00',
    endTime: '17:00',
    overtimeHours: 8,
    overtimeType: 3,
    overtimeTypeName: '节假日加班',
    compensationType: 1,
    compensationTypeName: '加班费',
    reason: '紧急故障处理',
    approvalStatus: 1,
    approvalStatusName: '已批准',
    approver: '李经理',
    approvalTime: '2026-03-31 20:00:00',
    approvalComment: '紧急情况，批准',
    createTime: '2026-03-31 19:30:00',
    updateTime: '2026-03-31 20:00:00'
  }
]

// 创建 CRUD Mock
const overtimeMock = createCrudMock<OvertimeApplication>(alignEmployeeFields(initialData), {
  searchFields: ['employeeCode', 'employeeName']
})

/**
 * 获取加班申请列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: OvertimeApplicationListParams) {
  const { departmentId, overtimeType, approvalStatus, overtimeDateStart, overtimeDateEnd, ...otherParams } = params
  let result = overtimeMock.getList(otherParams)

  // 部门筛选（简化处理）
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    // 实际应该根据部门ID匹配
  }

  // 加班类型筛选
  if (overtimeType !== undefined && overtimeType !== null && overtimeType !== '') {
    const typeValue = typeof overtimeType === 'string' ? parseInt(overtimeType) : overtimeType
    result.list = result.list.filter(item => item.overtimeType === typeValue)
  }

  // 审批状态筛选
  if (approvalStatus !== undefined && approvalStatus !== null && approvalStatus !== '') {
    const statusValue = typeof approvalStatus === 'string' ? parseInt(approvalStatus) : approvalStatus
    result.list = result.list.filter(item => item.approvalStatus === statusValue)
  }

  // 加班日期范围筛选
  if (overtimeDateStart) {
    result.list = result.list.filter(item => item.overtimeDate >= overtimeDateStart)
  }
  if (overtimeDateEnd) {
    result.list = result.list.filter(item => item.overtimeDate <= overtimeDateEnd)
  }

  result.total = result.list.length
  return result
}

/**
 * 添加加班申请 Mock 函数（带自定义处理）
 */
export function addOvertimeApplicationMock(data: Partial<OvertimeApplication>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    overtimeTypeName: overtimeTypeMap[data.overtimeType || 1] || '工作日加班',
    compensationTypeName: compensationTypeMap[data.compensationType || 1] || '加班费',
    approvalStatusName: approvalStatusMap[data.approvalStatus || 1] || '待审批',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as OvertimeApplication
  return overtimeMock.add(newData)
}

/**
 * 更新加班申请 Mock 函数（带自定义处理）
 */
export function updateOvertimeApplicationMock(data: Partial<OvertimeApplication>) {
  const updateData = {
    ...data,
    overtimeTypeName: data.overtimeType !== undefined ? overtimeTypeMap[data.overtimeType] : undefined,
    compensationTypeName: data.compensationType !== undefined ? compensationTypeMap[data.compensationType] : undefined,
    approvalStatusName: data.approvalStatus !== undefined ? approvalStatusMap[data.approvalStatus] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return overtimeMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = overtimeMock.getDetail
export const deleteOvertimeApplicationMock = overtimeMock.delete
export const batchDeleteOvertimeApplicationsMock = overtimeMock.batchDelete

/**
 * 批准加班申请 Mock 函数
 */
export function approveOvertimeApplicationMock(id: number, data: { approvalComment?: string }) {
  const application = initialData.find(item => item.id === id)
  if (!application) {
    throw new Error('加班申请不存在')
  }

  if (application.approvalStatus !== 0) {
    throw new Error('该申请已审批，无法重复审批')
  }

  application.approvalStatus = 1
  application.approvalStatusName = '已批准'
  application.approvalComment = data.approvalComment || ''
  application.approver = '当前审批人'
  application.approvalTime = new Date().toLocaleString('zh-CN')
  application.updateTime = new Date().toLocaleString('zh-CN')

  return application
}

/**
 * 拒绝加班申请 Mock 函数
 */
export function rejectOvertimeApplicationMock(id: number, data: { approvalComment: string }) {
  const application = initialData.find(item => item.id === id)
  if (!application) {
    throw new Error('加班申请不存在')
  }

  if (application.approvalStatus !== 0) {
    throw new Error('该申请已审批，无法重复审批')
  }

  application.approvalStatus = 2
  application.approvalStatusName = '已拒绝'
  application.approvalComment = data.approvalComment
  application.approver = '当前审批人'
  application.approvalTime = new Date().toLocaleString('zh-CN')
  application.updateTime = new Date().toLocaleString('zh-CN')

  return application
}
