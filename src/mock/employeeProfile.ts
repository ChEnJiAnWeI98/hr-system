// @ts-nocheck
import type { EmployeeProfile } from '@/types/employeeSelfService'
import { createCrudMock } from '@/utils/crud'

// 初始数据 - 当前登录员工的个人信息
const initialData: EmployeeProfile[] = [
  {
    id: 1,
    employeeId: 1001,
    employeeName: '张三',
    gender: 1,
    birthDate: '1990-05-15',
    idCard: '110101199005151234',
    phone: '13800138000',
    email: 'zhangsan@company.com',
    emergencyContact: '李四',
    emergencyPhone: '13900139000',
    department: '技术部',
    position: '高级工程师',
    entryDate: '2020-03-01',
    workYears: 6,
    employmentType: 1,
    workStatus: 1,
    address: '北京市朝阳区建国路88号',
    education: '本科',
    major: '计算机科学与技术',
    graduateSchool: '北京大学',
    graduateDate: '2012-06-30',
    politicalStatus: '中共党员',
    maritalStatus: 1,
    nationality: '汉族',
    nativePlace: '北京',
    bankName: '中国工商银行',
    bankAccount: '6222021001234567890',
    createTime: '2020-03-01 09:00:00',
    updateTime: '2026-04-01 10:30:00'
  }
]

// 创建 CRUD Mock
export const employeeProfileMock = createCrudMock<EmployeeProfile>(initialData, {
  searchFields: ['employeeName', 'phone', 'email', 'idCard']
})
