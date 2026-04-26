// @ts-nocheck
/**
 * 招聘预算管理 Phase 5.10 Mock
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  RecruitmentBudget,
  BudgetAlert,
  BudgetExpense,
  BudgetOverview,
  BudgetDimension
} from '@/types/recruitmentBudget'
import { calcBudgetStatus } from '@/types/recruitmentBudget'

/* ========== 预算项 ========== */
function buildBudget(
  id: number,
  year: number,
  period: any,
  dimension: BudgetDimension,
  dimensionKey: string,
  budgetAmount: number,
  usedAmount: number,
  alertThreshold = 80,
  name?: string
): RecruitmentBudget {
  const usageRate = budgetAmount > 0 ? Number(((usedAmount / budgetAmount) * 100).toFixed(1)) : 0
  return {
    id,
    name: name || `${year} 年 ${dimensionKey} 招聘预算`,
    year,
    period,
    dimension,
    dimensionKey,
    budgetAmount,
    usedAmount,
    remainingAmount: budgetAmount - usedAmount,
    usageRate,
    alertThreshold,
    status: calcBudgetStatus(usageRate, alertThreshold),
    createTime: `${year}-01-05 09:00:00`,
    updateTime: '2026-04-19 10:30:00'
  }
}

const initialBudgets: RecruitmentBudget[] = [
  // 按部门
  buildBudget(1, 2026, 'year', 'department', '技术部', 800000, 420000, 80, '2026 年 技术部 招聘预算'),
  buildBudget(2, 2026, 'year', 'department', '产品部', 250000, 180000, 80),
  buildBudget(3, 2026, 'year', 'department', '设计部', 150000, 145000, 80),
  buildBudget(4, 2026, 'year', 'department', '运营部', 200000, 95000, 80),
  buildBudget(5, 2026, 'year', 'department', '市场部', 180000, 210000, 80),

  // 按岗位族
  buildBudget(6, 2026, 'year', 'jobFamily', '技术研发', 700000, 380000, 75),
  buildBudget(7, 2026, 'year', 'jobFamily', '产品设计', 300000, 205000, 80),
  buildBudget(8, 2026, 'year', 'jobFamily', '运营市场', 280000, 240000, 80),
  buildBudget(9, 2026, 'year', 'jobFamily', '管理岗位', 400000, 120000, 80),

  // 按渠道
  buildBudget(10, 2026, 'year', 'channel', 'Boss直聘', 120000, 80000, 80),
  buildBudget(11, 2026, 'year', 'channel', '猎聘', 180000, 120000, 80),
  buildBudget(12, 2026, 'year', 'channel', '智联招聘', 60000, 45000, 80),
  buildBudget(13, 2026, 'year', 'channel', '内推', 50000, 32000, 80, '2026 年 内推奖励预算'),
  buildBudget(14, 2026, 'year', 'channel', 'LinkedIn', 48000, 38000, 75),

  // 季度示例（Q1）
  buildBudget(15, 2026, 'quarter', 'department', '技术部', 200000, 190000, 80, '2026 Q1 技术部预算')
]

// Q1 条目添加 quarter 字段
initialBudgets[14].quarter = 1

export const budgetCrudMock = createCrudMock<RecruitmentBudget>(initialBudgets, {
  searchFields: ['name', 'dimensionKey']
})

/* ========== 告警历史 ========== */
const initialAlerts: BudgetAlert[] = [
  {
    id: 1,
    budgetId: 3,
    budgetName: '2026 年 设计部 招聘预算',
    dimension: 'department',
    dimensionKey: '设计部',
    triggerType: 'warning',
    triggerAmount: 145000,
    triggerRate: 96.7,
    message: '设计部招聘预算使用率达 96.7%，接近上限，请注意控制',
    acknowledged: 1,
    acknowledgedBy: '张HR',
    acknowledgedTime: '2026-04-12 10:00:00',
    triggerTime: '2026-04-10 09:00:00'
  },
  {
    id: 2,
    budgetId: 5,
    budgetName: '2026 年 市场部 招聘预算',
    dimension: 'department',
    dimensionKey: '市场部',
    triggerType: 'exceeded',
    triggerAmount: 210000,
    triggerRate: 116.7,
    message: '市场部招聘预算超支 30000 元（116.7%），需立即走预算追加流程',
    acknowledged: 0,
    triggerTime: '2026-04-18 15:00:00'
  },
  {
    id: 3,
    budgetId: 1,
    budgetName: '2026 年 技术部 招聘预算',
    dimension: 'department',
    dimensionKey: '技术部',
    triggerType: 'warning',
    triggerAmount: 640000,
    triggerRate: 80.0,
    message: '技术部招聘预算已达 80% 阈值',
    acknowledged: 0,
    triggerTime: '2026-04-19 09:00:00'
  },
  {
    id: 4,
    budgetId: 15,
    budgetName: '2026 Q1 技术部预算',
    dimension: 'department',
    dimensionKey: '技术部',
    triggerType: 'warning',
    triggerAmount: 190000,
    triggerRate: 95.0,
    message: 'Q1 技术部预算使用 95%，建议启用 Q2 预算接续',
    acknowledged: 1,
    acknowledgedBy: '张HR',
    acknowledgedTime: '2026-03-28 11:00:00',
    triggerTime: '2026-03-25 14:00:00'
  }
]

export const budgetAlertCrudMock = createCrudMock<BudgetAlert>(initialAlerts, {
  searchFields: ['budgetName', 'dimensionKey', 'message']
})

/* ========== 消耗明细 ========== */
const initialExpenses: BudgetExpense[] = [
  { id: 1, budgetId: 10, source: 'channel_cost', sourceId: 1, amount: 25000, month: '2026-01', description: 'Boss 直聘 季度包', createTime: '2026-01-05 10:00:00' },
  { id: 2, budgetId: 10, source: 'channel_cost', sourceId: 2, amount: 28000, month: '2026-02', description: 'Boss 直聘 月度续费', createTime: '2026-02-05 10:00:00' },
  { id: 3, budgetId: 10, source: 'channel_cost', sourceId: 3, amount: 27000, month: '2026-03', description: 'Boss 直聘 月度续费', createTime: '2026-03-05 10:00:00' },
  { id: 4, budgetId: 11, source: 'channel_cost', sourceId: 4, amount: 40000, month: '2026-01', description: '猎聘 年度 VIP 分摊', createTime: '2026-01-10 10:00:00' },
  { id: 5, budgetId: 11, source: 'channel_cost', sourceId: 5, amount: 40000, month: '2026-02', description: '猎聘 VIP', createTime: '2026-02-10 10:00:00' },
  { id: 6, budgetId: 11, source: 'channel_cost', sourceId: 6, amount: 40000, month: '2026-03', description: '猎聘 VIP', createTime: '2026-03-10 10:00:00' },
  { id: 7, budgetId: 13, source: 'referral_reward', sourceId: 1, amount: 200, month: '2026-04', description: '王研发 推荐孙八 面试奖', createTime: '2026-04-08 10:00:00' },
  { id: 8, budgetId: 13, source: 'referral_reward', sourceId: 2, amount: 1000, month: '2026-04', description: '王研发 推荐孙八 Offer 奖', createTime: '2026-04-14 10:00:00' },
  { id: 9, budgetId: 13, source: 'referral_reward', sourceId: 3, amount: 3000, month: '2026-04', description: '王研发 推荐孙八 入职奖', createTime: '2026-04-16 10:00:00' },
  { id: 10, budgetId: 1, source: 'background_check', sourceId: 1, amount: 288, month: '2026-04', description: '张三 标准背调', createTime: '2026-04-05 09:30:00' },
  { id: 11, budgetId: 1, source: 'background_check', sourceId: 2, amount: 288, month: '2026-04', description: '李四 标准背调', createTime: '2026-04-10 09:30:00' },
  { id: 12, budgetId: 1, source: 'background_check', sourceId: 3, amount: 1280, month: '2026-04', description: '王五 高管背调', createTime: '2026-04-01 08:30:00' }
]

export const budgetExpenseCrudMock = createCrudMock<BudgetExpense>(initialExpenses, {
  searchFields: ['description']
})

/* ========== 总览统计 ========== */
export function getBudgetOverviewMock(year = 2026): BudgetOverview {
  const allBudgets = budgetCrudMock.getData().filter((b) => b.year === year && b.period === 'year')

  const totalBudget = allBudgets.reduce((sum, b) => sum + b.budgetAmount, 0)
  const totalUsed = allBudgets.reduce((sum, b) => sum + b.usedAmount, 0)
  const totalRemaining = totalBudget - totalUsed
  const totalUsageRate = totalBudget > 0 ? Number(((totalUsed / totalBudget) * 100).toFixed(1)) : 0

  const normalCount = allBudgets.filter((b) => b.status === 'normal').length
  const warningCount = allBudgets.filter((b) => b.status === 'warning').length
  const exceededCount = allBudgets.filter((b) => b.status === 'exceeded').length

  // 按维度分组
  const dimensions: BudgetDimension[] = ['department', 'jobFamily', 'channel']
  const byDimension = dimensions.map((dim) => {
    const items = allBudgets.filter((b) => b.dimension === dim)
    return {
      dimension: dim,
      totalBudget: items.reduce((s, i) => s + i.budgetAmount, 0),
      totalUsed: items.reduce((s, i) => s + i.usedAmount, 0),
      items: items.map((i) => ({
        key: i.dimensionKey,
        budget: i.budgetAmount,
        used: i.usedAmount,
        usageRate: i.usageRate
      }))
    }
  })

  // 近 6 个月趋势（固定演示数据）
  const now = new Date()
  const sampleUsed = [85000, 92000, 108000, 115000, 132000, 148000]
  const sampleBudget = [160000, 160000, 160000, 160000, 160000, 160000]
  const monthlyTrend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    monthlyTrend.push({
      month: `${yyyy}-${mm}`,
      used: sampleUsed[5 - i],
      budget: sampleBudget[5 - i]
    })
  }

  return {
    totalBudget,
    totalUsed,
    totalRemaining,
    totalUsageRate,
    normalCount,
    warningCount,
    exceededCount,
    byDimension,
    monthlyTrend
  }
}

/**
 * 确认告警
 */
export function acknowledgeAlertMock(id: number, byName: string): BudgetAlert {
  const alert = budgetAlertCrudMock.getDetail(id)
  if (!alert) throw new Error('告警不存在')
  alert.acknowledged = 1
  alert.acknowledgedBy = byName
  alert.acknowledgedTime = new Date().toLocaleString('zh-CN')
  budgetAlertCrudMock.update(alert)
  return alert
}
