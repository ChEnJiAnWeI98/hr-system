/**
 * 组织相关字典（3 种）
 * 组织类型 / 组织性质 / 岗位族
 */
import type { DictEntry } from '@/types/system/dictionary'

export const ORG_DICTS: DictEntry[] = [
  {
    dictCode: 'ORG_TYPE',
    dictName: '组织类型',
    dictGroup: 'org',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 1,
    items: [
      { value: 'group', label: '集团', sortOrder: 1, status: 1, extra: { type: 'danger' } },
      { value: 'company', label: '公司/子公司', sortOrder: 2, status: 1, extra: { type: 'warning' } },
      { value: 'division', label: '事业部', sortOrder: 3, status: 1, extra: { type: 'primary' } },
      { value: 'department', label: '部门', sortOrder: 4, status: 1, extra: { type: 'success' } },
      { value: 'team', label: '小组', sortOrder: 5, status: 1, extra: { type: 'info' } },
      { value: 'virtual', label: '虚拟组织', sortOrder: 6, status: 1, extra: { type: 'info' } }
    ]
  },
  {
    dictCode: 'ORG_NATURE',
    dictName: '组织性质',
    dictGroup: 'org',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 2,
    items: [
      { value: 'business', label: '经营', sortOrder: 1, status: 1 },
      { value: 'functional', label: '职能', sortOrder: 2, status: 1 },
      { value: 'support', label: '支持', sortOrder: 3, status: 1 },
      { value: 'rd', label: '研发', sortOrder: 4, status: 1 }
    ]
  },
  {
    dictCode: 'JOB_FAMILY',
    dictName: '岗位族',
    dictGroup: 'position',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 3,
    items: [
      { value: 'TECH', label: '技术', sortOrder: 1, status: 1, extra: { type: 'primary', icon: '💻' } },
      { value: 'PROD', label: '产品', sortOrder: 2, status: 1, extra: { type: 'success', icon: '📋' } },
      { value: 'SALES', label: '销售', sortOrder: 3, status: 1, extra: { type: 'warning', icon: '💼' } },
      { value: 'OPS', label: '运营', sortOrder: 4, status: 1, extra: { type: 'info', icon: '📣' } },
      { value: 'FUNC', label: '职能', sortOrder: 5, status: 1, extra: { type: 'info', icon: '🏢' } },
      { value: 'MGMT', label: '管理', sortOrder: 6, status: 1, extra: { type: 'danger', icon: '👔' } }
    ]
  }
]
