/**
 * 个税申报 Mock 数据
 */

import type {
  TaxDeclaration,
  TaxDeclarationDetail,
  TaxDeclarationListParams,
  GenerateTaxDeclarationParams
} from '@/types/taxDeclaration'

// 数据存储（根据 salary.ts 中的薪资数据生成，28个员工 × 2个月 = 56条记录）
let taxDeclarations: TaxDeclarationDetail[] = [
  {
    id: 1,
    employeeName: '张三',
    employeeNo: 'EMP001',
    declarationMonth: '2026-02',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 15250.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 6750.00,
    accumulatedTaxPaid: 640.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 2,
    employeeName: '李四',
    employeeNo: 'EMP002',
    declarationMonth: '2026-02',
    currentIncome: 19060.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 10560.00,
    currentTaxPayable: 960.00,
    currentTaxPaid: 960.00,
    accumulatedIncome: 19060.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 10560.00,
    accumulatedTaxPaid: 960.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 3,
    employeeName: '王五',
    employeeNo: 'EMP003',
    declarationMonth: '2026-02',
    currentIncome: 20530.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 12030.00,
    currentTaxPayable: 1080.00,
    currentTaxPaid: 1080.00,
    accumulatedIncome: 20530.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 12030.00,
    accumulatedTaxPaid: 1080.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 4,
    employeeName: '赵六',
    employeeNo: 'EMP004',
    declarationMonth: '2026-02',
    currentIncome: 18320.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9820.00,
    currentTaxPayable: 900.00,
    currentTaxPaid: 900.00,
    accumulatedIncome: 18320.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 9820.00,
    accumulatedTaxPaid: 900.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 5,
    employeeName: '钱七',
    employeeNo: 'EMP005',
    declarationMonth: '2026-02',
    currentIncome: 16855.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 8355.00,
    currentTaxPayable: 780.00,
    currentTaxPaid: 780.00,
    accumulatedIncome: 16855.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 8355.00,
    accumulatedTaxPaid: 780.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 6,
    employeeName: '孙八',
    employeeNo: 'EMP006',
    declarationMonth: '2026-02',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 17600.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 9100.00,
    accumulatedTaxPaid: 820.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 7,
    employeeName: '周九',
    employeeNo: 'EMP007',
    declarationMonth: '2026-02',
    currentIncome: 19795.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 11295.00,
    currentTaxPayable: 1020.00,
    currentTaxPaid: 1020.00,
    accumulatedIncome: 19795.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 11295.00,
    accumulatedTaxPaid: 1020.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 8,
    employeeName: '吴十',
    employeeNo: 'EMP008',
    declarationMonth: '2026-02',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 16120.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 7620.00,
    accumulatedTaxPaid: 720.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 9,
    employeeName: '郑十一',
    employeeNo: 'EMP009',
    declarationMonth: '2026-02',
    currentIncome: 16855.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 8355.00,
    currentTaxPayable: 780.00,
    currentTaxPaid: 780.00,
    accumulatedIncome: 16855.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 8355.00,
    accumulatedTaxPaid: 780.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 10,
    employeeName: '王芳',
    employeeNo: 'EMP010',
    declarationMonth: '2026-02',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 14380.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 5880.00,
    accumulatedTaxPaid: 580.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 11,
    employeeName: '刘强',
    employeeNo: 'EMP011',
    declarationMonth: '2026-02',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 15250.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 6750.00,
    accumulatedTaxPaid: 640.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 12,
    employeeName: '陈敏',
    employeeNo: 'EMP012',
    declarationMonth: '2026-02',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 17600.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 9100.00,
    accumulatedTaxPaid: 820.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 13,
    employeeName: '杨涛',
    employeeNo: 'EMP013',
    declarationMonth: '2026-02',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 16120.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 7620.00,
    accumulatedTaxPaid: 720.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 14,
    employeeName: '黄静',
    employeeNo: 'EMP014',
    declarationMonth: '2026-02',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 15250.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 6750.00,
    accumulatedTaxPaid: 640.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 15,
    employeeName: '孙杰',
    employeeNo: 'EMP015',
    declarationMonth: '2026-02',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 15250.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 6750.00,
    accumulatedTaxPaid: 640.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 16,
    employeeName: '周敏',
    employeeNo: 'EMP016',
    declarationMonth: '2026-02',
    currentIncome: 13500.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5000.00,
    currentTaxPayable: 520.00,
    currentTaxPaid: 520.00,
    accumulatedIncome: 13500.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 5000.00,
    accumulatedTaxPaid: 520.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 17,
    employeeName: '吴强',
    employeeNo: 'EMP017',
    declarationMonth: '2026-02',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 14380.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 5880.00,
    accumulatedTaxPaid: 580.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 18,
    employeeName: '郑芳',
    employeeNo: 'EMP018',
    declarationMonth: '2026-02',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 17600.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 9100.00,
    accumulatedTaxPaid: 820.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 19,
    employeeName: '冯涛',
    employeeNo: 'EMP019',
    declarationMonth: '2026-02',
    currentIncome: 11170.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 2670.00,
    currentTaxPayable: 380.00,
    currentTaxPaid: 380.00,
    accumulatedIncome: 11170.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 2670.00,
    accumulatedTaxPaid: 380.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 20,
    employeeName: '陈静',
    employeeNo: 'EMP020',
    declarationMonth: '2026-02',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 15250.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 6750.00,
    accumulatedTaxPaid: 640.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 21,
    employeeName: '褚伟',
    employeeNo: 'EMP021',
    declarationMonth: '2026-02',
    currentIncome: 9600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 1100.00,
    currentTaxPayable: 280.00,
    currentTaxPaid: 280.00,
    accumulatedIncome: 9600.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 1100.00,
    accumulatedTaxPaid: 280.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 22,
    employeeName: '卫芳',
    employeeNo: 'EMP022',
    declarationMonth: '2026-02',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 16120.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 7620.00,
    accumulatedTaxPaid: 720.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 23,
    employeeName: '蒋敏',
    employeeNo: 'EMP023',
    declarationMonth: '2026-02',
    currentIncome: 12050.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 3550.00,
    currentTaxPayable: 440.00,
    currentTaxPaid: 440.00,
    accumulatedIncome: 12050.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 3550.00,
    accumulatedTaxPaid: 440.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 24,
    employeeName: '沈杰',
    employeeNo: 'EMP024',
    declarationMonth: '2026-02',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 14380.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 5880.00,
    accumulatedTaxPaid: 580.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 25,
    employeeName: '韩涛',
    employeeNo: 'EMP025',
    declarationMonth: '2026-02',
    currentIncome: 12910.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 4410.00,
    currentTaxPayable: 480.00,
    currentTaxPaid: 480.00,
    accumulatedIncome: 12910.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 4410.00,
    accumulatedTaxPaid: 480.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 26,
    employeeName: '杨静',
    employeeNo: 'EMP026',
    declarationMonth: '2026-02',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 17600.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 9100.00,
    accumulatedTaxPaid: 820.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 27,
    employeeName: '朱伟',
    employeeNo: 'EMP027',
    declarationMonth: '2026-02',
    currentIncome: 10340.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 1840.00,
    currentTaxPayable: 340.00,
    currentTaxPaid: 340.00,
    accumulatedIncome: 10340.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 1840.00,
    accumulatedTaxPaid: 340.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 28,
    employeeName: '秦芳',
    employeeNo: 'EMP028',
    declarationMonth: '2026-02',
    currentIncome: 8740.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 240.00,
    currentTaxPayable: 240.00,
    currentTaxPaid: 240.00,
    accumulatedIncome: 8740.00,
    accumulatedSpecialDeduction: 2000.00,
    accumulatedAdditionalDeduction: 1500.00,
    accumulatedTaxableIncome: 240.00,
    accumulatedTaxPaid: 240.00,
    createTime: '2026-03-01 10:00:00'
  },
  {
    id: 29,
    employeeName: '张三',
    employeeNo: 'EMP001',
    declarationMonth: '2026-03',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 31370.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 14370.00,
    accumulatedTaxPaid: 1360.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 30,
    employeeName: '李四',
    employeeNo: 'EMP002',
    declarationMonth: '2026-03',
    currentIncome: 19060.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 10560.00,
    currentTaxPayable: 960.00,
    currentTaxPaid: 960.00,
    accumulatedIncome: 38120.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 21120.00,
    accumulatedTaxPaid: 1920.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 31,
    employeeName: '王五',
    employeeNo: 'EMP003',
    declarationMonth: '2026-03',
    currentIncome: 20530.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 12030.00,
    currentTaxPayable: 1080.00,
    currentTaxPaid: 1080.00,
    accumulatedIncome: 41060.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 24060.00,
    accumulatedTaxPaid: 2160.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 32,
    employeeName: '赵六',
    employeeNo: 'EMP004',
    declarationMonth: '2026-03',
    currentIncome: 18320.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9820.00,
    currentTaxPayable: 900.00,
    currentTaxPaid: 900.00,
    accumulatedIncome: 36640.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 19640.00,
    accumulatedTaxPaid: 1800.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 33,
    employeeName: '钱七',
    employeeNo: 'EMP005',
    declarationMonth: '2026-03',
    currentIncome: 16855.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 8355.00,
    currentTaxPayable: 780.00,
    currentTaxPaid: 780.00,
    accumulatedIncome: 33710.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 16710.00,
    accumulatedTaxPaid: 1560.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 34,
    employeeName: '孙八',
    employeeNo: 'EMP006',
    declarationMonth: '2026-03',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 35200.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 18200.00,
    accumulatedTaxPaid: 1640.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 35,
    employeeName: '周九',
    employeeNo: 'EMP007',
    declarationMonth: '2026-03',
    currentIncome: 19795.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 11295.00,
    currentTaxPayable: 1020.00,
    currentTaxPaid: 1020.00,
    accumulatedIncome: 39590.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 22590.00,
    accumulatedTaxPaid: 2040.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 36,
    employeeName: '吴十',
    employeeNo: 'EMP008',
    declarationMonth: '2026-03',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 32240.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 15240.00,
    accumulatedTaxPaid: 1440.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 37,
    employeeName: '郑十一',
    employeeNo: 'EMP009',
    declarationMonth: '2026-03',
    currentIncome: 16855.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 8355.00,
    currentTaxPayable: 780.00,
    currentTaxPaid: 780.00,
    accumulatedIncome: 33710.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 16710.00,
    accumulatedTaxPaid: 1560.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 38,
    employeeName: '王芳',
    employeeNo: 'EMP010',
    declarationMonth: '2026-03',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 28760.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 11760.00,
    accumulatedTaxPaid: 1160.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 39,
    employeeName: '刘强',
    employeeNo: 'EMP011',
    declarationMonth: '2026-03',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 30500.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 13500.00,
    accumulatedTaxPaid: 1280.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 40,
    employeeName: '陈敏',
    employeeNo: 'EMP012',
    declarationMonth: '2026-03',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 35200.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 18200.00,
    accumulatedTaxPaid: 1640.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 41,
    employeeName: '杨涛',
    employeeNo: 'EMP013',
    declarationMonth: '2026-03',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 32240.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 15240.00,
    accumulatedTaxPaid: 1440.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 42,
    employeeName: '黄静',
    employeeNo: 'EMP014',
    declarationMonth: '2026-03',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 30500.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 13500.00,
    accumulatedTaxPaid: 1280.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 43,
    employeeName: '孙杰',
    employeeNo: 'EMP015',
    declarationMonth: '2026-03',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 30500.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 13500.00,
    accumulatedTaxPaid: 1280.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 44,
    employeeName: '周敏',
    employeeNo: 'EMP016',
    declarationMonth: '2026-03',
    currentIncome: 13500.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5000.00,
    currentTaxPayable: 520.00,
    currentTaxPaid: 520.00,
    accumulatedIncome: 27000.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 10000.00,
    accumulatedTaxPaid: 1040.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 45,
    employeeName: '吴强',
    employeeNo: 'EMP017',
    declarationMonth: '2026-03',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 28760.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 11760.00,
    accumulatedTaxPaid: 1160.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 46,
    employeeName: '郑芳',
    employeeNo: 'EMP018',
    declarationMonth: '2026-03',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 35200.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 18200.00,
    accumulatedTaxPaid: 1640.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 47,
    employeeName: '冯涛',
    employeeNo: 'EMP019',
    declarationMonth: '2026-03',
    currentIncome: 11170.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 2670.00,
    currentTaxPayable: 380.00,
    currentTaxPaid: 380.00,
    accumulatedIncome: 22340.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 5340.00,
    accumulatedTaxPaid: 760.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 48,
    employeeName: '陈静',
    employeeNo: 'EMP020',
    declarationMonth: '2026-03',
    currentIncome: 15250.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 6750.00,
    currentTaxPayable: 640.00,
    currentTaxPaid: 640.00,
    accumulatedIncome: 30500.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 13500.00,
    accumulatedTaxPaid: 1280.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 49,
    employeeName: '褚伟',
    employeeNo: 'EMP021',
    declarationMonth: '2026-03',
    currentIncome: 9600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 1100.00,
    currentTaxPayable: 280.00,
    currentTaxPaid: 280.00,
    accumulatedIncome: 19200.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 2200.00,
    accumulatedTaxPaid: 560.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 50,
    employeeName: '卫芳',
    employeeNo: 'EMP022',
    declarationMonth: '2026-03',
    currentIncome: 16120.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 7620.00,
    currentTaxPayable: 720.00,
    currentTaxPaid: 720.00,
    accumulatedIncome: 32240.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 15240.00,
    accumulatedTaxPaid: 1440.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 51,
    employeeName: '蒋敏',
    employeeNo: 'EMP023',
    declarationMonth: '2026-03',
    currentIncome: 12050.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 3550.00,
    currentTaxPayable: 440.00,
    currentTaxPaid: 440.00,
    accumulatedIncome: 24100.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 7100.00,
    accumulatedTaxPaid: 880.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 52,
    employeeName: '沈杰',
    employeeNo: 'EMP024',
    declarationMonth: '2026-03',
    currentIncome: 14380.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 5880.00,
    currentTaxPayable: 580.00,
    currentTaxPaid: 580.00,
    accumulatedIncome: 28760.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 11760.00,
    accumulatedTaxPaid: 1160.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 53,
    employeeName: '韩涛',
    employeeNo: 'EMP025',
    declarationMonth: '2026-03',
    currentIncome: 12910.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 4410.00,
    currentTaxPayable: 480.00,
    currentTaxPaid: 480.00,
    accumulatedIncome: 25820.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 8820.00,
    accumulatedTaxPaid: 960.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 54,
    employeeName: '杨静',
    employeeNo: 'EMP026',
    declarationMonth: '2026-03',
    currentIncome: 17600.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 9100.00,
    currentTaxPayable: 820.00,
    currentTaxPaid: 820.00,
    accumulatedIncome: 35200.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 18200.00,
    accumulatedTaxPaid: 1640.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 55,
    employeeName: '朱伟',
    employeeNo: 'EMP027',
    declarationMonth: '2026-03',
    currentIncome: 10340.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 1840.00,
    currentTaxPayable: 340.00,
    currentTaxPaid: 340.00,
    accumulatedIncome: 20680.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 3680.00,
    accumulatedTaxPaid: 680.00,
    createTime: '2026-04-01 10:00:00'
  },
  {
    id: 56,
    employeeName: '秦芳',
    employeeNo: 'EMP028',
    declarationMonth: '2026-03',
    currentIncome: 8740.00,
    currentSpecialDeduction: 2000.00,
    currentAdditionalDeduction: 1500.00,
    currentTaxableIncome: 240.00,
    currentTaxPayable: 240.00,
    currentTaxPaid: 240.00,
    accumulatedIncome: 17480.00,
    accumulatedSpecialDeduction: 4000.00,
    accumulatedAdditionalDeduction: 3000.00,
    accumulatedTaxableIncome: 480.00,
    accumulatedTaxPaid: 480.00,
    createTime: '2026-04-01 10:00:00'
  }
]

let nextId = 57

/**
 * 获取个税申报列表 Mock 函数
 */
export function getTaxDeclarationListMock(params: TaxDeclarationListParams) {
  const { employeeName, declarationMonth, page = 1, pageSize = 20 } = params
  let filteredData = [...taxDeclarations]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (declarationMonth) {
    filteredData = filteredData.filter(item => item.declarationMonth === declarationMonth)
  }

  // 排序（按申报月份倒序，再按创建时间倒序）
  filteredData.sort((a, b) => {
    if (a.declarationMonth !== b.declarationMonth) {
      return b.declarationMonth.localeCompare(a.declarationMonth)
    }
    return b.createTime.localeCompare(a.createTime)
  })

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

/**
 * 获取个税申报详情 Mock 函数
 */
export function getTaxDeclarationDetailMock(id: number): TaxDeclarationDetail {
  const item = taxDeclarations.find(item => item.id === id)
  if (!item) {
    throw new Error('个税申报记录不存在')
  }
  return item
}

/**
 * 生成个税申报 Mock 函数
 */
export function generateTaxDeclarationMock(params: GenerateTaxDeclarationParams) {
  const { declarationMonth, rangeType } = params

  // 模拟生成申报数据
  const employees = [
    { name: '张三', no: 'EMP001' },
    { name: '李四', no: 'EMP002' },
    { name: '王五', no: 'EMP003' }
  ]

  const newDeclarations: TaxDeclarationDetail[] = []

  employees.forEach(emp => {
    // 检查是否已存在该月份的申报记录
    const exists = taxDeclarations.some(
      item => item.employeeNo === emp.no && item.declarationMonth === declarationMonth
    )

    if (!exists) {
      const currentIncome = 10000 + Math.floor(Math.random() * 10000)
      const currentSpecialDeduction = 2000
      const currentAdditionalDeduction = 1000 + Math.floor(Math.random() * 1000)
      const currentTaxableIncome = currentIncome - currentSpecialDeduction - currentAdditionalDeduction
      const currentTaxPayable = Math.floor(currentTaxableIncome * 0.1)
      const currentTaxPaid = currentTaxPayable

      // 计算累计数据（简化处理，实际应该累加之前月份的数据）
      const previousDeclarations = taxDeclarations.filter(
        item => item.employeeNo === emp.no && item.declarationMonth < declarationMonth
      )
      const accumulatedIncome = previousDeclarations.reduce((sum, item) => sum + item.currentIncome, 0) + currentIncome
      const accumulatedSpecialDeduction = previousDeclarations.reduce((sum, item) => sum + item.currentSpecialDeduction, 0) + currentSpecialDeduction
      const accumulatedAdditionalDeduction = previousDeclarations.reduce((sum, item) => sum + item.currentAdditionalDeduction, 0) + currentAdditionalDeduction
      const accumulatedTaxableIncome = accumulatedIncome - accumulatedSpecialDeduction - accumulatedAdditionalDeduction
      const accumulatedTaxPaid = previousDeclarations.reduce((sum, item) => sum + item.currentTaxPaid, 0) + currentTaxPaid

      const newDeclaration: TaxDeclarationDetail = {
        id: nextId++,
        employeeName: emp.name,
        employeeNo: emp.no,
        declarationMonth,
        currentIncome,
        currentSpecialDeduction,
        currentAdditionalDeduction,
        currentTaxableIncome,
        currentTaxPayable,
        currentTaxPaid,
        accumulatedIncome,
        accumulatedSpecialDeduction,
        accumulatedAdditionalDeduction,
        accumulatedTaxableIncome,
        accumulatedTaxPaid,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      }

      taxDeclarations.push(newDeclaration)
      newDeclarations.push(newDeclaration)
    }
  })

  return {
    count: newDeclarations.length,
    declarations: newDeclarations
  }
}

/**
 * 导出申报表 Mock 函数
 */
export function exportTaxDeclarationMock(id: number) {
  const item = taxDeclarations.find(item => item.id === id)
  if (!item) {
    throw new Error('个税申报记录不存在')
  }
  // 模拟导出，返回文件URL
  return {
    url: `/export/tax-declaration-${id}.xlsx`,
    filename: `个税申报表_${item.employeeName}_${item.declarationMonth}.xlsx`
  }
}
