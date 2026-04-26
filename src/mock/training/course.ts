/**
 * 课程管理 Mock 数据（Phase 4.8）
 *
 * 决策 V2.0 8=A 管理型：不做在线播放器，仅维护课程目录和参考信息
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Course } from '@/types/training'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 按岗位族挑选讲师的辅助 */
function instructorOf(family: string, offset = 0): { id: number; name: string } {
  const pool = EMPLOYEES.filter((e) => e.jobFamily === family && ['P6', 'P7', 'P8', 'M1', 'M2', 'M3'].includes(e.level))
  const emp = pool[offset % pool.length] || EMPLOYEES[0]
  return { id: emp.id, name: emp.nameZh }
}

const tech1 = instructorOf('TECH', 0)
const tech2 = instructorOf('TECH', 1)
const tech3 = instructorOf('TECH', 2)
const prod1 = instructorOf('PROD', 0)
const sales1 = instructorOf('SALES', 0)
const func1 = instructorOf('FUNC', 0)
const mgmt1 = instructorOf('MGMT', 0)
const mgmt2 = instructorOf('MGMT', 1)

const initialCourses: Course[] = [
  {
    id: 1,
    courseCode: 'COURSE-001',
    courseName: '新员工入职引导（必修）',
    category: 'onboarding',
    instructorId: func1.id,
    instructorName: func1.name,
    duration: 8,
    cost: 0,
    deliveryMode: 'offline',
    targetAudience: '全体新入职员工（试用期内）',
    description: '覆盖公司文化、组织架构、规章制度、系统使用指南、合规要求等基础内容',
    objectives: '帮助新员工快速了解公司并融入团队，规避常见合规风险',
    status: 1,
    createdBy: 'HR 培训组',
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00'
  },
  {
    id: 2,
    courseCode: 'COURSE-002',
    courseName: '信息安全与数据合规',
    category: 'compliance',
    instructorId: func1.id,
    instructorName: func1.name,
    duration: 4,
    cost: 0,
    deliveryMode: 'online',
    targetAudience: '全员',
    description: 'GDPR / 个保法 / 数据分级分类 / 办公终端安全基线',
    objectives: '建立员工数据安全意识，通过年度合规考试（≥85 分合格）',
    status: 1,
    createdBy: 'HR 培训组',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-01-10 10:00:00'
  },
  {
    id: 3,
    courseCode: 'COURSE-003',
    courseName: 'Java 后端工程化实战',
    category: 'technical',
    instructorId: tech1.id,
    instructorName: tech1.name,
    duration: 24,
    cost: 3000,
    deliveryMode: 'hybrid',
    targetAudience: '技术族 P4~P6（Java 方向）',
    description: 'Spring Boot 3 + MyBatis + 分布式缓存 + 性能调优',
    objectives: '掌握企业级工程化规范，能独立交付中等复杂度服务',
    status: 1,
    createdBy: '技术委员会',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-02-01 10:00:00'
  },
  {
    id: 4,
    courseCode: 'COURSE-004',
    courseName: '前端 Vue 3 + TypeScript 进阶',
    category: 'technical',
    instructorId: tech2.id,
    instructorName: tech2.name,
    duration: 16,
    cost: 2000,
    deliveryMode: 'online',
    targetAudience: '技术族 P4~P6（前端方向）',
    description: '组合式 API / TS 泛型 / 状态管理 / 性能优化',
    objectives: '提升前端工程能力，具备中大型 SPA 架构能力',
    status: 1,
    createdBy: '技术委员会',
    createTime: '2026-02-05 10:00:00',
    updateTime: '2026-02-05 10:00:00'
  },
  {
    id: 5,
    courseCode: 'COURSE-005',
    courseName: '云原生与 Kubernetes 基础',
    category: 'technical',
    instructorId: tech3.id,
    instructorName: tech3.name,
    duration: 12,
    cost: 1500,
    deliveryMode: 'online',
    targetAudience: '技术族 P5+',
    description: 'Docker / K8s 核心概念 / 服务编排 / 可观测性',
    objectives: '了解云原生体系，能参与线上集群日常运维',
    status: 1,
    createdBy: '技术委员会',
    createTime: '2026-02-10 10:00:00',
    updateTime: '2026-02-10 10:00:00'
  },
  {
    id: 6,
    courseCode: 'COURSE-006',
    courseName: '产品需求分析方法论',
    category: 'general',
    instructorId: prod1.id,
    instructorName: prod1.name,
    duration: 8,
    cost: 800,
    deliveryMode: 'offline',
    targetAudience: '产品族 / 产品经理',
    description: 'PRD 撰写 / 需求优先级 / 用户访谈 / 竞品分析',
    objectives: '提升需求沉淀能力和项目沟通效率',
    status: 1,
    createdBy: '产品委员会',
    createTime: '2026-02-15 10:00:00',
    updateTime: '2026-02-15 10:00:00'
  },
  {
    id: 7,
    courseCode: 'COURSE-007',
    courseName: '顾问式销售与大客户谈判',
    category: 'technical',
    instructorId: sales1.id,
    instructorName: sales1.name,
    duration: 16,
    cost: 2500,
    deliveryMode: 'offline',
    targetAudience: '销售族 P4+',
    description: 'SPIN 模型 / 价值阐述 / 异议处理 / 合同签署',
    objectives: '提升大单成交率，客单价 > 50w 的谈判能力',
    status: 1,
    createdBy: '销售运营部',
    createTime: '2026-02-20 10:00:00',
    updateTime: '2026-02-20 10:00:00'
  },
  {
    id: 8,
    courseCode: 'COURSE-008',
    courseName: '新经理必修：从员工到管理者',
    category: 'management',
    instructorId: mgmt1.id,
    instructorName: mgmt1.name,
    duration: 24,
    cost: 4000,
    deliveryMode: 'hybrid',
    targetAudience: '近 6 个月内晋升至 M1 的新晋管理者',
    description: '角色转换 / 团队组建 / 目标对齐 / 辅导与反馈',
    objectives: '完成从个人贡献者到团队领导者的思维切换',
    status: 1,
    createdBy: 'HR + 组织发展',
    createTime: '2026-03-01 10:00:00',
    updateTime: '2026-03-01 10:00:00'
  },
  {
    id: 9,
    courseCode: 'COURSE-009',
    courseName: '中层管理者领导力工作坊',
    category: 'management',
    instructorId: mgmt2.id,
    instructorName: mgmt2.name,
    duration: 32,
    cost: 8000,
    deliveryMode: 'offline',
    targetAudience: 'M2~M3 中层管理者',
    description: '战略解码 / 组织效能 / 跨部门协作 / 教练式对话',
    objectives: '提升组织穿透力，承上启下能力',
    status: 1,
    createdBy: '组织发展部',
    createTime: '2026-03-05 10:00:00',
    updateTime: '2026-03-05 10:00:00'
  },
  {
    id: 10,
    courseCode: 'COURSE-010',
    courseName: '职场沟通与高效协作',
    category: 'general',
    instructorId: func1.id,
    instructorName: func1.name,
    duration: 6,
    cost: 500,
    deliveryMode: 'online',
    targetAudience: '全员',
    description: '结构化表达 / 向上沟通 / 冲突化解 / 会议管理',
    objectives: '提升日常协作效率和信息传递准确度',
    status: 1,
    createdBy: 'HR 培训组',
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00'
  },
  {
    id: 11,
    courseCode: 'COURSE-011',
    courseName: '反舞弊与商业道德',
    category: 'compliance',
    instructorId: func1.id,
    instructorName: func1.name,
    duration: 2,
    cost: 0,
    deliveryMode: 'online',
    targetAudience: '全员（重点：采购 / 销售 / 财务）',
    description: '利益冲突申报 / 反商业贿赂 / 举报渠道 / 真实案例复盘',
    objectives: '强化红线意识，年度合规考试 ≥90 分',
    status: 1,
    createdBy: '法务合规部',
    createTime: '2026-03-15 10:00:00',
    updateTime: '2026-03-15 10:00:00'
  },
  {
    id: 12,
    courseCode: 'COURSE-012',
    courseName: 'OKR 目标管理实战',
    category: 'general',
    instructorId: prod1.id,
    instructorName: prod1.name,
    duration: 4,
    cost: 500,
    deliveryMode: 'online',
    targetAudience: '各级管理者 + 员工代表',
    description: 'OKR 制定 / 对齐 / 复盘 / 与绩效的关系',
    objectives: '统一公司 OKR 运作语言，提升目标清晰度',
    status: 0,
    createdBy: '组织发展部',
    createTime: '2026-03-20 10:00:00',
    updateTime: '2026-03-20 10:00:00'
  }
]

export const courseMock = createCrudMock<Course>(initialCourses, {
  searchFields: ['courseCode', 'courseName', 'instructorName', 'targetAudience'],
  sortField: 'courseCode'
})

/** 内部导出：供其他 mock（培训计划 / 记录）直接引用课程 */
export function getCourseById(id: number): Course | undefined {
  return courseMock.getData().find((c) => c.id === id)
}

export function getAllCourses(): Course[] {
  return courseMock.getData()
}
