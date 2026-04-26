/**
 * 职位发布管理类型定义
 */

/**
 * 职位发布
 */
export interface JobPosting {
  /** ID */
  id: number
  /** 职位编号 */
  jobNo: string
  /** 职位名称 */
  jobTitle: string
  /** 所属部门 */
  departmentName: string
  /** 招聘人数 */
  recruitCount: number
  /** 职位类型 1-全职 2-兼职 3-实习 */
  jobType: number
  /** 工作地点 */
  workLocation: string
  /** 薪资范围 */
  salaryRange: string
  /** 职位描述 */
  jobDescription: string
  /** 任职要求 */
  jobRequirements: string
  /** 发布平台 */
  publishPlatforms: string[]
  /** 状态 1-招聘中 2-已暂停 3-已关闭 */
  status: number
  /** 浏览次数 */
  viewCount: number
  /** 申请人数 */
  applyCount: number
  /** 发布时间 */
  publishTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string

  /** ========== 需求关联（Phase 0 新增） ========== */
  /** 关联的招聘需求ID（必填，职位必须基于已审批通过的需求创建） */
  demandId?: number
  /** 需求编号（冗余显示，便于列表查看） */
  demandNo?: string
  /** 发布人ID（HR） */
  publisherId?: number
  /** 发布人姓名（HR） */
  publisherName?: string

  /** ========== Phase 2.5 新增字段 ========== */
  /** 是否开放内推：0-否 1-是 */
  referralOpen?: number
  /** 内推专属链接（开启内推时自动生成） */
  referralLink?: string
  /** 内推海报图 URL */
  referralPoster?: string
  /** 仅内部可见（只对公司员工展示，不发布到对外渠道） */
  internalOnly?: number
  /** 克隆自哪个职位ID（用于追溯职位复制来源） */
  clonedFromId?: number
}

/**
 * 列表查询参数
 */
export interface JobPostingListParams {
  /** 职位编号 */
  jobNo?: string
  /** 职位名称 */
  jobTitle?: string
  /** 所属部门 */
  departmentName?: string
  /** 职位类型 */
  jobType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 关联招聘需求单号 */
  demandNo?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
