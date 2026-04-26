import type { AttendanceRecord, AttendanceRecordListParams } from '@/types/attendance'
import { createCrudMock } from '@/utils/crud'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import { EMPLOYEES } from '@/mock/core/employeePool'

/**
 * Wave 2 B+C 合并：基于员工池生成近 3 个月打卡记录（2026-02-01 ~ 2026-04-23）
 *
 * 策略：
 * - 仅工作日（周一~周五）生成记录，忽略法定节假日对数据量的影响（简化）
 * - 按员工当日是否在职过滤（terminated 员工 离职日 后不生成）
 * - 按 hash 分布状态：90% 正常 / 5% 迟到 / 3% 早退 / 1% 旷工 / 1% 请假
 */
function buildPoolAttendance(startId: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const WINDOW_START = '2026-02-01'
  const WINDOW_END = '2026-04-23'
  let id = startId

  // 列出窗口内所有工作日
  const workdays: string[] = []
  const start = new Date(WINDOW_START + 'T00:00:00')
  const end = new Date(WINDOW_END + 'T00:00:00')
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay() // 0 周日, 6 周六
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    workdays.push(d.toISOString().slice(0, 10))
  }

  function isActiveOnDate(emp: (typeof EMPLOYEES)[number], date: string): boolean {
    if (!emp.entryDate || date < emp.entryDate) return false
    if (emp.status === 'terminated' && emp.contractEndDate && date > emp.contractEndDate) return false
    return true
  }

  function hashOf(a: number, b: number): number {
    return (a * 9301 + b * 49297 + 11) % 100
  }

  for (const emp of EMPLOYEES) {
    for (const day of workdays) {
      if (!isActiveOnDate(emp, day)) continue
      const dateNum = parseInt(day.replace(/-/g, ''))
      const h = hashOf(emp.id, dateNum)

      let status: number, statusName: string
      let lateMinutes = 0, earlyMinutes = 0, isAbsent = false
      let clockInTime = '08:55:00', clockOutTime = '18:10:00', workHours = 9.25
      if (h < 90) {
        status = 1; statusName = '正常'
      } else if (h < 95) {
        status = 2; statusName = '迟到'
        lateMinutes = 10 + (h % 30)
        clockInTime = `09:${String(Math.floor((h % 30) / 6) * 10 + 10).padStart(2, '0')}:00`
        workHours = 8.5
      } else if (h < 98) {
        status = 3; statusName = '早退'
        earlyMinutes = 15 + (h % 30)
        clockOutTime = `17:${String(60 - (h % 30)).padStart(2, '0')}:00`
        workHours = 8.5
      } else if (h < 99) {
        status = 4; statusName = '旷工'
        isAbsent = true
        clockInTime = ''
        clockOutTime = ''
        workHours = 0
      } else {
        status = 5; statusName = '请假'
        clockInTime = ''
        clockOutTime = ''
        workHours = 0
      }

      records.push({
        id: id++,
        employeeId: emp.id,
        employeeCode: emp.employeeNo,
        employeeName: emp.nameZh,
        departmentName: emp.orgName,
        attendanceDate: day,
        clockInTime,
        clockOutTime,
        clockInLocation: isAbsent || status === 5 ? '' : `${emp.workLocation}办公区`,
        clockOutLocation: isAbsent || status === 5 ? '' : `${emp.workLocation}办公区`,
        clockInPhoto: '',
        clockOutPhoto: '',
        workHours,
        lateMinutes,
        earlyMinutes,
        isAbsent,
        status,
        statusName,
        createTime: day + ' ' + (clockInTime || '08:00:00'),
        updateTime: day + ' ' + (clockOutTime || '18:00:00')
      } as AttendanceRecord)
    }
  }
  return records
}

// 状态映射
const statusMap: Record<number, string> = {
  1: '正常',
  2: '迟到',
  3: '早退',
  4: '旷工',
  5: '请假'
}

// 初始数据
const initialData: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: '张三',
    departmentName: '技术部',
    attendanceDate: '2026-04-01',
    clockInTime: '08:55:23',
    clockOutTime: '18:10:45',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    clockInPhoto: '/uploads/clock/20260401_001_in.jpg',
    clockOutPhoto: '/uploads/clock/20260401_001_out.jpg',
    workHours: 9.25,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-01 08:55:23',
    updateTime: '2026-04-01 18:10:45'
  },
  {
    id: 2,
    employeeId: 2,
    employeeCode: 'EMP002',
    employeeName: '李四',
    departmentName: '技术部',
    attendanceDate: '2026-04-01',
    clockInTime: '09:15:30',
    clockOutTime: '18:05:20',
    clockInLocation: '公司大楼B座',
    clockOutLocation: '公司大楼B座',
    clockInPhoto: '/uploads/clock/20260401_002_in.jpg',
    clockOutPhoto: '/uploads/clock/20260401_002_out.jpg',
    workHours: 8.83,
    lateMinutes: 15,
    earlyMinutes: 0,
    isAbsent: false,
    status: 2,
    statusName: '迟到',
    remark: '地铁延误',
    createTime: '2026-04-01 09:15:30',
    updateTime: '2026-04-01 18:05:20'
  },
  {
    id: 3,
    employeeId: 3,
    employeeCode: 'EMP003',
    employeeName: '王五',
    departmentName: '产品部',
    attendanceDate: '2026-04-01',
    clockInTime: '08:50:10',
    clockOutTime: '17:45:30',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    clockInPhoto: '/uploads/clock/20260401_003_in.jpg',
    clockOutPhoto: '/uploads/clock/20260401_003_out.jpg',
    workHours: 8.92,
    lateMinutes: 0,
    earlyMinutes: 15,
    isAbsent: false,
    status: 3,
    statusName: '早退',
    remark: '家中有事',
    createTime: '2026-04-01 08:50:10',
    updateTime: '2026-04-01 17:45:30'
  },
  {
    id: 4,
    employeeId: 4,
    employeeCode: 'EMP004',
    employeeName: '赵六',
    departmentName: '人事部',
    attendanceDate: '2026-04-01',
    clockInTime: '09:02:15',
    clockOutTime: '18:08:40',
    clockInLocation: '公司大楼C座',
    clockOutLocation: '公司大楼C座',
    workHours: 9.11,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-01 09:02:15',
    updateTime: '2026-04-01 18:08:40'
  },
  {
    id: 5,
    employeeId: 5,
    employeeCode: 'EMP005',
    employeeName: '孙七',
    departmentName: '财务部',
    attendanceDate: '2026-04-01',
    clockInTime: undefined,
    clockOutTime: undefined,
    workHours: 0,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: true,
    status: 4,
    statusName: '旷工',
    remark: '未打卡未请假',
    createTime: '2026-04-01 00:00:00',
    updateTime: '2026-04-01 23:59:59'
  },
  {
    id: 6,
    employeeId: 6,
    employeeCode: 'EMP006',
    employeeName: '周八',
    departmentName: '技术部',
    attendanceDate: '2026-04-01',
    clockInTime: undefined,
    clockOutTime: undefined,
    workHours: 0,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 5,
    statusName: '请假',
    remark: '病假',
    createTime: '2026-04-01 00:00:00',
    updateTime: '2026-04-01 00:00:00'
  },
  {
    id: 7,
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: '张三',
    departmentName: '技术部',
    attendanceDate: '2026-04-02',
    clockInTime: '09:00:05',
    clockOutTime: '18:15:20',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    clockInPhoto: '/uploads/clock/20260402_001_in.jpg',
    clockOutPhoto: '/uploads/clock/20260402_001_out.jpg',
    workHours: 9.25,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-02 09:00:05',
    updateTime: '2026-04-02 18:15:20'
  },
  {
    id: 8,
    employeeId: 2,
    employeeCode: 'EMP002',
    employeeName: '李四',
    departmentName: '技术部',
    attendanceDate: '2026-04-02',
    clockInTime: '09:25:40',
    clockOutTime: '18:02:10',
    clockInLocation: '公司大楼B座',
    clockOutLocation: '公司大楼B座',
    clockInPhoto: '/uploads/clock/20260402_002_in.jpg',
    clockOutPhoto: '/uploads/clock/20260402_002_out.jpg',
    workHours: 8.61,
    lateMinutes: 25,
    earlyMinutes: 0,
    isAbsent: false,
    status: 2,
    statusName: '迟到',
    remark: '交通拥堵',
    createTime: '2026-04-02 09:25:40',
    updateTime: '2026-04-02 18:02:10'
  },
  {
    id: 9,
    employeeId: 7,
    employeeCode: 'EMP007',
    employeeName: '吴九',
    departmentName: '技术部',
    attendanceDate: '2026-04-02',
    clockInTime: '08:58:30',
    clockOutTime: '18:20:15',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    workHours: 9.36,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-02 08:58:30',
    updateTime: '2026-04-02 18:20:15'
  },
  {
    id: 10,
    employeeId: 8,
    employeeCode: 'EMP008',
    employeeName: '郑十',
    departmentName: '产品部',
    attendanceDate: '2026-04-02',
    clockInTime: '09:05:20',
    clockOutTime: '17:50:40',
    clockInLocation: '公司大楼B座',
    clockOutLocation: '公司大楼B座',
    workHours: 8.76,
    lateMinutes: 0,
    earlyMinutes: 10,
    isAbsent: false,
    status: 3,
    statusName: '早退',
    createTime: '2026-04-02 09:05:20',
    updateTime: '2026-04-02 17:50:40'
  },
  {
    id: 11,
    employeeId: 3,
    employeeCode: 'EMP003',
    employeeName: '王五',
    departmentName: '产品部',
    attendanceDate: '2026-04-03',
    clockInTime: '08:55:10',
    clockOutTime: '18:05:30',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    workHours: 9.17,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-03 08:55:10',
    updateTime: '2026-04-03 18:05:30'
  },
  {
    id: 12,
    employeeId: 4,
    employeeCode: 'EMP004',
    employeeName: '赵六',
    departmentName: '人事部',
    attendanceDate: '2026-04-03',
    clockInTime: '09:30:25',
    clockOutTime: '18:10:15',
    clockInLocation: '客户公司',
    clockOutLocation: '客户公司',
    workHours: 8.66,
    lateMinutes: 30,
    earlyMinutes: 0,
    isAbsent: false,
    status: 2,
    statusName: '迟到',
    remark: '外出拜访客户',
    createTime: '2026-04-03 09:30:25',
    updateTime: '2026-04-03 18:10:15'
  },
  {
    id: 13,
    employeeId: 9,
    employeeCode: 'EMP009',
    employeeName: '王十一',
    departmentName: '人事部',
    attendanceDate: '2026-04-03',
    clockInTime: '09:01:40',
    clockOutTime: '18:12:20',
    clockInLocation: '公司大楼C座',
    clockOutLocation: '公司大楼C座',
    workHours: 9.18,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-03 09:01:40',
    updateTime: '2026-04-03 18:12:20'
  },
  {
    id: 14,
    employeeId: 10,
    employeeCode: 'EMP010',
    employeeName: '李十二',
    departmentName: '财务部',
    attendanceDate: '2026-04-03',
    clockInTime: '08:52:15',
    clockOutTime: '18:25:40',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    workHours: 9.56,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-03 08:52:15',
    updateTime: '2026-04-03 18:25:40'
  },
  {
    id: 15,
    employeeId: 5,
    employeeCode: 'EMP005',
    employeeName: '孙七',
    departmentName: '财务部',
    attendanceDate: '2026-04-03',
    clockInTime: undefined,
    clockOutTime: undefined,
    workHours: 0,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 5,
    statusName: '请假',
    remark: '事假',
    createTime: '2026-04-03 00:00:00',
    updateTime: '2026-04-03 00:00:00'
  },
  {
    id: 16,
    employeeId: 11,
    employeeCode: 'EMP011',
    employeeName: '张伟',
    departmentName: '技术部',
    attendanceDate: '2026-04-04',
    clockInTime: '08:58:15',
    clockOutTime: '18:12:30',
    clockInLocation: '公司大楼A座',
    clockOutLocation: '公司大楼A座',
    workHours: 9.24,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-04 08:58:15',
    updateTime: '2026-04-04 18:12:30'
  },
  {
    id: 17,
    employeeId: 12,
    employeeCode: 'EMP012',
    employeeName: '李娜',
    departmentName: '产品部',
    attendanceDate: '2026-04-04',
    clockInTime: '09:10:20',
    clockOutTime: '18:05:15',
    clockInLocation: '公司大楼B座',
    clockOutLocation: '公司大楼B座',
    workHours: 8.92,
    lateMinutes: 10,
    earlyMinutes: 0,
    isAbsent: false,
    status: 2,
    statusName: '迟到',
    createTime: '2026-04-04 09:10:20',
    updateTime: '2026-04-04 18:05:15'
  },
  {
    id: 18,
    employeeId: 13,
    employeeCode: 'EMP013',
    employeeName: '王强',
    departmentName: '人事部',
    attendanceDate: '2026-04-04',
    clockInTime: '08:55:40',
    clockOutTime: '18:08:25',
    clockInLocation: '公司大楼C座',
    clockOutLocation: '公司大楼C座',
    workHours: 9.21,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-04 08:55:40',
    updateTime: '2026-04-04 18:08:25'
  },
  {
    id: 19,
    employeeId: 14,
    employeeCode: 'EMP014',
    employeeName: '刘洋',
    departmentName: '财务部',
    attendanceDate: '2026-04-04',
    clockInTime: '09:05:10',
    clockOutTime: '18:15:30',
    clockInLocation: '公司大楼D座',
    clockOutLocation: '公司大楼D座',
    workHours: 9.17,
    lateMinutes: 0,
    earlyMinutes: 0,
    isAbsent: false,
    status: 1,
    statusName: '正常',
    createTime: '2026-04-04 09:05:10',
    updateTime: '2026-04-04 18:15:30'
  },
  {
    id: 20,
    employeeId: 15,
    employeeCode: 'EMP015',
    employeeName: '陈静',
    departmentName: '市场部',
    attendanceDate: '2026-04-04',
    clockInTime: '09:20:35',
    clockOutTime: '18:02:45',
    clockInLocation: '公司大楼E座',
    clockOutLocation: '公司大楼E座',
    workHours: 8.70,
    lateMinutes: 20,
    earlyMinutes: 0,
    isAbsent: false,
    status: 2,
    statusName: '迟到',
    createTime: '2026-04-04 09:20:35',
    updateTime: '2026-04-04 18:02:45'
  }
]

// Wave 2 B+C 合并：合并手写 + 员工池动态生成（近 3 个月工作日全员）
const alignedInitial = alignEmployeeFields(initialData)
const poolRecords = buildPoolAttendance(1000) // id 从 1000 起，避开手写的 1-21

// 创建 CRUD Mock
const attendanceRecordMock = createCrudMock<AttendanceRecord>(
  [...alignedInitial, ...poolRecords],
  {
    searchFields: ['employeeCode', 'employeeName']
  }
)

/**
 * 获取考勤记录列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: AttendanceRecordListParams) {
  const { departmentId, attendanceDateStart, attendanceDateEnd, status, ...otherParams } = params
  let result = attendanceRecordMock.getList(otherParams)

  // 部门筛选
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    // 实际应该根据部门ID匹配，这里暂时跳过
  }

  // 考勤日期范围筛选
  if (attendanceDateStart) {
    result.list = result.list.filter(item => item.attendanceDate >= attendanceDateStart)
  }
  if (attendanceDateEnd) {
    result.list = result.list.filter(item => item.attendanceDate <= attendanceDateEnd)
  }

  // 状态筛选
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    result.list = result.list.filter(item => item.status === statusValue)
  }

  result.total = result.list.length
  return result
}

/**
 * 添加考勤记录 Mock 函数（带自定义处理）
 */
export function addAttendanceRecordMock(data: Partial<AttendanceRecord>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    statusName: statusMap[data.status || 1] || '正常',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as AttendanceRecord
  return attendanceRecordMock.add(newData)
}

/**
 * 更新考勤记录 Mock 函数（带自定义处理）
 */
export function updateAttendanceRecordMock(data: Partial<AttendanceRecord>) {
  const updateData = {
    ...data,
    statusName: data.status ? statusMap[data.status] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return attendanceRecordMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = attendanceRecordMock.getDetail
export const deleteAttendanceRecordMock = attendanceRecordMock.delete
export const batchDeleteAttendanceRecordsMock = attendanceRecordMock.batchDelete
