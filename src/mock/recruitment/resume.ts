// @ts-nocheck
import type { Resume, ResumeListParams, ScheduleInterviewParams } from '@/types/recruitment'

// 数据存储（Phase 2.1 扩展：新增 talentProfileId/parseStatus/jdMatchScore/rejectReasonCode 等）
let resumes: Resume[] = [
  {
    id: 1,
    resumeNo: 'R202601001',
    candidateName: '张三',
    gender: 1,
    age: 28,
    position: 'Java开发工程师',
    workYears: 5,
    education: '本科',
    expectedSalary: '15-20K',
    tags: ['Java', 'Spring Boot', 'MySQL'],
    source: '智联招聘',
    status: 1,
    phone: '13800138001',
    email: 'zhangsan@example.com',
    location: '北京市朝阳区',
    school: '北京大学',
    major: '计算机科学与技术',
    workExperience: '2019-2024 某互联网公司 Java开发工程师\n负责公司核心业务系统的开发和维护',
    projectExperience: '电商平台项目：负责订单系统的设计和开发',
    selfEvaluation: '熟练掌握Java开发，有丰富的项目经验',
    parseStatus: 'success',
    jdMatchScore: 82,
    createTime: '2026-01-15 10:30:00',
    updateTime: '2026-01-15 10:30:00'
  },
  {
    id: 2,
    resumeNo: 'R202601002',
    candidateName: '李四',
    gender: 2,
    age: 25,
    position: '前端开发工程师',
    workYears: 3,
    education: '本科',
    expectedSalary: '12-15K',
    tags: ['Vue', 'React', 'TypeScript'],
    source: '前程无忧',
    status: 2,
    phone: '13800138002',
    email: 'lisi@example.com',
    location: '上海市浦东新区',
    school: '复旦大学',
    major: '软件工程',
    workExperience: '2021-2024 某科技公司 前端开发工程师\n负责公司官网和管理后台的开发',
    projectExperience: '管理后台项目：使用Vue3+TypeScript开发',
    selfEvaluation: '熟练掌握前端开发技术，注重代码质量',
    parseStatus: 'success',
    jdMatchScore: 76,
    createTime: '2026-01-16 14:20:00',
    updateTime: '2026-01-16 14:20:00'
  },
  {
    id: 3,
    resumeNo: 'R202601003',
    candidateName: '王五',
    gender: 1,
    age: 30,
    position: '产品经理',
    workYears: 6,
    education: '硕士',
    expectedSalary: '20-25K',
    tags: ['产品设计', '需求分析', '项目管理'],
    source: 'BOSS直聘',
    status: 3,
    phone: '13800138003',
    email: 'wangwu@example.com',
    location: '深圳市南山区',
    school: '清华大学',
    major: '工商管理',
    workExperience: '2018-2024 某互联网公司 产品经理\n负责多个产品线的规划和管理',
    projectExperience: 'SaaS平台项目：从0到1完成产品设计和上线',
    selfEvaluation: '具备丰富的产品经验，擅长需求分析和项目管理',
    parseStatus: 'success',
    jdMatchScore: 54,
    rejectReasonCode: 'exp_insufficient',
    rejectReasonText: '工作年限不足',
    rejectTime: '2026-01-20 14:00:00',
    rejectByName: '张HR',
    createTime: '2026-01-17 09:15:00',
    updateTime: '2026-01-20 14:00:00'
  },
  {
    id: 4,
    resumeNo: 'R202601004',
    candidateName: '赵六',
    gender: 2,
    age: 26,
    position: 'UI设计师',
    workYears: 4,
    education: '本科',
    expectedSalary: '10-15K',
    tags: ['UI设计', 'Figma', 'Sketch'],
    source: '拉勾网',
    status: 4,
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    location: '杭州市西湖区',
    school: '中国美术学院',
    major: '视觉传达设计',
    workExperience: '2020-2024 某设计公司 UI设计师\n负责多个项目的UI设计工作',
    projectExperience: '移动应用设计：完成多个APP的UI设计',
    selfEvaluation: '热爱设计，注重用户体验',
    parseStatus: 'success',
    jdMatchScore: 88,
    createTime: '2026-01-18 11:40:00',
    updateTime: '2026-01-18 11:40:00'
  },
  {
    id: 5,
    resumeNo: 'R202601005',
    candidateName: '孙七',
    gender: 1,
    age: 27,
    position: 'Python开发工程师',
    workYears: 4,
    education: '本科',
    expectedSalary: '18-22K',
    tags: ['Python', 'Django', 'Flask'],
    source: '猎聘网',
    status: 5,
    phone: '13800138005',
    email: 'sunqi@example.com',
    location: '广州市天河区',
    school: '华南理工大学',
    major: '软件工程',
    workExperience: '2020-2024 某科技公司 Python开发工程师\n负责后端服务的开发和维护',
    projectExperience: '数据分析平台：使用Python开发数据处理服务',
    selfEvaluation: '熟练掌握Python开发，有数据处理经验',
    parseStatus: 'manual',
    jdMatchScore: 71,
    createTime: '2026-01-19 16:25:00',
    updateTime: '2026-01-19 16:25:00'
  }
]

let nextId = 6

// Phase 2.1 新增：候选人笔记 Mock 数据
import type { CandidateNote } from '@/types/recruitment'

let candidateNotes: CandidateNote[] = [
  {
    id: 1,
    resumeId: 1,
    authorId: 3,
    authorName: '张HR',
    content: '电话初筛沟通结果：技术栈匹配度高，沟通表达清晰，推荐进入面试流程。',
    createTime: '2026-01-16 09:00:00'
  },
  {
    id: 2,
    resumeId: 1,
    authorId: 4,
    authorName: '李经理',
    content: '@张HR 看了下简历，项目经验很扎实，尽快安排技术面试吧',
    mentionedUserIds: '3',
    replyToId: 1,
    createTime: '2026-01-16 10:30:00'
  },
  {
    id: 3,
    resumeId: 2,
    authorId: 3,
    authorName: '张HR',
    content: '候选人对 Vue3 非常熟悉，自我驱动力强，可以约一面。',
    createTime: '2026-01-17 11:00:00'
  },
  {
    id: 4,
    resumeId: 4,
    authorId: 3,
    authorName: '张HR',
    content: '作品集质量很高，设计功底不错，已邀约现场面试。',
    createTime: '2026-01-19 14:00:00'
  }
]
let nextNoteId = 5

/**
 * 获取简历列表 Mock 函数
 */
export function getResumeListMock(params: ResumeListParams) {
  const { resumeNo, candidateName, position, source, status, page = 1, pageSize = 20 } = params
  let filteredData = [...resumes]

  // 筛选
  if (resumeNo) {
    filteredData = filteredData.filter(item => item.resumeNo.includes(resumeNo))
  }
  if (candidateName) {
    filteredData = filteredData.filter(item => item.candidateName.includes(candidateName))
  }
  if (position) {
    filteredData = filteredData.filter(item => item.position.includes(position))
  }
  if (source) {
    filteredData = filteredData.filter(item => item.source.includes(source))
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
 * 获取简历详情 Mock 函数
 */
export function getResumeDetailMock(id: number) {
  const resume = resumes.find(item => item.id === id)
  if (!resume) {
    throw new Error('简历不存在')
  }
  return resume
}

/**
 * 导入简历 Mock 函数（Phase 2.1 增强：模拟解析流程）
 */
export function importResumeMock(file: any) {
  // 模拟解析过程：创建一份"解析中"的简历记录
  const now = new Date()
  const newResume: Resume = {
    id: nextId++,
    resumeNo: `R${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(nextId).padStart(3, '0')}`,
    candidateName: `候选人${nextId}`,
    gender: 1,
    age: 25,
    position: '待筛选',
    workYears: 3,
    education: '本科',
    expectedSalary: '面议',
    tags: [],
    source: '简历解析导入',
    status: 1,
    phone: `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    email: `parse${nextId}@example.com`,
    location: '待完善',
    school: '待完善',
    major: '待完善',
    workExperience: '（解析中）',
    projectExperience: '',
    selfEvaluation: '',
    parseStatus: 'success',
    jdMatchScore: 60 + Math.floor(Math.random() * 35),
    createTime: now.toLocaleString('zh-CN'),
    updateTime: now.toLocaleString('zh-CN')
  }
  resumes.push(newResume)
  return {
    success: 1,
    failed: 0,
    parsed: newResume,
    message: '成功导入并解析 1 份简历（准确率 85%，部分字段需人工确认）'
  }
}

/**
 * 批量入库 Mock 函数
 */
export function batchStoreResumeMock(ids: number[]) {
  ids.forEach(id => {
    const index = resumes.findIndex(item => item.id === id)
    if (index !== -1) {
      resumes[index].status = 4
      resumes[index].updateTime = new Date().toLocaleString('zh-CN')
    }
  })
  return true
}

/**
 * 批量删除简历 Mock 函数
 */
export function batchDeleteResumeMock(ids: number[]) {
  ids.forEach(id => {
    const index = resumes.findIndex(item => item.id === id)
    if (index !== -1) {
      resumes.splice(index, 1)
    }
  })
  return true
}

/**
 * 安排面试 Mock 函数
 */
export function scheduleInterviewMock(data: ScheduleInterviewParams) {
  const index = resumes.findIndex(item => item.id === data.resumeId)
  if (index !== -1) {
    resumes[index].status = 2
    resumes[index].updateTime = new Date().toLocaleString('zh-CN')
    return true
  }
  throw new Error('简历不存在')
}

/**
 * 淘汰简历 Mock 函数（Phase 2.1 增强：记录淘汰原因）
 */
export function rejectResumeMock(id: number, reasonCode?: string, reasonText?: string, byName?: string) {
  const index = resumes.findIndex(item => item.id === id)
  if (index !== -1) {
    resumes[index].status = 3
    resumes[index].rejectReasonCode = reasonCode
    resumes[index].rejectReasonText = reasonText
    resumes[index].rejectTime = new Date().toLocaleString('zh-CN')
    resumes[index].rejectByName = byName
    resumes[index].updateTime = resumes[index].rejectTime
    return true
  }
  throw new Error('简历不存在')
}

/**
 * Phase 2.1 新增：关联到人才库档案（简历入库时设置 talentProfileId）
 */
export function linkTalentProfileMock(resumeId: number, talentProfileId: number) {
  const resume = resumes.find(item => item.id === resumeId)
  if (resume) {
    resume.talentProfileId = talentProfileId
    resume.updateTime = new Date().toLocaleString('zh-CN')
  }
}

// ============ Phase 2.1 新增：候选人笔记 Mock 函数 ============

/**
 * 获取简历下的所有笔记
 */
export function getCandidateNotesMock(resumeId: number): CandidateNote[] {
  return candidateNotes
    .filter((n) => n.resumeId === resumeId)
    .sort((a, b) => a.createTime.localeCompare(b.createTime))
}

/**
 * 新增笔记
 */
export function addCandidateNoteMock(data: Partial<CandidateNote>): CandidateNote {
  const note: CandidateNote = {
    id: nextNoteId++,
    resumeId: data.resumeId!,
    authorId: data.authorId!,
    authorName: data.authorName!,
    authorAvatar: data.authorAvatar,
    content: data.content!,
    mentionedUserIds: data.mentionedUserIds,
    attachments: data.attachments,
    replyToId: data.replyToId,
    createTime: new Date().toLocaleString('zh-CN')
  }
  candidateNotes.push(note)
  return note
}

/**
 * 删除笔记
 */
export function deleteCandidateNoteMock(id: number): boolean {
  const idx = candidateNotes.findIndex((n) => n.id === id)
  if (idx !== -1) {
    candidateNotes.splice(idx, 1)
    return true
  }
  throw new Error('笔记不存在')
}

/**
 * Phase 2.1 新增：模拟简历查重
 * （复用 Phase 1 talentPool 的 dedupeCheck；同时也检查现有简历中的重复）
 */
export function dedupeResumeMock(phone?: string, email?: string): Resume | null {
  if (phone) {
    const m = resumes.find((r) => r.phone === phone)
    if (m) return m
  }
  if (email) {
    const m = resumes.find((r) => r.email === email)
    if (m) return m
  }
  return null
}
