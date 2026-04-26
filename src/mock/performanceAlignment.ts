// @ts-nocheck
/**
 * 目标对齐视图 Mock（Phase A4）
 * 复用 performanceGoal 的 mock 数据作为节点源
 */
import { performanceGoalMock } from '@/mock/performanceGoal'
import type {
  AlignmentStats,
  OKRTreeNode,
  AlignmentQueryParams
} from '@/types/performanceAlignment'

/**
 * 构建 OKR 对齐树
 */
export function buildOKRTreeMock(params: AlignmentQueryParams = {}): OKRTreeNode[] {
  let goals = performanceGoalMock.getData().filter((g) => g.goalType === 1 && g.approvalStatus === 1)

  if (params.cycleId) {
    goals = goals.filter((g) => g.cycleId === params.cycleId)
  }
  if (params.departmentName) {
    goals = goals.filter((g) => g.departmentName?.includes(params.departmentName!))
  }
  if (params.progressMin !== undefined) {
    goals = goals.filter((g) => g.progress >= params.progressMin!)
  }
  if (params.progressMax !== undefined) {
    goals = goals.filter((g) => g.progress <= params.progressMax!)
  }

  const goalMap = new Map<number, OKRTreeNode>()
  const childrenOf = new Map<number, number[]>()

  for (const g of goals) {
    const node: OKRTreeNode = {
      id: g.id,
      goalNo: g.goalNo,
      goalTitle: g.goalTitle,
      owner: g.employeeName,
      department: g.departmentName,
      category: g.goalCategory || 'personal',
      progress: g.progress,
      approvalStatus: g.approvalStatus,
      children: [],
      isOrphan: false
    }
    goalMap.set(g.id, node)
    if (g.parentGoalId) {
      if (!childrenOf.has(g.parentGoalId)) childrenOf.set(g.parentGoalId, [])
      childrenOf.get(g.parentGoalId)!.push(g.id)
    }
  }

  // 构建树
  for (const [parentId, childIds] of childrenOf.entries()) {
    const parent = goalMap.get(parentId)
    if (!parent) continue
    parent.children = childIds
      .map((cid) => goalMap.get(cid))
      .filter(Boolean) as OKRTreeNode[]
  }

  // 识别孤岛：非公司级 + 无父目标
  for (const g of goals) {
    if (g.goalCategory !== 'company' && !g.parentGoalId) {
      const node = goalMap.get(g.id)
      if (node) node.isOrphan = true
    }
  }

  // 返回公司级作为根节点
  const roots = goals
    .filter((g) => g.goalCategory === 'company')
    .map((g) => goalMap.get(g.id)!)
    .filter(Boolean)

  // 同时把孤岛节点也返回（作为独立根）
  const orphans = goals
    .filter((g) => g.goalCategory !== 'company' && !g.parentGoalId)
    .map((g) => goalMap.get(g.id)!)
    .filter(Boolean)

  return [...roots, ...orphans]
}

/**
 * 对齐统计
 */
export function getAlignmentStatsMock(params: AlignmentQueryParams = {}): AlignmentStats {
  let goals = performanceGoalMock.getData().filter((g) => g.goalType === 1 && g.approvalStatus === 1)
  if (params.cycleId) goals = goals.filter((g) => g.cycleId === params.cycleId)

  const totalGoals = goals.length
  const companyGoals = goals.filter((g) => g.goalCategory === 'company').length
  const departmentGoals = goals.filter((g) => g.goalCategory === 'department').length
  const personalGoals = goals.filter((g) => g.goalCategory === 'personal').length
  const alignedCount = goals.filter((g) => g.parentGoalId || g.goalCategory === 'company').length
  const orphanCount = goals.filter((g) => g.goalCategory !== 'company' && !g.parentGoalId).length
  const alignmentRate = totalGoals > 0 ? Number(((alignedCount / totalGoals) * 100).toFixed(1)) : 0

  // 按部门统计
  const deptMap = new Map<string, { total: number; aligned: number }>()
  for (const g of goals) {
    if (!deptMap.has(g.departmentName)) deptMap.set(g.departmentName, { total: 0, aligned: 0 })
    const d = deptMap.get(g.departmentName)!
    d.total++
    if (g.parentGoalId || g.goalCategory === 'company') d.aligned++
  }
  const byDepartment = [...deptMap.entries()].map(([department, v]) => ({
    department,
    total: v.total,
    aligned: v.aligned,
    rate: v.total > 0 ? Number(((v.aligned / v.total) * 100).toFixed(1)) : 0
  }))

  return {
    totalGoals,
    companyGoals,
    departmentGoals,
    personalGoals,
    alignedCount,
    orphanCount,
    alignmentRate,
    byDepartment
  }
}

/**
 * 建立对齐关系（Mock：直接修改子目标的 parentGoalId）
 */
export function createAlignmentMock(childId: number, parentId: number) {
  const all = performanceGoalMock.getData()
  const child = all.find((g) => g.id === childId)
  const parent = all.find((g) => g.id === parentId)
  if (!child || !parent) throw new Error('目标不存在')
  // 防止循环对齐
  if (parent.parentGoalId === childId) throw new Error('不允许循环对齐')
  child.parentGoalId = parentId
  child.parentGoalTitle = parent.goalTitle
  child.updateTime = new Date().toLocaleString('zh-CN')
  performanceGoalMock.update(child)
  return child
}

/**
 * 取消对齐关系
 */
export function removeAlignmentMock(childId: number) {
  const all = performanceGoalMock.getData()
  const child = all.find((g) => g.id === childId)
  if (!child) throw new Error('目标不存在')
  child.parentGoalId = undefined
  child.parentGoalTitle = undefined
  child.updateTime = new Date().toLocaleString('zh-CN')
  performanceGoalMock.update(child)
  return child
}
