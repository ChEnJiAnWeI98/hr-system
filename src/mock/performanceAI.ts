/**
 * AI 辅助 Mock 数据（Phase C3）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { AIAbility, AICallRecord, AIAbilityCode } from '@/types/performanceAI'

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
    name: '面谈提纲生成',
    icon: '📝',
    description: '基于员工近期目标进度、360 反馈、上次面谈纪要生成讨论要点',
    useCase: '1on1 / 季度面谈 / PIP 月度评估前，管理者快速准备讨论要点',
    maturity: 'stable',
    status: 1,
    sampleInput: `员工：张伟（P6 后端工程师）\n本季度目标：3 个 OKR，完成率 65%\n360 评价：技术扎实，但协作维度分数有下降趋势\n上次面谈：3 个月前，讨论过跨团队沟通问题`,
    sampleOutput: `建议讨论要点（按优先级）：\n\n1. 目标进度（重点）\n   - KR2 进度仅 40%，了解具体卡点\n   - 是否需要调整 KR 范围或寻求跨组支持\n\n2. 协作反馈（敏感话题）\n   - 最近 360 评价中协作分下降 0.5 分，询问是否有特定场景\n   - 对比上次面谈，跨团队沟通是否有新的困扰\n\n3. 成长诉求\n   - 技术深度已达 P6 水平，了解是否对 P7 通道有规划\n   - 架构能力这一项是否有想探索的方向\n\n4. 支持需求\n   - 当前工作是否需要资源/培训/辅导支持`
  },
  {
    id: 3,
    code: 'risk_alert',
    name: '高风险员工预警',
    icon: '⚠️',
    description: '基于多维度信号（目标进度、360 分趋势、协作活跃度）识别潜在风险',
    useCase: 'HR / 管理者主动发现离职、绩效下滑、心理异常等风险员工',
    maturity: 'beta',
    status: 1,
    sampleInput: `输入范围：技术研发中心全员，近 8 周数据`,
    sampleOutput: `识别到 3 位高风险员工：\n\n⚠️ 张某（高风险，离职倾向）\n  信号：• 目标更新连续 3 周停滞\n        • 360 评价协作分下降 2 档\n        • 加班时长下降 60%\n  建议：尽快 1on1 面谈了解状态\n\n⚠️ 李某（中风险，绩效下滑）\n  信号：• 近 2 周目标进度倒退\n        • 两个 KR 完成率已低于预期 20%\n        • 但 360 评价无异常\n  建议：协助梳理目标优先级，提供资源支持\n\n⚠️ 王某（中风险，心理波动）\n  信号：• 内部沟通活跃度大幅下降\n        • 近期请假频率异常\n        • 360 自评与他评差异显著\n  建议：HRBP 介入关怀，必要时引入 EAP`
  },
  {
    id: 4,
    code: 'feedback_rewrite',
    name: '反馈改写',
    icon: '✍️',
    description: '将粗糙/尖锐的 360 评价改写为基于 SBI 模型的建设性反馈',
    useCase: '同事互评、直属上级评价时转换表达方式，避免攻击性或零信息反馈',
    maturity: 'stable',
    status: 1,
    sampleInput: `原始反馈：他太被动，推进不了事情，经常要别人催`,
    sampleOutput: `SBI 结构化版本：\n\n情境（Situation）：在 Q1 支付网关重构项目中\n\n行为（Behavior）：在需要跨组推进的关键节点（如 API 规范对齐、压测协调），他较少主动牵头联系，多数情况是其他同事或我去跟进\n\n影响（Impact）：导致 2 个关键节点延期各 2~3 天，下游团队对协作体验有微词\n\n改进建议：未来类似跨组任务，希望能主动拉会、主动发同步周报。如果推进中遇到卡点，可以更早同步，以便团队一起想办法`
  },
  {
    id: 5,
    code: 'comment_polish',
    name: '评语优化',
    icon: '📋',
    description: '基于管理者的评语初稿进行优化：补充事实依据、调整表达、转 SBI 结构',
    useCase: '绩效评估完成后，管理者已写好评语初稿，由 AI 辅助打磨',
    maturity: 'stable',
    status: 1,
    sampleInput: `初稿：张伟本季度表现还不错，完成了主要目标，但沟通方面需要加强`,
    sampleOutput: `优化版本（保留管理者原意，补充事实并转 SBI）：\n\n张伟本季度核心目标达成率 95%，其中主导的缓存架构升级项目（KR1）超额 15% 完成，QPS 从 2000 提升到 2800，给业务带来明显价值。\n\n沟通协作方面有提升空间：Q1 跨团队协作的 3 个关键项目中，有 2 次在推进卡点时未及时同步到相关方，导致下游团队被动等待。建议在 Q2 养成"每周跨组同步会 + 日清周报"的节奏。\n\n综合评估：核心业绩突出，协作习惯需打磨，总体符合 P6 水平并具备向 P7 冲刺的技术底子。\n\n—— AI 辅助优化，请管理者确认后提交`
  },
  {
    id: 6,
    code: 'resume_parse',
    name: '智能简历解析',
    icon: '📄',
    description: '从 PDF / Word / 粘贴文本中抽取结构化字段（姓名、学历、工作经历、技能、期望薪资）',
    useCase: '招聘场景：候选人投递后批量解析入库 / HR 初筛时快速预览 / 与 JD 匹配度打分',
    maturity: 'stable',
    status: 1,
    sampleInput: `姓名：陈某\n出生：1993.08\n学历：硕士，清华大学 计算机科学与技术（2015-2018）\n工作经历：\n  2018.07-2022.03  字节跳动  资深后端工程师\n    · 负责抖音服务端中台架构设计，支撑 DAU 3 亿\n    · 主导推荐系统改造，QPS 峰值 20w+，P99 < 50ms\n  2022.04-至今  美团  后端技术专家\n    · 外卖交易核心链路负责人，日订单 7000w\n技能：Golang、MySQL、Redis、Kafka、K8s、分布式系统设计\n期望薪资：月薪 50~65k，year 18`,
    sampleOutput: `解析结果（置信度 92%）：\n\n【基本信息】\n  姓名：陈某\n  出生：1993-08（32 岁）\n  最高学历：硕士\n  毕业院校：清华大学\n  专业：计算机科学与技术\n  毕业年份：2018\n\n【工作经历】（共 2 段，7 年）\n  1. 字节跳动  资深后端工程师  2018-07 ~ 2022-03（3 年 8 个月）\n     关键词：抖音、后端中台、推荐系统、高并发\n  2. 美团  后端技术专家  2022-04 ~ 至今（3 年 1 个月）\n     关键词：外卖交易、核心链路、日千万订单\n\n【技能标签】\n  后端：Golang ▲ MySQL ▲ Redis ▲ Kafka ▲ K8s ▲\n  方向：分布式系统设计、高并发、交易系统\n\n【期望薪资】\n  月薪：50k ~ 65k\n  年包：18 薪\n  估算年薪：¥108 万 ~ ¥140 万\n\n【与岗位匹配度分析】（目标岗位：高级后端 P7）\n  技能匹配：9.1 / 10\n  司龄匹配：8.5 / 10（7 年经验，略超 P7 中位）\n  薪酬匹配：⚠️ 期望薪资位于本公司 P7 带宽上 25% 分位，建议协商\n\n—— AI 解析结果仅供参考，HR 需人工复核关键字段后导入候选人库`
  },
  {
    id: 7,
    code: 'salary_sanity_check',
    name: '薪酬合理性检查',
    icon: '💰',
    description: '针对定薪 / 调薪方案进行合理性诊断：带宽位置、同岗对标、倒挂风险、调整建议',
    useCase: '招聘 offer 定薪前 / HR 发起调薪申请前 / 审批人决策参考',
    maturity: 'beta',
    status: 1,
    sampleInput: `员工：李某（P5 前端工程师，司龄 3.2 年，当前月薪 25k）\n调整方案：调薪至 月薪 32k（涨幅 28%）\n调整原因：本年度绩效 S 档，主导完成 2 个核心项目`,
    sampleOutput: `合理性诊断：⚠️ 偏高，建议调整\n\n【带宽分析】\n  当前岗位：前端 P5，公司带宽 22k ~ 30k（P50=26k）\n  调整后薪资：32k\n  ➜ 已超出 P5 带宽上限 7%，需升级到 P6 带宽才能容纳\n\n【同岗位对标】\n  同岗级（P5 前端）在职员工 12 人，薪资区间 22k ~ 29k\n  调整后将成为全公司 P5 前端最高薪（高出第二名 10%）\n\n【倒挂风险】\n  ⚠️ 该员工直属 Leader 为 P6，月薪 30k\n  调整后员工薪资（32k）> Leader 薪资（30k），构成管理倒挂\n\n【调整建议】（按优先级）\n  方案 A（推荐）：同步晋升 P5→P6，薪资调至 30k（P6 下限）\n    - 业绩优秀 + 晋升通道齐走，组织内逻辑自洽\n    - 年度调薪 20%，仍在合理激励区间\n  方案 B：保留 P5，薪资调至 29k（P5 带宽上限）\n    - 待下半年晋升 P6 再做二次调整\n  方案 C（当前方案）：保留 P5，直接给 32k\n    - 风险：打破带宽设计、引发 Leader 倒挂、影响内部公平性\n    - 仅在"特殊保留人才 + 高管特批"场景考虑\n\n—— AI 诊断结果仅供参考，最终方案需薪酬委员会审定`
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
      '张伟本季度核心目标达成率 95%，主导缓存架构升级超额 15% 完成...沟通协作方面建议养成"每周跨组同步会+日清周报"节奏...',
    adoptionResult: 'modified_adopted',
    modificationDegree: 15,
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
    abilityName: '面谈提纲生成',
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
    inputSummary: '范围：全司近 8 周',
    outputSummary: '识别 5 位高风险员工（离职倾向 2 / 绩效下滑 2 / 心理波动 1）',
    adoptionResult: 'adopted',
    modificationDegree: 0,
    callTime: '2026-04-14 09:00',
    createTime: '2026-04-14 09:00:00'
  },
  {
    id: 5,
    abilityCode: 'feedback_rewrite',
    abilityName: '反馈改写',
    operatorName: '赵静',
    operatorId: 1004,
    inputSummary: '原始：他总是拖延交付',
    outputSummary: 'SBI 版本：情境-Q1 支付重构中 / 行为-关键节点延期 / 影响-下游等待...',
    adoptionResult: 'modified_adopted',
    modificationDegree: 30,
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

/**
 * 模拟 AI 调用（Mock 环境直接返回预置样例，实际调用需要配置 AI 凭证）
 */
export function mockInvokeAI(
  code: AIAbilityCode,
  input: string,
  operatorName: string,
  targetEmployee?: string
): { output: string; recordId: number } {
  const ability = getAbilityByCode(code)
  if (!ability) throw new Error('AI 能力不存在')

  // Mock 环境：返回预置样例输出
  const output = ability.sampleOutput

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
  return { output, recordId: created.id }
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
