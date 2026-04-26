// @ts-nocheck
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Offer } from '@/types/recruitment'

/**
 * Offer 初始数据
 */
const initialData: Offer[] = [
  {
    id: 1,
    offerNo: 'OF202604001',
    candidateName: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    position: '前端开发工程师',
    departmentName: '技术部',
    offerSalary: '15000',
    expectedOnboardDate: '2026-04-15',
    offerValidDate: '2026-04-20',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 1,
    acceptTime: '2026-04-05 10:30:00',
    rejectReason: '',
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-05 10:30:00'
  },
  {
    id: 2,
    offerNo: 'OF202604002',
    candidateName: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    position: 'Java开发工程师',
    departmentName: '技术部',
    offerSalary: '18000',
    expectedOnboardDate: '2026-04-20',
    offerValidDate: '2026-04-25',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-02 10:00:00',
    updateTime: '2026-04-02 14:30:00'
  },
  {
    id: 3,
    offerNo: 'OF202604003',
    candidateName: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    position: 'UI设计师',
    departmentName: '设计部',
    offerSalary: '12000',
    expectedOnboardDate: '2026-04-18',
    offerValidDate: '2026-04-23',
    approvalStatus: 0,
    sendStatus: 0,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-03 11:00:00',
    updateTime: '2026-04-03 11:00:00'
  },
  {
    id: 4,
    offerNo: 'OF202604004',
    candidateName: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    position: '产品经理',
    departmentName: '产品部',
    offerSalary: '20000',
    expectedOnboardDate: '2026-04-22',
    offerValidDate: '2026-04-27',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 2,
    acceptTime: '2026-04-04 16:00:00',
    rejectReason: '薪资待遇未达预期',
    createTime: '2026-04-02 14:00:00',
    updateTime: '2026-04-04 16:00:00'
  },
  {
    id: 5,
    offerNo: 'OF202604005',
    candidateName: '孙七',
    phone: '13800138005',
    email: 'sunqi@example.com',
    position: '测试工程师',
    departmentName: '技术部',
    offerSalary: '13000',
    expectedOnboardDate: '2026-04-25',
    offerValidDate: '2026-04-30',
    approvalStatus: 2,
    sendStatus: 0,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-03 15:00:00',
    updateTime: '2026-04-04 09:00:00'
  },
  {
    id: 6,
    offerNo: 'OF202604006',
    candidateName: '周八',
    phone: '13800138006',
    email: 'zhouba@example.com',
    position: '运维工程师',
    departmentName: '技术部',
    offerSalary: '16000',
    expectedOnboardDate: '2026-04-28',
    offerValidDate: '2026-05-03',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 1,
    acceptTime: '2026-04-05 14:20:00',
    rejectReason: '',
    createTime: '2026-04-04 10:00:00',
    updateTime: '2026-04-05 14:20:00'
  },
  {
    id: 7,
    offerNo: 'OF202604007',
    candidateName: '吴九',
    phone: '13800138007',
    email: 'wujiu@example.com',
    position: '人力资源专员',
    departmentName: '人力资源部',
    offerSalary: '10000',
    expectedOnboardDate: '2026-04-16',
    offerValidDate: '2026-04-21',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-01 16:00:00',
    updateTime: '2026-04-02 10:00:00'
  },
  {
    id: 8,
    offerNo: 'OF202604008',
    candidateName: '郑十',
    phone: '13800138008',
    email: 'zhengshi@example.com',
    position: '市场专员',
    departmentName: '市场部',
    offerSalary: '11000',
    expectedOnboardDate: '2026-04-19',
    offerValidDate: '2026-04-24',
    approvalStatus: 0,
    sendStatus: 0,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-05 09:00:00'
  },
  {
    id: 9,
    offerNo: 'OF202604009',
    candidateName: '钱十一',
    phone: '13800138009',
    email: 'qianshiyi@example.com',
    position: '财务专员',
    departmentName: '财务部',
    offerSalary: '9000',
    expectedOnboardDate: '2026-04-21',
    offerValidDate: '2026-04-26',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 2,
    acceptTime: '2026-04-05 11:00:00',
    rejectReason: '找到更合适的工作机会',
    createTime: '2026-04-03 13:00:00',
    updateTime: '2026-04-05 11:00:00'
  },
  {
    id: 10,
    offerNo: 'OF202604010',
    candidateName: '陈十二',
    phone: '13800138010',
    email: 'chenshier@example.com',
    position: 'Android开发工程师',
    departmentName: '技术部',
    offerSalary: '17000',
    expectedOnboardDate: '2026-04-26',
    offerValidDate: '2026-05-01',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 1,
    acceptTime: '2026-04-06 09:30:00',
    rejectReason: '',
    createTime: '2026-04-04 14:00:00',
    updateTime: '2026-04-06 09:30:00'
  },
  {
    id: 11,
    offerNo: 'OF202604011',
    candidateName: '林十三',
    phone: '13800138011',
    email: 'linshisan@example.com',
    position: '数据分析师',
    departmentName: '技术部',
    offerSalary: '14000',
    expectedOnboardDate: '2026-04-23',
    offerValidDate: '2026-04-28',
    approvalStatus: 0,
    sendStatus: 0,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-05 15:00:00',
    updateTime: '2026-04-05 15:00:00'
  },
  {
    id: 12,
    offerNo: 'OF202604012',
    candidateName: '黄十四',
    phone: '13800138012',
    email: 'huangshisi@example.com',
    position: '客服专员',
    departmentName: '客服部',
    offerSalary: '8000',
    expectedOnboardDate: '2026-04-17',
    offerValidDate: '2026-04-22',
    approvalStatus: 1,
    sendStatus: 1,
    acceptStatus: 0,
    acceptTime: '',
    rejectReason: '',
    createTime: '2026-04-02 11:00:00',
    updateTime: '2026-04-03 09:00:00'
  }
]

/**
 * 创建 Offer CRUD Mock
 */
export const offerMock = createCrudMock<Offer>(initialData, {
  searchFields: ['offerNo', 'candidateName', 'position']
})

export const {
  getList: getListMock,
  getDetail: getDetailMock,
  add: addMock,
  update: updateMock,
  delete: deleteMock,
  batchDelete: batchDeleteMock
} = offerMock

// ============ Phase 2.3 新增：变量替换 + 版本管理 ============

/** 按候选人姓名查 Offer 记录（候选人详情页 Timeline 用）*/
export function getOffersByCandidateNameMock(name: string) {
  return initialData
    .filter((o) => o.candidateName === name)
    .sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''))
}

/**
 * 变量替换：把模板内容中 {{变量名}} 替换为实际值
 */
export function renderOfferContent(template: string, vars: Record<string, string>): string {
  if (!template) return ''
  return template.replace(/\{\{(.+?)\}\}/g, (_m, key) => {
    const k = (key as string).trim()
    return vars[k] ?? `{{${k}}}`
  })
}

/**
 * 创建 Offer（含模板渲染）
 */
export function createOfferMock(data: Partial<Offer>, renderedContent?: string) {
  const next = offerMock.add({
    ...data,
    version: 1,
    offerContent: renderedContent,
    status: data.status ?? 1
  })
  return next
}

/**
 * 更新 Offer（协商场景：版本号 +1）
 */
export function bumpVersionOfferMock(id: number, data: Partial<Offer>, renderedContent?: string) {
  const detail = offerMock.getDetail(id)
  if (!detail) throw new Error('Offer 不存在')
  const newVersion = (detail.version || 1) + 1
  return offerMock.update({
    ...detail,
    ...data,
    id,
    version: newVersion,
    offerContent: renderedContent ?? detail.offerContent
  })
}

/**
 * 候选人拒绝 Offer（带拒绝原因）
 */
export function candidateRejectOfferMock(id: number, reasonCode: string, reasonText: string) {
  return offerMock.update({
    id,
    status: 6, // 候选人拒绝
    rejectReasonCode: reasonCode,
    rejectReasonText: reasonText,
    responseTime: new Date().toLocaleString('zh-CN')
  } as any)
}

/**
 * 候选人接受 Offer
 */
export function candidateAcceptOfferMock(id: number) {
  return offerMock.update({
    id,
    status: 5, // 已接受
    responseTime: new Date().toLocaleString('zh-CN')
  } as any)
}

/**
 * 撤回 Offer（HR 主动撤回已发送的 Offer）
 */
export function withdrawOfferMock(id: number, reason: string) {
  return offerMock.update({
    id,
    status: 7, // 已失效
    responseRemark: `[已撤回] ${reason}`,
    updateTime: new Date().toLocaleString('zh-CN')
  } as any)
}
