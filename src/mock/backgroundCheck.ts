// @ts-nocheck
/**
 * 背调集成 Phase 4.1 Mock
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  BackgroundCheck,
  BackgroundCheckPackage,
  BGCheckItem,
  BGCostStats,
  BGItemType,
  BGItemStatus
} from '@/types/backgroundCheck'
import { BG_ITEM_TYPE_MAP } from '@/types/backgroundCheck'

/* ========== 套餐预置 ========== */
const initialPackages: BackgroundCheckPackage[] = [
  {
    id: 1,
    name: '基础背调',
    level: 'basic',
    itemTypes: ['id_card', 'education'],
    defaultForLevel: 'P4-P5',
    defaultForJobFamily: '职能支持',
    cost: 98,
    description: '身份核实 + 学历验证，用于普通岗位入职前的基础身份核验',
    status: 1,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    name: '标准背调',
    level: 'standard',
    itemTypes: ['id_card', 'education', 'work_exp', 'civil_case'],
    defaultForLevel: 'P5-P7',
    defaultForJobFamily: '技术研发',
    cost: 288,
    description: '身份 + 学历 + 2 段工作履历 + 民事诉讼，适用于主流招聘岗位',
    status: 1,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 3,
    name: '高管背调',
    level: 'executive',
    itemTypes: ['id_card', 'education', 'work_exp', 'civil_case', 'criminal', 'finance', 'commercial', 'professional'],
    defaultForLevel: 'P8+',
    defaultForJobFamily: '管理岗位',
    cost: 1280,
    description: '全项调查，适用于总监及以上管理岗位、核心技术岗、财务/法务岗',
    status: 1,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  }
]

export const bgPackageCrudMock = createCrudMock<BackgroundCheckPackage>(initialPackages, {
  searchFields: ['name', 'description']
})

/* ========== 构造调查项 ========== */
function buildCheckItems(types: BGItemType[], overallStatus: BGItemStatus = 'pending'): BGCheckItem[] {
  let idCounter = 1
  return types.map((type) => ({
    id: idCounter++,
    type,
    name: BG_ITEM_TYPE_MAP[type],
    status: overallStatus,
    result: overallStatus === 'pending' ? '' : overallStatus === 'passed' ? '核验通过' : overallStatus === 'suspicious' ? '信息与候选人自述存在出入' : '',
    remark: ''
  }))
}

/* ========== 订单预置 ========== */
const initialOrders: BackgroundCheck[] = [
  {
    id: 1,
    orderNo: 'BG202604001',
    candidateName: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    idNumber: '110101199001011234',
    position: '前端开发工程师',
    department: '技术部',
    packageId: 2,
    packageName: '标准背调',
    packageLevel: 'standard',
    vendor: 1,
    status: 3,
    authUrl: 'https://bg.example.com/auth/BG202604001',
    authSendTime: '2026-04-05 10:00:00',
    authTime: '2026-04-05 14:20:00',
    authExpireTime: '2026-04-12 10:00:00',
    checkItems: [
      { id: 1, type: 'id_card', name: '身份核实', status: 'passed', result: '姓名、身份证号与公安系统一致', remark: '' },
      { id: 2, type: 'education', name: '学历验证', status: 'passed', result: '北京大学 计算机科学与技术 本科 2019 届 已核实', remark: '' },
      { id: 3, type: 'work_exp', name: '工作履历', status: 'passed', result: '2 段工作经历均核实无误', remark: '' },
      { id: 4, type: 'civil_case', name: '民事诉讼', status: 'passed', result: '未查询到相关民事诉讼记录', remark: '' }
    ],
    reportFileName: 'BG202604001_张三_标准背调报告.pdf',
    reportUrl: 'https://bg.example.com/report/BG202604001.pdf',
    conclusion: 1,
    riskLevel: 1,
    riskSummary: '所有调查项均核实通过，无任何风险提示',
    cost: 288,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-04-05 09:30:00',
    updateTime: '2026-04-08 15:00:00',
    completeTime: '2026-04-08 15:00:00'
  },
  {
    id: 2,
    orderNo: 'BG202604002',
    candidateName: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    idNumber: '310101199205025678',
    position: 'Java后端工程师',
    department: '技术部',
    packageId: 2,
    packageName: '标准背调',
    packageLevel: 'standard',
    vendor: 1,
    status: 2,
    authUrl: 'https://bg.example.com/auth/BG202604002',
    authSendTime: '2026-04-10 10:00:00',
    authTime: '2026-04-10 20:15:00',
    authExpireTime: '2026-04-17 10:00:00',
    checkItems: [
      { id: 1, type: 'id_card', name: '身份核实', status: 'passed', result: '核实通过', remark: '' },
      { id: 2, type: 'education', name: '学历验证', status: 'checking', result: '', remark: '学信网查询中' },
      { id: 3, type: 'work_exp', name: '工作履历', status: 'checking', result: '', remark: '前雇主 HR 联系中' },
      { id: 4, type: 'civil_case', name: '民事诉讼', status: 'pending', result: '', remark: '' }
    ],
    cost: 288,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-04-10 09:30:00',
    updateTime: '2026-04-15 11:20:00'
  },
  {
    id: 3,
    orderNo: 'BG202604003',
    candidateName: '王五',
    phone: '13900139003',
    email: 'wangwu@example.com',
    idNumber: '440301198503156789',
    position: '技术总监',
    department: '技术部',
    packageId: 3,
    packageName: '高管背调',
    packageLevel: 'executive',
    vendor: 2,
    status: 3,
    authUrl: 'https://bg.example.com/auth/BG202604003',
    authSendTime: '2026-04-01 09:00:00',
    authTime: '2026-04-01 10:30:00',
    authExpireTime: '2026-04-08 09:00:00',
    checkItems: [
      { id: 1, type: 'id_card', name: '身份核实', status: 'passed', result: '核实通过', remark: '' },
      { id: 2, type: 'education', name: '学历验证', status: 'passed', result: '清华大学 软件工程 硕士', remark: '' },
      { id: 3, type: 'work_exp', name: '工作履历', status: 'suspicious', result: '第二段工作经历时间与前雇主记录存在 3 个月出入', remark: '候选人自述 2020-01 离职，前 HR 确认实际 2020-04' },
      { id: 4, type: 'civil_case', name: '民事诉讼', status: 'passed', result: '无记录', remark: '' },
      { id: 5, type: 'criminal', name: '刑事背景', status: 'passed', result: '无记录', remark: '' },
      { id: 6, type: 'finance', name: '金融信用', status: 'passed', result: '信用良好，无失信记录', remark: '' },
      { id: 7, type: 'commercial', name: '工商关联', status: 'passed', result: '名下无关联企业', remark: '' },
      { id: 8, type: 'professional', name: '职业资格', status: 'passed', result: 'PMP 证书有效', remark: '' }
    ],
    reportFileName: 'BG202604003_王五_高管背调报告.pdf',
    reportUrl: 'https://bg.example.com/report/BG202604003.pdf',
    conclusion: 2,
    riskLevel: 2,
    riskSummary: '工作履历存在时间出入（约 3 个月），建议面谈复核；其他调查项均通过',
    cost: 1280,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-04-01 08:30:00',
    updateTime: '2026-04-06 18:00:00',
    completeTime: '2026-04-06 18:00:00'
  },
  {
    id: 4,
    orderNo: 'BG202604004',
    candidateName: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    idNumber: '320101199412086789',
    position: '产品经理',
    department: '产品部',
    packageId: 2,
    packageName: '标准背调',
    packageLevel: 'standard',
    vendor: 1,
    status: 1,
    authUrl: 'https://bg.example.com/auth/BG202604004',
    authSendTime: '2026-04-18 14:00:00',
    authExpireTime: '2026-04-25 14:00:00',
    checkItems: buildCheckItems(['id_card', 'education', 'work_exp', 'civil_case']),
    cost: 288,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-04-18 13:30:00',
    updateTime: '2026-04-18 14:00:00'
  },
  {
    id: 5,
    orderNo: 'BG202604005',
    candidateName: '孙七',
    phone: '13800138005',
    email: 'sunqi@example.com',
    idNumber: '510101199808234567',
    position: '测试工程师',
    department: '技术部',
    packageId: 1,
    packageName: '基础背调',
    packageLevel: 'basic',
    vendor: 1,
    status: 4,
    authUrl: 'https://bg.example.com/auth/BG202604005',
    authSendTime: '2026-03-20 10:00:00',
    authExpireTime: '2026-03-27 10:00:00',
    checkItems: buildCheckItems(['id_card', 'education']),
    cost: 98,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-03-20 09:30:00',
    updateTime: '2026-03-27 10:01:00',
    cancelReason: '候选人在授权截止日（2026-03-27）前未完成授权，系统自动取消'
  },
  {
    id: 6,
    orderNo: 'BG202604006',
    candidateName: '周八',
    phone: '13800138006',
    email: 'zhouba@example.com',
    idNumber: '420101199503123456',
    position: 'UI设计师',
    department: '设计部',
    packageId: 1,
    packageName: '基础背调',
    packageLevel: 'basic',
    vendor: 4,
    status: 3,
    authSendTime: '2026-04-02 10:00:00',
    authTime: '2026-04-02 11:00:00',
    authExpireTime: '2026-04-09 10:00:00',
    checkItems: [
      { id: 1, type: 'id_card', name: '身份核实', status: 'passed', result: '手工上传身份证复印件核实', remark: '手工模式' },
      { id: 2, type: 'education', name: '学历验证', status: 'passed', result: '手工上传学历证书核实', remark: '手工模式' }
    ],
    reportFileName: 'BG202604006_周八_手工背调报告.pdf',
    reportUrl: 'https://bg.example.com/report/BG202604006.pdf',
    conclusion: 1,
    riskLevel: 1,
    riskSummary: '手工核验通过，无风险',
    cost: 0,
    createdById: 3,
    createdByName: '张HR',
    createTime: '2026-04-02 09:30:00',
    updateTime: '2026-04-04 16:00:00',
    completeTime: '2026-04-04 16:00:00'
  }
]

export const bgOrderCrudMock = createCrudMock<BackgroundCheck>(initialOrders, {
  searchFields: ['orderNo', 'candidateName', 'phone', 'position']
})

/* ========== 业务操作 Mock ========== */

/** 按候选人姓名查背调订单（候选人详情页 Timeline 用）*/
export function getBackgroundChecksByCandidateNameMock(name: string) {
  return initialOrders
    .filter((o) => o.candidateName === name)
    .sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''))
}

/**
 * 发送授权链接（BG-002）
 */
export function sendAuthLinkMock(id: number): BackgroundCheck {
  const order = bgOrderCrudMock.getDetail(id)
  if (!order) throw new Error('订单不存在')
  if (order.status !== 0) throw new Error('仅待发起状态的订单可发送授权')

  const now = new Date()
  const expire = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  order.status = 1
  order.authUrl = `https://bg.example.com/auth/${order.orderNo}`
  order.authSendTime = now.toLocaleString('zh-CN')
  order.authExpireTime = expire.toLocaleString('zh-CN')
  order.updateTime = order.authSendTime
  bgOrderCrudMock.update(order)
  return order
}

/**
 * 模拟候选人授权（Demo）
 */
export function simulateAuthMock(id: number): BackgroundCheck {
  const order = bgOrderCrudMock.getDetail(id)
  if (!order) throw new Error('订单不存在')
  if (order.status !== 1) throw new Error('当前状态不支持授权')

  const now = new Date().toLocaleString('zh-CN')
  order.status = 2
  order.authTime = now
  order.updateTime = now
  // 部分调查项进入调查中
  order.checkItems = order.checkItems.map((item, idx) => ({
    ...item,
    status: idx < 2 ? 'checking' : 'pending'
  }))
  bgOrderCrudMock.update(order)
  return order
}

/**
 * 模拟完成调查（Demo）：所有项通过、生成报告
 */
export function simulateCompleteMock(id: number): BackgroundCheck {
  const order = bgOrderCrudMock.getDetail(id)
  if (!order) throw new Error('订单不存在')
  if (order.status !== 2) throw new Error('仅调查中状态可完成')

  const now = new Date().toLocaleString('zh-CN')
  order.status = 3
  order.completeTime = now
  order.updateTime = now
  order.checkItems = order.checkItems.map((item) => ({
    ...item,
    status: 'passed',
    result: item.result || '核验通过'
  }))
  order.reportFileName = `${order.orderNo}_${order.candidateName}_${order.packageName}报告.pdf`
  order.reportUrl = `https://bg.example.com/report/${order.orderNo}.pdf`
  order.conclusion = 1
  order.riskLevel = 1
  order.riskSummary = '所有调查项核验通过，无风险提示'
  bgOrderCrudMock.update(order)
  return order
}

/**
 * 取消订单
 */
export function cancelOrderMock(id: number, reason: string): BackgroundCheck {
  const order = bgOrderCrudMock.getDetail(id)
  if (!order) throw new Error('订单不存在')
  if (order.status === 3) throw new Error('已完成的订单不能取消')

  const now = new Date().toLocaleString('zh-CN')
  order.status = 5
  order.cancelReason = reason
  order.updateTime = now
  bgOrderCrudMock.update(order)
  return order
}

/**
 * 费用统计
 */
export function getCostStatsMock(): BGCostStats {
  const orders = bgOrderCrudMock.getData()
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === 3).length
  const totalCost = orders.reduce((sum, o) => sum + (o.cost || 0), 0)
  const avgCost = totalOrders > 0 ? Math.round(totalCost / totalOrders) : 0

  // 按服务商
  const vendorMap = new Map<number, { count: number; cost: number }>()
  for (const o of orders) {
    if (!vendorMap.has(o.vendor)) vendorMap.set(o.vendor, { count: 0, cost: 0 })
    const v = vendorMap.get(o.vendor)!
    v.count++
    v.cost += o.cost
  }
  const byVendor = [...vendorMap.entries()].map(([vendor, v]) => ({
    vendor: vendor as 1 | 2 | 3 | 4,
    count: v.count,
    cost: v.cost
  }))

  // 按套餐等级
  const levelMap = new Map<string, { count: number; cost: number }>()
  for (const o of orders) {
    if (!levelMap.has(o.packageLevel)) levelMap.set(o.packageLevel, { count: 0, cost: 0 })
    const l = levelMap.get(o.packageLevel)!
    l.count++
    l.cost += o.cost
  }
  const byLevel = [...levelMap.entries()].map(([level, l]) => ({
    level: level as any,
    count: l.count,
    cost: l.cost
  }))

  // 近 6 个月趋势（固定演示数据）
  const now = new Date()
  const sampleOrders = [3, 5, 4, 6, 8, 6]
  const sampleCosts = [588, 1280, 864, 1664, 2432, 2242]
  const monthlyTrend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    monthlyTrend.push({
      month: `${yyyy}-${mm}`,
      orderCount: sampleOrders[5 - i],
      cost: sampleCosts[5 - i]
    })
  }

  return {
    totalOrders,
    completedOrders,
    totalCost,
    avgCost,
    byVendor,
    byLevel,
    monthlyTrend
  }
}
