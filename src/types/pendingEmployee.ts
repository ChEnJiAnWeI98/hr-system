/**
 * 待入职员工类型定义
 */

/**
 * 待入职员工实体
 */
export interface PendingEmployee {
  /** 入职申请记录ID */
  id: number
  /** 员工姓名 */
  employeeName: string
  /** 身份证号 */
  idCard: string
  /** 手机号 */
  phone: string
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 岗位ID */
  positionId: number
  /** 岗位名称 */
  positionName: string
  /** 期望入职日期 */
  expectedJoinDate: string
  /** 状态（3=待入职） */
  status: number
  /** 状态名称 */
  statusName: string
  /** 申请日期 */
  applyDate: string
  /** 创建时间 */
  createTime: string
}

/**
 * 待入职员工列表查询参数
 */
export interface PendingEmployeeListParams {
  /** 员工姓名（模糊搜索） */
  employeeName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 岗位ID */
  positionId?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
