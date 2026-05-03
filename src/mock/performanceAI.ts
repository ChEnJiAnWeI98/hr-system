/**
 * AI 辅助 Mock 数据（Phase C3）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  AIAbility,
  AICallRecord,
  AIAbilityCode,
  OKRCheckResult,
  ResumeParseResult,
  RiskAlertResult,
  SalarySanityCheckResult
} from '@/types/performanceAI'

/** ============ AI 能力定义 ============ */
const abilitiesData: AIAbility[] = [
  {
    id: 1,
    code: 'okr_check',
    name: 'OKR 质量检查',
    icon: '🎯',
    description: '基于 SMART 原则检查 OKR 质量，给出改进建议',
    useCase: '员工提交 OKR 前自检 / 主管审核 OKR 时快速筛查',
    maturity: 'stable',
    status: 1,
    sampleInput: `O：提升产品质量\nKR1：加强测试\nKR2：修复 bug\nKR3：协助领导完成相关工作`,
    sampleOutput: `整体评估：整体 OKR 偏空泛，缺乏可衡量指标（SMART 得分 2.0/5）\n\n问题分析：\n• O 目标过于笼统，缺少可度量维度\n• KR1"加强测试"无量化指标\n• KR2"修复 bug"未设定数量/时限\n• KR3"协助相关工作"偏 to-do，不构成 KR\n\n改进建议：\nO：Q2 内将产品线上缺陷率降低 40%\nKR1：上线后 72 小时内缺陷数从 35 个降至 20 个以内\nKR2：核心模块单元测试覆盖率从 65% 提升到 85%\nKR3：建立缺陷复盘机制，每月输出 1 份分析报告`
  },
  {
    id: 2,
    code: 'meeting_agenda',
    name: '员工资料卡生成',
    icon: '📊',
    description: '基于员工真实数据（OKR/360/出勤等）生成 1on1 准备资料卡，含数据快照与 AI 智能洞察。AI 不替 Leader 设计对话，仅辅助 Leader 了解员工现状',
    useCase: '1on1 / 季度面谈前，Leader 快速了解员工最新数据情况',
    maturity: 'stable',
    status: 1,
    sampleInput: `员工：张伟（P6 后端工程师 · 技术部）

【本季度 OKR 进度】
  O1 [推动核心系统重构] 75%
  O2 [跨团队协作改进] 40%
  O3 [技术分享与团队建设] 90%

【360 评分趋势】（脱敏汇总，不显示具体评估人）
  协作维度：上轮 4.2 → 本轮 3.7（↓ 0.5）
  技术维度：上轮 4.5 → 本轮 4.6（↑ 0.1）
  自评 vs 他评差：协作维度自评高 0.6 分

【近期信号】
  近 4 周加班时长：+30%（环比）
  近 2 周代码 commit：-40%（环比）

【上次 1on1】
  时间：3 个月前
  议题：跨团队沟通改进（已解决度：50%）`,
    sampleOutput: `张伟 · 1on1 资料卡

📊 数据快照
  · OKR 进度：O1 75% / O2 40% ⚠️ / O3 90%
  · 360 趋势：协作 4.2→3.7（↓） / 技术 4.5→4.6（↑）
  · 自评高于他评 0.6 分（协作维度）⚠️
  · 近 4 周加班 +30%，但 commit -40% ⚠️
  · 上次 1on1 议题"跨团队沟通"3 个月前 🔁 延续

🤖 AI 智能洞察
  ▸ O2 进度落后 + 协作分下降 + 加班增但产出降——
    可能存在跨团队协作卡点（耗时不出活）
  ▸ 上次 1on1 已谈过跨团队沟通，本次属于延续性议题
  ▸ 协作维度自评比他评高 0.6 分，存在自我认知偏差
  ▸ 技术能力评分仍在上升（亮点）

📋 重点关注（按优先级）
  1. O2 协作卡点（高优先级 · 多信号叠加）
  2. 协作分下降的具体场景
  3. 自评与他评的协作认知偏差
  4. 技术成长方向（亮点延伸）

—— 数据来源：OKR 系统 / 360 评估（已脱敏）/ 出勤记录 / 代码仓库
—— 本卡仅供 Leader 了解员工现状，1on1 具体怎么聊由 Leader 决定`
  },
  {
    id: 3,
    code: 'risk_alert',
    name: '高风险员工预警',
    icon: '⚠️',
    description: '基于 HR 系统已授权数据（OKR / 360 / 司龄 / 薪酬 / 汇报关系 / 出勤）识别近期可能离职的员工，仅作 HR 关怀触发参考',
    useCase: 'HR 月度风险盘点 / 盘点会议前关注名单生成 / 直线经理 1on1 准备',
    maturity: 'beta',
    status: 1,
    sampleInput: `扫描范围：技术研发中心全员（共 48 人）\n数据窗口：近 8 周\n信号源：OKR 系统 / 360 评估 / 员工档案 / 薪酬系统 / 出勤系统`,
    sampleOutput: `识别到 5 位需要关注的员工（2 高 / 2 中 / 1 低）\n\n详细结构化数据见 structured 字段（前端按 Drawer 渲染）：\n  · 每位员工含 信号变化清单（Variance）+ Top 3 Key Drivers + AI 一段话观察\n  · 单一预测目标：仅"未来 4~8 周内主动离职可能性"\n  · 不下"绩效下滑/心理波动"等子分类标签\n  · AI 仅描述事实，不建议干预动作（HR 自行判断是否发起 1on1）`
  },
  {
    id: 4,
    code: 'comment_polish',
    name: '评语优化',
    icon: '📋',
    description: '严格风格润色：仅做语气/表达优化，禁止补充事实（不编造数据/项目名/业绩）',
    useCase: '管理者写完评语初稿后，AI 把口语化表达优化为更专业书面化的措辞',
    maturity: 'stable',
    status: 1,
    sampleInput: `张伟本季度表现还不错，完成了主要目标，但沟通方面需要加强`,
    // 默认输出 = professional 风格（具体 3 种风格见 commentPolishToneSamples）
    sampleOutput: `张伟本季度整体表现良好，已达成本职核心目标。在沟通协作方面仍有提升空间，建议进一步加强主动同步与跨团队对齐。`
  },
  {
    id: 5,
    code: 'resume_parse',
    name: '智能简历解析',
    icon: '📄',
    description: 'NER 抽取候选人简历的结构化字段；附字段级规则校验 + 定性匹配度分析（无伪精度数字）',
    useCase: '招聘场景：候选人投递后 HR 初筛时快速预览 / 与目标岗位的定性匹配度参考',
    maturity: 'stable',
    status: 1,
    sampleInput: `姓名：陈某\n出生：1993.08\n学历：硕士，清华大学 计算机科学与技术（2015-2018）\n工作经历：\n  2018.07-2022.03  字节跳动  资深后端工程师\n    · 负责抖音服务端中台架构设计，支撑 DAU 3 亿\n    · 主导推荐系统改造，QPS 峰值 20w+，P99 < 50ms\n  2022.04-至今  美团  后端技术专家\n    · 外卖交易核心链路负责人，日订单 7000w\n技能：Golang、MySQL、Redis、Kafka、K8s、分布式系统设计\n期望薪资：月薪 50~65k，year 18`,
    sampleOutput: `【基本信息】\n  姓名 / 联系方式 / 期望薪资 / 现居地 ✓\n\n【教育经历】\n  本科及以上学历 ✓\n\n【工作经历】（多段，按时间倒序）\n  · 公司 / 部门 / 岗位 / 起止时间 / 业绩条目 / 关键词\n  · 自动检测"至今"等不完整时间标记 ⚠️\n\n【项目经历】（多段）\n  · 项目名 / 角色 / 时间 / 团队规模 / 产出 / 技术栈\n\n【技能标签】\n  · 主技能（高频）/ 加分技能 / 方向标签\n\n【字段校验】（规则层判断，非 LLM 自评置信度）\n  · 每个字段独立标注 ✓ / ⚠️\n\n【AI 衍生洞察】（L2 跨字段分析）\n  · 平均在职时长（职业稳定性）\n  · 技能频次 Top 5\n  · 跳槽频率（低/正常/高）\n  · 行业聚焦度\n  · AI 总结一段话\n\n`
  },
  {
    id: 6,
    code: 'salary_sanity_check',
    name: '薪酬合理性检查',
    icon: '💰',
    description: '基于公司薪酬带宽 + 同岗内部分位 + 数值倒挂检测的客观诊断（核心是规则引擎，AI 仅做自然语言陈述）',
    useCase: 'Offer 定薪 / HRBP 发起调薪 时 inline 提示',
    maturity: 'beta',
    status: 1,
    sampleInput: `员工：李某（P5 前端工程师，司龄 3.2 年，当前月薪 25k）\n调整方案：调薪至 月薪 32k（涨幅 28%）\n调整原因：本年度绩效 S 档，主导完成 2 个核心项目`,
    sampleOutput: `详细结构化数据见 structured 字段（前端按 inline 卡片渲染）：\n  · status: 'out_of_range'（二元状态，非高/中/低主观等级）\n  · band 带宽分析（compa-ratio）\n  · peer 同岗分位（P25/P50/P75/Top）\n  · inversion 数值倒挂提示（事实陈述，不下管理判断）\n  · aiObservation ≤ 60 字事实陈述（不建议 / 不推荐方案）`
  }
]

export const aiAbilityMock = createCrudMock<AIAbility>(abilitiesData, {
  idField: 'id',
  searchFields: ['name', 'code']
})

/** ============ AI 调用记录 ============ */
const callRecordData: AICallRecord[] = [
  {
    id: 1,
    abilityCode: 'comment_polish',
    abilityName: '评语优化',
    operatorName: '王总监',
    operatorId: 101,
    targetEmployee: '张伟',
    targetEmployeeId: 1001,
    inputSummary: '张伟本季度表现还不错，完成了主要目标，但沟通方面需要加强...',
    outputSummary:
      '张伟本季度整体表现良好，已达成本职核心目标。在沟通协作方面仍有提升空间，建议进一步加强主动同步与跨团队对齐。',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-20 15:30',
    createTime: '2026-04-20 15:30:00'
  },
  {
    id: 2,
    abilityCode: 'okr_check',
    abilityName: 'OKR 质量检查',
    operatorName: '李娜',
    operatorId: 1002,
    inputSummary: 'O：Q2 提升前端工程化能力\nKR1：搭建组件库\nKR2：提升构建速度',
    outputSummary: 'KR 缺少量化指标，建议改为：KR1 上线 20+ 基础组件覆盖 80% 场景；KR2 构建时间 60s→20s',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-18 10:15',
    createTime: '2026-04-18 10:15:00'
  },
  {
    id: 3,
    abilityCode: 'meeting_agenda',
    abilityName: '员工资料卡生成',
    operatorName: '陈总监',
    operatorId: 102,
    targetEmployee: '徐红',
    targetEmployeeId: 2001,
    inputSummary: '员工：徐红 / Q1 目标完成率 82% / 近期无异常',
    outputSummary: '1. 目标完成情况复盘...2. 晋升通道讨论...3. 跨产品合作机会...',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-15 14:00',
    createTime: '2026-04-15 14:00:00'
  },
  {
    id: 4,
    abilityCode: 'risk_alert',
    abilityName: '高风险员工预警',
    operatorName: 'HR-Lisa',
    operatorId: 100,
    inputSummary: '范围：全司近 8 周（HR 域已授权数据）',
    outputSummary: '识别 5 位需关注员工（高风险 2 / 中风险 2 / 低风险 1）',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-14 09:00',
    createTime: '2026-04-14 09:00:00'
  },
  {
    id: 5,
    abilityCode: 'comment_polish',
    abilityName: '评语优化',
    operatorName: '赵静',
    operatorId: 1004,
    inputSummary: '他总是拖延交付，需要改进',
    outputSummary: '在交付推进方面仍有提升空间，建议加强进度同步与时间管理。',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-12 16:20',
    createTime: '2026-04-12 16:20:00'
  },
  {
    id: 6,
    abilityCode: 'okr_check',
    abilityName: 'OKR 质量检查',
    operatorName: '吴昊',
    operatorId: 1007,
    inputSummary: 'O 提升个人能力（过于宽泛）',
    outputSummary: '建议拆解为 3 个具体能力维度...但用户未采纳',
    adoptionResult: 'rejected',
    callTime: '2026-04-10 11:30',
    createTime: '2026-04-10 11:30:00'
  }
]

export const aiCallRecordMock = createCrudMock<AICallRecord>(callRecordData, {
  idField: 'id',
  searchFields: ['operatorName', 'abilityName', 'targetEmployee'],
  sortField: 'callTime'
})

/**
 * 按编码获取能力
 */
export function getAbilityByCode(code: AIAbilityCode): AIAbility | undefined {
  return aiAbilityMock.getData().find((a) => a.code === code)
}

/** OKR 检查的预置结构化输出（Mock） */
const OKR_CHECK_SAMPLE_RESULT: OKRCheckResult = {
  smartScore: 2.0,
  dimensions: { S: 2, M: 1, A: 3, R: 2, T: 2 },
  issues: [
    { target: 'O', text: '目标"提升产品质量"过于笼统，缺少可度量的业务维度' },
    { target: 'KR1', text: '"加强测试"无量化指标，无法判断完成程度' },
    { target: 'KR2', text: '"修复 bug"未设定数量 / 时限，缺少边界' },
    { target: 'KR3', text: '"协助相关工作"偏 to-do 任务，不构成关键成果' }
  ],
  improvedDraft: {
    objective: 'Q2 内将产品线上缺陷率降低 40%',
    objectiveDescription: '通过测试覆盖率提升 + 缺陷复盘机制，系统性降低线上质量风险',
    keyResults: [
      {
        description: '上线后 72 小时内缺陷数从 35 个降至 20 个以内',
        type: 'numeric',
        startValue: '35',
        targetValue: '20',
        currentValue: '35',
        weight: 40
      },
      {
        description: '核心模块单元测试覆盖率从 65% 提升到 85%',
        type: 'numeric',
        startValue: '65%',
        targetValue: '85%',
        currentValue: '65%',
        weight: 35
      },
      {
        description: '建立缺陷复盘机制，每月输出 1 份分析报告',
        type: 'milestone',
        targetValue: '每月输出 1 份分析报告',
        currentValue: '未开始',
        weight: 25
      }
    ]
  }
}

/**
 * 评语优化 - 3 种风格的预置输出（严格不编造事实）
 *
 * 输入示例："张伟本季度表现还不错，完成了主要目标，但沟通方面需要加强"
 *
 * 注意：所有输出仅做"口语化→书面化、主观→客观"的语气切换，
 * 不允许出现输入里没有的具体数据（如"95%"、"QPS"、"3 个项目"）。
 *
 * 真接入 LLM 时通过 system prompt 约束 + 后处理校验保证此规则。
 */
const COMMENT_POLISH_TONE_SAMPLES: Record<string, string> = {
  professional: `张伟本季度整体表现良好，已达成本职核心目标。在沟通协作方面仍有提升空间，建议进一步加强主动同步与跨团队对齐。`,
  concise: `张伟本季度核心目标达成，沟通协作待加强。`,
  constructive: `张伟本季度整体表现良好，已达成核心目标，值得肯定。沟通协作方面仍有提升空间，期待下季度在跨团队主动同步上有更进一步的表现。`
}

/**
 * 智能简历解析的预置结构化输出（v8 升级 · 方案 3）
 *
 * 严格符合产品哲学：
 * - L1 字段全部来自简历真实文本（NER 抽取）
 * - 字段级 ✓ / ⚠️ 校验由规则层判断（不是 LLM 自评）
 * - L2 洞察基于 L1 字段做跨字段分析（非编造）
 * - **不包含"与岗位匹配度"** —— 归到 §3.7 智能简历匹配
 */
const RESUME_PARSE_SAMPLE_RESULT: ResumeParseResult = {
  basicInfo: {
    name: '张三',
    age: 28,
    gender: '男',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    location: '北京市朝阳区'
  },
  education: [
    {
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2014-09',
      endDate: '2018-06'
    }
  ],
  workExperience: [
    {
      company: '字节跳动',
      department: '抖音电商',
      position: '资深 Java 工程师',
      startDate: '2022-06',
      endDate: '至今',
      isCurrent: true,
      duration: '约 2 年',
      achievements: [
        '负责抖音电商订单中台的架构设计与核心模块研发，支撑日订单峰值 3000 万',
        '主导订单分库分表改造（16 → 64 分片），写入 TPS 从 5000 提升到 15000',
        '设计并实现幂等组件，覆盖 12 个核心业务场景，线上事故率下降 80%',
        '带 5 人小组，团队代码评审通过率 95%'
      ],
      keywords: ['订单中台', '分库分表', '高并发', '幂等', '团队管理']
    },
    {
      company: '阿里巴巴',
      department: '淘宝交易团队',
      position: 'Java 开发工程师',
      startDate: '2019-07',
      endDate: '2022-05',
      isCurrent: false,
      duration: '2 年 10 个月',
      achievements: [
        '参与淘宝交易系统重构，承担订单查询服务的优化（QPS 8000 → 25000）',
        '主导缓存改造项目，Redis 集群拆分降低 40% 响应时间',
        '推动单元测试覆盖率从 45% 提升到 80%'
      ],
      keywords: ['交易系统', '缓存优化', 'Redis', '单元测试']
    }
  ],
  projects: [
    {
      name: '抖音电商订单中台 v3',
      role: '技术负责人',
      duration: '2023.06-2024.03（9 个月）',
      teamSize: '8 人',
      output: '服务承接日订单 3000w+，P99 延迟从 280ms 降到 90ms',
      techStack: ['Java 17', 'Spring Boot 3', 'Kafka', 'Redis', 'MySQL', 'ShardingSphere']
    },
    {
      name: '淘宝订单查询服务优化',
      role: '核心开发',
      duration: '2021.03-2021.09（6 个月）',
      teamSize: '4 人',
      output: '查询 QPS 8000 → 25000，P99 < 150ms'
    }
  ],
  skills: {
    primary: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    secondary: ['ShardingSphere', 'Flink', 'Docker', 'K8s'],
    direction: ['分布式系统', '高并发', '电商交易', '订单中台']
  },
  expectedSalary: {
    monthly: '15~20K',
    package: '14 薪',
    estimatedAnnual: '约 21~28 万'
  },
  fieldChecks: [
    { field: '基本信息', status: 'ok' },
    { field: '教育经历', status: 'ok' },
    { field: '工作经历 1（字节跳动）', status: 'warning', reason: '"至今"未指定结束时间，请 HR 与候选人确认在职状态' },
    { field: '工作经历 2（阿里巴巴）', status: 'ok' },
    { field: '项目经历', status: 'ok' },
    { field: '技能', status: 'ok' },
    { field: '期望薪资', status: 'ok' }
  ],
  insights: {
    averageTenure: '约 2.5 年/段（2 段经历）',
    skillContext: [
      {
        skill: 'Java',
        duration: '5 年',
        scenarios: '主导抖音电商订单中台 · 参与淘宝交易系统重构'
      },
      {
        skill: '分库分表',
        scenarios: '订单 16 → 64 分片改造，写入 TPS 5000 → 15000'
      },
      {
        skill: 'Redis',
        scenarios: '淘宝缓存集群拆分，响应时间下降 40%'
      },
      {
        skill: 'Kafka',
        scenarios: '订单中台消息总线 · 日订单 3000w'
      },
      {
        skill: '高并发优化',
        scenarios: '查询接口 QPS 8000 → 25000，P99 < 150ms'
      }
    ],
    jobHopFrequency: 'normal',
    jobHopComment: '5 年内 2 段经历，平均在职 2.5 年，符合大厂技术岗位常态',
    industryFocus: '聚焦"互联网电商交易"领域，技术栈连续性强（订单/交易/分布式）',
    aiSummary:
      '5 年大厂电商订单系统经验，深耕高并发与分布式事务。从阿里到字节连续聚焦交易场景，技术栈一致且不断上探（QPS 优化 → 分库分表 → 团队带教）。简历主要风险：当前在职状态需确认；薪资期望（15~20K）相对资历偏低。'
  }
}

/**
 * 高风险员工预警 · v2 结构化样例输出
 *
 * 业界共识对齐（参考 Lattice Employee Health Score + Visier At Risk Score）：
 * - 单一预测目标：仅"未来 4~8 周内主动离职可能性"
 * - 信号源限定 HR 域已授权数据（OKR / 360 / 司龄 / 薪酬 / 汇报 / 出勤 / 晋升停滞）
 * - 给等级 + 信号变化清单（Variance）+ Key Drivers，HR 自己下结论
 * - AI 仅摆事实，不下子分类标签、不建议心理干预
 */
const RISK_ALERT_SAMPLE_RESULT: RiskAlertResult = {
  scope: '技术研发中心全员（共 48 人）',
  dataWindow: '近 8 周（2026-03-06 ~ 2026-04-30）',
  dataSources: [
    'OKR 系统（目标更新频率）',
    '360 评估系统（评分趋势）',
    '员工档案（司龄 / 汇报关系变更）',
    '薪酬系统（同岗位同级分位）',
    '出勤系统（请假频率）',
    '绩效历史（晋升停滞）'
  ],
  employees: [
    {
      employeeId: 1001,
      name: '张伟',
      department: '技术研发中心 - 后端组',
      level: 'P6',
      tenure: '3 年 8 个月',
      riskLevel: 'high',
      signalChanges: [
        {
          name: '360 协作评分',
          source: 'review_360',
          current: '3.7',
          baseline: '4.2',
          variance: '↓ 0.5（下降 12%）',
          window: '本季度 vs 历史 4 季均值',
          flag: 'concerning'
        },
        {
          name: 'OKR 更新频率',
          source: 'okr',
          current: '上次更新 2026-04-09',
          baseline: '过去平均每周 1 次',
          variance: '已 3 周无更新',
          window: '近 8 周',
          flag: 'concerning'
        },
        {
          name: '薪酬分位',
          source: 'salary',
          current: 'P25 分位',
          baseline: '同岗级中位 P50',
          variance: '低于中位（P50 = 28k，当前 22k）',
          window: '当前快照',
          flag: 'attention'
        },
        {
          name: '直属上级变更',
          source: 'reporting_change',
          current: '2026-02-15 调整',
          baseline: '前任上级在职 2.5 年',
          variance: '< 3 个月（适应期）',
          window: '近 3 个月',
          flag: 'attention'
        }
      ],
      keyDrivers: [
        '360 协作分本季显著下降',
        'OKR 已连续 3 周未更新',
        '薪酬低于同岗级中位'
      ],
      aiObservation:
        '近 8 周该员工 360 协作分由 4.2 降至 3.7，OKR 更新停滞 3 周，叠加薪酬低于同岗级中位（P25）。直属上级近期变更（2 月），处于汇报关系适应期。',
      followUpStatus: 'pending'
    },
    {
      employeeId: 1002,
      name: '李芳',
      department: '技术研发中心 - 前端组',
      level: 'P5',
      tenure: '4 年 2 个月',
      riskLevel: 'high',
      signalChanges: [
        {
          name: '晋升停滞',
          source: 'promotion_stagnation',
          current: '当前 P5',
          baseline: '同期入职平均已 P6',
          variance: '连续 3 个考核周期未晋升',
          window: '近 18 个月',
          flag: 'concerning'
        },
        {
          name: '360 评分趋势',
          source: 'review_360',
          current: '4.0',
          baseline: '4.3',
          variance: '↓ 0.3（连续 2 季下降）',
          window: '近 2 季 vs 历史均值',
          flag: 'attention'
        },
        {
          name: '请假频率',
          source: 'attendance',
          current: '近 4 周 3 次',
          baseline: '历史 4 周均值 0.5 次',
          variance: '↑ 6 倍',
          window: '近 4 周',
          flag: 'concerning'
        }
      ],
      keyDrivers: [
        '连续 3 个考核周期未晋升',
        '360 评分连续 2 季下降',
        '近期请假频率显著升高'
      ],
      aiObservation:
        '该员工 P5 司龄 4 年 2 个月，连续 3 个考核周期未晋升；近 2 季 360 评分由 4.3 降至 4.0；近 4 周请假频率较历史均值升高约 6 倍。',
      followUpStatus: 'pending'
    },
    {
      employeeId: 1003,
      name: '王磊',
      department: '技术研发中心 - 测试组',
      level: 'P4',
      tenure: '1 年 6 个月',
      riskLevel: 'medium',
      signalChanges: [
        {
          name: 'OKR 更新频率',
          source: 'okr',
          current: '上次更新 2026-04-22',
          baseline: '过去平均每周 1 次',
          variance: '近 1 周无更新',
          window: '近 4 周',
          flag: 'attention'
        },
        {
          name: '薪酬分位',
          source: 'salary',
          current: 'P30 分位',
          baseline: '同岗级中位 P50',
          variance: '低于中位（差距 8%）',
          window: '当前快照',
          flag: 'attention'
        }
      ],
      keyDrivers: ['OKR 更新有所减缓', '薪酬略低于同岗级中位'],
      aiObservation:
        '该员工 OKR 更新近 1 周停滞，薪酬分位 P30（低于同岗级中位 8%）。其他维度信号正常。',
      followUpStatus: 'pending'
    },
    {
      employeeId: 1004,
      name: '陈静',
      department: '技术研发中心 - 数据组',
      level: 'P6',
      tenure: '2 年 3 个月',
      riskLevel: 'medium',
      signalChanges: [
        {
          name: '直属上级变更',
          source: 'reporting_change',
          current: '2026-03-01 调整',
          baseline: '前任上级在职 1.8 年',
          variance: '< 3 个月（适应期）',
          window: '近 3 个月',
          flag: 'attention'
        },
        {
          name: '360 协作评分',
          source: 'review_360',
          current: '4.0',
          baseline: '4.2',
          variance: '↓ 0.2（轻微下降）',
          window: '本季 vs 上季',
          flag: 'attention'
        }
      ],
      keyDrivers: ['直属上级变更后处于适应期', '360 协作分轻微下降'],
      aiObservation:
        '该员工直属上级 3 月初调整，处于汇报关系适应期；本季 360 协作分由 4.2 降至 4.0。其他维度无明显异常。',
      followUpStatus: 'pending'
    },
    {
      employeeId: 1005,
      name: '刘敏',
      department: '技术研发中心 - 算法组',
      level: 'P7',
      tenure: '5 年 1 个月',
      riskLevel: 'low',
      signalChanges: [
        {
          name: '薪酬分位',
          source: 'salary',
          current: 'P40 分位',
          baseline: '同岗级中位 P50',
          variance: '略低于中位',
          window: '当前快照',
          flag: 'attention'
        }
      ],
      keyDrivers: ['薪酬略低于同岗级中位'],
      aiObservation:
        '该员工各维度信号整体正常；薪酬分位 P40 略低于同岗级中位。属于一般观察对象。',
      followUpStatus: 'pending'
    }
  ],
  meta: {
    totalScanned: 48,
    highRiskCount: 2,
    mediumRiskCount: 2,
    lowRiskCount: 1,
    snapshotTime: '2026-04-30 03:00:00',
    lastRecomputeReason: 'daily_03',
    nextScheduledRun: '2026-05-01 03:00:00'
  }
}

/**
 * 薪酬合理性检查 · v2 结构化样例输出
 *
 * 业界共识对齐（Workday Compensation + ChartHop + Pave）：
 * - 二元状态（不下"高/中/低"主观等级）
 * - compa-ratio + 分位定位（不暴露他人具体薪资）
 * - 数值倒挂事实陈述（不下"管理倒挂"判断）
 * - AI 一句话仅"翻译数据"，不建议 / 不推荐方案
 * - 数据来源全程标注
 */
const SALARY_SANITY_CHECK_SAMPLE_RESULT: SalarySanityCheckResult = {
  status: 'out_of_range',
  band: {
    min: 22000,
    mid: 26000,
    max: 30000,
    proposed: 32000,
    compaRatio: 1.23,
    outOfRange: true,
    source: '公司薪酬系统 · 前端 P5 带宽（更新 2026-Q1）'
  },
  peer: {
    peerCount: 12,
    proposedQuartile: 'Top',
    source: '公司薪酬系统 · 同岗级（前端 P5）在职员工分布'
  },
  inversion: {
    hasInversion: true,
    description: '提议薪资超出团队同岗 75 分位',
    source: '公司薪酬系统 · 直属团队同岗薪资分布'
  },
  aiObservation:
    '提议月薪 32k 超出前端 P5 带宽上限 30k 约 7%。Compa-Ratio 1.23（中位 26k）。同岗级 12 人中处于 Top 分位。'
}

/**
 * 模拟 AI 调用（Mock 环境直接返回预置样例，实际调用需要配置 AI 凭证）
 *
 * - okr_check：额外返回 structured 字段（OKRCheckResult）
 * - comment_polish：根据 input 中的 [tone:xxx] 标记返回不同风格的样例
 * - 其他能力：保持原文本输出
 */
export function mockInvokeAI(
  code: AIAbilityCode,
  input: string,
  operatorName: string,
  targetEmployee?: string
): {
  output: string
  recordId: number
  structured?:
    | OKRCheckResult
    | ResumeParseResult
    | RiskAlertResult
    | SalarySanityCheckResult
} {
  const ability = getAbilityByCode(code)
  if (!ability) throw new Error('AI 能力不存在')

  // Mock 环境：返回预置样例输出
  let output = ability.sampleOutput

  // 评语优化：根据 input 中的 [tone:xxx] 标记切换风格样例
  if (code === 'comment_polish') {
    const toneMatch = input.match(/\[tone:(professional|concise|constructive)\]/)
    const tone = toneMatch?.[1] || 'professional'
    output = COMMENT_POLISH_TONE_SAMPLES[tone] || COMMENT_POLISH_TONE_SAMPLES.professional
  }

  // OKR 检查 / 简历解析 / 风险预警 / 薪酬合理性检查 各自提供结构化输出
  let structured:
    | OKRCheckResult
    | ResumeParseResult
    | RiskAlertResult
    | SalarySanityCheckResult
    | undefined
  if (code === 'okr_check') structured = OKR_CHECK_SAMPLE_RESULT
  else if (code === 'resume_parse') structured = RESUME_PARSE_SAMPLE_RESULT
  else if (code === 'risk_alert') structured = RISK_ALERT_SAMPLE_RESULT
  else if (code === 'salary_sanity_check') structured = SALARY_SANITY_CHECK_SAMPLE_RESULT

  // 记录调用
  const record: Partial<AICallRecord> = {
    abilityCode: code,
    abilityName: ability.name,
    operatorName,
    operatorId: 9999,
    targetEmployee,
    inputSummary: input.slice(0, 100),
    outputSummary: output.slice(0, 100) + (output.length > 100 ? '...' : ''),
    adoptionResult: 'draft',
    callTime: new Date().toLocaleString('zh-CN')
  }
  const created = aiCallRecordMock.add(record as any)
  return { output, recordId: created.id, structured }
}

/**
 * 更新调用记录的采纳结果
 */
export function updateAdoption(
  recordId: number,
  result: 'adopted' | 'modified_adopted' | 'rejected',
  modificationDegree?: number
): AICallRecord {
  return aiCallRecordMock.update({
    id: recordId,
    adoptionResult: result,
    modificationDegree: modificationDegree || 0
  } as any)
}
