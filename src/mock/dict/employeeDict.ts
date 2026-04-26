/**
 * 员工相关字典（4 种）
 * 员工状态 / 合同类型 / 异动类型 / 离职类型
 */
import type { DictEntry } from '@/types/system/dictionary'

export const EMPLOYEE_DICTS: DictEntry[] = [
  {
    dictCode: 'EMP_STATUS',
    dictName: '员工状态',
    dictGroup: 'employee',
    description: '员工生命周期状态（状态机驱动）',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 1,
    items: [
      { value: 'pending_onboard', label: '待入职', sortOrder: 1, status: 1, extra: { type: 'info' } },
      { value: 'probation', label: '试用期', sortOrder: 2, status: 1, extra: { type: 'warning' } },
      { value: 'regular', label: '正式在职', sortOrder: 3, status: 1, extra: { type: 'success' } },
      { value: 'transferring', label: '调动中', sortOrder: 4, status: 1, extra: { type: 'primary' } },
      { value: 'seconded', label: '借调中', sortOrder: 5, status: 1, extra: { type: 'primary' } },
      { value: 'offboarding', label: '离职中', sortOrder: 6, status: 1, extra: { type: 'danger' } },
      { value: 'terminated', label: '已离职', sortOrder: 7, status: 1, extra: { type: 'info' } }
    ]
  },
  {
    dictCode: 'CONTRACT_TYPE',
    dictName: '合同类型',
    dictGroup: 'employee',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 2,
    items: [
      { value: 'fixed', label: '固定期限劳动合同', sortOrder: 1, status: 1 },
      { value: 'open', label: '无固定期限劳动合同', sortOrder: 2, status: 1 },
      { value: 'task', label: '以完成任务为期限', sortOrder: 3, status: 1 },
      { value: 'labor', label: '劳务合同', sortOrder: 4, status: 1 },
      { value: 'intern', label: '实习协议', sortOrder: 5, status: 1 },
      { value: 'outsource', label: '外包协议', sortOrder: 6, status: 1 }
    ]
  },
  {
    dictCode: 'TRANSFER_TYPE',
    dictName: '异动类型',
    dictGroup: 'employee',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 3,
    items: [
      // 异动字典只保留"在职员工变动"；入职/返聘走招聘入职办理，离职走离职管理
      { value: 'regularization', label: '转正', sortOrder: 1, status: 1, extra: { type: 'success' } },
      { value: 'transfer', label: '调动', sortOrder: 2, status: 1, extra: { type: 'primary' } },
      { value: 'promotion', label: '晋升', sortOrder: 3, status: 1, extra: { type: 'success' } },
      { value: 'demotion', label: '降级', sortOrder: 4, status: 1, extra: { type: 'warning' } },
      { value: 'salary_adjust', label: '调薪', sortOrder: 5, status: 1, extra: { type: 'primary' } },
      { value: 'renewal', label: '合同续签', sortOrder: 6, status: 1, extra: { type: 'info' } },
      { value: 'secondment', label: '借调', sortOrder: 7, status: 1, extra: { type: 'info' } }
    ]
  },
  {
    dictCode: 'LEAVE_REASON_TYPE',
    dictName: '离职类型',
    dictGroup: 'employee',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 4,
    items: [
      { value: 'voluntary', label: '主动离职', sortOrder: 1, status: 1, extra: { type: 'warning' } },
      { value: 'involuntary', label: '被动离职', sortOrder: 2, status: 1, extra: { type: 'danger' } },
      { value: 'negotiated', label: '协商离职', sortOrder: 3, status: 1, extra: { type: 'info' } },
      { value: 'retirement', label: '退休', sortOrder: 4, status: 1, extra: { type: 'info' } },
      { value: 'contract_end', label: '合同到期', sortOrder: 5, status: 1, extra: { type: 'info' } },
      { value: 'terminated_cause', label: '辞退', sortOrder: 6, status: 1, extra: { type: 'danger' } }
    ]
  }
]
