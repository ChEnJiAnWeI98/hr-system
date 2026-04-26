import { AppRouteRecord } from '@/types/router'
import { workspaceRoutes } from './workspace'
import { organizationManagementRoutes } from './organization-management'
import { employeeRoutes } from './employee'
import { attendanceRoutes } from './attendance'
import { leaveRoutes } from './leave'
import { salaryRoutes } from './salary'
import { socialSecurityRoutes } from './social-security'
import { performanceRoutes } from './performance'
import { recruitmentRoutes } from './recruitment'
import { trainingRoutes } from './training'
import { employeeSelfServiceRoutes } from './employee-self-service'
import { approvalEngineRoutes } from './approval-engine'
import { dataReportRoutes } from './data-report'
import { systemRoutes } from './system'
import { contractRoutes } from './contract'

export const routeModules: AppRouteRecord[] = [
  workspaceRoutes,
  organizationManagementRoutes,
  employeeRoutes,
  contractRoutes,
  attendanceRoutes,
  leaveRoutes,
  salaryRoutes,
  socialSecurityRoutes,
  performanceRoutes,
  recruitmentRoutes,
  trainingRoutes,
  employeeSelfServiceRoutes,
  approvalEngineRoutes,
  dataReportRoutes,
  systemRoutes
]



