// @ts-nocheck
/**
 * NPS 候选人满意度 Phase 5.9 Mock
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  NPSTemplate,
  NPSSurvey,
  NPSStats,
  NPSImprovement,
  NPSStage
} from '@/types/nps'
import { calcNPSCategory, calcNPSScore } from '@/types/nps'

/* ========== 调研模板 ========== */
const initialTemplates: NPSTemplate[] = [
  {
    id: 1,
    stage: 'post_apply',
    name: '投递后体验调研',
    title: '感谢您投递我们的职位',
    subtitle: '希望了解您对我们招聘流程的第一印象，帮助我们持续改进',
    questions: [
      {
        id: 1,
        type: 'score',
        title: '请为您的投递体验打分（0-10 分）',
        required: true
      },
      {
        id: 2,
        type: 'single_choice',
        title: '您是如何了解到此职位的？',
        required: false,
        options: ['官方招聘网站', 'Boss 直聘', '猎聘', '内推', '朋友推荐', '其他']
      },
      {
        id: 3,
        type: 'text',
        title: '您对我们的投递体验有什么建议？',
        required: false,
        placeholder: '如网站访问速度、职位描述清晰度等'
      }
    ],
    enabled: 1,
    triggerDelayDays: 3,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    stage: 'post_interview',
    name: '面试体验调研',
    title: '感谢您参与我们的面试',
    subtitle: '您的反馈将帮助我们打造更好的面试体验',
    questions: [
      {
        id: 1,
        type: 'score',
        title: '请为本次面试体验打分（0-10 分）',
        required: true
      },
      {
        id: 2,
        type: 'multi_choice',
        title: '哪些方面给您留下了深刻印象？（可多选）',
        required: false,
        options: ['HR 响应及时', '面试官专业', '问题有深度', '环境舒适', '流程顺畅', '公司介绍清晰']
      },
      {
        id: 3,
        type: 'multi_choice',
        title: '有哪些方面可以改进？（可多选）',
        required: false,
        options: ['HR 响应不及时', '面试时间长', '问题重复', '面试官态度', '环境不佳', '其他']
      },
      {
        id: 4,
        type: 'text',
        title: '其他建议或反馈',
        required: false
      }
    ],
    enabled: 1,
    triggerDelayDays: 1,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  },
  {
    id: 3,
    stage: 'post_onboard',
    name: '入职一周回访',
    title: '欢迎加入，入职一周感受如何？',
    subtitle: '您的反馈将帮助我们优化入职流程和员工关怀',
    questions: [
      {
        id: 1,
        type: 'score',
        title: '请为您的入职体验打分（0-10 分）',
        required: true
      },
      {
        id: 2,
        type: 'multi_choice',
        title: '入职流程中哪些环节让您感到顺畅？',
        required: false,
        options: ['资料填报便捷', 'HR 对接及时', '设备账号就位', '工位准备充分', '入职培训清晰', '同事欢迎到位']
      },
      {
        id: 3,
        type: 'multi_choice',
        title: '哪些环节还可以改善？',
        required: false,
        options: ['资料清单不清晰', 'HR 响应慢', '设备账号延迟', '工位混乱', '培训流于形式', '缺少导师对接']
      },
      {
        id: 4,
        type: 'text',
        title: '您对入职流程的其他建议'
      }
    ],
    enabled: 1,
    triggerDelayDays: 7,
    createTime: '2026-01-01 09:00:00',
    updateTime: '2026-01-01 09:00:00'
  }
]

export const npsTemplateCrudMock = createCrudMock<NPSTemplate>(initialTemplates, {
  searchFields: ['name', 'title']
})

/* ========== 调研回复 ========== */
const initialSurveys: NPSSurvey[] = [
  {
    id: 1,
    stage: 'post_apply',
    templateId: 1,
    candidateName: '张三',
    candidateId: 1,
    phone: '13800138001',
    position: '前端开发工程师',
    department: '技术部',
    score: 9,
    category: 'promoter',
    feedback: '投递流程很流畅，职位描述清晰，HR 响应也很快',
    tags: ['流程顺畅', 'HR 响应快', '描述清晰'],
    answers: { 1: 9, 2: 'Boss 直聘', 3: '投递流程很流畅...' },
    surveyTime: '2026-04-05 14:00:00',
    createTime: '2026-04-05 14:00:00'
  },
  {
    id: 2,
    stage: 'post_interview',
    templateId: 2,
    candidateName: '张三',
    candidateId: 1,
    phone: '13800138001',
    position: '前端开发工程师',
    department: '技术部',
    score: 10,
    category: 'promoter',
    feedback: '面试官非常专业，技术题有深度，整体体验非常好，期待加入',
    tags: ['面试官专业', '问题有深度', '流程顺畅'],
    answers: { 1: 10, 2: ['面试官专业', '问题有深度', '流程顺畅'], 3: [], 4: '...' },
    surveyTime: '2026-04-12 16:00:00',
    createTime: '2026-04-12 16:00:00'
  },
  {
    id: 3,
    stage: 'post_interview',
    templateId: 2,
    candidateName: '李四',
    candidateId: 2,
    phone: '13800138002',
    position: 'Java后端工程师',
    department: '技术部',
    score: 6,
    category: 'detractor',
    feedback: '面试等了 20 分钟才开始，面试官问题和职位要求有些脱节，体验一般',
    tags: ['HR 响应不及时', '问题重复'],
    answers: { 1: 6, 3: ['HR 响应不及时', '问题重复'], 4: '建议面试前确认面试官是否到位' },
    surveyTime: '2026-04-15 10:30:00',
    createTime: '2026-04-15 10:30:00'
  },
  {
    id: 4,
    stage: 'post_onboard',
    templateId: 3,
    candidateName: '陈静',
    candidateId: 4,
    phone: '13800138004',
    position: '产品经理',
    department: '产品部',
    score: 10,
    category: 'promoter',
    feedback: '入职流程非常顺畅，设备工位账号都提前就位，导师也在第一天就对接了，体验超出预期',
    tags: ['资料填报便捷', '设备账号就位', '工位准备充分', '导师对接及时'],
    answers: { 1: 10, 2: ['资料填报便捷', '设备账号就位', '工位准备充分', '导师对接及时'] },
    surveyTime: '2026-04-15 18:00:00',
    createTime: '2026-04-15 18:00:00'
  },
  {
    id: 5,
    stage: 'post_apply',
    templateId: 1,
    candidateName: '赵六',
    candidateId: 4,
    phone: '13800138004',
    position: 'UI设计师',
    department: '设计部',
    score: 7,
    category: 'passive',
    feedback: '职位描述还算清楚，但投递后 3 天才有回复，等待时间有点长',
    tags: ['HR 响应慢'],
    answers: { 1: 7, 2: '猎聘', 3: '希望投递响应能更及时一些' },
    surveyTime: '2026-04-10 09:00:00',
    createTime: '2026-04-10 09:00:00'
  },
  {
    id: 6,
    stage: 'post_interview',
    templateId: 2,
    candidateName: '王五',
    candidateId: 3,
    phone: '13800138003',
    position: '产品经理',
    department: '产品部',
    score: 9,
    category: 'promoter',
    feedback: '面试官对 B 端产品很了解，沟通很专业，整个流程 1 小时结束，效率很高',
    tags: ['面试官专业', '流程顺畅', '公司介绍清晰'],
    answers: { 1: 9, 2: ['面试官专业', '流程顺畅', '公司介绍清晰'], 3: [], 4: '' },
    surveyTime: '2026-04-16 17:00:00',
    createTime: '2026-04-16 17:00:00'
  },
  {
    id: 7,
    stage: 'post_interview',
    templateId: 2,
    candidateName: '孙七',
    candidateId: 5,
    phone: '13800138005',
    position: '测试工程师',
    department: '技术部',
    score: 5,
    category: 'detractor',
    feedback: '面试被临时取消两次，HR 沟通也不积极，体验不好',
    tags: ['HR 响应不及时', '面试时间长'],
    answers: { 1: 5, 3: ['HR 响应不及时'], 4: '希望面试安排能更稳定些' },
    surveyTime: '2026-04-18 11:00:00',
    createTime: '2026-04-18 11:00:00'
  },
  {
    id: 8,
    stage: 'post_onboard',
    templateId: 3,
    candidateName: '冯十三',
    candidateId: 9,
    phone: '13900139006',
    position: 'Java后端工程师',
    department: '技术部',
    score: 8,
    category: 'passive',
    feedback: '整体还不错，就是入职第一天设备还没完全配齐，耽误了半天',
    tags: ['设备账号延迟'],
    answers: { 1: 8, 3: ['设备账号延迟'] },
    surveyTime: '2026-04-17 15:00:00',
    createTime: '2026-04-17 15:00:00'
  }
]

export const npsSurveyCrudMock = createCrudMock<NPSSurvey>(initialSurveys, {
  searchFields: ['candidateName', 'phone', 'position', 'feedback']
})

/* ========== 统计 ========== */
export function getNPSStatsMock(): NPSStats {
  const surveys = npsSurveyCrudMock.getData()
  const totalSurveys = surveys.length
  const promoterCount = surveys.filter((s) => s.category === 'promoter').length
  const passiveCount = surveys.filter((s) => s.category === 'passive').length
  const detractorCount = surveys.filter((s) => s.category === 'detractor').length
  const npsScore = calcNPSScore(promoterCount, detractorCount, totalSurveys)

  // 按节点统计
  const stageMap: Record<NPSStage, NPSSurvey[]> = {
    post_apply: [],
    post_interview: [],
    post_onboard: []
  }
  for (const s of surveys) stageMap[s.stage].push(s)

  const byStage = (Object.keys(stageMap) as NPSStage[]).map((stage) => {
    const items = stageMap[stage]
    const count = items.length
    const p = items.filter((i) => i.category === 'promoter').length
    const d = items.filter((i) => i.category === 'detractor').length
    return {
      stage,
      count,
      promoterRate: count > 0 ? Number(((p / count) * 100).toFixed(1)) : 0,
      detractorRate: count > 0 ? Number(((d / count) * 100).toFixed(1)) : 0,
      npsScore: calcNPSScore(p, d, count)
    }
  })

  // 近 6 个月趋势（固定示例数据）
  const now = new Date()
  const sampleNps = [32, 45, 52, 48, 58, 60]
  const sampleSurveys = [12, 18, 22, 25, 28, 32]
  const trend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    trend.push({
      month: `${yyyy}-${mm}`,
      npsScore: sampleNps[5 - i],
      totalSurveys: sampleSurveys[5 - i]
    })
  }

  // Top 标签（按分类）
  const tagMap = new Map<string, { count: number; category: string }>()
  for (const s of surveys) {
    for (const t of s.tags) {
      const key = t
      if (!tagMap.has(key)) tagMap.set(key, { count: 0, category: s.category })
      tagMap.get(key)!.count++
    }
  }
  const topTags = [...tagMap.entries()]
    .map(([tag, v]) => ({ tag, count: v.count, category: v.category as any }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalSurveys,
    promoterCount,
    passiveCount,
    detractorCount,
    npsScore,
    byStage,
    trend,
    topTags
  }
}

/* ========== 改进建议（固定聚类数据） ========== */
export function getImprovementsMock(): NPSImprovement[] {
  return [
    {
      id: 1,
      category: 'HR 响应时效',
      feedbackCount: 3,
      stages: ['post_apply', 'post_interview'],
      sampleFeedbacks: [
        '投递后 3 天才有回复，等待时间有点长',
        '面试等了 20 分钟才开始',
        '面试被临时取消两次，HR 沟通也不积极'
      ],
      suggestedActions: [
        '配置自动化规则：投递 24 小时内未初筛自动提醒',
        '面试前 1 天系统自动向面试官和候选人双向确认',
        '为每位候选人指定专属 HR，明确 SLA 响应时间'
      ],
      priority: 'high'
    },
    {
      id: 2,
      category: '入职前设备/账号就位',
      feedbackCount: 2,
      stages: ['post_onboard'],
      sampleFeedbacks: [
        '入职第一天设备还没完全配齐',
        '系统账号开通延迟，耽误了半天'
      ],
      suggestedActions: [
        '启用多部门任务管理：入职前 3 天必须完成 IT 任务',
        '对 IT 部门任务加入 SLA 监控',
        '自动化规则：入职前 1 天检查任务完成度'
      ],
      priority: 'medium'
    },
    {
      id: 3,
      category: '面试过程专业度',
      feedbackCount: 2,
      stages: ['post_interview'],
      sampleFeedbacks: [
        '面试官问题和职位要求有些脱节',
        '面试问题重复，不同轮次问了相同问题'
      ],
      suggestedActions: [
        '强制使用统一的面试评价模板',
        '面试官之间共享候选人已回答问题',
        '给面试官培训，提升 JD 理解和提问技巧'
      ],
      priority: 'medium'
    }
  ]
}

/* ========== 提交调研（Demo）========== */
export function submitSurveyMock(data: Partial<NPSSurvey>): NPSSurvey {
  const surveys = npsSurveyCrudMock.getData()
  const nextId = Math.max(...surveys.map((s) => s.id), 0) + 1
  const score = data.score || 0
  const newSurvey: NPSSurvey = {
    id: nextId,
    stage: data.stage || 'post_apply',
    templateId: data.templateId || 1,
    candidateName: data.candidateName || '',
    candidateId: data.candidateId || 0,
    phone: data.phone || '',
    position: data.position || '',
    department: data.department || '',
    score,
    category: calcNPSCategory(score),
    feedback: data.feedback || '',
    tags: data.tags || [],
    answers: data.answers || {},
    surveyTime: new Date().toLocaleString('zh-CN'),
    createTime: new Date().toLocaleString('zh-CN')
  }
  surveys.push(newSurvey)
  return newSurvey
}
