/**
 * 工作台 Mock 数据
 */

import type {
  UserInfo,
  WeatherInfo,
  EmployeeStats,
  ShortcutItem,
  ScheduleItem,
  ScheduleListParams,
  ApprovalStats
} from '@/types/workspace'
import { EMPLOYEES } from './core/employeePool'

/**
 * 快捷入口列表（可变数据）
 */
let shortcuts: ShortcutItem[] = [
  { id: 1, name: '组织架构', icon: '&#xe813;', path: '/org/organization', order: 1, color: '#5b9aff' },
  { id: 2, name: '员工档案', icon: '&#xe7ae;', path: '/employee/profile', order: 2, color: '#9b7dd4' },
  { id: 3, name: '考勤记录', icon: '&#xe88c;', path: '/attendance/record', order: 3, color: '#8bc34a' },
  { id: 4, name: '薪资核算', icon: '&#xe88d;', path: '/comp/payroll', order: 4, color: '#f08080' },
  { id: 5, name: '绩效考核', icon: '&#xe88e;', path: '/perf/evaluation', order: 5, color: '#f0c674' },
  { id: 6, name: '招聘需求', icon: '&#xe88f;', path: '/recruit/demand', order: 6, color: '#b0b0b0' },
  { id: 7, name: '培训计划', icon: '&#xe890;', path: '/training/plan', order: 7, color: '#5b9aff' },
  { id: 8, name: '用户账号', icon: '&#xe891;', path: '/system/user-account', order: 8, color: '#9b7dd4' },
  { id: 9, name: '岗位体系', icon: '&#xe7ae;', path: '/org/position', order: 9, color: '#8bc34a' },
  { id: 10, name: '编制管理', icon: '&#xe813;', path: '/org/headcount', order: 10, color: '#f08080' },
  { id: 11, name: '入职管理', icon: '&#xe7ae;', path: '/recruit/onboarding', order: 11, color: '#f0c674' },
  { id: 12, name: '离职管理', icon: '&#xe7ae;', path: '/employee/offboarding', order: 12, color: '#b0b0b0' },
  { id: 13, name: '加班记录', icon: '&#xe88c;', path: '/attendance/overtime', order: 13, color: '#5b9aff' },
  { id: 14, name: '补卡申请', icon: '&#xe88c;', path: '/attendance/makeup', order: 14, color: '#9b7dd4' },
  { id: 15, name: '请假管理', icon: '&#xe88c;', path: '/attendance/leave-application', order: 15, color: '#8bc34a' },
  { id: 16, name: '合同列表', icon: '&#xe88d;', path: '/contract/list', order: 16, color: '#f08080' }
]

/**
 * 日程列表（可变数据）
 */
let schedules: ScheduleItem[] = [
  {
    id: 1,
    title: '部门周会',
    date: '2026-04-07',
    time: '09:00',
    type: 1,
    status: 1,
    description: '讨论本周工作计划和进度'
  },
  {
    id: 2,
    title: '新员工入职培训',
    date: '2026-04-08',
    time: '14:00',
    type: 2,
    status: 1,
    description: '为新入职员工进行公司文化和制度培训'
  },
  {
    id: 3,
    title: '项目评审会议',
    date: '2026-04-09',
    time: '10:30',
    type: 1,
    status: 1,
    description: '评审本月项目进展和成果'
  },
  {
    id: 4,
    title: '客户拜访',
    date: '2026-04-10',
    time: '15:00',
    type: 3,
    status: 1,
    description: '拜访重要客户，洽谈合作事宜'
  },
  {
    id: 5,
    title: '绩效面谈',
    date: '2026-04-11',
    time: '11:00',
    type: 2,
    status: 1,
    description: '与团队成员进行季度绩效面谈'
  },
  {
    id: 6,
    title: '技术分享会',
    date: '2026-04-14',
    time: '16:00',
    type: 2,
    status: 1,
    description: '团队技术经验分享和交流'
  },
  {
    id: 7,
    title: '月度总结会',
    date: '2026-04-15',
    time: '09:30',
    type: 1,
    status: 1,
    description: '总结本月工作，规划下月计划'
  },
  {
    id: 8,
    title: '招聘面试',
    date: '2026-04-16',
    time: '14:30',
    type: 3,
    status: 1,
    description: '面试前端开发工程师候选人'
  },
  {
    id: 9,
    title: '团建活动',
    date: '2026-04-18',
    time: '13:00',
    type: 4,
    status: 1,
    description: '部门团建活动，增进团队凝聚力'
  },
  {
    id: 10,
    title: '年度规划会议',
    date: '2026-04-20',
    time: '10:00',
    type: 1,
    status: 1,
    description: '讨论公司年度发展规划和目标'
  },
  {
    id: 11,
    title: '产品需求评审',
    date: '2026-04-08',
    time: '10:00',
    type: 1,
    status: 1,
    description: '评审新产品功能需求'
  },
  {
    id: 12,
    title: '客户沟通会',
    date: '2026-04-08',
    time: '16:30',
    type: 3,
    status: 1,
    description: '与客户讨论项目进展'
  },
  {
    id: 13,
    title: '代码审查',
    date: '2026-04-09',
    time: '14:00',
    type: 2,
    status: 1,
    description: '审查本周提交的代码'
  },
  {
    id: 14,
    title: '团队建设讨论',
    date: '2026-04-09',
    time: '16:00',
    type: 1,
    status: 1,
    description: '讨论团队建设方案'
  },
  {
    id: 15,
    title: '技术培训',
    date: '2026-04-10',
    time: '09:30',
    type: 2,
    status: 1,
    description: '新技术栈培训'
  },
  {
    id: 16,
    title: '项目复盘',
    date: '2026-04-10',
    time: '11:00',
    type: 1,
    status: 1,
    description: '复盘上周项目问题'
  },
  {
    id: 17,
    title: '需求对接',
    date: '2026-04-11',
    time: '09:00',
    type: 3,
    status: 1,
    description: '与产品对接新需求'
  },
  {
    id: 18,
    title: '周报汇总',
    date: '2026-04-11',
    time: '15:30',
    type: 1,
    status: 1,
    description: '整理本周工作周报'
  },
  {
    id: 19,
    title: '系统维护',
    date: '2026-04-14',
    time: '09:00',
    type: 2,
    status: 1,
    description: '系统例行维护检查'
  },
  {
    id: 20,
    title: '数据分析会议',
    date: '2026-04-14',
    time: '14:00',
    type: 1,
    status: 1,
    description: '分析本月运营数据'
  },
  // ===== 4/21 ~ 4/30 每日日程 =====
  {
    id: 21,
    title: 'HR 周例会',
    date: '2026-04-21',
    time: '09:30',
    type: 1,
    status: 1,
    description: '同步招聘、绩效、薪酬各线本周进度'
  },
  {
    id: 22,
    title: '新员工入职办理',
    date: '2026-04-21',
    time: '14:00',
    type: 1,
    status: 1,
    description: '3 位新员工资料核对与系统开户'
  },
  {
    id: 23,
    title: '薪酬核算审批',
    date: '2026-04-22',
    time: '10:00',
    type: 1,
    status: 1,
    description: '4 月工资条生成前的核算批次审批'
  },
  {
    id: 24,
    title: '组织架构调整评审',
    date: '2026-04-22',
    time: '15:30',
    type: 1,
    status: 1,
    description: '研发中心二级部门合并方案评审'
  },
  {
    id: 25,
    title: 'Q2 绩效面谈(研发部)',
    date: '2026-04-23',
    time: '09:00',
    type: 1,
    status: 1,
    description: '与研发部门负责人对齐 Q2 绩效校准结果'
  },
  {
    id: 26,
    title: '候选人技术复试',
    date: '2026-04-23',
    time: '14:30',
    type: 1,
    status: 1,
    description: '高级前端工程师岗位复试安排'
  },
  {
    id: 27,
    title: '招聘周例会',
    date: '2026-04-24',
    time: '10:00',
    type: 1,
    status: 1,
    description: '本周 Offer 发放 / 入职进度 / 渠道效果复盘'
  },
  {
    id: 28,
    title: '月度人力健康度分析',
    date: '2026-04-24',
    time: '16:00',
    type: 1,
    status: 1,
    description: '输出本月离职率 / 异动率 / 在职结构报告'
  },
  {
    id: 29,
    title: '管理干部培训',
    date: '2026-04-25',
    time: '10:00',
    type: 2,
    status: 1,
    description: '新晋管理者反馈与 1on1 技巧培训'
  },
  {
    id: 30,
    title: '招聘数据复盘',
    date: '2026-04-26',
    time: '15:00',
    type: 1,
    status: 1,
    description: '周末整理本月招聘渠道 ROI 数据'
  },
  {
    id: 31,
    title: '人才盘点会议',
    date: '2026-04-27',
    time: '09:30',
    type: 1,
    status: 1,
    description: '核心岗位 9-box 盘点与继任梯队讨论'
  },
  {
    id: 32,
    title: '离职面谈',
    date: '2026-04-27',
    time: '15:00',
    type: 1,
    status: 1,
    description: '2 位离职员工的离职原因沟通'
  },
  {
    id: 33,
    title: '薪酬带宽评审',
    date: '2026-04-28',
    time: '10:00',
    type: 1,
    status: 1,
    description: '年度薪酬带宽调整方案评审'
  },
  {
    id: 34,
    title: 'Offer 审批批量处理',
    date: '2026-04-28',
    time: '14:30',
    type: 1,
    status: 1,
    description: '本周待审批 Offer 集中处理'
  },
  {
    id: 35,
    title: '月度绩效复盘',
    date: '2026-04-29',
    time: '09:30',
    type: 1,
    status: 1,
    description: '4 月绩效推进情况与问题汇总'
  },
  {
    id: 36,
    title: '社保基数核对',
    date: '2026-04-29',
    time: '16:00',
    type: 1,
    status: 1,
    description: '新入职员工社保公积金基数确认'
  },
  {
    id: 37,
    title: '月度总结会',
    date: '2026-04-30',
    time: '10:00',
    type: 1,
    status: 1,
    description: 'HR 全员月度工作总结与成果分享'
  },
  {
    id: 38,
    title: '下月工作对齐',
    date: '2026-04-30',
    time: '14:00',
    type: 1,
    status: 1,
    description: '5 月重点工作排期与资源对齐'
  }
]

let nextScheduleId = 39

/**
 * 获取用户信息 Mock 函数
 */
export function getUserInfoMock(): UserInfo {
  // 尝试从 localStorage 获取用户信息（登录后写入）
  const userInfoStr = localStorage.getItem('userInfo')
  let parsed: any = {}
  if (userInfoStr) {
    try {
      parsed = JSON.parse(userInfoStr)
    } catch {
      parsed = {}
    }
  }

  const username = parsed.username || 'admin'

  // admin 为系统账号：不绑定员工档案，不属于任何部门
  // 用于系统初始化、权限管理、数据字典维护等纯系统职责
  if (username === 'admin') {
    return {
      id: parsed.id || 1,
      username: 'admin',
      realName: '系统管理员',
      avatar: parsed.avatar || '',
      email: parsed.email || 'admin@example.com',
      phone: parsed.phone || '13800138000',
      department: '系统账号',
      position: '超级管理员'
    }
  }

  // 业务账号：关联真实员工档案，从 localStorage 里兼容嵌套结构
  const deptName =
    typeof parsed.department === 'object'
      ? parsed.department?.departmentName
      : parsed.department
  const roleName = parsed.roles?.[0]?.name

  return {
    id: parsed.id || 1,
    username,
    realName: parsed.realName || parsed.nickname || '员工',
    avatar: parsed.avatar || '',
    email: parsed.email || '',
    phone: parsed.phone || '',
    department: deptName || '',
    position: parsed.position || roleName || ''
  }
}

/**
 * 获取天气信息 Mock 函数
 */
export function getWeatherInfoMock(): WeatherInfo {
  return {
    city: '北京',
    weather: '晴',
    temperature: 22,
    humidity: 45,
    windDirection: '东南风',
    windLevel: '3级',
    updateTime: new Date().toLocaleString('zh-CN')
  }
}

/**
 * 获取员工统计 Mock 函数
 *
 * 数据源：统一员工池 EMPLOYEES（SSOT），与全系统其他模块口径一致。
 * 口径：统计员工档案库内的人员，不跨模块聚合（待入职候选人归属入职办理模块）。
 */
export function getEmployeeStatsMock(): EmployeeStats {
  // 统计各状态员工数量
  // 注：在职（onJob）= regular + probation + transferring + seconded，
  // 是试用期和正式员工的超集；待离职单独计数不含在在职里
  const stats = {
    onJob: 0,          // 在职（含试用期/调动中/借调中）
    toBeOnboarded: 0,  // 待入职（pending_onboard）
    probation: 0,      // 试用期（probation）
    formal: 0,         // 正式员工（regular，已转正）
    toBeOffboarded: 0, // 待离职（offboarding）
    offboarded: 0      // 已离职（terminated）
  }

  EMPLOYEES.forEach((emp) => {
    switch (emp.status) {
      case 'pending_onboard':
        stats.toBeOnboarded++
        break
      case 'probation':
        stats.probation++
        stats.onJob++
        break
      case 'regular':
        stats.formal++
        stats.onJob++
        break
      case 'transferring':
      case 'seconded':
        stats.onJob++
        break
      case 'offboarding':
        stats.toBeOffboarded++
        break
      case 'terminated':
        stats.offboarded++
        break
    }
  })

  // 返回数据，同时包含兼容字段
  return {
    onJob: stats.onJob,
    onJobCount: stats.onJob,
    toBeOnboarded: stats.toBeOnboarded,
    toBeOnboardCount: stats.toBeOnboarded,
    probation: stats.probation,
    probationCount: stats.probation,
    formal: stats.formal,
    formalCount: stats.formal,
    toBeOffboarded: stats.toBeOffboarded,
    toBeOffboardCount: stats.toBeOffboarded,
    offboarded: stats.offboarded,
    offboardCount: stats.offboarded
  }
}

/**
 * 获取快捷入口列表 Mock 函数
 */
export function getShortcutListMock(): ShortcutItem[] {
  return [...shortcuts].sort((a, b) => a.order - b.order)
}

/**
 * 更新快捷入口列表 Mock 函数
 */
export function updateShortcutListMock(list: ShortcutItem[]): ShortcutItem[] {
  shortcuts = list.map((item, index) => ({
    ...item,
    order: index + 1
  }))
  return getShortcutListMock()
}

/**
 * 获取日程列表 Mock 函数
 */
export function getScheduleListMock(params: ScheduleListParams): ScheduleItem[] {
  let filteredData = [...schedules]

  // 按日期筛选
  if (params.date) {
    filteredData = filteredData.filter((item) => item.date === params.date)
  }

  // 按类型筛选
  if (params.type !== undefined && params.type !== null && params.type !== '') {
    const typeValue = typeof params.type === 'string' ? parseInt(params.type) : params.type
    filteredData = filteredData.filter((item) => item.type === typeValue)
  }

  // 按状态筛选
  if (params.status !== undefined && params.status !== null && params.status !== '') {
    const statusValue = typeof params.status === 'string' ? parseInt(params.status) : params.status
    filteredData = filteredData.filter((item) => item.status === statusValue)
  }

  // 按日期排序
  return filteredData.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
}

/**
 * 新增日程 Mock 函数
 */
export function addScheduleMock(data: Partial<ScheduleItem>): ScheduleItem {
  const newSchedule: ScheduleItem = {
    id: nextScheduleId++,
    title: data.title || '',
    date: data.date || '',
    time: data.time || '',
    type: data.type || 1,
    status: data.status || 1,
    description: data.description || ''
  }
  schedules.push(newSchedule)
  return newSchedule
}

/**
 * 更新日程 Mock 函数
 */
export function updateScheduleMock(data: Partial<ScheduleItem>): ScheduleItem {
  const index = schedules.findIndex((item) => item.id === data.id)
  if (index !== -1) {
    schedules[index] = {
      ...schedules[index],
      ...data
    }
    return schedules[index]
  }
  throw new Error('日程不存在')
}

/**
 * 删除日程 Mock 函数
 */
export function deleteScheduleMock(id: number): boolean {
  const index = schedules.findIndex((item) => item.id === id)
  if (index !== -1) {
    schedules.splice(index, 1)
    return true
  }
  throw new Error('日程不存在')
}

/**
 * 获取审批概况 Mock 函数
 */
export function getApprovalStatsMock(): ApprovalStats {
  return {
    pending: 8,
    approved: 25,
    rejected: 3
  }
}
