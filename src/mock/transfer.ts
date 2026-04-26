import { createCrudMock } from '@/utils/crud'
import type { Transfer, TransferListParams } from '@/types/transfer'
import { TransferType, TransferStatus } from '@/types/transfer'

/**
 * 员工异动 Mock 初始数据
 */
const initialData: Transfer[] = [
  {
    id: 1,
    transferNo: 'TR202404050001',
    employeeId: 1,
    employeeNo: 'EMP001',
    employeeName: '张三',
    type: TransferType.POSITION_CHANGE,
    applyDate: '2024-03-15',
    effectiveDate: '2024-04-01',
    status: TransferStatus.EFFECTIVE,
    originalDepartmentId: 1,
    originalDepartmentName: '技术部',
    originalPositionId: 1,
    originalPositionName: '前端开发工程师',
    newDepartmentId: 2,
    newDepartmentName: '产品部',
    newPositionId: 5,
    newPositionName: '产品经理',
    applicantId: 10,
    applicantName: '李经理',
    departmentApproverId: 20,
    departmentApproverName: '王总监',
    departmentApprovalTime: '2024-03-16 14:20:00',
    departmentApprovalComment: '同意调岗',
    hrApproverId: 30,
    hrApproverName: '赵HR',
    hrApprovalTime: '2024-03-17 10:30:00',
    hrApprovalComment: '已办理调岗手续',
    reason: '个人职业发展需要，申请转岗至产品部',
    remark: '',
    createTime: '2024-03-15 10:30:00',
    updateTime: '2024-03-17 10:30:00'
  },
  {
    id: 2,
    transferNo: 'TR202404050002',
    employeeId: 2,
    employeeNo: 'EMP002',
    employeeName: '李四',
    type: TransferType.PROMOTION,
    applyDate: '2024-03-20',
    effectiveDate: '2024-04-10',
    status: TransferStatus.APPROVED,
    originalDepartmentId: 1,
    originalDepartmentName: '技术部',
    originalPositionId: 1,
    originalPositionName: '前端开发工程师',
    newDepartmentId: 1,
    newDepartmentName: '技术部',
    newPositionId: 2,
    newPositionName: '高级前端开发工程师',
    originalSalary: 15000,
    newSalary: 20000,
    adjustmentAmount: 5000,
    applicantId: 10,
    applicantName: '李经理',
    departmentApproverId: 20,
    departmentApproverName: '王总监',
    departmentApprovalTime: '2024-03-21 15:00:00',
    departmentApprovalComment: '工作表现优秀，同意晋升',
    hrApproverId: 30,
    hrApproverName: '赵HR',
    hrApprovalTime: '2024-03-22 09:00:00',
    hrApprovalComment: '符合晋升条件，同意',
    reason: '工作表现优秀，技术能力突出，符合晋升条件',
    remark: '',
    createTime: '2024-03-20 09:15:00',
    updateTime: '2024-03-22 09:00:00'
  },
  {
    id: 3,
    transferNo: 'TR202404050003',
    employeeId: 3,
    employeeNo: 'EMP003',
    employeeName: '王五',
    type: TransferType.SALARY_ADJUSTMENT,
    applyDate: '2024-03-25',
    effectiveDate: '2024-04-15',
    status: TransferStatus.APPROVING,
    originalDepartmentId: 1,
    originalDepartmentName: '技术部',
    originalPositionId: 3,
    originalPositionName: '后端开发工程师',
    newDepartmentId: 1,
    newDepartmentName: '技术部',
    newPositionId: 3,
    newPositionName: '后端开发工程师',
    originalSalary: 16000,
    newSalary: 18000,
    adjustmentAmount: 2000,
    adjustmentReason: '年度调薪',
    applicantId: 10,
    applicantName: '李经理',
    departmentApproverId: 20,
    departmentApproverName: '王总监',
    departmentApprovalTime: '2024-03-26 10:00:00',
    departmentApprovalComment: '同意调薪',
    reason: '年度调薪，工作表现良好',
    remark: '',
    createTime: '2024-03-25 14:30:00',
    updateTime: '2024-03-26 10:00:00'
  },
  {
    id: 4,
    transferNo: 'TR202404050004',
    employeeId: 4,
    employeeNo: 'EMP004',
    employeeName: '赵六',
    type: TransferType.DEMOTION,
    applyDate: '2024-03-28',
    effectiveDate: '2024-04-20',
    status: TransferStatus.REJECTED,
    originalDepartmentId: 2,
    originalDepartmentName: '产品部',
    originalPositionId: 6,
    originalPositionName: '高级产品经理',
    newDepartmentId: 2,
    newDepartmentName: '产品部',
    newPositionId: 5,
    newPositionName: '产品经理',
    originalSalary: 22000,
    newSalary: 18000,
    adjustmentAmount: -4000,
    applicantId: 11,
    applicantName: '周经理',
    departmentApproverId: 21,
    departmentApproverName: '吴总监',
    departmentApprovalTime: '2024-03-29 16:00:00',
    departmentApprovalComment: '不同意降职，建议其他处理方式',
    reason: '工作失误较多，不符合高级岗位要求',
    remark: '',
    createTime: '2024-03-28 11:00:00',
    updateTime: '2024-03-29 16:00:00'
  },
  {
    id: 5,
    transferNo: 'TR202404050005',
    employeeId: 5,
    employeeNo: 'EMP005',
    employeeName: '孙七',
    type: TransferType.CONVERSION,
    applyDate: '2024-04-01',
    effectiveDate: '2024-04-30',
    status: TransferStatus.PENDING,
    originalDepartmentId: 3,
    originalDepartmentName: '销售部',
    originalPositionId: 8,
    originalPositionName: '销售专员（试用期）',
    newDepartmentId: 3,
    newDepartmentName: '销售部',
    newPositionId: 8,
    newPositionName: '销售专员',
    originalSalary: 10000,
    newSalary: 12000,
    adjustmentAmount: 2000,
    applicantId: 12,
    applicantName: '郑经理',
    reason: '试用期满，表现良好，申请转正',
    remark: '',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-01 09:00:00'
  },
  {
    id: 6,
    transferNo: 'TR202404050006',
    employeeId: 6,
    employeeNo: 'EMP006',
    employeeName: '周八',
    type: TransferType.PROBATION_EXTENSION,
    applyDate: '2024-04-02',
    effectiveDate: '2024-05-01',
    status: TransferStatus.WITHDRAWN,
    originalDepartmentId: 4,
    originalDepartmentName: '人力资源部',
    originalPositionId: 10,
    originalPositionName: 'HR专员（试用期）',
    newDepartmentId: 4,
    newDepartmentName: '人力资源部',
    newPositionId: 10,
    newPositionName: 'HR专员（试用期延长）',
    applicantId: 13,
    applicantName: '冯经理',
    reason: '试用期表现一般，需要延长试用期观察',
    remark: '员工主动申请撤回',
    createTime: '2024-04-02 10:30:00',
    updateTime: '2024-04-02 15:00:00'
  },
  {
    id: 7,
    transferNo: 'TR202404050007',
    employeeId: 7,
    employeeNo: 'EMP007',
    employeeName: '吴九',
    type: TransferType.POSITION_CHANGE,
    applyDate: '2024-04-03',
    effectiveDate: '2024-04-25',
    status: TransferStatus.EFFECTIVE,
    originalDepartmentId: 5,
    originalDepartmentName: '财务部',
    originalPositionId: 12,
    originalPositionName: '会计',
    newDepartmentId: 5,
    newDepartmentName: '财务部',
    newPositionId: 13,
    newPositionName: '出纳',
    applicantId: 14,
    applicantName: '陈经理',
    departmentApproverId: 22,
    departmentApproverName: '韩总监',
    departmentApprovalTime: '2024-04-04 11:00:00',
    departmentApprovalComment: '同意调岗',
    hrApproverId: 30,
    hrApproverName: '赵HR',
    hrApprovalTime: '2024-04-05 09:30:00',
    hrApprovalComment: '已办理调岗手续',
    reason: '岗位调整需要',
    remark: '',
    createTime: '2024-04-03 14:00:00',
    updateTime: '2024-04-05 09:30:00'
  },
  {
    id: 8,
    transferNo: 'TR202404050008',
    employeeId: 8,
    employeeNo: 'EMP008',
    employeeName: '郑十',
    type: TransferType.PROMOTION,
    applyDate: '2024-04-04',
    effectiveDate: '2024-05-01',
    status: TransferStatus.APPROVED,
    originalDepartmentId: 1,
    originalDepartmentName: '技术部',
    originalPositionId: 3,
    originalPositionName: '后端开发工程师',
    newDepartmentId: 1,
    newDepartmentName: '技术部',
    newPositionId: 4,
    newPositionName: '高级后端开发工程师',
    originalSalary: 18000,
    newSalary: 24000,
    adjustmentAmount: 6000,
    applicantId: 10,
    applicantName: '李经理',
    departmentApproverId: 20,
    departmentApproverName: '王总监',
    departmentApprovalTime: '2024-04-05 10:00:00',
    departmentApprovalComment: '技术能力强，同意晋升',
    hrApproverId: 30,
    hrApproverName: '赵HR',
    hrApprovalTime: '2024-04-05 14:00:00',
    hrApprovalComment: '符合晋升条件，同意',
    reason: '技术能力突出，项目贡献大',
    remark: '',
    createTime: '2024-04-04 09:30:00',
    updateTime: '2024-04-05 14:00:00'
  },
  {
    id: 9,
    transferNo: 'TR202404050009',
    employeeId: 9,
    employeeNo: 'EMP009',
    employeeName: '王十一',
    type: TransferType.SALARY_ADJUSTMENT,
    applyDate: '2024-04-05',
    effectiveDate: '2024-05-01',
    status: TransferStatus.PENDING,
    originalDepartmentId: 2,
    originalDepartmentName: '产品部',
    originalPositionId: 5,
    originalPositionName: '产品经理',
    newDepartmentId: 2,
    newDepartmentName: '产品部',
    newPositionId: 5,
    newPositionName: '产品经理',
    originalSalary: 18000,
    newSalary: 20000,
    adjustmentAmount: 2000,
    adjustmentReason: '年度调薪',
    applicantId: 11,
    applicantName: '周经理',
    reason: '年度调薪，工作表现优秀',
    remark: '',
    createTime: '2024-04-05 10:00:00',
    updateTime: '2024-04-05 10:00:00'
  },
  {
    id: 10,
    transferNo: 'TR202404050010',
    employeeId: 10,
    employeeNo: 'EMP010',
    employeeName: '李十二',
    type: TransferType.CONVERSION,
    applyDate: '2024-04-05',
    effectiveDate: '2024-05-15',
    status: TransferStatus.APPROVING,
    originalDepartmentId: 1,
    originalDepartmentName: '技术部',
    originalPositionId: 1,
    originalPositionName: '前端开发工程师（试用期）',
    newDepartmentId: 1,
    newDepartmentName: '技术部',
    newPositionId: 1,
    newPositionName: '前端开发工程师',
    originalSalary: 12000,
    newSalary: 15000,
    adjustmentAmount: 3000,
    applicantId: 10,
    applicantName: '李经理',
    departmentApproverId: 20,
    departmentApproverName: '王总监',
    departmentApprovalTime: '2024-04-05 15:00:00',
    departmentApprovalComment: '试用期表现优秀，同意转正',
    reason: '试用期满，表现优秀，申请转正',
    remark: '',
    createTime: '2024-04-05 11:00:00',
    updateTime: '2024-04-05 15:00:00'
  }
]

/**
 * 创建 CRUD Mock 函数
 */
export const transferMock = createCrudMock<Transfer>(initialData, {
  searchFields: ['employeeName', 'employeeNo', 'transferNo']
})

/**
 * 获取列表 Mock 函数（支持自定义筛选）
 */
export function getTransferListMock(params: TransferListParams) {
  const {
    keyword,
    type,
    status,
    applyDateStart,
    applyDateEnd,
    effectiveDateStart,
    effectiveDateEnd,
    page = 1,
    pageSize = 20
  } = params

  let filteredData = [...transferMock.getData()]

  // 关键词搜索
  if (keyword) {
    filteredData = filteredData.filter(
      (item) =>
        item.employeeName.includes(keyword) ||
        item.employeeNo.includes(keyword) ||
        item.transferNo.includes(keyword)
    )
  }

  // 异动类型筛选
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter((item) => item.type === typeValue)
  }

  // 状态筛选
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter((item) => item.status === statusValue)
  }

  // 申请日期筛选
  if (applyDateStart) {
    filteredData = filteredData.filter((item) => item.applyDate >= applyDateStart)
  }
  if (applyDateEnd) {
    filteredData = filteredData.filter((item) => item.applyDate <= applyDateEnd)
  }

  // 生效日期筛选
  if (effectiveDateStart) {
    filteredData = filteredData.filter((item) => item.effectiveDate >= effectiveDateStart)
  }
  if (effectiveDateEnd) {
    filteredData = filteredData.filter((item) => item.effectiveDate <= effectiveDateEnd)
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return { list, total }
}

/**
 * 添加异动 Mock 函数
 */
export function addTransferMock(data: Partial<Transfer>) {
  // 生成异动编号
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const existingNos = transferMock
    .getData()
    .map((item) => item.transferNo)
    .filter((no) => no.startsWith(`TR${dateStr}`))
  const nextSeq = existingNos.length + 1
  const transferNo = `TR${dateStr}${String(nextSeq).padStart(4, '0')}`

  return transferMock.add({
    ...data,
    transferNo,
    status: TransferStatus.PENDING
  })
}

/**
 * 更新异动 Mock 函数
 */
export function updateTransferMock(data: Partial<Transfer>) {
  return transferMock.update(data)
}

/**
 * 删除异动 Mock 函数
 */
export function deleteTransferMock(id: number) {
  return transferMock.delete(id)
}

/**
 * 获取详情 Mock 函数
 */
export function getTransferDetailMock(id: number) {
  return transferMock.getDetail(id)
}

/**
 * 审批异动 Mock 函数
 */
export function approveTransferMock(data: {
  id: number
  approved: boolean
  comment: string
  approverType: 'department' | 'hr'
}) {
  const { id, approved, comment, approverType } = data
  const transfer = transferMock.getDetail(id)
  if (!transfer) {
    throw new Error('异动记录不存在')
  }

  const now = new Date().toLocaleString('zh-CN')
  const updateData: Partial<Transfer> = { id }

  if (approverType === 'department') {
    updateData.departmentApproverId = 1
    updateData.departmentApproverName = '当前用户'
    updateData.departmentApprovalTime = now
    updateData.departmentApprovalComment = comment
    if (approved) {
      updateData.status = TransferStatus.APPROVING
    } else {
      updateData.status = TransferStatus.REJECTED
    }
  } else if (approverType === 'hr') {
    updateData.hrApproverId = 1
    updateData.hrApproverName = '当前用户'
    updateData.hrApprovalTime = now
    updateData.hrApprovalComment = comment
    if (approved) {
      updateData.status = TransferStatus.APPROVED
    } else {
      updateData.status = TransferStatus.REJECTED
    }
  }

  return transferMock.update(updateData)
}

/**
 * 撤回异动 Mock 函数
 */
export function withdrawTransferMock(id: number) {
  const transfer = transferMock.getDetail(id)
  if (!transfer) {
    throw new Error('异动记录不存在')
  }

  if (transfer.status !== TransferStatus.PENDING) {
    throw new Error('只能撤回待审批状态的异动记录')
  }

  return transferMock.update({
    id,
    status: TransferStatus.WITHDRAWN
  })
}

/**
 * 生效异动 Mock 函数
 */
export function effectiveTransferMock(id: number) {
  const transfer = transferMock.getDetail(id)
  if (!transfer) {
    throw new Error('异动记录不存在')
  }

  if (transfer.status !== TransferStatus.APPROVED) {
    throw new Error('只能对已通过的异动记录执行生效操作')
  }

  return transferMock.update({
    id,
    status: TransferStatus.EFFECTIVE
  })
}
