/**
 * 状态机配置（代码常量）
 * Phase 1.4 - 员工生命周期状态机
 * 后续 Phase 会扩展：合同状态机 / 招聘流程状态机 / 异动流程 / 离职流程
 */

import type { EmployeeStatus } from '@/types/employee/profile'

export interface StateMachineNode {
  name: string
  /** Element Plus Tag 类型 */
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  /** 允许流转到的下一个状态 */
  allowedNext: EmployeeStatus[]
  /** 允许执行的动作（UI 按钮绑定用） */
  allowedActions: string[]
  /** 描述 */
  description?: string
}

/**
 * 员工状态机
 *
 * 规则（Q1=A）：
 * - terminated 为终态，重新入职另开新员工档案
 * - transferring / seconded / offboarding 为过程态，需要显式完成才能回到 regular 或 terminated
 */
export const EMPLOYEE_STATE_MACHINE: Record<EmployeeStatus, StateMachineNode> = {
  pending_onboard: {
    name: '待入职',
    color: 'info',
    allowedNext: ['probation', 'terminated'],
    allowedActions: ['confirm_onboard', 'cancel_offer'],
    description: '已发 Offer 确认，尚未正式入职'
  },
  probation: {
    name: '试用期',
    color: 'warning',
    allowedNext: ['regular', 'terminated'],
    allowedActions: ['confirm_regular', 'terminate_probation', 'extend_probation'],
    description: '处于试用期，未转正'
  },
  regular: {
    name: '正式在职',
    color: 'success',
    allowedNext: ['transferring', 'seconded', 'offboarding'],
    allowedActions: ['start_transfer', 'start_secondment', 'resign'],
    description: '正式在职员工'
  },
  transferring: {
    name: '调动中',
    color: 'primary',
    allowedNext: ['regular'],
    allowedActions: ['complete_transfer', 'cancel_transfer'],
    description: '部门/岗位调动流程中'
  },
  seconded: {
    name: '借调中',
    color: 'primary',
    allowedNext: ['regular'],
    allowedActions: ['recall_from_secondment'],
    description: '借调到其他部门/项目'
  },
  offboarding: {
    name: '离职中',
    color: 'danger',
    allowedNext: ['terminated'],
    allowedActions: ['complete_offboarding', 'cancel_offboarding'],
    description: '离职办理中'
  },
  terminated: {
    name: '已离职',
    color: 'info',
    allowedNext: [],
    allowedActions: ['view_only'],
    description: '已离职终态，如需返聘请新建档案'
  }
}

/** 动作 label */
export const ACTION_LABEL: Record<string, string> = {
  confirm_onboard: '确认入职',
  cancel_offer: '取消 Offer',
  confirm_regular: '确认转正',
  terminate_probation: '试用期终止',
  extend_probation: '延长试用期',
  start_transfer: '发起调动',
  start_secondment: '发起借调',
  resign: '发起离职',
  complete_transfer: '完成调动',
  cancel_transfer: '取消调动',
  recall_from_secondment: '借调召回',
  complete_offboarding: '完成离职',
  cancel_offboarding: '撤销离职',
  view_only: '仅查看'
}

/** 判断是否允许从 from 流转到 to */
export function canTransit(from: EmployeeStatus, to: EmployeeStatus): boolean {
  return EMPLOYEE_STATE_MACHINE[from].allowedNext.includes(to)
}

/** 获取某状态下允许的动作 */
export function getAllowedActions(status: EmployeeStatus): string[] {
  return EMPLOYEE_STATE_MACHINE[status].allowedActions
}

// ==========================================================================
// Phase 3.1 异动状态机
// ==========================================================================

import type { TransferStatus } from '@/types/employee/transfer'

export interface TransferStateNode {
  name: string
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  allowedNext: TransferStatus[]
  allowedActions: string[]
}

/**
 * 异动状态流转图：
 *   draft → level1_reviewing → level2_reviewing → pending_effect → effective → archived
 *                │                    │                    │
 *                ├─ level1_rejected   ├─ level2_rejected   └─ cancelled
 */
export const TRANSFER_STATE_MACHINE: Record<TransferStatus, TransferStateNode> = {
  draft: {
    name: '草稿',
    color: 'info',
    allowedNext: ['level1_reviewing', 'cancelled'],
    allowedActions: ['submit', 'delete']
  },
  level1_reviewing: {
    name: '一级审批中',
    color: 'warning',
    allowedNext: ['level2_reviewing', 'level1_rejected'],
    allowedActions: ['approve', 'reject']
  },
  level1_rejected: {
    name: '一级已驳回',
    color: 'danger',
    allowedNext: [],
    allowedActions: ['view_only']
  },
  level2_reviewing: {
    name: '二级审批中',
    color: 'warning',
    allowedNext: ['pending_effect', 'level2_rejected'],
    allowedActions: ['approve', 'reject']
  },
  level2_rejected: {
    name: '二级已驳回',
    color: 'danger',
    allowedNext: [],
    allowedActions: ['view_only']
  },
  pending_effect: {
    name: '待生效',
    color: 'primary',
    allowedNext: ['effective', 'cancelled'],
    allowedActions: ['effect_now', 'cancel']
  },
  effective: {
    name: '已生效',
    color: 'success',
    allowedNext: ['archived'],
    allowedActions: ['archive']
  },
  cancelled: {
    name: '已撤销',
    color: 'info',
    allowedNext: [],
    allowedActions: ['view_only']
  },
  archived: {
    name: '已归档',
    color: 'info',
    allowedNext: [],
    allowedActions: ['view_only']
  }
}

// ==========================================================================
// Phase 3.2 离职状态机
// ==========================================================================

import type { OffboardingStatus } from '@/types/employee/offboarding'

export interface OffboardingStateNode {
  name: string
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  allowedNext: OffboardingStatus[]
  allowedActions: string[]
}

/**
 * 离职状态流转图：
 *   draft → dept_reviewing → hr_reviewing → handover → pending_last_day → completed
 *                │                │
 *                ├─ dept_rejected └─ hr_rejected
 *
 *   任何非终态阶段都可 → cancelled
 */
export const OFFBOARDING_STATE_MACHINE: Record<OffboardingStatus, OffboardingStateNode> = {
  draft: {
    name: '草稿',
    color: 'info',
    allowedNext: ['dept_reviewing', 'cancelled'],
    allowedActions: ['submit', 'delete']
  },
  dept_reviewing: {
    name: '部门审批中',
    color: 'warning',
    allowedNext: ['hr_reviewing', 'dept_rejected', 'cancelled'],
    allowedActions: ['approve', 'reject', 'cancel']
  },
  dept_rejected: {
    name: '部门已驳回',
    color: 'danger',
    allowedNext: [],
    allowedActions: ['view_only']
  },
  hr_reviewing: {
    name: 'HR 审批中',
    color: 'warning',
    allowedNext: ['handover', 'hr_rejected', 'cancelled'],
    allowedActions: ['approve', 'reject', 'cancel']
  },
  hr_rejected: {
    name: 'HR 已驳回',
    color: 'danger',
    allowedNext: [],
    allowedActions: ['view_only']
  },
  handover: {
    name: '交接中',
    color: 'primary',
    allowedNext: ['pending_last_day', 'cancelled'],
    allowedActions: ['complete_handover', 'cancel']
  },
  pending_last_day: {
    name: '待离职日',
    color: 'primary',
    allowedNext: ['completed', 'cancelled'],
    allowedActions: ['complete', 'cancel']
  },
  completed: {
    name: '已完成',
    color: 'success',
    allowedNext: [],
    allowedActions: ['view_only', 'issue_certificate']
  },
  cancelled: {
    name: '已取消',
    color: 'info',
    allowedNext: [],
    allowedActions: ['view_only']
  }
}

