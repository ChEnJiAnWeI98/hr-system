// @ts-nocheck
/**
 * AI 智能匹配 Phase 5.1 Mock
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  AIMatchResult,
  MatchingRule,
  AIMatchStats,
  MatchRecommendLevel
} from '@/types/aiMatching'

/* ========== 匹配规则 ========== */
const initialRules: MatchingRule[] = [
  {
    id: 1,
    name: '技术研发岗 · 前端方向',
    jobFamily: '技术研发',
    dimensionWeights: { skill: 45, experience: 25, education: 10, location: 10, salary: 10 },
    coreSkills: ['Vue', 'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    bonusSkills: ['Vite', 'Webpack', 'Element Plus', 'Ant Design', 'Node.js'],
    excludeKeywords: [],
    strongMatchThreshold: 80,
    matchThreshold: 65,
    maybeThreshold: 50,
    status: 1,
    remark: '前端开发岗通用规则',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    name: '技术研发岗 · Java 方向',
    jobFamily: '技术研发',
    dimensionWeights: { skill: 50, experience: 30, education: 10, location: 5, salary: 5 },
    coreSkills: ['Java', 'Spring Boot', 'MyBatis', 'MySQL', 'Redis'],
    bonusSkills: ['Kafka', 'Spring Cloud', 'Docker', 'Kubernetes'],
    excludeKeywords: [],
    strongMatchThreshold: 82,
    matchThreshold: 68,
    maybeThreshold: 52,
    status: 1,
    remark: 'Java 后端规则，技能权重更高',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 3,
    name: '产品设计岗 · 通用',
    jobFamily: '产品设计',
    dimensionWeights: { skill: 30, experience: 35, education: 15, location: 10, salary: 10 },
    coreSkills: ['需求分析', '产品设计', 'Axure', '用户研究', 'B端产品', 'C端产品'],
    bonusSkills: ['数据分析', 'SQL', 'Figma', 'Sketch'],
    excludeKeywords: [],
    strongMatchThreshold: 78,
    matchThreshold: 62,
    maybeThreshold: 48,
    status: 1,
    remark: '产品经理通用规则，经验权重高',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 4,
    name: '管理岗 · 总监及以上',
    jobFamily: '管理岗位',
    dimensionWeights: { skill: 20, experience: 45, education: 15, location: 10, salary: 10 },
    coreSkills: ['团队管理', '战略规划', '跨部门协作', '项目管理'],
    bonusSkills: ['PMP', 'MBA'],
    excludeKeywords: [],
    strongMatchThreshold: 85,
    matchThreshold: 70,
    maybeThreshold: 55,
    status: 1,
    remark: '管理岗偏重经验',
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  }
]

export const matchingRuleCrudMock = createCrudMock<MatchingRule>(initialRules, {
  searchFields: ['name', 'jobFamily']
})

/* ========== 匹配历史记录 ========== */
const initialResults: AIMatchResult[] = [
  {
    id: 1,
    resumeId: 1,
    candidateName: '张三',
    jobId: 1,
    jobTitle: '前端开发工程师',
    department: '技术部',
    totalScore: 88,
    dimensionScores: { skill: 92, experience: 85, education: 90, location: 100, salary: 75 },
    matchedKeywords: ['Vue', 'TypeScript', 'Element Plus', 'Vite', 'JavaScript', 'HTML', 'CSS'],
    missedKeywords: ['React'],
    aiSuggestion: '候选人技术栈高度匹配，Vue + TypeScript + Element Plus 经验 5 年，强烈建议进入面试。薪资预期略高于职位范围，可沟通协调。',
    recommendLevel: 'strong_match',
    matchTime: '2026-04-18 10:30:00'
  },
  {
    id: 2,
    resumeId: 2,
    candidateName: '李四',
    jobId: 1,
    jobTitle: '前端开发工程师',
    department: '技术部',
    totalScore: 72,
    dimensionScores: { skill: 78, experience: 65, education: 80, location: 85, salary: 80 },
    matchedKeywords: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    missedKeywords: ['Vue', 'Element Plus', 'Vite'],
    aiSuggestion: '候选人 React 技术栈熟练但 Vue 经验较浅，需评估其转型意愿和学习能力。经验略低于要求（3 年 vs 要求 5 年），可作为备选。',
    recommendLevel: 'match',
    matchTime: '2026-04-18 10:32:00'
  },
  {
    id: 3,
    resumeId: 4,
    candidateName: '赵六',
    jobId: 1,
    jobTitle: '前端开发工程师',
    department: '技术部',
    totalScore: 48,
    dimensionScores: { skill: 35, experience: 50, education: 60, location: 70, salary: 60 },
    matchedKeywords: ['HTML', 'CSS'],
    missedKeywords: ['Vue', 'React', 'TypeScript', 'Vite', 'Element Plus'],
    aiSuggestion: '候选人主要经验为 UI 设计，前端开发经验较少，核心技能缺口较大，不建议推进。',
    recommendLevel: 'not_match',
    matchTime: '2026-04-18 10:35:00'
  },
  {
    id: 4,
    resumeId: 3,
    candidateName: '王五',
    jobId: 3,
    jobTitle: '产品经理',
    department: '产品部',
    totalScore: 82,
    dimensionScores: { skill: 78, experience: 88, education: 95, location: 80, salary: 70 },
    matchedKeywords: ['产品设计', '需求分析', '项目管理', 'B端产品', 'SaaS'],
    missedKeywords: ['数据分析'],
    aiSuggestion: 'B 端产品经验 6 年，从 0 到 1 做过 SaaS 产品，硕士学历匹配。建议进入面试，重点考察数据驱动能力。',
    recommendLevel: 'strong_match',
    matchTime: '2026-04-18 14:10:00'
  },
  {
    id: 5,
    resumeId: 2,
    candidateName: '李四',
    jobId: 2,
    jobTitle: 'Java后端工程师',
    department: '技术部',
    totalScore: 58,
    dimensionScores: { skill: 50, experience: 55, education: 80, location: 70, salary: 50 },
    matchedKeywords: ['JavaScript', 'MySQL'],
    missedKeywords: ['Java', 'Spring Boot', 'MyBatis', 'Redis'],
    aiSuggestion: '候选人主攻前端，后端经验不足，Java 核心技能缺失。暂不推荐。',
    recommendLevel: 'maybe',
    matchTime: '2026-04-19 09:20:00'
  }
]

export const aiMatchResultCrudMock = createCrudMock<AIMatchResult>(initialResults, {
  searchFields: ['candidateName', 'jobTitle']
})

/* ========== 批量匹配 Mock ========== */

/**
 * 确定性评分算法（根据 resumeId 和 jobId 组合生成固定分数，非随机）
 */
function calcDeterministicScore(resumeId: number, jobId: number, rule?: MatchingRule): AIMatchResult {
  const seed = (resumeId * 17 + jobId * 31) % 100
  const total = 45 + (seed % 45) + ((resumeId + jobId) % 10) // 45~100

  const skill = Math.min(100, Math.max(30, total + (seed % 10) - 5))
  const experience = Math.min(100, Math.max(30, total + ((seed + 3) % 10) - 5))
  const education = Math.min(100, Math.max(40, total + ((seed + 7) % 12) - 6))
  const location = Math.min(100, Math.max(50, total + ((seed + 11) % 8) - 4))
  const salary = Math.min(100, Math.max(40, total + ((seed + 13) % 12) - 6))

  const recommendLevel: MatchRecommendLevel =
    total >= (rule?.strongMatchThreshold || 80)
      ? 'strong_match'
      : total >= (rule?.matchThreshold || 65)
        ? 'match'
        : total >= (rule?.maybeThreshold || 50)
          ? 'maybe'
          : 'not_match'

  const coreSkills = rule?.coreSkills || ['Vue', 'TypeScript', 'JavaScript']
  const matchedCount = Math.floor((skill / 100) * coreSkills.length)
  const matchedKeywords = coreSkills.slice(0, matchedCount)
  const missedKeywords = coreSkills.slice(matchedCount)

  const suggestion =
    recommendLevel === 'strong_match'
      ? '候选人高度匹配岗位要求，核心技能全部命中，强烈推荐进入面试。'
      : recommendLevel === 'match'
        ? '候选人技能基本匹配，可推进面试，建议重点考察缺失的关键能力。'
        : recommendLevel === 'maybe'
          ? '候选人部分维度匹配度一般，可作为备选或关注是否有快速学习能力。'
          : '候选人核心技能缺口较大，不建议推进。'

  return {
    id: 0, // 由上层分配
    resumeId,
    candidateName: '',
    jobId,
    jobTitle: '',
    department: '',
    totalScore: total,
    dimensionScores: { skill, experience, education, location, salary },
    matchedKeywords,
    missedKeywords,
    aiSuggestion: suggestion,
    recommendLevel,
    matchTime: new Date().toLocaleString('zh-CN')
  }
}

/**
 * 批量匹配 Mock
 */
export function batchMatchMock(
  jobId: number,
  jobTitle: string,
  department: string,
  resumes: Array<{ id: number; candidateName: string }>,
  ruleId?: number
): AIMatchResult[] {
  const rule = ruleId ? matchingRuleCrudMock.getDetail(ruleId) : undefined
  const data = aiMatchResultCrudMock.getData()
  let nextId = Math.max(...data.map((r) => r.id), 0) + 1

  const results: AIMatchResult[] = []
  for (const resume of resumes) {
    const result = calcDeterministicScore(resume.id, jobId, rule || undefined)
    result.id = nextId++
    result.candidateName = resume.candidateName
    result.jobTitle = jobTitle
    result.department = department
    results.push(result)
    data.push(result)
  }
  return results.sort((a, b) => b.totalScore - a.totalScore)
}

/**
 * 单简历推荐职位 Mock
 */
export function recommendJobsMock(
  resumeId: number,
  candidateName: string,
  jobs: Array<{ id: number; title: string; department: string }>,
  ruleId?: number
): AIMatchResult[] {
  const rule = ruleId ? matchingRuleCrudMock.getDetail(ruleId) : undefined
  const data = aiMatchResultCrudMock.getData()
  let nextId = Math.max(...data.map((r) => r.id), 0) + 1

  const results: AIMatchResult[] = []
  for (const job of jobs) {
    const result = calcDeterministicScore(resumeId, job.id, rule || undefined)
    result.id = nextId++
    result.resumeId = resumeId
    result.candidateName = candidateName
    result.jobTitle = job.title
    result.department = job.department
    results.push(result)
    data.push(result)
  }
  return results.sort((a, b) => b.totalScore - a.totalScore)
}

/**
 * 统计 Mock
 */
export function getMatchStatsMock(): AIMatchStats {
  const data = aiMatchResultCrudMock.getData()
  const totalMatches = data.length
  const strongMatchCount = data.filter((r) => r.recommendLevel === 'strong_match').length
  const matchCount = data.filter((r) => r.recommendLevel === 'match').length
  const maybeCount = data.filter((r) => r.recommendLevel === 'maybe').length
  const notMatchCount = data.filter((r) => r.recommendLevel === 'not_match').length
  const avgScore =
    totalMatches > 0
      ? Number((data.reduce((sum, r) => sum + r.totalScore, 0) / totalMatches).toFixed(1))
      : 0
  return { totalMatches, strongMatchCount, matchCount, maybeCount, notMatchCount, avgScore }
}
