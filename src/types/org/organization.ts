/**
 * 组织架构 类型定义（Phase 1.2）
 */

/** 组织节点类型 */
export type OrgNodeType = 'group' | 'company' | 'division' | 'department' | 'team' | 'virtual'

/** 组织状态 */
export type OrgStatus = 'active' | 'suspended' | 'dissolved' | 'establishing'

/**
 * 组织节点
 */
export interface Organization {
  id: number
  /** 组织编码（带业务层级语义：G01-BU01-D01-T01 格式）
   *  G = Group 集团 / BU = Business Unit 事业部/子公司 / D = Department 部门 / T = Team 组 */
  orgCode: string
  /** 组织名称 */
  orgName: string
  /** 父组织 ID */
  parentId: number | null
  /** 完整路径（便于权限判断，如 '/1/5/12'） */
  path: string
  /** 层级深度（从 1 开始） */
  level: number
  /** 节点类型 */
  nodeType: OrgNodeType
  /** 组织性质（字典 ORG_NATURE） */
  orgNature?: string
  /** 组织负责人 employeeId */
  managerId?: number
  /** 组织负责人姓名（冗余） */
  managerName?: string
  /** 分管 HRBP employeeId */
  hrbpId?: number
  hrbpName?: string
  /** 成本中心代码 */
  costCenter?: string
  /** 编制数 */
  headcount: number
  /** 实际人数（计算值） */
  actualCount: number
  /** 成立日期 */
  startDate: string
  /** 撤销日期 */
  endDate?: string
  /** 状态 */
  status: OrgStatus
  /** 排序 */
  sortOrder: number
  /** 描述 */
  description?: string
  createTime: string
  updateTime: string
  /** 子节点（树形展示时填充） */
  children?: Organization[]
}

/**
 * 组织演进事件类型
 */
export type OrgEventType = 'establish' | 'merge' | 'split' | 'rename' | 'dissolve' | 'move'

/**
 * 组织演进事件
 */
export interface OrgEvent {
  id: number
  eventType: OrgEventType
  orgId: number
  orgName: string
  /** 合并/迁移 目标组织 */
  targetOrgId?: number
  targetOrgName?: string
  /** 事件日期 */
  eventDate: string
  /** 操作人 */
  operator: string
  /** 事件描述 */
  description: string
  createTime: string
}

/** 组织迁移参数 */
export interface OrgMoveParams {
  /** 待迁移组织 ID */
  orgId: number
  /** 新父组织 ID */
  newParentId: number
  /** 是否携带子组织（整体迁移） */
  withChildren: boolean
  /** 迁移原因 */
  reason?: string
}

/** 字典映射 */
export const ORG_NODE_TYPE_LABEL: Record<OrgNodeType, string> = {
  group: '集团',
  company: '公司/子公司',
  division: '事业部',
  department: '部门',
  team: '小组',
  virtual: '虚拟组织'
}

export const ORG_NODE_TYPE_COLOR: Record<
  OrgNodeType,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  group: 'danger',
  company: 'warning',
  division: 'primary',
  department: 'success',
  team: 'info',
  virtual: 'info'
}

export const ORG_STATUS_LABEL: Record<OrgStatus, string> = {
  active: '运行中',
  suspended: '停用',
  dissolved: '已撤销',
  establishing: '筹建中'
}

export const ORG_STATUS_TYPE: Record<
  OrgStatus,
  'primary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  active: 'success',
  suspended: 'warning',
  dissolved: 'info',
  establishing: 'primary'
}

export const ORG_EVENT_TYPE_LABEL: Record<OrgEventType, string> = {
  establish: '成立',
  merge: '合并',
  split: '拆分',
  rename: '更名',
  dissolve: '撤销',
  move: '迁移'
}
