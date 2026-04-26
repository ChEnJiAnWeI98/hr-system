import type {
  Application,
  ApplicationListParams,
  ApplicationSubmitParams
} from '@/types/employeeSelfService'
import { createCrudApi } from '@/utils/crud'
import { applicationMock } from '@/mock/application'
import request from '@/utils/http'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 申请管理 API
 */
export const applicationApi = createCrudApi({
  baseUrl: '/admin/employee-self-service/application',
  mockFns: applicationMock
})

/**
 * 获取申请列表
 */
export const getApplicationList = applicationApi.getList

/**
 * 获取申请详情
 */
export const getApplicationDetail = applicationApi.getDetail

/**
 * 提交申请
 */
export function submitApplication(data: ApplicationSubmitParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const newApplication: Application = {
          id: Date.now(),
          applicationNo: `APP${Date.now()}`,
          employeeId: 1001,
          employeeName: '张三',
          department: '技术部',
          applicationType: data.applicationType || '加班申请',
          applicationTypeName: data.applicationType || '加班申请',
          title: data.title,
          content: data.content,
          startDate: '',
          endDate: '',
          days: 0,
          amount: 0,
          status: 1,
          statusName: '待审批',
          approver: '李经理',
          approverId: 2001,
          submitTime: new Date().toLocaleString('zh-CN'),
          approveTime: '',
          approveRemark: '',
          remark: '',
          createTime: new Date().toLocaleString('zh-CN'),
          updateTime: new Date().toLocaleString('zh-CN')
        }
        resolve({
          code: 200,
          message: '提交成功',
          data: newApplication
        })
      }, 300)
    })
  }

  return request.post<Application>({
    url: '/admin/employee-self-service/application/submit',
    data
  })
}

/**
 * 撤回申请
 */
export function withdrawApplication(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = applicationMock.updateStatus(id, 4) // 4-已撤回
          resolve({
            code: 200,
            message: '撤回成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '撤回失败'
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/employee-self-service/application/withdraw/${id}`
  })
}
