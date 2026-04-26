/**
 * 入职衔接 Mock 数据
 */

import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Onboarding } from '@/types/onboarding'

// 初始化数据
const initialData: Onboarding[] = [
  {
    id: 1,
    onboardingNo: 'OB202604001',
    employeeName: '张三',
    phone: '13800138001',
    position: '前端开发工程师',
    departmentName: '技术部',
    onboardDate: '2026-04-10',
    mentor: '李四',
    status: 3,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: true },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: true }
    ],
    accountStatus: 1,
    equipmentStatus: 1,
    trainingStatus: 2,
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-05 16:30:00'
  },
  {
    id: 2,
    onboardingNo: 'OB202604002',
    employeeName: '王芳',
    phone: '13800138002',
    position: 'UI设计师',
    departmentName: '设计部',
    onboardDate: '2026-04-12',
    mentor: '赵敏',
    status: 2,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: false },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: false }
    ],
    accountStatus: 1,
    equipmentStatus: 0,
    trainingStatus: 1,
    createTime: '2026-04-02 10:15:00',
    updateTime: '2026-04-05 14:20:00'
  },
  {
    id: 3,
    onboardingNo: 'OB202604003',
    employeeName: '刘强',
    phone: '13800138003',
    position: 'Java开发工程师',
    departmentName: '技术部',
    onboardDate: '2026-04-15',
    mentor: '李四',
    status: 1,
    materialChecklist: [
      { name: '身份证复印件', completed: false },
      { name: '学历证明', completed: false },
      { name: '离职证明', completed: false },
      { name: '银行卡信息', completed: false },
      { name: '体检报告', completed: false }
    ],
    accountStatus: 0,
    equipmentStatus: 0,
    trainingStatus: 0,
    createTime: '2026-04-03 11:30:00',
    updateTime: '2026-04-03 11:30:00'
  },
  {
    id: 4,
    onboardingNo: 'OB202604004',
    employeeName: '陈静',
    phone: '13800138004',
    position: '产品经理',
    departmentName: '产品部',
    onboardDate: '2026-04-08',
    mentor: '周杰',
    status: 3,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: true },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: true }
    ],
    accountStatus: 1,
    equipmentStatus: 1,
    trainingStatus: 2,
    createTime: '2026-03-28 14:00:00',
    updateTime: '2026-04-04 10:15:00'
  },
  {
    id: 5,
    onboardingNo: 'OB202604005',
    employeeName: '杨洋',
    phone: '13800138005',
    position: '测试工程师',
    departmentName: '技术部',
    onboardDate: '2026-04-18',
    mentor: '李四',
    status: 2,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: true },
      { name: '银行卡信息', completed: false },
      { name: '体检报告', completed: true }
    ],
    accountStatus: 0,
    equipmentStatus: 0,
    trainingStatus: 1,
    createTime: '2026-04-04 09:45:00',
    updateTime: '2026-04-05 15:10:00'
  },
  {
    id: 6,
    onboardingNo: 'OB202604006',
    employeeName: '赵磊',
    phone: '13800138006',
    position: '运维工程师',
    departmentName: '技术部',
    onboardDate: '2026-04-20',
    mentor: '李四',
    status: 1,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: false },
      { name: '离职证明', completed: false },
      { name: '银行卡信息', completed: false },
      { name: '体检报告', completed: false }
    ],
    accountStatus: 0,
    equipmentStatus: 0,
    trainingStatus: 0,
    createTime: '2026-04-05 10:20:00',
    updateTime: '2026-04-05 10:20:00'
  },
  {
    id: 7,
    onboardingNo: 'OB202604007',
    employeeName: '孙丽',
    phone: '13800138007',
    position: '人力资源专员',
    departmentName: '人力资源部',
    onboardDate: '2026-04-11',
    mentor: '吴梅',
    status: 2,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: true },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: false }
    ],
    accountStatus: 1,
    equipmentStatus: 1,
    trainingStatus: 1,
    createTime: '2026-04-01 15:30:00',
    updateTime: '2026-04-05 11:45:00'
  },
  {
    id: 8,
    onboardingNo: 'OB202604008',
    employeeName: '周涛',
    phone: '13800138008',
    position: '市场专员',
    departmentName: '市场部',
    onboardDate: '2026-04-13',
    mentor: '郑强',
    status: 3,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: true },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: true }
    ],
    accountStatus: 1,
    equipmentStatus: 1,
    trainingStatus: 2,
    createTime: '2026-04-02 13:15:00',
    updateTime: '2026-04-05 09:30:00'
  },
  {
    id: 9,
    onboardingNo: 'OB202604009',
    employeeName: '吴娜',
    phone: '13800138009',
    position: '财务专员',
    departmentName: '财务部',
    onboardDate: '2026-04-16',
    mentor: '钱多多',
    status: 2,
    materialChecklist: [
      { name: '身份证复印件', completed: true },
      { name: '学历证明', completed: true },
      { name: '离职证明', completed: false },
      { name: '银行卡信息', completed: true },
      { name: '体检报告', completed: true }
    ],
    accountStatus: 0,
    equipmentStatus: 0,
    trainingStatus: 1,
    createTime: '2026-04-03 16:00:00',
    updateTime: '2026-04-05 13:20:00'
  },
  {
    id: 10,
    onboardingNo: 'OB202604010',
    employeeName: '郑浩',
    phone: '13800138010',
    position: '销售经理',
    departmentName: '销售部',
    onboardDate: '2026-04-22',
    mentor: '孙强',
    status: 1,
    materialChecklist: [
      { name: '身份证复印件', completed: false },
      { name: '学历证明', completed: false },
      { name: '离职证明', completed: false },
      { name: '银行卡信息', completed: false },
      { name: '体检报告', completed: false }
    ],
    accountStatus: 0,
    equipmentStatus: 0,
    trainingStatus: 0,
    createTime: '2026-04-05 14:45:00',
    updateTime: '2026-04-05 14:45:00'
  }
]

// 创建 CRUD Mock
export const onboardingConnectionMock = createCrudMock<Onboarding>(initialData, {
  searchFields: ['onboardingNo', 'employeeName', 'position']
})
