/**
 * 离职管理 Mock 数据
 */

import type {
  Resignation,
  ResignationListParams,
  ApproveResignationParams,
  UpdateHandoverParams,
  CompleteProceduresParams
} from '@/types/resignation'

// 数据存储
let resignations: Resignation[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeNo: 'EMP001',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '前端工程师',
    resignationType: 1,
    resignationReason: 1,
    expectedResignationDate: '2024-04-30',
    handoverPerson: '李四',
    detailDescription: '因个人职业发展需要，申请离职',
    status: 5,
    applyTime: '2024-03-15 09:30:00',
    approvalRecords: [
      {
        id: 1,
        approver: '王经理',
        approvalTime: '2024-03-16 14:20:00',
        result: 1,
        opinion: '同意离职申请，祝工作顺利'
      }
    ],
    handoverChecklist: [
      {
        id: 1,
        handoverType: '工作内容',
        handoverContent: '项目A开发工作',
        handoverPerson: '李四',
        handoverTime: '2024-04-20 16:00:00',
        remark: '已完成交接'
      },
      {
        id: 2,
        handoverType: '文档资料',
        handoverContent: '技术文档和代码注释',
        handoverPerson: '李四',
        handoverTime: '2024-04-22 10:00:00',
        remark: '文档已整理完毕'
      }
    ],
    procedureChecklist: [
      {
        id: 1,
        itemName: '工作交接确认',
        completed: true,
        handler: '王经理',
        handleTime: '2024-04-25 09:00:00'
      },
      {
        id: 2,
        itemName: '物品归还',
        completed: true,
        handler: '行政部',
        handleTime: '2024-04-26 14:00:00'
      },
      {
        id: 3,
        itemName: '系统权限注销',
        completed: true,
        handler: 'IT部',
        handleTime: '2024-04-27 10:00:00'
      },
      {
        id: 4,
        itemName: '离职证明开具',
        completed: true,
        handler: '人事部',
        handleTime: '2024-04-28 15:00:00'
      }
    ]
  },
  {
    id: 2,
    employeeId: 5,
    employeeName: '赵六',
    employeeNo: 'EMP005',
    departmentId: 2,
    departmentName: '产品部',
    positionName: '产品经理',
    resignationType: 4,
    resignationReason: 5,
    expectedResignationDate: '2024-05-15',
    handoverPerson: '孙七',
    detailDescription: '试用期考核不合格',
    status: 3,
    applyTime: '2024-04-01 10:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '李总监',
        approvalTime: '2024-04-02 11:30:00',
        result: 1,
        opinion: '试用期考核未达标，同意离职'
      }
    ],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 3,
    employeeId: 7,
    employeeName: '周八',
    employeeNo: 'EMP007',
    departmentId: 3,
    departmentName: '市场部',
    positionName: '市场专员',
    resignationType: 1,
    resignationReason: 2,
    expectedResignationDate: '2024-06-30',
    handoverPerson: '吴九',
    detailDescription: '对薪资待遇不满意，寻求更好的薪资待遇',
    status: 2,
    applyTime: '2024-04-10 11:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '张经理',
        approvalTime: '2024-04-11 09:30:00',
        result: 1,
        opinion: '初审通过，提交总监审批'
      }
    ],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 4,
    employeeId: 9,
    employeeName: '郑十',
    employeeNo: 'EMP009',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '后端工程师',
    resignationType: 1,
    resignationReason: 3,
    expectedResignationDate: '2024-05-31',
    handoverPerson: '王五',
    detailDescription: '工作压力较大，需要调整工作状态',
    status: 4,
    applyTime: '2024-03-20 14:30:00',
    approvalRecords: [
      {
        id: 1,
        approver: '王经理',
        approvalTime: '2024-03-21 10:00:00',
        result: 2,
        opinion: '建议再考虑一下，可以调整工作安排'
      }
    ],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 5,
    employeeId: 11,
    employeeName: '冯十一',
    employeeNo: 'EMP011',
    departmentId: 4,
    departmentName: '财务部',
    positionName: '会计',
    resignationType: 1,
    resignationReason: 4,
    expectedResignationDate: '2024-07-15',
    handoverPerson: '陈十二',
    detailDescription: '家庭原因，需要回老家照顾家人',
    status: 1,
    applyTime: '2024-04-15 10:20:00',
    approvalRecords: [],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 6,
    employeeId: 13,
    employeeName: '褚十三',
    employeeNo: 'EMP013',
    departmentId: 2,
    departmentName: '产品部',
    positionName: '产品助理',
    resignationType: 2,
    resignationReason: 5,
    expectedResignationDate: '2024-05-20',
    detailDescription: '公司业务调整，岗位撤销',
    status: 3,
    applyTime: '2024-03-25 15:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '李总监',
        approvalTime: '2024-03-26 09:00:00',
        result: 1,
        opinion: '同意离职，给予N+1补偿'
      }
    ],
    handoverChecklist: [
      {
        id: 1,
        handoverType: '工作内容',
        handoverContent: '产品需求文档整理',
        handoverPerson: '孙七',
        handoverTime: '2024-05-10 14:00:00',
        remark: '已完成'
      }
    ],
    procedureChecklist: [
      {
        id: 1,
        itemName: '工作交接确认',
        completed: true,
        handler: '李总监',
        handleTime: '2024-05-12 10:00:00'
      },
      {
        id: 2,
        itemName: '物品归还',
        completed: false
      }
    ]
  },
  {
    id: 7,
    employeeId: 15,
    employeeName: '卫十五',
    employeeNo: 'EMP015',
    departmentId: 3,
    departmentName: '市场部',
    positionName: '市场经理',
    resignationType: 3,
    resignationReason: 1,
    expectedResignationDate: '2024-06-15',
    handoverPerson: '周八',
    detailDescription: '合同到期，不再续签',
    status: 2,
    applyTime: '2024-04-05 09:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '张经理',
        approvalTime: '2024-04-06 14:00:00',
        result: 1,
        opinion: '初审通过'
      }
    ],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 8,
    employeeId: 17,
    employeeName: '蒋十七',
    employeeNo: 'EMP017',
    departmentId: 1,
    departmentName: '技术部',
    positionName: '测试工程师',
    resignationType: 1,
    resignationReason: 1,
    expectedResignationDate: '2024-05-25',
    handoverPerson: '李四',
    detailDescription: '获得更好的职业发展机会',
    status: 1,
    applyTime: '2024-04-18 11:30:00',
    approvalRecords: [],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 9,
    employeeId: 19,
    employeeName: '沈十九',
    employeeNo: 'EMP019',
    departmentId: 5,
    departmentName: '人事部',
    positionName: '招聘专员',
    resignationType: 1,
    resignationReason: 2,
    expectedResignationDate: '2024-06-10',
    handoverPerson: '韩二十',
    detailDescription: '薪资待遇未达预期',
    status: 4,
    applyTime: '2024-03-28 10:00:00',
    approvalRecords: [
      {
        id: 1,
        approver: '人事总监',
        approvalTime: '2024-03-29 15:00:00',
        result: 2,
        opinion: '可以协商调整薪资，建议留任'
      }
    ],
    handoverChecklist: [],
    procedureChecklist: []
  },
  {
    id: 10,
    employeeId: 21,
    employeeName: '杨二十一',
    employeeNo: 'EMP021',
    departmentId: 4,
    departmentName: '财务部',
    positionName: '出纳',
    resignationType: 1,
    resignationReason: 4,
    expectedResignationDate: '2024-07-01',
    handoverPerson: '冯十一',
    detailDescription: '家庭搬迁，无法继续工作',
    status: 1,
    applyTime: '2024-04-20 09:00:00',
    approvalRecords: [],
    handoverChecklist: [],
    procedureChecklist: []
  }
]

let nextId = 11

/**
 * 获取离职申请列表 Mock 函数
 */
export function getResignationListMock(params: ResignationListParams) {
  const { keyword, status, departmentId, applyTimeStart, applyTimeEnd, page = 1, pageSize = 20 } = params
  let filteredData = [...resignations]

  // 筛选
  if (keyword) {
    filteredData = filteredData.filter(
      item => item.employeeName.includes(keyword) || item.employeeNo.includes(keyword)
    )
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptValue = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter(item => item.departmentId === deptValue)
  }
  if (applyTimeStart) {
    filteredData = filteredData.filter(item => item.applyTime >= applyTimeStart)
  }
  if (applyTimeEnd) {
    filteredData = filteredData.filter(item => item.applyTime <= applyTimeEnd)
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
 * 获取离职申请详情 Mock 函数
 */
export function getResignationDetailMock(id: number) {
  const resignation = resignations.find(item => item.id === id)
  if (resignation) {
    return resignation
  }
  throw new Error('离职申请不存在')
}

/**
 * 添加离职申请 Mock 函数
 */
export function addResignationMock(data: Partial<Resignation>) {
  const newResignation: Resignation = {
    id: nextId++,
    employeeId: data.employeeId || 0,
    employeeName: data.employeeName || '',
    employeeNo: data.employeeNo || '',
    departmentId: data.departmentId || 0,
    departmentName: data.departmentName || '',
    positionName: data.positionName || '',
    resignationType: data.resignationType || 1,
    resignationReason: data.resignationReason || 1,
    expectedResignationDate: data.expectedResignationDate || '',
    handoverPerson: data.handoverPerson,
    detailDescription: data.detailDescription,
    status: 1,
    applyTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    approvalRecords: [],
    handoverChecklist: [],
    procedureChecklist: []
  }
  resignations.unshift(newResignation)
  return newResignation
}

/**
 * 更新离职申请 Mock 函数
 */
export function updateResignationMock(data: Partial<Resignation>) {
  const index = resignations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    resignations[index] = {
      ...resignations[index],
      ...data
    }
    return resignations[index]
  }
  throw new Error('离职申请不存在')
}

/**
 * 删除离职申请 Mock 函数
 */
export function deleteResignationMock(id: number) {
  const index = resignations.findIndex(item => item.id === id)
  if (index !== -1) {
    resignations.splice(index, 1)
    return true
  }
  throw new Error('离职申请不存在')
}

/**
 * 批量删除离职申请 Mock 函数
 */
export function batchDeleteResignationsMock(ids: number[]) {
  resignations = resignations.filter(item => !ids.includes(item.id))
  return true
}

/**
 * 审批离职申请 Mock 函数
 */
export function approveResignationMock(data: ApproveResignationParams) {
  const index = resignations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    const approvalRecord = {
      id: (resignations[index].approvalRecords?.length || 0) + 1,
      approver: '当前审批人',
      approvalTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      result: data.result,
      opinion: data.opinion
    }

    resignations[index].approvalRecords = resignations[index].approvalRecords || []
    resignations[index].approvalRecords.push(approvalRecord)

    // 更新状态
    if (data.result === 1) {
      resignations[index].status = 3 // 已通过
    } else if (data.result === 2) {
      resignations[index].status = 4 // 已拒绝
    } else if (data.result === 3) {
      resignations[index].status = 1 // 退回修改，状态改为待审批
    }

    return resignations[index]
  }
  throw new Error('离职申请不存在')
}

/**
 * 更新交接清单 Mock 函数
 */
export function updateHandoverMock(data: UpdateHandoverParams) {
  const index = resignations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    resignations[index].handoverChecklist = data.handoverChecklist
    return resignations[index]
  }
  throw new Error('离职申请不存在')
}

/**
 * 完成手续 Mock 函数
 */
export function completeProceduresMock(data: CompleteProceduresParams) {
  const index = resignations.findIndex(item => item.id === data.id)
  if (index !== -1) {
    resignations[index].procedureChecklist = data.procedureChecklist

    // 检查是否所有手续都已完成
    const allCompleted = data.procedureChecklist.every(item => item.completed)
    if (allCompleted) {
      resignations[index].status = 5 // 已完成
    }

    return resignations[index]
  }
  throw new Error('离职申请不存在')
}

/**
 * 撤回离职申请 Mock 函数
 */
export function withdrawResignationMock(id: number) {
  const index = resignations.findIndex(item => item.id === id)
  if (index !== -1) {
    // 只有待审批和审批中的申请可以撤回
    if (resignations[index].status === 1 || resignations[index].status === 2) {
      resignations.splice(index, 1)
      return true
    }
    throw new Error('当前状态不允许撤回')
  }
  throw new Error('离职申请不存在')
}
