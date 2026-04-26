/**
 * 入职管理类型定义
 */

/**
 * 入职申请列表查询参数
 */
export interface OnboardingListParams {
  /** 申请编号 */
  applicationNo?: string
  /** 候选人姓名 */
  candidateName?: string
  /** 部门ID */
  departmentId?: number | string | null
  /** 状态 */
  status?: number | string | null
  /** 预计入职日期开始 */
  expectedDateStart?: string
  /** 预计入职日期结束 */
  expectedDateEnd?: string
  /** 当前页码 */
  page?: number
  /** 每页大小 */
  pageSize?: number
}

/**
 * 审批记录
 */
export interface ApprovalRecord {
  /** 记录ID */
  id: number
  /** 审批人 */
  approver: string
  /** 审批人ID */
  approverId: number
  /** 审批结果 1-通过 2-拒绝 */
  result: number
  /** 审批结果名称 */
  resultName: string
  /** 审批意见 */
  comment: string
  /** 审批时间 */
  approvalTime: string
}

/**
 * 资料清单项
 */
export interface DocumentItem {
  /** 资料ID */
  id: number
  /** 资料名称 */
  name: string
  /** 是否必需 */
  required: boolean
  /** 是否已提交 */
  submitted: boolean
  /** 提交时间 */
  submitTime: string
  /** 备注 */
  remark: string
}

/**
 * 手续清单项
 */
export interface ProcedureItem {
  /** 手续ID */
  id: number
  /** 手续名称 */
  name: string
  /** 是否已完成 */
  completed: boolean
  /** 办理人 */
  handler: string
  /** 办理时间 */
  handleTime: string
  /** 备注 */
  remark: string
}

/**
 * 入职申请
 */
export interface OnboardingApplication {
  /** 申请ID */
  id: number
  /** 申请编号 */
  applicationNo?: string
  /** 候选人姓名 */
  candidateName: string
  /** 性别 1-男 2-女 */
  gender: number
  /** 身份证号 */
  idNumber: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 部门ID */
  departmentId: number
  /** 部门名称 */
  departmentName: string
  /** 岗位ID */
  positionId: number
  /** 岗位名称 */
  positionName: string
  /** 预计入职日期 */
  expectedDate: string
  /** 学历 */
  education?: string
  /** 毕业院校 */
  school?: string
  /** 工作经验 */
  workExperience?: string
  /** 已完成资料数 */
  completedMaterials?: number
  /** 账号状态 */
  accountStatus?: number
  /** 备注 */
  remark?: string
  /** 状态 1-待审批 2-已拒绝 3-待办理 4-待入职 5-已完成 6-已撤回 */
  status: number
  /** 状态名称 */
  statusName: string
  /** 申请人 */
  applicant: string
  /** 申请人ID */
  applicantId: number
  /** 申请时间 */
  applicationTime: string
  /** 审批记录 */
  approvalRecords: ApprovalRecord[]
  /** 资料清单 */
  documents: DocumentItem[]
  /** 手续清单 */
  procedures: ProcedureItem[]
  /** 员工工号 */
  employeeNo?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 模块职责说明：
 *
 * 【员工管理 > 入职办理】（OnboardingApplication）← 员工身份
 *   - 从招聘衔接（候选人身份）转交后的正式入职流程
 *   - 核心：审批 → 资料清单核验 → 手续清单（签合同/开账号/分设备/录档案）
 *   - 不做：候选人自助 H5 填报（那是招聘衔接的事）
 *   - 不做：鸽子预警/爽约归档（那是入职前的风险管理）
 *
 * 【招聘管理 > 入职衔接（Pre-Onboarding）】（types/recruitment.ts 的 Onboarding）← 候选人身份
 *   - 候选人接受 Offer 后到正式报到前的过渡期
 *   - 核心：H5 自助填报 + 资料收集 + 鸽子预警 + 爽约归档
 *   - 流程终点：完成资料收集 → 触发创建员工入职办理申请
 */

/**
 * 材料清单项（入职衔接用）
 */
export interface MaterialChecklistItem {
  /** 材料名称 */
  name: string
  /** 是否完成 */
  completed: boolean
}

/**
 * 入职衔接
 */
export interface Onboarding {
  /** ID */
  id: number
  /** 入职编号 */
  onboardingNo: string
  /** 员工姓名 */
  employeeName: string
  /** 联系电话 */
  phone: string
  /** 入职岗位 */
  position: string
  /** 所属部门 */
  departmentName: string
  /** 入职日期 */
  onboardDate: string
  /** 导师 */
  mentor: string
  /** 状态 1-待入职 2-材料准备中 3-已完成 */
  status: number
  /** 材料清单 */
  materialChecklist: MaterialChecklistItem[]
  /** 账号开通状态 0-未开通 1-已开通 */
  accountStatus: number
  /** 设备分配状态 0-未分配 1-已分配 */
  equipmentStatus: number
  /** 培训状态 0-未安排 1-已安排 2-已完成 */
  trainingStatus: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 入职衔接列表查询参数
 */
export interface OnboardingConnectionListParams {
  /** 入职编号 */
  onboardingNo?: string
  /** 员工姓名 */
  employeeName?: string
  /** 入职岗位 */
  position?: string
  /** 状态 */
  status?: number | string | null
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}
