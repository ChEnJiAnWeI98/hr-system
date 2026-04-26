import { createCrudApi } from '@/utils/crud/apiHelper'
import type { Resume, ResumeListParams } from '@/types/resume'
import { resumeMock } from '@/mock/resume'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 简历管理 API
 */
const resumeApi = createCrudApi<Resume>({
  baseUrl: '/admin/resume',
  mockFns: USE_MOCK ? resumeMock : undefined
})

export const {
  getList: getResumeList,
  getDetail: getResumeDetail,
  add: addResume,
  update: updateResume,
  delete: deleteResume
} = resumeApi
