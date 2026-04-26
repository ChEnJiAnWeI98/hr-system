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
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
