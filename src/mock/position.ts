/**
 * 岗位管理 Mock 数据
 */

import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Position } from '@/types/position'
import { getEmployeeListMock } from './employee'

/**
 * 统计岗位在职人数
 * 从员工档案中统计状态为"在职"(status=1)的员工数量
 * @param positionId 岗位ID
 */
const calculateEmployeeCount = (positionId: number): number => {
  try {
    const result = getEmployeeListMock({
      positionId,
      status: 1,
      page: 1,
      pageSize: 9999
    })
    return result.total || 0
  } catch (error) {
    console.error('统计岗位在职人数失败:', error)
    return 0
  }
}

/**
 * 初始岗位数据
 * 注意：岗位ID必须与员工档案中的positionId对应
 */
const initialPositions: Position[] = [
  // 技术部岗位
  {
    id: 1,
    name: '技术总监',
    departmentId: 2,
    departmentName: '技术部',
    category: 1, // 管理类
    level: 10,
    grade: 18,
    description: '负责公司技术战略规划、技术团队管理、技术架构设计等工作',
    requirements: '1. 计算机相关专业本科及以上学历\n2. 10年以上软件开发经验，5年以上技术管理经验\n3. 精通主流技术架构和开发框架',
    employeeCount: 0, // 将被动态计算
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    name: '前端工程师',
    departmentId: 2,
    departmentName: '技术部',
    category: 2, // 技术类
    level: 7,
    grade: 12,
    description: '负责前端页面开发、UI交互实现、前端架构优化等工作',
    requirements: '1. 计算机相关专业本科及以上学历\n2. 3年以上前端开发经验\n3. 精通Vue/React等主流框架',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:05:00',
    updateTime: '2024-01-15 10:05:00'
  },
  {
    id: 3,
    name: '后端工程师',
    departmentId: 2,
    departmentName: '技术部',
    category: 2, // 技术类
    level: 5,
    grade: 9,
    description: '负责后端业务功能开发、接口设计、数据库优化等工作',
    requirements: '1. 计算机相关专业本科及以上学历\n2. 3年以上后端开发经验\n3. 熟悉Java/Python等后端语言',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:10:00',
    updateTime: '2024-01-15 10:10:00'
  },
  {
    id: 4,
    name: '测试工程师',
    departmentId: 2,
    departmentName: '技术部',
    category: 2, // 技术类
    level: 4,
    grade: 8,
    description: '负责功能测试、自动化测试、性能测试等工作',
    requirements: '1. 计算机相关专业本科及以上学历\n2. 2年以上测试经验\n3. 熟悉测试流程和测试工具',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:15:00',
    updateTime: '2024-01-15 10:15:00'
  },
  // 产品部岗位
  {
    id: 5,
    name: '产品经理',
    departmentId: 5,
    departmentName: '产品部',
    category: 3, // 业务类
    level: 6,
    grade: 11,
    description: '负责产品规划、需求分析、原型设计、项目跟进等工作',
    requirements: '1. 本科及以上学历\n2. 3年以上产品经验\n3. 熟悉产品设计流程和工具',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:20:00',
    updateTime: '2024-01-15 10:20:00'
  },
  {
    id: 6,
    name: 'UI设计师',
    departmentId: 5,
    departmentName: '产品部',
    category: 2, // 技术类
    level: 5,
    grade: 9,
    description: '负责产品界面设计、交互设计、视觉规范制定等工作',
    requirements: '1. 设计相关专业本科及以上学历\n2. 3年以上UI设计经验\n3. 精通Figma/Sketch等设计工具',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:25:00',
    updateTime: '2024-01-15 10:25:00'
  },
  // 人事部岗位
  {
    id: 7,
    name: 'HR经理',
    departmentId: 6,
    departmentName: '人事部',
    category: 1, // 管理类
    level: 6,
    grade: 11,
    description: '负责人力资源战略规划、团队管理、制度建设等工作',
    requirements: '1. 人力资源相关专业本科及以上学历\n2. 5年以上HR工作经验，3年以上管理经验\n3. 熟悉劳动法和人力资源管理体系',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    id: 8,
    name: 'HR专员',
    departmentId: 6,
    departmentName: '人事部',
    category: 4, // 职能类
    level: 3,
    grade: 6,
    description: '负责招聘、员工关系、薪酬福利等日常人事工作',
    requirements: '1. 人力资源相关专业本科及以上学历\n2. 1年以上HR工作经验\n3. 熟悉劳动法和人力资源管理流程',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:35:00',
    updateTime: '2024-01-15 10:35:00'
  },
  // 财务部岗位
  {
    id: 9,
    name: '财务经理',
    departmentId: 7,
    departmentName: '财务部',
    category: 1, // 管理类
    level: 6,
    grade: 11,
    description: '负责财务管理、预算控制、财务分析等工作',
    requirements: '1. 财务相关专业本科及以上学历\n2. 5年以上财务工作经验\n3. 持有中级会计师证书',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:40:00',
    updateTime: '2024-01-15 10:40:00'
  },
  {
    id: 10,
    name: '会计',
    departmentId: 7,
    departmentName: '财务部',
    category: 4, // 职能类
    level: 4,
    grade: 7,
    description: '负责财务核算、报表编制、税务申报等工作',
    requirements: '1. 财务相关专业本科及以上学历\n2. 2年以上财务工作经验\n3. 持有初级会计师证书',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:45:00',
    updateTime: '2024-01-15 10:45:00'
  },
  // 市场部岗位
  {
    id: 11,
    name: '市场经理',
    departmentId: 8,
    departmentName: '市场部',
    category: 1, // 管理类
    level: 6,
    grade: 11,
    description: '负责市场战略规划、品牌推广、市场活动策划等工作',
    requirements: '1. 市场营销相关专业本科及以上学历\n2. 5年以上市场工作经验\n3. 熟悉市场推广渠道和工具',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:50:00',
    updateTime: '2024-01-15 10:50:00'
  },
  {
    id: 12,
    name: '市场专员',
    departmentId: 8,
    departmentName: '市场部',
    category: 3, // 业务类
    level: 3,
    grade: 6,
    description: '负责市场调研、活动执行、数据分析等工作',
    requirements: '1. 市场营销相关专业本科及以上学历\n2. 1年以上市场工作经验\n3. 熟悉市场推广工具',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 10:55:00',
    updateTime: '2024-01-15 10:55:00'
  },
  // 销售部岗位
  {
    id: 13,
    name: '销售经理',
    departmentId: 9,
    departmentName: '销售部',
    category: 1, // 管理类
    level: 6,
    grade: 11,
    description: '负责销售团队管理、销售目标达成、客户关系维护等工作',
    requirements: '1. 本科及以上学历\n2. 5年以上销售经验，3年以上管理经验\n3. 具备良好的沟通能力和客户资源',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 11:00:00',
    updateTime: '2024-01-15 11:00:00'
  },
  {
    id: 14,
    name: '销售专员',
    departmentId: 9,
    departmentName: '销售部',
    category: 5, // 销售类
    level: 3,
    grade: 6,
    description: '负责客户开发、销售跟进、合同签订等工作',
    requirements: '1. 本科及以上学历\n2. 1年以上销售经验\n3. 具备良好的沟通能力',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 11:05:00',
    updateTime: '2024-01-15 11:05:00'
  },
  // 客服部岗位
  {
    id: 15,
    name: '客服经理',
    departmentId: 10,
    departmentName: '客服部',
    category: 1, // 管理类
    level: 5,
    grade: 9,
    description: '负责客服团队管理、服务质量监控、客户满意度提升等工作',
    requirements: '1. 本科及以上学历\n2. 3年以上客服经验，2年以上管理经验\n3. 具备良好的沟通能力和服务意识',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 11:10:00',
    updateTime: '2024-01-15 11:10:00'
  },
  {
    id: 16,
    name: '客服专员',
    departmentId: 10,
    departmentName: '客服部',
    category: 6, // 客服类
    level: 2,
    grade: 5,
    description: '负责客户咨询、售后服务、客户关系维护等工作',
    requirements: '1. 本科及以上学历\n2. 1年以上客服工作经验\n3. 具备良好的沟通能力和服务意识',
    employeeCount: 0,
    status: 1,
    createTime: '2024-01-15 11:15:00',
    updateTime: '2024-01-15 11:15:00'
  }
]

/**
 * 创建岗位 CRUD Mock
 */
const positionMock = createCrudMock<Position>(initialPositions, {
  idField: 'id',
  searchFields: ['name'],
  sortField: 'createTime',
  beforeGetList: (data) => {
    // 动态计算每个岗位的在职人数
    return data.map(position => ({
      ...position,
      employeeCount: calculateEmployeeCount(position.id)
    }))
  }
})

/**
 * 自定义删除函数 - 校验在职人数
 */
const deleteWithValidation = (id: number): boolean => {
  const position = positionMock.getDetail(id)
  if (!position) {
    throw new Error('岗位不存在')
  }
  const employeeCount = calculateEmployeeCount(id)
  if (employeeCount > 0) {
    throw new Error(`该岗位有 ${employeeCount} 名在职员工，无法删除`)
  }
  return positionMock.delete(id)
}

/**
 * 自定义批量删除函数 - 校验在职人数
 */
const batchDeleteWithValidation = (ids: number[]): boolean => {
  const positions = ids.map(id => positionMock.getDetail(id)).filter(Boolean) as Position[]
  const hasEmployees = positions.filter(p => calculateEmployeeCount(p.id) > 0)

  if (hasEmployees.length > 0) {
    const names = hasEmployees.map(p => p.name).join('、')
    throw new Error(`以下岗位有在职员工，无法删除：${names}`)
  }

  return positionMock.batchDelete(ids)
}

/**
 * 自定义状态更新函数 - 停用时校验在职人数
 */
const updateStatusWithValidation = (id: number, status: number): Position => {
  const position = positionMock.getDetail(id)
  if (!position) {
    throw new Error('岗位不存在')
  }

  // 停用时检查在职人数
  if (status === 0) {
    const employeeCount = calculateEmployeeCount(id)
    if (employeeCount > 0) {
      throw new Error(`该岗位下存在 ${employeeCount} 名在职员工，无法停用，请先调整员工岗位`)
    }
  }

  return positionMock.updateStatus(id, status)
}

/**
 * 导出 Mock 函数
 */
export const positionMockFns = {
  ...positionMock,
  delete: deleteWithValidation,
  batchDelete: batchDeleteWithValidation,
  updateStatus: updateStatusWithValidation
}
