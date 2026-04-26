/**
 * 字段变更日志 Mock 数据（Phase 5.8+）
 */
import type { FieldChangeLog, FieldChangeLogListParams } from '@/types/system/fieldChangeLog'

// 手写 20 条样例，覆盖"员工/组织/合同/岗位/薪酬/角色"6 大实体 + 7 种变更来源
const initialData: FieldChangeLog[] = [
  {
    id: 1,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1005, entityName: '刘娜珊',
    fieldName: 'baseSalary', fieldLabel: '基本工资',
    oldValue: '14000', newValue: '18000',
    changeReason: '年度调薪 - 绩效 A',
    source: 'salary_adjust', sourceDocNo: 'SA20260115001',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2026-01-15 14:20:11'
  },
  {
    id: 2,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1010, entityName: '王煜',
    fieldName: 'level', fieldLabel: '职级',
    oldValue: 'P5', newValue: 'P6',
    changeReason: 'Q1 晋升通过',
    source: 'transfer', sourceDocNo: 'TR20260320007',
    operatorId: 9002, operatorName: 'HRBP-王', operatorRole: 'hr_bp',
    ipAddress: '192.168.10.15',
    operateTime: '2026-03-20 10:05:33'
  },
  {
    id: 3,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1022, entityName: '韩芳',
    fieldName: 'orgId', fieldLabel: '所在组织',
    oldValue: '前端组', newValue: '后端组',
    changeReason: '团队架构调整，内部转岗',
    source: 'transfer', sourceDocNo: 'TR20260205003',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2026-02-05 09:38:22'
  },
  {
    id: 4,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1038, entityName: '谢宇婷',
    fieldName: 'status', fieldLabel: '员工状态',
    oldValue: 'regular', newValue: 'terminated',
    changeReason: '个人原因离职',
    source: 'offboarding', sourceDocNo: 'OFF20250430001',
    operatorId: 9003, operatorName: 'HRD-陈', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.8',
    operateTime: '2025-05-04 16:45:00'
  },
  {
    id: 5,
    entityType: '合同', entityTypeCode: 'contract',
    entityId: 1201, entityName: '马月（HT20251120002）',
    fieldName: 'endDate', fieldLabel: '合同结束日期',
    oldValue: '2025-11-20', newValue: '2030-11-20',
    changeReason: '合同到期续签 5 年',
    source: 'contract_renewal', sourceDocNo: 'CR20251120002',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2025-11-15 14:30:00'
  },
  {
    id: 6,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1068, entityName: '徐菊阳',
    fieldName: 'status', fieldLabel: '员工状态',
    oldValue: 'probation', newValue: 'regular',
    changeReason: '试用期满自动转正',
    source: 'system_auto',
    operatorId: 0, operatorName: '系统自动', operatorRole: 'system',
    ipAddress: '127.0.0.1',
    operateTime: '2024-03-22 00:00:01'
  },
  {
    id: 7,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1014, entityName: '邓晨磊',
    fieldName: 'email', fieldLabel: '联系邮箱',
    oldValue: 'yg20200014@zhonghe.com', newValue: 'deng.chenlei@zhonghe.com',
    changeReason: '员工本人申请修改',
    source: 'direct_edit',
    operatorId: 9002, operatorName: 'HRBP-王', operatorRole: 'hr_bp',
    ipAddress: '192.168.10.15',
    operateTime: '2023-07-08 11:20:45'
  },
  {
    id: 8,
    entityType: '薪酬', entityTypeCode: 'compensation',
    entityId: 1050, entityName: '郭强',
    fieldName: 'performanceBase', fieldLabel: '绩效基数',
    oldValue: '4000', newValue: '5000',
    changeReason: '调薪配套调整',
    source: 'salary_adjust', sourceDocNo: 'SA20260115002',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2026-01-15 14:22:08'
  },
  {
    id: 9,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1101, entityName: '马月',
    fieldName: 'positionId', fieldLabel: '岗位',
    oldValue: '中级前端工程师', newValue: '高级前端工程师',
    changeReason: '岗位晋升配套变更',
    source: 'transfer', sourceDocNo: 'TR20260320007',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2026-03-20 10:05:34'
  },
  {
    id: 10,
    entityType: '组织', entityTypeCode: 'organization',
    entityId: 10, entityName: '后端组',
    fieldName: 'budgetCount', fieldLabel: '编制数',
    oldValue: '25', newValue: '30',
    changeReason: 'Q2 扩编 5 人',
    source: 'direct_edit',
    operatorId: 9003, operatorName: 'HRD-陈', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.8',
    operateTime: '2026-04-01 09:00:00'
  },
  {
    id: 11,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1080, entityName: '陈浩',
    fieldName: 'mobile', fieldLabel: '手机号',
    oldValue: '138****5678', newValue: '139****1234',
    changeReason: '员工本人申请修改',
    source: 'direct_edit',
    operatorId: 1080, operatorName: '陈浩', operatorRole: 'employee',
    ipAddress: '192.168.20.88',
    operateTime: '2026-02-11 15:42:00'
  },
  {
    id: 12,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1094, entityName: '萧峰超',
    fieldName: 'status', fieldLabel: '员工状态',
    oldValue: 'pending_onboard', newValue: 'probation',
    changeReason: '入职办理完成',
    source: 'onboarding', sourceDocNo: 'ON20240710001',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2024-07-10 09:30:00'
  },
  {
    id: 13,
    entityType: '岗位', entityTypeCode: 'position',
    entityId: 12, entityName: '高级前端工程师',
    fieldName: 'levelMax', fieldLabel: '最高职级',
    oldValue: 'P6', newValue: 'P7',
    changeReason: '岗位说明书年度评审',
    source: 'direct_edit',
    operatorId: 9003, operatorName: 'HRD-陈', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.8',
    operateTime: '2026-01-20 10:00:00'
  },
  {
    id: 14,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1044, entityName: '梁彤兰',
    fieldName: 'maritalStatus', fieldLabel: '婚姻状况',
    oldValue: 'single', newValue: 'married',
    changeReason: '员工本人申请修改',
    source: 'direct_edit',
    operatorId: 1044, operatorName: '梁彤兰', operatorRole: 'employee',
    ipAddress: '192.168.20.44',
    operateTime: '2025-10-15 11:20:00'
  },
  {
    id: 15,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1030, entityName: '周强',
    fieldName: 'supervisorId', fieldLabel: '直属上级',
    oldValue: '王大（P7）', newValue: '李明（P8）',
    changeReason: '原上级调岗，重新分配',
    source: 'transfer', sourceDocNo: 'TR20260101002',
    operatorId: 9002, operatorName: 'HRBP-王', operatorRole: 'hr_bp',
    ipAddress: '192.168.10.15',
    operateTime: '2026-01-01 09:10:00'
  },
  {
    id: 16,
    entityType: '合同', entityTypeCode: 'contract',
    entityId: 1378, entityName: '曹静（HT20220408001）',
    fieldName: 'salary', fieldLabel: '合同约定薪资',
    oldValue: '月薪 22000 元', newValue: '月薪 28000 元',
    changeReason: '合同续签配套调薪',
    source: 'contract_renewal', sourceDocNo: 'CR20220408001',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2022-04-08 14:00:00'
  },
  {
    id: 17,
    entityType: '角色权限', entityTypeCode: 'role',
    entityId: 3, entityName: '部门经理',
    fieldName: 'menuCodes', fieldLabel: '菜单权限',
    oldValue: '12 项', newValue: '14 项',
    changeReason: '新增"绩效面谈"和"人才盘点"权限',
    source: 'direct_edit',
    operatorId: 9003, operatorName: 'HRD-陈', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.8',
    operateTime: '2026-03-28 16:00:00'
  },
  {
    id: 18,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1025, entityName: '高鑫',
    fieldName: 'status', fieldLabel: '员工状态',
    oldValue: 'regular', newValue: 'terminated',
    changeReason: '合同到期未续签',
    source: 'offboarding', sourceDocNo: 'OFF20240707001',
    operatorId: 9003, operatorName: 'HRD-陈', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.8',
    operateTime: '2024-07-07 17:00:00'
  },
  {
    id: 19,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1024, entityName: '梁子鑫',
    fieldName: 'workLocation', fieldLabel: '工作地点',
    oldValue: '北京', newValue: '上海',
    changeReason: '跨地区调动',
    source: 'transfer', sourceDocNo: 'TR20260410005',
    operatorId: 9001, operatorName: 'HR-Lisa', operatorRole: 'hr_admin',
    ipAddress: '192.168.10.12',
    operateTime: '2026-04-10 10:30:00'
  },
  {
    id: 20,
    entityType: '员工档案', entityTypeCode: 'employee',
    entityId: 1072, entityName: '程佳',
    fieldName: 'status', fieldLabel: '员工状态',
    oldValue: 'regular', newValue: 'offboarding',
    changeReason: '员工发起离职申请',
    source: 'offboarding', sourceDocNo: 'OFF20241026001',
    operatorId: 1072, operatorName: '程佳', operatorRole: 'employee',
    ipAddress: '192.168.20.72',
    operateTime: '2024-10-05 14:00:00'
  }
]

/**
 * 获取字段变更日志列表
 */
export function getFieldChangeLogListMock(params: FieldChangeLogListParams) {
  const {
    entityTypeCode,
    entityName,
    fieldLabel,
    operatorName,
    source,
    dateStart,
    dateEnd,
    page = 1,
    pageSize = 20
  } = params
  let filtered = [...initialData]

  if (entityTypeCode) filtered = filtered.filter((i) => i.entityTypeCode === entityTypeCode)
  if (entityName) filtered = filtered.filter((i) => i.entityName.includes(entityName))
  if (fieldLabel) filtered = filtered.filter((i) => i.fieldLabel.includes(fieldLabel))
  if (operatorName) filtered = filtered.filter((i) => i.operatorName.includes(operatorName))
  if (source) filtered = filtered.filter((i) => i.source === source)
  if (dateStart) filtered = filtered.filter((i) => i.operateTime >= dateStart)
  if (dateEnd) filtered = filtered.filter((i) => i.operateTime <= dateEnd + ' 23:59:59')

  // 按时间倒序
  filtered.sort((a, b) => b.operateTime.localeCompare(a.operateTime))

  const start = (page - 1) * pageSize
  return {
    list: filtered.slice(start, start + Number(pageSize)),
    total: filtered.length
  }
}

/**
 * 获取单条详情
 */
export function getFieldChangeLogDetailMock(id: number): FieldChangeLog | null {
  return initialData.find((i) => i.id === id) || null
}
