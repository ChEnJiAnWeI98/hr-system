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
    workExperience: `2022.06 - 至今  字节跳动  资深 Java 工程师 · 抖音电商
  · 负责抖音电商订单中台的架构设计与核心模块研发，支撑日订单峰值 3000 万
  · 主导订单分库分表改造（16 → 64 分片），写入 TPS 从 5000 提升到 15000
  · 设计并实现幂等组件，覆盖支付/退款/退货等 12 个核心业务场景，线上事故率下降 80%
  · 带 5 人小组，季度内输出 3 份核心技术文档，团队代码评审通过率 95%

2019.07 - 2022.05  阿里巴巴  Java 开发工程师 · 淘宝交易团队
  · 参与淘宝交易系统重构，承担订单查询服务的优化（QPS 8000 → 25000）
  · 主导缓存改造项目，Redis 集群拆分降低 40% 响应时间
  · 推动单元测试覆盖率从 45% 提升到 80%`,
    projectExperience: `1. 抖音电商订单中台 v3 (2023.06-2024.03)
   角色：技术负责人
   规模：8 人团队 / 9 个月
   产出：服务承接日订单 3000w+，P99 延迟从 280ms 降到 90ms
   技术栈：Java 17 / Spring Boot 3 / Kafka / Redis / MySQL / ShardingSphere

2. 淘宝订单查询服务优化 (2021.03-2021.09)
   角色：核心开发
   规模：4 人团队 / 6 个月
   产出：查询 QPS 8000 → 25000，P99 < 150ms`,
    selfEvaluation: `5 年大厂电商交易/订单系统经验，熟悉高并发、分布式事务、分库分表等核心技术。
擅长复杂业务系统的架构设计与性能调优，主导过多个亿级流量场景的关键改造。
有团队带教经验，期望在更具挑战的技术或业务场景中持续成长。`,
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
    workExperience: `2023.04 - 至今  美团  高级前端工程师 · 到店事业群
  · 负责美团到店商家管理后台前端架构演进，覆盖 200+ 业务页面
  · 主导从 Vue2 到 Vue3 的迁移项目，迁移完成后首屏加载提速 35%
  · 搭建团队级组件库，含 60+ 业务组件，复用率 70%，节省日均 4 人/天工时
  · 推动团队 TypeScript 全量化，类型覆盖率从 30% 提升到 95%

2021.07 - 2023.03  小米  前端开发工程师 · MIUI 国际化团队
  · 参与 MIUI 海外应用商店前端开发，覆盖 60+ 国家/地区
  · 优化首屏加载性能（FCP 2.8s → 1.2s）`,
    projectExperience: `1. 美团到店商家管理后台 v3 (2023.10-2024.05)
   角色：前端负责人
   规模：5 人团队 / 7 个月
   产出：完成 Vue3 + TypeScript + Vite 重构，CI 构建时间 8min → 2min
   技术栈：Vue3 / TypeScript / Vite / Pinia / Element Plus

2. 团队级组件库建设 (2024.01-至今)
   角色：核心开发
   产出：60+ 组件，月下载 8000+，文档站点 PV 12k/月`,
    selfEvaluation: `3 年前端开发经验，深耕 Vue 生态与 TypeScript 类型工程化。
有从 0 到 1 搭建团队组件库与基础设施的经验，注重代码质量与开发效率。
对前端架构演进与性能优化有持续兴趣，期望参与更复杂的产品形态建设。`,
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
    workExperience: `2020.03 - 至今  腾讯  高级产品经理 · 企业 SaaS 部门
  · 负责企业微信「客户联系」功能线，DAU 800w，年营收贡献 6 亿
  · 主导客户标签体系重构，企业用户标签使用渗透率从 22% 提升到 58%
  · 建立 A/B 实验文化，季度内推动 18 个实验落地，主功能转化率提升 15%
  · 跨部门协作经验：与销售、运营、技术、设计联合推进 4 个 Q 跨级项目

2018.07 - 2020.02  字节跳动  产品经理 · 飞书办公套件
  · 负责飞书文档分享与权限管理模块，月活 50w → 200w
  · 主导文档协同编辑性能优化，并发编辑卡顿率从 3% 降到 0.5%`,
    projectExperience: `1. 企业微信客户联系 v4 (2023.06-2024.04)
   角色：产品负责人
   规模：跨 4 部门，研发团队 30+ 人
   产出：DAU 600w → 800w，付费转化率提升 22%
   关键决策：客户标签体系重构、跨企业聊天能力上线

2. 飞书文档协同 (2019.04-2019.12)
   角色：核心 PM
   产出：月活 50w → 200w，并发编辑卡顿率 3% → 0.5%`,
    selfEvaluation: `6 年企业级 SaaS 产品经验，深耕协作效率类产品（IM / 文档 / 客户关系）。
擅长数据驱动的产品迭代，有完整 A/B 实验设计与跨部门协作经验。
对 B 端产品复杂业务建模与商业化路径有深刻理解，期望负责更核心的 SaaS 业务线。`,
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
    workExperience: `2022.04 - 至今  网易  高级 UI 设计师 · 游戏部门
  · 负责《阴阳师》《忘川风华录》两款 IP 移动游戏的 UI 视觉
  · 主导新版本 UI 改版，应用商店评分从 4.2 → 4.6
  · 输出 200+ UI 组件规范，跨 3 个游戏团队复用

2020.06 - 2022.03  字节跳动  UI 设计师 · 抖音商业化
  · 参与抖音直播间打赏页设计，A/B 测试转化率提升 18%`,
    projectExperience: `1. 阴阳师 7 周年版本 UI 改版 (2024.02-2024.07)
   角色：UI 主设
   规模：4 人 UI 团队 / 5 个月
   产出：完整视觉系统重构，玩家好评率 92%，登录率提升 23%

2. 抖音直播间打赏页 (2021.05-2021.11)
   角色：核心设计
   产出：A/B 实验赢出 3 轮，单日打赏总额提升 15%`,
    selfEvaluation: `4 年游戏 / 商业化产品 UI 设计经验，擅长视觉系统化与品牌识别度建设。
有 IP 类产品的视觉延展经验，能与策划/玩法团队深度协作。
关注移动端体验细节与情感化设计，期望在更具创意空间的产品中持续输出。`,
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
    workExperience: `2022.07 - 2024.12  滴滴出行  高级 Python 工程师 · 大数据团队
  · 负责滴滴出行实时风控数据 pipeline，处理日均 80 亿条事件流
  · 主导风控规则引擎重构，规则评估延迟 P99 从 200ms 降到 30ms
  · 推动 Pyflink 落地，团队批流一体化覆盖率从 30% 提升到 85%

2020.06 - 2022.06  Shopee  Python 开发工程师 · 推荐系统
  · 参与 Shopee 商品推荐召回引擎建设，CTR 提升 12%
  · 维护离线特征工程平台，特征产出延迟 6h → 1.5h`,
    projectExperience: `1. 滴滴实时风控 pipeline v2 (2023.05-2024.10)
   角色：核心开发
   规模：6 人团队 / 17 个月
   产出：日均 80 亿事件实时处理，规则评估 P99 30ms

2. Shopee 推荐召回 (2021.04-2022.05)
   角色：开发
   产出：CTR 提升 12%，召回多样性提升 20%`,
    selfEvaluation: `4 年大数据/风控/推荐系统 Python 开发经验，深耕实时计算与离线特征工程。
熟悉 Flink / Spark / Kafka 全栈，有亿级数据处理与高可用系统建设经验。
对数据驱动业务场景有持续兴趣，期望在更核心的实时智能场景中深耕。`,
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
