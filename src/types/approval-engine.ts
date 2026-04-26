/**
 * 审批流引擎模块类型定义
 */

/**
 * 模板状态枚举
 */
export enum TemplateStatus {
  /** 未启用 */
  INACTIVE = 0,
  /** 已启用 */
  ACTIVE = 1,
  /** 已停用 */
  DISABLED = 2
}

/**
 * 实例状态枚举
 */
export enum InstanceStatus {
  /** 待审批 */
  PENDING = 0,
  /** 审批中 */
  IN_PROGRESS = 1,
  /** 已通过 */
  APPROVED = 2,
  /** 已驳回 */
  REJECTED = 3,
  /** 已撤回 */
  WITHDRAWN = 4
}

/**
 * 节点状态枚举
 */
export enum NodeStatus {
  /** 待审批 */
  PENDING = 0,
  /** 已通过 */
  APPROVED = 1,
  /** 已驳回 */
  REJECTED = 2,
  /** 已转签 */
  TRANSFERRED = 3
}

/**
 * 审批操作枚举
 */
export enum ApprovalAction {
  /** 通过 */
  APPROVE = 1,
  /** 驳回 */
  REJECT = 2,
  /** 转签 */
  TRANSFER = 3,
  /** 加签 */
  ADD_SIGN = 4
}

/**
 * 代理范围枚举
 */
export enum DelegateScope {
  /** 全部审批 */
  ALL = 1,
  /** 指定审批类型 */
  SPECIFIC = 2
}

/**
 * 流程模板接口
 */
export interface ApprovalTemplate {
  /** 模板ID */
  id?: number
  /** 模板名称（最多50字符） */
  name?: string
  /** 适用范围（全公司/指定部门） */
  scope?: string
  /** 说明（最多200字符） */
  description?: string
  /** 流程配置 JSON */
  config?: any
  /** 流程配置（别名） */
  flowConfig?: any
  /** 默认抄送人列表 */
  ccUsers?: number[]
  /** 状态 */
  status?: TemplateStatus
  /** 创建人 */
  creator?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 审批实例接口
 */
export interface ApprovalInstance {
  /** 实例ID */
  id: number
  /** 审批编号（最多30字符） */
  code: string
  /** 审批类型（请假审批/报销审批/采购审批等） */
  type: string
  /** 审批标题（最多100字符） */
  title: string
  /** 发起人 */
  initiator: string
  /** 申请人（别名） */
  applicant?: string
  /** 发起时间 */
  initiateTime: string
  /** 申请时间（别名） */
  applyTime?: string
  /** 完成时间（别名） */
  finishTime?: string
  /** 说明 */
  description?: string
  /** 模板名称 */
  templateName?: string
  /** 审批表单数据 JSON */
  formData: any
  /** 附件列表 */
  attachments: string[]
  /** 抄送人列表 */
  ccUsers?: number[]
  /** 流程模板ID */
  templateId: number
  /** 当前节点ID */
  currentNode: string
  /** 状态 */
  status: InstanceStatus
  /** 完成时间 */
  completeTime?: string
}

/**
 * 审批节点记录接口
 */
export interface ApprovalNodeRecord {
  /** 记录ID */
  id: number
  /** 审批实例ID */
  instanceId: number
  /** 节点ID */
  nodeId: string
  /** 节点名称（最多50字符） */
  nodeName: string
  /** 审批人 */
  approver: string
  /** 接收时间 */
  receiveTime?: string
  /** 审批时间 */
  approveTime?: string
  /** 审批意见（最多500字符） */
  opinion?: string
  /** 审批操作 */
  action?: ApprovalAction
  /** 节点状态 */
  status: NodeStatus
}

/**
 * 节点记录接口（用于详情页显示）
 */
export interface NodeRecord {
  /** 记录ID */
  id: number
  /** 节点名称 */
  nodeName: string
  /** 审批人 */
  approver: string
  /** 接收时间 */
  receiveTime?: string
  /** 处理时间 */
  processTime: string
  /** 审批意见 */
  comment?: string
  /** 操作 */
  action?: number
  /** 状态 */
  status: number
  /** 转交给 */
  transferTo?: string
}

/**
 * 代理设置接口
 */
export interface ApprovalDelegate {
  /** 代理ID */
  id?: number
  /** 委托人 */
  delegator?: string
  /** 委托人ID */
  delegatorId?: number
  /** 代理人 */
  delegate?: string
  /** 代理人（别名） */
  delegatee?: string
  /** 代理人ID */
  delegateeId?: number
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 代理范围 */
  scope?: DelegateScope
  /** 审批类型列表（当 scope 为 SPECIFIC 时使用） */
  types?: string[]
  /** 模板ID列表 */
  templateIds?: number[]
  /** 代理原因 */
  reason?: string
  /** 状态（0停用/1启用） */
  status?: number
  /** 创建时间 */
  createTime?: string
}

/**
 * 审批统计接口
 */
export interface ApprovalStatistics {
  /** 总审批数 */
  totalCount: number
  /** 已通过数 */
  approvedCount: number
  /** 已驳回数 */
  rejectedCount: number
  /** 待审批数 */
  pendingCount: number
  /** 通过率（百分比） */
  approvalRate: number
  /** 平均审批时长（小时） */
  avgDuration: number
}

/**
 * 列表查询参数接口
 */
export interface ListParams {
  /** 模板名称 */
  name?: string
  /** 标题 */
  title?: string
  /** 状态（支持 number | string | null） */
  status?: number | string | null
  /** 审批类型 */
  type?: string
  /** 发起人 */
  initiator?: string
  /** 申请人（别名） */
  applicant?: string
  /** 优先级 */
  priority?: number | string | null
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 委托人 */
  delegator?: string
  /** 代理人 */
  delegate?: string
  /** 代理人（别名） */
  delegatee?: string
  /** 维度 */
  dimension?: string
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 待办事项
 */
export interface TodoItem {
  /** 待办ID */
  id: number
  /** 审批实例ID */
  instanceId: number
  /** 节点ID */
  nodeId?: string
  /** 审批编号 */
  code: string
  /** 审批类型 */
  type: string
  /** 审批标题 */
  title: string
  /** 实例标题（别名） */
  instanceTitle?: string
  /** 发起人 */
  initiator: string
  /** 申请人（别名） */
  applicant?: string
  /** 发起时间 */
  initiateTime: string
  /** 当前节点 */
  currentNode: string
  /** 节点名称 */
  nodeName?: string
  /** 优先级 */
  priority?: number
  /** 状态 */
  status: number
  /** 接收时间 */
  receiveTime: string
}

/**
 * 流程节点配置接口
 */
export interface FlowNodeConfig {
  /** 节点ID */
  id: string
  /** 节点名称 */
  name: string
  /** 节点类型（开始/审批/条件/结束） */
  type: 'start' | 'approval' | 'condition' | 'end'
  /** 审批人配置 */
  approvers?: {
    /** 审批人类型（指定人员/部门主管/角色） */
    type: 'user' | 'manager' | 'role'
    /** 审批人列表 */
    users?: string[]
    /** 角色ID */
    roleId?: number
    /** 审批方式（或签/会签） */
    mode?: 'or' | 'and'
  }
  /** 条件配置 */
  conditions?: {
    /** 字段名 */
    field: string
    /** 操作符 */
    operator: string
    /** 值 */
    value: any
  }[]
  /** 下一节点ID列表 */
  nextNodes: string[]
}

/**
 * 流程配置接口
 */
export interface FlowConfig {
  /** 流程节点列表 */
  nodes: FlowNodeConfig[]
  /** 流程版本 */
  version: string
  /** 流程描述 */
  description?: string
}
