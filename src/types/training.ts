/**
 * 培训管理模块类型定义
 */

/**
 * 培训计划
 */
export interface TrainingPlan {
  /** 计划ID */
  id: number
  /** 计划编号 */
  planNo: string
  /** 计划名称 */
  planName: string
  /** 年度 */
  year: number
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 培训类型：1-内训 2-外训 3-混合 */
  trainingType: number
  /** 预算（元） */
  budget: number
  /** 状态：1-草稿 2-待审批 3-已批准 4-已拒绝 5-执行中 6-已完成 */
  status: number
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
  /** 培训目标 */
  trainingGoal: string
  /** 培训内容 */
  trainingContent: string
  /** 参与人数 */
  participantCount: number
  /** 负责人ID */
  responsibleId: number
  /** 负责人姓名 */
  responsibleName: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 培训计划列表查询参数
 */
export interface TrainingPlanListParams {
  /** 计划编号 */
  planNo?: string
  /** 计划名称 */
  planName?: string
  /** 部门名称 */
  departmentName?: string
  /** 年度 */
  year?: number | string | null
  /** 培训类型 */
  trainingType?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 培训课程
 */
export interface TrainingCourse {
  /** 课程ID */
  id: number
  /** 课程编号 */
  courseNo: string
  /** 课程名称 */
  courseName: string
  /** 课程类型：1-内训 2-外训 */
  courseType: number
  /** 课程分类 */
  courseCategory: string
  /** 课程分类（别名） */
  category?: string
  /** 讲师姓名 */
  instructorName: string
  /** 讲师（别名） */
  instructor?: string
  /** 课程时长（小时） */
  duration: number
  /** 课程费用（元） */
  cost: number
  /** 课程简介 */
  courseIntro: string
  /** 课程简介（别名） */
  description?: string
  /** 课程大纲 */
  courseOutline: string
  /** 适用对象 */
  targetAudience: string
  /** 容量 */
  capacity?: number
  /** 学分 */
  credits?: number
  /** 状态：1-启用 2-停用 */
  status: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 培训课程列表查询参数
 */
export interface TrainingCourseListParams {
  /** 课程编号 */
  courseNo?: string
  /** 课程名称 */
  courseName?: string
  /** 课程类型 */
  courseType?: number | string | null
  /** 课程分类 */
  category?: string
  /** 讲师 */
  instructor?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 培训记录
 */
export interface TrainingRecord {
  /** 记录ID */
  id: number
  /** 记录编号 */
  recordNo?: string
  /** 计划ID */
  planId: number
  /** 计划名称 */
  planName: string
  /** 课程ID */
  courseId: number
  /** 课程名称 */
  courseName: string
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 培训日期 */
  trainingDate: string
  /** 培训时长（小时） */
  duration: number
  /** 实际时长 */
  actualHours?: number
  /** 地点 */
  location?: string
  /** 讲师 */
  instructor?: string
  /** 参与人数 */
  participantCount?: number
  /** 签到状态 */
  checkInStatus?: number
  /** 出勤状态：1-出勤 2-缺勤 3-请假 */
  attendanceStatus: number
  /** 考核成绩 */
  examScore?: number
  /** 是否通过：1-通过 2-未通过 */
  isPassed?: number
  /** 状态 */
  status?: number
  /** 培训反馈 */
  feedback?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 培训记录查询参数
 */
export interface TrainingRecordQueryParams {
  /** 记录编号 */
  recordNo?: string
  /** 计划名称 */
  planName?: string
  /** 课程名称 */
  courseName?: string
  /** 员工姓名 */
  employeeName?: string
  /** 讲师 */
  instructor?: string
  /** 签到状态 */
  checkInStatus?: number | string | null
  /** 出勤状态 */
  attendanceStatus?: number | string | null
  /** 是否通过 */
  isPassed?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 培训评估
 */
export interface TrainingEvaluation {
  /** 评估ID */
  id: number
  /** 评估编号 */
  evaluationNo?: string
  /** 记录编号 */
  recordNo?: string
  /** 计划ID */
  planId: number
  /** 计划名称 */
  planName: string
  /** 课程ID */
  courseId: number
  /** 课程名称 */
  courseName: string
  /** 员工ID */
  employeeId: number
  /** 员工工号 */
  employeeCode: string
  /** 员工姓名 */
  employeeName: string
  /** 部门名称 */
  departmentName: string
  /** 课程内容评分 */
  contentScore: number
  /** 讲师评分 */
  instructorScore: number
  /** 组织评分 */
  organizationScore: number
  /** 综合评分 */
  overallScore: number
  /** 状态 */
  status?: number
  /** 评估意见 */
  evaluationComment?: string
  /** 评论 */
  comments?: string
  /** 改进建议 */
  improvementSuggestion?: string
  /** 评估时间 */
  evaluationTime: string
  /** 评估日期（别名） */
  evaluationDate?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 培训评估查询参数
 */
export interface TrainingEvaluationQueryParams {
  /** 评估编号 */
  evaluationNo?: string
  /** 计划名称 */
  planName?: string
  /** 课程名称 */
  courseName?: string
  /** 员工姓名 */
  employeeName?: string
  /** 状态 */
  status?: number | string | null
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
