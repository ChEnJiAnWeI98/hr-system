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
import { getEmployeeListMock } from './employee'

/**
 * 快捷入口列表（可变数据）
 */
let shortcuts: ShortcutItem[] = [
  { id: 1, name: '部门管理', icon: '&#xe813;', path: '/organization/department', order: 1, color: '#5b9aff' },
  { id: 2, name: '员工档案', icon: '&#xe7ae;', path: '/employee/profile', order: 2, color: '#9b7dd4' },
  { id: 3, name: '考勤记录', icon: '&#xe88c;', path: '/attendance/record', order: 3, color: '#8bc34a' },
  { id: 4, name: '薪酬发放', icon: '&#xe88d;', path: '/salary/payment', order: 4, color: '#f08080' },
  { id: 5, name: '绩效考核', icon: '&#xe88e;', path: '/performance/assessment', order: 5, color: '#f0c674' },
  { id: 6, name: '招聘需求', icon: '&#xe88f;', path: '/recruitment/demand', order: 6, color: '#b0b0b0' },
  { id: 7, name: '培训计划', icon: '&#xe890;', path: '/training/plan', order: 7, color: '#5b9aff' },
  { id: 8, name: '用户管理', icon: '&#xe891;', path: '/system/user', order: 8, color: '#9b7dd4' },
  { id: 9, name: '岗位管理', icon: '&#xe7ae;', path: '/organization/position', order: 9, color: '#8bc34a' },
  { id: 10, name: '编制管理', icon: '&#xe813;', path: '/organization/staffing', order: 10, color: '#f08080' },
  { id: 11, name: '入职管理', icon: '&#xe7ae;', path: '/employee/onboarding', order: 11, color: '#f0c674' },
  { id: 12, name: '离职管理', icon: '&#xe7ae;', path: '/employee/resignation', order: 12, color: '#b0b0b0' },
  { id: 13, name: '加班记录', icon: '&#xe88c;', path: '/attendance/overtime', order: 13, color: '#5b9aff' },
  { id: 14, name: '补卡申请', icon: '&#xe88c;', path: '/attendance/makeup', order: 14, color: '#9b7dd4' },
  { id: 15, name: '请假管理', icon: '&#xe88c;', path: '/leave/list', order: 15, color: '#8bc34a' },
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
  }
]

let nextScheduleId = 21

/**
 * 获取用户信息 Mock 函数
 */
export function getUserInfoMock(): UserInfo {
  // 尝试从 localStorage 获取用户信息
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      return {
        id: userInfo.id || 1,
        username: userInfo.username || 'admin',
        realName: userInfo.realName || '管理员',
        avatar: userInfo.avatar || '',
        email: userInfo.email || 'admin@example.com',
        phone: userInfo.phone || '13800138000',
        department: userInfo.department || '技术部',
        position: userInfo.position || '系统管理员'
      }
    } catch (e) {
      // 解析失败，使用默认值
    }
  }

  // 返回默认管理员信息
  return {
    id: 1,
    username: 'admin',
    realName: '管理员',
    avatar: '',
    email: 'admin@example.com',
    phone: '13800138000',
    department: '技术部',
    position: '系统管理员'
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
 */
export function getEmployeeStatsMock(): EmployeeStats {
  // 获取所有员工数据（不分页）
  const result = getEmployeeListMock({
    page: 1,
    pageSize: 9999
  })

  const allEmployees = result.list

  // 统计各状态员工数量
  const stats = {
    onJob: 0,           // 在职（status=1）
    toBeOnboarded: 0,   // 待入职（status=0）
    probation: 0,       // 试用期（status=2）
    formal: 0,          // 正式员工（已转正，即在职状态的员工，不包括试用期）
    toBeOffboarded: 0,  // 待离职（暂无此状态）
    offboarded: 0       // 已离职（status=3）
  }

  allEmployees.forEach((emp: any) => {
    switch (emp.status) {
      case 0: // 待入职
        stats.toBeOnboarded++
        break
      case 1: // 在职（正式员工）
        stats.onJob++
        stats.formal++ // 在职即为正式员工（已转正）
        break
      case 2: // 试用期
        stats.probation++
        break
      case 3: // 已离职
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
