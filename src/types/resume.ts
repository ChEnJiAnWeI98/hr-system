/**
 * 简历管理类型定义
 */

/**
 * 简历列表查询参数
 */
export interface ResumeListParams {
  /** 简历编号 */
  resumeNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 应聘岗位 */
  applyPosition?: string
  /** 状态 - 支持 number | string | null */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 简历数据项
 */
export interface Resume {
  /** ID */
  id: number
  /** 简历编号 */
  resumeNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 性别 1-男 2-女 */
  gender: number
  /** 年龄 */
  age: number
  /** 联系电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 应聘岗位 */
  applyPosition: string
  /** 当前公司 */
  currentCompany: string
  /** 工作年限 */
  workYears: number
  /** 学历 */
  education: string
  /** 专业 */
  major: string
  /** 期望薪资 */
  expectedSalary: string
  /** 标签 */
  tags: string[]
  /** 来源渠道 */
  source: string
  /** 状态 1-待筛选 2-初筛通过 3-面试中 4-已录用 5-已淘汰 6-已入库 */
  status: number
  /** 简历附件 */
  resumeUrl: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}
