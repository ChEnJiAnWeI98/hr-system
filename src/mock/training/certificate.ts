/**
 * 证书管理 Mock 数据（Phase 4.9）
 */
import { createCrudMock } from '@/utils/crud/mockHelper'
import type { Certificate } from '@/types/training'
import { EMPLOYEES } from '@/mock/core/employeePool'

/** 计算证书状态：基于当前时间 2026-04-22 */
const TODAY = '2026-04-22'

function computeStatus(validTo?: string): Certificate['status'] {
  if (!validTo) return 'valid'
  const today = new Date(TODAY).getTime()
  const expiry = new Date(validTo).getTime()
  const diffDays = Math.floor((expiry - today) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'valid'
}

function certOf(
  id: number,
  no: string,
  name: string,
  type: Certificate['type'],
  issuer: string,
  empIdx: number,
  issueDate: string,
  validFrom: string,
  validTo: string | undefined,
  planId?: number,
  planName?: string
): Certificate {
  const emp = EMPLOYEES[empIdx] || EMPLOYEES[0]
  return {
    id,
    certificateNo: no,
    certificateName: name,
    type,
    issuer,
    planId,
    planName,
    employeeId: emp.id,
    employeeName: emp.nameZh,
    orgName: emp.orgName,
    issueDate,
    validFrom,
    validTo,
    status: computeStatus(validTo),
    attachmentUrl: `/mock/certificates/${no}.pdf`,
    createTime: `${issueDate} 10:00:00`,
    updateTime: `${issueDate} 10:00:00`
  }
}

const initialCertificates: Certificate[] = [
  // 外部证书（职业资格）
  certOf(1, 'CERT-20250601-001', 'PMP 项目管理专业人士', 'professional', 'PMI 国际项目管理协会', 5, '2025-06-01', '2025-06-01', '2028-06-01'),
  certOf(2, 'CERT-20250815-002', 'CFA 一级资格证', 'professional', 'CFA Institute', 18, '2025-08-15', '2025-08-15', undefined),
  certOf(3, 'CERT-20240320-003', '注册会计师（CPA）', 'professional', '中国注册会计师协会', 25, '2024-03-20', '2024-03-20', undefined),
  certOf(4, 'CERT-20250410-004', 'AWS 解决方案架构师-专业级', 'professional', 'Amazon Web Services', 12, '2025-04-10', '2025-04-10', '2028-04-10'),
  certOf(5, 'CERT-20260115-005', '信息系统项目管理师（高项）', 'professional', '工信部教育与考试中心', 8, '2026-01-15', '2026-01-15', undefined),
  certOf(6, 'CERT-20240518-006', '二级人力资源管理师', 'professional', '人社部', 30, '2024-05-18', '2024-05-18', undefined),

  // 内部认证（培训关联）
  certOf(7, 'CERT-20260122-101', '新员工入职培训合格证书', 'internal', '公司 HR 培训学院', 50, '2026-01-22', '2026-01-22', undefined, 1, '2026 年 1 月新员工入职培训'),
  certOf(8, 'CERT-20260315-102', '信息安全与数据合规（2026）', 'internal', '公司法务合规部', 10, '2026-03-15', '2026-03-15', '2027-03-15', 2, '2026 年度全员信息安全培训'),
  certOf(9, 'CERT-20260315-103', '信息安全与数据合规（2026）', 'internal', '公司法务合规部', 22, '2026-03-15', '2026-03-15', '2027-03-15', 2, '2026 年度全员信息安全培训'),
  certOf(10, 'CERT-20260322-104', 'Java 工程化实战（春季）认证', 'internal', '公司技术委员会', 14, '2026-03-22', '2026-03-22', undefined, 3, '后端 Java 工程化实战集训（春季）'),
  certOf(11, 'CERT-20260322-105', 'Java 工程化实战（春季）认证', 'internal', '公司技术委员会', 15, '2026-03-22', '2026-03-22', undefined, 3, '后端 Java 工程化实战集训（春季）'),

  // 外部培训证书
  certOf(12, 'CERT-20240620-201', 'ScrumMaster 认证（CSM）', 'external', 'Scrum Alliance', 33, '2024-06-20', '2024-06-20', '2026-06-20'),
  certOf(13, 'CERT-20250212-202', 'ITIL 4 Foundation', 'external', 'AXELOS', 41, '2025-02-12', '2025-02-12', '2028-02-12'),
  certOf(14, 'CERT-20250918-203', 'Google Analytics 专业认证', 'external', 'Google', 55, '2025-09-18', '2025-09-18', '2026-09-18'),
  certOf(15, 'CERT-20240730-204', '六西格玛绿带（Green Belt）', 'external', '中国质量协会', 62, '2024-07-30', '2024-07-30', undefined),

  // 即将到期（30 天内）示例
  certOf(16, 'CERT-20250425-205', 'TOGAF 9 基础认证', 'external', 'The Open Group', 38, '2025-04-25', '2025-04-25', '2026-04-25'),
  certOf(17, 'CERT-20250501-206', '阿里云 ACP 专业工程师', 'external', '阿里云', 45, '2025-05-01', '2025-05-01', '2026-05-01'),

  // 已过期示例
  certOf(18, 'CERT-20230110-207', 'Cisco CCNA', 'external', 'Cisco', 70, '2023-01-10', '2023-01-10', '2026-01-10'),
  certOf(19, 'CERT-20230220-208', '红帽 RHCE 认证', 'external', 'Red Hat', 75, '2023-02-20', '2023-02-20', '2026-02-20')
]

export const certificateMock = createCrudMock<Certificate>(initialCertificates, {
  searchFields: ['certificateNo', 'certificateName', 'issuer', 'employeeName', 'orgName'],
  sortField: 'issueDate'
})

/** 按员工获取证书 */
export function getCertsByEmployee(employeeId: number): Certificate[] {
  return certificateMock.getData().filter((c) => c.employeeId === employeeId)
}
