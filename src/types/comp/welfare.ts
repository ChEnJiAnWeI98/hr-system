/**
 * 福利管理 类型定义（Phase 4.5）
 */

/**
 * 福利项（来自字典 WELFARE_ITEM）
 * - festival 节日福利
 * - birthday 生日福利
 * - health_check 体检
 * - travel 员工旅游
 * - insurance 商业保险
 * - family 家庭关爱
 * - annual_dinner 年会/团建
 */

export interface WelfareProgram {
  id: number
  /** 福利编码 */
  code: string
  /** 福利名称 */
  name: string
  /** 福利类型（字典 WELFARE_ITEM） */
  category: string
  /** 预算金额（年度）*/
  budgetAmount: number
  /** 适用范围（全员 / 按岗位族 / 按职级）*/
  scope: 'all' | 'byFamily' | 'byLevel'
  scopeValues?: string[]
  /** 发放频率 */
  frequency: 'once' | 'monthly' | 'quarterly' | 'annually' | 'festival'
  /** 描述 */
  description?: string
  status: 0 | 1
  createTime: string
  updateTime: string
}

/**
 * 福利发放记录
 */
export interface WelfareGrant {
  id: number
  programId: number
  programName: string
  category: string
  employeeId: number
  employeeName: string
  orgName: string
  /** 发放时间 */
  grantTime: string
  /** 发放金额或价值 */
  amount: number
  /** 发放方式 */
  grantMethod: 'cash' | 'voucher' | 'physical' | 'service'
  /** 状态 */
  status: 'granted' | 'pending' | 'cancelled'
  remark?: string
  createTime: string
}

export interface WelfareProgramListParams {
  name?: string
  category?: string
  status?: 0 | 1 | null
  page?: number
  pageSize?: number
}

export interface WelfareGrantListParams {
  employeeName?: string
  programId?: number
  category?: string
  dateRange?: [string, string]
  page?: number
  pageSize?: number
}

export const FREQUENCY_LABEL: Record<WelfareProgram['frequency'], string> = {
  once: '一次性',
  monthly: '按月',
  quarterly: '按季度',
  annually: '按年',
  festival: '按节日'
}

export const GRANT_METHOD_LABEL: Record<WelfareGrant['grantMethod'], string> = {
  cash: '现金',
  voucher: '代金券',
  physical: '实物',
  service: '服务'
}

export const GRANT_STATUS_LABEL: Record<WelfareGrant['status'], string> = {
  granted: '已发放',
  pending: '待发放',
  cancelled: '已取消'
}
