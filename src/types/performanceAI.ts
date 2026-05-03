/**
 * AI 辅助 类型定义（Phase C3 + E1）
 */

/**
 * OKR 质量检查的结构化输出（Phase E1 升级）
 *
 * 旧版 sampleOutput 为单段纯文本，前端无法做"逐条采纳"。
 * 新版返回结构化对象，前端 OKRCheckDrawer 据此渲染：
 * - SMART 5 维评分卡
 * - 问题清单（每条标注 O / KR1 / KR2…）
 * - 改进版（每条带"应用到 KR-N"按钮 + 底部"全部应用"）
 */
export interface OKRCheckResult {
  /** SMART 综合评分（0-5） */
  smartScore: number
  /** 5 维度评分 */
  dimensions: {
    S: number // Specific 具体
    M: number // Measurable 可衡量
    A: number // Achievable 可实现
    R: number // Relevant 相关
    T: number // Time-bound 有时限
  }
  /** 问题清单 */
  issues: Array<{
    /** 'O' / 'KR1' / 'KR2'… */
    target: string
    /** 问题描述 */
    text: string
  }>
  /** AI 改进版草案 */
  improvedDraft: {
    /** 改写后的 O */
    objective: string
    /** O 的描述（可选） */
    objectiveDescription?: string
    /** 改写后的 KR 列表（v3.1：3 类度量方式 numeric / milestone / achieve）*/
    keyResults: Array<{
      description: string
      type?: 'numeric' | 'milestone' | 'achieve'
      startValue?: string
      targetValue: string
      currentValue?: string
      weight: number
    }>
  }
}

/**
 * 智能简历解析的结构化输出（v8 升级 · 方案 3）
 *
 * 设计参考 Workday Recruiting + Moka：
 * - L1 字段：NER 抽取的客观字段（基本信息 / 教育 / 工作 / 项目 / 技能 / 期望薪资）
 * - 字段级校验：规则层判断每个字段是否完整（不是 LLM 自评置信度）
 * - L2 AI 衍生洞察：跨字段关联分析（职业稳定性 / 技能频次 / 跳槽频率）
 *
 * v8 砍掉了"与岗位匹配度分析"——归到 §3.7 智能简历匹配能力，避免边界重复。
 */
export interface ResumeParseResult {
  /** L1 · 基本信息 */
  basicInfo: {
    name: string
    age?: number
    birth?: string
    gender?: string
    phone?: string
    email?: string
    location?: string
  }

  /** L1 · 教育经历（多段）*/
  education: Array<{
    school: string
    major: string
    degree: string
    startDate?: string
    endDate?: string
  }>

  /** L1 · 工作经历（多段，按时间倒序）*/
  workExperience: Array<{
    company: string
    department?: string
    position: string
    startDate: string
    endDate?: string // 日期或 "至今"
    isCurrent?: boolean
    duration?: string // "3 年 8 个月"
    achievements: string[] // 业绩条目
    keywords: string[] // 关键词标签
  }>

  /** L1 · 项目经历（多段）*/
  projects: Array<{
    name: string
    role: string
    duration: string
    teamSize?: string
    output: string
    techStack?: string[]
  }>

  /** L1 · 技能 */
  skills: {
    primary: string[] // 主技能（高频出现）
    secondary?: string[] // 加分技能
    direction?: string[] // 方向标签
  }

  /** L1 · 期望薪资 */
  expectedSalary: {
    monthly?: string // "50k~65k"
    package?: string // "18 薪"
    estimatedAnnual?: string // "108~140 万"
  }

  /**
   * 字段级校验（规则层判断，**不是 LLM 自评置信度**）
   * 每个字段独立标注 ok / warning，warning 给原因
   */
  fieldChecks: Array<{
    field: string // "工作经历 2"、"期望薪资"
    status: 'ok' | 'warning'
    reason?: string // "至今未指定结束时间"
  }>

  /**
   * L2 · AI 衍生洞察（差异化卖点）
   * 跨字段关联分析得出的"读懂这个人"的判断
   */
  insights: {
    /** 平均在职时长（职业稳定性指标）*/
    averageTenure: string // "约 2.5 年/段"
    /**
     * 核心技能 · 使用上下文（不是单纯频次统计）
     * 每条 = 技能名 + 时长（可选）+ 真实使用场景（来自工作经历/项目）
     */
    skillContext: Array<{
      skill: string
      duration?: string // "5 年"
      scenarios: string // "抖音订单中台 · 淘宝交易系统重构"
    }>
    /** 跳槽频率：低 / 正常 / 高 */
    jobHopFrequency: 'low' | 'normal' | 'high'
    jobHopComment?: string // 文字解释
    /** 行业/领域聚焦度 */
    industryFocus: string
    /** AI 一段话总结（≤ 100 字）*/
    aiSummary: string
  }
}

/**
 * 高风险员工预警的结构化输出（v2 升级 · 业界共识对齐）
 *
 * 设计参考 Lattice Employee Health Score + Visier At Risk Score：
 * - 单一预测目标：仅"未来 4~8 周内主动离职可能性"（不外延到"绩效下滑/心理波动"）
 * - 信号源仅限 HR 系统已授权数据（不监控 IM/邮件/代码）
 * - 给等级 + 信号变化清单（Variance 视图：4.2→3.7）+ Key Drivers，HR 自己下结论
 * - AI 仅描述事实，不下子分类标签、不建议心理干预
 *
 * v2 砍掉的：
 * - "心理波动 / 绩效下滑 / 离职倾向" 子分类标签（合规雷区 + AI 越界）
 * - "协作活跃度 / IM 频率 / 加班时长 / 自评他评差异" 信号（行为监控雷区）
 * - "建议引入 EAP" 等 AI 干预决策
 */

/** 风险等级（仅"近期可能离职"单一目标，不再外延子分类） */
export type RiskLevel = 'high' | 'medium' | 'low'

/** HR 系统已授权数据源（合规标注） */
export type RiskSignalSource =
  | 'okr' // 目标更新（OKR 系统）
  | 'review_360' // 360 评估（绩效系统）
  | 'tenure' // 司龄（员工档案）
  | 'salary' // 薪酬竞争力（薪酬系统）
  | 'reporting_change' // 汇报关系变更（员工档案）
  | 'attendance' // 出勤异常（出勤系统）
  | 'promotion_stagnation' // 晋升停滞（绩效历史）

/** 后续操作状态（HR 标注后更新） */
export type RiskFollowUpStatus =
  | 'pending' // 未跟进
  | 'reviewed' // 已跟进
  | 'snoozed' // 暂时忽略
  | 'in_focus' // 加入关注列表
  | 'one_on_one_scheduled' // 已发起 1on1

/**
 * 单条信号变化（Visier "Variance" 视图）
 *
 * 关键设计：摆事实，不下结论。
 * 例：360 协作分: 4.2 → 3.7（本季 vs 历史均值，↓0.5）
 */
export interface RiskSignalChange {
  /** 信号名（中文显示）- "360 协作分" */
  name: string
  /** 信号源（合规追溯）*/
  source: RiskSignalSource
  /** 当前值 */
  current: string
  /** 基线值（历史均值 / 上一周期）*/
  baseline: string
  /** 变化值（含方向 / 含百分比，HR 自己看）*/
  variance: string
  /** 时间窗口（"本季 vs 历史均值"、"近 4 周"）*/
  window: string
  /** 规则层标注：是否值得关注（不是 AI 自评）*/
  flag: 'normal' | 'attention' | 'concerning'
}

/** 风险预警员工卡片 */
export interface RiskAlertEmployee {
  employeeId: number
  name: string
  department: string
  level?: string
  /** 司龄文本（如 "2 年 8 个月"）*/
  tenure: string
  /** 风险等级（规则层多信号叠加判定 · 单一目标"近期可能离职"）*/
  riskLevel: RiskLevel
  /** 信号变化清单（Variance 视图）*/
  signalChanges: RiskSignalChange[]
  /** Top 3 Key Drivers - 关键风险因素简短描述（≤ 20 字 / 条）*/
  keyDrivers: string[]
  /**
   * AI 一段话观察（≤ 80 字 · 严禁建议 / 推荐 / 应该等动词）
   * 仅描述事实，不下结论 / 不建议干预 / 不做心理诊断
   */
  aiObservation: string
  /** 后续操作状态（HR 操作后更新）*/
  followUpStatus?: RiskFollowUpStatus
  /** Snooze 截止时间（标暂时忽略后写入）*/
  snoozedUntil?: string
}

/**
 * 上次重算原因（用于 Drawer 顶部告知 HR 当前数据来自哪种触发）
 *
 * - 'daily_03': 每天 03:00 自动批处理（默认 · 业界对标 Workday 24h 模式）
 * - 'meeting_created': HR 创建盘点会议时立刻跑（push 例外）
 * - 'manual_init': 系统初始化首次跑（mock 阶段使用）
 */
export type RecomputeReason = 'daily_03' | 'meeting_created' | 'manual_init'

export const RECOMPUTE_REASON_LABEL: Record<RecomputeReason, string> = {
  daily_03: '每日 03:00 例行刷新',
  meeting_created: '盘点会议触发',
  manual_init: '系统初始化'
}

/**
 * 风险预警整体输出
 */
export interface RiskAlertResult {
  /** 扫描范围（如 "技术研发中心全员"） */
  scope: string
  /** 数据时间窗口（如 "近 8 周"） */
  dataWindow: string
  /** 信号源声明（合规追溯，UI 顶部展示）*/
  dataSources: string[]
  /** 员工风险列表（按风险等级 + 信号数量排序）*/
  employees: RiskAlertEmployee[]
  /** 统计元数据 */
  meta: {
    totalScanned: number
    highRiskCount: number
    mediumRiskCount: number
    lowRiskCount: number
    /** 快照生成时间（ISO 字符串，前端按本地时区格式化）*/
    snapshotTime: string
    /** 上次重算原因（用于 UI 标注当前数据来自哪种触发）*/
    lastRecomputeReason: RecomputeReason
    /** 下次自动重算时间（ISO 字符串 · 默认每天 03:00）*/
    nextScheduledRun: string
  }
}

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险'
}

export const RISK_LEVEL_TYPE: Record<RiskLevel, 'danger' | 'warning' | 'info'> = {
  high: 'danger',
  medium: 'warning',
  low: 'info'
}

export const RISK_SIGNAL_SOURCE_LABEL: Record<RiskSignalSource, string> = {
  okr: 'OKR 系统',
  review_360: '360 评估',
  tenure: '员工档案',
  salary: '薪酬系统',
  reporting_change: '员工档案',
  attendance: '出勤系统',
  promotion_stagnation: '绩效历史'
}

export const SIGNAL_FLAG_TYPE: Record<
  RiskSignalChange['flag'],
  'success' | 'warning' | 'danger'
> = {
  normal: 'success',
  attention: 'warning',
  concerning: 'danger'
}

/* ========== 薪酬合理性检查（v2 业界共识对齐 · 规则引擎为主 + AI 自然语言辅助）========== */

/**
 * 薪酬合理性检查输出（业界对标 ChartHop / Workday Compensation）
 *
 * 设计原则：
 * - 核心检测（带宽 / 倒挂 / 内部对标）= 规则引擎，不是 AI
 * - AI 仅做"翻译数据"——把规则结果用自然语言陈述
 * - **不下"高/中/低风险"主观等级**，二元提示（在带宽 / 超带宽 / 倒挂提示）
 * - **不给"方案 A/B/C"** —— AI 不替 HR 决策
 * - **不暴露具体他人薪资数字**（用分位 P25/P50/P75 表达）
 * - **不下"管理倒挂"判断**（仅陈述"形成数值倒挂"事实）
 */
export type SanityCheckStatus = 'in_range' | 'out_of_range' | 'inversion_alert'

/** 带宽范围（min/mid/max）+ 当前位置 */
export interface SalaryBandAnalysis {
  /** 带宽下限 */
  min: number
  /** 带宽中位 */
  mid: number
  /** 带宽上限 */
  max: number
  /** 当前提议薪资 */
  proposed: number
  /** Compa-Ratio（提议 / 中位）*/
  compaRatio: number
  /** 是否超带宽 */
  outOfRange: boolean
  /** 数据来源声明（合规追溯）*/
  source: string
}

/** 同岗内部对标（仅显示分位，不暴露具体他人薪资）*/
export interface PeerBenchmark {
  /** 同岗级在职人数 */
  peerCount: number
  /** 当前提议薪资在同岗级的分位位置（P25 / P50 / P75 / Top）*/
  proposedQuartile: 'P25' | 'P50' | 'P75' | 'Top'
  /** 数据来源声明 */
  source: string
}

/** 数值倒挂提示（不下"管理倒挂"判断）*/
export interface InversionHint {
  /** 是否数值倒挂（仅事实陈述）*/
  hasInversion: boolean
  /** 文字描述（如"超出团队同岗 75 分位"，不暴露具体 Leader 薪资）*/
  description: string
  /** 数据来源声明 */
  source: string
}

export interface SalarySanityCheckResult {
  /** 二元状态（不是高/中/低主观等级）*/
  status: SanityCheckStatus
  /** 带宽分析 */
  band: SalaryBandAnalysis
  /** 同岗内部对标 */
  peer: PeerBenchmark
  /** 数值倒挂提示 */
  inversion: InversionHint
  /**
   * AI 自然语言观察（≤ 60 字 · 仅翻译数据，不下判断 / 不建议方案）
   * 严禁出现：建议 / 推荐 / 应该 / 方案 / 晋升 / 管理倒挂
   */
  aiObservation: string
}

export const SANITY_STATUS_LABEL: Record<SanityCheckStatus, string> = {
  in_range: '在带宽内',
  out_of_range: '超出带宽',
  inversion_alert: '形成数值倒挂'
}

export const SANITY_STATUS_TYPE: Record<SanityCheckStatus, 'success' | 'warning' | 'danger'> = {
  in_range: 'success',
  out_of_range: 'warning',
  inversion_alert: 'danger'
}

/** AI 能力编码 */
export type AIAbilityCode =
  | 'okr_check' // OKR 质量检查
  | 'meeting_agenda' // 员工资料卡生成（保留 code，显示名已改）
  | 'risk_alert' // 高风险员工预警
  | 'comment_polish' // 评语优化（不是生成）
  | 'resume_parse' // 智能简历解析（全系统 - 招聘场景）
  | 'salary_sanity_check' // 薪酬合理性检查（全系统 - 薪酬场景）

/** AI 能力成熟度 */
export type AIMaturity = 'stable' | 'beta' | 'experimental'

/** 采纳结果 */
export type AdoptionResult = 'adopted' | 'modified_adopted' | 'rejected' | 'draft'

/**
 * AI 能力定义
 */
export interface AIAbility {
  id: number
  code: AIAbilityCode
  name: string
  icon: string
  description: string
  /** 适用场景 */
  useCase: string
  /** 成熟度 */
  maturity: AIMaturity
  /** 是否启用 */
  status: 0 | 1
  /** 样例输入（演示用） */
  sampleInput: string
  /** 样例输出（演示用） */
  sampleOutput: string
}

/**
 * AI 调用记录
 */
export interface AICallRecord {
  id: number
  /** 能力编码 */
  abilityCode: AIAbilityCode
  /** 能力名称 */
  abilityName: string
  /** 调用人 */
  operatorName: string
  operatorId: number
  /** 目标员工（如果适用） */
  targetEmployee?: string
  targetEmployeeId?: number
  /** 输入摘要 */
  inputSummary: string
  /** 输出摘要 */
  outputSummary: string
  /** 采纳结果 */
  adoptionResult: AdoptionResult
  /** 修改程度（0-100，0=完全未改，100=完全改写） */
  modificationDegree?: number
  /** 调用时间 */
  callTime: string
  createTime: string
}

/**
 * 查询参数
 */
export interface AICallRecordListParams {
  abilityCode?: AIAbilityCode | ''
  operatorName?: string
  adoptionResult?: AdoptionResult | ''
  page: number
  pageSize: number
}

/** 字典 */
export const AI_ABILITY_LABEL: Record<AIAbilityCode, string> = {
  okr_check: 'OKR 质量检查',
  meeting_agenda: '员工资料卡生成',
  risk_alert: '高风险员工预警',
  comment_polish: '评语优化',
  resume_parse: '智能简历解析',
  salary_sanity_check: '薪酬合理性检查'
}

export const MATURITY_LABEL: Record<AIMaturity, string> = {
  stable: '稳定',
  beta: 'Beta',
  experimental: '实验性'
}

export const MATURITY_TYPE: Record<
  AIMaturity,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  stable: 'success',
  beta: 'primary',
  experimental: 'warning'
}

export const ADOPTION_RESULT_LABEL: Record<AdoptionResult, string> = {
  adopted: '原样采纳',
  modified_adopted: '修改后采纳',
  rejected: '放弃',
  draft: '草稿未提交'
}

export const ADOPTION_RESULT_TYPE: Record<
  AdoptionResult,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  adopted: 'success',
  modified_adopted: 'primary',
  rejected: 'info',
  draft: 'warning'
}
