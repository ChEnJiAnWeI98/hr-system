/**
 * 人才库管理类型定义（需求说明书 11.3.3）
 */

/** 候选人教育经历 */
export interface EducationExperience {
  startYear: number
  endYear?: number
  school: string
  major: string
  degree: string // 高中/大专/本科/硕士/博士
}

/** 候选人工作经历 */
export interface WorkExperience {
  startDate: string
  endDate?: string
  company: string
  position: string
  description?: string
}

/** 候选人项目经历 */
export interface ProjectExperience {
  startDate: string
  endDate?: string
  projectName: string
  role: string
  description?: string
}

/** 候选人投递历史 */
export interface ApplyHistoryItem {
  applyDate: string
  positionName: string
  department: string
  status: string // 待筛选、面试中、已Offer、已入职、已淘汰等
  resultTime?: string
}

/**
 * 候选人档案
 */
export interface TalentProfile {
  id: number
  /** 候选人编号，格式 TP202604001 */
  talentNo: string
  /** 姓名 */
  name: string
  /** 性别：male/female/unknown */
  gender?: 'male' | 'female' | 'unknown'
  /** 出生日期 */
  birthDate?: string
  /** 手机号码（唯一） */
  mobile: string
  /** 邮箱（唯一） */
  email?: string
  /** 身份证号（脱敏存储） */
  idCard?: string
  /** 所在城市 */
  currentCity?: string
  /** 期望城市（多个逗号分隔） */
  expectedCity?: string
  /** 最高学历 */
  highestDegree?: string
  /** 毕业院校 */
  school?: string
  /** 专业 */
  major?: string
  /** 工作年限 */
  workYears?: number
  /** 当前公司 */
  currentCompany?: string
  /** 当前职位 */
  currentPosition?: string
  /** 期望薪资 */
  expectedSalary?: string
  /** 教育经历 */
  educationList?: EducationExperience[]
  /** 工作经历 */
  workList?: WorkExperience[]
  /** 项目经历 */
  projectList?: ProjectExperience[]
  /** 技能列表（逗号分隔） */
  skills?: string
  /** 候选人标签（逗号分隔） */
  tags?: string
  /** 所属人才池ID（逗号分隔） */
  poolIds?: string
  /** 所属 HR 用户ID */
  ownerId?: number
  ownerName?: string
  /** 来源：apply/refer/hunter/search/activity/other */
  source?: string
  /** 来源详情 */
  sourceDetail?: string
  /** 档案状态：active-活跃 frozen-冷冻 blacklist-黑名单 redlist-红名单 */
  profileStatus: 'active' | 'frozen' | 'blacklist' | 'redlist'
  /** 冷冻到期时间 */
  frozenUntil?: string
  /** 黑/红名单原因 */
  statusReason?: string
  /** 投递次数 */
  applyCount?: number
  /** 最近投递时间 */
  lastApplyTime?: string
  /** 投递历史 */
  applyHistory?: ApplyHistoryItem[]
  /** 简历附件URL */
  resumeUrl?: string
  remark?: string
  createTime?: string
  updateTime?: string
}

/**
 * 人才池
 */
export interface TalentPool {
  id: number
  poolName: string
  /** 池类型：system-系统预置 jobFamily-岗位族 bu-事业部 activity-招聘活动 hunter-猎头专属 */
  poolType: 'system' | 'jobFamily' | 'bu' | 'activity' | 'hunter'
  description?: string
  /** 负责人ID/姓名 */
  ownerId?: number
  ownerName?: string
  /** 池状态：1-启用 0-禁用 */
  status: number
  /** 可见范围：all-全员 department-部门 users-指定用户 owner-仅负责人 */
  visibility: 'all' | 'department' | 'users' | 'owner'
  /** 池内候选人数（动态计算） */
  candidateCount?: number
  createTime?: string
  updateTime?: string
}

/** 人才档案列表查询参数 */
export interface TalentProfileListParams {
  /** 关键词（姓名/手机/邮箱/技能/标签） */
  keyword?: string
  /** 人才池ID */
  poolId?: number | null
  /** 档案状态 */
  profileStatus?: 'active' | 'frozen' | 'blacklist' | 'redlist' | '' | null
  /** 期望城市 */
  expectedCity?: string
  /** 最低工作年限 */
  minWorkYears?: number | null
  /** 学历要求 */
  minDegree?: string
  /** 来源 */
  source?: string
  page: number
  pageSize: number
}

/** 查重参数 */
export interface DedupeCheckParams {
  mobile?: string
  email?: string
  idCard?: string
}

/** 查重结果 */
export interface DedupeCheckResult {
  matched: boolean
  profile?: TalentProfile
  matchField?: 'mobile' | 'email' | 'idCard'
}
