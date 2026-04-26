import type {
  EmployeeProfile,
  Payslip,
  PayslipQueryParams,
  LeaveType,
  LeaveDetail,
  LeaveApplication,
  Application,
  ApplicationQueryParams,
  CreateApplication,
  TodoTask,
  TodoTaskQueryParams,
  ProcessTodoTask
} from '@/types/employee-self-service'

/**
 * 个人信息数据
 */
let profileData: EmployeeProfile = {
  id: 1,
  employeeNo: 'EMP001',
  name: '张三',
  avatar: '',
  department: '技术部',
  position: '高级工程师',
  phone: '13800138000',
  email: 'zhangsan@company.com',
  emergencyContact: '李四',
  emergencyPhone: '13900139000',
  address: '北京市朝阳区xxx街道xxx号',
  hireDate: '2020-01-15',
  gender: '男',
  birthDate: '1990-05-20',
  idCard: '110101199005201234'
}

/**
 * 工资条数据
 */
let payslipData: Payslip[] = [
  {
    id: 1,
    month: '2026-03',
    grossSalary: 15000,
    netSalary: 12500,
    baseSalary: 10000,
    performanceSalary: 3000,
    positionAllowance: 1000,
    transportAllowance: 500,
    mealAllowance: 500,
    socialInsurance: 1200,
    housingFund: 800,
    tax: 500,
    otherDeduction: 0,
    remark: ''
  },
  {
    id: 2,
    month: '2026-02',
    grossSalary: 15000,
    netSalary: 12500,
    baseSalary: 10000,
    performanceSalary: 3000,
    positionAllowance: 1000,
    transportAllowance: 500,
    mealAllowance: 500,
    socialInsurance: 1200,
    housingFund: 800,
    tax: 500,
    otherDeduction: 0,
    remark: ''
  },
  {
    id: 3,
    month: '2026-01',
    grossSalary: 14500,
    netSalary: 12100,
    baseSalary: 10000,
    performanceSalary: 2500,
    positionAllowance: 1000,
    transportAllowance: 500,
    mealAllowance: 500,
    socialInsurance: 1200,
    housingFund: 800,
    tax: 400,
    otherDeduction: 0,
    remark: ''
  },
  {
    id: 4,
    month: '2025-12',
    grossSalary: 16000,
    netSalary: 13300,
    baseSalary: 10000,
    performanceSalary: 4000,
    positionAllowance: 1000,
    transportAllowance: 500,
    mealAllowance: 500,
    socialInsurance: 1200,
    housingFund: 800,
    tax: 700,
    otherDeduction: 0,
    remark: '年终奖金'
  }
]

/**
 * 假期余额数据
 */
let leaveBalanceData: LeaveType[] = [
  {
    id: 1,
    name: '年假',
    totalQuota: 10,
    usedQuota: 3,
    remainingQuota: 7,
    validUntil: '2026-12-31',
    unit: '天'
  },
  {
    id: 2,
    name: '病假',
    totalQuota: 15,
    usedQuota: 2,
    remainingQuota: 13,
    validUntil: '2026-12-31',
    unit: '天'
  },
  {
    id: 3,
    name: '事假',
    totalQuota: 5,
    usedQuota: 1,
    remainingQuota: 4,
    validUntil: '2026-12-31',
    unit: '天'
  },
  {
    id: 4,
    name: '调休',
    totalQuota: 3,
    usedQuota: 0,
    remainingQuota: 3,
    validUntil: '2026-06-30',
    unit: '天'
  }
]

/**
 * 假期明细数据
 */
let leaveDetailData: Record<number, LeaveDetail[]> = {
  1: [
    {
      id: 1,
      leaveType: '年假',
      operationType: '发放',
      amount: 10,
      operationTime: '2026-01-01 00:00:00',
      remark: '2026年度年假'
    },
    {
      id: 2,
      leaveType: '年假',
      operationType: '使用',
      amount: -2,
      operationTime: '2026-02-10 09:00:00',
      remark: '春节假期'
    },
    {
      id: 3,
      leaveType: '年假',
      operationType: '使用',
      amount: -1,
      operationTime: '2026-03-15 09:00:00',
      remark: '个人事务'
    }
  ],
  2: [
    {
      id: 4,
      leaveType: '病假',
      operationType: '发放',
      amount: 15,
      operationTime: '2026-01-01 00:00:00',
      remark: '2026年度病假'
    },
    {
      id: 5,
      leaveType: '病假',
      operationType: '使用',
      amount: -2,
      operationTime: '2026-03-20 09:00:00',
      remark: '感冒就医'
    }
  ]
}

/**
 * 申请记录数据
 */
let applicationData: Application[] = [
  {
    id: 1,
    title: '年假申请',
    type: 1,
    typeName: '请假申请',
    status: 2,
    statusName: '已通过',
    applyTime: '2026-03-01 10:00:00',
    content: '计划3月15日请年假1天，处理个人事务',
    attachments: [],
    approvalProgress: [
      {
        id: 1,
        approver: '王经理',
        status: '已通过',
        opinion: '同意',
        approvalTime: '2026-03-01 14:00:00'
      },
      {
        id: 2,
        approver: '人事部',
        status: '已通过',
        opinion: '同意',
        approvalTime: '2026-03-01 16:00:00'
      }
    ]
  },
  {
    id: 2,
    title: '加班申请',
    type: 2,
    typeName: '加班申请',
    status: 1,
    statusName: '审批中',
    applyTime: '2026-03-25 18:00:00',
    content: '项目上线需要加班2小时',
    attachments: [],
    approvalProgress: [
      {
        id: 3,
        approver: '王经理',
        status: '待审批',
        opinion: '',
        approvalTime: ''
      }
    ]
  },
  {
    id: 3,
    title: '出差申请',
    type: 3,
    typeName: '出差申请',
    status: 2,
    statusName: '已通过',
    applyTime: '2026-02-20 09:00:00',
    content: '前往上海分公司进行技术交流，预计3天',
    attachments: [],
    approvalProgress: [
      {
        id: 4,
        approver: '王经理',
        status: '已通过',
        opinion: '同意',
        approvalTime: '2026-02-20 11:00:00'
      }
    ]
  }
]

let nextApplicationId = 4

/**
 * 待办任务数据
 */
let todoTaskData: TodoTask[] = [
  {
    id: 1,
    title: '请假申请待审批',
    type: 1,
    typeName: '审批',
    status: 0,
    statusName: '未读',
    createTime: '2026-04-05 10:00:00',
    content: '李四提交了年假申请，请及时审批',
    relatedId: 10
  },
  {
    id: 2,
    title: '工资条已发放',
    type: 2,
    typeName: '通知',
    status: 1,
    statusName: '已读',
    createTime: '2026-04-01 09:00:00',
    content: '2026年3月工资条已发放，请查收',
    relatedId: 0
  },
  {
    id: 3,
    title: '绩效考核提醒',
    type: 3,
    typeName: '提醒',
    status: 0,
    statusName: '未读',
    createTime: '2026-04-03 14:00:00',
    content: '请于本周五前完成Q1绩效自评',
    relatedId: 0
  }
]

/**
 * 获取个人信息 Mock
 */
export function getProfileMock() {
  return profileData
}

/**
 * 更新个人信息 Mock
 */
export function updateProfileMock(data: Partial<EmployeeProfile>) {
  profileData = {
    ...profileData,
    ...data
  }
  return profileData
}

/**
 * 上传头像 Mock
 */
export function uploadAvatarMock(avatar: string) {
  profileData.avatar = avatar
  return profileData
}

/**
 * 获取工资条列表 Mock
 */
export function getPayslipListMock(params: PayslipQueryParams) {
  const { startMonth, endMonth, page = 1, pageSize = 20 } = params
  let filteredData = [...payslipData]

  // 筛选
  if (startMonth) {
    filteredData = filteredData.filter(item => item.month >= startMonth)
  }
  if (endMonth) {
    filteredData = filteredData.filter(item => item.month <= endMonth)
  }

  // 排序（按月份倒序）
  filteredData.sort((a, b) => b.month.localeCompare(a.month))

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
 * 获取工资条详情 Mock
 */
export function getPayslipDetailMock(id: number) {
  const payslip = payslipData.find(item => item.id === id)
  if (!payslip) {
    throw new Error('工资条不存在')
  }
  return payslip
}

/**
 * 获取假期余额列表 Mock
 */
export function getLeaveBalanceListMock() {
  return {
    list: leaveBalanceData,
    total: leaveBalanceData.length
  }
}

/**
 * 获取假期明细 Mock
 */
export function getLeaveDetailMock(leaveTypeId: number) {
  const details = leaveDetailData[leaveTypeId] || []
  return {
    list: details,
    total: details.length
  }
}

/**
 * 申请请假 Mock
 */
export function applyLeaveMock(data: LeaveApplication) {
  const leaveType = leaveBalanceData.find(item => item.id === data.leaveTypeId)
  if (!leaveType) {
    throw new Error('假期类型不存在')
  }

  if (leaveType.remainingQuota < data.days) {
    throw new Error('假期余额不足')
  }

  // 更新假期余额
  leaveType.usedQuota += data.days
  leaveType.remainingQuota -= data.days

  // 添加假期明细
  if (!leaveDetailData[data.leaveTypeId]) {
    leaveDetailData[data.leaveTypeId] = []
  }
  const newDetail: LeaveDetail = {
    id: Date.now(),
    leaveType: leaveType.name,
    operationType: '使用',
    amount: -data.days,
    operationTime: new Date().toLocaleString('zh-CN'),
    remark: data.reason
  }
  leaveDetailData[data.leaveTypeId].push(newDetail)

  // 创建申请记录
  const newApplication: Application = {
    id: nextApplicationId++,
    title: `${leaveType.name}申请`,
    type: 1,
    typeName: '请假申请',
    status: 1,
    statusName: '审批中',
    applyTime: new Date().toLocaleString('zh-CN'),
    content: `${data.startTime} 至 ${data.endTime}，共${data.days}天。事由：${data.reason}`,
    attachments: data.attachments || [],
    approvalProgress: [
      {
        id: Date.now(),
        approver: '直属领导',
        status: '待审批',
        opinion: '',
        approvalTime: ''
      }
    ]
  }
  applicationData.unshift(newApplication)

  return newApplication
}

/**
 * 获取申请列表 Mock
 */
export function getApplicationListMock(params: ApplicationQueryParams) {
  const { type, status, startTime, endTime, page = 1, pageSize = 20 } = params
  let filteredData = [...applicationData]

  // 筛选
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter(item => item.type === typeValue)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (startTime) {
    filteredData = filteredData.filter(item => item.applyTime >= startTime)
  }
  if (endTime) {
    filteredData = filteredData.filter(item => item.applyTime <= endTime)
  }

  // 排序（按申请时间倒序）
  filteredData.sort((a, b) => b.applyTime.localeCompare(a.applyTime))

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
 * 获取申请详情 Mock
 */
export function getApplicationDetailMock(id: number) {
  const application = applicationData.find(item => item.id === id)
  if (!application) {
    throw new Error('申请不存在')
  }
  return application
}

/**
 * 创建申请 Mock
 */
export function createApplicationMock(data: CreateApplication) {
  const typeNames: Record<number, string> = {
    1: '请假申请',
    2: '加班申请',
    3: '出差申请',
    4: '报销申请',
    5: '离职申请',
    6: '其他申请'
  }

  const newApplication: Application = {
    id: nextApplicationId++,
    title: data.title,
    type: data.type,
    typeName: typeNames[data.type] || '其他申请',
    status: 1,
    statusName: '审批中',
    applyTime: new Date().toLocaleString('zh-CN'),
    content: data.content,
    attachments: data.attachments || [],
    approvalProgress: [
      {
        id: Date.now(),
        approver: '直属领导',
        status: '待审批',
        opinion: '',
        approvalTime: ''
      }
    ]
  }
  applicationData.unshift(newApplication)
  return newApplication
}

/**
 * 撤回申请 Mock
 */
export function cancelApplicationMock(id: number) {
  const application = applicationData.find(item => item.id === id)
  if (!application) {
    throw new Error('申请不存在')
  }
  if (application.status !== 1) {
    throw new Error('只能撤回审批中的申请')
  }
  application.status = 4
  application.statusName = '已撤回'
  return application
}

/**
 * 获取待办任务列表 Mock
 */
export function getTodoTaskListMock(params: TodoTaskQueryParams) {
  const { type, status, page = 1, pageSize = 20 } = params
  let filteredData = [...todoTaskData]

  // 筛选
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter(item => item.type === typeValue)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

  // 排序（按创建时间倒序）
  filteredData.sort((a, b) => b.createTime.localeCompare(a.createTime))

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
 * 获取待办任务详情 Mock
 */
export function getTodoTaskDetailMock(id: number) {
  const task = todoTaskData.find(item => item.id === id)
  if (!task) {
    throw new Error('任务不存在')
  }
  return task
}

/**
 * 处理待办任务 Mock
 */
export function processTodoTaskMock(data: ProcessTodoTask) {
  const task = todoTaskData.find(item => item.id === data.id)
  if (!task) {
    throw new Error('任务不存在')
  }
  task.status = 2
  task.statusName = '已处理'
  return task
}

/**
 * 标记已读 Mock
 */
export function markAsReadMock(id: number) {
  const task = todoTaskData.find(item => item.id === id)
  if (!task) {
    throw new Error('任务不存在')
  }
  if (task.status === 0) {
    task.status = 1
    task.statusName = '已读'
  }
  return task
}
