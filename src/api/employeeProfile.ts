import type { EmployeeProfile, EmployeeProfileUpdateParams } from '@/types/employeeSelfService'
import request from '@/utils/http'
import { employeeProfileMock } from '@/mock/employeeProfile'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取个人信息
 */
export function getEmployeeProfile() {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = employeeProfileMock.getList({})
        resolve({
          code: 200,
          message: '获取成功',
          data: data.list[0] || null
        })
      }, 300)
    })
  }

  return request.get<EmployeeProfile>({
    url: '/admin/employee-self-service/profile'
  })
}

/**
 * 更新个人信息
 */
export function updateEmployeeProfile(data: EmployeeProfileUpdateParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = employeeProfileMock.update(data)
          resolve({
            code: 200,
            message: '更新成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '更新失败'
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/employee-self-service/profile',
    data
  })
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
        resolve({
          code: 200,
          message: '上传成功',
          data: { avatarUrl }
        })
      }, 300)
    })
  }

  const formData = new FormData()
  formData.append('file', file)

  return request.post<{ avatarUrl: string }>({
    url: '/admin/employee-self-service/upload-avatar',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
