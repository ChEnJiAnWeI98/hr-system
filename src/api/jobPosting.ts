import request from '@/utils/http'
import type { JobPosting, JobPostingListParams } from '@/types/jobPosting'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { jobPostingMock } from '@/mock/jobPosting'
import { getRecruitmentDemandList } from '@/api/recruitmentDemand'
import { incrementPublishedJobCountMock } from '@/mock/recruitmentDemand'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 300

// 使用 CRUD 工具创建 API
const jobPostingApi = createCrudApi<JobPosting>({
  baseUrl: '/admin/recruitment/job',
  mockFns: USE_MOCK ? jobPostingMock : undefined
})

/**
 * 获取职位发布列表
 */
export const getJobPostingList = jobPostingApi.getList

/**
 * 获取职位发布详情
 */
export const getJobPostingDetail = jobPostingApi.getDetail

/**
 * 添加职位发布（必须基于已审批通过的招聘需求）
 */
export const addJobPosting = (data: Partial<JobPosting>) => {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!data.demandId) {
            throw new Error('必须先选择已审批通过的招聘需求才能发布职位')
          }
          const result = jobPostingMock.add(data)
          // 回写需求的已发布职位数
          incrementPublishedJobCountMock(data.demandId)
          resolve({ code: 200, data: result, message: '发布成功' })
        } catch (error: any) {
          reject({ code: 500, message: error.message || '发布失败' })
        }
      }, MOCK_DELAY)
    })
  }
  return request.post({
    url: '/admin/recruitment/job/add',
    data
  })
}

/**
 * 更新职位发布
 */
export const updateJobPosting = jobPostingApi.update

/**
 * 删除职位发布
 */
export const deleteJobPosting = jobPostingApi.delete

/**
 * 批量删除职位发布
 */
export const batchDeleteJobPosting = jobPostingApi.batchDelete

/**
 * 获取可发布职位的招聘需求列表
 * （仅返回已审批通过且未关闭的需求）
 */
export const getPublishableDemands = async () => {
  const res = await getRecruitmentDemandList({
    approvalStatus: 1,
    page: 1,
    pageSize: 1000
  } as any)
  return res
}

// ============ Phase 2.5 新增 API ============

/**
 * 克隆职位（生成一份新职位副本，默认状态为"草稿"，需要 HR 补充后发布）
 */
export const cloneJobPosting = async (sourceId: number) => {
  // 先获取源职位详情
  const detail = await jobPostingApi.getDetail(sourceId)
  if (detail.code !== 200) throw new Error('未找到源职位')
  const src = detail.data
  const now = new Date()
  const payload: Partial<JobPosting> = {
    ...src,
    id: undefined,
    jobNo: `JOB${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${Date.now().toString().slice(-4)}`,
    jobTitle: `${src.jobTitle}（副本）`,
    publishTime: now.toLocaleString('zh-CN'),
    viewCount: 0,
    applyCount: 0,
    status: 2, // 暂停（相当于草稿待编辑）
    clonedFromId: sourceId,
    referralLink: undefined,
    referralPoster: undefined
  }
  return addJobPosting(payload)
}

/**
 * 为职位开启内推并生成专属链接 + 海报（Mock：生成 URL 字符串）
 */
export const enableJobReferral = async (id: number) => {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const token = Math.random().toString(36).slice(2, 10)
        const link = `https://hr.demo/jobs/${id}/refer?ref=${token}`
        const poster = `https://hr.demo/referral-poster/${id}.png`
        const updated = jobPostingMock.update({
          id,
          referralOpen: 1,
          referralLink: link,
          referralPoster: poster
        } as any)
        resolve({ code: 200, data: updated, message: '内推已开启' })
      }, MOCK_DELAY)
    })
  }
  return request.post({ url: `/admin/recruitment/job/${id}/enable-referral` })
}

/**
 * 关闭内推
 */
export const disableJobReferral = async (id: number) => {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const updated = jobPostingMock.update({
          id,
          referralOpen: 0,
          referralLink: '',
          referralPoster: ''
        } as any)
        resolve({ code: 200, data: updated, message: '内推已关闭' })
      }, MOCK_DELAY)
    })
  }
  return request.post({ url: `/admin/recruitment/job/${id}/disable-referral` })
}
