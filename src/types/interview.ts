/**
 * 面试管理类型定义
 */

/**
 * 面试信息
 */
export interface Interview {
  /** ID */
  id: number
  /** 面试编号 */
  interviewNo: string
  /** 候选人姓名 */
  candidateName: string
  /** 应聘岗位 */
  applyPosition: string
  /** 面试轮次 */
  interviewRound: number
  /** 面试类型 1-初试 2-复试 3-终试 */
  interviewType: number
  /** 面试日期 */
  interviewDate: string
  /** 面试时间 */
  interviewTime: string
  /** 面试官 */
  interviewer: string
  /** 面试地点 */
  interviewLocation: string
  /** 面试链接（线上） */
  interviewLink: string
  /** 状态 1-待面试 2-已完成 3-已取消 */
  status: number
  /** 面试评分 */
  score: number
  /** 面试评价 */
  evaluation: string
  /** 面试结果 0-未评价 1-通过 2-不通过 3-待定 */
  result: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 列表查询参数
 */
export interface InterviewListParams {
  /** 面试编号 */
  interviewNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 应聘岗位 */
  applyPosition?: string
  /** 面试类型 */
  interviewType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 面试结果 */
  result?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
