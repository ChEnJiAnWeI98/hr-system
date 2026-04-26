/**
 * 培训与发展 类型定义（Phase 4.8~4.11）
 * 决策 V2.0 8=A 管理型，不做在线播放器
 */

// ==========================================================================
// 课程管理（4.8）
// ==========================================================================

export type CourseCategory =
  | 'onboarding' // 新员工入职
  | 'general' // 通用技能
  | 'technical' // 岗位技能
  | 'management' // 管理课程
  | 'compliance' // 合规培训

export type CourseDeliveryMode =
  | 'offline' // 面授
  | 'online' // 在线（简化，不做播放器）
  | 'hybrid' // 混合

export interface Course {
  id: number
  courseCode: string // COURSE-001
  courseName: string
  category: CourseCategory
  /** 讲师 */
  instructorId?: number
  instructorName: string
  /** 课时（学时） */
  duration: number
  /** 参考费用（元） */
  cost: number
  /** 交付方式 */
  deliveryMode: CourseDeliveryMode
  /** 目标学员说明 */
  targetAudience: string
  /** 课程介绍 */
  description: string
  /** 学习目标 */
  objectives: string
  /** 是否上架 */
  status: 0 | 1
  /** 创建人 */
  createdBy: string
  createTime: string
  updateTime: string
}

// ==========================================================================
// 培训计划（4.9）
// ==========================================================================

export type PlanStatus =
  | 'draft' // 草稿
  | 'published' // 已发布（开放报名）
  | 'enrolling' // 报名中
  | 'in_progress' // 进行中
  | 'completed' // 已结业
  | 'cancelled' // 已取消

export interface TrainingPlan {
  id: number
  planNo: string // TP20260422001
  planName: string
  courseId: number
  courseName: string
  /** 时间 */
  startDate: string
  endDate: string
  /** 地点（线下）或在线链接（线上） */
  location: string
  /** 组织者 */
  organizerName: string
  organizerId: number
  /** 讲师 */
  instructorName: string
  /** 目标学员（组织 ID 或岗位族） */
  targetOrgIds?: number[]
  targetFamilies?: string[]
  /** 报名员工 ID */
  enrolledEmployees: number[]
  /** 容量上限 */
  capacity: number
  /** 已报名数 */
  enrolledCount: number
  /** 状态 */
  status: PlanStatus
  description?: string
  createTime: string
  updateTime: string
}

// ==========================================================================
// 培训记录（4.9）
// ==========================================================================

/**
 * 单个员工参加某次培训的记录
 */
export interface TrainingRecord {
  id: number
  planId: number
  planName: string
  courseId: number
  courseName: string
  courseCategory: CourseCategory
  employeeId: number
  employeeName: string
  orgName: string
  /** 报名时间 */
  enrollTime: string
  /** 签到状态（是否出勤）*/
  attended: boolean
  /** 考核成绩（100 分制） */
  score?: number
  /** 结业状态：通过 / 未通过 / 未考核 */
  completionStatus: 'passed' | 'failed' | 'pending'
  /** 结业时间 */
  completionTime?: string
  /** 学习时长（实际） */
  actualDuration?: number
  /** 反馈（满意度 1-5） */
  feedback?: number
  remark?: string
  createTime: string
}

// ==========================================================================
// 证书管理（4.9）
// ==========================================================================

export type CertificateType =
  | 'professional' // 职业资格证
  | 'internal' // 内部认证
  | 'external' // 外部培训证书

export interface Certificate {
  id: number
  certificateNo: string // CERT-20260422-001
  certificateName: string
  type: CertificateType
  /** 颁发机构 */
  issuer: string
  /** 关联培训计划（可选）*/
  planId?: number
  planName?: string
  /** 持有人 */
  employeeId: number
  employeeName: string
  orgName: string
  /** 颁发日期 */
  issueDate: string
  /** 有效期开始 */
  validFrom: string
  /** 有效期结束（空 = 永久有效）*/
  validTo?: string
  /** 状态：有效 / 即将到期（30 天内）/ 已过期 */
  status: 'valid' | 'expiring' | 'expired'
  /** 附件（证书扫描件 URL，Mock 仅占位） */
  attachmentUrl?: string
  createTime: string
  updateTime: string
}

// ==========================================================================
// 能力评估（4.10）扩展 Phase C1a
// ==========================================================================

/**
 * 能力评估记录（员工 × 能力项 × 评分）
 */
export interface CompetencyAssessment {
  id: number
  /** 被评估员工 */
  employeeId: number
  employeeName: string
  orgName: string
  /** 评估期（2026 Q1 / 2026 Q2 等） */
  assessmentPeriod: string
  /** 评估类型 */
  assessmentType: 'self' | 'supervisor' | 'hrbp' | 'synthesis'
  /** 评估项（每个能力对应一个分数 1~5）*/
  items: CompetencyAssessmentItem[]
  /** 综合评语 */
  overallComment?: string
  /** 评估人 */
  assessorId: number
  assessorName: string
  /** 状态 */
  status: 'draft' | 'submitted' | 'approved'
  submitTime?: string
  createTime: string
  updateTime: string
}

export interface CompetencyAssessmentItem {
  /** 能力 ID（引用 performanceCompetency） */
  competencyId: number
  competencyName: string
  /** 实际得分 1~5 */
  score: number
  /** 期望等级 */
  targetLevel: number
  /** 差距 = target - score */
  gap: number
  /** 评价 */
  comment?: string
}

// ==========================================================================
// 继任计划（4.11）
// ==========================================================================

export type SuccessionReadiness =
  | 'ready' // 就绪（0-1 年可接替）
  | 'developing' // 培养中（1-3 年）
  | 'long_term' // 长期（3-5 年）

/**
 * 关键岗位
 */
export interface KeyPosition {
  id: number
  positionId: number
  positionName: string
  /** 当前任职者 */
  currentIncumbentId: number
  currentIncumbentName: string
  /** 关键等级 */
  criticality: 'high' | 'medium' | 'low'
  /** 描述 */
  description?: string
  createTime: string
}

/**
 * 继任候选人
 */
export interface SuccessionCandidate {
  id: number
  keyPositionId: number
  candidateEmployeeId: number
  candidateName: string
  candidateOrgName: string
  candidatePositionName: string
  candidateLevel: string
  /** 准备度 */
  readiness: SuccessionReadiness
  /** 来源：9-box / 手动添加 */
  source: '9box' | 'manual'
  /** 9-box 位置（来源于 9-box 时填写） */
  nineBoxCell?: string
  /** 提名人 */
  nominatorName: string
  /** 提名时间 */
  nominationTime: string
  /** 评语 */
  comment?: string
}

// ==========================================================================
// 字典 / Label
// ==========================================================================

export const COURSE_CATEGORY_LABEL: Record<CourseCategory, string> = {
  onboarding: '新员工入职',
  general: '通用技能',
  technical: '岗位技能',
  management: '管理课程',
  compliance: '合规培训'
}

export const COURSE_CATEGORY_TYPE: Record<
  CourseCategory,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  onboarding: 'success',
  general: 'primary',
  technical: 'warning',
  management: 'danger',
  compliance: 'info'
}

export const DELIVERY_MODE_LABEL: Record<CourseDeliveryMode, string> = {
  offline: '面授',
  online: '在线',
  hybrid: '混合'
}

export const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  draft: '草稿',
  published: '已发布',
  enrolling: '报名中',
  in_progress: '进行中',
  completed: '已结业',
  cancelled: '已取消'
}

export const PLAN_STATUS_TYPE: Record<
  PlanStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  draft: 'info',
  published: 'primary',
  enrolling: 'warning',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'info'
}

export const COMPLETION_STATUS_LABEL: Record<TrainingRecord['completionStatus'], string> = {
  passed: '通过',
  failed: '未通过',
  pending: '未考核'
}

export const COMPLETION_STATUS_TYPE: Record<
  TrainingRecord['completionStatus'],
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  passed: 'success',
  failed: 'danger',
  pending: 'warning'
}

export const CERT_TYPE_LABEL: Record<CertificateType, string> = {
  professional: '职业资格',
  internal: '内部认证',
  external: '外部证书'
}

export const CERT_STATUS_LABEL: Record<Certificate['status'], string> = {
  valid: '有效',
  expiring: '即将到期',
  expired: '已过期'
}

export const CERT_STATUS_TYPE: Record<
  Certificate['status'],
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'danger'
}

export const READINESS_LABEL: Record<SuccessionReadiness, string> = {
  ready: '就绪（0~1 年）',
  developing: '培养中（1~3 年）',
  long_term: '长期（3~5 年）'
}

export const READINESS_TYPE: Record<
  SuccessionReadiness,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  ready: 'success',
  developing: 'primary',
  long_term: 'info'
}
