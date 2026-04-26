// @ts-nocheck
import type { PerformanceGoal } from '@/types/performanceGoal'
import { createCrudMock } from '@/utils/crud/mockHelper'

// 初始数据
const initialData: PerformanceGoal[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    departmentName: '技术部',
    cycleId: 1,
    cycleName: '2026年Q1考核周期',
    goalType: 1,
    goalTypeName: 'OKR',
    goalTitle: '提升系统性能',
    goalDescription: '优化核心业务系统响应时间，提升用户体验',
    weight: 30,
    targetValue: '响应时间 < 200ms',
    currentValue: '响应时间 300ms',
    progress: 60,
    status: 1,
    statusName: '进行中',
    createTime: '2026-01-05 09:00:00',
    updateTime: '2026-03-15 14:30:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    departmentName: '产品部',
    cycleId: 1,
    cycleName: '2026年Q1考核周期',
    goalType: 2,
    goalTypeName: 'KPI',
    goalTitle: '产品需求交付率',
    goalDescription: '按时完成产品需求文档编写和评审',
    weight: 40,
    targetValue: '需求交付率 >= 95%',
    currentValue: '需求交付率 88%',
    progress: 80,
    status: 1,
    statusName: '进行中',
    createTime: '2026-01-06 10:00:00',
    updateTime: '2026-03-20 16:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    departmentName: '技术部',
    cycleId: 2,
    cycleName: '2025年Q4考核周期',
    goalType: 1,
    goalTypeName: 'OKR',
    goalTitle: '技术架构升级',
    goalDescription: '完成微服务架构改造，提升系统可扩展性',
    weight: 50,
    targetValue: '完成5个核心模块改造',
    currentValue: '完成5个核心模块改造',
    progress: 100,
    status: 2,
    statusName: '已完成',
    createTime: '2025-10-01 09:00:00',
    updateTime: '2025-12-28 18:00:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    departmentName: '市场部',
    cycleId: 1,
    cycleName: '2026年Q1考核周期',
    goalType: 2,
    goalTypeName: 'KPI',
    goalTitle: '市场推广活动',
    goalDescription: '策划并执行季度市场推广活动，提升品牌知名度',
    weight: 35,
    targetValue: '活动参与人数 >= 5000',
    currentValue: '活动参与人数 0',
    progress: 0,
    status: 0,
    statusName: '未开始',
    createTime: '2026-01-08 11:00:00',
    updateTime: '2026-01-08 11:00:00'
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: '孙七',
    departmentName: '人事部',
    cycleId: 1,
    cycleName: '2026年Q1考核周期',
    goalType: 1,
    goalTypeName: 'OKR',
    goalTitle: '员工满意度提升',
    goalDescription: '优化员工福利体系，提升员工满意度和留存率',
    weight: 25,
    targetValue: '员工满意度 >= 85%',
    currentValue: '员工满意度 78%',
    progress: 45,
    status: 1,
    statusName: '进行中',
    createTime: '2026-01-10 09:30:00',
    updateTime: '2026-03-18 10:00:00'
  }
]

// 创建 CRUD Mock
export const performanceGoalMock = createCrudMock<PerformanceGoal>(initialData, {
  searchFields: ['employeeName', 'departmentName'],
  exactMatchFields: ['cycleId', 'goalType', 'status']
})

// 导出 Mock 函数
export const {
  getList: getListMock,
  getDetail: getDetailMock,
  add: addMock,
  update: updateMock,
  delete: deleteMock,
  batchDelete: batchDeleteMock
} = performanceGoalMock
