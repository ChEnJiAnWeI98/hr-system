/**
 * 考勤假期字典（3 种）
 * 假期类型 / 加班类型 / 考勤状态
 */
import type { DictEntry } from '@/types/system/dictionary'

export const ATTENDANCE_DICTS: DictEntry[] = [
  {
    dictCode: 'LEAVE_TYPE',
    dictName: '假期类型',
    dictGroup: 'attendance',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 1,
    items: [
      { value: 'annual', label: '年假', sortOrder: 1, status: 1, extra: { type: 'success', paid: true } },
      { value: 'personal', label: '事假', sortOrder: 2, status: 1, extra: { type: 'info', paid: false } },
      { value: 'sick', label: '病假', sortOrder: 3, status: 1, extra: { type: 'warning', paid: true } },
      { value: 'maternity', label: '产假', sortOrder: 4, status: 1, extra: { type: 'primary', paid: true } },
      { value: 'paternity', label: '陪产假', sortOrder: 5, status: 1, extra: { type: 'primary', paid: true } },
      { value: 'marriage', label: '婚假', sortOrder: 6, status: 1, extra: { type: 'danger', paid: true } },
      { value: 'bereavement', label: '丧假', sortOrder: 7, status: 1, extra: { type: 'info', paid: true } },
      { value: 'compensatory', label: '调休假', sortOrder: 8, status: 1, extra: { type: 'success', paid: true } },
      { value: 'lactation', label: '哺乳假', sortOrder: 9, status: 1, extra: { type: 'primary', paid: true } }
    ]
  },
  {
    dictCode: 'OVERTIME_TYPE',
    dictName: '加班类型',
    dictGroup: 'attendance',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 2,
    items: [
      { value: 'weekday', label: '工作日加班', sortOrder: 1, status: 1, extra: { multiplier: 1.5 } },
      { value: 'weekend', label: '周末加班', sortOrder: 2, status: 1, extra: { multiplier: 2.0 } },
      { value: 'holiday', label: '节假日加班', sortOrder: 3, status: 1, extra: { multiplier: 3.0 } }
    ]
  },
  {
    dictCode: 'ATTENDANCE_STATUS',
    dictName: '考勤状态',
    dictGroup: 'attendance',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 3,
    items: [
      { value: 'normal', label: '正常', sortOrder: 1, status: 1, extra: { type: 'success' } },
      { value: 'late', label: '迟到', sortOrder: 2, status: 1, extra: { type: 'warning' } },
      { value: 'early', label: '早退', sortOrder: 3, status: 1, extra: { type: 'warning' } },
      { value: 'absent', label: '旷工', sortOrder: 4, status: 1, extra: { type: 'danger' } },
      { value: 'miss_punch', label: '缺卡', sortOrder: 5, status: 1, extra: { type: 'warning' } },
      { value: 'leave', label: '请假', sortOrder: 6, status: 1, extra: { type: 'info' } }
    ]
  }
]
