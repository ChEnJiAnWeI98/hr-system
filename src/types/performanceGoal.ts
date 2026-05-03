/**
 * 目标管理类型定义（Phase A3 升级版）
 * 支持 OKR + KPI 双模式、三层分解、KR 数组、父目标关联、审批、冻结、进度记录
 */

/** 目标模式：OKR / KPI（1=OKR 2=KPI，保留原数值语义）*/
export type GoalMode = 1 | 2

/** 目标层级：公司 / 部门 / 个人（仅 OKR 使用；KPI 默认 personal） */
export type GoalCategory = 'company' | 'department' | 'personal'

/** 审批状态：0-待审批 1-已批准 2-已驳回 3-重新提交 */
export type GoalApprovalStatus = 0 | 1 | 2 | 3

/** 进度状态：0-未开始 1-进行中 2-已完成 3-已取消 */
export type GoalStatus = 0 | 1 | 2 | 3

/**
 * KR 度量方式（v3.1 简化为 3 类，对齐钉钉 / 北森 国内主流）
 *
 * - numeric   数值进度：可量化数字，起始/目标/当前 三件套，**自动判断方向**算进度
 *             （v3 的 number / percent / currency 三类合并——区别仅是单位写法不同）
 * - milestone 里程碑：阶段性事件，进度手动维护
 * - achieve   达成型：二元 KR（达成 / 未达成），UI 用 switch 开关
 */
export type KRType = 'numeric' | 'milestone' | 'achieve'

/**
 * OKR 关键成果（Key Result）
 *
 * 字段设计参考 Quantive Results / Lattice：
 * - 数值类（number/percent/currency）：startValue → targetValue → currentValue 三件套，进度自动计算
 * - 里程碑（milestone）：仅描述目标，进度手动维护
 * - 是/否（boolean）：达成则 100%，否则 0%
 *
 * 老数据（V1.x）只有 description/targetValue/currentValue/weight/progress，新字段全部可选，
 * 缺省 type 视为 'milestone'（最宽松、不破坏老数据展示）
 */
export interface KeyResult {
  /** 关键结果（多行文本，对齐飞书/钉钉/北森的"关键结果"字段名）*/
  description: string
  /** 度量方式（默认 milestone，老数据兼容）*/
  type?: KRType
  /** 起始值（仅 numeric 类型有效；老数据为空时降级为 0）*/
  startValue?: string
  /** 目标值（numeric 填数字，milestone 填阶段目标描述，achieve 不用）*/
  targetValue: string
  /** 当前值（numeric 填数字，milestone 填当前状态，achieve 填'已达成'/'未达成'）*/
  currentValue: string
  /** 权重（同一 O 下所有 KR 权重和 = 100） */
  weight: number
  /** 完成率（0-100，numeric / achieve 自动计算，milestone 手动维护） */
  progress: number
  /** 备注 */
  remark?: string
}

/**
 * 目标管理数据项
 */
export interface PerformanceGoal {
  id: number
  /** 目标编号：GOAL + 年月日 + 4 位流水 */
  goalNo?: string
  /** 员工 ID */
  employeeId: number
  /** 员工姓名 */
  employeeName: string
  /** 部门 ID */
  departmentId?: number
  /** 部门名称 */
  departmentName: string
  /** 岗位族（用于 OKR/KPI 模式自动匹配） */
  jobFamily?: string
  /** 考核周期 ID */
  cycleId: number
  /** 考核周期名称 */
  cycleName: string

  /** 目标类型：1-OKR 2-KPI */
  goalType: GoalMode
  /** 目标类型名称（冗余展示） */
  goalTypeName?: string
  /** 目标层级（OKR 用；KPI 默认 personal） */
  goalCategory?: GoalCategory
  /** 父目标 ID（对齐关系；可选，不强制） */
  parentGoalId?: number
  /** 父目标名称（冗余展示） */
  parentGoalTitle?: string

  /** 目标标题 */
  goalTitle: string
  /** 目标描述 */
  goalDescription: string
  /** 权重（百分比，同一员工所有目标权重和 = 100） */
  weight: number

  /** KPI 模式：目标值 */
  targetValue: string
  /** KPI 模式：当前值 */
  currentValue: string
  /** OKR 模式：KR 数组（JSON） */
  keyResults?: KeyResult[]

  /** 完成进度（百分比，0-100）— OKR：各 KR 加权平均；KPI：手工更新 */
  progress: number

  /** 目标进度状态 */
  status: GoalStatus
  /** 状态名称（冗余） */
  statusName?: string

  /** 审批状态 */
  approvalStatus: GoalApprovalStatus
  /** 审批人工号 / 姓名 */
  approverId?: number
  approverName?: string
  /** 审批时间 */
  approveTime?: string
  /** 审批意见 */
  approveComment?: string

  /** 是否冻结（评估开始后冻结，冻结后不能改结构）*/
  frozen?: 0 | 1

  /** 最近进度更新时间 */
  lastProgressUpdate?: string
  /** 最近进度更新人 */
  lastUpdatedBy?: string

  /**
   * 已完成的修订次数（同一周期最多 1 次，业界对齐 飞书 OKR / 钉钉 OKR / Lattice）
   * - undefined / 0：未修订过
   * - 1：已用完本周期修订机会，不能再次申请
   * - 业务规则：审批通过即 +1（驳回不计数）
   */
  revisionCount?: number
  /**
   * 当前进行中的修订申请（pending / 一旦审批结束置 undefined）
   * 用于：① 列表展示"修订中"标签 ② 阻止重复发起
   */
  pendingRevision?: GoalRevision
  /** 历史修订记录（按时间倒序） */
  revisions?: GoalRevision[]

  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/* ========== 目标修订（业界共识：已批准后 O/KR 描述锁，要改走审批） ========== */

/** 修订申请状态 */
export type RevisionStatus = 'pending' | 'approved' | 'rejected'

/**
 * 修订原因（下拉枚举 · 业界飞书 OKR 同款）
 *
 * - market_change      市场变化（外部因素，最常见）
 * - strategy_adjust    战略调整（公司层面方向变化）
 * - resource_shortage  资源不足（人力/预算/技术不到位）
 * - other              其他（必须填"原因说明"）
 */
export type RevisionReasonCode =
  | 'market_change'
  | 'strategy_adjust'
  | 'resource_shortage'
  | 'other'

/**
 * 修订前后字段快照
 *
 * 仅记录"会被锁定"的核心字段：goalTitle / goalDescription / keyResults / weight。
 * 进度字段（progress / currentValue）不在锁定范围（员工每周 Check-in 自然会改）。
 */
export interface RevisionSnapshot {
  goalTitle: string
  goalDescription: string
  weight: number
  keyResults?: KeyResult[]
}

/**
 * 单次目标修订记录
 *
 * 状态机：pending → approved（审批通过 · 修改生效 · revisionCount + 1）
 *         pending → rejected（驳回 · 保持原状 · revisionCount 不变）
 */
export interface GoalRevision {
  id: number
  /** 关联 OKR ID */
  goalId: number
  /** 当前申请状态 */
  status: RevisionStatus

  /** 修订前快照（提交时冻结）*/
  before: RevisionSnapshot
  /** 修订后内容（申请人填写）*/
  after: RevisionSnapshot

  /** 修订原因（枚举）*/
  reasonCode: RevisionReasonCode
  /** 修订原因说明（自由文本，reasonCode = other 时必填）*/
  reasonDetail?: string

  /** 申请人（员工本人）*/
  applicantId: number
  applicantName: string
  /** 申请时间 */
  applyTime: string

  /** 审批人（与初次 OKR 审批同一上级，从 PerformanceGoal.approverName 继承）*/
  approverId?: number
  approverName?: string
  /** 审批时间（approved / rejected 后写入）*/
  approveTime?: string
  /** 审批意见（驳回时通常必填）*/
  approveComment?: string
}

/* 修订字典 */

export const REVISION_STATUS_LABEL: Record<RevisionStatus, string> = {
  pending: '修订中',
  approved: '已生效',
  rejected: '已驳回'
}

export const REVISION_STATUS_TYPE: Record<RevisionStatus, ElTagType> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
}

export const REVISION_REASON_LABEL: Record<RevisionReasonCode, string> = {
  market_change: '市场变化',
  strategy_adjust: '战略调整',
  resource_shortage: '资源不足',
  other: '其他'
}

/**
 * 列表查询参数
 */
export interface PerformanceGoalListParams {
  employeeName?: string
  departmentId?: number | string | null
  departmentName?: string
  cycleId?: number | string | null
  goalType?: GoalMode | string | null
  goalCategory?: GoalCategory | ''
  approvalStatus?: GoalApprovalStatus | string | null
  status?: GoalStatus | string | null
  page: number
  pageSize: number
}

/**
 * 进度更新日志
 */
export interface GoalProgressLog {
  id: number
  goalId: number
  /** 更新前进度 */
  beforeProgress: number
  /** 更新后进度 */
  afterProgress: number
  /** 更新前当前值（或 KR 汇总快照）*/
  beforeValue?: string
  /** 更新后当前值 */
  afterValue?: string
  /** 本阶段亮点 */
  highlights?: string
  /** 遇到的问题 */
  issues?: string
  /** 下阶段计划 */
  nextPlan?: string
  /** 更新人 */
  updatedBy: string
  updatedById: number
  updateTime: string
}

/**
 * 目标模板（快速创建常用目标）
 */
export interface GoalTemplate {
  id: number
  templateName: string
  jobFamily: string
  level: string
  /** OKR / KPI */
  goalType: GoalMode
  /** 模板目标标题 */
  goalTitle: string
  /** 模板描述（可引导员工思考） */
  goalDescription: string
  /** KPI 目标值（KPI 模板用）*/
  targetValue?: string
  /** OKR 示例 KR 列表（OKR 模板用） */
  keyResults?: KeyResult[]
  /** 建议权重 */
  suggestedWeight?: number
  remark?: string
  createTime: string
  updateTime: string
}

/* ========== 字典 ========== */

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

export const GOAL_MODE_MAP: Record<number, { label: string; type: ElTagType }> = {
  1: { label: 'OKR', type: 'success' },
  2: { label: 'KPI', type: 'warning' }
}

export const GOAL_CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  company: { label: '公司目标', icon: '🏢' },
  department: { label: '部门目标', icon: '👥' },
  personal: { label: '个人目标', icon: '👤' }
}

export const GOAL_APPROVAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '待审批', type: 'warning' },
  1: { label: '已批准', type: 'success' },
  2: { label: '已驳回', type: 'danger' },
  3: { label: '重新提交', type: 'primary' }
}

export const GOAL_STATUS_MAP: Record<number, { label: string; type: ElTagType }> = {
  0: { label: '未开始', type: 'info' },
  1: { label: '进行中', type: 'primary' },
  2: { label: '已完成', type: 'success' },
  3: { label: '已取消', type: 'info' }
}

/**
 * 根据岗位族自动匹配模式（技术/产品/研发 → OKR；销售/运营/职能 → KPI）
 */
export function matchGoalMode(jobFamily?: string): GoalMode {
  if (!jobFamily) return 1
  if (['技术研发', '产品设计'].includes(jobFamily)) return 1
  return 2
}

/* ========== KR 度量方式字典（v3.1：3 类，含 hint 文案） ========== */

export const KR_TYPE_MAP: Record<KRType, { label: string; icon: string; hint: string }> = {
  numeric: { label: '数值进度', icon: '📊', hint: '如 销售额 / 覆盖率 / 客户数' },
  milestone: { label: '里程碑', icon: '🚩', hint: '如 项目交付 / 活动上线 / 阶段任务' },
  achieve: { label: '达成型', icon: '✓', hint: '如 通过认证 / 完成入职 / 合规检查' }
}

/**
 * 根据 KR 字段计算完成率（v4 简化：进度全靠手动滑，达成型靠 switch）
 *
 * - numeric  : 直接读 progress 字段（员工手动滑）
 * - milestone: 直接读 progress 字段（员工手动滑）
 * - achieve  : currentValue === '已达成' 则 100%，否则 0%
 *
 * v4 删除了"起始/目标/当前自动算进度"的逻辑——员工写完 KR 后自己更新进度，
 * 系统不再做"从字符串里抽数字"这种容易出错的事。
 */
export function calcKRProgress(kr: KeyResult): number {
  const type: KRType = kr.type || 'milestone'

  if (type === 'achieve') {
    return kr.currentValue === '已达成' ? 100 : 0
  }

  // numeric / milestone 都直接读 progress（手动维护）
  return Math.max(0, Math.min(100, Number(kr.progress) || 0))
}

