/**
 * 编制管理 Mock 数据（Phase 3.3 + Phase 4.x 业务重构）
 *
 * 采用标准 rollup 模型（对齐 Workday / SAP / 北森）：
 *   - 叶子组织（最底层部门/组）的 budgetCount 从 org.headcount 读取
 *   - 非叶子组织（集团/事业部/有子节点的部门）的 budgetCount = ∑ 叶子后代的 budgetCount
 *   - actualCount / pipelineCount 从员工档案 + 招聘需求动态聚合（由 view 层完成）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { HeadcountPlan, HeadcountAdjust } from '@/types/org/headcount'
import { ORGANIZATIONS } from '@/mock/core/organizationTree'

/** 判断是否叶子组织（无子节点） */
export function isLeafOrg(orgId: number): boolean {
  return !ORGANIZATIONS.some((o) => o.parentId === orgId)
}

/** 递归获取 orgId 及所有后代（含自身） */
export function getDescendantOrgIds(orgId: number): number[] {
  const result = [orgId]
  ORGANIZATIONS.filter((o) => o.parentId === orgId).forEach((child) => {
    result.push(...getDescendantOrgIds(child.id))
  })
  return result
}

/** 动态计算编制预算：叶子用 org.headcount；非叶子 = ∑ 叶子后代 */
export function calcBudgetByOrg(orgId: number): number {
  const org = ORGANIZATIONS.find((o) => o.id === orgId)
  if (!org) return 0
  if (isLeafOrg(orgId)) {
    return org.headcount || 0
  }
  const children = ORGANIZATIONS.filter((o) => o.parentId === orgId)
  return children.reduce((sum, child) => sum + calcBudgetByOrg(child.id), 0)
}

/** 为每个组织节点预置一个 2026 年度编制计划 */
const initialPlans: HeadcountPlan[] = ORGANIZATIONS.map((org, idx) => ({
  id: idx + 1,
  orgId: org.id,
  orgName: org.orgName,
  orgPath: org.path,
  year: 2026,
  budgetCount: calcBudgetByOrg(org.id), // rollup 计算
  actualCount: 0, // view 层动态计算
  pipelineCount: 0, // view 层动态计算
  gap: 0, // view 层动态计算
  status: 'normal',
  lastAdjustTime: '2025-12-20 10:00:00',
  remark: isLeafOrg(org.id)
    ? '2026 年度叶子组织编制（可调整）'
    : '2026 年度汇总编制（∑ 叶子后代，自动计算）',
  createTime: '2025-12-20 10:00:00',
  updateTime: '2025-12-20 10:00:00'
}))

export const headcountPlanMock = createCrudMock<HeadcountPlan>(initialPlans, {
  idField: 'id',
  searchFields: ['orgName']
})

/** 编制调整记录（3 条示例）*/
const initialAdjusts: HeadcountAdjust[] = [
  {
    id: 1,
    adjustNo: 'HCA20260410001',
    orgId: 6,
    orgName: '技术研发中心',
    year: 2026,
    beforeBudget: 100,
    afterBudget: 120,
    delta: 20,
    reason: '承接新业务线，需要扩充研发团队',
    submitterName: '王总监',
    submitterId: 1003,
    status: 'approved',
    approverName: 'HR-Lisa',
    approverId: 9001,
    approvalTime: '2026-04-12 14:00:00',
    approvalComment: '同意，已更新预算',
    effectiveDate: '2026-04-15',
    createTime: '2026-04-10 09:00:00',
    updateTime: '2026-04-12 14:00:00'
  },
  {
    id: 2,
    adjustNo: 'HCA20260318001',
    orgId: 8,
    orgName: '运营市场中心',
    year: 2026,
    beforeBudget: 60,
    afterBudget: 50,
    delta: -10,
    reason: '业务调整，精简团队',
    submitterName: '李总监',
    submitterId: 1007,
    status: 'approved',
    approverName: 'HR-Lisa',
    approverId: 9001,
    approvalTime: '2026-03-20 10:00:00',
    approvalComment: '同意',
    effectiveDate: '2026-04-01',
    createTime: '2026-03-18 09:00:00',
    updateTime: '2026-03-20 10:00:00'
  },
  {
    id: 3,
    adjustNo: 'HCA20260420001',
    orgId: 7,
    orgName: '产品设计中心',
    year: 2026,
    beforeBudget: 60,
    afterBudget: 75,
    delta: 15,
    reason: '产品线扩展，新增 UX 和产品经理岗位',
    submitterName: '陈总监',
    submitterId: 1005,
    status: 'pending',
    createTime: '2026-04-20 09:00:00',
    updateTime: '2026-04-20 09:00:00'
  }
]

export const headcountAdjustMock = createCrudMock<HeadcountAdjust>(initialAdjusts, {
  idField: 'id',
  searchFields: ['adjustNo', 'orgName', 'reason']
})

/**
 * 审批编制调整
 */
export function approveAdjustMock(
  id: number,
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
): HeadcountAdjust {
  const adj = headcountAdjustMock.getDetail(id)
  if (!adj) throw new Error('调整申请不存在')
  adj.status = action
  adj.approverName = approverName
  adj.approverId = approverId
  adj.approvalTime = new Date().toLocaleString('zh-CN')
  adj.approvalComment = comment
  if (action === 'approved') {
    adj.effectiveDate = new Date().toISOString().slice(0, 10)
    // 同步更新编制计划
    const plan = headcountPlanMock
      .getData()
      .find((p) => p.orgId === adj.orgId && p.year === adj.year)
    if (plan) {
      plan.budgetCount = adj.afterBudget
      plan.lastAdjustTime = adj.approvalTime
      plan.updateTime = adj.approvalTime
      headcountPlanMock.update(plan)
    }
  }
  headcountAdjustMock.update(adj)
  return adj
}
