import request from '@/utils/http'
import type { JobPosting, JobPostingListParams } from '@/types/jobPosting'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { jobPostingMock } from '@/mock/jobPosting'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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
 * 添加职位发布
 */
export const addJobPosting = jobPostingApi.add

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
