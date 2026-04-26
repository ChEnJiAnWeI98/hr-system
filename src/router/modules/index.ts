import { AppRouteRecord } from '@/types/router'

// ========== V2.0 重构后的一级菜单 ==========
import { workspaceRoutes } from './workspace' // 工作台（特殊一级）
import { orgRoutes } from './org' // 01 组织管理（拆自 hrm）
import { employeeRoutes } from './employee' // 02 员工管理（拆自 hrm）
import { contractRoutes } from './contract' // 03 合同管理（拆自 hrm）
import { recruitRoutes } from './recruit' // 04 招聘管理
import { attendanceRoutes } from './attendance' // 05 考勤与假期
import { compRoutes } from './comp' // 06 薪酬管理
import { socialRoutes } from './social' // 07 社保公积金
import { perfRoutes } from './perf' // 08 绩效管理
import { talentRoutes } from './talent' // 09 人才发展
import { trainingRoutes } from './training' // 10 培训管理
import { insightRoutes } from './insight' // 11 数据洞察
import { systemRoutes } from './system' // 12 系统管理

export const routeModules: AppRouteRecord[] = [
  workspaceRoutes,
  orgRoutes,
  employeeRoutes,
  contractRoutes,
  recruitRoutes,
  attendanceRoutes,
  compRoutes,
  socialRoutes,
  perfRoutes,
  talentRoutes,
  trainingRoutes,
  insightRoutes,
  systemRoutes
]
