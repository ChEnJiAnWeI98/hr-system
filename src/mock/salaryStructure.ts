import type { SalaryStructure, SalaryStructureListParams } from '@/types/salary'
import { createCrudMock } from '@/utils/crud'

// 状态映射
const statusMap: Record<number, string> = {
  1: '启用',
  0: '停用'
}

// 初始数据
const initialData: SalaryStructure[] = [
  {
    id: 1,
    structureName: '标准薪资结构',
    salaryItems: [
      { name: '基本工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '绩效工资', type: 1, calcMethod: 2, includeTax: true },
      { name: '岗位津贴', type: 1, calcMethod: 1, includeTax: true },
      { name: '加班费', type: 1, calcMethod: 2, includeTax: true },
      { name: '社保个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '公积金个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 基本工资 + 绩效工资 + 岗位津贴 + 加班费 - 社保个人缴纳 - 公积金个人缴纳 - 个人所得税',
    applicableScope: '全体员工',
    status: 1,
    statusName: '启用',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    structureName: '销售提成薪资结构',
    salaryItems: [
      { name: '基本工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '销售提成', type: 1, calcMethod: 2, includeTax: true },
      { name: '绩效奖金', type: 1, calcMethod: 2, includeTax: true },
      { name: '交通补贴', type: 1, calcMethod: 1, includeTax: false },
      { name: '社保个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '公积金个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 基本工资 + 销售提成 + 绩效奖金 + 交通补贴 - 社保个人缴纳 - 公积金个人缴纳 - 个人所得税',
    applicableScope: '销售部',
    status: 1,
    statusName: '启用',
    createTime: '2024-01-15 14:00:00',
    updateTime: '2024-01-15 14:00:00'
  },
  {
    id: 3,
    structureName: '技术岗位薪资结构',
    salaryItems: [
      { name: '基本工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '技术津贴', type: 1, calcMethod: 1, includeTax: true },
      { name: '项目奖金', type: 1, calcMethod: 2, includeTax: true },
      { name: '加班费', type: 1, calcMethod: 2, includeTax: true },
      { name: '餐补', type: 1, calcMethod: 1, includeTax: false },
      { name: '社保个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '公积金个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 基本工资 + 技术津贴 + 项目奖金 + 加班费 + 餐补 - 社保个人缴纳 - 公积金个人缴纳 - 个人所得税',
    applicableScope: '技术部',
    status: 1,
    statusName: '启用',
    createTime: '2024-02-01 09:00:00',
    updateTime: '2024-02-01 09:00:00'
  },
  {
    id: 4,
    structureName: '管理层薪资结构',
    salaryItems: [
      { name: '基本工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '管理津贴', type: 1, calcMethod: 1, includeTax: true },
      { name: '年终奖金', type: 1, calcMethod: 2, includeTax: true },
      { name: '车补', type: 1, calcMethod: 1, includeTax: false },
      { name: '通讯补贴', type: 1, calcMethod: 1, includeTax: false },
      { name: '社保个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '公积金个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 基本工资 + 管理津贴 + 年终奖金 + 车补 + 通讯补贴 - 社保个人缴纳 - 公积金个人缴纳 - 个人所得税',
    applicableScope: '管理层',
    status: 1,
    statusName: '启用',
    createTime: '2024-02-10 11:00:00',
    updateTime: '2024-02-10 11:00:00'
  },
  {
    id: 5,
    structureName: '实习生薪资结构',
    salaryItems: [
      { name: '实习工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '餐补', type: 1, calcMethod: 1, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 实习工资 + 餐补 - 个人所得税',
    applicableScope: '实习生',
    status: 1,
    statusName: '启用',
    createTime: '2024-03-01 10:30:00',
    updateTime: '2024-03-01 10:30:00'
  },
  {
    id: 6,
    structureName: '旧版薪资结构（已停用）',
    salaryItems: [
      { name: '基本工资', type: 1, calcMethod: 1, includeTax: true },
      { name: '绩效工资', type: 1, calcMethod: 2, includeTax: true },
      { name: '社保个人缴纳', type: 2, calcMethod: 2, includeTax: false },
      { name: '个人所得税', type: 2, calcMethod: 2, includeTax: false }
    ],
    formula: '实发工资 = 基本工资 + 绩效工资 - 社保个人缴纳 - 个人所得税',
    applicableScope: '全体员工',
    status: 0,
    statusName: '停用',
    createTime: '2023-12-01 09:00:00',
    updateTime: '2024-01-01 10:00:00'
  }
]

// 创建 CRUD Mock
const salaryStructureMock = createCrudMock<SalaryStructure>(initialData, {
  searchFields: ['structureName']
})

/**
 * 获取薪资结构列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: SalaryStructureListParams) {
  const { status, ...otherParams } = params
  let result = salaryStructureMock.getList(otherParams)

  // 状态筛选
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    result.list = result.list.filter(item => item.status === statusValue)
  }

  result.total = result.list.length
  return result
}

/**
 * 添加薪资结构 Mock 函数（带自定义处理）
 */
export function addSalaryStructureMock(data: Partial<SalaryStructure>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    statusName: statusMap[data.status || 1] || '启用',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as SalaryStructure
  return salaryStructureMock.add(newData)
}

/**
 * 更新薪资结构 Mock 函数（带自定义处理）
 */
export function updateSalaryStructureMock(data: Partial<SalaryStructure>) {
  const updateData = {
    ...data,
    statusName: data.status !== undefined ? statusMap[data.status] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return salaryStructureMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = salaryStructureMock.getDetail
export const deleteSalaryStructureMock = salaryStructureMock.delete
export const batchDeleteSalaryStructuresMock = salaryStructureMock.batchDelete
