/**
 * 绩效档案类型定义
 */

/**
 * 绩效档案
 */
export interface PerformanceArchive {
  /** ID */
  id: number
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 岗位名称 */
  positionName: string
  /** 考核周期ID */
  cycleId: number
  /** 考核周期名称 */
  cycleName: string
  /** 最终得分 */
  finalScore: number
  /** 评级 */
  rating: string
  /** 部门排名 */
  ranking: number
  /** 部门总人数 */
  totalInDepartment: number
  /** 薪资调整（百分比） */
  salaryAdjustment: number
  /** 晋升情况 */
  promotion: string
  /** 创建时间 */
  createTime: string
}

/**
 * 绩效档案列表查询参数
 */
export interface PerformanceArchiveListParams {
  /** 员工姓名 */
  employeeName?: string
  /** 部门名称 */
  departmentName?: string
  /** 考核周期名称 */
  cycleName?: string
  /** 评级 */
  rating?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
