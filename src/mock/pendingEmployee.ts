import type { PendingEmployee } from '@/types/pendingEmployee'
import { createCrudMock } from '@/utils/crud'

// 初始数据 - 10条待入职员工数据
const initialData: PendingEmployee[] = [
  {
    id: 1,
    employeeName: '张伟',
    idCard: '110101199001011234',
    phone: '13800138001',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 1,
    positionName: '前端工程师',
    expectedJoinDate: '2026-04-15',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-01',
    createTime: '2026-04-01 09:30:00'
  },
  {
    id: 2,
    employeeName: '李娜',
    idCard: '110101199102022345',
    phone: '13800138002',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 2,
    positionName: '后端工程师',
    expectedJoinDate: '2026-04-20',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-02',
    createTime: '2026-04-02 10:15:00'
  },
  {
    id: 3,
    employeeName: '王强',
    idCard: '110101199203033456',
    phone: '13800138003',
    departmentId: 2,
    departmentName: '产品部',
    positionId: 3,
    positionName: '产品经理',
    expectedJoinDate: '2026-04-18',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-03',
    createTime: '2026-04-03 11:20:00'
  },
  {
    id: 4,
    employeeName: '刘芳',
    idCard: '110101199304044567',
    phone: '13800138004',
    departmentId: 3,
    departmentName: '设计部',
    positionId: 4,
    positionName: 'UI设计师',
    expectedJoinDate: '2026-04-22',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-04',
    createTime: '2026-04-04 14:30:00'
  },
  {
    id: 5,
    employeeName: '陈明',
    idCard: '110101199405055678',
    phone: '13800138005',
    departmentId: 4,
    departmentName: '市场部',
    positionId: 5,
    positionName: '市场专员',
    expectedJoinDate: '2026-04-25',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-05',
    createTime: '2026-04-05 15:45:00'
  },
  {
    id: 6,
    employeeName: '赵丽',
    idCard: '110101199506066789',
    phone: '13800138006',
    departmentId: 5,
    departmentName: '人力资源部',
    positionId: 6,
    positionName: '招聘专员',
    expectedJoinDate: '2026-04-28',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-06',
    createTime: '2026-04-06 16:00:00'
  },
  {
    id: 7,
    employeeName: '孙杰',
    idCard: '110101199607077890',
    phone: '13800138007',
    departmentId: 6,
    departmentName: '财务部',
    positionId: 7,
    positionName: '会计',
    expectedJoinDate: '2026-04-30',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-07',
    createTime: '2026-04-07 09:00:00'
  },
  {
    id: 8,
    employeeName: '周敏',
    idCard: '110101199708088901',
    phone: '13800138008',
    departmentId: 1,
    departmentName: '技术部',
    positionId: 8,
    positionName: '测试工程师',
    expectedJoinDate: '2026-05-05',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-08',
    createTime: '2026-04-08 10:30:00'
  },
  {
    id: 9,
    employeeName: '吴涛',
    idCard: '110101199809099012',
    phone: '13800138009',
    departmentId: 2,
    departmentName: '产品部',
    positionId: 9,
    positionName: '产品助理',
    expectedJoinDate: '2026-05-08',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-09',
    createTime: '2026-04-09 11:45:00'
  },
  {
    id: 10,
    employeeName: '郑红',
    idCard: '110101199910100123',
    phone: '13800138010',
    departmentId: 4,
    departmentName: '市场部',
    positionId: 10,
    positionName: '销售代表',
    expectedJoinDate: '2026-05-10',
    status: 3,
    statusName: '待入职',
    applyDate: '2026-04-09',
    createTime: '2026-04-09 13:00:00'
  }
]

// 使用 createCrudMock 创建 Mock 函数
const crudMock = createCrudMock<PendingEmployee>(initialData, {
  idField: 'id',
  searchFields: ['employeeName']
})

// 导出 Mock 函数
export const getListMock = crudMock.getList
export const getDetailMock = crudMock.getDetail
