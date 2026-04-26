/**
 * 编制管理 API（Phase 3.3）
 */
import { createCrudApi } from '@/utils/crud/apiHelper'
import {
  headcountPlanMock,
  headcountAdjustMock,
  approveAdjustMock
} from '@/mock/org/headcount'
import type { HeadcountPlan, HeadcountAdjust } from '@/types/org/headcount'

const planCrud = createCrudApi<HeadcountPlan>({
  baseUrl: '/admin/org/headcount-plan',
  mockFns: headcountPlanMock
})

export const getHeadcountPlanList = planCrud.getList
export const updateHeadcountPlan = planCrud.update

const adjustCrud = createCrudApi<HeadcountAdjust>({
  baseUrl: '/admin/org/headcount-adjust',
  mockFns: headcountAdjustMock
})

export const getHeadcountAdjustList = adjustCrud.getList
export const addHeadcountAdjust = adjustCrud.add
export const deleteHeadcountAdjust = adjustCrud.delete

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function approveHeadcountAdjustApi(
  id: number,
  action: 'approved' | 'rejected',
  approverName: string,
  approverId: number,
  comment?: string
) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = approveAdjustMock(id, action, approverName, approverId, comment)
          resolve({ code: 200, data, message: '审批成功' })
        } catch (e: any) {
          reject({ code: 500, message: e.message })
        }
      }, 300)
    })
  }
  return Promise.resolve({ code: 200, data: null })
}
