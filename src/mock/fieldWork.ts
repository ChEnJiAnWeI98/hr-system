import type { FieldWorkRecord, FieldWorkRecordListParams } from '@/types/attendance'
import { createCrudMock } from '@/utils/crud'

// 状态映射
const statusMap: Record<number, string> = {
  1: '进行中',
  2: '已结束'
}

// 初始数据
const initialData: FieldWorkRecord[] = [
  {
    id: 1,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-01',
    startTime: '09:30',
    endTime: '17:00',
    location: '客户A公司-北京市朝阳区建国路88号',
    gpsCoordinates: '116.4551,39.9042',
    reason: '拜访客户洽谈合作',
    photos: '/uploads/fieldwork/20260401_004_1.jpg,/uploads/fieldwork/20260401_004_2.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-01 09:30:00',
    updateTime: '2026-04-01 17:00:00'
  },
  {
    id: 2,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-01',
    startTime: '10:00',
    endTime: '16:30',
    location: '客户B公司-北京市海淀区中关村大街1号',
    gpsCoordinates: '116.3142,39.9826',
    reason: '产品演示和技术交流',
    photos: '/uploads/fieldwork/20260401_009_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-01 10:00:00',
    updateTime: '2026-04-01 16:30:00'
  },
  {
    id: 3,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-02',
    startTime: '14:00',
    endTime: '18:00',
    location: '客户C公司-北京市东城区王府井大街138号',
    gpsCoordinates: '116.4074,39.9142',
    reason: '商务谈判',
    photos: '/uploads/fieldwork/20260402_004_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-02 14:00:00',
    updateTime: '2026-04-02 18:00:00'
  },
  {
    id: 4,
    employeeId: 13,
    employeeCode: 'E013',
    employeeName: '林十五',
    departmentName: '技术部',
    fieldWorkDate: '2026-04-02',
    startTime: '09:00',
    endTime: '12:00',
    location: '客户D公司-北京市西城区金融街35号',
    gpsCoordinates: '116.3662,39.9139',
    reason: '现场技术支持',
    photos: '/uploads/fieldwork/20260402_013_1.jpg,/uploads/fieldwork/20260402_013_2.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-02 09:00:00',
    updateTime: '2026-04-02 12:00:00'
  },
  {
    id: 5,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-03',
    startTime: '10:30',
    endTime: '15:00',
    location: '展会中心-北京市顺义区天竺镇裕翔路88号',
    gpsCoordinates: '116.5833,40.0833',
    reason: '参加行业展会',
    photos: '/uploads/fieldwork/20260403_009_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-03 10:30:00',
    updateTime: '2026-04-03 15:00:00'
  },
  {
    id: 6,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-03',
    startTime: '13:00',
    endTime: '17:30',
    location: '客户E公司-北京市丰台区南四环西路188号',
    gpsCoordinates: '116.2865,39.8562',
    reason: '项目验收',
    photos: '/uploads/fieldwork/20260403_004_1.jpg,/uploads/fieldwork/20260403_004_2.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-03 13:00:00',
    updateTime: '2026-04-03 17:30:00'
  },
  {
    id: 7,
    employeeId: 16,
    employeeCode: 'E016',
    employeeName: '罗十八',
    departmentName: '技术部',
    fieldWorkDate: '2026-04-04',
    startTime: '09:30',
    endTime: '16:00',
    location: '客户F公司-北京市石景山区石景山路68号',
    gpsCoordinates: '116.2228,39.9065',
    reason: '系统部署和培训',
    photos: '/uploads/fieldwork/20260404_016_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-04 09:30:00',
    updateTime: '2026-04-04 16:00:00'
  },
  {
    id: 8,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-04',
    startTime: '14:00',
    endTime: undefined,
    location: '客户G公司-北京市通州区运河东大街1号',
    gpsCoordinates: '116.6562,39.9042',
    reason: '商务洽谈',
    photos: '/uploads/fieldwork/20260404_009_1.jpg',
    status: 1,
    statusName: '进行中',
    createTime: '2026-04-04 14:00:00',
    updateTime: '2026-04-04 14:00:00'
  },
  {
    id: 9,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-05',
    startTime: '10:00',
    endTime: '14:30',
    location: '客户H公司-北京市大兴区亦庄经济开发区科创街10号',
    gpsCoordinates: '116.5065,39.7942',
    reason: '产品推介会',
    photos: '/uploads/fieldwork/20260405_004_1.jpg,/uploads/fieldwork/20260405_004_2.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-05 10:00:00',
    updateTime: '2026-04-05 14:30:00'
  },
  {
    id: 10,
    employeeId: 13,
    employeeCode: 'E013',
    employeeName: '林十五',
    departmentName: '技术部',
    fieldWorkDate: '2026-04-05',
    startTime: '09:00',
    endTime: '13:00',
    location: '客户I公司-北京市昌平区回龙观西大街118号',
    gpsCoordinates: '116.3265,40.0742',
    reason: '技术问题排查',
    photos: '/uploads/fieldwork/20260405_013_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-05 13:00:00'
  },
  {
    id: 11,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    fieldWorkDate: '2026-04-06',
    startTime: '10:30',
    endTime: undefined,
    location: '客户J公司-北京市房山区长阳镇长政街88号',
    gpsCoordinates: '116.1365,39.7342',
    reason: '客户回访',
    photos: '/uploads/fieldwork/20260406_009_1.jpg',
    status: 1,
    statusName: '进行中',
    createTime: '2026-04-06 10:30:00',
    updateTime: '2026-04-06 10:30:00'
  },
  {
    id: 12,
    employeeId: 16,
    employeeCode: 'E016',
    employeeName: '罗十八',
    departmentName: '技术部',
    fieldWorkDate: '2026-03-31',
    startTime: '14:00',
    endTime: '18:00',
    location: '客户K公司-北京市门头沟区新桥大街36号',
    gpsCoordinates: '116.1028,39.9365',
    reason: '系统升级',
    photos: '/uploads/fieldwork/20260331_016_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-03-31 14:00:00',
    updateTime: '2026-03-31 18:00:00'
  },
  {
    id: 13,
    employeeId: 4,
    employeeCode: 'E004',
    employeeName: '赵六',
    departmentName: '市场部',
    fieldWorkDate: '2026-03-30',
    startTime: '09:00',
    endTime: '12:30',
    location: '客户L公司-北京市平谷区府前西街17号',
    gpsCoordinates: '117.1228,40.1442',
    reason: '市场调研',
    photos: '/uploads/fieldwork/20260330_004_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-03-30 09:00:00',
    updateTime: '2026-03-30 12:30:00'
  },
  {
    id: 14,
    employeeId: 9,
    employeeCode: 'E009',
    employeeName: '钱十一',
    departmentName: '市场部',
    fieldWorkDate: '2026-03-29',
    startTime: '13:30',
    endTime: '17:00',
    location: '客户M公司-北京市怀柔区府前街15号',
    gpsCoordinates: '116.6317,40.3156',
    reason: '合同签订',
    photos: '/uploads/fieldwork/20260329_009_1.jpg,/uploads/fieldwork/20260329_009_2.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-03-29 13:30:00',
    updateTime: '2026-03-29 17:00:00'
  },
  {
    id: 15,
    employeeId: 13,
    employeeCode: 'E013',
    employeeName: '林十五',
    departmentName: '技术部',
    fieldWorkDate: '2026-03-28',
    startTime: '10:00',
    endTime: '15:30',
    location: '客户N公司-北京市密云区新南路92号',
    gpsCoordinates: '116.8428,40.3769',
    reason: '现场技术支持',
    photos: '/uploads/fieldwork/20260328_013_1.jpg',
    status: 2,
    statusName: '已结束',
    createTime: '2026-03-28 10:00:00',
    updateTime: '2026-03-28 15:30:00'
  }
]

// 创建 CRUD Mock
const fieldWorkRecordMock = createCrudMock<FieldWorkRecord>(initialData, {
  searchFields: ['employeeCode', 'employeeName', 'location']
})

/**
 * 获取外勤记录列表 Mock 函数（带自定义筛选）
 */
export function getListMock(params: FieldWorkRecordListParams) {
  const { departmentId, fieldWorkDateStart, fieldWorkDateEnd, status, ...otherParams } = params
  let result = fieldWorkRecordMock.getList(otherParams)

  // 部门筛选
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    // 简化处理，实际应该根据部门ID匹配
  }

  // 外勤日期范围筛选
  if (fieldWorkDateStart) {
    result.list = result.list.filter(item => item.fieldWorkDate >= fieldWorkDateStart)
  }
  if (fieldWorkDateEnd) {
    result.list = result.list.filter(item => item.fieldWorkDate <= fieldWorkDateEnd)
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
 * 添加外勤记录 Mock 函数（带自定义处理）
 */
export function addFieldWorkRecordMock(data: Partial<FieldWorkRecord>) {
  const newId = Math.max(...initialData.map(item => item.id), 0) + 1
  const newData = {
    ...data,
    id: newId,
    statusName: statusMap[data.status || 1] || '进行中',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  } as FieldWorkRecord
  return fieldWorkRecordMock.add(newData)
}

/**
 * 更新外勤记录 Mock 函数（带自定义处理）
 */
export function updateFieldWorkRecordMock(data: Partial<FieldWorkRecord>) {
  const updateData = {
    ...data,
    statusName: data.status !== undefined ? statusMap[data.status] : undefined,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  return fieldWorkRecordMock.update(updateData)
}

// 导出 CRUD Mock 函数
export const getDetailMock = fieldWorkRecordMock.getDetail
export const deleteFieldWorkRecordMock = fieldWorkRecordMock.delete
export const batchDeleteFieldWorkRecordsMock = fieldWorkRecordMock.batchDelete

/**
 * 结束外勤 Mock 函数
 */
export function endFieldWorkMock(id: number, data: { endTime: string }) {
  const record = initialData.find(item => item.id === id)
  if (!record) {
    throw new Error('外勤记录不存在')
  }

  if (record.status === 2) {
    throw new Error('该外勤已结束')
  }

  record.endTime = data.endTime
  record.status = 2
  record.statusName = '已结束'
  record.updateTime = new Date().toLocaleString('zh-CN')

  return record
}
