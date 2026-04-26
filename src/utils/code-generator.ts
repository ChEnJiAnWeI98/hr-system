/**
 * 编码规则生成器
 * Phase 1.1 - 统一生成员工号/合同号/组织号/岗位号
 */

/** 格式化 4 位流水号 */
const pad4 = (n: number) => String(n).padStart(4, '0')
const pad3 = (n: number) => String(n).padStart(3, '0')

/** 简单的进程级自增（Mock 环境） */
const counters: Record<string, number> = {
  employee: 0,
  contract: 0,
  org: 0,
  position: 0
}

/**
 * 生成员工编号
 * 格式：YG + YYYY + 4 位流水 → YG20260001
 */
export function genEmployeeNo(year?: number): string {
  const y = year ?? new Date().getFullYear()
  counters.employee += 1
  return `YG${y}${pad4(counters.employee)}`
}

/**
 * 生成合同编号
 * 格式：HT + YYYYMMDD + 4 位流水 → HT202604210001
 */
export function genContractNo(date?: Date): string {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  counters.contract += 1
  return `HT${y}${m}${day}${pad4(counters.contract)}`
}

/**
 * 生成组织编号
 * 格式：ORG + 3 位集团 + 3 位部门 → ORG001005
 */
export function genOrgCode(groupCode: string, deptNo?: number): string {
  if (deptNo === undefined) {
    counters.org += 1
    deptNo = counters.org
  }
  return `ORG${groupCode}${pad3(deptNo)}`
}

/**
 * 生成岗位编号
 * 格式：POS + 岗位族前缀（4位）+ 3 位流水 → POSTECH001
 */
export function genPositionCode(familyCode: string, seq?: number): string {
  if (seq === undefined) {
    counters.position += 1
    seq = counters.position
  }
  return `POS${familyCode.toUpperCase()}${pad3(seq)}`
}

/** 重置计数器（测试/Mock 场景用） */
export function resetCounter(type?: 'employee' | 'contract' | 'org' | 'position') {
  if (type) {
    counters[type] = 0
  } else {
    Object.keys(counters).forEach((k) => {
      counters[k] = 0
    })
  }
}

/** 设置计数器初始值（导入 Mock 数据后使用） */
export function setCounter(type: 'employee' | 'contract' | 'org' | 'position', value: number) {
  counters[type] = value
}
