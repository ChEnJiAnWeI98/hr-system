/**
 * 通知配置 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { NotificationConfig } from '@/types/system'

/**
 * 初始通知配置数据
 */
const initialData: NotificationConfig[] = [
  {
    id: 1,
    scenarioCode: 'CONTRACT_EXPIRE',
    scenarioName: '合同到期提醒',
    channel: '站内信,邮件',
    template: '您的劳动合同将于 {days} 天后到期，请及时办理续签手续。',
    advanceDays: 30,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    scenarioCode: 'PROBATION_EXPIRE',
    scenarioName: '试用期到期提醒',
    channel: '站内信,企业微信',
    template: '员工 {name} 的试用期将于 {days} 天后到期，请及时进行转正评估。',
    advanceDays: 7,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 3,
    scenarioCode: 'BIRTHDAY_REMIND',
    scenarioName: '员工生日提醒',
    channel: '站内信',
    template: '明天是员工 {name} 的生日，祝 TA 生日快乐！',
    advanceDays: 1,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 4,
    scenarioCode: 'CERTIFICATE_EXPIRE',
    scenarioName: '证件到期提醒',
    channel: '站内信,短信',
    template: '您的 {certType} 将于 {days} 天后到期，请及时更新证件信息。',
    advanceDays: 30,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 5,
    scenarioCode: 'ONBOARD_APPROVAL',
    scenarioName: '入职审批通知',
    channel: '站内信,企业微信',
    template: '您有一条入职审批待处理，申请人：{name}，入职日期：{date}。',
    advanceDays: 0,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 6,
    scenarioCode: 'RESIGN_APPROVAL',
    scenarioName: '离职审批通知',
    channel: '站内信,邮件',
    template: '您有一条离职审批待处理，申请人：{name}，离职日期：{date}。',
    advanceDays: 0,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 7,
    scenarioCode: 'ATTENDANCE_ABNORMAL',
    scenarioName: '考勤异常提醒',
    channel: '站内信',
    template: '您有考勤异常记录，日期：{date}，类型：{type}，请及时处理。',
    advanceDays: 0,
    status: 1,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 8,
    scenarioCode: 'SALARY_PAYMENT',
    scenarioName: '薪资发放通知',
    channel: '站内信,短信',
    template: '您的 {month} 月工资已发放，实发金额：{amount} 元，请注意查收。',
    advanceDays: 0,
    status: 0,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  }
]

/**
 * 创建通知配置 Mock 函数
 */
export const notificationMock = createCrudMock<NotificationConfig>(initialData, {
  searchFields: ['scenarioName', 'scenarioCode']
})
