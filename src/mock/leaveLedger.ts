/**
 * 假期台账 Mock 数据
 */
import type {
  LeaveLedger,
  LeaveLedgerListParams,
  LeaveGrantRecord,
  LeaveUsageRecord,
  LeaveAdjustRecord
} from '@/types/leave'

// 初始数据
const initialData: LeaveLedger[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 10,
    usedQuota: 3,
    remainingQuota: 7,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-02-10',
        usageQuota: 2,
        usageReason: '春节回家',
        applicationId: 1
      },
      {
        usageDate: '2026-03-15',
        usageQuota: 1,
        usageReason: '个人事务',
        applicationId: 5
      }
    ],
    adjustRecords: []
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: '张三',
    employeeCode: 'EMP001',
    departmentName: '技术部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    year: 2026,
    totalQuota: 15,
    usedQuota: 2,
    remainingQuota: 13,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 15,
        grantReason: '2026年度病假额度',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-03-20',
        usageQuota: 2,
        usageReason: '感冒发烧',
        applicationId: 8
      }
    ],
    adjustRecords: []
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentName: '产品部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 12,
    usedQuota: 5,
    remainingQuota: 7,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      },
      {
        grantDate: '2026-02-15',
        grantQuota: 2,
        grantReason: '工龄满5年额外奖励',
        operator: 'HR管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-01-20',
        usageQuota: 3,
        usageReason: '家庭旅游',
        applicationId: 2
      },
      {
        usageDate: '2026-03-10',
        usageQuota: 2,
        usageReason: '处理家事',
        applicationId: 6
      }
    ],
    adjustRecords: []
  },
  {
    id: 4,
    employeeId: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    departmentName: '产品部',
    leaveTypeId: 3,
    leaveTypeName: '事假',
    year: 2026,
    totalQuota: 10,
    usedQuota: 1,
    remainingQuota: 9,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度事假额度',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-02-25',
        usageQuota: 1,
        usageReason: '办理证件',
        applicationId: 9
      }
    ],
    adjustRecords: []
  },
  {
    id: 5,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentName: '市场部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 8,
    usedQuota: 4,
    remainingQuota: 4,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-01-15',
        usageQuota: 2,
        usageReason: '春节提前回家',
        applicationId: 3
      },
      {
        usageDate: '2026-03-05',
        usageQuota: 2,
        usageReason: '陪伴家人',
        applicationId: 7
      }
    ],
    adjustRecords: [
      {
        adjustDate: '2026-02-20',
        adjustQuota: -2,
        adjustReason: '旷工扣除',
        operator: 'HR管理员'
      }
    ]
  },
  {
    id: 6,
    employeeId: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    departmentName: '市场部',
    leaveTypeId: 2,
    leaveTypeName: '病假',
    year: 2026,
    totalQuota: 15,
    usedQuota: 0,
    remainingQuota: 15,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 15,
        grantReason: '2026年度病假额度',
        operator: '系统管理员'
      }
    ],
    usageRecords: [],
    adjustRecords: []
  },
  {
    id: 7,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentName: '财务部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 10,
    usedQuota: 6,
    remainingQuota: 4,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-02-05',
        usageQuota: 3,
        usageReason: '春节假期',
        applicationId: 4
      },
      {
        usageDate: '2026-03-12',
        usageQuota: 3,
        usageReason: '家庭事务',
        applicationId: 10
      }
    ],
    adjustRecords: []
  },
  {
    id: 8,
    employeeId: 4,
    employeeName: '赵六',
    employeeCode: 'EMP004',
    departmentName: '财务部',
    leaveTypeId: 4,
    leaveTypeName: '调休',
    year: 2026,
    totalQuota: 5,
    usedQuota: 2,
    remainingQuota: 3,
    grantRecords: [
      {
        grantDate: '2026-01-10',
        grantQuota: 3,
        grantReason: '加班调休转入',
        operator: '系统管理员'
      },
      {
        grantDate: '2026-02-20',
        grantQuota: 2,
        grantReason: '春节加班调休',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-03-08',
        usageQuota: 2,
        usageReason: '调休休息',
        applicationId: 11
      }
    ],
    adjustRecords: []
  },
  {
    id: 9,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    departmentName: '人力资源部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 15,
    usedQuota: 2,
    remainingQuota: 13,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      },
      {
        grantDate: '2026-01-15',
        grantQuota: 5,
        grantReason: '工龄满10年额外奖励',
        operator: 'HR管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-03-18',
        usageQuota: 2,
        usageReason: '个人休假',
        applicationId: 12
      }
    ],
    adjustRecords: []
  },
  {
    id: 10,
    employeeId: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    departmentName: '人力资源部',
    leaveTypeId: 5,
    leaveTypeName: '婚假',
    year: 2026,
    totalQuota: 3,
    usedQuota: 3,
    remainingQuota: 0,
    grantRecords: [
      {
        grantDate: '2026-02-01',
        grantQuota: 3,
        grantReason: '结婚登记发放婚假',
        operator: 'HR管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-02-10',
        usageQuota: 3,
        usageReason: '结婚度蜜月',
        applicationId: 13
      }
    ],
    adjustRecords: []
  },
  {
    id: 11,
    employeeId: 6,
    employeeName: '周八',
    employeeCode: 'EMP006',
    departmentName: '技术部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 10,
    usedQuota: 0,
    remainingQuota: 10,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      }
    ],
    usageRecords: [],
    adjustRecords: []
  },
  {
    id: 12,
    employeeId: 7,
    employeeName: '吴九',
    employeeCode: 'EMP007',
    departmentName: '产品部',
    leaveTypeId: 1,
    leaveTypeName: '年假',
    year: 2026,
    totalQuota: 12,
    usedQuota: 8,
    remainingQuota: 4,
    grantRecords: [
      {
        grantDate: '2026-01-01',
        grantQuota: 10,
        grantReason: '2026年度年假发放',
        operator: '系统管理员'
      }
    ],
    usageRecords: [
      {
        usageDate: '2026-01-25',
        usageQuota: 5,
        usageReason: '春节长假',
        applicationId: 14
      },
      {
        usageDate: '2026-03-01',
        usageQuota: 3,
        usageReason: '家庭旅游',
        applicationId: 15
      }
    ],
    adjustRecords: [
      {
        adjustDate: '2026-02-10',
        adjustQuota: 2,
        adjustReason: '优秀员工奖励',
        operator: 'HR管理员'
      }
    ]
  }
]

/**
 * 获取假期台账列表 Mock 函数
 */
export function getListMock(params: LeaveLedgerListParams) {
  const {
    employeeName,
    employeeCode,
    departmentName,
    leaveTypeId,
    year,
    page = 1,
    pageSize = 20
  } = params
  let filteredData = [...initialData]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter((item) => item.employeeName.includes(employeeName))
  }
  if (employeeCode) {
    filteredData = filteredData.filter((item) => item.employeeCode.includes(employeeCode))
  }
  if (departmentName) {
    filteredData = filteredData.filter((item) => item.departmentName.includes(departmentName))
  }
  if (leaveTypeId !== undefined && leaveTypeId !== null && leaveTypeId !== '') {
    const leaveTypeIdValue = typeof leaveTypeId === 'string' ? parseInt(leaveTypeId) : leaveTypeId
    filteredData = filteredData.filter((item) => item.leaveTypeId === leaveTypeIdValue)
  }
  if (year !== undefined && year !== null && year !== '') {
    const yearValue = typeof year === 'string' ? parseInt(year) : year
    filteredData = filteredData.filter((item) => item.year === yearValue)
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
 * 获取假期台账详情 Mock 函数
 */
export function getDetailMock(id: number) {
  const item = initialData.find((item) => item.id === id)
  if (!item) {
    throw new Error('台账记录不存在')
  }
  return item
}
