import type { TodoTask, TodoTaskListParams, TodoTaskProcessParams } from '@/types/employeeSelfService'
import { createCrudApi } from '@/utils/crud'
import { todoTaskMock } from '@/mock/todoTask'
import request from '@/utils/http'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 待办任务 API
 */
export const todoTaskApi = createCrudApi({
  baseUrl: '/admin/employee-self-service/todo-task',
  mockFns: todoTaskMock
})

/**
 * 获取待办任务列表
 */
export const getTodoTaskList = todoTaskApi.getList

/**
 * 获取任务详情
 */
export const getTodoTaskDetail = todoTaskApi.getDetail

/**
 * 处理任务
 */
export function processTodoTask(data: TodoTaskProcessParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = todoTaskMock.updateStatus(data.id, 2) // 2-已处理
          resolve({
            code: 200,
            message: '处理成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '处理失败'
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: '/admin/employee-self-service/todo-task/process',
    data
  })
}

/**
 * 标记已读
 */
export function markTaskAsRead(id: number) {
  if (USE_MOCK) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = todoTaskMock.updateStatus(id, 2) // 2-已读
          resolve({
            code: 200,
            message: '标记成功',
            data: result
          })
        } catch (error: any) {
          reject({
            code: 500,
            message: error.message || '标记失败'
          })
        }
      }, 300)
    })
  }

  return request.put({
    url: `/admin/employee-self-service/todo-task/read/${id}`
  })
}
