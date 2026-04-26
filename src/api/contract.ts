import request from '@/utils/http'
import type {
  ContractTemplate,
  ContractTemplateQueryParams,
  ContractTemplateVersion,
  Contract,
  ContractQueryParams,
  ContractApprovalParams,
  ContractSignParams,
  ContractRenewParams,
  ContractChangeParams,
  ContractTerminateParams,
  ContractArchive,
  ContractArchiveQueryParams,
  ContractStatistics,
  ExpiringContract
} from '@/types/contract'
import {
  getTemplateListMock,
  getTemplateDetailMock,
  addTemplateMock,
  updateTemplateMock,
  deleteTemplateMock,
  batchDeleteTemplatesMock,
  toggleTemplateStatusMock,
  getTemplateVersionsMock,
  getContractListMock,
  getContractDetailMock,
  addContractMock,
  updateContractMock,
  deleteContractMock,
  submitContractMock,
  approveContractMock,
  signContractMock,
  renewContractMock,
  changeContractMock,
  terminateContractMock,
  getArchiveListMock,
  archiveContractMock,
  getContractStatisticsMock,
  getExpiringContractsMock
} from '@/mock/contract'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==================== 合同模板 API ====================

/**
 * 获取模板列表
 */
export function getTemplateList(params: ContractTemplateQueryParams) {
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
    list: ContractTemplate[]
    total: number
  }>({
    url: '/admin/contract/template/list',
    params
  })
}

/**
 * 获取模板详情
 */
export function getTemplateDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getTemplateDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '模板不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<ContractTemplate>({
    url: `/admin/contract/template/${id}`
  })
}

/**
 * 新增模板
 */
export function addTemplate(data: Partial<ContractTemplate>) {
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
    url: '/admin/contract/template/add',
    data
  })
}

/**
 * 更新模板
 */
export function updateTemplate(data: Partial<ContractTemplate>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateTemplateMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/contract/template/update',
    data
  })
}

/**
 * 删除模板
 */
export function deleteTemplate(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteTemplateMock(id)
          resolve({
            code: 200,
            message: '删除成功'
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/contract/template/${id}`
  })
}

/**
 * 批量删除模板
 */
export function batchDeleteTemplates(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteTemplatesMock(ids)
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/template/batch-delete',
    data: { ids }
  })
}

/**
 * 启用/停用模板
 */
export function toggleTemplateStatus(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = toggleTemplateStatusMock(id)
          resolve({
            code: 200,
            message: '操作成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/contract/template/toggle-status/${id}`
  })
}

/**
 * 获取模板版本列表
 */
export function getTemplateVersions(templateId: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getTemplateVersionsMock(templateId)
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.get<ContractTemplateVersion[]>({
    url: `/admin/contract/template/versions/${templateId}`
  })
}

// ==================== 合同管理 API ====================

/**
 * 获取合同列表
 */
export function getContractList(params: ContractQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getContractListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Contract[]
    total: number
  }>({
    url: '/admin/contract/list',
    params
  })
}

/**
 * 获取合同详情
 */
export function getContractDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        const data = getContractDetailMock(id)
        if (data) {
          resolve({
            code: 200,
            message: 'success',
            data
          })
        } else {
          reject({
            code: 404,
            message: '合同不存在'
          })
        }
      }, 300)
    })
  }

  return request.get<Contract>({
    url: `/admin/contract/${id}`
  })
}

/**
 * 新增合同
 */
export function addContract(data: Partial<Contract>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = addContractMock(data)
        resolve({
          code: 200,
          message: '添加成功',
          data: result
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/add',
    data
  })
}

/**
 * 更新合同
 */
export function updateContract(data: Partial<Contract>) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = updateContractMock(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/contract/update',
    data
  })
}

/**
 * 删除合同
 */
export function deleteContract(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          deleteContractMock(id)
          resolve({
            code: 200,
            message: '删除成功'
          })
        } catch (error: any) {
          reject({
            code: 404,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.del({
    url: `/admin/contract/${id}`
  })
}

/**
 * 提交合同审批
 */
export function submitContract(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = submitContractMock(id)
          resolve({
            code: 200,
            message: '提交成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: `/admin/contract/submit/${id}`
  })
}

/**
 * 审批合同
 */
export function approveContract(params: ContractApprovalParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = approveContractMock(params)
          resolve({
            code: 200,
            message: '审批成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/approve',
    data: params
  })
}

/**
 * 签订合同
 */
export function signContract(params: ContractSignParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = signContractMock(params)
          resolve({
            code: 200,
            message: '签订成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/sign',
    data: params
  })
}

/**
 * 续签合同
 */
export function renewContract(params: ContractRenewParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = renewContractMock(params)
          resolve({
            code: 200,
            message: '续签成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/renew',
    data: params
  })
}

/**
 * 变更合同
 */
export function changeContract(params: ContractChangeParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = changeContractMock(params)
          resolve({
            code: 200,
            message: '变更成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/change',
    data: params
  })
}

/**
 * 终止合同
 */
export function terminateContract(params: ContractTerminateParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = terminateContractMock(params)
          resolve({
            code: 200,
            message: '终止成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/terminate',
    data: params
  })
}

// ==================== 合同归档 API ====================

/**
 * 获取归档列表
 */
export function getArchiveList(params: ContractArchiveQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getArchiveListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: ContractArchive[]
    total: number
  }>({
    url: '/admin/contract/archive/list',
    params
  })
}

/**
 * 归档合同
 */
export function archiveContract(id: number, reason: string) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = archiveContractMock(id, reason)
          resolve({
            code: 200,
            message: '归档成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 400,
            message: error.message
          })
        }
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/archive',
    data: { id, reason }
  })
}

/**
 * 删除归档记录
 */
export function deleteArchive(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: `/admin/contract/archive/${id}`
  })
}

/**
 * 批量删除归档记录
 */
export function batchDeleteArchive(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '批量删除成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/contract/archive/batch-delete',
    data: { ids }
  })
}

// ==================== 合同统计 API ====================

/**
 * 获取合同统计数据
 */
export function getContractStatistics() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getContractStatisticsMock()
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ContractStatistics>({
    url: '/admin/contract/statistics'
  })
}

/**
 * 获取即将到期合同列表
 */
export function getExpiringContracts(days: number = 30) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getExpiringContractsMock(days)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<ExpiringContract[]>({
    url: '/admin/contract/expiring',
    params: { days }
  })
}
