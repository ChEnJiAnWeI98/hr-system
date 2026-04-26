/**
 * 个税管理 Mock 数据（Phase 4.3）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import type { SpecialDeduction, YearTaxSettlement } from '@/types/comp/tax'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 生成专项附加扣除数据（约 40 条，覆盖多种类型） */
function buildDeductions(): SpecialDeduction[] {
  const types: SpecialDeduction['type'][] = [
    'child_education',
    'housing_loan',
    'housing_rent',
    'elder_support',
    'continuing_education',
    'serious_illness'
  ]
  const typeAmount: Record<SpecialDeduction['type'], number> = {
    child_education: 2000,
    continuing_education: 400,
    serious_illness: 0, // 年度限额 80000，这里 mock 为 0
    housing_loan: 1000,
    housing_rent: 1500,
    elder_support: 3000
  }
  const data: SpecialDeduction[] = []
  // 前 40 个员工各挂 1~2 个扣除
  EMPLOYEES.slice(0, 40).forEach((e, i) => {
    const type = types[i % types.length]
    data.push({
      id: i + 1,
      employeeId: e.id,
      employeeName: e.nameZh,
      type,
      monthlyAmount: typeAmount[type],
      year: 2026,
      remark: type === 'child_education' ? '子女 1 人' : type === 'elder_support' ? '独生子女' : undefined,
      status: 'active',
      createTime: '2026-01-10 10:00:00',
      updateTime: '2026-01-10 10:00:00'
    })
    // 部分员工挂 2 个
    if (i % 3 === 0) {
      const secondType = types[(i + 2) % types.length]
      data.push({
        id: 100 + i,
        employeeId: e.id,
        employeeName: e.nameZh,
        type: secondType,
        monthlyAmount: typeAmount[secondType],
        year: 2026,
        status: 'active',
        createTime: '2026-01-10 10:00:00',
        updateTime: '2026-01-10 10:00:00'
      })
    }
  })
  return data
}

export const specialDeductionMock = createCrudMock<SpecialDeduction>(
  alignEmployeeFields(buildDeductions()),
  {
    idField: 'id',
    searchFields: ['employeeName']
  }
)

/** 年度汇算清缴 Mock（简化：前 20 个员工）*/
function buildYearSettlements(): YearTaxSettlement[] {
  return EMPLOYEES.slice(0, 20).map((e, i) => {
    const yearlyIncome = (e.baseSalary || 15000) * 12 + (e.performanceBase || 0) * 12 * 0.9
    const totalSpecialDeduction = (i % 3 === 0 ? 36000 : 12000) // 年度
    const totalPaid = Math.round((yearlyIncome - totalSpecialDeduction - 60000) * 0.12)
    const realTax = Math.round((yearlyIncome - totalSpecialDeduction - 60000) * 0.1)
    return {
      id: i + 1,
      employeeId: e.id,
      employeeName: e.nameZh,
      year: 2025,
      totalIncome: yearlyIncome,
      totalSpecialDeduction,
      totalPaid,
      settlement: realTax - totalPaid,
      status: i < 10 ? 'settled' : 'pending'
    }
  })
}

export const yearSettlementMock = createCrudMock<YearTaxSettlement>(
  alignEmployeeFields(buildYearSettlements()),
  {
    idField: 'id',
    searchFields: ['employeeName']
  }
)
