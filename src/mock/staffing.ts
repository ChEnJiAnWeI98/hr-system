// @ts-nocheck
/**
 * 编制管理 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { Staffing, StaffingAdjustmentRecord } from '@/types/staffing'
import { getEmployeeListMock } from './employee'
import { departmentMock } from './department'

/**
 * 统计部门在编人数
 * 从员工档案中统计状态为"在职"(status=1)的员工数量
 * @param departmentId 部门ID，0表示统计所有部门，1（总公司）统计全公司
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
    console.error('统计在编人数失败:', error)
    return 0
  }
}

/**
 * 获取部门的父部门ID
 */
const getParentDepartmentId = (departmentId: number): number | null => {
  const allDepartments = departmentMock.getData()

  // 递归查找部门
  const findDepartment = (depts: any[], targetId: number): any => {
    for (const dept of depts) {
      if (dept.id === targetId) {
        return dept
      }
      if (dept.children && dept.children.length > 0) {
        const found = findDepartment(dept.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  const department = findDepartment(allDepartments, departmentId)
  return department ? department.parentId : null
}

/**
 * 检查子部门编制总和是否超过父部门编制
 * @param year 年度
 * @param departmentId 当前部门ID
 * @param headcount 当前部门编制人数
 * @param excludeId 排除的编制记录ID（用于编辑时排除自己）
 * @returns { valid: boolean, message: string }
 */
const checkParentHeadcountLimit = (
  year: number,
  departmentId: number,
  headcount: number,
  excludeId?: number
): { valid: boolean; message: string } => {
  // 如果是总公司（根部门），不需要检查
  const parentId = getParentDepartmentId(departmentId)
  if (!parentId) {
    return { valid: true, message: '' }
  }

  // 查询父部门的编制
  const allStaffings = staffingMock.getData()
  const parentStaffing = allStaffings.find(
    item => item.year === year && item.departmentId === parentId
  )

  if (!parentStaffing) {
    return {
      valid: false,
      message: `父部门本年度编制计划不存在，请先创建父部门编制计划`
    }
  }

  // 查询同级所有部门的编制总和（排除当前编辑的记录）
  const siblingStaffings = allStaffings.filter(
    item => {
      if (item.year !== year) return false
      if (excludeId && item.id === excludeId) return false

      // 查找同级部门（父部门相同）
      const itemParentId = getParentDepartmentId(item.departmentId)
      return itemParentId === parentId
    }
  )

  const siblingTotal = siblingStaffings.reduce((sum, item) => sum + item.headcount, 0)
  const newTotal = siblingTotal + headcount

  if (newTotal > parentStaffing.headcount) {
    return {
      valid: false,
      message: `子部门编制总和（${newTotal}人）超过父部门编制（${parentStaffing.headcount}人），请先调整父部门编制`
    }
  }

  return { valid: true, message: '' }
}

/**
 * 计算编制状态
 * 正常：在编人数 ≤ 计划编制人数
 * 缺编：在编人数 < 计划编制人数 × 80%
 * 超编：在编人数 > 计划编制人数
 */
const calculateStaffingStatus = (headcount: number, currentCount: number): number => {
  if (currentCount > headcount) return 2 // 超编
  if (currentCount < headcount * 0.8) return 1 // 缺编
  return 0 // 正常
}

/**
 * 计算缺编人数
 */
const calculateShortage = (headcount: number, currentCount: number): number => {
  const shortage = headcount - currentCount
  return shortage > 0 ? shortage : 0
}

/**
 * 计算超编人数
 */
const calculateOverstaffing = (headcount: number, currentCount: number): number => {
  const overstaffing = currentCount - headcount
  return overstaffing > 0 ? overstaffing : 0
}

/**
 * 初始编制数据（只存储计划编制人数，在编人数从员工档案统计）
 */
const mockStaffings: Staffing[] = [
  {
    id: 1,
    year: 2024,
    departmentId: 1,
    departmentName: '总公司',
    headcount: 500,
    remark: '2024年度总编制计划',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    year: 2024,
    departmentId: 2,
    departmentName: '技术部',
    headcount: 150,
    remark: '技术团队扩张计划',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 3,
    year: 2024,
    departmentId: 3,
    departmentName: '前端组',
    headcount: 60,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 4,
    year: 2024,
    departmentId: 4,
    departmentName: '后端组',
    headcount: 80,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 5,
    year: 2024,
    departmentId: 5,
    departmentName: '产品部',
    headcount: 80,
    remark: '产品线扩张',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 6,
    year: 2024,
    departmentId: 6,
    departmentName: '人事部',
    headcount: 50,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 7,
    year: 2024,
    departmentId: 7,
    departmentName: '财务部',
    headcount: 40,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 8,
    year: 2024,
    departmentId: 8,
    departmentName: '市场部',
    headcount: 70,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 9,
    year: 2024,
    departmentId: 9,
    departmentName: '销售部',
    headcount: 100,
    remark: '销售团队超编',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 10,
    year: 2024,
    departmentId: 10,
    departmentName: '客服部',
    headcount: 60,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 11,
    year: 2025,
    departmentId: 1,
    departmentName: '总公司',
    headcount: 550,
    remark: '2025年度扩张计划',
    createTime: '2024-10-01 10:00:00',
    updateTime: '2024-10-01 10:00:00'
  },
  {
    id: 12,
    year: 2025,
    departmentId: 2,
    departmentName: '技术部',
    headcount: 180,
    remark: '2025年技术团队扩张',
    createTime: '2024-10-01 10:00:00',
    updateTime: '2024-10-01 10:00:00'
  },
  {
    id: 13,
    year: 2026,
    departmentId: 1,
    departmentName: '总公司',
    headcount: 600,
    remark: '2026年度持续扩张计划',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 14,
    year: 2026,
    departmentId: 2,
    departmentName: '技术部',
    headcount: 200,
    remark: '2026年技术团队持续扩张',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 15,
    year: 2026,
    departmentId: 3,
    departmentName: '前端组',
    headcount: 70,
    remark: '前端团队扩充',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 16,
    year: 2026,
    departmentId: 4,
    departmentName: '后端组',
    headcount: 90,
    remark: '后端团队扩充',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 17,
    year: 2026,
    departmentId: 5,
    departmentName: '产品部',
    headcount: 90,
    remark: '产品线持续扩张',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 18,
    year: 2026,
    departmentId: 6,
    departmentName: '人事部',
    headcount: 55,
    remark: '人力资源团队扩充',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 19,
    year: 2026,
    departmentId: 7,
    departmentName: '财务部',
    headcount: 45,
    remark: '财务团队稳定',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 20,
    year: 2026,
    departmentId: 8,
    departmentName: '市场部',
    headcount: 80,
    remark: '市场推广力度加大',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 21,
    year: 2026,
    departmentId: 9,
    departmentName: '销售部',
    headcount: 110,
    remark: '销售团队持续扩张',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  },
  {
    id: 22,
    year: 2026,
    departmentId: 10,
    departmentName: '客服部',
    headcount: 65,
    remark: '客服团队扩充',
    createTime: '2025-10-01 10:00:00',
    updateTime: '2025-10-01 10:00:00'
  }
]

/**
 * 初始编制调整记录数据
 */
let mockAdjustmentRecords: StaffingAdjustmentRecord[] = [
  {
    id: 1,
    departmentId: 2,
    departmentName: '技术部',
    adjustTime: '2024-01-15 14:30:00',
    beforeCount: 140,
    afterCount: 150,
    reason: '业务扩张，增加技术人员编制',
    operator: '张三',
    createTime: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    departmentId: 5,
    departmentName: '产品部',
    adjustTime: '2024-02-01 10:00:00',
    beforeCount: 75,
    afterCount: 80,
    reason: '新产品线启动，增加产品经理编制',
    operator: '李四',
    createTime: '2024-02-01 10:00:00'
  },
  {
    id: 3,
    departmentId: 9,
    departmentName: '销售部',
    adjustTime: '2024-02-20 16:00:00',
    beforeCount: 90,
    afterCount: 100,
    reason: '市场拓展需要，增加销售人员编制',
    operator: '王五',
    createTime: '2024-02-20 16:00:00'
  },
  {
    id: 4,
    departmentId: 6,
    departmentName: '人事部',
    adjustTime: '2024-03-10 11:00:00',
    beforeCount: 45,
    afterCount: 50,
    reason: '人力资源管理需求增加',
    operator: '赵六',
    createTime: '2024-03-10 11:00:00'
  },
  {
    id: 5,
    departmentId: 8,
    departmentName: '市场部',
    adjustTime: '2024-03-25 15:30:00',
    beforeCount: 65,
    afterCount: 70,
    reason: '品牌推广活动增加，需要更多市场人员',
    operator: '孙七',
    createTime: '2024-03-25 15:30:00'
  }
]

let nextAdjustmentId = 6
let nextStaffingId = 23

/**
 * 创建编制 CRUD Mock 函数
 */
export const staffingMock = createCrudMock<Staffing>(mockStaffings, {
  searchFields: ['departmentName'],
  beforeGetList: (data) => {
    // 查询列表时，为每条记录动态计算在编人数和相关字段
    return data.map(item => {
      const currentCount = calculateCurrentCount(item.departmentId)
      const shortage = calculateShortage(item.headcount, currentCount)
      const overstaffing = calculateOverstaffing(item.headcount, currentCount)
      const status = calculateStaffingStatus(item.headcount, currentCount)

      return {
        ...item,
        currentCount,
        shortage,
        overstaffing,
        status
      }
    })
  }
})

/**
 * 获取编制统计信息（支持筛选条件）
 * 统计逻辑：
 * - 总编制人数：只统计总公司（departmentId=1）的编制人数
 * - 在编人数：统计全公司所有在职员工数量
 * - 缺编/超编：基于总公司编制与全公司在编人数计算
 */
export function getStaffingStatisticsMock(params: any = {}) {
  const { year, departmentId, status } = params
  let allData = staffingMock.getData()

  // 根据筛选条件过滤数据
  if (year !== undefined && year !== null && year !== '') {
    const yearValue = typeof year === 'string' ? parseInt(year) : year
    allData = allData.filter(item => item.year === yearValue)
  }

  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    allData = allData.filter(item => item.departmentId === deptId)
  }

  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    allData = allData.filter(item => item.status === statusValue)
  }

  // 总编制人数：只统计总公司（departmentId=1）的编制
  const companyStaffing = allData.find(item => item.departmentId === 1)
  const totalHeadcount = companyStaffing ? companyStaffing.headcount : 0

  // 在编人数：统计全公司所有在职员工（从员工档案统计）
  const totalCurrentCount = calculateCurrentCount(0) // 0表示统计所有部门

  // 缺编/超编：基于总公司编制与全公司在编人数计算
  const totalShortage = calculateShortage(totalHeadcount, totalCurrentCount)
  const totalOverstaffing = calculateOverstaffing(totalHeadcount, totalCurrentCount)

  // 部门状态统计
  const normalCount = allData.filter(item => item.status === 0).length
  const shortageCount = allData.filter(item => item.status === 1).length
  const overstaffingCount = allData.filter(item => item.status === 2).length

  return {
    totalHeadcount,
    totalCurrentCount,
    totalShortage,
    totalOverstaffing,
    normalCount,
    shortageCount,
    overstaffingCount
  }
}

/**
 * 新增编制（支持唯一性校验和层级约束校验）
 */
export function addStaffingMock(data: Partial<Staffing>) {
  const allData = staffingMock.getData()

  // 校验同一年度同一部门是否已存在编制计划
  const exists = allData.some(
    item => item.year === data.year && item.departmentId === data.departmentId
  )

  if (exists) {
    throw new Error('该部门本年度编制计划已存在')
  }

  // 层级约束校验：检查子部门编制总和是否超过父部门编制
  const checkResult = checkParentHeadcountLimit(
    data.year!,
    data.departmentId!,
    data.headcount || 0
  )

  if (!checkResult.valid) {
    throw new Error(checkResult.message)
  }

  const newStaffing: Staffing = {
    id: nextStaffingId++,
    year: data.year!,
    departmentId: data.departmentId!,
    departmentName: data.departmentName!,
    headcount: data.headcount || 0,
    remark: data.remark || '',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }

  return staffingMock.add(newStaffing)
}

/**
 * 更新编制（重写以支持自动计算、记录调整历史和层级约束校验）
 */
export function updateStaffingMock(data: Partial<Staffing>) {
  const oldData = staffingMock.getDetail(data.id!)
  if (!oldData) {
    throw new Error('编制数据不存在')
  }

  // 如果编制人数发生变化，进行层级约束校验
  if (data.headcount !== undefined && data.headcount !== oldData.headcount) {
    // 层级约束校验：检查子部门编制总和是否超过父部门编制
    const checkResult = checkParentHeadcountLimit(
      oldData.year,
      oldData.departmentId,
      data.headcount,
      data.id // 排除当前记录
    )

    if (!checkResult.valid) {
      throw new Error(checkResult.message)
    }

    // 记录调整历史
    const record: StaffingAdjustmentRecord = {
      id: nextAdjustmentId++,
      departmentId: oldData.departmentId,
      departmentName: oldData.departmentName,
      adjustTime: new Date().toLocaleString('zh-CN'),
      beforeCount: oldData.headcount,
      afterCount: data.headcount,
      reason: (data as any).reason || '编制调整',
      operator: (data as any).operator || '系统管理员',
      createTime: new Date().toLocaleString('zh-CN')
    }
    mockAdjustmentRecords.push(record)
  }

  // 更新编制数据（不包含计算字段）
  const updatedData = {
    id: data.id,
    year: data.year ?? oldData.year,
    departmentId: data.departmentId ?? oldData.departmentId,
    departmentName: data.departmentName ?? oldData.departmentName,
    headcount: data.headcount ?? oldData.headcount,
    remark: data.remark ?? oldData.remark,
    updateTime: new Date().toLocaleString('zh-CN')
  }

  return staffingMock.update(updatedData)
}

/**
 * 获取编制调整记录列表
 */
export function getAdjustmentRecordsMock(params: any = {}) {
  const { departmentId, page = 1, pageSize = 20 } = params

  let filteredData = [...mockAdjustmentRecords]

  // 按部门筛选
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter(item => item.departmentId === deptId)
  }

  // 按时间倒序排序
  filteredData.sort((a, b) => new Date(b.adjustTime).getTime() - new Date(a.adjustTime).getTime())

  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return { list, total }
}
