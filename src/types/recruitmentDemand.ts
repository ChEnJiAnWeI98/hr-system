/**
 * 招聘需求管理类型定义
 */

/**
 * 审批节点
 * 用于招聘需求的多级审批流：直属上级 → HRBP → HRD →（可选）CEO
 */
export interface ApprovalNode {
  /** 节点序号（从 0 开始） */
  nodeIndex: number
  /** 节点名称，如"直属上级审批"、"HRBP 审批"、"HRD 审批" */
  nodeName: string
  /** 审批人角色代码：R_DEPT_MANAGER / R_HR / R_SUPER */
  approverRole: string
  /** 审批人姓名（演示用预设名，Mock 阶段使用） */
  approverName: string
  /** 节点状态：0-待审批 1-已通过 2-已拒绝 3-已跳过 */
  status: number
  /** 审批时间 */
  approveTime?: string
  /** 审批意见 */
  opinion?: string
}

/**
 * 编制校验结果
 */
export interface EstablishmentCheckResult {
  /** 部门编制人数 */
  headcount: number
  /** 当前在编人数 */
  currentCount: number
  /** 本次需求人数 */
  recruitCount: number
  /** 招聘完成后预计在编数 */
  projectedCount: number
  /** 是否超编：0-不超编 1-超编 2-编制信息缺失 */
  overstaffed: number
  /** 校验说明 */
  message: string
}

/**
 * 招聘需求
 */
export interface RecruitmentDemand {
  /** ID */
  id: number
  /** 需求编号 */
  demandNo: string
  /** 申请部门（发起部门）名称 */
  departmentName: string
  /** 申请部门ID */
  departmentId?: number
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

  /** ========== 发起人信息（Phase 0 新增） ========== */
  /** 发起人（用人部门负责人）ID */
  hiringManagerId?: number
  /** 发起人姓名 */
  hiringManagerName?: string
  /** 发起人所在部门ID */
  hiringManagerDeptId?: number
  /** 发起人所在部门名称 */
  hiringManagerDeptName?: string

  /** ========== 审批相关 ========== */
  /** 审批状态 0-审批中 1-已通过 2-已驳回 3-已关闭 */
  approvalStatus: number
  /** 多节点审批链（Phase 0 新增） */
  approvalNodes?: ApprovalNode[]
  /** 当前审批节点索引（Phase 0 新增） */
  currentNodeIndex?: number
  /** 审批人（兼容旧字段；最终审批人姓名，便于列表展示） */
  approver: string
  /** 最终审批完成时间（兼容旧字段） */
  approvalTime: string
  /** 审批意见（兼容旧字段；最终一条意见） */
  approvalComment: string

  /** ========== 编制联动（Phase 0 新增） ========== */
  /** 编制校验结果（提交时自动写入，用于审批参考） */
  establishmentCheck?: EstablishmentCheckResult

  /** ========== 职位关联（HR 发布职位后回写，Phase 0 新增） ========== */
  /** 已发布职位数量 */
  publishedJobCount?: number

  /** ========== 关闭信息（Phase 0 新增） ========== */
  /** 关闭原因 */
  closeReason?: string
  /** 关闭时间 */
  closeTime?: string

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
  /** 仅查询当前登录用户发起的需求（Phase 0 新增） */
  onlyMine?: boolean
  /** 仅查询当前登录用户待审批的需求（Phase 0 新增） */
  onlyMyPending?: boolean
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
