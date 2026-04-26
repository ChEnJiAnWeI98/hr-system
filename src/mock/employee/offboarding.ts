/**
 * 离职管理 Mock 数据（Phase 3.2）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type {
  EmployeeOffboarding,
  HandoverItem,
  OffboardingStatus
} from '@/types/employee/offboarding'
import { DEFAULT_HANDOVER_TEMPLATE } from '@/types/employee/offboarding'
import { EMPLOYEES } from '@/mock/core/employeePool'

const emp = (i: number) => EMPLOYEES[i % EMPLOYEES.length]

/** 生成离职单号 */
const genNo = (date: string, seq: number) =>
  `OFF${date.replace(/-/g, '')}${String(seq).padStart(3, '0')}`

/** 从模板生成交接清单（item id 自动分配） */
let handoverItemIdSeed = 1
function buildHandover(completedRate: number = 0): HandoverItem[] {
  return DEFAULT_HANDOVER_TEMPLATE.map((item, idx) => {
    // 按完成率决定每项状态（确定性：前 N 项完成）
    const total = DEFAULT_HANDOVER_TEMPLATE.length
    const completedCount = Math.floor(total * completedRate)
    let status: 'pending' | 'in_progress' | 'completed' = 'pending'
    if (idx < completedCount) status = 'completed'
    else if (idx < completedCount + 1) status = 'in_progress'
    return {
      id: handoverItemIdSeed++,
      ...item,
      status,
      completedTime: status === 'completed' ? '2026-04-15 10:00:00' : undefined
    }
  })
}

const initialData: EmployeeOffboarding[] = [
  // ========== 已完成的历史离职（15 条）==========
  {
    id: 1,
    offboardingNo: genNo('2026-01-20', 1),
    employeeId: emp(145).id,
    employeeName: emp(145).nameZh,
    orgName: emp(145).orgName,
    positionName: emp(145).positionName,
    offboardingType: 'voluntary',
    reason: '个人发展原因，计划进入更大的技术平台',
    expectedLastDay: '2026-02-15',
    actualLastDay: '2026-02-15',
    status: 'completed',
    deptApproverName: '王总监',
    deptApproverId: 1003,
    deptApprovalTime: '2026-01-22 10:00:00',
    deptApprovalResult: 'approved',
    deptApprovalComment: '同意离职，感谢为团队做的贡献',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2026-01-23 14:00:00',
    hrApprovalResult: 'approved',
    hrApprovalComment: '手续齐全，安排面谈',
    handoverItems: buildHandover(1.0),
    exitInterview: {
      interviewerName: 'HR-Lisa',
      interviewerId: 9001,
      interviewTime: '2026-02-12 15:00:00',
      mainReason: '希望去互联网大厂深耕分布式架构',
      satisfaction: 4,
      suggestions: '希望增加技术分享会频次',
      wouldRecommend: true,
      openToRehire: true,
      remark: '员工对团队无不满'
    },
    certificateIssued: true,
    certificateIssueTime: '2026-02-15 17:00:00',
    submitTime: '2026-01-20 09:00:00',
    createTime: '2026-01-20 09:00:00',
    updateTime: '2026-02-15 17:00:00'
  },
  {
    id: 2,
    offboardingNo: genNo('2025-12-10', 1),
    employeeId: emp(148).id,
    employeeName: emp(148).nameZh,
    orgName: emp(148).orgName,
    positionName: emp(148).positionName,
    offboardingType: 'contract_end',
    reason: '合同到期，双方协商不再续签',
    expectedLastDay: '2025-12-31',
    actualLastDay: '2025-12-31',
    status: 'completed',
    deptApproverName: '陈总监',
    deptApproverId: 1005,
    deptApprovalTime: '2025-12-11 10:00:00',
    deptApprovalResult: 'approved',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2025-12-12 14:00:00',
    hrApprovalResult: 'approved',
    handoverItems: buildHandover(1.0),
    exitInterview: {
      interviewerName: 'HR-Lisa',
      interviewerId: 9001,
      interviewTime: '2025-12-28 10:00:00',
      mainReason: '合同到期，个人生活规划原因',
      satisfaction: 5,
      suggestions: '—',
      wouldRecommend: true,
      openToRehire: true
    },
    certificateIssued: true,
    certificateIssueTime: '2025-12-31 17:00:00',
    submitTime: '2025-12-10 09:00:00',
    createTime: '2025-12-10 09:00:00',
    updateTime: '2025-12-31 17:00:00'
  },
  {
    id: 3,
    offboardingNo: genNo('2025-11-15', 1),
    employeeId: emp(150).id,
    employeeName: emp(150).nameZh,
    orgName: emp(150).orgName,
    positionName: emp(150).positionName,
    offboardingType: 'negotiated',
    reason: '业务方向调整协商离职',
    expectedLastDay: '2025-11-30',
    actualLastDay: '2025-11-30',
    status: 'completed',
    deptApproverName: '王总监',
    deptApproverId: 1003,
    deptApprovalTime: '2025-11-16 10:00:00',
    deptApprovalResult: 'approved',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2025-11-17 14:00:00',
    hrApprovalResult: 'approved',
    hrApprovalComment: '协商离职补偿已安排',
    handoverItems: buildHandover(1.0),
    certificateIssued: true,
    certificateIssueTime: '2025-11-30 17:00:00',
    submitTime: '2025-11-15 09:00:00',
    createTime: '2025-11-15 09:00:00',
    updateTime: '2025-11-30 17:00:00'
  },
  {
    id: 4,
    offboardingNo: genNo('2025-10-08', 1),
    employeeId: emp(152).id,
    employeeName: emp(152).nameZh,
    orgName: emp(152).orgName,
    positionName: emp(152).positionName,
    offboardingType: 'voluntary',
    reason: '回老家发展',
    expectedLastDay: '2025-10-31',
    actualLastDay: '2025-10-31',
    status: 'completed',
    deptApproverName: '李总监',
    deptApproverId: 1007,
    deptApprovalTime: '2025-10-10 10:00:00',
    deptApprovalResult: 'approved',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2025-10-11 14:00:00',
    hrApprovalResult: 'approved',
    handoverItems: buildHandover(1.0),
    certificateIssued: true,
    submitTime: '2025-10-08 09:00:00',
    createTime: '2025-10-08 09:00:00',
    updateTime: '2025-10-31 17:00:00'
  },
  {
    id: 5,
    offboardingNo: genNo('2025-09-20', 1),
    employeeId: emp(155).id,
    employeeName: emp(155).nameZh,
    orgName: emp(155).orgName,
    positionName: emp(155).positionName,
    offboardingType: 'terminated_cause',
    reason: '严重违反公司规定',
    expectedLastDay: '2025-09-25',
    actualLastDay: '2025-09-25',
    status: 'completed',
    deptApproverName: '王总监',
    deptApproverId: 1003,
    deptApprovalTime: '2025-09-20 10:00:00',
    deptApprovalResult: 'approved',
    deptApprovalComment: '已沟通并搜集证据',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2025-09-20 16:00:00',
    hrApprovalResult: 'approved',
    hrApprovalComment: '确认证据充分，批准辞退',
    handoverItems: buildHandover(0.5),
    certificateIssued: true,
    submitTime: '2025-09-20 09:00:00',
    createTime: '2025-09-20 09:00:00',
    updateTime: '2025-09-25 17:00:00'
  },
  // === 补充更多已完成记录（简化）===
  ...Array.from({ length: 10 }, (_, i): EmployeeOffboarding => {
    const e = emp(160 + i)
    const types: ('voluntary' | 'contract_end' | 'negotiated' | 'retirement')[] = [
      'voluntary',
      'contract_end',
      'voluntary',
      'negotiated',
      'voluntary',
      'retirement',
      'voluntary',
      'contract_end',
      'negotiated',
      'voluntary'
    ]
    const month = 5 + (i % 4) // 2025-05 ~ 2025-08
    const last = `2025-${String(month).padStart(2, '0')}-28`
    return {
      id: 6 + i,
      offboardingNo: genNo(last, i + 1),
      employeeId: e.id,
      employeeName: e.nameZh,
      orgName: e.orgName,
      positionName: e.positionName,
      offboardingType: types[i],
      reason: '常规离职',
      expectedLastDay: last,
      actualLastDay: last,
      status: 'completed',
      deptApproverName: '部门负责人',
      deptApproverId: 1003,
      deptApprovalTime: `2025-${String(month).padStart(2, '0')}-10 10:00:00`,
      deptApprovalResult: 'approved',
      hrApproverName: 'HR-Lisa',
      hrApproverId: 9001,
      hrApprovalTime: `2025-${String(month).padStart(2, '0')}-12 14:00:00`,
      hrApprovalResult: 'approved',
      handoverItems: buildHandover(1.0),
      certificateIssued: true,
      submitTime: `2025-${String(month).padStart(2, '0')}-01 09:00:00`,
      createTime: `2025-${String(month).padStart(2, '0')}-01 09:00:00`,
      updateTime: `2025-${String(month).padStart(2, '0')}-28 17:00:00`
    }
  }),

  // ========== 进行中（4 条）==========
  // 16 交接中
  {
    id: 16,
    offboardingNo: genNo('2026-04-01', 1),
    employeeId: emp(170).id,
    employeeName: emp(170).nameZh,
    orgName: emp(170).orgName,
    positionName: emp(170).positionName,
    offboardingType: 'voluntary',
    reason: '职业转型，计划创业',
    expectedLastDay: '2026-04-30',
    status: 'handover',
    deptApproverName: '王总监',
    deptApproverId: 1003,
    deptApprovalTime: '2026-04-03 10:00:00',
    deptApprovalResult: 'approved',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2026-04-05 14:00:00',
    hrApprovalResult: 'approved',
    handoverItems: buildHandover(0.6),
    certificateIssued: false,
    submitTime: '2026-04-01 09:00:00',
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-20 17:00:00'
  },
  // 17 交接中
  {
    id: 17,
    offboardingNo: genNo('2026-04-10', 1),
    employeeId: emp(175).id,
    employeeName: emp(175).nameZh,
    orgName: emp(175).orgName,
    positionName: emp(175).positionName,
    offboardingType: 'contract_end',
    reason: '合同到期不续签',
    expectedLastDay: '2026-05-10',
    status: 'handover',
    deptApproverName: '陈总监',
    deptApproverId: 1005,
    deptApprovalTime: '2026-04-12 10:00:00',
    deptApprovalResult: 'approved',
    hrApproverName: 'HR-Lisa',
    hrApproverId: 9001,
    hrApprovalTime: '2026-04-14 14:00:00',
    hrApprovalResult: 'approved',
    handoverItems: buildHandover(0.3),
    certificateIssued: false,
    submitTime: '2026-04-10 09:00:00',
    createTime: '2026-04-10 09:00:00',
    updateTime: '2026-04-18 15:00:00'
  },
  // 18 HR 审批中
  {
    id: 18,
    offboardingNo: genNo('2026-04-20', 1),
    employeeId: emp(180).id,
    employeeName: emp(180).nameZh,
    orgName: emp(180).orgName,
    positionName: emp(180).positionName,
    offboardingType: 'voluntary',
    reason: '家庭原因，需要陪伴家人',
    expectedLastDay: '2026-05-20',
    status: 'hr_reviewing',
    deptApproverName: '李总监',
    deptApproverId: 1007,
    deptApprovalTime: '2026-04-21 10:00:00',
    deptApprovalResult: 'approved',
    deptApprovalComment: '理解员工情况，同意离职',
    handoverItems: [],
    certificateIssued: false,
    submitTime: '2026-04-20 09:00:00',
    createTime: '2026-04-20 09:00:00',
    updateTime: '2026-04-21 10:00:00'
  },
  // 19 部门审批中
  {
    id: 19,
    offboardingNo: genNo('2026-04-22', 1),
    employeeId: emp(185).id,
    employeeName: emp(185).nameZh,
    orgName: emp(185).orgName,
    positionName: emp(185).positionName,
    offboardingType: 'voluntary',
    reason: '个人发展规划',
    expectedLastDay: '2026-05-22',
    status: 'dept_reviewing',
    handoverItems: [],
    certificateIssued: false,
    submitTime: '2026-04-22 09:00:00',
    createTime: '2026-04-22 09:00:00',
    updateTime: '2026-04-22 09:00:00'
  }
]

/**
 * 数据一致性约束（Phase 4.13 修复）：
 * 业务规则：mock 数据 status='completed'（已离职完成）→ 员工池 status='terminated'
 *           mock 数据 status 进行中 → 员工池 status='offboarding'
 * 员工池 STATUS_DIST：184 regular + 3 probation + 2 transferring + 4 offboarding + 7 terminated
 * 分段对齐避免 transfer/offboarding 抢同一个员工。
 */
const completedRecords = initialData.filter((r) => r.status === 'completed')
const inProgressRecords = initialData.filter((r) => r.status !== 'completed')

const alignedData = [
  ...alignEmployeeFields(completedRecords, {
    filter: (e) => e.status === 'terminated'
  }),
  ...alignEmployeeFields(inProgressRecords, {
    filter: (e) => e.status === 'offboarding'
  })
]

export const offboardingMock = createCrudMock<EmployeeOffboarding>(alignedData, {
  idField: 'id',
  searchFields: ['offboardingNo', 'employeeName', 'reason'],
  sortField: 'submitTime'
})

/** 推进离职流程 */
export function approveOffboardingMock(
  id: number,
  stage: 'dept' | 'hr',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')

  const now = new Date().toLocaleString('zh-CN')
  if (stage === 'dept') {
    off.deptApproverName = approverName
    off.deptApproverId = approverId
    off.deptApprovalTime = now
    off.deptApprovalResult = action
    off.deptApprovalComment = comment
    off.status = action === 'approved' ? 'hr_reviewing' : 'dept_rejected'
  } else {
    off.hrApproverName = approverName
    off.hrApproverId = approverId
    off.hrApprovalTime = now
    off.hrApprovalResult = action
    off.hrApprovalComment = comment
    if (action === 'approved') {
      // HR 通过后进入交接，自动生成默认交接清单
      off.status = 'handover'
      if (off.handoverItems.length === 0) {
        off.handoverItems = buildHandover(0)
      }
    } else {
      off.status = 'hr_rejected'
    }
  }
  offboardingMock.update(off)
  return off
}

/** 更新交接项状态 */
export function updateHandoverItemMock(
  id: number,
  itemId: number,
  status: 'pending' | 'in_progress' | 'completed',
  receiverId?: number,
  receiverName?: string
): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  const item = off.handoverItems.find((i) => i.id === itemId)
  if (!item) throw new Error('交接项不存在')
  item.status = status
  if (receiverId !== undefined) {
    item.receiverId = receiverId
    item.receiverName = receiverName
  }
  if (status === 'completed') item.completedTime = new Date().toLocaleString('zh-CN')
  offboardingMock.update(off)
  return off
}

/** 完成交接 → 进入待离职日 */
export function completeHandoverMock(id: number): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  off.status = 'pending_last_day'
  offboardingMock.update(off)
  return off
}

/** 完成离职（到了离职日） */
export function completeOffboardingMock(id: number): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  off.status = 'completed'
  off.actualLastDay = new Date().toISOString().slice(0, 10)
  offboardingMock.update(off)
  return off
}

/** 撤销离职 */
export function cancelOffboardingMock(id: number): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  off.status = 'cancelled'
  offboardingMock.update(off)
  return off
}

/** 保存面谈记录 */
export function saveExitInterviewMock(
  id: number,
  interview: EmployeeOffboarding['exitInterview']
): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  off.exitInterview = interview
  offboardingMock.update(off)
  return off
}

/** 出具离职证明 */
export function issueCertificateMock(id: number): EmployeeOffboarding {
  const off = offboardingMock.getDetail(id)
  if (!off) throw new Error('离职申请不存在')
  off.certificateIssued = true
  off.certificateIssueTime = new Date().toLocaleString('zh-CN')
  offboardingMock.update(off)
  return off
}

/** 按员工 ID 查询离职历史 */
export function getOffboardingsByEmployee(employeeId: number): EmployeeOffboarding[] {
  return offboardingMock
    .getData()
    .filter((o) => o.employeeId === employeeId)
    .sort((a, b) => b.submitTime.localeCompare(a.submitTime))
}
