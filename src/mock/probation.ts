import type { Probation, ProbationListParams } from '@/types/probation'

// 数据存储
let probations: Probation[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 1,
    positionName: '前端工程师',
    entryDate: '2024-01-15',
    probationMonths: 3,
    regularDate: '2024-04-15',
    status: 0,
    statusName: '试用中',
    remark: '表现良好',
    createTime: '2024-01-15 09:00:00',
    updateTime: '2024-01-15 09:00:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentId: 2,
    departmentName: '产品部',
    positionId: 2,
    positionName: '产品经理',
    entryDate: '2023-12-01',
    probationMonths: 3,
    regularDate: '2024-03-01',
    status: 1,
    statusName: '已转正',
    evaluationScore: 90,
    evaluationComment: '工作认真负责，业务能力强，同意转正',
    evaluatorId: 1,
    evaluatorName: '王经理',
    evaluationTime: '2024-02-28 14:30:00',
    remark: '优秀员工',
    createTime: '2023-12-01 09:00:00',
    updateTime: '2024-02-28 14:30:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 3,
    positionName: '后端工程师',
    entryDate: '2023-11-01',
    probationMonths: 3,
    regularDate: '2024-02-01',
    status: 2,
    statusName: '延长试用',
    evaluationScore: 70,
    evaluationComment: '技术能力尚可，但沟通协作能力需要提升',
    evaluatorId: 1,
    evaluatorName: '王经理',
    evaluationTime: '2024-01-30 10:00:00',
    extensionMonths: 1,
    extensionReason: '需要进一步考察沟通协作能力',
    remark: '延长试用期1个月',
    createTime: '2023-11-01 09:00:00',
    updateTime: '2024-01-30 10:00:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentId: 3,
    departmentName: '市场部',
    positionId: 4,
    positionName: '市场专员',
    entryDate: '2023-10-15',
    probationMonths: 3,
    regularDate: '2024-01-15',
    status: 3,
    statusName: '不合格',
    evaluationScore: 50,
    evaluationComment: '工作态度不积极，业绩未达标',
    evaluatorId: 2,
    evaluatorName: '李经理',
    evaluationTime: '2024-01-10 16:00:00',
    failureReason: '试用期内业绩未达标，工作态度消极',
    remark: '试用期不合格，办理离职',
    createTime: '2023-10-15 09:00:00',
    updateTime: '2024-01-10 16:00:00'
  }
]

let nextId = 5

/**
 * 获取列表 Mock 函数
 */
export function getProbationListMock(params: ProbationListParams) {
  const { employeeName, employeeCode, departmentId, status, regularDateStart, regularDateEnd, page = 1, pageSize = 20 } = params
  let filteredData = [...probations]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (employeeCode) {
    filteredData = filteredData.filter(item => item.employeeCode.includes(employeeCode))
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter(item => item.departmentId === deptId)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (regularDateStart) {
    filteredData = filteredData.filter(item => item.regularDate >= regularDateStart)
  }
  if (regularDateEnd) {
    filteredData = filteredData.filter(item => item.regularDate <= regularDateEnd)
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
export function getProbationDetailMock(id: number) {
  return probations.find(item => item.id === id) || null
}

/**
 * 添加 Mock 函数
 */
export function addProbationMock(data: any) {
  const newItem: Probation = {
    id: nextId++,
    employeeId: data.employeeId,
    employeeName: data.employeeName || '',
    employeeCode: data.employeeCode || '',
    departmentId: data.departmentId || 0,
    departmentName: data.departmentName || '',
    positionId: data.positionId || 0,
    positionName: data.positionName || '',
    entryDate: data.entryDate,
    probationMonths: data.probationMonths,
    regularDate: data.regularDate || '',
    status: 0,
    statusName: '试用中',
    remark: data.remark || '',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  probations.push(newItem)
  return newItem
}

/**
 * 更新 Mock 函数
 */
export function updateProbationMock(data: any) {
  const index = probations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    probations[index] = {
      ...probations[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return probations[index]
  }
  throw new Error('数据不存在')
}

/**
 * 删除 Mock 函数
 */
export function deleteProbationMock(id: number) {
  const index = probations.findIndex(item => item.id === id)
  if (index !== -1) {
    probations.splice(index, 1)
    return true
  }
  throw new Error('数据不存在')
}

/**
 * 转正评估 Mock 函数
 */
export function evaluateProbationMock(data: any) {
  const index = probations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    const statusMap: Record<number, string> = {
      1: '已转正',
      2: '延长试用',
      3: '不合格'
    }

    probations[index] = {
      ...probations[index],
      status: data.result,
      statusName: statusMap[data.result],
      evaluationScore: data.evaluationScore,
      evaluationComment: data.evaluationComment,
      evaluatorId: 1,
      evaluatorName: '当前用户',
      evaluationTime: new Date().toLocaleString('zh-CN'),
      extensionMonths: data.extensionMonths,
      extensionReason: data.extensionReason,
      failureReason: data.failureReason,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return probations[index]
  }
  throw new Error('数据不存在')
}
