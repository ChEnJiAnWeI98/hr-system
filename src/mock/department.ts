/**
 * 部门管理 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { Department } from '@/types/department'
import { getEmployeeListMock } from './employee'

/**
 * 统计部门在编人数
 * 从员工档案中统计状态为"在职"(status=1)的员工数量
 * @param departmentId 部门ID
 */
const calculateCurrentCount = (departmentId: number): number => {
  try {
    const params: any = {
      status: 1, // 在职状态
      page: 1,
      pageSize: 9999
    }

    // 如果departmentId为0或1（总公司），则统计所有部门
    // 否则只统计指定部门
    if (departmentId !== 0 && departmentId !== 1) {
      params.departmentId = departmentId
    }

    const result = getEmployeeListMock(params)
    return result.total || 0
  } catch (error) {
    console.error('统计部门在编人数失败:', error)
    return 0
  }
}

/**
 * 递归处理部门树，为每个部门添加动态计算的在编人数
 */
const processDepartmentTree = (departments: Department[]): Department[] => {
  return departments.map(dept => {
    const currentCount = calculateCurrentCount(dept.id)
    const processed: Department = {
      ...dept,
      currentCount
    }

    if (dept.children && dept.children.length > 0) {
      processed.children = processDepartmentTree(dept.children)
    }

    return processed
  })
}

/**
 * 初始部门数据（树形结构）
 */
const mockDepartments: Department[] = [
  {
    id: 1,
    name: '总公司',
    code: 'DEPT-001',
    parentId: null,
    leaderId: 1,
    leaderName: '张三',
    headcount: 500,
    currentCount: 450,
    establishDate: '2020-01-01',
    description: '公司总部，负责整体战略规划和管理',
    sort: 1,
    status: 1,
    createTime: '2020-01-01 10:00:00',
    updateTime: '2020-01-01 10:00:00',
    children: [
      {
        id: 2,
        name: '技术部',
        code: 'DEPT-002',
        parentId: 1,
        leaderId: 2,
        leaderName: '李四',
        headcount: 150,
        currentCount: 135,
        establishDate: '2020-03-01',
        description: '负责公司技术研发、系统维护和技术支持',
        sort: 1,
        status: 1,
        createTime: '2020-03-01 10:00:00',
        updateTime: '2020-03-01 10:00:00',
        children: [
          {
            id: 3,
            name: '前端组',
            code: 'DEPT-003',
            parentId: 2,
            leaderId: 3,
            leaderName: '王五',
            headcount: 60,
            currentCount: 55,
            establishDate: '2020-04-01',
            description: '负责前端页面开发、UI交互实现',
            sort: 1,
            status: 1,
            createTime: '2020-04-01 10:00:00',
            updateTime: '2020-04-01 10:00:00'
          },
          {
            id: 4,
            name: '后端组',
            code: 'DEPT-004',
            parentId: 2,
            leaderId: 4,
            leaderName: '赵六',
            headcount: 80,
            currentCount: 75,
            establishDate: '2020-04-01',
            description: '负责后端服务开发、数据库设计、API接口开发',
            sort: 2,
            status: 1,
            createTime: '2020-04-01 10:00:00',
            updateTime: '2020-04-01 10:00:00'
          }
        ]
      },
      {
        id: 5,
        name: '产品部',
        code: 'DEPT-005',
        parentId: 1,
        leaderId: 5,
        leaderName: '孙七',
        headcount: 80,
        currentCount: 72,
        establishDate: '2020-03-15',
        description: '负责产品规划、需求分析、产品设计和用户体验',
        sort: 2,
        status: 1,
        createTime: '2020-03-15 10:00:00',
        updateTime: '2020-03-15 10:00:00'
      },
      {
        id: 6,
        name: '人事部',
        code: 'DEPT-006',
        parentId: 1,
        leaderId: 6,
        leaderName: '周八',
        headcount: 50,
        currentCount: 48,
        establishDate: '2020-02-01',
        description: '负责人力资源管理、招聘、培训、薪酬福利',
        sort: 3,
        status: 1,
        createTime: '2020-02-01 10:00:00',
        updateTime: '2020-02-01 10:00:00'
      },
      {
        id: 7,
        name: '财务部',
        code: 'DEPT-007',
        parentId: 1,
        leaderId: 7,
        leaderName: '吴九',
        headcount: 40,
        currentCount: 38,
        establishDate: '2020-02-01',
        description: '负责财务管理、会计核算、成本控制、资金管理',
        sort: 4,
        status: 1,
        createTime: '2020-02-01 10:00:00',
        updateTime: '2020-02-01 10:00:00'
      },
      {
        id: 8,
        name: '市场部',
        code: 'DEPT-008',
        parentId: 1,
        leaderId: 8,
        leaderName: '郑十',
        headcount: 70,
        currentCount: 65,
        establishDate: '2020-02-15',
        description: '负责市场调研、品牌推广、营销策划、市场活动',
        sort: 5,
        status: 1,
        createTime: '2020-02-15 10:00:00',
        updateTime: '2020-02-15 10:00:00'
      },
      {
        id: 9,
        name: '销售部',
        code: 'DEPT-009',
        parentId: 1,
        leaderId: 9,
        leaderName: '王十一',
        headcount: 100,
        currentCount: 92,
        establishDate: '2020-02-15',
        description: '负责销售业务拓展、客户关系维护、销售目标达成',
        sort: 6,
        status: 1,
        createTime: '2020-02-15 10:00:00',
        updateTime: '2020-02-15 10:00:00'
      },
      {
        id: 10,
        name: '客服部',
        code: 'DEPT-010',
        parentId: 1,
        leaderId: 10,
        leaderName: '李十二',
        headcount: 60,
        currentCount: 55,
        establishDate: '2020-03-01',
        description: '负责客户服务、售后支持、客户投诉处理',
        sort: 7,
        status: 1,
        createTime: '2020-03-01 10:00:00',
        updateTime: '2020-03-01 10:00:00'
      }
    ]
  }
]

/**
 * 创建部门 CRUD Mock 函数
 * 使用树形数据模式
 */
export const departmentMock = createCrudMock<Department>(mockDepartments, {
  searchFields: ['name', 'code'],
  sortField: 'sort',
  isTree: true,
  childrenField: 'children',
  parentField: 'parentId',
  beforeGetList: (data) => {
    // 动态计算每个部门的在编人数
    return processDepartmentTree(data)
  }
})
