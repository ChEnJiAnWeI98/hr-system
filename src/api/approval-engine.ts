import request from '@/utils/http'
import type {
  ApprovalTemplate,
  ApprovalInstance,
  ApprovalDelegate,
  ApprovalStatistics,
  ListParams,
  ApprovalAction
} from '@/types/approval-engine'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

console.log('Approval Engine API - USE_MOCK:', USE_MOCK)
console.log('Environment VITE_USE_MOCK:', import.meta.env.VITE_USE_MOCK)

import {
  getTemplateListMock,
  getTemplateDetailMock,
  addTemplateMock,
  updateTemplateMock,
  deleteTemplateMock,
  copyTemplateMock,
  toggleTemplateStatusMock,
  getInstanceListMock,
  createInstanceMock,
  getInstanceDetailMock,
  withdrawInstanceMock,
  urgeInstanceMock,
  getTodoListMock,
  processApprovalMock,
  batchProcessMock,
  getDelegateListMock,
  addDelegateMock,
  updateDelegateMock,
  deleteDelegateMock,
  toggleDelegateStatusMock,
  getStatisticsMock,
  getTypeDistributionMock,
  getApproverEfficiencyMock,
  getTimeEfficiencyMock
} from '@/mock/approval-engine'

// ==================== 流程模板 API ====================

/**
 * 获取流程模板列表
 */
export function getTemplateList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTemplateListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: ApprovalTemplate[]
    total: number
  }>({
    url: '/admin/approval/template/list',
    params
  })
}

/**
 * 获取流程模板详情
 */
export function getTemplateDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTemplateDetailMock(id)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ApprovalTemplate>({
    url: `/admin/approval/template/${id}`
  })
}

/**
 * 添加流程模板
 */
export function addTemplate(data: Partial<ApprovalTemplate>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addTemplateMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/template/add',
    data
  })
}

/**
 * 更新流程模板
 */
export function updateTemplate(data: Partial<ApprovalTemplate>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = updateTemplateMock(data)
        resolve({
          code: 200,
          message: '更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/approval/template/update',
    data
  })
}

/**
 * 删除流程模板
 */
export function deleteTemplate(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        deleteTemplateMock(id)
        resolve({
          code: 200,
          message: '删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: `/admin/approval/template/${id}`
  })
}

/**
 * 复制流程模板
 */
export function copyTemplate(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = copyTemplateMock(id)
        resolve({
          code: 200,
          message: '复制成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: `/admin/approval/template/copy/${id}`
  })
}

/**
 * 切换流程模板状态
 */
export function toggleTemplateStatus(id: number, status: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = toggleTemplateStatusMock(id, status)
        resolve({
          code: 200,
          message: '状态更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/approval/template/status',
    data: { id, status }
  })
}

// ==================== 审批实例 API ====================

/**
 * 获取审批实例列表
 */
export function getInstanceList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getInstanceListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: ApprovalInstance[]
    total: number
  }>({
    url: '/admin/approval/instance/list',
    params
  })
}

/**
 * 创建审批实例
 */
export function createInstance(data: Partial<ApprovalInstance>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = createInstanceMock(data)
        resolve({
          code: 200,
          message: '创建成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/instance/create',
    data
  })
}

/**
 * 获取审批实例详情
 */
export function getInstanceDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getInstanceDetailMock(id)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ApprovalInstance>({
    url: `/admin/approval/instance/${id}`
  })
}

/**
 * 撤回审批实例
 */
export function withdrawInstance(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        withdrawInstanceMock(id)
        resolve({
          code: 200,
          message: '撤回成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: `/admin/approval/instance/withdraw/${id}`
  })
}

/**
 * 催办审批实例
 */
export function urgeInstance(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // urgeInstanceMock(id)
        resolve({
          code: 200,
          message: '催办成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: `/admin/approval/instance/urge/${id}`
  })
}

/**
 * 导出审批实例
 */
export function exportInstance(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: `/admin/approval/instance/export/${id}`,
    responseType: 'blob'
  })
}

// ==================== 待办审批 API ====================

/**
 * 获取待办审批列表
 */
export function getTodoList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTodoListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: any[]
    total: number
  }>({
    url: '/admin/approval/todo/list',
    params
  })
}

/**
 * 处理审批
 */
export function processApproval(data: {
  todoId: number
  instanceId: number
  nodeId: string
  action: ApprovalAction
  comment?: string
  transferTo?: number
  addSignUsers?: number[]
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = processApprovalMock({ id: data.todoId, action: data.action, opinion: data.comment })
        resolve({
          code: 200,
          message: '处理成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/todo/process',
    data
  })
}

/**
 * 批量处理审批
 */
export function batchProcess(ids: number[], action: ApprovalAction) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // batchProcessMock(ids, action)
        resolve({
          code: 200,
          message: '批量处理成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/todo/batch',
    data: { ids, action }
  })
}

/**
 * 转交审批
 */
export function transferApproval(data: {
  todoId: number
  instanceId: number
  nodeId: string
  transferTo: number
  reason?: string
}) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '转交成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/todo/transfer',
    data
  })
}

// ==================== 代理设置 API ====================

/**
 * 获取代理设置列表
 */
export function getDelegateList(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getDelegateListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: ApprovalDelegate[]
    total: number
  }>({
    url: '/admin/approval/delegate/list',
    params
  })
}

/**
 * 添加代理设置
 */
export function addDelegate(data: Partial<ApprovalDelegate>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addDelegateMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/approval/delegate/add',
    data
  })
}

/**
 * 更新代理设置
 */
export function updateDelegate(data: Partial<ApprovalDelegate>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = updateDelegateMock(data)
        resolve({
          code: 200,
          message: '更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/approval/delegate/update',
    data
  })
}

/**
 * 删除代理设置
 */
export function deleteDelegate(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        deleteDelegateMock(id)
        resolve({
          code: 200,
          message: '删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: `/admin/approval/delegate/${id}`
  })
}

/**
 * 切换代理设置状态
 */
export function toggleDelegateStatus(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const currentDelegate = getDelegateListMock({ page: 1, pageSize: 1000 }).list.find(d => d.id === id)
        const newStatus = currentDelegate?.status === 1 ? 0 : 1
        const result = toggleDelegateStatusMock(id, newStatus)
        resolve({
          code: 200,
          message: '状态更新成功',
          data: result
        })
      }, 300)
    })
  }

  return request.put({
    url: '/admin/approval/delegate/status',
    data: { id, status }
  })
}

// ==================== 审批统计 API ====================

/**
 * 获取审批统计数据
 */
export function getStatistics(params?: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const stats = getStatisticsMock()
        const data = {
          totalInstances: stats.totalCount,
          completedInstances: stats.approvedCount,
          processingInstances: stats.pendingCount,
          rejectedInstances: stats.rejectedCount,
          avgDuration: stats.avgDuration,
          completionRate: stats.approvalRate
        }
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ApprovalStatistics>({
    url: '/admin/approval/statistics'
  })
}

/**
 * 获取审批类型分布
 */
export function getTypeDistribution() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTypeDistributionMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<any[]>({
    url: '/admin/approval/statistics/type'
  })
}

/**
 * 获取审批人效率统计
 */
export function getApproverEfficiency() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getApproverEfficiencyMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<any[]>({
    url: '/admin/approval/statistics/approver'
  })
}

/**
 * 获取审批时效统计
 */
export function getTimeEfficiency() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getTimeEfficiencyMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<any[]>({
    url: '/admin/approval/statistics/time'
  })
}

/**
 * 导出统计报表
 */
export function exportStatistics(params: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '导出成功'
        })
      }, 300)
    })
  }

  return request.get({
    url: '/admin/approval/statistics/export',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取统计详情列表
 */
export function getStatisticsDetail(params: ListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const templates = getTemplateListMock({ page: 1, pageSize: 1000 }).list
        const instances = getInstanceListMock({ page: 1, pageSize: 1000 }).list

        const list = templates.map(template => {
          const templateInstances = instances.filter(inst => inst.templateId === template.id)
          const totalCount = templateInstances.length
          const completedCount = templateInstances.filter(inst => inst.status === 2).length
          const processingCount = templateInstances.filter(inst => inst.status === 0 || inst.status === 1).length
          const rejectedCount = templateInstances.filter(inst => inst.status === 3).length

          const completedWithTime = templateInstances.filter(inst => inst.completeTime)
          let avgDuration = 0
          if (completedWithTime.length > 0) {
            const totalDuration = completedWithTime.reduce((sum, inst) => {
              const start = new Date(inst.initiateTime).getTime()
              const end = new Date(inst.completeTime!).getTime()
              return sum + (end - start)
            }, 0)
            avgDuration = Math.round(totalDuration / completedWithTime.length / (1000 * 60 * 60))
          }

          return {
            name: template.name,
            totalCount,
            completedCount,
            processingCount,
            rejectedCount,
            avgDuration,
            completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
          }
        })

        resolve({
          code: 200,
          message: 'success',
          data: { list, total: list.length }
        })
      }, 300)
    })
  }

  return request.get<{
    list: any[]
    total: number
  }>({
    url: '/admin/approval/statistics/detail',
    params
  })
}
