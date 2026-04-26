import type { RecruitmentDemand } from '@/types/recruitmentDemand'
import request from '@/utils/http'
import { createCrudApi } from '@/utils/crud'
import {
  recruitmentDemandMock,
  submitDemandMock,
  approveNodeMock,
  rejectNodeMock,
  resubmitDemandMock,
  closeDemandMock,
  checkEstablishmentForDemand
} from '@/mock/recruitmentDemand'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 300

/**
 * Mock 响应包装
 */
function mockResolve<T>(fn: () => T, successMsg = '操作成功') {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = fn()
        resolve({ code: 200, message: successMsg, data })
      } catch (error: any) {
        reject({ code: 500, message: error.message || '操作失败' })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 招聘需求管理 API
 */
export const recruitmentDemandApi = createCrudApi<RecruitmentDemand>({
  baseUrl: '/admin/recruitment/demand',
  mockFns: recruitmentDemandMock
})

/**
 * 获取招聘需求列表
 */
export const getRecruitmentDemandList = recruitmentDemandApi.getList

/**
 * 获取招聘需求详情
 */
export const getRecruitmentDemandDetail = recruitmentDemandApi.getDetail
export const getDetail = getRecruitmentDemandDetail

/**
 * 预校验编制联动（用于表单提交前 UI 提示；不落库）
 */
export const preCheckEstablishment = (departmentId: number | undefined, recruitCount: number) => {
  if (USE_MOCK) {
    return mockResolve(() => checkEstablishmentForDemand(departmentId, recruitCount), '校验完成')
  }
  return request.get({
    url: '/admin/recruitment/demand/check-establishment',
    params: { departmentId, recruitCount }
  })
}

/**
 * 添加招聘需求 —— 提交后自动触发审批流
 * 调用此方法即完成"提交审批"，无需再单独调用提交审批接口
 */
export const addRecruitmentDemand = (data: Partial<RecruitmentDemand>) => {
  if (USE_MOCK) {
    return mockResolve(() => submitDemandMock(data), '提交成功，已进入审批流')
  }
  return request.post({
    url: '/admin/recruitment/demand/submit',
    data
  })
}

/**
 * 更新招聘需求（仅草稿/已驳回状态下可用）
 */
export const updateRecruitmentDemand = recruitmentDemandApi.update

/**
 * 删除招聘需求
 */
export const removeRecruitmentDemand = recruitmentDemandApi.remove
export const batchDeleteRecruitmentDemand = (ids: number[]) => {
  if (recruitmentDemandApi.remove) {
    return Promise.all(ids.map((id) => recruitmentDemandApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}

/**
 * 审批通过当前节点
 * @param id 需求ID
 * @param opinion 审批意见
 * @param approverName 审批人姓名
 */
export const approveDemandNode = (id: number, opinion: string, approverName: string) => {
  if (USE_MOCK) {
    return mockResolve(() => approveNodeMock(id, opinion, approverName), '审批通过')
  }
  return request.post({
    url: `/admin/recruitment/demand/${id}/approve`,
    data: { opinion, approverName }
  })
}

/**
 * 审批驳回当前节点
 */
export const rejectDemandNode = (id: number, opinion: string, approverName: string) => {
  if (USE_MOCK) {
    return mockResolve(() => rejectNodeMock(id, opinion, approverName), '已驳回')
  }
  return request.post({
    url: `/admin/recruitment/demand/${id}/reject`,
    data: { opinion, approverName }
  })
}

/**
 * 重新提交被驳回的需求（重新触发完整审批流）
 */
export const resubmitDemand = (id: number, updated: Partial<RecruitmentDemand>) => {
  if (USE_MOCK) {
    return mockResolve(() => resubmitDemandMock(id, updated), '已重新提交，审批流已重置')
  }
  return request.post({
    url: `/admin/recruitment/demand/${id}/resubmit`,
    data: updated
  })
}

/**
 * 关闭已通过的招聘需求
 */
export const closeDemand = (id: number, reason: string) => {
  if (USE_MOCK) {
    return mockResolve(() => closeDemandMock(id, reason), '需求已关闭')
  }
  return request.post({
    url: `/admin/recruitment/demand/${id}/close`,
    data: { reason }
  })
}

/**
 * @deprecated 使用 approveDemandNode / rejectDemandNode 代替
 * 兼容旧调用：原 approveRecruitmentDemand(approvalResult 1=批准 2=拒绝)
 */
export const approveRecruitmentDemand = (data: {
  id: number
  approvalResult: number
  approvalOpinion: string
  approverName?: string
}) => {
  const approverName = data.approverName || '系统管理员'
  if (data.approvalResult === 1) {
    return approveDemandNode(data.id, data.approvalOpinion, approverName)
  }
  return rejectDemandNode(data.id, data.approvalOpinion, approverName)
}
