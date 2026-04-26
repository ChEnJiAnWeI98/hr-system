/**
 * 系统参数 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { SystemParam } from '@/types/system'

/**
 * 初始数据
 */
const initialData: SystemParam[] = [
  // 基础配置组
  {
    id: 1,
    paramName: '系统名称',
    paramCode: 'system_name',
    paramValue: '企业HR管理系统',
    paramType: '文本',
    paramGroup: '基础配置',
    description: '系统显示的名称',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    paramName: '系统Logo',
    paramCode: 'system_logo',
    paramValue: '/logo.png',
    paramType: '文件',
    paramGroup: '基础配置',
    description: '系统Logo图片路径',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 3,
    paramName: '系统版本',
    paramCode: 'system_version',
    paramValue: 'V1.0.0',
    paramType: '文本',
    paramGroup: '基础配置',
    description: '当前系统版本号',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 安全配置组
  {
    id: 4,
    paramName: '密码最小长度',
    paramCode: 'password_min_length',
    paramValue: '6',
    paramType: '数字',
    paramGroup: '安全配置',
    description: '用户密码最小长度限制',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 5,
    paramName: '密码复杂度要求',
    paramCode: 'password_complexity',
    paramValue: 'true',
    paramType: '布尔',
    paramGroup: '安全配置',
    description: '是否要求密码包含大小写字母、数字和特殊字符',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 6,
    paramName: '登录失败锁定次数',
    paramCode: 'login_fail_lock_count',
    paramValue: '5',
    paramType: '数字',
    paramGroup: '安全配置',
    description: '连续登录失败多少次后锁定账号',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 业务配置组
  {
    id: 7,
    paramName: '试用期默认天数',
    paramCode: 'probation_default_days',
    paramValue: '90',
    paramType: '数字',
    paramGroup: '业务配置',
    description: '新员工试用期默认天数',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 8,
    paramName: '年假计算规则',
    paramCode: 'annual_leave_rule',
    paramValue: '按工龄',
    paramType: '文本',
    paramGroup: '业务配置',
    description: '年假天数计算规则',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 9,
    paramName: '加班费倍率',
    paramCode: 'overtime_rate',
    paramValue: '1.5',
    paramType: '数字',
    paramGroup: '业务配置',
    description: '加班费计算倍率',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 通知配置组
  {
    id: 10,
    paramName: '邮件服务器地址',
    paramCode: 'email_server',
    paramValue: 'smtp.example.com',
    paramType: '文本',
    paramGroup: '通知配置',
    description: 'SMTP邮件服务器地址',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 11,
    paramName: '短信服务商',
    paramCode: 'sms_provider',
    paramValue: '阿里云',
    paramType: '文本',
    paramGroup: '通知配置',
    description: '短信服务提供商',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 12,
    paramName: '企业微信应用ID',
    paramCode: 'wechat_app_id',
    paramValue: 'wx123456',
    paramType: '文本',
    paramGroup: '通知配置',
    description: '企业微信应用ID',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  }
]

/**
 * 创建 CRUD Mock 函数
 */
const systemParamMock = createCrudMock<SystemParam>(initialData, {
  searchFields: ['paramName', 'paramCode']
})

/**
 * 按分组获取参数
 */
export function getByGroupMock(group: string) {
  const allData = systemParamMock.getData()
  return allData.filter((item) => item.paramGroup === group)
}

/**
 * 批量更新参数
 */
export function batchUpdateMock(params: Partial<SystemParam>[]) {
  const results: SystemParam[] = []
  params.forEach((param) => {
    const updated = systemParamMock.update(param)
    results.push(updated)
  })
  return results
}

export default systemParamMock
