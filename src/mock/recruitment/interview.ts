// @ts-nocheck
import type { Interview, InterviewListParams } from '@/types/recruitment'

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

let nextId = 6

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
