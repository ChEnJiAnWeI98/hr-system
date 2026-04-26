// @ts-nocheck
import type { Interview, InterviewListParams, InterviewEvaluation } from '@/types/recruitment'
// 🔐 Phase 2.10 员工池对齐
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'

// 数据存储
let interviews: Interview[] = [
  {
    id: 1,
    interviewNo: 'IV2026040601',
    candidateName: '张三',
    position: '前端开发工程师',
    round: 1,
    interviewType: 1,
    interviewTime: '2026-04-07 10:00',
    interviewer: '李经理',
    location: '会议室A',
    status: 1,
    createTime: '2026-04-06 09:00:00',
    updateTime: '2026-04-06 09:00:00'
  },
  {
    id: 2,
    interviewNo: 'IV2026040602',
    candidateName: '李四',
    position: 'Java 开发工程师',
    round: 2,
    interviewType: 2,
    interviewTime: '2026-04-07 14:00',
    interviewer: '王总监',
    location: '会议室B',
    status: 1,
    createTime: '2026-04-06 09:30:00',
    updateTime: '2026-04-06 09:30:00'
  },
  {
    id: 3,
    interviewNo: 'IV2026040603',
    candidateName: '王五',
    position: '产品经理',
    round: 3,
    interviewType: 3,
    interviewTime: '2026-04-06 15:00',
    interviewer: '赵总',
    location: '总经理办公室',
    status: 2,
    rating: 4,
    evaluation: '表现优秀，沟通能力强，产品思维清晰',
    result: 1,
    createTime: '2026-04-05 10:00:00',
    updateTime: '2026-04-06 16:00:00'
  },
  {
    id: 4,
    interviewNo: 'IV2026040604',
    candidateName: '赵六',
    position: 'UI 设计师',
    round: 1,
    interviewType: 1,
    interviewTime: '2026-04-06 11:00',
    interviewer: '陈主管',
    location: '设计部',
    status: 2,
    rating: 3,
    evaluation: '设计能力一般，需要进一步培养',
    result: 3,
    createTime: '2026-04-05 14:00:00',
    updateTime: '2026-04-06 12:00:00'
  },
  {
    id: 5,
    interviewNo: 'IV2026040605',
    candidateName: '孙七',
    position: '测试工程师',
    round: 1,
    interviewType: 1,
    interviewTime: '2026-04-08 09:00',
    interviewer: '周经理',
    location: '会议室C',
    status: 3,
    createTime: '2026-04-06 10:00:00',
    updateTime: '2026-04-06 11:00:00'
  }
]

// 🔐 Phase 2.10 员工池对齐
// - 面试官字段叫 interviewer（不是 interviewerName）从管理族员工池取
// - 候选人字段（candidateName）保持不变（候选人是外部人员，不属于员工池）
interviews = alignEmployeeFields(interviews, {
  // 跳过"候选人/员工名"相关字段，避免把候选人姓名覆盖掉
  skipFields: ['employeeName', 'nameZh'],
  roles: {
    interviewer: { startIndex: 0, empField: 'nameZh', filter: (e) => e.jobFamily === 'MGMT' }
  }
})

let nextId = 6

/** 按候选人姓名查全部面试记录（候选人详情页 Timeline 用）*/
export function getInterviewsByCandidateNameMock(name: string) {
  return interviews
    .filter((i) => i.candidateName === name)
    .sort((a, b) => (a.round || 0) - (b.round || 0))
}

/**
 * 获取面试列表 Mock 函数
 */
export function getInterviewListMock(params: InterviewListParams) {
  const { interviewNo, candidateName, position, interviewType, status, page = 1, pageSize = 20 } = params
  let filteredData = [...interviews]

  // 筛选
  if (interviewNo) {
    filteredData = filteredData.filter(item => item.interviewNo.includes(interviewNo))
  }
  if (candidateName) {
    filteredData = filteredData.filter(item => item.candidateName.includes(candidateName))
  }
  if (position) {
    filteredData = filteredData.filter(item => item.position.includes(position))
  }
  if (interviewType !== undefined && interviewType !== null && interviewType !== '') {
    const typeValue = typeof interviewType === 'string' ? parseInt(interviewType) : interviewType
    filteredData = filteredData.filter(item => item.interviewType === typeValue)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

/**
 * 添加面试 Mock 函数
 */
export function addInterviewMock(data: Partial<Interview>) {
  const newInterview: Interview = {
    id: nextId++,
    interviewNo: `IV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(nextId).padStart(2, '0')}`,
    candidateName: data.candidateName || '',
    position: data.position || '',
    round: data.round || 1,
    interviewType: data.interviewType || 1,
    interviewTime: data.interviewTime || '',
    interviewer: data.interviewer || '',
    location: data.location || '',
    status: 1,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  interviews.unshift(newInterview)
  return newInterview
}

/**
 * 更新面试 Mock 函数
 */
export function updateInterviewMock(data: Partial<Interview>) {
  const index = interviews.findIndex(item => item.id === data.id)
  if (index !== -1) {
    interviews[index] = {
      ...interviews[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return interviews[index]
  }
  throw new Error('面试记录不存在')
}

/**
 * 删除面试 Mock 函数
 */
export function deleteInterviewMock(id: number) {
  const index = interviews.findIndex(item => item.id === id)
  if (index !== -1) {
    interviews.splice(index, 1)
    return true
  }
  throw new Error('面试记录不存在')
}

/**
 * 批量删除面试 Mock 函数
 */
export function batchDeleteInterviewMock(ids: number[]) {
  interviews = interviews.filter(item => !ids.includes(item.id))
  return true
}

/**
 * 取消面试 Mock 函数
 */
export function cancelInterviewMock(id: number) {
  const index = interviews.findIndex(item => item.id === id)
  if (index !== -1) {
    interviews[index].status = 3
    interviews[index].updateTime = new Date().toLocaleString('zh-CN')
    return interviews[index]
  }
  throw new Error('面试记录不存在')
}

/**
 * 填写评价 Mock 函数
 */
export function evaluateInterviewMock(data: { id: number; rating: number; evaluation: string; result: number }) {
  const index = interviews.findIndex(item => item.id === data.id)
  if (index !== -1) {
    interviews[index] = {
      ...interviews[index],
      rating: data.rating,
      evaluation: data.evaluation,
      result: data.result,
      status: 2,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return interviews[index]
  }
  throw new Error('面试记录不存在')
}

// ============ Phase 2.2 新增：多人协同评价 Mock ============

let interviewEvaluations: InterviewEvaluation[] = [
  {
    id: 1,
    interviewId: 3,
    interviewerId: 4,
    interviewerName: '李经理',
    dimensionScores: JSON.stringify([
      { dimensionName: '专业能力', score: 4.5, maxScore: 5 },
      { dimensionName: '沟通能力', score: 4.8, maxScore: 5 },
      { dimensionName: '学习能力', score: 4, maxScore: 5 },
      { dimensionName: '抗压能力', score: 4.2, maxScore: 5 },
      { dimensionName: '文化匹配度', score: 4.6, maxScore: 5 }
    ]),
    totalScore: 88,
    comment: '候选人专业能力扎实，表达清晰，主动推进项目的意愿强。强烈推荐。',
    resultSuggestion: '强烈推荐',
    submitted: true,
    submitTime: '2026-04-06 16:00:00',
    createTime: '2026-04-06 15:30:00',
    updateTime: '2026-04-06 16:00:00'
  },
  {
    id: 2,
    interviewId: 3,
    interviewerId: 1,
    interviewerName: '超级管理员',
    dimensionScores: JSON.stringify([
      { dimensionName: '专业能力', score: 4, maxScore: 5 },
      { dimensionName: '沟通能力', score: 4.5, maxScore: 5 },
      { dimensionName: '学习能力', score: 4.2, maxScore: 5 },
      { dimensionName: '抗压能力', score: 4, maxScore: 5 },
      { dimensionName: '文化匹配度', score: 4.5, maxScore: 5 }
    ]),
    totalScore: 84,
    comment: '综合素质较高，能胜任岗位要求。',
    resultSuggestion: '通过',
    submitted: true,
    submitTime: '2026-04-06 16:10:00',
    createTime: '2026-04-06 15:40:00',
    updateTime: '2026-04-06 16:10:00'
  }
]
let nextEvalId = 3

/**
 * 获取面试的所有评价（含他人评价，仅已提交的对他人可见）
 */
export function getInterviewEvaluationsMock(interviewId: number, currentUserId?: number): InterviewEvaluation[] {
  return interviewEvaluations.filter((e) => {
    if (e.interviewId !== interviewId) return false
    // 本人的评价无论是否提交都可见；他人评价只有已提交才可见
    if (e.interviewerId === currentUserId) return true
    return e.submitted
  })
}

/**
 * 获取某个面试官的面试评价（如果有）
 */
export function getMyEvaluationMock(interviewId: number, interviewerId: number): InterviewEvaluation | null {
  return interviewEvaluations.find((e) => e.interviewId === interviewId && e.interviewerId === interviewerId) || null
}

/**
 * 保存评价（新增或更新）—— 草稿或提交
 */
export function saveInterviewEvaluationMock(
  data: Partial<InterviewEvaluation>,
  submit: boolean
): InterviewEvaluation {
  const existing = interviewEvaluations.find(
    (e) => e.interviewId === data.interviewId && e.interviewerId === data.interviewerId
  )
  const now = new Date().toLocaleString('zh-CN')
  if (existing) {
    Object.assign(existing, data, {
      submitted: submit || existing.submitted,
      submitTime: submit ? now : existing.submitTime,
      updateTime: now
    })
    return existing
  }
  const fresh: InterviewEvaluation = {
    id: nextEvalId++,
    interviewId: data.interviewId!,
    interviewerId: data.interviewerId!,
    interviewerName: data.interviewerName || '',
    dimensionScores: data.dimensionScores || '[]',
    totalScore: data.totalScore ?? 0,
    comment: data.comment,
    resultSuggestion: data.resultSuggestion || '待定',
    submitted: submit,
    submitTime: submit ? now : undefined,
    createTime: now,
    updateTime: now
  }
  interviewEvaluations.push(fresh)
  return fresh
}
