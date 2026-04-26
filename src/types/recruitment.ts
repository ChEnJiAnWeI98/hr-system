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

  /** ========== Phase 2.1 新增字段 ========== */
  /** 关联人才库档案ID（简历入库人才库后回写） */
  talentProfileId?: number
  /** 简历解析状态：pending-未解析 / parsing-解析中 / success-解析成功 / failed-解析失败 / manual-人工修正 */
  parseStatus?: 'pending' | 'parsing' | 'success' | 'failed' | 'manual'
  /** 原始解析结果 JSON（结构化数据） */
  parsedData?: string
  /** JD 匹配度评分 0-100 */
  jdMatchScore?: number
  /** 身份证号（脱敏存储） */
  idCard?: string
  /** 淘汰原因代码（关联淘汰原因字典） */
  rejectReasonCode?: string
  /** 淘汰原因文字（冗余存储便于展示） */
  rejectReasonText?: string
  /** 淘汰时间 */
  rejectTime?: string
  /** 淘汰操作人 */
  rejectByName?: string

  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 候选人笔记/评论（Phase 2.1 新增）
 * 在简历详情页的团队协作区使用，仅对内可见
 */
export interface CandidateNote {
  id: number
  /** 关联简历ID（一条笔记只属于一份简历） */
  resumeId: number
  /** 笔记作者 */
  authorId: number
  authorName: string
  authorAvatar?: string
  /** 笔记内容（支持 @提醒，格式 @姓名） */
  content: string
  /** 被 @ 提醒的用户ID列表（逗号分隔） */
  mentionedUserIds?: string
  /** 附件URLs（逗号分隔） */
  attachments?: string
  /** 回复的笔记ID（支持讨论回复） */
  replyToId?: number
  createTime: string
}

/**
 * 淘汰原因字典（Phase 2.1 预置）
 */
export const REJECT_REASON_OPTIONS = [
  { code: 'edu_mismatch', label: '学历不符合要求' },
  { code: 'exp_insufficient', label: '工作年限不足' },
  { code: 'salary_mismatch', label: '薪资不匹配' },
  { code: 'skill_gap', label: '技能差距较大' },
  { code: 'bg_check_fail', label: '背景调查不通过' },
  { code: 'comprehensive_fail', label: '综合能力不足' },
  { code: 'culture_mismatch', label: '文化匹配度不足' },
  { code: 'candidate_withdraw', label: '候选人主动放弃' },
  { code: 'position_closed', label: '职位已关闭' },
  { code: 'other', label: '其他原因' }
] as const

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

  /** ========== Phase 2.2 新增字段 ========== */
  /** 关联的面试评价模板ID（引用 Phase 1.1.1 模板） */
  evaluationTemplateId?: number
  /** 模板名称（冗余显示） */
  evaluationTemplateName?: string
  /** 视频面试链接（面试类型为视频时使用） */
  videoLink?: string
  /** 候选人是否确认面试：0-待确认 1-已确认 2-已改期 3-已取消 */
  candidateConfirmStatus?: number

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
 * 多人协同面试评价记录（Phase 2.2 新增）
 * 同一场面试由多位面试官独立打分，最后汇总
 */
export interface InterviewEvaluation {
  id: number
  /** 关联面试ID */
  interviewId: number
  /** 面试官ID */
  interviewerId: number
  /** 面试官姓名 */
  interviewerName: string
  /** 维度评分明细（JSON 字符串），格式：[{dimensionName, score, maxScore}] */
  dimensionScores: string
  /** 总分（各维度加权/求和后的结果） */
  totalScore: number
  /** 评语 */
  comment?: string
  /** 结果建议：'强烈推荐' / '通过' / '待定' / '不通过' */
  resultSuggestion: string
  /** 是否已提交（true 后对其他面试官可见） */
  submitted: boolean
  submitTime?: string
  createTime: string
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

  /** ========== Phase 2.3 新增字段 ========== */
  /** 关联的 Offer 模板ID */
  offerTemplateId?: number
  /** 模板名称（冗余展示） */
  offerTemplateName?: string
  /** 版本号（每次变更 +1） */
  version?: number
  /** 生成的 Offer 正文（变量替换后，用于预览/签署） */
  offerContent?: string
  /** 候选人拒绝原因代码（字典） */
  rejectReasonCode?: string
  /** 候选人拒绝原因说明 */
  rejectReasonText?: string
  /** 汇报对象（填入模板占位符 {{汇报对象}}） */
  reportingTo?: string
  /** 反馈截止时间 */
  feedbackDeadline?: string

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
 * Offer 拒绝原因字典（Phase 2.3 预置）
 */
export const OFFER_REJECT_REASON_OPTIONS = [
  { code: 'salary_low', label: '薪资不满意' },
  { code: 'location', label: '工作地点不合适' },
  { code: 'better_offer', label: '有更好的 Offer' },
  { code: 'family_reason', label: '家庭/个人原因' },
  { code: 'growth_concern', label: '对岗位发展空间有顾虑' },
  { code: 'commute', label: '通勤不便' },
  { code: 'company_reason', label: '对公司/团队有顾虑' },
  { code: 'other', label: '其他原因' }
] as const

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

  /** ========== Phase 2.4 新增字段 ========== */
  /** 关联的入职资料填报模板ID（引用 Phase 1.1.4） */
  onboardingTemplateId?: number
  /** 模板名称（冗余展示） */
  onboardingTemplateName?: string
  /** 候选人自助填报链接（H5） */
  fillLink?: string
  /** 候选人自助填报完成度（0-100） */
  fillProgress?: number
  /** 候选人已填报的字段值（JSON 字符串） */
  fillFormData?: string
  /** 候选人已上传的附件（JSON 字符串：[{name, url}]） */
  fillAttachments?: string
  /** 多部门任务分派（JSON 字符串） */
  multiDeptTasks?: string
  /** 鸽子预警状态：0-正常 1-已预警 */
  noShowAlert?: number
  /** 爽约原因 */
  noShowReason?: string
  /** 填报完成时间 */
  fillCompleteTime?: string

  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 多部门入职任务项（Phase 2.4）
 */
export interface MultiDeptTask {
  /** 任务名称 */
  name: string
  /** 责任部门：IT / 行政 / HRBP / 导师 / 其他 */
  owner: 'IT' | '行政' | 'HRBP' | '导师' | '其他'
  /** 具体经办人 */
  assignee?: string
  /** 状态：pending-待处理 / doing-进行中 / done-已完成 */
  status: 'pending' | 'doing' | 'done'
  /** 完成时间 */
  completeTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 爽约归档原因字典（Phase 2.4）
 */
export const NO_SHOW_REASON_OPTIONS = [
  { code: 'better_offer', label: '有更好的 Offer' },
  { code: 'family', label: '家庭原因' },
  { code: 'health', label: '健康原因' },
  { code: 'location', label: '异地搬迁困难' },
  { code: 'original_retention', label: '被原公司挽留' },
  { code: 'no_reason', label: '无故失联' },
  { code: 'other', label: '其他' }
] as const

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
