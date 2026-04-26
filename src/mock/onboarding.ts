// @ts-nocheck
import type {
  OnboardingApplication,
  OnboardingListParams,
  ApprovalRecord,
  DocumentItem,
  ProcedureItem
} from '@/types/onboarding'

// 入职申请数据存储
let applications: OnboardingApplication[] = [
  {
    id: 1,
    applicationNo: 'ONB202604001',
    candidateName: '张三',
    gender: 1,
    idNumber: '110101199001011234',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 1,
    positionName: '前端工程师',
    expectedDate: '2026-04-15',
    status: 1,
    statusName: '待审批',
    applicant: '李HR',
    applicantId: 1,
    applicationTime: '2026-04-01 09:00:00',
    approvalRecords: [],
    documents: [
      { id: 1, name: '劳动合同', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 2, name: '身份证复印件', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 3, name: '学历证书', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 4, name: '照片（2寸白底）', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 5, name: '离职证明', required: false, submitted: false, submitTime: '', remark: '' },
      { id: 6, name: '健康体检报告', required: false, submitted: false, submitTime: '', remark: '' }
    ],
    procedures: [
      { id: 1, name: '签订劳动合同', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 2, name: '录入员工档案', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 3, name: '分配员工工号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 4, name: '开通系统账号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 5, name: '分配办公用品', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 6, name: '安排入职培训', completed: false, handler: '', handleTime: '', remark: '' }
    ],
    employeeNo: '',
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-01 09:00:00'
  },
  {
    id: 2,
    applicationNo: 'ONB202604002',
    candidateName: '李四',
    gender: 2,
    idNumber: '110101199102025678',
    phone: '13800138002',
    email: 'lisi@example.com',
    departmentId: 2,
    departmentName: '产品部',
    positionId: 3,
    positionName: '产品经理',
    expectedDate: '2026-04-20',
    status: 3,
    statusName: '待办理',
    applicant: '李HR',
    applicantId: 1,
    applicationTime: '2026-04-02 10:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '王部长',
        approverId: 2,
        result: 1,
        resultName: '通过',
        comment: '同意入职',
        approvalTime: '2026-04-02 14:00:00'
      }
    ],
    documents: [
      { id: 1, name: '劳动合同', required: true, submitted: true, submitTime: '2026-04-03 09:00:00', remark: '' },
      { id: 2, name: '身份证复印件', required: true, submitted: true, submitTime: '2026-04-03 09:00:00', remark: '' },
      { id: 3, name: '学历证书', required: true, submitted: true, submitTime: '2026-04-03 09:00:00', remark: '' },
      { id: 4, name: '照片（2寸白底）', required: true, submitted: true, submitTime: '2026-04-03 09:00:00', remark: '' },
      { id: 5, name: '离职证明', required: false, submitted: false, submitTime: '', remark: '' },
      { id: 6, name: '健康体检报告', required: false, submitted: false, submitTime: '', remark: '' }
    ],
    procedures: [
      { id: 1, name: '签订劳动合同', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 2, name: '录入员工档案', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 3, name: '分配员工工号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 4, name: '开通系统账号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 5, name: '分配办公用品', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 6, name: '安排入职培训', completed: false, handler: '', handleTime: '', remark: '' }
    ],
    employeeNo: '',
    createTime: '2026-04-02 10:00:00',
    updateTime: '2026-04-03 09:00:00'
  },
  {
    id: 3,
    applicationNo: 'ONB202604003',
    candidateName: '王五',
    gender: 1,
    idNumber: '110101199203039012',
    phone: '13800138003',
    email: 'wangwu@example.com',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 2,
    positionName: '后端工程师',
    expectedDate: '2026-04-10',
    status: 5,
    statusName: '已完成',
    applicant: '李HR',
    applicantId: 1,
    applicationTime: '2026-03-25 09:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '张经理',
        approverId: 3,
        result: 1,
        resultName: '通过',
        comment: '技术能力符合要求',
        approvalTime: '2026-03-25 15:00:00'
      }
    ],
    documents: [
      { id: 1, name: '劳动合同', required: true, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' },
      { id: 2, name: '身份证复印件', required: true, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' },
      { id: 3, name: '学历证书', required: true, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' },
      { id: 4, name: '照片（2寸白底）', required: true, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' },
      { id: 5, name: '离职证明', required: false, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' },
      { id: 6, name: '健康体检报告', required: false, submitted: true, submitTime: '2026-03-26 09:00:00', remark: '' }
    ],
    procedures: [
      { id: 1, name: '签订劳动合同', completed: true, handler: '李HR', handleTime: '2026-03-27 09:00:00', remark: '' },
      { id: 2, name: '录入员工档案', completed: true, handler: '李HR', handleTime: '2026-03-27 09:30:00', remark: '' },
      { id: 3, name: '分配员工工号', completed: true, handler: '系统自动', handleTime: '2026-03-27 09:30:00', remark: '工号：01202600001' },
      { id: 4, name: '开通系统账号', completed: true, handler: '系统自动', handleTime: '2026-03-27 09:30:00', remark: '账号：01202600001' },
      { id: 5, name: '分配办公用品', completed: true, handler: '李HR', handleTime: '2026-03-27 10:00:00', remark: '' },
      { id: 6, name: '安排入职培训', completed: true, handler: '李HR', handleTime: '2026-03-27 10:30:00', remark: '' }
    ],
    employeeNo: '01202600001',
    createTime: '2026-03-25 09:00:00',
    updateTime: '2026-03-27 10:30:00'
  },
  {
    id: 4,
    applicationNo: 'ONB202604004',
    candidateName: '赵六',
    gender: 2,
    idNumber: '110101199304043456',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    departmentId: 3,
    departmentName: '市场部',
    positionId: 5,
    positionName: '市场专员',
    expectedDate: '2026-04-18',
    status: 2,
    statusName: '已拒绝',
    applicant: '李HR',
    applicantId: 1,
    applicationTime: '2026-04-01 11:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '陈总监',
        approverId: 4,
        result: 2,
        resultName: '拒绝',
        comment: '暂不需要该岗位人员',
        approvalTime: '2026-04-01 16:00:00'
      }
    ],
    documents: [
      { id: 1, name: '劳动合同', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 2, name: '身份证复印件', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 3, name: '学历证书', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 4, name: '照片（2寸白底）', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 5, name: '离职证明', required: false, submitted: false, submitTime: '', remark: '' },
      { id: 6, name: '健康体检报告', required: false, submitted: false, submitTime: '', remark: '' }
    ],
    procedures: [
      { id: 1, name: '签订劳动合同', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 2, name: '录入员工档案', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 3, name: '分配员工工号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 4, name: '开通系统账号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 5, name: '分配办公用品', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 6, name: '安排入职培训', completed: false, handler: '', handleTime: '', remark: '' }
    ],
    employeeNo: '',
    createTime: '2026-04-01 11:00:00',
    updateTime: '2026-04-01 16:00:00'
  }
]

let nextId = 5

/**
 * 获取入职申请列表 Mock 函数
 */
export function getOnboardingListMock(params: OnboardingListParams) {
  const {
    applicationNo,
    candidateName,
    departmentId,
    status,
    expectedDateStart,
    expectedDateEnd,
    page = 1,
    pageSize = 20
  } = params
  let filteredData = [...applications]

  // 筛选
  if (applicationNo) {
    filteredData = filteredData.filter(item => item.applicationNo.includes(applicationNo))
  }
  if (candidateName) {
    filteredData = filteredData.filter(item => item.candidateName.includes(candidateName))
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter(item => item.departmentId === deptId)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (expectedDateStart) {
    filteredData = filteredData.filter(item => item.expectedDate >= expectedDateStart)
  }
  if (expectedDateEnd) {
    filteredData = filteredData.filter(item => item.expectedDate <= expectedDateEnd)
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
 * 获取入职申请详情 Mock 函数
 */
export function getOnboardingDetailMock(id: number) {
  return applications.find(item => item.id === id) || null
}

/**
 * 添加入职申请 Mock 函数
 */
export function addOnboardingMock(data: Partial<OnboardingApplication>) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const seq = String(nextId).padStart(3, '0')

  const newApplication: OnboardingApplication = {
    id: nextId++,
    applicationNo: `ONB${year}${month}${seq}`,
    candidateName: data.candidateName || '',
    gender: data.gender || 1,
    idNumber: data.idNumber || '',
    phone: data.phone || '',
    email: data.email || '',
    departmentId: data.departmentId || 0,
    departmentName: data.departmentName || '',
    positionId: data.positionId || 0,
    positionName: data.positionName || '',
    expectedDate: data.expectedDate || '',
    status: 1,
    statusName: '待审批',
    applicant: data.applicant || '当前用户',
    applicantId: data.applicantId || 1,
    applicationTime: now,
    approvalRecords: [],
    documents: [
      { id: 1, name: '劳动合同', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 2, name: '身份证复印件', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 3, name: '学历证书', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 4, name: '照片（2寸白底）', required: true, submitted: false, submitTime: '', remark: '' },
      { id: 5, name: '离职证明', required: false, submitted: false, submitTime: '', remark: '' },
      { id: 6, name: '健康体检报告', required: false, submitted: false, submitTime: '', remark: '' }
    ],
    procedures: [
      { id: 1, name: '签订劳动合同', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 2, name: '录入员工档案', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 3, name: '分配员工工号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 4, name: '开通系统账号', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 5, name: '分配办公用品', completed: false, handler: '', handleTime: '', remark: '' },
      { id: 6, name: '安排入职培训', completed: false, handler: '', handleTime: '', remark: '' }
    ],
    employeeNo: '',
    createTime: now,
    updateTime: now
  }
  applications.push(newApplication)
  return newApplication
}

/**
 * 更新入职申请 Mock 函数
 */
export function updateOnboardingMock(data: Partial<OnboardingApplication>) {
  const index = applications.findIndex(item => item.id === data.id)
  if (index !== -1) {
    applications[index] = {
      ...applications[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
    }
    return applications[index]
  }
  throw new Error('数据不存在')
}

/**
 * 删除入职申请 Mock 函数
 */
export function deleteOnboardingMock(id: number) {
  const index = applications.findIndex(item => item.id === id)
  if (index !== -1) {
    applications.splice(index, 1)
    return true
  }
  throw new Error('数据不存在')
}

/**
 * 审批入职申请 Mock 函数
 */
export function approveOnboardingMock(data: { id: number; result: number; comment: string; approver: string; approverId: number }) {
  const index = applications.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('数据不存在')
  }

  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  const approvalRecord: ApprovalRecord = {
    id: applications[index].approvalRecords.length + 1,
    approver: data.approver,
    approverId: data.approverId,
    result: data.result,
    resultName: data.result === 1 ? '通过' : '拒绝',
    comment: data.comment,
    approvalTime: now
  }

  applications[index].approvalRecords.push(approvalRecord)
  applications[index].status = data.result === 1 ? 3 : 2
  applications[index].statusName = data.result === 1 ? '待办理' : '已拒绝'
  applications[index].updateTime = now

  return applications[index]
}

/**
 * 更新资料清单 Mock 函数
 */
export function updateDocumentsMock(data: { id: number; documents: DocumentItem[] }) {
  const index = applications.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('数据不存在')
  }

  applications[index].documents = data.documents
  applications[index].updateTime = new Date().toLocaleString('zh-CN', { hour12: false })

  return applications[index]
}

/**
 * 更新手续清单 Mock 函数
 */
export function updateProceduresMock(data: { id: number; procedures: ProcedureItem[] }) {
  const index = applications.findIndex(item => item.id === data.id)
  if (index === -1) {
    throw new Error('数据不存在')
  }

  const now = new Date().toLocaleString('zh-CN', { hour12: false })
  applications[index].procedures = data.procedures
  applications[index].updateTime = now

  // 检查所有手续是否完成
  const allCompleted = data.procedures.every(p => p.completed)
  if (allCompleted) {
    // 生成员工工号
    const dept = applications[index].departmentId.toString().padStart(2, '0')
    const year = new Date().getFullYear()
    const seq = String(nextId).padStart(4, '0')
    const employeeNo = `${dept}${year}${seq}`

    applications[index].employeeNo = employeeNo
    applications[index].status = 5
    applications[index].statusName = '已完成'
  }

  return applications[index]
}

/**
 * 撤回入职申请 Mock 函数
 */
export function withdrawOnboardingMock(id: number) {
  const index = applications.findIndex(item => item.id === id)
  if (index === -1) {
    throw new Error('数据不存在')
  }

  if (applications[index].status !== 1) {
    throw new Error('只有待审批状态的申请可以撤回')
  }

  applications[index].status = 6
  applications[index].statusName = '已撤回'
  applications[index].updateTime = new Date().toLocaleString('zh-CN', { hour12: false })

  return applications[index]
}

/**
 * 批量导入入职申请 Mock 函数
 */
export function batchImportOnboardingMock(data: Partial<OnboardingApplication>[]) {
  if (data.length > 100) {
    throw new Error('批量导入最多支持100条记录')
  }

  const successList: OnboardingApplication[] = []
  const failList: { row: number; reason: string }[] = []

  data.forEach((item, index) => {
    try {
      // 验证必填字段
      if (!item.candidateName || !item.idNumber || !item.phone || !item.departmentId || !item.positionId || !item.expectedDate) {
        failList.push({ row: index + 1, reason: '必填字段缺失' })
        return
      }

      // 验证身份证号格式
      if (!/^\d{17}[\dXx]$/.test(item.idNumber)) {
        failList.push({ row: index + 1, reason: '身份证号格式错误' })
        return
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(item.phone)) {
        failList.push({ row: index + 1, reason: '手机号格式错误' })
        return
      }

      const newApplication = addOnboardingMock(item)
      successList.push(newApplication)
    } catch (error: any) {
      failList.push({ row: index + 1, reason: error.message })
    }
  })

  return {
    successCount: successList.length,
    failCount: failList.length,
    successList,
    failList
  }
}
