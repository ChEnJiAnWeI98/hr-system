import type { EmployeeInsurance } from '@/types/socialSecurity'
import { createCrudMock } from '@/utils/crud'
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
import { EMPLOYEES } from '@/mock/core/employeePool'

/**
 * Wave 2 B+C 合并：基于员工池生成全员参保记录
 *
 * 规则：
 * - 每个非 pending_onboard 员工生成 1 条入职参保记录（operationType=1, status=2）
 * - terminated 员工额外生成 1 条离职停保记录（operationType=2, status=2, endDate=离职日）
 * - offboarding 员工生成 1 条待停保（operationType=2, status=1）
 */
function generatePoolInsuranceRecords(startId: number): EmployeeInsurance[] {
  const INSURANCE_CITY_BY_LOCATION: Record<string, string> = {
    北京: '北京',
    上海: '上海',
    深圳: '深圳',
    杭州: '杭州',
    成都: '成都',
    南京: '南京',
    西安: '西安',
    武汉: '武汉'
  }
  const FULL_TYPES = ['养老', '医疗', '失业', '工伤', '生育']
  const records: EmployeeInsurance[] = []
  let nextId = startId

  for (const emp of EMPLOYEES) {
    if (emp.status === 'pending_onboard') continue
    const city = INSURANCE_CITY_BY_LOCATION[emp.workLocation] || '北京'
    const idCard = emp.certificateNo
    const entryDate = emp.entryDate
    // 入职参保记录
    records.push({
      id: nextId++,
      employeeId: emp.id,
      employeeName: emp.nameZh,
      idCard,
      department: emp.orgName,
      operationType: 1,
      city,
      insuranceTypes: [...FULL_TYPES],
      startDate: entryDate,
      status: 2,
      remark: '入职参保',
      createTime: entryDate + ' 10:00:00',
      updateTime: entryDate + ' 10:00:00'
    } as EmployeeInsurance)

    // 离职相关
    if (emp.status === 'terminated') {
      // contractEndDate 即离职日（见 employeePool 合同生成逻辑）
      const endDate = emp.contractEndDate || entryDate
      records.push({
        id: nextId++,
        employeeId: emp.id,
        employeeName: emp.nameZh,
        idCard,
        department: emp.orgName,
        operationType: 2,
        city,
        insuranceTypes: [...FULL_TYPES],
        startDate: entryDate,
        endDate,
        status: 2,
        remark: '员工离职停保',
        createTime: endDate + ' 15:00:00',
        updateTime: endDate + ' 15:00:00'
      } as EmployeeInsurance)
    } else if (emp.status === 'offboarding') {
      records.push({
        id: nextId++,
        employeeId: emp.id,
        employeeName: emp.nameZh,
        idCard,
        department: emp.orgName,
        operationType: 2,
        city,
        insuranceTypes: [...FULL_TYPES],
        startDate: entryDate,
        status: 1,
        remark: '待办理停保',
        createTime: '2026-04-01 09:00:00',
        updateTime: '2026-04-01 09:00:00'
      } as EmployeeInsurance)
    }
  }
  return records
}

// 初始数据
const initialData: EmployeeInsurance[] = [
  {
    id: 1,
    employeeId: 1001,
    employeeName: '张三',
    idCard: '110101199001011234',
    department: '技术部',
    operationType: 1,
    city: '北京',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-01-01',
    status: 2,
    remark: '新员工入职参保',
    createTime: '2025-12-20 10:00:00',
    updateTime: '2026-01-05 14:30:00'
  },
  {
    id: 2,
    employeeId: 1002,
    employeeName: '李四',
    idCard: '310101199102022345',
    department: '销售部',
    operationType: 1,
    city: '上海',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-01-15',
    status: 2,
    remark: '正常参保',
    createTime: '2026-01-05 09:00:00',
    updateTime: '2026-01-20 11:00:00'
  },
  {
    id: 3,
    employeeId: 1003,
    employeeName: '王五',
    idCard: '440101199203033456',
    department: '财务部',
    operationType: 2,
    city: '广州',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2025-06-01',
    endDate: '2026-02-28',
    status: 2,
    remark: '员工离职停保',
    createTime: '2026-02-15 10:00:00',
    updateTime: '2026-03-05 15:00:00'
  },
  {
    id: 4,
    employeeId: 1004,
    employeeName: '赵六',
    idCard: '510101199304044567',
    department: '人力资源部',
    operationType: 1,
    city: '成都',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-02-01',
    status: 1,
    remark: '待办理参保手续',
    createTime: '2026-01-25 14:00:00',
    updateTime: '2026-01-25 14:00:00'
  },
  {
    id: 5,
    employeeId: 1005,
    employeeName: '孙七',
    idCard: '330101199405055678',
    department: '市场部',
    operationType: 1,
    city: '杭州',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-03-01',
    status: 1,
    remark: '新员工待参保',
    createTime: '2026-02-20 09:30:00',
    updateTime: '2026-02-20 09:30:00'
  },
  {
    id: 6,
    employeeId: 1006,
    employeeName: '周八',
    idCard: '420101199506066789',
    department: '技术部',
    operationType: 2,
    city: '武汉',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2024-08-01',
    endDate: '2026-03-31',
    status: 1,
    remark: '员工离职待停保',
    createTime: '2026-03-15 10:00:00',
    updateTime: '2026-03-15 10:00:00'
  },
  {
    id: 7,
    employeeId: 1007,
    employeeName: '吴九',
    idCard: '610101199607077890',
    department: '产品部',
    operationType: 1,
    city: '西安',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-01-10',
    status: 2,
    remark: '正常参保',
    createTime: '2025-12-28 11:00:00',
    updateTime: '2026-01-15 16:00:00'
  },
  {
    id: 8,
    employeeId: 1008,
    employeeName: '郑十',
    idCard: '320101199708088901',
    department: '客服部',
    operationType: 1,
    city: '南京',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-02-15',
    status: 2,
    remark: '正常参保',
    createTime: '2026-02-01 09:00:00',
    updateTime: '2026-02-20 10:30:00'
  },
  {
    id: 9,
    employeeId: 1009,
    employeeName: '冯十一',
    idCard: '500101199809099012',
    department: '行政部',
    operationType: 2,
    city: '重庆',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2025-03-01',
    endDate: '2026-01-31',
    status: 2,
    remark: '员工离职已停保',
    createTime: '2026-01-10 14:00:00',
    updateTime: '2026-02-05 11:00:00'
  },
  {
    id: 10,
    employeeId: 1010,
    employeeName: '陈十二',
    idCard: '350101199910100123',
    department: '技术部',
    operationType: 1,
    city: '福州',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-03-15',
    status: 1,
    remark: '待办理参保',
    createTime: '2026-03-01 10:00:00',
    updateTime: '2026-03-01 10:00:00'
  },
  {
    id: 11,
    employeeId: 1011,
    employeeName: '褚十三',
    idCard: '370101200001011234',
    department: '销售部',
    operationType: 1,
    city: '济南',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-01-20',
    status: 2,
    remark: '正常参保',
    createTime: '2026-01-10 09:00:00',
    updateTime: '2026-01-25 14:00:00'
  },
  {
    id: 12,
    employeeId: 1012,
    employeeName: '卫十四',
    idCard: '410101200102022345',
    department: '财务部',
    operationType: 2,
    city: '郑州',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2024-05-01',
    endDate: '2026-02-28',
    status: 2,
    remark: '员工离职已停保',
    createTime: '2026-02-10 10:00:00',
    updateTime: '2026-03-01 15:00:00'
  },
  {
    id: 13,
    employeeId: 1013,
    employeeName: '蒋十五',
    idCard: '430101200203033456',
    department: '市场部',
    operationType: 1,
    city: '长沙',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-02-01',
    status: 2,
    remark: '正常参保',
    createTime: '2026-01-20 11:00:00',
    updateTime: '2026-02-10 09:00:00'
  },
  {
    id: 14,
    employeeId: 1014,
    employeeName: '沈十六',
    idCard: '220101200304044567',
    department: '人力资源部',
    operationType: 1,
    city: '长春',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-03-01',
    status: 1,
    remark: '待办理参保',
    createTime: '2026-02-15 14:00:00',
    updateTime: '2026-02-15 14:00:00'
  },
  {
    id: 15,
    employeeId: 1015,
    employeeName: '韩十七',
    idCard: '210101200405055678',
    department: '产品部',
    operationType: 2,
    city: '沈阳',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2025-07-01',
    endDate: '2026-03-31',
    status: 1,
    remark: '员工离职待停保',
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00'
  },
  {
    id: 16,
    employeeId: 1016,
    employeeName: '杨十八',
    idCard: '130101200506066789',
    department: '技术部',
    operationType: 1,
    city: '石家庄',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-01-05',
    status: 2,
    remark: '正常参保',
    createTime: '2025-12-25 09:00:00',
    updateTime: '2026-01-10 11:00:00'
  },
  {
    id: 17,
    employeeId: 1017,
    employeeName: '朱十九',
    idCard: '140101200607077890',
    department: '客服部',
    operationType: 1,
    city: '太原',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-02-20',
    status: 2,
    remark: '正常参保',
    createTime: '2026-02-10 10:00:00',
    updateTime: '2026-02-25 15:00:00'
  },
  {
    id: 18,
    employeeId: 1018,
    employeeName: '秦二十',
    idCard: '150101200708088901',
    department: '行政部',
    operationType: 2,
    city: '呼和浩特',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2025-09-01',
    endDate: '2026-03-15',
    status: 1,
    remark: '员工离职待停保',
    createTime: '2026-03-05 11:00:00',
    updateTime: '2026-03-05 11:00:00'
  },
  {
    id: 19,
    employeeId: 1019,
    employeeName: '尤二一',
    idCard: '340101200809099012',
    department: '财务部',
    operationType: 1,
    city: '合肥',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2026-03-10',
    status: 1,
    remark: '待办理参保',
    createTime: '2026-02-28 09:00:00',
    updateTime: '2026-02-28 09:00:00'
  },
  {
    id: 20,
    employeeId: 1020,
    employeeName: '许二二',
    idCard: '360101200910100123',
    department: '市场部',
    operationType: 1,
    city: '南昌',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2026-01-25',
    status: 2,
    remark: '正常参保',
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-02-01 14:00:00'
  },
  // Phase 6 Batch A：补充停保事件，让首页分布更均衡（参保/停保 ~5:5）
  {
    id: 21,
    employeeId: 1021,
    employeeName: '何二三',
    idCard: '110101199505055234',
    department: '技术部',
    operationType: 2,
    city: '北京',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2022-03-01',
    endDate: '2025-12-31',
    status: 2,
    remark: '员工离职已停保',
    createTime: '2025-12-15 10:00:00',
    updateTime: '2026-01-05 14:00:00'
  },
  {
    id: 22,
    employeeId: 1022,
    employeeName: '吕二四',
    idCard: '310101199606066345',
    department: '产品部',
    operationType: 2,
    city: '上海',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2023-07-10',
    endDate: '2026-01-15',
    status: 2,
    remark: '员工离职已停保',
    createTime: '2026-01-05 09:00:00',
    updateTime: '2026-01-20 11:00:00'
  },
  {
    id: 23,
    employeeId: 1023,
    employeeName: '施二五',
    idCard: '440101199707077456',
    department: '销售部',
    operationType: 2,
    city: '深圳',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2021-05-20',
    endDate: '2025-11-30',
    status: 2,
    remark: '员工转出已停保',
    createTime: '2025-11-15 10:00:00',
    updateTime: '2025-12-05 15:00:00'
  },
  {
    id: 24,
    employeeId: 1024,
    employeeName: '张二六',
    idCard: '510101199808088567',
    department: '财务部',
    operationType: 2,
    city: '成都',
    insuranceTypes: ['养老', '医疗', '失业', '工伤', '生育'],
    startDate: '2020-02-15',
    endDate: '2026-02-28',
    status: 2,
    remark: '员工离职已停保',
    createTime: '2026-02-15 10:00:00',
    updateTime: '2026-03-05 15:00:00'
  },
  {
    id: 25,
    employeeId: 1025,
    employeeName: '孔二七',
    idCard: '330101199909099678',
    department: '市场部',
    operationType: 2,
    city: '杭州',
    insuranceTypes: ['养老', '医疗', '失业', '工伤'],
    startDate: '2024-01-05',
    endDate: '2026-03-20',
    status: 1,
    remark: '员工离职待停保',
    createTime: '2026-03-10 11:00:00',
    updateTime: '2026-03-10 11:00:00'
  }
]

// Wave 2 B+C 合并：合并手写样例 + 员工池生成
const alignedInitial = alignEmployeeFields(initialData)
const poolRecords = generatePoolInsuranceRecords(100) // id 从 100 起，避开手写 1-20

/**
 * Phase 6 Batch A：把手写的 5 条新停保事件（id 21~25）提到数组最前面，
 * 确保首页能同时看到"进行中"和"已停保"两种展示形态。
 */
const STOP_SAMPLE_IDS = [21, 22, 23, 24, 25]
const prioritizedStopSamples = alignedInitial.filter((r) =>
  STOP_SAMPLE_IDS.includes(r.id as number)
)
const remainingInitial = alignedInitial.filter(
  (r) => !STOP_SAMPLE_IDS.includes(r.id as number)
)

// 创建 CRUD Mock
export const employeeInsuranceMock = createCrudMock<EmployeeInsurance>(
  [...prioritizedStopSamples, ...remainingInitial, ...poolRecords],
  {
    searchFields: ['employeeName', 'idCard', 'department', 'city']
  }
)
