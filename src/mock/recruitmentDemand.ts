import type { RecruitmentDemand, ApprovalNode, EstablishmentCheckResult } from '@/types/recruitmentDemand'
import { createCrudMock } from '@/utils/crud'
import { staffingMock } from './staffing'
import { getEmployeeListMock } from './employee'
// 🔐 Phase 2.10 员工池对齐
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'

/**
 * 构造默认审批链：直属上级 → HRBP → HRD
 * 演示用：固定审批人姓名
 */
function buildDefaultNodes(
  hiringManagerDeptName: string,
  finalStatus: 'pending' | 'approved' | 'rejected',
  finalApprover?: string,
  finalOpinion?: string,
  finalTime?: string,
  rejectAtNode?: number
): { approvalNodes: ApprovalNode[]; currentNodeIndex: number } {
  const nodes: ApprovalNode[] = [
    {
      nodeIndex: 0,
      nodeName: '直属上级审批',
      approverRole: 'R_DEPT_MANAGER',
      approverName: `${hiringManagerDeptName}负责人`,
      status: 0
    },
    {
      nodeIndex: 1,
      nodeName: 'HRBP 审批',
      approverRole: 'R_HR',
      approverName: '张HR',
      status: 0
    },
    {
      nodeIndex: 2,
      nodeName: 'HRD 审批',
      approverRole: 'R_SUPER',
      approverName: '超级管理员',
      status: 0
    }
  ]

  if (finalStatus === 'approved') {
    // 所有节点均已通过
    nodes.forEach((n, idx) => {
      n.status = 1
      n.approveTime = finalTime || '2026-04-05 10:00:00'
      n.opinion = idx === nodes.length - 1 ? finalOpinion || '同意' : '同意'
    })
    return { approvalNodes: nodes, currentNodeIndex: nodes.length }
  }

  if (finalStatus === 'rejected') {
    const rejectIdx = rejectAtNode ?? 0
    for (let i = 0; i < rejectIdx; i++) {
      nodes[i].status = 1
      nodes[i].approveTime = finalTime || '2026-04-05 10:00:00'
      nodes[i].opinion = '同意'
    }
    nodes[rejectIdx].status = 2
    nodes[rejectIdx].approveTime = finalTime
    nodes[rejectIdx].opinion = finalOpinion
    if (finalApprover) nodes[rejectIdx].approverName = finalApprover
    return { approvalNodes: nodes, currentNodeIndex: rejectIdx }
  }

  // pending: 审批中
  return { approvalNodes: nodes, currentNodeIndex: 0 }
}

// 初始数据
const initialData: RecruitmentDemand[] = [
  {
    id: 1,
    demandNo: 'RD202604001',
    departmentName: '技术部',
    departmentId: 3,
    positionName: '前端工程师',
    recruitCount: 2,
    urgencyLevel: 3,
    demandReason: '业务快速发展，现有团队人手不足，需要扩充前端开发力量',
    jobRequirements: '1. 3年以上前端开发经验\n2. 精通Vue3、TypeScript\n3. 熟悉Element Plus等UI框架\n4. 有大型项目经验优先',
    salaryRange: '15K-25K',
    expectedOnboardDate: '2026-05-01',
    hiringManagerId: 5,
    hiringManagerName: '王技术',
    hiringManagerDeptId: 3,
    hiringManagerDeptName: '技术部',
    approvalStatus: 1,
    ...buildDefaultNodes('技术部', 'approved', '超级管理员', '同意招聘，尽快安排面试', '2026-04-05 10:30:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-05 10:30:00',
    approvalComment: '同意招聘，尽快安排面试',
    publishedJobCount: 1,
    createTime: '2026-04-03 09:00:00',
    updateTime: '2026-04-05 10:30:00'
  },
  {
    id: 2,
    demandNo: 'RD202604002',
    departmentName: '技术部',
    departmentId: 3,
    positionName: '后端工程师',
    recruitCount: 3,
    urgencyLevel: 2,
    demandReason: '新项目启动，需要后端开发人员支持',
    jobRequirements: '1. 3年以上Java开发经验\n2. 熟悉Spring Boot、MyBatis\n3. 了解微服务架构\n4. 有高并发项目经验优先',
    salaryRange: '18K-30K',
    expectedOnboardDate: '2026-05-15',
    hiringManagerId: 5,
    hiringManagerName: '王技术',
    hiringManagerDeptId: 3,
    hiringManagerDeptName: '技术部',
    approvalStatus: 1,
    ...buildDefaultNodes('技术部', 'approved', '超级管理员', '批准，优先招聘有微服务经验的候选人', '2026-04-04 14:20:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-04 14:20:00',
    approvalComment: '批准，优先招聘有微服务经验的候选人',
    publishedJobCount: 0,
    createTime: '2026-04-02 14:30:00',
    updateTime: '2026-04-04 14:20:00'
  },
  {
    id: 3,
    demandNo: 'RD202604003',
    departmentName: '产品部',
    departmentId: 2,
    positionName: '产品经理',
    recruitCount: 1,
    urgencyLevel: 2,
    demandReason: '产品线扩展，需要增加产品经理负责新业务',
    jobRequirements: '1. 3年以上产品经验\n2. 有B端产品经验\n3. 熟悉Axure、Figma等工具\n4. 具备良好的沟通协调能力',
    salaryRange: '20K-35K',
    expectedOnboardDate: '2026-05-10',
    hiringManagerId: 4,
    hiringManagerName: '李经理',
    hiringManagerDeptId: 2,
    hiringManagerDeptName: '产品部',
    approvalStatus: 0,
    ...buildDefaultNodes('产品部', 'pending'),
    approver: '',
    approvalTime: '',
    approvalComment: '',
    publishedJobCount: 0,
    createTime: '2026-04-05 11:00:00',
    updateTime: '2026-04-05 11:00:00'
  },
  {
    id: 4,
    demandNo: 'RD202604004',
    departmentName: '产品部',
    departmentId: 2,
    positionName: 'UI设计师',
    recruitCount: 2,
    urgencyLevel: 1,
    demandReason: '设计团队扩充，提升产品视觉体验',
    jobRequirements: '1. 2年以上UI设计经验\n2. 精通Figma、Sketch\n3. 有移动端设计经验\n4. 作品集优秀',
    salaryRange: '12K-20K',
    expectedOnboardDate: '2026-06-01',
    hiringManagerId: 4,
    hiringManagerName: '李经理',
    hiringManagerDeptId: 2,
    hiringManagerDeptName: '产品部',
    approvalStatus: 1,
    ...buildDefaultNodes('产品部', 'approved', '超级管理员', '同意招聘', '2026-04-04 16:00:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-04 16:00:00',
    approvalComment: '同意招聘',
    publishedJobCount: 0,
    createTime: '2026-04-03 15:20:00',
    updateTime: '2026-04-04 16:00:00'
  },
  {
    id: 5,
    demandNo: 'RD202604005',
    departmentName: '市场部',
    departmentId: 4,
    positionName: '市场专员',
    recruitCount: 2,
    urgencyLevel: 1,
    demandReason: '市场推广需要，增加市场人员',
    jobRequirements: '1. 1年以上市场工作经验\n2. 熟悉新媒体运营\n3. 文案功底好\n4. 有活动策划经验',
    salaryRange: '8K-12K',
    expectedOnboardDate: '2026-05-20',
    hiringManagerId: 6,
    hiringManagerName: '赵市场',
    hiringManagerDeptId: 4,
    hiringManagerDeptName: '市场部',
    approvalStatus: 0,
    ...buildDefaultNodes('市场部', 'pending'),
    approver: '',
    approvalTime: '',
    approvalComment: '',
    publishedJobCount: 0,
    createTime: '2026-04-04 10:00:00',
    updateTime: '2026-04-04 10:00:00'
  },
  {
    id: 6,
    demandNo: 'RD202604006',
    departmentName: '人事部',
    departmentId: 10,
    positionName: '招聘专员',
    recruitCount: 1,
    urgencyLevel: 3,
    demandReason: '公司快速扩张，招聘工作量大，急需招聘专员',
    jobRequirements: '1. 2年以上招聘经验\n2. 熟悉各类招聘渠道\n3. 有互联网行业招聘经验优先\n4. 沟通能力强',
    salaryRange: '10K-15K',
    expectedOnboardDate: '2026-04-20',
    hiringManagerId: 3,
    hiringManagerName: '张HR',
    hiringManagerDeptId: 10,
    hiringManagerDeptName: '人力资源部',
    approvalStatus: 1,
    ...buildDefaultNodes('人力资源部', 'approved', '超级管理员', '紧急岗位，尽快招聘到位', '2026-04-03 09:30:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-03 09:30:00',
    approvalComment: '紧急岗位，尽快招聘到位',
    publishedJobCount: 1,
    createTime: '2026-04-02 16:00:00',
    updateTime: '2026-04-03 09:30:00'
  },
  {
    id: 7,
    demandNo: 'RD202604007',
    departmentName: '财务部',
    departmentId: 5,
    positionName: '财务专员',
    recruitCount: 1,
    urgencyLevel: 1,
    demandReason: '财务工作量增加，需要增加人手',
    jobRequirements: '1. 会计相关专业\n2. 2年以上财务工作经验\n3. 熟悉财务软件\n4. 有会计证书',
    salaryRange: '8K-12K',
    expectedOnboardDate: '2026-06-01',
    hiringManagerId: 7,
    hiringManagerName: '周财务',
    hiringManagerDeptId: 5,
    hiringManagerDeptName: '财务部',
    approvalStatus: 2,
    ...buildDefaultNodes('财务部', 'rejected', 'HRBP 张HR', '暂不批准，现有人员可以满足需求', '2026-04-05 15:00:00', 1),
    approver: 'HRBP 张HR',
    approvalTime: '2026-04-05 15:00:00',
    approvalComment: '暂不批准，现有人员可以满足需求',
    publishedJobCount: 0,
    createTime: '2026-04-04 14:00:00',
    updateTime: '2026-04-05 15:00:00'
  },
  {
    id: 8,
    demandNo: 'RD202604008',
    departmentName: '技术部',
    departmentId: 3,
    positionName: '测试工程师',
    recruitCount: 2,
    urgencyLevel: 2,
    demandReason: '项目增多，测试人员不足',
    jobRequirements: '1. 2年以上测试经验\n2. 熟悉自动化测试\n3. 了解性能测试\n4. 有敏捷开发经验',
    salaryRange: '12K-20K',
    expectedOnboardDate: '2026-05-15',
    hiringManagerId: 5,
    hiringManagerName: '王技术',
    hiringManagerDeptId: 3,
    hiringManagerDeptName: '技术部',
    approvalStatus: 0,
    ...buildDefaultNodes('技术部', 'pending'),
    approver: '',
    approvalTime: '',
    approvalComment: '',
    publishedJobCount: 0,
    createTime: '2026-04-05 09:30:00',
    updateTime: '2026-04-05 09:30:00'
  },
  {
    id: 9,
    demandNo: 'RD202604009',
    departmentName: '市场部',
    departmentId: 4,
    positionName: '商务经理',
    recruitCount: 1,
    urgencyLevel: 2,
    demandReason: '业务拓展需要，增加商务人员',
    jobRequirements: '1. 3年以上商务工作经验\n2. 有大客户开发经验\n3. 沟通谈判能力强\n4. 有行业资源优先',
    salaryRange: '15K-25K',
    expectedOnboardDate: '2026-05-20',
    hiringManagerId: 6,
    hiringManagerName: '赵市场',
    hiringManagerDeptId: 4,
    hiringManagerDeptName: '市场部',
    approvalStatus: 1,
    ...buildDefaultNodes('市场部', 'approved', '超级管理员', '同意招聘，优先考虑有行业资源的候选人', '2026-04-05 11:00:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-05 11:00:00',
    approvalComment: '同意招聘，优先考虑有行业资源的候选人',
    publishedJobCount: 0,
    createTime: '2026-04-04 16:30:00',
    updateTime: '2026-04-05 11:00:00'
  },
  {
    id: 10,
    demandNo: 'RD202604010',
    departmentName: '技术部',
    departmentId: 3,
    positionName: '架构师',
    recruitCount: 1,
    urgencyLevel: 3,
    demandReason: '系统架构升级，需要资深架构师',
    jobRequirements: '1. 5年以上开发经验\n2. 3年以上架构设计经验\n3. 精通微服务、分布式架构\n4. 有大型系统架构经验',
    salaryRange: '30K-50K',
    expectedOnboardDate: '2026-04-25',
    hiringManagerId: 5,
    hiringManagerName: '王技术',
    hiringManagerDeptId: 3,
    hiringManagerDeptName: '技术部',
    approvalStatus: 1,
    ...buildDefaultNodes('技术部', 'approved', '超级管理员', '核心岗位，尽快招聘，可适当提高薪资', '2026-04-04 10:00:00'),
    approver: '超级管理员',
    approvalTime: '2026-04-04 10:00:00',
    approvalComment: '核心岗位，尽快招聘，可适当提高薪资',
    publishedJobCount: 0,
    createTime: '2026-04-03 10:00:00',
    updateTime: '2026-04-04 10:00:00'
  }
]

// 创建 CRUD Mock
export const recruitmentDemandMock = createCrudMock<RecruitmentDemand>(
  alignEmployeeFields(initialData, {
    roles: {
      // 用人经理：从员工池前 20 个管理族员工里取
      hiringManagerName: { startIndex: 0, empField: 'nameZh', filter: (e) => e.jobFamily === 'MGMT' },
      hiringManagerDeptName: { startIndex: 0, empField: 'orgName', filter: (e) => e.jobFamily === 'MGMT' },
      // 审批人：从管理族员工里取
      approverName: { startIndex: 5, empField: 'nameZh', filter: (e) => e.jobFamily === 'MGMT' }
    }
  }),
  {
    searchFields: ['demandNo', 'departmentName', 'positionName']
  }
)

/**
 * 获取内部数据引用（用于 Phase 0 新增的自定义 Mock 函数）
 */
export function getMockDemandData(): RecruitmentDemand[] {
  return recruitmentDemandMock.getData() as RecruitmentDemand[]
}

/**
 * 编制联动校验：判断某部门再招 N 人是否会超编
 * @param departmentId 部门ID
 * @param recruitCount 本次需求人数
 */
export function checkEstablishmentForDemand(
  departmentId: number | undefined,
  recruitCount: number
): EstablishmentCheckResult {
  if (!departmentId) {
    return {
      headcount: 0,
      currentCount: 0,
      recruitCount,
      projectedCount: recruitCount,
      overstaffed: 2,
      message: '未传入部门ID，无法校验编制'
    }
  }

  // 1. 查询该部门的编制数据
  const staffings = staffingMock.getData()
  const deptStaffing = staffings.find((s) => s.departmentId === departmentId)
  if (!deptStaffing) {
    return {
      headcount: 0,
      currentCount: 0,
      recruitCount,
      projectedCount: recruitCount,
      overstaffed: 2,
      message: `该部门（ID=${departmentId}）尚未配置编制计划，建议先由 HR 在"编制管理"中完善`
    }
  }

  // 2. 统计部门在职员工数
  let currentCount = 0
  try {
    const res = getEmployeeListMock({ status: 1, departmentId, page: 1, pageSize: 9999 })
    currentCount = res.total || 0
  } catch {
    currentCount = deptStaffing.currentCount || 0
  }

  const headcount = deptStaffing.headcount || 0
  const projectedCount = currentCount + recruitCount

  if (projectedCount > headcount) {
    const over = projectedCount - headcount
    return {
      headcount,
      currentCount,
      recruitCount,
      projectedCount,
      overstaffed: 1,
      message: `本次招聘将导致部门超编 ${over} 人（编制=${headcount}，现有在编=${currentCount}，拟招=${recruitCount}）。审批流将自动追加一级 HRD/CEO 审批。`
    }
  }

  return {
    headcount,
    currentCount,
    recruitCount,
    projectedCount,
    overstaffed: 0,
    message: `编制充足（编制=${headcount}，现有在编=${currentCount}，拟招=${recruitCount}，招后在编=${projectedCount}）`
  }
}

/**
 * 生成全新的待审批节点链（提交/重新提交需求时使用）
 */
export function buildFreshApprovalNodes(deptName: string): ApprovalNode[] {
  return [
    {
      nodeIndex: 0,
      nodeName: '直属上级审批',
      approverRole: 'R_DEPT_MANAGER',
      approverName: `${deptName}负责人`,
      status: 0
    },
    {
      nodeIndex: 1,
      nodeName: 'HRBP 审批',
      approverRole: 'R_HR',
      approverName: '张HR',
      status: 0
    },
    {
      nodeIndex: 2,
      nodeName: 'HRD 审批',
      approverRole: 'R_SUPER',
      approverName: '超级管理员',
      status: 0
    }
  ]
}

/**
 * 提交招聘需求（自动触发审批流 + 编制联动校验）
 * @param data 新需求数据（不含审批相关字段）
 */
export function submitDemandMock(data: Partial<RecruitmentDemand>): RecruitmentDemand {
  const deptName = data.hiringManagerDeptName || data.departmentName || ''
  const nodes = buildFreshApprovalNodes(deptName)

  // 编制校验
  const establishmentCheck = checkEstablishmentForDemand(
    data.hiringManagerDeptId || data.departmentId,
    data.recruitCount || 0
  )

  // 超编时自动追加 CEO 审批节点
  if (establishmentCheck.overstaffed === 1) {
    nodes.push({
      nodeIndex: nodes.length,
      nodeName: 'CEO 审批（超编自动触发）',
      approverRole: 'R_SUPER',
      approverName: '超级管理员',
      status: 0
    })
  }

  // 生成需求编号
  const items = getMockDemandData()
  const maxId = Math.max(...items.map((i) => i.id), 0)
  const nextId = maxId + 1
  const newDemand = recruitmentDemandMock.add({
    ...data,
    demandNo: data.demandNo || `RD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(nextId).padStart(3, '0')}`,
    approvalStatus: 0,
    approvalNodes: nodes,
    currentNodeIndex: 0,
    approver: '',
    approvalTime: '',
    approvalComment: '',
    publishedJobCount: 0,
    establishmentCheck
  }) as RecruitmentDemand
  return newDemand
}

/**
 * 审批节点推进（通过）
 * @param id 需求ID
 * @param opinion 审批意见
 * @param approverName 审批人姓名
 */
export function approveNodeMock(id: number, opinion: string, approverName: string): RecruitmentDemand {
  const items = getMockDemandData()
  const demand = items.find((d) => d.id === id)
  if (!demand) throw new Error('招聘需求不存在')
  if (demand.approvalStatus !== 0) throw new Error('该需求当前不处于审批中状态')

  const nodes = demand.approvalNodes || []
  const currentIdx = demand.currentNodeIndex ?? 0
  const currentNode = nodes[currentIdx]
  if (!currentNode) throw new Error('审批节点不存在')

  // 推进节点
  currentNode.status = 1
  currentNode.approveTime = new Date().toLocaleString('zh-CN')
  currentNode.opinion = opinion
  currentNode.approverName = approverName

  const nextIdx = currentIdx + 1
  if (nextIdx >= nodes.length) {
    // 所有节点通过，审批结束
    demand.approvalStatus = 1
    demand.currentNodeIndex = nodes.length
    demand.approver = approverName
    demand.approvalTime = currentNode.approveTime
    demand.approvalComment = opinion
  } else {
    demand.currentNodeIndex = nextIdx
  }
  demand.updateTime = new Date().toLocaleString('zh-CN')
  return demand
}

/**
 * 审批节点驳回
 * @param id 需求ID
 * @param opinion 驳回原因
 * @param approverName 审批人姓名
 */
export function rejectNodeMock(id: number, opinion: string, approverName: string): RecruitmentDemand {
  const items = getMockDemandData()
  const demand = items.find((d) => d.id === id)
  if (!demand) throw new Error('招聘需求不存在')
  if (demand.approvalStatus !== 0) throw new Error('该需求当前不处于审批中状态')

  const nodes = demand.approvalNodes || []
  const currentIdx = demand.currentNodeIndex ?? 0
  const currentNode = nodes[currentIdx]
  if (!currentNode) throw new Error('审批节点不存在')

  currentNode.status = 2
  currentNode.approveTime = new Date().toLocaleString('zh-CN')
  currentNode.opinion = opinion
  currentNode.approverName = approverName

  demand.approvalStatus = 2 // 已驳回
  demand.approver = approverName
  demand.approvalTime = currentNode.approveTime
  demand.approvalComment = opinion
  demand.updateTime = currentNode.approveTime
  return demand
}

/**
 * 重新提交被驳回的需求（重置审批链）
 * @param id 需求ID
 * @param updated 需求的更新字段（可能包含被修改后的内容）
 */
export function resubmitDemandMock(id: number, updated: Partial<RecruitmentDemand>): RecruitmentDemand {
  const items = getMockDemandData()
  const demand = items.find((d) => d.id === id)
  if (!demand) throw new Error('招聘需求不存在')
  if (demand.approvalStatus !== 2) throw new Error('仅已驳回的需求可重新提交')

  Object.assign(demand, updated)
  demand.approvalStatus = 0 // 审批中
  demand.approvalNodes = buildFreshApprovalNodes(demand.hiringManagerDeptName || demand.departmentName)
  demand.currentNodeIndex = 0
  demand.approver = ''
  demand.approvalTime = ''
  demand.approvalComment = ''
  demand.updateTime = new Date().toLocaleString('zh-CN')
  return demand
}

/**
 * 关闭招聘需求
 * @param id 需求ID
 * @param reason 关闭原因
 */
export function closeDemandMock(id: number, reason: string): RecruitmentDemand {
  const items = getMockDemandData()
  const demand = items.find((d) => d.id === id)
  if (!demand) throw new Error('招聘需求不存在')
  if (demand.approvalStatus !== 1) throw new Error('仅已通过的需求可关闭')

  demand.approvalStatus = 3 // 已关闭
  demand.closeReason = reason
  demand.closeTime = new Date().toLocaleString('zh-CN')
  demand.updateTime = demand.closeTime
  return demand
}

/**
 * 当 HR 发布职位时，回写到需求的已发布职位计数
 */
export function incrementPublishedJobCountMock(demandId: number): void {
  const items = getMockDemandData()
  const demand = items.find((d) => d.id === demandId)
  if (demand) {
    demand.publishedJobCount = (demand.publishedJobCount || 0) + 1
    demand.updateTime = new Date().toLocaleString('zh-CN')
  }
}
