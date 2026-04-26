/**
 * 数据字典 Mock 数据
 */

import { createCrudMock } from '@/utils/crud'
import type { DictCategory, DictItem } from '@/types/system'

/**
 * 字典分类初始数据
 */
const initialCategories: DictCategory[] = [
  {
    id: 1,
    categoryName: '员工状态',
    categoryCode: 'employee_status',
    description: '员工在职状态分类',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    categoryName: '合同类型',
    categoryCode: 'contract_type',
    description: '劳动合同类型分类',
    sort: 2,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 3,
    categoryName: '学历',
    categoryCode: 'education',
    description: '员工学历分类',
    sort: 3,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 4,
    categoryName: '性别',
    categoryCode: 'gender',
    description: '性别分类',
    sort: 4,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 5,
    categoryName: '婚姻状况',
    categoryCode: 'marital_status',
    description: '婚姻状况分类',
    sort: 5,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 6,
    categoryName: '政治面貌',
    categoryCode: 'political_status',
    description: '政治面貌分类',
    sort: 6,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 7,
    categoryName: '民族',
    categoryCode: 'nation',
    description: '民族分类',
    sort: 7,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 8,
    categoryName: '证件类型',
    categoryCode: 'certificate_type',
    description: '证件类型分类',
    sort: 8,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 9,
    categoryName: '假期类型',
    categoryCode: 'leave_type',
    description: '假期类型分类',
    sort: 9,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 10,
    categoryName: '考勤状态',
    categoryCode: 'attendance_status',
    description: '考勤状态分类',
    sort: 10,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 11,
    categoryName: '合同状态',
    categoryCode: 'contract_status',
    description: '合同状态分类',
    sort: 11,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 12,
    categoryName: '签订方式',
    categoryCode: 'signing_method',
    description: '合同签订方式分类',
    sort: 12,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 13,
    categoryName: '合同归档原因',
    categoryCode: 'archive_reason',
    description: '合同归档原因分类',
    sort: 13,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 14,
    categoryName: '打卡类型',
    categoryCode: 'clock_type',
    description: '打卡类型分类',
    sort: 14,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 15,
    categoryName: '打卡方式',
    categoryCode: 'clock_method',
    description: '打卡方式分类',
    sort: 15,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 16,
    categoryName: '加班类型',
    categoryCode: 'overtime_type',
    description: '加班类型分类',
    sort: 16,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 17,
    categoryName: '外勤类型',
    categoryCode: 'field_work_type',
    description: '外勤类型分类',
    sort: 17,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 18,
    categoryName: '请假状态',
    categoryCode: 'leave_status',
    description: '请假状态分类',
    sort: 18,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 19,
    categoryName: '补卡原因',
    categoryCode: 'makeup_reason',
    description: '补卡原因分类',
    sort: 19,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 20,
    categoryName: '补卡状态',
    categoryCode: 'makeup_status',
    description: '补卡状态分类',
    sort: 20,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 21,
    categoryName: '异动类型',
    categoryCode: 'transfer_type',
    description: '员工异动类型分类',
    sort: 21,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 22,
    categoryName: '异动状态',
    categoryCode: 'transfer_status',
    description: '员工异动状态分类',
    sort: 22,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 23,
    categoryName: '评估结果',
    categoryCode: 'evaluation_result',
    description: '试用期评估结果分类',
    sort: 23,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 24,
    categoryName: '转正状态',
    categoryCode: 'confirmation_status',
    description: '转正状态分类',
    sort: 24,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 25,
    categoryName: '离职类型',
    categoryCode: 'resignation_type',
    description: '离职类型分类',
    sort: 25,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 26,
    categoryName: '离职状态',
    categoryCode: 'resignation_status',
    description: '离职状态分类',
    sort: 26,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 27,
    categoryName: '入职状态',
    categoryCode: 'onboarding_status',
    description: '入职状态分类',
    sort: 27,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 28,
    categoryName: '审批状态',
    categoryCode: 'approval_status',
    description: '审批状态分类',
    sort: 28,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 29,
    categoryName: '审批类型',
    categoryCode: 'approval_type',
    description: '审批类型分类',
    sort: 29,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 30,
    categoryName: '是否',
    categoryCode: 'yes_no',
    description: '是否选项分类',
    sort: 30,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 31,
    categoryName: '启用状态',
    categoryCode: 'enable_status',
    description: '启用状态分类',
    sort: 31,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  }
]

/**
 * 字典项初始数据
 */
const initialItems: DictItem[] = [
  // 员工状态
  {
    id: 1,
    categoryId: 1,
    dictLabel: '在职',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '正式在职员工',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    categoryId: 1,
    dictLabel: '离职',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '已离职员工',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 3,
    categoryId: 1,
    dictLabel: '试用期',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '试用期员工',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 4,
    categoryId: 1,
    dictLabel: '待入职',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '已发Offer待入职',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 合同类型
  {
    id: 5,
    categoryId: 2,
    dictLabel: '劳动合同',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '正式劳动合同',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 6,
    categoryId: 2,
    dictLabel: '劳务合同',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '劳务派遣合同',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 7,
    categoryId: 2,
    dictLabel: '实习协议',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '实习生协议',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 8,
    categoryId: 2,
    dictLabel: '兼职协议',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '兼职人员协议',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 学历
  {
    id: 9,
    categoryId: 3,
    dictLabel: '初中及以下',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '初中及以下学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 10,
    categoryId: 3,
    dictLabel: '高中',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '高中学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 11,
    categoryId: 3,
    dictLabel: '中专',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '中专学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 12,
    categoryId: 3,
    dictLabel: '大专',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '大专学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 13,
    categoryId: 3,
    dictLabel: '本科',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '本科学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 14,
    categoryId: 3,
    dictLabel: '硕士',
    dictValue: '6',
    sort: 6,
    status: 1,
    remark: '硕士研究生学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 15,
    categoryId: 3,
    dictLabel: '博士',
    dictValue: '7',
    sort: 7,
    status: 1,
    remark: '博士研究生学历',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 性别
  {
    id: 16,
    categoryId: 4,
    dictLabel: '男',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '男性',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 17,
    categoryId: 4,
    dictLabel: '女',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '女性',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 婚姻状况
  {
    id: 18,
    categoryId: 5,
    dictLabel: '未婚',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '未婚',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 19,
    categoryId: 5,
    dictLabel: '已婚',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '已婚',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 20,
    categoryId: 5,
    dictLabel: '离异',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '离异',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 21,
    categoryId: 5,
    dictLabel: '丧偶',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '丧偶',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 政治面貌
  {
    id: 22,
    categoryId: 6,
    dictLabel: '中共党员',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '中国共产党党员',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 23,
    categoryId: 6,
    dictLabel: '中共预备党员',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '中国共产党预备党员',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 24,
    categoryId: 6,
    dictLabel: '共青团员',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '中国共产主义青年团团员',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 25,
    categoryId: 6,
    dictLabel: '民主党派',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '民主党派成员',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 26,
    categoryId: 6,
    dictLabel: '群众',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '群众',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 民族
  {
    id: 27,
    categoryId: 7,
    dictLabel: '汉族',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '汉族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 28,
    categoryId: 7,
    dictLabel: '蒙古族',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '蒙古族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 29,
    categoryId: 7,
    dictLabel: '回族',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '回族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 30,
    categoryId: 7,
    dictLabel: '藏族',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '藏族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 31,
    categoryId: 7,
    dictLabel: '维吾尔族',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '维吾尔族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 32,
    categoryId: 7,
    dictLabel: '其他少数民族',
    dictValue: '99',
    sort: 99,
    status: 1,
    remark: '其他少数民族',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 证件类型
  {
    id: 33,
    categoryId: 8,
    dictLabel: '身份证',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '居民身份证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 34,
    categoryId: 8,
    dictLabel: '护照',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '护照',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 35,
    categoryId: 8,
    dictLabel: '港澳通行证',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '港澳居民来往内地通行证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 36,
    categoryId: 8,
    dictLabel: '台湾通行证',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '台湾居民来往大陆通行证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 37,
    categoryId: 8,
    dictLabel: '外国人永久居留证',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '外国人永久居留身份证',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 假期类型
  {
    id: 38,
    categoryId: 9,
    dictLabel: '年假',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '带薪年假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 39,
    categoryId: 9,
    dictLabel: '事假',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '事假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 40,
    categoryId: 9,
    dictLabel: '病假',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '病假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 41,
    categoryId: 9,
    dictLabel: '婚假',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '婚假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 42,
    categoryId: 9,
    dictLabel: '产假',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '产假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 43,
    categoryId: 9,
    dictLabel: '陪产假',
    dictValue: '6',
    sort: 6,
    status: 1,
    remark: '陪产假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 44,
    categoryId: 9,
    dictLabel: '丧假',
    dictValue: '7',
    sort: 7,
    status: 1,
    remark: '丧假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 45,
    categoryId: 9,
    dictLabel: '调休',
    dictValue: '8',
    sort: 8,
    status: 1,
    remark: '调休假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 考勤状态
  {
    id: 46,
    categoryId: 10,
    dictLabel: '正常',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '正常出勤',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 47,
    categoryId: 10,
    dictLabel: '迟到',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '迟到',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 48,
    categoryId: 10,
    dictLabel: '早退',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '早退',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 49,
    categoryId: 10,
    dictLabel: '旷工',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '旷工',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 50,
    categoryId: 10,
    dictLabel: '请假',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '请假',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 51,
    categoryId: 10,
    dictLabel: '出差',
    dictValue: '6',
    sort: 6,
    status: 1,
    remark: '出差',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 52,
    categoryId: 10,
    dictLabel: '外出',
    dictValue: '7',
    sort: 7,
    status: 1,
    remark: '外出',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 合同状态
  {
    id: 53,
    categoryId: 11,
    dictLabel: '草稿',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '草稿状态',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 54,
    categoryId: 11,
    dictLabel: '待审批',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 55,
    categoryId: 11,
    dictLabel: '待签订',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '待签订',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 56,
    categoryId: 11,
    dictLabel: '生效中',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '生效中',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 57,
    categoryId: 11,
    dictLabel: '已续签',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '已续签',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 58,
    categoryId: 11,
    dictLabel: '已终止',
    dictValue: '6',
    sort: 6,
    status: 1,
    remark: '已终止',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 59,
    categoryId: 11,
    dictLabel: '已到期',
    dictValue: '7',
    sort: 7,
    status: 1,
    remark: '已到期',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 60,
    categoryId: 11,
    dictLabel: '已归档',
    dictValue: '8',
    sort: 8,
    status: 1,
    remark: '已归档',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 签订方式
  {
    id: 61,
    categoryId: 12,
    dictLabel: '纸质签订',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '纸质合同签订',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 62,
    categoryId: 12,
    dictLabel: '电子签订',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '电子合同签订',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 63,
    categoryId: 12,
    dictLabel: '混合签订',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '纸质+电子混合签订',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 合同归档原因
  {
    id: 64,
    categoryId: 13,
    dictLabel: '合同到期',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '合同到期归档',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 65,
    categoryId: 13,
    dictLabel: '员工离职',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '员工离职归档',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 66,
    categoryId: 13,
    dictLabel: '合同终止',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '合同终止归档',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 67,
    categoryId: 13,
    dictLabel: '合同续签',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '合同续签归档',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 打卡类型
  {
    id: 68,
    categoryId: 14,
    dictLabel: '上班打卡',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '上班打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 69,
    categoryId: 14,
    dictLabel: '下班打卡',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '下班打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 70,
    categoryId: 14,
    dictLabel: '外勤打卡',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '外勤打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 打卡方式
  {
    id: 71,
    categoryId: 15,
    dictLabel: '指纹打卡',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '指纹打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 72,
    categoryId: 15,
    dictLabel: '人脸识别',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '人脸识别打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 73,
    categoryId: 15,
    dictLabel: '手机打卡',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '手机APP打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 74,
    categoryId: 15,
    dictLabel: '刷卡打卡',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '刷卡打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 加班类型
  {
    id: 75,
    categoryId: 16,
    dictLabel: '工作日加班',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '工作日加班',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 76,
    categoryId: 16,
    dictLabel: '周末加班',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '周末加班',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 77,
    categoryId: 16,
    dictLabel: '法定节假日加班',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '法定节假日加班',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 外勤类型
  {
    id: 78,
    categoryId: 17,
    dictLabel: '客户拜访',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '客户拜访',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 79,
    categoryId: 17,
    dictLabel: '出差',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '出差',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 80,
    categoryId: 17,
    dictLabel: '外出办事',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '外出办事',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 81,
    categoryId: 17,
    dictLabel: '培训学习',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '外出培训学习',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 请假状态
  {
    id: 82,
    categoryId: 18,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 83,
    categoryId: 18,
    dictLabel: '已通过',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 84,
    categoryId: 18,
    dictLabel: '已拒绝',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 85,
    categoryId: 18,
    dictLabel: '已撤销',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '已撤销',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 补卡原因
  {
    id: 86,
    categoryId: 19,
    dictLabel: '忘记打卡',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '忘记打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 87,
    categoryId: 19,
    dictLabel: '设备故障',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '打卡设备故障',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 88,
    categoryId: 19,
    dictLabel: '外出办事',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '外出办事未打卡',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 89,
    categoryId: 19,
    dictLabel: '其他原因',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '其他原因',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 补卡状态
  {
    id: 90,
    categoryId: 20,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 91,
    categoryId: 20,
    dictLabel: '已通过',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 92,
    categoryId: 20,
    dictLabel: '已拒绝',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 异动类型
  {
    id: 93,
    categoryId: 21,
    dictLabel: '部门调动',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '部门调动',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 94,
    categoryId: 21,
    dictLabel: '岗位调动',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '岗位调动',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 95,
    categoryId: 21,
    dictLabel: '晋升',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '职位晋升',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 96,
    categoryId: 21,
    dictLabel: '降职',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '职位降职',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 异动状态
  {
    id: 97,
    categoryId: 22,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 98,
    categoryId: 22,
    dictLabel: '已通过',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 99,
    categoryId: 22,
    dictLabel: '已拒绝',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 100,
    categoryId: 22,
    dictLabel: '已生效',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '异动已生效',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 评估结果
  {
    id: 101,
    categoryId: 23,
    dictLabel: '优秀',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '试用期表现优秀',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 102,
    categoryId: 23,
    dictLabel: '良好',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '试用期表现良好',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 103,
    categoryId: 23,
    dictLabel: '合格',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '试用期表现合格',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 104,
    categoryId: 23,
    dictLabel: '不合格',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '试用期表现不合格',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 转正状态
  {
    id: 105,
    categoryId: 24,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 106,
    categoryId: 24,
    dictLabel: '已通过',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 107,
    categoryId: 24,
    dictLabel: '已拒绝',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 108,
    categoryId: 24,
    dictLabel: '延期转正',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '延期转正',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 离职类型
  {
    id: 109,
    categoryId: 25,
    dictLabel: '主动离职',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '员工主动离职',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 110,
    categoryId: 25,
    dictLabel: '被动离职',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '公司辞退',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 111,
    categoryId: 25,
    dictLabel: '协商离职',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '双方协商离职',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 112,
    categoryId: 25,
    dictLabel: '合同到期',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '合同到期不续签',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 113,
    categoryId: 25,
    dictLabel: '退休',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '退休',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 离职状态
  {
    id: 114,
    categoryId: 26,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 115,
    categoryId: 26,
    dictLabel: '已通过',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 116,
    categoryId: 26,
    dictLabel: '已拒绝',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 117,
    categoryId: 26,
    dictLabel: '办理中',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '离职手续办理中',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 118,
    categoryId: 26,
    dictLabel: '已完成',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '离职手续已完成',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 入职状态
  {
    id: 119,
    categoryId: 27,
    dictLabel: '待入职',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '已发Offer待入职',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 120,
    categoryId: 27,
    dictLabel: '办理中',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '入职手续办理中',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 121,
    categoryId: 27,
    dictLabel: '已完成',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '入职手续已完成',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 122,
    categoryId: 27,
    dictLabel: '已取消',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '入职已取消',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 审批状态
  {
    id: 123,
    categoryId: 28,
    dictLabel: '待审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '待审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 124,
    categoryId: 28,
    dictLabel: '审批中',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '审批中',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 125,
    categoryId: 28,
    dictLabel: '已通过',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '审批通过',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 126,
    categoryId: 28,
    dictLabel: '已拒绝',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '审批拒绝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 127,
    categoryId: 28,
    dictLabel: '已撤销',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '已撤销',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 审批类型
  {
    id: 128,
    categoryId: 29,
    dictLabel: '请假审批',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '请假审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 129,
    categoryId: 29,
    dictLabel: '加班审批',
    dictValue: '2',
    sort: 2,
    status: 1,
    remark: '加班审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 130,
    categoryId: 29,
    dictLabel: '补卡审批',
    dictValue: '3',
    sort: 3,
    status: 1,
    remark: '补卡审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 131,
    categoryId: 29,
    dictLabel: '外勤审批',
    dictValue: '4',
    sort: 4,
    status: 1,
    remark: '外勤审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 132,
    categoryId: 29,
    dictLabel: '转正审批',
    dictValue: '5',
    sort: 5,
    status: 1,
    remark: '转正审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 133,
    categoryId: 29,
    dictLabel: '离职审批',
    dictValue: '6',
    sort: 6,
    status: 1,
    remark: '离职审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 134,
    categoryId: 29,
    dictLabel: '异动审批',
    dictValue: '7',
    sort: 7,
    status: 1,
    remark: '异动审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 135,
    categoryId: 29,
    dictLabel: '合同审批',
    dictValue: '8',
    sort: 8,
    status: 1,
    remark: '合同审批',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 是否
  {
    id: 136,
    categoryId: 30,
    dictLabel: '是',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '是',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 137,
    categoryId: 30,
    dictLabel: '否',
    dictValue: '0',
    sort: 2,
    status: 1,
    remark: '否',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  // 启用状态
  {
    id: 138,
    categoryId: 31,
    dictLabel: '启用',
    dictValue: '1',
    sort: 1,
    status: 1,
    remark: '启用',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 139,
    categoryId: 31,
    dictLabel: '停用',
    dictValue: '0',
    sort: 2,
    status: 1,
    remark: '停用',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  }
]

/**
 * 创建字典分类 Mock
 */
export const dictCategoryMock = createCrudMock<DictCategory>(initialCategories, {
  searchFields: ['categoryName', 'categoryCode']
})

/**
 * 创建字典项 Mock
 */
export const dictItemMock = createCrudMock<DictItem>(initialItems, {
  searchFields: ['dictLabel', 'dictValue']
})

/**
 * 获取分类树 Mock 函数
 */
export function getCategoryTreeMock() {
  return dictCategoryMock.getData()
}

/**
 * 根据分类获取字典项 Mock 函数
 */
export function getItemsByCategoryMock(categoryId: number) {
  const allItems = dictItemMock.getData()
  return allItems.filter((item) => item.categoryId === categoryId)
}
