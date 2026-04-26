// @ts-nocheck
/**
 * 候选人入职衔接（Pre-Onboarding）Mock 数据
 * 对应 types/recruitment.ts 的 Onboarding 类型
 * 服务于 views/recruitment/onboarding/index.vue
 *
 * 与 mock/onboarding.ts（员工入职办理）字段不同，切勿混用
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Onboarding, MultiDeptTask } from '@/types/recruitment'

/** 构造多部门任务 JSON */
function buildDeptTasksJson(tasks: MultiDeptTask[]): string {
  return JSON.stringify(tasks)
}

/** 标准预置任务 */
const standardDeptTasks: MultiDeptTask[] = [
  { name: '开通系统账号（OA/邮箱/钉钉）', owner: 'IT', assignee: '王工', status: 'pending', remark: '' },
  { name: '配发办公电脑及外设', owner: 'IT', assignee: '王工', status: 'pending', remark: '' },
  { name: '准备工位 + 门禁卡', owner: '行政', assignee: '刘姐', status: 'pending', remark: '' },
  { name: '安排入职导师对接', owner: 'HRBP', assignee: '张HR', status: 'pending', remark: '' }
]

const initialData: Onboarding[] = [
  {
    id: 1,
    onboardingNo: 'PRE202604001',
    offerId: 1,
    offerNo: 'OF202604001',
    candidateName: '张三',
    employeeName: '张三',
    positionName: '前端开发工程师',
    position: '前端开发工程师',
    departmentName: '技术部',
    department: '技术部',
    plannedJoinDate: '2026-04-15',
    onboardingDate: '2026-04-15',
    status: 1, // 1-待入职
    mentorId: 101,
    mentorName: '李四',
    mentor: '李四',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    completedMaterials: 0,
    completed: 0,
    totalMaterials: 5,
    accountStatus: 1,
    responsibleId: 3,
    responsibleName: '张HR',
    // Phase 2.4
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: undefined,
    fillProgress: 0,
    multiDeptTasks: buildDeptTasksJson(standardDeptTasks),
    noShowAlert: 0,
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-01 09:00:00'
  },
  {
    id: 2,
    onboardingNo: 'PRE202604002',
    offerId: 2,
    offerNo: 'OF202604002',
    candidateName: '王芳',
    employeeName: '王芳',
    positionName: 'UI设计师',
    position: 'UI设计师',
    departmentName: '设计部',
    department: '设计部',
    plannedJoinDate: '2026-04-12',
    onboardingDate: '2026-04-12',
    status: 2, // 2-材料准备中
    mentorId: 102,
    mentorName: '赵敏',
    mentor: '赵敏',
    phone: '13800138002',
    email: 'wangfang@example.com',
    completedMaterials: 3,
    completed: 3,
    totalMaterials: 5,
    accountStatus: 1,
    responsibleId: 3,
    responsibleName: '张HR',
    // Phase 2.4：已发送填报链接，候选人填报进行中
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: 'https://pre-onboarding.example.com/fill/PRE202604002?token=a1b2c3',
    fillProgress: 60,
    multiDeptTasks: buildDeptTasksJson([
      { name: '开通系统账号（OA/邮箱/钉钉）', owner: 'IT', assignee: '王工', status: 'doing', remark: '' },
      { name: '配发办公电脑及外设', owner: 'IT', assignee: '王工', status: 'pending', remark: '' },
      { name: '准备工位 + 门禁卡', owner: '行政', assignee: '刘姐', status: 'done', completeTime: '2026-04-08 15:00:00', remark: '' },
      { name: '安排入职导师对接', owner: 'HRBP', assignee: '张HR', status: 'done', completeTime: '2026-04-07 10:00:00', remark: '' }
    ]),
    noShowAlert: 0,
    createTime: '2026-04-02 10:15:00',
    updateTime: '2026-04-08 15:00:00'
  },
  {
    id: 3,
    onboardingNo: 'PRE202604003',
    offerId: 3,
    offerNo: 'OF202604003',
    candidateName: '刘强',
    employeeName: '刘强',
    positionName: 'Java开发工程师',
    position: 'Java开发工程师',
    departmentName: '技术部',
    department: '技术部',
    plannedJoinDate: '2026-04-22',
    onboardingDate: '2026-04-22',
    status: 1, // 1-待入职，但有鸽子预警
    mentorId: 101,
    mentorName: '李四',
    mentor: '李四',
    phone: '13800138003',
    email: 'liuqiang@example.com',
    completedMaterials: 0,
    completed: 0,
    totalMaterials: 5,
    accountStatus: 1,
    responsibleId: 3,
    responsibleName: '张HR',
    // Phase 2.4：已触发鸽子预警
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: 'https://pre-onboarding.example.com/fill/PRE202604003?token=d4e5f6',
    fillProgress: 10,
    multiDeptTasks: buildDeptTasksJson(standardDeptTasks),
    noShowAlert: 1, // 已预警
    createTime: '2026-04-03 11:30:00',
    updateTime: '2026-04-15 09:00:00'
  },
  {
    id: 4,
    onboardingNo: 'PRE202604004',
    offerId: 4,
    offerNo: 'OF202604004',
    candidateName: '陈静',
    employeeName: '陈静',
    positionName: '产品经理',
    position: '产品经理',
    departmentName: '产品部',
    department: '产品部',
    plannedJoinDate: '2026-04-08',
    onboardingDate: '2026-04-08',
    actualJoinDate: '2026-04-08',
    employeeNo: '01202604004',
    status: 3, // 3-已完成
    mentorId: 103,
    mentorName: '周杰',
    mentor: '周杰',
    phone: '13800138004',
    email: 'chenjing@example.com',
    completedMaterials: 5,
    completed: 5,
    totalMaterials: 5,
    accountStatus: 2,
    responsibleId: 3,
    responsibleName: '张HR',
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: 'https://pre-onboarding.example.com/fill/PRE202604004?token=g7h8i9',
    fillProgress: 100,
    fillCompleteTime: '2026-04-06 18:30:00',
    multiDeptTasks: buildDeptTasksJson([
      { name: '开通系统账号（OA/邮箱/钉钉）', owner: 'IT', assignee: '王工', status: 'done', completeTime: '2026-04-08 09:00:00', remark: '' },
      { name: '配发办公电脑及外设', owner: 'IT', assignee: '王工', status: 'done', completeTime: '2026-04-08 09:00:00', remark: '' },
      { name: '准备工位 + 门禁卡', owner: '行政', assignee: '刘姐', status: 'done', completeTime: '2026-04-07 15:00:00', remark: '' },
      { name: '安排入职导师对接', owner: 'HRBP', assignee: '张HR', status: 'done', completeTime: '2026-04-07 14:00:00', remark: '' }
    ]),
    noShowAlert: 0,
    createTime: '2026-03-28 14:00:00',
    updateTime: '2026-04-08 10:00:00'
  },
  {
    id: 5,
    onboardingNo: 'PRE202604005',
    offerId: 5,
    offerNo: 'OF202604005',
    candidateName: '杨洋',
    employeeName: '杨洋',
    positionName: '测试工程师',
    position: '测试工程师',
    departmentName: '技术部',
    department: '技术部',
    plannedJoinDate: '2026-04-18',
    onboardingDate: '2026-04-18',
    status: 2, // 2-材料准备中
    mentorId: 101,
    mentorName: '李四',
    mentor: '李四',
    phone: '13800138005',
    email: 'yangyang@example.com',
    completedMaterials: 2,
    completed: 2,
    totalMaterials: 5,
    accountStatus: 1,
    responsibleId: 3,
    responsibleName: '张HR',
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: 'https://pre-onboarding.example.com/fill/PRE202604005?token=j0k1l2',
    fillProgress: 35,
    multiDeptTasks: buildDeptTasksJson(standardDeptTasks),
    noShowAlert: 0,
    createTime: '2026-04-04 09:45:00',
    updateTime: '2026-04-10 15:10:00'
  },
  {
    id: 6,
    onboardingNo: 'PRE202604006',
    offerId: 6,
    offerNo: 'OF202604006',
    candidateName: '赵磊',
    employeeName: '赵磊',
    positionName: '运维工程师',
    position: '运维工程师',
    departmentName: '技术部',
    department: '技术部',
    plannedJoinDate: '2026-03-20',
    onboardingDate: '2026-03-20',
    status: 6, // 6-爽约归档
    mentorId: 101,
    mentorName: '李四',
    mentor: '李四',
    phone: '13800138006',
    email: 'zhaolei@example.com',
    completedMaterials: 0,
    completed: 0,
    totalMaterials: 5,
    accountStatus: 1,
    responsibleId: 3,
    responsibleName: '张HR',
    onboardingTemplateId: 1,
    onboardingTemplateName: '通用岗位入职资料模板',
    fillLink: 'https://pre-onboarding.example.com/fill/PRE202604006?token=m3n4o5',
    fillProgress: 0,
    multiDeptTasks: buildDeptTasksJson(standardDeptTasks),
    noShowAlert: 1,
    noShowReason: '有更好的 Offer',
    createTime: '2026-03-05 10:20:00',
    updateTime: '2026-03-21 09:00:00'
  }
]

export const onboardingConnectionMock = createCrudMock<Onboarding>(initialData, {
  searchFields: ['onboardingNo', 'employeeName', 'position', 'candidateName']
})

/* ========== Phase 2.4 业务操作 Mock ========== */

/**
 * 发送候选人自助填报链接
 */
export function sendFillLinkMock(id: number, templateId: number, templateName: string) {
  const item = onboardingConnectionMock.getDetail(id)
  if (!item) throw new Error('入职衔接记录不存在')
  const token = Math.random().toString(36).slice(2, 10)
  item.fillLink = `https://pre-onboarding.example.com/fill/${item.onboardingNo}?token=${token}`
  item.fillProgress = item.fillProgress || 0
  item.onboardingTemplateId = templateId
  item.onboardingTemplateName = templateName
  item.updateTime = new Date().toLocaleString('zh-CN')
  onboardingConnectionMock.update(item)
  return item
}

/**
 * 模拟候选人填报进度
 */
export function simulateCandidateFillMock(id: number, progress: number) {
  const item = onboardingConnectionMock.getDetail(id)
  if (!item) throw new Error('入职衔接记录不存在')
  const capped = Math.min(100, Math.max(0, progress))
  item.fillProgress = capped
  if (capped >= 100) {
    item.fillCompleteTime = new Date().toLocaleString('zh-CN')
    // 材料准备完成，更新状态
    if (item.status === 1) item.status = 2
  }
  item.updateTime = new Date().toLocaleString('zh-CN')
  onboardingConnectionMock.update(item)
  return item
}

/**
 * 更新多部门任务
 */
export function updateMultiDeptTasksMock(id: number, tasksJson: string) {
  const item = onboardingConnectionMock.getDetail(id)
  if (!item) throw new Error('入职衔接记录不存在')
  item.multiDeptTasks = tasksJson
  item.updateTime = new Date().toLocaleString('zh-CN')
  onboardingConnectionMock.update(item)
  return item
}

/**
 * 触发鸽子预警
 */
export function triggerNoShowAlertMock(id: number) {
  const item = onboardingConnectionMock.getDetail(id)
  if (!item) throw new Error('入职衔接记录不存在')
  item.noShowAlert = 1
  item.updateTime = new Date().toLocaleString('zh-CN')
  onboardingConnectionMock.update(item)
  return item
}

/**
 * 爽约归档
 */
export function archiveNoShowMock(id: number, reasonText: string) {
  const item = onboardingConnectionMock.getDetail(id)
  if (!item) throw new Error('入职衔接记录不存在')
  item.status = 6
  item.noShowReason = reasonText
  item.noShowAlert = 1
  item.updateTime = new Date().toLocaleString('zh-CN')
  onboardingConnectionMock.update(item)
  return item
}
