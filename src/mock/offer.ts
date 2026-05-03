// @ts-nocheck
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Offer } from '@/types/recruitment'
import { EMPLOYEES } from './core/employeePool'

/**
 * Offer 初始数据 = 历史已接受（反推自员工档案 200 人）+ 进行中（7 条全新姓名）+ 已结束非接受（7 条全新姓名）
 *
 * 业务逻辑：
 * - 员工档案里每个员工 = 当初接受了 Offer 才入职 → Offer 管理至少有 200 条 status=5 已接受的历史数据
 * - 员工档案 + Offer 数据完整性：通过 Employee.sourceOfferNo / sourceResumeNo 反向追溯
 * - 进行中 / 候选人拒绝 / 审批拒绝 / 已撤回的 Offer = **全新姓名**（这些人当初没入职，员工档案里没有）
 *
 * 状态分布（共 ~214 条）：
 * - 1 待审批：2 条（全新姓名）
 * - 2 已批准：1 条（全新姓名）
 * - 3 审批拒绝：2 条（全新姓名）
 * - 4 已发送：4 条（全新姓名）
 * - 5 已接受：~200 条（来自员工档案反推）
 * - 6 候选人拒绝：2 条（全新姓名）
 * - 7 已撤回：3 条（全新姓名）
 */

/* ============ 工具函数 ============ */

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDateTime(dateStr: string, days: number, hour = 10): string {
  return `${addDays(dateStr, days)} ${String(hour).padStart(2, '0')}:00:00`
}

/* ============ 1. 反推已接受 Offer（200 条 · 来自员工档案）============ */

const acceptedOffers: Offer[] = EMPLOYEES.map((emp, idx) => {
  const monthlySalary = (emp.baseSalary || 0) + (emp.positionSalary || 0)
  const probationSalary = Math.round((monthlySalary * 0.8) / 1000) * 1000
  // 反推时间线：审批 = 入职前 2 周 / 发送 = 入职前 12 天 / 候选人接受 = 入职前 7 天
  const approveTime = addDateTime(emp.entryDate, -14, 14)
  const sendTime = addDateTime(emp.entryDate, -12, 10)
  const responseTime = addDateTime(emp.entryDate, -7, 9)
  const createTime = addDateTime(emp.entryDate, -16, 9)

  return {
    id: idx + 1,
    offerNo: emp.sourceOfferNo,
    resumeId: 100000 + emp.id,
    resumeNo: emp.sourceResumeNo,
    candidateName: emp.nameZh,
    positionName: emp.positionName,
    departmentName: emp.orgName,
    status: 5,
    salary: String(monthlySalary),
    probationPeriod: 3,
    probationSalary: String(probationSalary),
    expectedJoinDate: emp.entryDate,
    workLocation: emp.workLocation || '上海',
    benefits: '五险一金、补充医疗、年度体检',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime,
    approveRemark: '同意',
    sendTime,
    responseTime,
    responseRemark: '已接受',
    offerTemplateId: 1,
    offerTemplateName: '标准岗位模板',
    version: 1,
    reportingTo: '直属上级',
    feedbackDeadline: addDateTime(emp.entryDate, -5, 18),
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime,
    updateTime: responseTime
  } as Offer
})

const acceptedTopId = acceptedOffers.length

/* ============ 2. 进行中 + 已结束（非接受）的 Offer 用全新姓名 ============ */

const inProgressAndRejectedOffers: Offer[] = [
  // 待审批 1 · 候选人 7 天内未审批，状态停留较久
  {
    id: acceptedTopId + 1,
    offerNo: 'OF202604E001',
    resumeId: 200001,
    resumeNo: 'RES202604001',
    candidateName: '岑奕辰',
    positionName: '高级前端工程师',
    departmentName: '前端组',
    status: 1,
    salary: '32000',
    probationPeriod: 3,
    probationSalary: '25600',
    expectedJoinDate: '2026-05-15',
    workLocation: '上海',
    benefits: '五险一金、补充医疗、股票期权',
    otherInfo: '',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-05-10 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-22 09:00:00',
    updateTime: '2026-04-22 09:00:00'
  },
  // 待审批 2 · 刚发起
  {
    id: acceptedTopId + 2,
    offerNo: 'OF202604E002',
    resumeId: 200002,
    resumeNo: 'RES202604002',
    candidateName: '霍致远',
    positionName: '资深产品经理',
    departmentName: '产品经理组',
    status: 1,
    salary: '28000',
    probationPeriod: 3,
    probationSalary: '22400',
    expectedJoinDate: '2026-05-20',
    workLocation: '北京',
    benefits: '五险一金、补充医疗、出差补助',
    otherInfo: '',
    offerTemplateId: 2,
    offerTemplateName: '产品岗位标准模板',
    version: 1,
    reportingTo: '李总监',
    feedbackDeadline: '2026-05-12 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-29 14:00:00',
    updateTime: '2026-04-29 14:00:00'
  },
  // 已批准 · 待发送
  {
    id: acceptedTopId + 3,
    offerNo: 'OF202604E003',
    resumeId: 200003,
    resumeNo: 'RES202604003',
    candidateName: '裴砚青',
    positionName: '架构师',
    departmentName: '后端组',
    status: 2,
    salary: '45000',
    probationPeriod: 6,
    probationSalary: '36000',
    expectedJoinDate: '2026-05-25',
    workLocation: '上海',
    benefits: '五险一金、补充医疗、股票期权、年度旅游',
    otherInfo: '资深架构师，预算特批',
    approverId: 9006,
    approverName: 'CTO',
    approveTime: '2026-04-26 16:00:00',
    approveRemark: '同意以 P8 发放',
    offerTemplateId: 4,
    offerTemplateName: '管理岗位高级模板',
    version: 1,
    reportingTo: 'CTO',
    feedbackDeadline: '2026-05-15 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-25 10:00:00',
    updateTime: '2026-04-26 16:00:00'
  },
  // 审批拒绝 1 · 薪资超带宽
  {
    id: acceptedTopId + 4,
    offerNo: 'OF202604E004',
    resumeId: 200004,
    resumeNo: 'RES202604004',
    candidateName: '葛梓豪',
    positionName: '高级数据分析师',
    departmentName: '后端组',
    status: 3,
    salary: '24000',
    probationPeriod: 3,
    probationSalary: '19200',
    expectedJoinDate: '2026-05-08',
    workLocation: '深圳',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime: '2026-04-20 11:00:00',
    approveRemark: '薪资超 P5 带宽，请重新协商或考虑 P6 路径',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-04-25 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-20 09:00:00',
    updateTime: '2026-04-20 11:00:00'
  },
  // 审批拒绝 2 · HC 已满
  {
    id: acceptedTopId + 5,
    offerNo: 'OF202604E005',
    resumeId: 200005,
    resumeNo: 'RES202604005',
    candidateName: '苗清越',
    positionName: '运营经理',
    departmentName: '运营组',
    status: 3,
    salary: '20000',
    probationPeriod: 3,
    probationSalary: '16000',
    expectedJoinDate: '2026-05-10',
    workLocation: '广州',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9008,
    approverName: '运营总监',
    approveTime: '2026-04-21 10:00:00',
    approveRemark: '本部门 HC 已满，建议下季度再开 HC',
    offerTemplateId: 3,
    offerTemplateName: '通用岗位模板',
    version: 1,
    reportingTo: '运营总监',
    feedbackDeadline: '2026-04-26 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-21 09:00:00',
    updateTime: '2026-04-21 10:00:00'
  },
  // 已发送 1 · 等候选人响应
  {
    id: acceptedTopId + 6,
    offerNo: 'OF202604E006',
    resumeId: 200006,
    resumeNo: 'RES202604006',
    candidateName: '邱令宇',
    positionName: 'Java 开发工程师',
    departmentName: '后端组',
    status: 4,
    salary: '22000',
    probationPeriod: 3,
    probationSalary: '17600',
    expectedJoinDate: '2026-05-18',
    workLocation: '上海',
    benefits: '五险一金、补充医疗、股票期权',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime: '2026-04-25 11:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-25 14:30:00',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-05-08 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-24 10:00:00',
    updateTime: '2026-04-25 14:30:00'
  },
  // 已发送 2 · 状态停留较久（用于 status-duration 警告色演示）
  {
    id: acceptedTopId + 7,
    offerNo: 'OF202604E007',
    resumeId: 200007,
    resumeNo: 'RES202604007',
    candidateName: '蒲沂笙',
    positionName: 'UX 设计师',
    departmentName: 'UX 设计组',
    status: 4,
    salary: '18000',
    probationPeriod: 3,
    probationSalary: '14400',
    expectedJoinDate: '2026-05-12',
    workLocation: '上海',
    benefits: '五险一金、补充医疗',
    otherInfo: '',
    approverId: 9002,
    approverName: '设计总监',
    approveTime: '2026-04-19 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-20 11:00:00',
    offerTemplateId: 2,
    offerTemplateName: '设计岗位标准模板',
    version: 1,
    reportingTo: '设计总监',
    feedbackDeadline: '2026-05-05 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-19 09:00:00',
    updateTime: '2026-04-20 11:00:00'
  },
  // 已发送 3
  {
    id: acceptedTopId + 8,
    offerNo: 'OF202604E008',
    resumeId: 200008,
    resumeNo: 'RES202604008',
    candidateName: '阮泽珩',
    positionName: '测试工程师',
    departmentName: '后端组',
    status: 4,
    salary: '14000',
    probationPeriod: 3,
    probationSalary: '11200',
    expectedJoinDate: '2026-05-22',
    workLocation: '北京',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime: '2026-04-27 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-27 15:00:00',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-05-10 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-26 09:00:00',
    updateTime: '2026-04-27 15:00:00'
  },
  // 已发送 4
  {
    id: acceptedTopId + 9,
    offerNo: 'OF202604E009',
    resumeId: 200009,
    resumeNo: 'RES202604009',
    candidateName: '盛望舒',
    positionName: '市场专员',
    departmentName: '市场组',
    status: 4,
    salary: '12000',
    probationPeriod: 3,
    probationSalary: '9600',
    expectedJoinDate: '2026-05-14',
    workLocation: '北京',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9009,
    approverName: '市场总监',
    approveTime: '2026-04-28 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-28 14:00:00',
    offerTemplateId: 3,
    offerTemplateName: '通用岗位模板',
    version: 1,
    reportingTo: '市场总监',
    feedbackDeadline: '2026-05-09 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-27 14:00:00',
    updateTime: '2026-04-28 14:00:00'
  },
  // 候选人拒绝 1 · 收到更高薪资
  {
    id: acceptedTopId + 10,
    offerNo: 'OF202604E010',
    resumeId: 200010,
    resumeNo: 'RES202604010',
    candidateName: '蓝景行',
    positionName: '运维工程师',
    departmentName: '后端组',
    status: 6,
    salary: '17000',
    probationPeriod: 3,
    probationSalary: '13600',
    expectedJoinDate: '2026-05-05',
    workLocation: '深圳',
    benefits: '五险一金、补充医疗',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime: '2026-04-15 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-15 14:00:00',
    responseTime: '2026-04-18 16:00:00',
    responseRemark: '收到了更高薪资的 Offer',
    rejectReasonCode: 'salary_higher',
    rejectReasonText: '收到其他公司更高薪资的 Offer',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-04-25 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-14 10:00:00',
    updateTime: '2026-04-18 16:00:00'
  },
  // 候选人拒绝 2 · 拒绝原因 - 工作地点不合适
  {
    id: acceptedTopId + 11,
    offerNo: 'OF202604E011',
    resumeId: 200011,
    resumeNo: 'RES202604011',
    candidateName: '聂望川',
    positionName: '招聘经理',
    departmentName: '招聘组',
    status: 6,
    salary: '19000',
    probationPeriod: 3,
    probationSalary: '15200',
    expectedJoinDate: '2026-05-06',
    workLocation: '广州',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9004,
    approverName: 'HR 总监',
    approveTime: '2026-04-16 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-16 14:00:00',
    responseTime: '2026-04-19 11:00:00',
    responseRemark: '工作地点离家太远',
    rejectReasonCode: 'location',
    rejectReasonText: '工作地点不合适，无法搬迁',
    offerTemplateId: 3,
    offerTemplateName: '通用岗位模板',
    version: 1,
    reportingTo: 'HR 总监',
    feedbackDeadline: '2026-04-26 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-19 11:00:00'
  },
  // 已撤回 1 · 候选人长期未响应
  {
    id: acceptedTopId + 12,
    offerNo: 'OF202604E012',
    resumeId: 200012,
    resumeNo: 'RES202604012',
    candidateName: '骆怀瑾',
    positionName: '财务专员',
    departmentName: '招聘组',
    status: 7,
    salary: '13000',
    probationPeriod: 3,
    probationSalary: '10400',
    expectedJoinDate: '2026-04-25',
    workLocation: '北京',
    benefits: '五险一金',
    otherInfo: '',
    approverId: 9005,
    approverName: '财务总监',
    approveTime: '2026-04-08 14:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-08 15:30:00',
    responseRemark: '[已撤回] 候选人 7 天内未响应，HR 主动撤回',
    offerTemplateId: 3,
    offerTemplateName: '通用岗位模板',
    version: 1,
    reportingTo: '财务总监',
    feedbackDeadline: '2026-04-15 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-08 10:00:00',
    updateTime: '2026-04-16 09:00:00'
  },
  // 已撤回 2 · 背调发现简历造假
  {
    id: acceptedTopId + 13,
    offerNo: 'OF202604E013',
    resumeId: 200013,
    resumeNo: 'RES202604013',
    candidateName: '解云澈',
    positionName: 'Java 开发工程师',
    departmentName: '后端组',
    status: 7,
    salary: '21000',
    probationPeriod: 3,
    probationSalary: '16800',
    expectedJoinDate: '2026-04-28',
    workLocation: '上海',
    benefits: '五险一金、补充医疗',
    otherInfo: '',
    approverId: 9001,
    approverName: 'HR 经理',
    approveTime: '2026-04-10 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-10 14:00:00',
    responseRemark: '[已撤回] 背调发现简历学历造假，撤回 Offer',
    offerTemplateId: 1,
    offerTemplateName: '技术岗位标准模板',
    version: 1,
    reportingTo: '王经理',
    feedbackDeadline: '2026-04-20 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-09 10:00:00',
    updateTime: '2026-04-15 14:00:00'
  },
  // 已撤回 3 · 公司 HC 取消
  {
    id: acceptedTopId + 14,
    offerNo: 'OF202604E014',
    resumeId: 200014,
    resumeNo: 'RES202604014',
    candidateName: '简舒予',
    positionName: '产品经理',
    departmentName: '产品经理组',
    status: 7,
    salary: '23000',
    probationPeriod: 3,
    probationSalary: '18400',
    expectedJoinDate: '2026-05-02',
    workLocation: '北京',
    benefits: '五险一金、补充医疗',
    otherInfo: '',
    approverId: 9003,
    approverName: '产品总监',
    approveTime: '2026-04-12 10:00:00',
    approveRemark: '同意',
    sendTime: '2026-04-12 14:00:00',
    responseRemark: '[已撤回] 部门 HC 取消，无法继续',
    offerTemplateId: 2,
    offerTemplateName: '产品岗位标准模板',
    version: 1,
    reportingTo: '产品总监',
    feedbackDeadline: '2026-04-22 18:00:00',
    creatorId: 9999,
    creatorName: 'HR-Lisa',
    createTime: '2026-04-11 10:00:00',
    updateTime: '2026-04-17 09:00:00'
  }
]

/* ============ 3. 合并：~200 已接受 + 14 进行中/已结束（非接受）============ */
const initialData: Offer[] = [...acceptedOffers, ...inProgressAndRejectedOffers]

/**
 * 创建 Offer CRUD Mock
 */
export const offerMock = createCrudMock<Offer>(initialData, {
  searchFields: ['offerNo', 'candidateName', 'positionName']
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
