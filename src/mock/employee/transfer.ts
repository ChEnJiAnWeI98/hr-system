/**
 * 人员异动 Mock 数据（Phase 3.1）
 * 预置 30 条异动记录，覆盖 9 种类型
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { EmployeeTransfer } from '@/types/employee/transfer'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 取员工池里的员工作为样本 */
const emp = (i: number) => EMPLOYEES[i % EMPLOYEES.length]

/** 生成异动单号 */
const genNo = (date: string, seq: number) =>
  `TR${date.replace(/-/g, '')}${String(seq).padStart(3, '0')}`

const initialData: EmployeeTransfer[] = [
  // ====== 已生效的历史异动（按时间倒序）======
  // ⚠️ 入职记录不在此列 - 由招聘入职办理自动创建员工档案
  // ⚠️ 离职记录在离职管理模块 - 不在此列
  // 1 转正
  {
    id: 2,
    transferNo: genNo('2026-04-01', 1),
    employeeId: emp(1).id,
    employeeName: emp(1).nameZh,
    transferType: 'regularization',
    fromSalary: 12000,
    toSalary: 15000,
    status: 'effective',
    effectiveDate: '2026-04-01',
    submitTime: '2026-03-25 11:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', comment: '试用期表现优秀，同意转正', approvalTime: '2026-03-26 10:00:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', comment: '同意', approvalTime: '2026-03-27 14:00:00' }
    ],
    reason: '试用期满3个月，考核合格',
    createTime: '2026-03-25 11:00:00',
    updateTime: '2026-04-01 00:00:00'
  },
  // 3 调动（跨部门）
  {
    id: 3,
    transferNo: genNo('2026-03-20', 1),
    employeeId: emp(10).id,
    employeeName: emp(10).nameZh,
    transferType: 'transfer',
    fromOrgId: 10,
    fromOrgName: '后端组',
    fromPositionId: emp(10).positionId,
    fromPositionName: emp(10).positionName,
    toOrgId: 11,
    toOrgName: '前端组',
    toPositionId: emp(10).positionId,
    toPositionName: emp(10).positionName,
    status: 'effective',
    effectiveDate: '2026-03-20',
    submitTime: '2026-03-15 09:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', comment: '业务需要', approvalTime: '2026-03-16 10:00:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', approvalTime: '2026-03-17 11:00:00' }
    ],
    reason: '公司业务调整，协助前端组开发新项目',
    createTime: '2026-03-15 09:00:00',
    updateTime: '2026-03-20 00:00:00'
  },
  // 4 晋升
  {
    id: 4,
    transferNo: genNo('2026-03-01', 1),
    employeeId: emp(5).id,
    employeeName: emp(5).nameZh,
    transferType: 'promotion',
    fromPositionId: 3,
    fromPositionName: '高级后端工程师',
    fromLevel: 'P5',
    fromSalary: 18000,
    toPositionId: 4,
    toPositionName: '后端技术专家',
    toLevel: 'P7',
    toSalary: 28000,
    status: 'effective',
    effectiveDate: '2026-03-01',
    submitTime: '2026-02-20 14:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', comment: '技术能力突出，带领团队完成多个核心项目', approvalTime: '2026-02-21 10:00:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', comment: '同意晋升', approvalTime: '2026-02-22 14:00:00' }
    ],
    reason: '年度晋升评审通过',
    createTime: '2026-02-20 14:00:00',
    updateTime: '2026-03-01 00:00:00'
  },
  // 5 调薪
  {
    id: 5,
    transferNo: genNo('2026-04-01', 2),
    employeeId: emp(20).id,
    employeeName: emp(20).nameZh,
    transferType: 'salary_adjust',
    fromSalary: 15000,
    toSalary: 17000,
    status: 'effective',
    effectiveDate: '2026-04-01',
    submitTime: '2026-03-20 15:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', approvalTime: '2026-03-21 10:00:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', approvalTime: '2026-03-22 11:00:00' }
    ],
    reason: '年度调薪（绩效 A）',
    createTime: '2026-03-20 15:00:00',
    updateTime: '2026-04-01 00:00:00'
  },
  // 6 借调
  {
    id: 6,
    transferNo: genNo('2026-04-10', 1),
    employeeId: emp(30).id,
    employeeName: emp(30).nameZh,
    transferType: 'secondment',
    fromOrgId: emp(30).orgId,
    fromOrgName: emp(30).orgName,
    toOrgId: 12,
    toOrgName: 'AI 孵化项目组',
    status: 'effective',
    effectiveDate: '2026-04-10',
    submitTime: '2026-04-05 09:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', comment: '借调3个月', approvalTime: '2026-04-06 10:00:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', approvalTime: '2026-04-07 11:00:00' }
    ],
    reason: 'AI 项目临时支援',
    remark: '借调期 2026-04-10 ~ 2026-07-10',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-10 00:00:00'
  },
  // ⚠️ 返聘记录在招聘入职办理模块
  // 7-14 补充历史异动（简化）
  ...Array.from({ length: 8 }, (_, i): EmployeeTransfer => {
    const idx = 50 + i
    const types: ('regularization' | 'transfer' | 'promotion' | 'salary_adjust' | 'secondment' | 'renewal')[] = [
      'regularization',
      'transfer',
      'promotion',
      'salary_adjust',
      'renewal',
      'secondment',
      'regularization',
      'transfer'
    ]
    const type = types[i]
    const e = emp(idx)
    return {
      id: 8 + i,
      transferNo: genNo('2026-01-15', i + 1),
      employeeId: e.id,
      employeeName: e.nameZh,
      transferType: type,
      toOrgId: e.orgId,
      toOrgName: e.orgName,
      toPositionId: e.positionId,
      toPositionName: e.positionName,
      toLevel: e.level,
      toSalary: e.baseSalary,
      status: 'effective',
      effectiveDate: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
      submitTime: `2026-01-${String((i % 28) + 1).padStart(2, '0')} 09:00:00`,
      submitterId: 9001,
      submitterName: 'HR-Lisa',
      approvals: [
        { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', approvalTime: '2026-01-10 10:00' },
        { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', approvalTime: '2026-01-12 14:00' }
      ],
      reason: '常规异动',
      createTime: `2026-01-${String((i % 28) + 1).padStart(2, '0')} 09:00:00`,
      updateTime: `2026-01-${String((i % 28) + 1).padStart(2, '0')} 09:00:00`
    }
  }),
  // 16 进行中 - 一级审批中
  {
    id: 16,
    transferNo: genNo('2026-04-20', 1),
    employeeId: emp(70).id,
    employeeName: emp(70).nameZh,
    transferType: 'promotion',
    fromPositionId: emp(70).positionId,
    fromPositionName: emp(70).positionName,
    fromLevel: emp(70).level,
    fromSalary: emp(70).baseSalary,
    toPositionId: emp(70).positionId,
    toPositionName: '高级工程师',
    toLevel: 'P6',
    toSalary: (emp(70).baseSalary || 15000) + 3000,
    status: 'level1_reviewing',
    effectiveDate: '2026-05-01',
    submitTime: '2026-04-20 14:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'pending' }
    ],
    reason: '绩效卓越，申请晋升',
    createTime: '2026-04-20 14:00:00',
    updateTime: '2026-04-20 14:00:00'
  },
  // 17 进行中 - 二级审批中
  {
    id: 17,
    transferNo: genNo('2026-04-18', 1),
    employeeId: emp(80).id,
    employeeName: emp(80).nameZh,
    transferType: 'salary_adjust',
    fromSalary: 16000,
    toSalary: 18000,
    status: 'level2_reviewing',
    effectiveDate: '2026-05-01',
    submitTime: '2026-04-18 10:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', comment: '同意调薪', approvalTime: '2026-04-19 09:30' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'pending' }
    ],
    reason: '年中调薪',
    createTime: '2026-04-18 10:00:00',
    updateTime: '2026-04-19 09:30:00'
  },
  // 18 待生效
  {
    id: 18,
    transferNo: genNo('2026-04-15', 1),
    employeeId: emp(90).id,
    employeeName: emp(90).nameZh,
    transferType: 'transfer',
    fromOrgId: 10,
    fromOrgName: '后端组',
    toOrgId: 8,
    toOrgName: '运营市场中心',
    fromPositionId: emp(90).positionId,
    fromPositionName: emp(90).positionName,
    toPositionId: 37,
    toPositionName: '内容运营',
    status: 'pending_effect',
    effectiveDate: '2026-05-01',
    submitTime: '2026-04-15 09:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'approved', approvalTime: '2026-04-16 10:00' },
      { stage: 'level2', approverName: 'HR-Lisa', approverId: 9001, result: 'approved', approvalTime: '2026-04-17 14:00' }
    ],
    reason: '员工主动申请转岗',
    createTime: '2026-04-15 09:00:00',
    updateTime: '2026-04-17 14:00:00'
  },
  // 19 一级驳回
  {
    id: 19,
    transferNo: genNo('2026-04-10', 2),
    employeeId: emp(100).id,
    employeeName: emp(100).nameZh,
    transferType: 'promotion',
    fromLevel: 'P4',
    fromSalary: 14000,
    toLevel: 'P5',
    toSalary: 17000,
    status: 'level1_rejected',
    effectiveDate: '2026-05-01',
    submitTime: '2026-04-10 10:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [
      { stage: 'level1', approverName: '王总监', approverId: 1003, result: 'rejected', comment: '试用期满不足半年，建议 6 个月后再申请', approvalTime: '2026-04-11 14:00' }
    ],
    reason: '申请晋升',
    createTime: '2026-04-10 10:00:00',
    updateTime: '2026-04-11 14:00:00'
  },
  // 20 草稿
  {
    id: 20,
    transferNo: genNo('2026-04-22', 1),
    employeeId: emp(110).id,
    employeeName: emp(110).nameZh,
    transferType: 'transfer',
    fromOrgId: emp(110).orgId,
    fromOrgName: emp(110).orgName,
    toOrgId: 7,
    toOrgName: '产品设计中心',
    status: 'draft',
    effectiveDate: '2026-05-15',
    submitTime: '2026-04-22 09:00:00',
    submitterId: 1003,
    submitterName: '王总监',
    approvals: [],
    reason: '根据业务需要调整',
    createTime: '2026-04-22 09:00:00',
    updateTime: '2026-04-22 09:00:00'
  }
]

/**
 * 数据一致性约束（Phase 4.13 修复）：
 * 异动记录只对齐到在职员工（regular / probation / transferring）。
 * 排除 offboarding（离职中）和 terminated（已离职）员工，避免出现"已离职员工又被调动"。
 */
export const transferMock = createCrudMock<EmployeeTransfer>(
  alignEmployeeFields(initialData, {
    filter: (e) =>
      e.status === 'regular' || e.status === 'probation' || e.status === 'transferring'
  }),
  {
    idField: 'id',
    searchFields: ['transferNo', 'employeeName', 'reason'],
    sortField: 'submitTime'
  }
)

/**
 * 推进异动审批
 */
export function approveTransferMock(
  id: number,
  stage: 'level1' | 'level2',
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
): EmployeeTransfer {
  const transfer = transferMock.getDetail(id)
  if (!transfer) throw new Error('异动不存在')

  // 更新审批记录
  const existing = transfer.approvals.find((a) => a.stage === stage)
  if (existing) {
    existing.result = action
    existing.approverName = approverName
    existing.approverId = approverId
    existing.comment = comment
    existing.approvalTime = new Date().toLocaleString('zh-CN')
  } else {
    transfer.approvals.push({
      stage,
      approverName,
      approverId,
      result: action,
      comment,
      approvalTime: new Date().toLocaleString('zh-CN')
    })
  }

  // 状态流转
  if (action === 'rejected') {
    transfer.status = stage === 'level1' ? 'level1_rejected' : 'level2_rejected'
  } else {
    if (stage === 'level1') {
      transfer.status = 'level2_reviewing'
      // 自动添加二级审批待处理
      if (!transfer.approvals.find((a) => a.stage === 'level2')) {
        transfer.approvals.push({
          stage: 'level2',
          approverName: 'HR-Lisa',
          approverId: 9001,
          result: 'pending'
        })
      }
    } else {
      transfer.status = 'pending_effect'
    }
  }

  transferMock.update(transfer)
  return transfer
}

/** 生效异动 */
export function effectTransferMock(id: number): EmployeeTransfer {
  const transfer = transferMock.getDetail(id)
  if (!transfer) throw new Error('异动不存在')
  if (transfer.status !== 'pending_effect') throw new Error('当前状态不允许生效')
  transfer.status = 'effective'
  transferMock.update(transfer)
  return transfer
}

/** 撤销异动 */
export function cancelTransferMock(id: number): EmployeeTransfer {
  const transfer = transferMock.getDetail(id)
  if (!transfer) throw new Error('异动不存在')
  transfer.status = 'cancelled'
  transferMock.update(transfer)
  return transfer
}

/** 按员工 ID 查询异动历史（档案联动用） */
export function getTransfersByEmployee(employeeId: number): EmployeeTransfer[] {
  return transferMock
    .getData()
    .filter((t) => t.employeeId === employeeId)
    .sort((a, b) => b.submitTime.localeCompare(a.submitTime))
}
