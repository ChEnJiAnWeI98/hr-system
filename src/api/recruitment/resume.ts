import request from '@/utils/http'
import type { Resume, ResumeListParams, ScheduleInterviewParams, CandidateNote } from '@/types/recruitment'
import {
  getResumeListMock,
  getResumeDetailMock,
  importResumeMock,
  batchStoreResumeMock,
  batchDeleteResumeMock,
  scheduleInterviewMock,
  rejectResumeMock,
  linkTalentProfileMock,
  getCandidateNotesMock,
  addCandidateNoteMock,
  deleteCandidateNoteMock,
  dedupeResumeMock
} from '@/mock/recruitment/resume'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 300

function mockResolve<T>(fn: () => T, successMsg = 'success') {
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
 * 获取简历列表
 */
export function getResumeList(params: ResumeListParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getResumeListMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return request.get<{
    list: Resume[]
    total: number
  }>({
    url: '/admin/recruitment/resume/list',
    params
  })
}

/**
 * 获取简历详情
 */
export function getResumeDetail(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = getResumeDetailMock(id)
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

  return request.get<Resume>({
    url: `/admin/recruitment/resume/detail/${id}`
  })
}

/**
 * 导入简历
 */
export function importResume(file: any) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = importResumeMock(file)
        resolve({
          code: 200,
          message: '导入成功',
          data
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/resume/import',
    data: file
  })
}

/**
 * 批量入库
 */
export function batchStoreResume(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchStoreResumeMock(ids)
        resolve({
          code: 200,
          message: '入库成功'
        })
      }, 300)
    })
  }

  return request.post({
    url: '/admin/recruitment/resume/batch-store',
    data: { ids }
  })
}

/**
 * 批量删除简历
 */
export function batchDeleteResume(ids: number[]) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        batchDeleteResumeMock(ids)
        resolve({
          code: 200,
          message: '删除成功'
        })
      }, 300)
    })
  }

  return request.del({
    url: '/admin/recruitment/resume/batch-delete',
    data: { ids }
  })
}

/**
 * 安排面试
 */
export function scheduleInterview(data: ScheduleInterviewParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          scheduleInterviewMock(data)
          resolve({
            code: 200,
            message: '安排面试成功'
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

  return request.post({
    url: '/admin/recruitment/resume/schedule-interview',
    data
  })
}

/**
 * 淘汰简历（Phase 2.1 增强：支持淘汰原因字典）
 */
export function rejectResume(id: number, reasonCode?: string, reasonText?: string, byName?: string) {
  if (USE_MOCK) {
    return mockResolve(() => rejectResumeMock(id, reasonCode, reasonText, byName), '淘汰成功')
  }

  return request.post({
    url: `/admin/recruitment/resume/reject/${id}`,
    data: { reasonCode, reasonText, byName }
  })
}

// ============ Phase 2.1 新增 API ============

/**
 * 简历查重（三要素：手机号/邮箱）
 * Mock 阶段：同时查询"简历库"和"人才档案库"
 */
export function checkDuplicateResume(phone?: string, email?: string) {
  if (USE_MOCK) {
    return mockResolve(() => {
      const resumeMatch = dedupeResumeMock(phone, email)
      return { resumeMatch }
    }, '查重完成')
  }
  return request.get({
    url: '/admin/recruitment/resume/check-duplicate',
    params: { phone, email }
  })
}

/**
 * 关联到人才库档案（简历入库人才库后回写）
 */
export function linkResumeToTalent(resumeId: number, talentProfileId: number) {
  if (USE_MOCK) {
    return mockResolve(() => {
      linkTalentProfileMock(resumeId, talentProfileId)
      return true
    }, '已关联人才档案')
  }
  return request.post({
    url: `/admin/recruitment/resume/${resumeId}/link-talent`,
    data: { talentProfileId }
  })
}

/**
 * 获取某份简历的候选人笔记列表
 */
export function getCandidateNotes(resumeId: number) {
  if (USE_MOCK) {
    return mockResolve(() => getCandidateNotesMock(resumeId), '获取成功')
  }
  return request.get({ url: `/admin/recruitment/resume/${resumeId}/notes` })
}

/**
 * 新增候选人笔记/评论
 */
export function addCandidateNote(data: Partial<CandidateNote>) {
  if (USE_MOCK) {
    return mockResolve(() => addCandidateNoteMock(data), '评论已发布')
  }
  return request.post({
    url: `/admin/recruitment/resume/${data.resumeId}/notes`,
    data
  })
}

/**
 * 删除候选人笔记
 */
export function deleteCandidateNote(id: number) {
  if (USE_MOCK) {
    return mockResolve(() => deleteCandidateNoteMock(id), '已删除')
  }
  return request.del({ url: `/admin/recruitment/resume/notes/${id}` })
}
