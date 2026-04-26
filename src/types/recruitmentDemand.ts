/**
 * 招聘需求管理类型定义
 */

/**
 * 招聘需求
 */
export interface RecruitmentDemand {
  /** ID */
  id: number
  /** 需求编号 */
  demandNo: string
  /** 申请部门 */
  departmentName: string
  /** 招聘岗位 */
  positionName: string
  /** 招聘人数 */
  recruitCount: number
  /** 紧急程度 1-一般 2-紧急 3-非常紧急 */
  urgencyLevel: number
  /** 需求原因 */
  demandReason: string
  /** 岗位要求 */
  jobRequirements: string
  /** 薪资范围 */
  salaryRange: string
  /** 期望到岗日期 */
  expectedOnboardDate: string
  /** 备注 */
  remark?: string
  /** 审批状态 0-待审批 1-已批准 2-已拒绝 */
  approvalStatus: number
  /** 审批人 */
  approver: string
  /** 审批时间 */
  approvalTime: string
  /** 审批意见 */
  approvalComment: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 招聘需求列表查询参数
 */
export interface RecruitmentDemandListParams {
  /** 需求编号 */
  demandNo?: string
  /** 申请部门 */
  departmentName?: string
  /** 招聘岗位 */
  positionName?: string
  /** 紧急程度 - 支持 number | string | null */
  urgencyLevel?: number | string | null
  /** 审批状态 - 支持 number | string | null */
  approvalStatus?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
