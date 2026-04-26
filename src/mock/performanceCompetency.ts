/**
 * 能力模型 Mock 数据（Phase C1a）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Competency, CompetencyLevelDesc } from '@/types/performanceCompetency'

/** 构造 5 级描述 */
const levels = (behaviors: [string, string, string, string, string]): CompetencyLevelDesc[] => {
  const names = ['入门', '基础', '熟练', '精通', '专家']
  return behaviors.map((b, idx) => ({
    level: (idx + 1) as 1 | 2 | 3 | 4 | 5,
    levelName: names[idx],
    behavior: b
  }))
}

/** 预置能力数据（固定数据） */
const initialData: Competency[] = [
  // ========== 通用能力 ==========
  {
    id: 1,
    competencyCode: 'C-GEN-001',
    competencyName: '沟通表达',
    category: 'general',
    jobFamilies: ['技术研发', '产品设计', '运营市场', '销售岗位', '职能支持', '管理岗位'],
    description: '能够准确理解他人诉求，并清晰地表达自己的观点，促成有效协作',
    levels: levels([
      '能够清楚表达自己的想法，听懂他人的基本意思',
      '能够主动倾听、理解他人观点，口头/书面表达结构清晰',
      '能够针对不同受众调整沟通方式，善于提问澄清',
      '能够在复杂冲突场景下引导对话、达成共识',
      '能够面向行业/公司级场合进行演讲、谈判，推动跨组织协同'
    ]),
    status: 1,
    sortOrder: 1,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 2,
    competencyCode: 'C-GEN-002',
    competencyName: '问题分析',
    category: 'general',
    jobFamilies: ['技术研发', '产品设计', '运营市场', '销售岗位', '职能支持', '管理岗位'],
    description: '能够识别问题本质，拆解复杂问题并找到可行解决方案',
    levels: levels([
      '能识别简单问题并提出基础解决方法',
      '能用常见方法拆解问题，结构化分析原因',
      '能运用多种分析框架，从多维度定位根因',
      '能处理高度不确定的复杂问题，设计系统性解决方案',
      '能面对业界级难题，创造性地提出突破性方法论'
    ]),
    status: 1,
    sortOrder: 2,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 3,
    competencyCode: 'C-GEN-003',
    competencyName: '学习成长',
    category: 'general',
    jobFamilies: ['技术研发', '产品设计', '运营市场', '销售岗位', '职能支持', '管理岗位'],
    description: '持续学习和自我提升的意愿及能力',
    levels: levels([
      '能按要求完成工作中的基础学习任务',
      '主动学习新知识，能快速上手新工具/方法',
      '能系统性构建知识体系，迁移应用到新场景',
      '能预判行业趋势提前储备关键能力',
      '能形成独到的方法论并影响团队/行业'
    ]),
    status: 1,
    sortOrder: 3,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 4,
    competencyCode: 'C-GEN-004',
    competencyName: '团队协作',
    category: 'general',
    jobFamilies: ['技术研发', '产品设计', '运营市场', '销售岗位', '职能支持', '管理岗位'],
    description: '与他人高效合作，形成团队合力',
    levels: levels([
      '能按团队要求完成自己的工作',
      '主动配合同事，愿意分享信息和资源',
      '能主动协调多方资源，促进跨职能协作',
      '能识别并化解团队内部矛盾，营造正向氛围',
      '能打破跨组织壁垒，形成高效大团队运作模式'
    ]),
    status: 1,
    sortOrder: 4,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 5,
    competencyCode: 'C-GEN-005',
    competencyName: '结果导向',
    category: 'general',
    jobFamilies: ['技术研发', '产品设计', '运营市场', '销售岗位', '职能支持', '管理岗位'],
    description: '以交付成果为目标，克服困难达成业绩',
    levels: levels([
      '能完成被指派的任务',
      '主动关注目标进度，遇到问题会求助',
      '能自驱设定阶段目标，克服困难达成结果',
      '能在资源受限情况下保质保量交付',
      '能持续超越目标，带动团队整体业绩提升'
    ]),
    status: 1,
    sortOrder: 5,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },

  // ========== 专业能力（技术） ==========
  {
    id: 6,
    competencyCode: 'C-TECH-001',
    competencyName: '技术深度',
    category: 'professional',
    jobFamilies: ['技术研发'],
    description: '对所在技术领域的理解深度',
    levels: levels([
      '掌握基础语法和常用 API，能完成简单功能',
      '熟悉常用框架原理，能独立开发中等复杂度模块',
      '深入理解底层机制，能做性能优化和疑难问题排查',
      '能设计领域内的技术方案，解决高复杂度难题',
      '具备行业级技术影响力，主导核心架构和技术标准'
    ]),
    status: 1,
    sortOrder: 10,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 7,
    competencyCode: 'C-TECH-002',
    competencyName: '架构能力',
    category: 'professional',
    jobFamilies: ['技术研发'],
    description: '系统设计和架构规划能力',
    levels: levels([
      '能在既定架构下完成模块开发',
      '能设计中小型系统的模块划分',
      '能独立完成复杂业务系统的架构设计',
      '能做大型分布式系统的架构决策，平衡多方 trade-off',
      '能面向 10 年演进做技术战略规划'
    ]),
    status: 1,
    sortOrder: 11,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 8,
    competencyCode: 'C-TECH-003',
    competencyName: '工程质量',
    category: 'professional',
    jobFamilies: ['技术研发'],
    description: '代码质量、测试、稳定性保障能力',
    levels: levels([
      '代码能通过基本的 Code Review',
      '能写清晰易维护的代码，有一定测试覆盖',
      '能主导模块的代码质量标准，建立完善测试体系',
      '能构建工程效能体系，提升团队整体质量',
      '能制定公司级质量规范，引领工程文化'
    ]),
    status: 1,
    sortOrder: 12,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },

  // ========== 专业能力（产品） ==========
  {
    id: 9,
    competencyCode: 'C-PROD-001',
    competencyName: '需求洞察',
    category: 'professional',
    jobFamilies: ['产品设计'],
    description: '挖掘和理解用户/业务需求的能力',
    levels: levels([
      '能准确记录和整理既有需求',
      '能通过访谈/调研发掘显性需求',
      '能识别隐性需求和真实痛点',
      '能洞察行业趋势，预判未来需求',
      '能定义新品类/新市场机会'
    ]),
    status: 1,
    sortOrder: 20,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 10,
    competencyCode: 'C-PROD-002',
    competencyName: '产品规划',
    category: 'professional',
    jobFamilies: ['产品设计'],
    description: '产品路线图设计和优先级排期能力',
    levels: levels([
      '能按需求执行具体功能设计',
      '能规划单一功能模块的版本演进',
      '能设计完整产品的路线图和优先级',
      '能做多产品矩阵的战略规划',
      '能制定公司级产品战略'
    ]),
    status: 1,
    sortOrder: 21,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 11,
    competencyCode: 'C-PROD-003',
    competencyName: '数据分析',
    category: 'professional',
    jobFamilies: ['产品设计', '运营市场'],
    description: '基于数据做判断和决策的能力',
    levels: levels([
      '能看懂常规数据报表',
      '能用基础方法分析数据得出结论',
      '能搭建数据指标体系，指导业务决策',
      '能做复杂数据建模和异常识别',
      '能建立数据驱动的决策文化'
    ]),
    status: 1,
    sortOrder: 22,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },

  // ========== 管理能力 ==========
  {
    id: 12,
    competencyCode: 'C-MGMT-001',
    competencyName: '战略思维',
    category: 'management',
    jobFamilies: ['管理岗位'],
    description: '从全局视角制定和推动战略的能力',
    levels: levels([
      '能理解公司/部门战略意图',
      '能将战略转化为本团队的目标',
      '能结合外部环境制定部门级战略',
      '能推动跨部门战略协同',
      '能参与/制定公司级战略决策'
    ]),
    status: 1,
    sortOrder: 30,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 13,
    competencyCode: 'C-MGMT-002',
    competencyName: '团队建设',
    category: 'management',
    jobFamilies: ['管理岗位'],
    description: '组建、培养和激励团队的能力',
    levels: levels([
      '能完成团队日常管理事务',
      '能搭建 5~10 人稳定团队',
      '能打造高绩效团队，人员留存率优秀',
      '能建设 50+ 人规模的组织体系',
      '能构建支撑公司战略的组织文化'
    ]),
    status: 1,
    sortOrder: 31,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 14,
    competencyCode: 'C-MGMT-003',
    competencyName: '人才培养',
    category: 'management',
    jobFamilies: ['管理岗位'],
    description: '识别、培养和发展人才的能力',
    levels: levels([
      '能对下属进行基本的工作指导',
      '能为下属制定个人发展计划',
      '能培养独立承担职责的骨干',
      '能批量培养出能独当一面的 Leader',
      '能孵化出高管级别的继任者'
    ]),
    status: 1,
    sortOrder: 32,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 15,
    competencyCode: 'C-MGMT-004',
    competencyName: '决策判断',
    category: 'management',
    jobFamilies: ['管理岗位'],
    description: '在复杂场景下做出正确决策的能力',
    levels: levels([
      '能处理常规明确的决策',
      '能在信息充分时做出合理决策',
      '能在信息不足时快速做判断并承担结果',
      '能在高风险高不确定场景下做重大决策',
      '能通过决策系统性塑造组织未来'
    ]),
    status: 1,
    sortOrder: 33,
    createdBy: '系统预置',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  }
]

/** 导出 Mock 实例 */
export const competencyMock = createCrudMock<Competency>(initialData, {
  idField: 'id',
  searchFields: ['competencyName', 'competencyCode', 'description'],
  sortField: 'sortOrder'
})

/** 按岗位族查询能力 */
export function getCompetenciesByJobFamily(jobFamily: string): Competency[] {
  return competencyMock.getData().filter(
    (c) => c.status === 1 && (c.jobFamilies.includes(jobFamily) || c.jobFamilies.length === 0)
  )
}

/**
 * 获取员工能力评估数据（用于雷达图演示）
 * 基于员工 ID 种子生成确定性分数
 */
export function getEmployeeCompetencyScore(
  employeeId: number | string,
  competencyIds: number[]
): Array<{ competencyId: number; competencyName: string; score: number; targetLevel: number }> {
  const data = competencyMock.getData()
  const seed = Number(employeeId) || 1
  return competencyIds.map((cid) => {
    const item = data.find((c) => c.id === cid)
    // 确定性打分：基于员工种子 + 能力 ID 生成 3.0~4.8 之间的分数
    const raw = ((seed * 7 + cid * 13) % 19) / 10 + 3.0
    return {
      competencyId: cid,
      competencyName: item?.competencyName || '',
      score: Number(raw.toFixed(1)),
      targetLevel: 4 // 目标等级固定为 4（精通）
    }
  })
}
