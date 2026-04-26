import type { RecruitmentDemand, RecruitmentDemandListParams } from '@/types/recruitment'
import { createCrudApi } from '@/utils/crud'
import { recruitmentDemandMock } from '@/mock/recruitmentDemand'

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

// 导出别名
export const getDetail = getRecruitmentDemandDetail

/**
 * 添加招聘需求
 */
export const addRecruitmentDemand = recruitmentDemandApi.add

/**
 * 更新招聘需求
 */
export const updateRecruitmentDemand = recruitmentDemandApi.update

/**
 * 删除招聘需求
 */
export const removeRecruitmentDemand = recruitmentDemandApi.remove

/**
 * 批量删除招聘需求
 */
export const batchDeleteRecruitmentDemand = (ids: number[]) => {
  if (recruitmentDemandApi.remove) {
    return Promise.all(ids.map(id => recruitmentDemandApi.remove!(id)))
  }
  return Promise.resolve({ code: 200, message: '批量删除成功' })
}

/**
 * 审批招聘需求
 */
export const approveRecruitmentDemand = (data: { id: number; approvalResult: number; approvalOpinion: string }) => {
  // Mock 模式下的审批逻辑
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '审批成功',
          data: null
        })
      }, 300)
    })
  }

  // 真实 API 调用
  return recruitmentDemandApi.update({
    id: data.id,
    approvalStatus: data.approvalResult,
    approvalComment: data.approvalOpinion
  } as any)
}
