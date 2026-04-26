import type { MakeupClockInApplication, MakeupClockInApplicationListParams } from '@/types/attendance'
import { createCrudMock } from '@/utils/crud'

// 补卡类型映射
const makeupTypeMap: Record<number, string> = {
  1: '上班卡',
  2: '下班卡'
}

// 审批状态映射
const approvalStatusMap: Record<number, string> = {
  1: '待审批',
  2: '已通过',
  3: '已拒绝'
}

// 初始数据
const initialData: MakeupClockInApplication[] = [
  {
    id: 1,
    employeeId: 2,
    employeeCode: 'E002',
    employeeName: '李四',
    departmentName: '产品部',
    makeupDate: '2026-04-01',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '打卡机故障，未能正常打卡',
    attachments: '/uploads/makeup/20260401_002_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '王总监',
    approvalTime: '2026-04-01 14:00:00',
    approvalComment: '情况属实，同意补卡',
    createTime: '2026-04-01 10:30:00',
    updateTime: '2026-04-01 14:00:00'
  },
  {
    id: 2,
    employeeId: 3,
    employeeCode: 'E003',
    employeeName: '王五',
    departmentName: '技术部',
    makeupDate: '2026-04-01',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '忘记打卡，实际工作到18:00',
    attachments: '/uploads/makeup/20260401_003_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '李经理',
    approvalTime: '2026-04-02 09:30:00',
    approvalComment: '同意',
    createTime: '2026-04-02 09:00:00',
    updateTime: '2026-04-02 09:30:00'
  },
  {
    id: 3,
    employeeId: 7,
    employeeCode: 'E007',
    employeeName: '吴九',
    departmentName: '技术部',
    makeupDate: '2026-04-02',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '手机没电，无法使用App打卡',
    attachments: '/uploads/makeup/20260402_007_proof.jpg',
    approvalStatus: 1,
    approvalStatusName: '待审批',
    createTime: '2026-04-02 15:00:00',
    updateTime: '2026-04-02 15:00:00'
  },
  {
    id: 4,
    employeeId: 8,
    employeeCode: 'E008',
    employeeName: '郑十',
    departmentName: '产品部',
    makeupDate: '2026-04-02',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '参加会议忘记打卡',
    attachments: '/uploads/makeup/20260402_008_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '王总监',
    approvalTime: '2026-04-03 10:00:00',
    approvalComment: '批准',
    createTime: '2026-04-03 09:30:00',
    updateTime: '2026-04-03 10:00:00'
  },
  {
    id: 5,
    employeeId: 10,
    employeeCode: 'E010',
    employeeName: '陈十二',
    departmentName: '技术部',
    makeupDate: '2026-04-03',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '打卡设备识别失败',
    attachments: '/uploads/makeup/20260403_010_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '李经理',
    approvalTime: '2026-04-03 16:00:00',
    approvalComment: '同意补卡',
    createTime: '2026-04-03 14:30:00',
    updateTime: '2026-04-03 16:00:00'
  },
  {
    id: 6,
    employeeId: 11,
    employeeCode: 'E011',
    employeeName: '刘十三',
    departmentName: '人事部',
    makeupDate: '2026-04-03',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '外出办事忘记打卡',
    attachments: '/uploads/makeup/20260403_011_proof.jpg',
    approvalStatus: 3,
    approvalStatusName: '已拒绝',
    approver: '赵主管',
    approvalTime: '2026-04-04 09:00:00',
    approvalComment: '无充分理由，不予批准',
    createTime: '2026-04-04 08:30:00',
    updateTime: '2026-04-04 09:00:00'
  },
  {
    id: 7,
    employeeId: 12,
    employeeCode: 'E012',
    employeeName: '黄十四',
    departmentName: '财务部',
    makeupDate: '2026-04-04',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '系统故障未记录打卡',
    attachments: '/uploads/makeup/20260404_012_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '孙经理',
    approvalTime: '2026-04-04 15:00:00',
    approvalComment: '同意',
    createTime: '2026-04-04 14:00:00',
    updateTime: '2026-04-04 15:00:00'
  },
  {
    id: 8,
    employeeId: 13,
    employeeCode: 'E013',
    employeeName: '林十五',
    departmentName: '技术部',
    makeupDate: '2026-04-04',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '加班忘记打卡',
    attachments: '/uploads/makeup/20260404_013_proof.jpg',
    approvalStatus: 1,
    approvalStatusName: '待审批',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-05 09:00:00'
  },
  {
    id: 9,
    employeeId: 14,
    employeeCode: 'E014',
    employeeName: '杨十六',
    departmentName: '产品部',
    makeupDate: '2026-04-05',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '网络问题导致打卡失败',
    attachments: '/uploads/makeup/20260405_014_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '王总监',
    approvalTime: '2026-04-05 16:00:00',
    approvalComment: '批准',
    createTime: '2026-04-05 15:00:00',
    updateTime: '2026-04-05 16:00:00'
  },
  {
    id: 10,
    employeeId: 15,
    employeeCode: 'E015',
    employeeName: '何十七',
    departmentName: '市场部',
    makeupDate: '2026-04-05',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '客户拜访回来忘记打卡',
    attachments: '/uploads/makeup/20260405_015_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '张经理',
    approvalTime: '2026-04-06 10:00:00',
    approvalComment: '同意补卡',
    createTime: '2026-04-06 09:30:00',
    updateTime: '2026-04-06 10:00:00'
  },
  {
    id: 11,
    employeeId: 16,
    employeeCode: 'E016',
    employeeName: '罗十八',
    departmentName: '技术部',
    makeupDate: '2026-03-31',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '打卡机维修中',
    attachments: '/uploads/makeup/20260331_016_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '李经理',
    approvalTime: '2026-03-31 14:00:00',
    approvalComment: '同意',
    createTime: '2026-03-31 13:00:00',
    updateTime: '2026-03-31 14:00:00'
  },
  {
    id: 12,
    employeeId: 17,
    employeeCode: 'E017',
    employeeName: '高十九',
    departmentName: '人事部',
    makeupDate: '2026-03-31',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '忘记打卡',
    attachments: '/uploads/makeup/20260331_017_proof.jpg',
    approvalStatus: 3,
    approvalStatusName: '已拒绝',
    approver: '赵主管',
    approvalTime: '2026-04-01 09:00:00',
    approvalComment: '本月已有两次补卡记录，不予批准',
    createTime: '2026-04-01 08:30:00',
    updateTime: '2026-04-01 09:00:00'
  },
  {
    id: 13,
    employeeId: 18,
    employeeCode: 'E018',
    employeeName: '梁二十',
    departmentName: '财务部',
    makeupDate: '2026-04-01',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: 'App闪退无法打卡',
    attachments: '/uploads/makeup/20260401_018_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '孙经理',
    approvalTime: '2026-04-01 16:00:00',
    approvalComment: '批准',
    createTime: '2026-04-01 15:00:00',
    updateTime: '2026-04-01 16:00:00'
  },
  {
    id: 14,
    employeeId: 19,
    employeeCode: 'E019',
    employeeName: '宋二十一',
    departmentName: '技术部',
    makeupDate: '2026-04-02',
    makeupTime: '18:00',
    makeupType: 2,
    makeupTypeName: '下班卡',
    reason: '开会忘记打卡',
    attachments: '/uploads/makeup/20260402_019_proof.jpg',
    approvalStatus: 1,
    approvalStatusName: '待审批',
    createTime: '2026-04-03 09:00:00',
    updateTime: '2026-04-03 09:00:00'
  },
  {
    id: 15,
    employeeId: 20,
    employeeCode: 'E020',
    employeeName: '唐二十二',
    departmentName: '产品部',
    makeupDate: '2026-04-03',
    makeupTime: '09:00',
    makeupType: 1,
    makeupTypeName: '上班卡',
    reason: '打卡设备故障',
    attachments: '/uploads/makeup/20260403_020_proof.jpg',
    approvalStatus: 2,
    approvalStatusName: '已通过',
    approver: '王总监',
    approvalTime: '2026-04-03 17:00:00',
    approvalComment: '同意补卡',
    createTime: '2026-04-03 16:00:00',
    updateTime: '2026-04-03 17:00:00'
  }
]

// 创建 CRUD Mock
const makeupClockInMock = createCrudMock<MakeupClockInApplication>(initialData, {
  searchFields: ['employeeCode', 'employeeName']
})

/**
 * 获取补卡申请列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: MakeupClockInApplicationListParams) {
  const { departmentId, makeupDateStart, makeupDateEnd, approvalStatus, ...otherParams } = params
  let result = makeupClockInMock.getList(otherParams)

  // 部门筛选
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    // 简化处理，实际应该根据部门ID匹配
  }

  // 补卡日期范围筛选
  if (makeupDateStart) {
    result.list = result.list.filter(item => item.makeupDate >= makeupDateStart)
  }
  if (makeupDateEnd) {
    result.list = result.list.filter(item => item.makeupDate <= makeupDateEnd)
  }

  // 审批状态筛选
  if (approvalStatus !== undefined && approvalStatus !== null && approvalStatus !== '') {
    const statusValue = typeof approvalStatus === 'string' ? parseInt(approvalStatus) : approvalStatus
    result.list = result.list.filter(item => item.approvalStatus === statusValue)
  }

  result.total = result.list.length
  return result
}

/**
 * 添加补卡申请 Mock 函数（带自定义处理）
 */
export function addMakeupClockInApplicationMock(data: Partial<MakeupClockInApplication>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    makeupTypeName: makeupTypeMap[data.makeupType || 1] || '上班卡',
    approvalStatusName: approvalStatusMap[data.approvalStatus || 1] || '待审批',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as MakeupClockInApplication
  return makeupClockInMock.add(newData)
}

/**
 * 更新补卡申请 Mock 函数（带自定义处理）
 */
export function updateMakeupClockInApplicationMock(data: Partial<MakeupClockInApplication>) {
  const updateData = {
    ...data,
    makeupTypeName: data.makeupType !== undefined ? makeupTypeMap[data.makeupType] : undefined,
    approvalStatusName: data.approvalStatus !== undefined ? approvalStatusMap[data.approvalStatus] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return makeupClockInMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = makeupClockInMock.getDetail
export const deleteMakeupClockInApplicationMock = makeupClockInMock.delete
export const batchDeleteMakeupClockInApplicationsMock = makeupClockInMock.batchDelete

/**
 * 批准补卡申请 Mock 函数
 */
export function approveMakeupClockInApplicationMock(id: number, data: { approvalComment?: string }) {
  const application = initialData.find(item => item.id === id)
  if (!application) {
    throw new Error('补卡申请不存在')
  }

  if (application.approvalStatus !== 1) {
    throw new Error('该申请已审批，无法重复审批')
  }

  application.approvalStatus = 2
  application.approvalStatusName = '已通过'
  application.approvalComment = data.approvalComment || ''
  application.approver = '当前审批人'
  application.approvalTime = new Date().toLocaleString('zh-CN')
  application.updateTime = new Date().toLocaleString('zh-CN')

  return application
}

/**
 * 拒绝补卡申请 Mock 函数
 */
export function rejectMakeupClockInApplicationMock(id: number, data: { approvalComment: string }) {
  const application = initialData.find(item => item.id === id)
  if (!application) {
    throw new Error('补卡申请不存在')
  }

  if (application.approvalStatus !== 1) {
    throw new Error('该申请已审批，无法重复审批')
  }

  application.approvalStatus = 3
  application.approvalStatusName = '已拒绝'
  application.approvalComment = data.approvalComment
  application.approver = '当前审批人'
  application.approvalTime = new Date().toLocaleString('zh-CN')
  application.updateTime = new Date().toLocaleString('zh-CN')

  return application
}
