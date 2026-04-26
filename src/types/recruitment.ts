/**
 * 招聘管理模块类型定义
 */

/**
 * 招聘需求
 */
export interface RecruitmentDemand {
  /** 需求ID */
  id: number
  /** 需求编号 */
  demandNo: string
  /** 职位名称 */
  positionName: string
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 招聘人数 */
  recruitCount: number
  /** 紧急程度：1-紧急 2-一般 3-不急 */
  urgency: number
  /** 紧急程度（别名） */
  urgencyLevel?: number
  /** 需求状态：1-待审批 2-已批准 3-招聘中 4-已完成 5-已取消 */
  status: number
  /** 期望到岗时间 */
  expectedArrivalDate: string
  /** 薪资范围 */
  salaryRange: string
  /** 工作地点 */
  workLocation: string
  /** 岗位职责 */
  jobResponsibilities: string
  /** 任职要求 */
  jobRequirements: string
  /** 备注 */
  remark?: string
  /** 申请人ID */
  applicantId: number
  /** 申请人姓名 */
  applicantName: string
  /** 申请时间 */
  applyTime: string
  /** 审批人ID */
  approverId?: number
  /** 审批人姓名 */
  approverName?: string
  /** 审批时间 */
  approveTime?: string
  /** 审批意见 */
  approveRemark?: string
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
  /** 职位名称 */
  positionName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 紧急程度 */
  urgency?: number | string | null
  /** 需求状态 */
  status?: number | string | null
  /** 申请人姓名 */
  applicantName?: string
  /** 申请时间开始 */
  applyTimeStart?: string
  /** 申请时间结束 */
  applyTimeEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 职位发布
 */
export interface JobPosting {
  /** 职位ID */
  id: number
  /** 职位编号 */
  jobNo: string
  /** 招聘需求ID */
  demandId: number
  /** 需求编号 */
  demandNo: string
  /** 职位名称 */
  positionName: string
  /** 部门名称 */
  departmentName: string
  /** 招聘人数 */
  recruitCount: number
  /** 发布状态：1-草稿 2-已发布 3-已下架 */
  status: number
  /** 发布渠道：多个渠道用逗号分隔，如 "1,2,3" */
  publishChannels: string
  /** 发布时间 */
  publishTime?: string
  /** 下架时间 */
  offlineTime?: string
  /** 薪资范围 */
  salaryRange: string
  /** 工作地点 */
  workLocation: string
  /** 工作年限要求 */
  workYearsRequired: string
  /** 学历要求 */
  educationRequired: string
  /** 岗位职责 */
  jobResponsibilities: string
  /** 任职要求 */
  jobRequirements: string
  /** 岗位亮点 */
  jobHighlights?: string
  /** 浏览次数 */
  viewCount: number
  /** 投递简历数 */
  resumeCount: number
  /** 创建人ID */
  creatorId: number
  /** 创建人姓名 */
  creatorName: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 职位发布列表查询参数
 */
export interface JobPostingListParams {
  /** 职位编号 */
  jobNo?: string
  /** 职位名称 */
  positionName?: string
  /** 需求编号 */
  demandNo?: string
  /** 发布状态 */
  status?: number | string | null
  /** 发布渠道 */
  publishChannel?: number | string | null
  /** 发布时间开始 */
  publishTimeStart?: string
  /** 发布时间结束 */
  publishTimeEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 简历
 */
export interface Resume {
  /** 简历ID */
  id: number
  /** 简历编号 */
  resumeNo: string
  /** 职位ID */
  jobId: number
  /** 职位编号 */
  jobNo: string
  /** 职位名称 */
  positionName: string
  /** 应聘岗位（别名） */
  position?: string
  /** 候选人姓名 */
  candidateName: string
  /** 性别：1-男 2-女 */
  gender: number
  /** 年龄 */
  age: number
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 现居地 */
  location?: string
  /** 当前状态：1-待筛选 2-初筛通过 3-初筛淘汰 4-面试中 5-面试通过 6-面试淘汰 7-已发Offer 8-已入职 */
  status: number
  /** 投递渠道：1-官网 2-招聘网站 3-内推 4-猎头 5-其他 */
  sourceChannel: number
  /** 来源渠道（别名） */
  source?: string
  /** 投递时间 */
  submitTime: string
  /** 期望薪资 */
  expectedSalary: string
  /** 当前薪资 */
  currentSalary: string
  /** 工作年限 */
  workYears: number
  /** 最高学历 */
  education: string
  /** 毕业院校 */
  graduateSchool: string
  /** 毕业院校（别名） */
  school?: string
  /** 专业 */
  major: string
  /** 标签 */
  tags?: string[]
  /** 简历附件URL */
  resumeFileUrl?: string
  /** 工作经历（JSON字符串） */
  workExperience?: string
  /** 项目经历（JSON字符串） */
  projectExperience?: string
  /** 技能特长 */
  skills?: string
  /** 自我评价 */
  selfEvaluation?: string
  /** 筛选人ID */
  screenerId?: number
  /** 筛选人姓名 */
  screenerName?: string
  /** 筛选时间 */
  screenTime?: string
  /** 筛选备注 */
  screenRemark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 简历列表查询参数
 */
export interface ResumeListParams {
  /** 简历编号 */
  resumeNo?: string
  /** 职位名称 */
  positionName?: string
  /** 应聘岗位（别名） */
  position?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 手机号 */
  phone?: string
  /** 来源渠道（别名） */
  source?: string
  /** 当前状态 */
  status?: number | string | null
  /** 投递渠道 */
  sourceChannel?: number | string | null
  /** 投递时间开始 */
  submitTimeStart?: string
  /** 投递时间结束 */
  submitTimeEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 面试
 */
export interface Interview {
  /** 面试ID */
  id: number
  /** 面试编号 */
  interviewNo: string
  /** 简历ID */
  resumeId: number
  /** 简历编号 */
  resumeNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 职位名称 */
  positionName: string
  /** 应聘岗位（别名） */
  position?: string
  /** 面试轮次：1-初试 2-复试 3-终试 */
  round: number
  /** 面试类型：1-电话面试 2-视频面试 3-现场面试 */
  type: number
  /** 面试类型（别名） */
  interviewType?: number
  /** 面试状态：1-待面试 2-已完成 3-已取消 */
  status: number
  /** 面试时间 */
  interviewTime: string
  /** 面试地点 */
  interviewLocation?: string
  /** 面试地点（别名） */
  location?: string
  /** 面试官ID列表（逗号分隔） */
  interviewerIds: string
  /** 面试官姓名列表（逗号分隔） */
  interviewerNames: string
  /** 面试官（别名） */
  interviewer?: string
  /** 面试结果：1-通过 2-待定 3-淘汰 */
  result?: number
  /** 综合评分（0-100） */
  score?: number
  /** 评分（别名） */
  rating?: number
  /** 面试评价 */
  evaluation?: string
  /** 面试反馈（JSON字符串，包含各维度评分） */
  feedback?: string
  /** 创建人ID */
  creatorId: number
  /** 创建人姓名 */
  creatorName: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 面试列表查询参数
 */
export interface InterviewListParams {
  /** 面试编号 */
  interviewNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 职位名称 */
  positionName?: string
  /** 应聘岗位（别名） */
  position?: string
  /** 面试轮次 */
  round?: number | string | null
  /** 面试类型 */
  type?: number | string | null
  /** 面试类型（别名） */
  interviewType?: number | string | null
  /** 面试状态 */
  status?: number | string | null
  /** 面试结果 */
  result?: number | string | null
  /** 面试时间开始 */
  interviewTimeStart?: string
  /** 面试时间结束 */
  interviewTimeEnd?: string
  /** 面试官姓名 */
  interviewerName?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * Offer
 */
export interface Offer {
  /** Offer ID */
  id: number
  /** Offer编号 */
  offerNo: string
  /** 简历ID */
  resumeId: number
  /** 简历编号 */
  resumeNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 职位名称 */
  positionName: string
  /** 部门名称 */
  departmentName: string
  /** Offer状态：1-待审批 2-已批准 3-已拒绝 4-已发送 5-已接受 6-已拒绝 7-已失效 */
  status: number
  /** 薪资待遇 */
  salary: string
  /** 试用期（月） */
  probationPeriod: number
  /** 试用期薪资 */
  probationSalary: string
  /** 期望入职日期 */
  expectedJoinDate: string
  /** 工作地点 */
  workLocation: string
  /** 福利待遇 */
  benefits?: string
  /** 其他说明 */
  otherInfo?: string
  /** 审批人ID */
  approverId?: number
  /** 审批人姓名 */
  approverName?: string
  /** 审批时间 */
  approveTime?: string
  /** 审批意见 */
  approveRemark?: string
  /** 发送时间 */
  sendTime?: string
  /** 候选人响应时间 */
  responseTime?: string
  /** 候选人响应意见 */
  responseRemark?: string
  /** 创建人ID */
  creatorId: number
  /** 创建人姓名 */
  creatorName: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * Offer列表查询参数
 */
export interface OfferListParams {
  /** Offer编号 */
  offerNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 职位名称 */
  positionName?: string
  /** Offer状态 */
  status?: number | string | null
  /** 期望入职日期开始 */
  expectedJoinDateStart?: string
  /** 期望入职日期结束 */
  expectedJoinDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 入职衔接
 */
export interface Onboarding {
  /** 入职ID */
  id: number
  /** 入职编号 */
  onboardingNo: string
  /** Offer ID */
  offerId: number
  /** Offer编号 */
  offerNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 员工姓名（别名） */
  employeeName?: string
  /** 职位名称 */
  positionName: string
  /** 入职岗位（别名） */
  position?: string
  /** 部门名称 */
  departmentName: string
  /** 所属部门（别名） */
  department?: string
  /** 入职状态：1-待入职 2-入职中 3-已入职 4-已取消 */
  status: number
  /** 计划入职日期 */
  plannedJoinDate: string
  /** 入职日期（别名） */
  onboardingDate?: string
  /** 实际入职日期 */
  actualJoinDate?: string
  /** 工号 */
  employeeNo?: string
  /** 导师分配 */
  mentorId?: number
  /** 导师姓名 */
  mentorName?: string
  /** 导师（别名） */
  mentor?: string
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 已完成资料数 */
  completedMaterials?: number
  /** 已完成资料数（别名） */
  completed?: number
  /** 总资料数 */
  totalMaterials?: number
  /** 账号状态：1-未开通 2-已开通 */
  accountStatus?: number
  /** 入职资料清单（JSON字符串） */
  documentChecklist?: string
  /** 入职培训计划（JSON字符串） */
  trainingPlan?: string
  /** 办公设备分配（JSON字符串） */
  equipmentAllocation?: string
  /** 系统账号开通（JSON字符串） */
  systemAccounts?: string
  /** 入职备注 */
  remark?: string
  /** 负责人ID */
  responsibleId: number
  /** 负责人姓名 */
  responsibleName: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 入职衔接列表查询参数
 */
export interface OnboardingListParams {
  /** 入职编号 */
  onboardingNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 员工姓名（别名） */
  employeeName?: string
  /** 职位名称 */
  positionName?: string
  /** 入职岗位（别名） */
  position?: string
  /** 入职状态 */
  status?: number | string | null
  /** 计划入职日期开始 */
  plannedJoinDateStart?: string
  /** 计划入职日期结束 */
  plannedJoinDateEnd?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 安排面试参数
 */
export interface ScheduleInterviewParams {
  /** 简历ID */
  resumeId: number
  /** 面试轮次 */
  round?: number
  /** 面试类型 */
  type?: number
  /** 面试时间 */
  interviewTime: string
  /** 面试地点 */
  interviewLocation?: string
  /** 面试地点（别名） */
  interviewer?: string
  /** 面试官ID列表 */
  interviewerIds?: string
  /** 备注 */
  remark?: string
}

/**
 * 招聘需求（扩展字段）
 */
export interface RecruitmentDemandExt extends Partial<RecruitmentDemand> {
  /** 备注 */
  remark?: string
  /** 紧急程度 */
  urgencyLevel?: number
}
