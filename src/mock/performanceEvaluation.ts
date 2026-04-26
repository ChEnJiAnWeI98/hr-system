// @ts-nocheck
import type { PerformanceEvaluation } from '@/types/performanceEvaluation'
import { createCrudMock } from '@/utils/crud/mockHelper'

// 评估状态映射
const evaluationStatusMap: Record<number, string> = {
  0: '待自评',
  1: '待上级评',
  2: '待360度评',
  3: '已完成'
}

// 初始数据
const initialData: PerformanceEvaluation[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    departmentName: '技术部',
    cycleId: 1,
    cycleName: '2024年Q1',
    selfScore: 92,
    managerScore: 95,
    peerScore: 93,
    subordinateScore: 94,
    finalScore: 93.5,
    rating: '优秀',
    evaluationStatus: 3,
    evaluationStatusName: '已完成',
    comments: '工作表现优异，技术能力突出，团队协作良好，超额完成季度目标。',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-15 16:30:00'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    departmentName: '产品部',
    cycleId: 1,
    cycleName: '2024年Q1',
    selfScore: 85,
    managerScore: 88,
    peerScore: 86,
    subordinateScore: 87,
    finalScore: 86.5,
    rating: '良好',
    evaluationStatus: 3,
    evaluationStatusName: '已完成',
    comments: '工作认真负责，产品规划能力强，需要进一步提升跨部门沟通能力。',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-15 17:00:00'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    departmentName: '市场部',
    cycleId: 1,
    cycleName: '2024年Q1',
    selfScore: 78,
    managerScore: 80,
    peerScore: 0,
    subordinateScore: 0,
    finalScore: 0,
    rating: '合格',
    evaluationStatus: 2,
    evaluationStatusName: '待360度评',
    comments: '',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-12 14:20:00'
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    departmentName: '销售部',
    cycleId: 1,
    cycleName: '2024年Q1',
    selfScore: 65,
    managerScore: 62,
    peerScore: 63,
    subordinateScore: 64,
    finalScore: 63.5,
    rating: '待改进',
    evaluationStatus: 3,
    evaluationStatusName: '已完成',
    comments: '本季度业绩未达标，需要加强客户关系维护和销售技巧，建议参加相关培训。',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-15 18:00:00'
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: '孙七',
    departmentName: '人力资源部',
    cycleId: 1,
    cycleName: '2024年Q1',
    selfScore: 82,
    managerScore: 0,
    peerScore: 0,
    subordinateScore: 0,
    finalScore: 0,
    rating: '良好',
    evaluationStatus: 1,
    evaluationStatusName: '待上级评',
    comments: '',
    createTime: '2024-04-01 09:00:00',
    updateTime: '2024-04-10 11:30:00'
  }
]

// 创建 CRUD Mock
export const performanceEvaluationMock = createCrudMock<PerformanceEvaluation>(initialData, {
  searchFields: ['employeeName', 'departmentName'],
  exactMatchFields: ['cycleId', 'rating', 'evaluationStatus'],
  beforeResponse: (item) => ({
    ...item,
    evaluationStatusName: evaluationStatusMap[item.evaluationStatus]
  })
})

export const {
  getList: getListMock,
  getDetail: getDetailMock,
  add: addMock,
  update: updateMock,
  delete: deleteMock,
  batchDelete: batchDeleteMock
} = performanceEvaluationMock
