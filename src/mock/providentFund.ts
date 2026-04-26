import type { ProvidentFund, ProvidentFundListParams } from '@/types/socialSecurity'

// 数据存储
let providentFunds: ProvidentFund[] = [
  {
    id: 1,
    employeeId: 1001,
    employeeName: '张三',
    idCard: '110101199001011234',
    department: '技术部',
    city: '北京',
    fundBase: 25000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 3000,
    personalAmount: 3000,
    totalAmount: 6000,
    startDate: '2024-01-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    employeeId: 1002,
    employeeName: '李四',
    idCard: '310101199002021234',
    department: '产品部',
    city: '上海',
    fundBase: 22000,
    companyRate: 7,
    personalRate: 7,
    companyAmount: 1540,
    personalAmount: 1540,
    totalAmount: 3080,
    startDate: '2024-01-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-01-15 11:00:00',
    updateTime: '2024-01-15 11:00:00'
  },
  {
    id: 3,
    employeeId: 1003,
    employeeName: '王五',
    idCard: '440101199003031234',
    department: '市场部',
    city: '深圳',
    fundBase: 20000,
    companyRate: 5,
    personalRate: 5,
    companyAmount: 1000,
    personalAmount: 1000,
    totalAmount: 2000,
    startDate: '2024-01-01',
    endDate: '2026-01-20',
    status: 3,
    operationType: 3,
    remark: '员工离职，已停缴',
    createTime: '2024-01-10 09:00:00',
    updateTime: '2026-01-20 14:30:00'
  },
  {
    id: 4,
    employeeId: 1004,
    employeeName: '赵六',
    idCard: '510101199004041234',
    department: '技术部',
    city: '成都',
    fundBase: 18000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2160,
    personalAmount: 2160,
    totalAmount: 4320,
    startDate: '2024-01-01',
    status: 1,
    operationType: 2,
    remark: '基数调整',
    createTime: '2024-01-12 15:20:00',
    updateTime: '2026-03-15 15:20:00'
  },
  {
    id: 5,
    employeeId: 1005,
    employeeName: '孙七',
    idCard: '330101199005051234',
    department: '财务部',
    city: '杭州',
    fundBase: 21000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2520,
    personalAmount: 2520,
    totalAmount: 5040,
    startDate: '2024-01-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-01-16 08:45:00',
    updateTime: '2024-01-16 08:45:00'
  },
  {
    id: 6,
    employeeId: 1006,
    employeeName: '周八',
    idCard: '110101199006061234',
    department: '人力资源部',
    city: '北京',
    fundBase: 24000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2880,
    personalAmount: 2880,
    totalAmount: 5760,
    startDate: '2024-02-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-02-01 09:00:00',
    updateTime: '2024-02-01 09:00:00'
  },
  {
    id: 7,
    employeeId: 1007,
    employeeName: '吴九',
    idCard: '310101199007071234',
    department: '销售部',
    city: '上海',
    fundBase: 26000,
    companyRate: 7,
    personalRate: 7,
    companyAmount: 1820,
    personalAmount: 1820,
    totalAmount: 3640,
    startDate: '2024-02-01',
    status: 2,
    operationType: 2,
    remark: '暂停缴纳',
    createTime: '2024-02-01 10:00:00',
    updateTime: '2026-02-15 10:00:00'
  },
  {
    id: 8,
    employeeId: 1008,
    employeeName: '郑十',
    idCard: '440101199008081234',
    department: '运营部',
    city: '深圳',
    fundBase: 28000,
    companyRate: 5,
    personalRate: 5,
    companyAmount: 1400,
    personalAmount: 1400,
    totalAmount: 2800,
    startDate: '2024-03-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-03-01 09:00:00',
    updateTime: '2024-03-01 09:00:00'
  },
  {
    id: 9,
    employeeId: 1009,
    employeeName: '冯十一',
    idCard: '510101199009091234',
    department: '客服部',
    city: '成都',
    fundBase: 19000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2280,
    personalAmount: 2280,
    totalAmount: 4560,
    startDate: '2024-03-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-03-01 10:00:00',
    updateTime: '2024-03-01 10:00:00'
  },
  {
    id: 10,
    employeeId: 1010,
    employeeName: '陈十二',
    idCard: '330101199010101234',
    department: '设计部',
    city: '杭州',
    fundBase: 23000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2760,
    personalAmount: 2760,
    totalAmount: 5520,
    startDate: '2024-04-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-01 09:00:00'
  },
  {
    id: 11,
    employeeId: 1011,
    employeeName: '褚十三',
    idCard: '110101199011111234',
    department: '技术部',
    city: '北京',
    fundBase: 27000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 3240,
    personalAmount: 3240,
    totalAmount: 6480,
    startDate: '2024-04-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-04-01 10:00:00',
    updateTime: '2024-04-01 10:00:00'
  },
  {
    id: 12,
    employeeId: 1012,
    employeeName: '卫十四',
    idCard: '310101199012121234',
    department: '产品部',
    city: '上海',
    fundBase: 24500,
    companyRate: 7,
    personalRate: 7,
    companyAmount: 1715,
    personalAmount: 1715,
    totalAmount: 3430,
    startDate: '2024-05-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-05-01 09:00:00',
    updateTime: '2024-05-01 09:00:00'
  },
  {
    id: 13,
    employeeId: 1013,
    employeeName: '蒋十五',
    idCard: '440101199101011234',
    department: '市场部',
    city: '深圳',
    fundBase: 29000,
    companyRate: 5,
    personalRate: 5,
    companyAmount: 1450,
    personalAmount: 1450,
    totalAmount: 2900,
    startDate: '2024-05-01',
    status: 1,
    operationType: 2,
    remark: '基数调整',
    createTime: '2024-05-01 10:00:00',
    updateTime: '2026-03-20 10:00:00'
  },
  {
    id: 14,
    employeeId: 1014,
    employeeName: '沈十六',
    idCard: '510101199102021234',
    department: '技术部',
    city: '成都',
    fundBase: 20000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2400,
    personalAmount: 2400,
    totalAmount: 4800,
    startDate: '2024-06-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-06-01 09:00:00',
    updateTime: '2024-06-01 09:00:00'
  },
  {
    id: 15,
    employeeId: 1015,
    employeeName: '韩十七',
    idCard: '330101199103031234',
    department: '财务部',
    city: '杭州',
    fundBase: 22500,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2700,
    personalAmount: 2700,
    totalAmount: 5400,
    startDate: '2024-06-01',
    endDate: '2026-02-28',
    status: 3,
    operationType: 3,
    remark: '员工离职，已停缴',
    createTime: '2024-06-01 10:00:00',
    updateTime: '2026-02-28 16:00:00'
  },
  {
    id: 16,
    employeeId: 1016,
    employeeName: '杨十八',
    idCard: '110101199104041234',
    department: '人力资源部',
    city: '北京',
    fundBase: 25500,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 3060,
    personalAmount: 3060,
    totalAmount: 6120,
    startDate: '2024-07-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-07-01 09:00:00',
    updateTime: '2024-07-01 09:00:00'
  },
  {
    id: 17,
    employeeId: 1017,
    employeeName: '朱十九',
    idCard: '310101199105051234',
    department: '销售部',
    city: '上海',
    fundBase: 27500,
    companyRate: 7,
    personalRate: 7,
    companyAmount: 1925,
    personalAmount: 1925,
    totalAmount: 3850,
    startDate: '2024-07-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-07-01 10:00:00',
    updateTime: '2024-07-01 10:00:00'
  },
  {
    id: 18,
    employeeId: 1018,
    employeeName: '秦二十',
    idCard: '440101199106061234',
    department: '运营部',
    city: '深圳',
    fundBase: 30000,
    companyRate: 5,
    personalRate: 5,
    companyAmount: 1500,
    personalAmount: 1500,
    totalAmount: 3000,
    startDate: '2024-08-01',
    status: 2,
    operationType: 2,
    remark: '暂停缴纳',
    createTime: '2024-08-01 09:00:00',
    updateTime: '2026-03-01 09:00:00'
  },
  {
    id: 19,
    employeeId: 1019,
    employeeName: '尤二一',
    idCard: '510101199107071234',
    department: '客服部',
    city: '成都',
    fundBase: 19500,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2340,
    personalAmount: 2340,
    totalAmount: 4680,
    startDate: '2024-08-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-08-01 10:00:00',
    updateTime: '2024-08-01 10:00:00'
  },
  {
    id: 20,
    employeeId: 1020,
    employeeName: '许二二',
    idCard: '330101199108081234',
    department: '设计部',
    city: '杭州',
    fundBase: 23500,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2820,
    personalAmount: 2820,
    totalAmount: 5640,
    startDate: '2024-09-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-09-01 09:00:00',
    updateTime: '2024-09-01 09:00:00'
  },
  {
    id: 21,
    employeeId: 1021,
    employeeName: '何二三',
    idCard: '110101199109091234',
    department: '技术部',
    city: '北京',
    fundBase: 28000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 3360,
    personalAmount: 3360,
    totalAmount: 6720,
    startDate: '2024-09-01',
    status: 1,
    operationType: 2,
    remark: '基数调整',
    createTime: '2024-09-01 10:00:00',
    updateTime: '2026-03-25 10:00:00'
  },
  {
    id: 22,
    employeeId: 1022,
    employeeName: '吕二四',
    idCard: '310101199110101234',
    department: '产品部',
    city: '上海',
    fundBase: 25000,
    companyRate: 7,
    personalRate: 7,
    companyAmount: 1750,
    personalAmount: 1750,
    totalAmount: 3500,
    startDate: '2024-10-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-10-01 09:00:00',
    updateTime: '2024-10-01 09:00:00'
  },
  {
    id: 23,
    employeeId: 1023,
    employeeName: '施二五',
    idCard: '440101199111111234',
    department: '市场部',
    city: '深圳',
    fundBase: 31000,
    companyRate: 5,
    personalRate: 5,
    companyAmount: 1550,
    personalAmount: 1550,
    totalAmount: 3100,
    startDate: '2024-10-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-10-01 10:00:00',
    updateTime: '2024-10-01 10:00:00'
  },
  {
    id: 24,
    employeeId: 1024,
    employeeName: '张二六',
    idCard: '510101199112121234',
    department: '技术部',
    city: '成都',
    fundBase: 21000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2520,
    personalAmount: 2520,
    totalAmount: 5040,
    startDate: '2024-11-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-11-01 09:00:00',
    updateTime: '2024-11-01 09:00:00'
  },
  {
    id: 25,
    employeeId: 1025,
    employeeName: '孔二七',
    idCard: '330101199201011234',
    department: '财务部',
    city: '杭州',
    fundBase: 24000,
    companyRate: 12,
    personalRate: 12,
    companyAmount: 2880,
    personalAmount: 2880,
    totalAmount: 5760,
    startDate: '2024-11-01',
    status: 1,
    operationType: 1,
    remark: '正常缴纳',
    createTime: '2024-11-01 10:00:00',
    updateTime: '2024-11-01 10:00:00'
  }
]

let nextId = 26

/**
 * 获取公积金列表 Mock 函数
 */
export function getProvidentFundListMock(params: ProvidentFundListParams) {
  const { employeeName, idCard, department, city, status, operationType, page = 1, pageSize = 20 } = params
  let filteredData = [...providentFunds]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (idCard) {
    filteredData = filteredData.filter(item => item.idCard.includes(idCard))
  }
  if (department) {
    filteredData = filteredData.filter(item => item.department.includes(department))
  }
  if (city) {
    filteredData = filteredData.filter(item => item.city.includes(city))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (operationType !== undefined && operationType !== null && operationType !== '') {
    const operationTypeValue = typeof operationType === 'string' ? parseInt(operationType) : operationType
    filteredData = filteredData.filter(item => item.operationType === operationTypeValue)
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
 * 获取公积金详情 Mock 函数
 */
export function getProvidentFundDetailMock(id: number) {
  const item = providentFunds.find(item => item.id === id)
  if (!item) {
    throw new Error('数据不存在')
  }
  return item
}

/**
 * 添加公积金记录 Mock 函数
 */
export function addProvidentFundMock(data: Partial<ProvidentFund>) {
  const newItem: ProvidentFund = {
    id: nextId++,
    employeeId: data.employeeId || 0,
    employeeName: data.employeeName || '',
    idCard: data.idCard || '',
    department: data.department || '',
    city: data.city || '',
    fundBase: data.fundBase || 0,
    companyRate: data.companyRate || 12,
    personalRate: data.personalRate || 12,
    companyAmount: data.companyAmount || 0,
    personalAmount: data.personalAmount || 0,
    totalAmount: data.totalAmount || 0,
    startDate: data.startDate || '',
    status: data.status || 1,
    operationType: data.operationType || 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  providentFunds.unshift(newItem)
  return newItem
}

/**
 * 更新公积金记录 Mock 函数
 */
export function updateProvidentFundMock(data: Partial<ProvidentFund>) {
  const index = providentFunds.findIndex(item => item.id === data.id)
  if (index !== -1) {
    providentFunds[index] = {
      ...providentFunds[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return providentFunds[index]
  }
  throw new Error('数据不存在')
}

/**
 * 删除公积金记录 Mock 函数
 */
export function deleteProvidentFundMock(id: number) {
  const index = providentFunds.findIndex(item => item.id === id)
  if (index !== -1) {
    providentFunds.splice(index, 1)
    return true
  }
  throw new Error('数据不存在')
}

/**
 * 批量删除公积金记录 Mock 函数
 */
export function batchDeleteProvidentFundMock(ids: number[]) {
  providentFunds = providentFunds.filter(item => !ids.includes(item.id))
  return true
}
