/**
 * 7 种预置角色（Phase 1.5）
 *
 * super_admin   - 超级管理员（全部权限）
 * hr_admin      - HR 管理员（除系统管理外全部）
 * hr_bp         - HRBP（按分管组织）
 * dept_manager  - 部门负责人（看本部门）
 * line_manager  - 直线经理（看下属）
 * employee      - 普通员工（看自己）
 * interviewer   - 面试官（临时角色）
 */
import type { Role, MenuDefinition } from '@/types/system/rbac'

/** 所有菜单定义（用于角色权限配置） */
export const MENU_DEFINITIONS: MenuDefinition[] = [
  // 01 组织管理（Phase 7 从 hrm 拆出）
  { code: 'org:organization', name: '组织架构', groupCode: 'org', groupName: '组织管理', path: '/org/organization' },
  { code: 'org:position', name: '岗位体系', groupCode: 'org', groupName: '组织管理', path: '/org/position' },
  { code: 'org:headcount', name: '编制管理', groupCode: 'org', groupName: '组织管理', path: '/org/headcount' },

  // 02 员工管理（Phase 7 从 hrm 拆出）
  { code: 'employee:profile', name: '员工档案', groupCode: 'employee', groupName: '员工管理', path: '/employee/profile', isCore: true },
  { code: 'employee:transfer', name: '人员异动', groupCode: 'employee', groupName: '员工管理', path: '/employee/transfer' },
  { code: 'employee:offboarding', name: '离职管理', groupCode: 'employee', groupName: '员工管理', path: '/employee/offboarding' },
  { code: 'employee:probation', name: '试用期管理', groupCode: 'employee', groupName: '员工管理', path: '/employee/probation' },

  // 03 合同管理（Phase 7 从 hrm 拆出）
  { code: 'contract:list', name: '合同列表', groupCode: 'contract', groupName: '合同管理', path: '/contract/list' },
  { code: 'contract:template', name: '合同模板', groupCode: 'contract', groupName: '合同管理', path: '/contract/template' },
  { code: 'contract:archive', name: '合同归档', groupCode: 'contract', groupName: '合同管理', path: '/contract/archive' },
  { code: 'contract:statistics', name: '合同统计', groupCode: 'contract', groupName: '合同管理', path: '/contract/statistics' },

  // 02 招聘管理（Phase 2 迁移）
  { code: 'recruit:demand', name: '招聘需求', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/demand' },
  { code: 'recruit:job', name: '职位发布', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/job' },
  { code: 'recruit:resume', name: '简历池', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/resume' },
  { code: 'recruit:interview', name: '面试管理', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/interview' },
  { code: 'recruit:offer', name: 'Offer 管理', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/offer' },
  { code: 'recruit:onboarding', name: '入职办理', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/onboarding' },
  { code: 'recruit:ops', name: '招聘运营', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/ops' },
  { code: 'recruit:settings', name: '招聘配置', groupCode: 'recruit', groupName: '招聘管理', path: '/recruit/settings' },

  // 03 考勤与假期（Phase 3）
  { code: 'attendance:rule', name: '考勤规则', groupCode: 'attendance', groupName: '考勤与假期', path: '/attendance/rule' },
  { code: 'attendance:record', name: '考勤记录', groupCode: 'attendance', groupName: '考勤与假期', path: '/attendance/record', isCore: true },
  { code: 'attendance:leave', name: '假期管理', groupCode: 'attendance', groupName: '考勤与假期', path: '/attendance/leave', isCore: true },
  { code: 'attendance:overtime', name: '加班管理', groupCode: 'attendance', groupName: '考勤与假期', path: '/attendance/overtime' },
  { code: 'attendance:report', name: '考勤报表', groupCode: 'attendance', groupName: '考勤与假期', path: '/attendance/report' },

  // 04 薪酬管理（Phase 4 · Phase 6 Batch A 拆出社保后）
  { code: 'comp:structure', name: '薪酬体系', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/structure' },
  { code: 'comp:payroll', name: '薪资核算', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/payroll' },
  { code: 'comp:adjustment', name: '调薪管理', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/adjustment' },
  { code: 'comp:tax', name: '个税管理', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/tax-bracket' },
  { code: 'comp:welfare', name: '福利管理', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/welfare-program' },
  { code: 'comp:payslip', name: '员工工资条', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/payslip', isCore: true },
  { code: 'comp:report', name: '薪酬报表', groupCode: 'comp', groupName: '薪酬管理', path: '/comp/report' },

  // 05 社保公积金（Phase 6 Batch A 新增）
  { code: 'social:insurance-config', name: '社保方案', groupCode: 'social', groupName: '社保公积金', path: '/social/insurance-config' },
  { code: 'social:provident-fund', name: '公积金方案', groupCode: 'social', groupName: '社保公积金', path: '/social/provident-fund' },
  { code: 'social:employee', name: '员工参保', groupCode: 'social', groupName: '社保公积金', path: '/social/employee' },
  { code: 'social:monthly', name: '月度计算', groupCode: 'social', groupName: '社保公积金', path: '/social/monthly' },
  { code: 'social:statistics', name: '社保统计', groupCode: 'social', groupName: '社保公积金', path: '/social/statistics' },

  // 05 绩效管理（Phase 2 迁移 + Phase A~D 成果）
  { code: 'perf:cycle', name: '绩效周期', groupCode: 'perf', groupName: '绩效管理', path: '/perf/cycle' },
  { code: 'perf:goal', name: '目标管理', groupCode: 'perf', groupName: '绩效管理', path: '/perf/goal', isCore: true },
  { code: 'perf:evaluation', name: '绩效评估', groupCode: 'perf', groupName: '绩效管理', path: '/perf/evaluation', isCore: true },
  { code: 'perf:calibration', name: '绩效校准', groupCode: 'perf', groupName: '绩效管理', path: '/perf/calibration' },
  { code: 'perf:meeting', name: '绩效面谈', groupCode: 'perf', groupName: '绩效管理', path: '/perf/meeting' },
  { code: 'perf:archive', name: '绩效档案', groupCode: 'perf', groupName: '绩效管理', path: '/perf/archive', isCore: true },
  { code: 'perf:feedback', name: '持续反馈', groupCode: 'perf', groupName: '绩效管理', path: '/perf/feedback' },
  { code: 'perf:pip', name: 'PIP 改进', groupCode: 'perf', groupName: '绩效管理', path: '/perf/pip' },
  { code: 'perf:appeal', name: '绩效申诉', groupCode: 'perf', groupName: '绩效管理', path: '/perf/appeal' },
  { code: 'perf:settings', name: '绩效配置', groupCode: 'perf', groupName: '绩效管理', path: '/perf/settings' },

  // 07 人才发展（Phase 6 Batch B 新增）
  { code: 'talent:review', name: '人才盘点', groupCode: 'talent', groupName: '人才发展', path: '/talent/review' },
  { code: 'talent:competency', name: '能力模型', groupCode: 'talent', groupName: '人才发展', path: '/talent/competency' },
  { code: 'talent:assessment', name: '能力评估', groupCode: 'talent', groupName: '人才发展', path: '/talent/assessment' },
  { code: 'talent:succession', name: '继任计划', groupCode: 'talent', groupName: '人才发展', path: '/talent/succession' },

  // 08 培训管理（Phase 4 · Phase 6 Batch B 拆出能力/继任后）
  { code: 'training:course', name: '课程管理', groupCode: 'training', groupName: '培训管理', path: '/training/course' },
  { code: 'training:plan', name: '培训计划', groupCode: 'training', groupName: '培训管理', path: '/training/plan' },
  { code: 'training:record', name: '培训记录', groupCode: 'training', groupName: '培训管理', path: '/training/record', isCore: true },
  { code: 'training:certificate', name: '证书管理', groupCode: 'training', groupName: '培训管理', path: '/training/certificate' },

  // 07 数据洞察（Phase 5）
  { code: 'insight:dashboard', name: 'HR 驾驶舱', groupCode: 'insight', groupName: '数据洞察', path: '/insight/dashboard' },
  { code: 'insight:organization', name: '组织洞察', groupCode: 'insight', groupName: '数据洞察', path: '/insight/organization' },
  { code: 'insight:recruitment', name: '招聘洞察', groupCode: 'insight', groupName: '数据洞察', path: '/insight/recruitment' },
  { code: 'insight:performance', name: '绩效洞察', groupCode: 'insight', groupName: '数据洞察', path: '/insight/performance' },
  { code: 'insight:compensation', name: '薪酬洞察', groupCode: 'insight', groupName: '数据洞察', path: '/insight/compensation' },
  { code: 'insight:attendance', name: '考勤洞察', groupCode: 'insight', groupName: '数据洞察', path: '/insight/attendance' },
  { code: 'insight:ai', name: 'AI 辅助中心', groupCode: 'insight', groupName: '数据洞察', path: '/insight/ai' },

  // 08 系统管理
  { code: 'system:user', name: '用户管理', groupCode: 'system', groupName: '系统管理', path: '/system/user' },
  { code: 'system:role', name: '角色权限', groupCode: 'system', groupName: '系统管理', path: '/system/role' },
  { code: 'system:data-permission', name: '数据权限', groupCode: 'system', groupName: '系统管理', path: '/system/data-permission' },
  { code: 'system:approval', name: '审批流', groupCode: 'system', groupName: '系统管理', path: '/system/approval' },
  { code: 'system:dictionary', name: '数据字典', groupCode: 'system', groupName: '系统管理', path: '/system/dictionary' },
  { code: 'system:notification', name: '消息通知', groupCode: 'system', groupName: '系统管理', path: '/system/notification' },
  { code: 'system:log', name: '操作日志', groupCode: 'system', groupName: '系统管理', path: '/system/log' },
  { code: 'system:field-change-log', name: '字段变更日志', groupCode: 'system', groupName: '系统管理', path: '/system/field-change-log' }
]

const ALL_MENUS = MENU_DEFINITIONS.map((m) => m.code)
const CORE_MENUS = MENU_DEFINITIONS.filter((m) => m.isCore).map((m) => m.code)
const ALL_EXCEPT_SYSTEM = MENU_DEFINITIONS.filter((m) => m.groupCode !== 'system').map((m) => m.code)
const EMPLOYEE_MENUS = [
  'employee:profile', //         员工档案（只看自己）
  'attendance:record', //        考勤记录
  'attendance:leave', //         假期管理
  'attendance:overtime', //      加班申请
  'comp:payslip', //             工资条
  'perf:goal', //                我的目标
  'perf:evaluation', //          我的评估
  'perf:archive', //             我的档案
  'perf:feedback', //            持续反馈
  'training:record' //           培训记录
]
const MANAGER_MENUS = [
  ...EMPLOYEE_MENUS,
  'employee:transfer',
  'attendance:report',
  'perf:cycle',
  'perf:calibration',
  'perf:meeting',
  'talent:review'
]

/** 7 种预置角色 */
export const PRESET_ROLES: Role[] = [
  {
    id: 1,
    roleCode: 'super_admin',
    roleName: '超级管理员',
    description: '全部权限（系统预置，不可修改）',
    isSystem: true,
    menuCodes: ALL_MENUS,
    dataScope: 'all',
    fieldPermission: { sensitiveFields: 'visible', salaryFields: 'visible' },
    sortOrder: 1,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 2,
    roleCode: 'hr_admin',
    roleName: 'HR 管理员',
    description: '除"系统管理"外的全部菜单，可看全员数据',
    isSystem: true,
    menuCodes: ALL_EXCEPT_SYSTEM,
    dataScope: 'all',
    fieldPermission: { sensitiveFields: 'visible', salaryFields: 'visible' },
    sortOrder: 2,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 3,
    roleCode: 'hr_bp',
    roleName: 'HRBP',
    description: '按员工档案中的 managedOrgIds 分管组织',
    isSystem: true,
    menuCodes: ALL_EXCEPT_SYSTEM,
    dataScope: 'custom_org',
    fieldPermission: { sensitiveFields: 'visible', salaryFields: 'visible' },
    sortOrder: 3,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 4,
    roleCode: 'dept_manager',
    roleName: '部门负责人',
    description: '看本部门（含子部门），薪酬字段隐藏',
    isSystem: true,
    menuCodes: MANAGER_MENUS,
    dataScope: 'department',
    fieldPermission: { sensitiveFields: 'masked', salaryFields: 'hidden' },
    sortOrder: 4,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 5,
    roleCode: 'line_manager',
    roleName: '直线经理',
    description: '看本人 + 直属下属',
    isSystem: true,
    menuCodes: MANAGER_MENUS,
    dataScope: 'self_and_subordinate',
    fieldPermission: { sensitiveFields: 'masked', salaryFields: 'hidden' },
    sortOrder: 5,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 6,
    roleCode: 'employee',
    roleName: '普通员工',
    description: '只看自己的档案/考勤/绩效/培训/工资条',
    isSystem: true,
    menuCodes: EMPLOYEE_MENUS,
    dataScope: 'self',
    fieldPermission: { sensitiveFields: 'masked', salaryFields: 'visible' },
    sortOrder: 6,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  },
  {
    id: 7,
    roleCode: 'interviewer',
    roleName: '面试官',
    description: '仅看面试相关数据（临时角色）',
    isSystem: true,
    menuCodes: ['recruit:interview', 'recruit:resume'],
    dataScope: 'self',
    fieldPermission: { sensitiveFields: 'masked', salaryFields: 'hidden' },
    sortOrder: 7,
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00'
  }
]
