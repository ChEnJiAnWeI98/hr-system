/**
 * 薪酬体系（薪酬带宽） Mock 数据（Phase 4.1）
 * 6 岗位族 × 9 职级 ≈ 54 个带宽区间
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { SalaryBand } from '@/types/comp/structure'

/**
 * 带宽基础公式（不同岗位族系数不同）
 * 技术族相对高，销售族分 base + 提成（简化为 base），管理族顶格
 */
const FAMILY_FACTOR: Record<string, number> = {
  TECH: 1.3,
  PROD: 1.2,
  SALES: 1.0,
  OPS: 0.95,
  FUNC: 0.95,
  MGMT: 1.1
}

/** 职级 → rank（用于计算基础薪资） */
const LEVEL_RANK: Record<string, number> = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
  P5: 5,
  P6: 6,
  P7: 7,
  P8: 8,
  P9: 9,
  P10: 10,
  M1: 5,
  M2: 7,
  M3: 8,
  M4: 9,
  M5: 10
}

/** 生成一个带宽 */
function makeBand(
  id: number,
  family: string,
  level: string,
  factor: number
): SalaryBand {
  const rank = LEVEL_RANK[level] ?? 5
  const base = 8000 + (rank - 1) * 3500 // 底薪递增
  const mid = Math.round((base * factor) / 1000) * 1000
  const min = Math.round((mid * 0.85) / 500) * 500
  const max = Math.round((mid * 1.25) / 500) * 500
  return {
    id,
    jobFamily: family,
    level,
    minSalary: min,
    midSalary: mid,
    maxSalary: max,
    year: 2026,
    remark: `${family} 族 ${level} 标准带宽`,
    createTime: '2025-12-20 10:00:00',
    updateTime: '2025-12-20 10:00:00'
  }
}

/** 生成所有带宽 */
function generateAllBands(): SalaryBand[] {
  const bands: SalaryBand[] = []
  let id = 1

  // 专业通道：P2~P10 × 5 个族（技术/产品/销售/运营/职能）
  const proLevels = ['P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10']
  const proFamilies = ['TECH', 'PROD', 'SALES', 'OPS', 'FUNC']
  for (const family of proFamilies) {
    const factor = FAMILY_FACTOR[family]
    for (const level of proLevels) {
      bands.push(makeBand(id++, family, level, factor))
    }
  }

  // 管理通道：M1~M5 × MGMT
  const mgmtLevels = ['M1', 'M2', 'M3', 'M4', 'M5']
  for (const level of mgmtLevels) {
    bands.push(makeBand(id++, 'MGMT', level, FAMILY_FACTOR.MGMT))
  }

  return bands
}

const initialData: SalaryBand[] = generateAllBands()

export const salaryBandMock = createCrudMock<SalaryBand>(initialData, {
  idField: 'id',
  searchFields: ['jobFamily', 'level']
})

/** 查找某岗位族 × 职级的带宽 */
export function findSalaryBand(jobFamily: string, level: string, year = 2026): SalaryBand | null {
  return (
    salaryBandMock
      .getData()
      .find((b) => b.jobFamily === jobFamily && b.level === level && b.year === year) || null
  )
}
