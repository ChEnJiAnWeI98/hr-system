import type {
  InsuredTrend,
  PaymentAmountStats,
  DepartmentCostCompare,
  InsuranceTypeRatio,
  StatisticsQueryParams
} from '@/types/socialSecurity'

/**
 * 参保人数趋势数据
 */
export function getInsuredTrendMock(params: StatisticsQueryParams): InsuredTrend[] {
  return [
    { month: '2026-01', insuredCount: 350, newCount: 15, stopCount: 5 },
    { month: '2026-02', insuredCount: 365, newCount: 20, stopCount: 5 },
    { month: '2026-03', insuredCount: 376, newCount: 18, stopCount: 7 },
    { month: '2026-04', insuredCount: 382, newCount: 12, stopCount: 6 },
    { month: '2026-05', insuredCount: 390, newCount: 14, stopCount: 6 },
    { month: '2026-06', insuredCount: 398, newCount: 16, stopCount: 8 }
  ]
}

/**
 * 缴纳金额统计数据
 */
export function getPaymentAmountStatsMock(params: StatisticsQueryParams): PaymentAmountStats[] {
  return [
    {
      month: '2026-01',
      pensionAmount: 440000,
      medicalAmount: 220000,
      unemploymentAmount: 36667,
      injuryAmount: 18333,
      maternityAmount: 18333,
      providentFundAmount: 293333,
      totalAmount: 1026666
    },
    {
      month: '2026-02',
      pensionAmount: 458900,
      medicalAmount: 229450,
      unemploymentAmount: 38242,
      injuryAmount: 19125,
      maternityAmount: 19125,
      providentFundAmount: 306000,
      totalAmount: 1070842
    },
    {
      month: '2026-03',
      pensionAmount: 472800,
      medicalAmount: 236400,
      unemploymentAmount: 39400,
      injuryAmount: 19700,
      maternityAmount: 19700,
      providentFundAmount: 315200,
      totalAmount: 1103200
    },
    {
      month: '2026-04',
      pensionAmount: 480400,
      medicalAmount: 240200,
      unemploymentAmount: 40033,
      injuryAmount: 20017,
      maternityAmount: 20017,
      providentFundAmount: 320267,
      totalAmount: 1120934
    },
    {
      month: '2026-05',
      pensionAmount: 490000,
      medicalAmount: 245000,
      unemploymentAmount: 40833,
      injuryAmount: 20417,
      maternityAmount: 20417,
      providentFundAmount: 326667,
      totalAmount: 1143334
    },
    {
      month: '2026-06',
      pensionAmount: 499600,
      medicalAmount: 249800,
      unemploymentAmount: 41633,
      injuryAmount: 20817,
      maternityAmount: 20817,
      providentFundAmount: 333067,
      totalAmount: 1165734
    }
  ]
}

/**
 * 部门费用对比数据
 */
export function getDepartmentCostCompareMock(params: StatisticsQueryParams): DepartmentCostCompare[] {
  return [
    {
      department: '技术部',
      totalAmount: 450000,
      pensionAmount: 180000,
      medicalAmount: 90000,
      unemploymentAmount: 15000,
      injuryAmount: 7500,
      maternityAmount: 7500,
      providentFundAmount: 150000
    },
    {
      department: '产品部',
      totalAmount: 280000,
      pensionAmount: 112000,
      medicalAmount: 56000,
      unemploymentAmount: 9333,
      injuryAmount: 4667,
      maternityAmount: 4667,
      providentFundAmount: 93333
    },
    {
      department: '市场部',
      totalAmount: 220000,
      pensionAmount: 88000,
      medicalAmount: 44000,
      unemploymentAmount: 7333,
      injuryAmount: 3667,
      maternityAmount: 3667,
      providentFundAmount: 73333
    },
    {
      department: '销售部',
      totalAmount: 350000,
      pensionAmount: 140000,
      medicalAmount: 70000,
      unemploymentAmount: 11667,
      injuryAmount: 5833,
      maternityAmount: 5833,
      providentFundAmount: 116667
    },
    {
      department: '财务部',
      totalAmount: 180000,
      pensionAmount: 72000,
      medicalAmount: 36000,
      unemploymentAmount: 6000,
      injuryAmount: 3000,
      maternityAmount: 3000,
      providentFundAmount: 60000
    },
    {
      department: '人力资源部',
      totalAmount: 150000,
      pensionAmount: 60000,
      medicalAmount: 30000,
      unemploymentAmount: 5000,
      injuryAmount: 2500,
      maternityAmount: 2500,
      providentFundAmount: 50000
    },
    {
      department: '行政部',
      totalAmount: 120000,
      pensionAmount: 48000,
      medicalAmount: 24000,
      unemploymentAmount: 4000,
      injuryAmount: 2000,
      maternityAmount: 2000,
      providentFundAmount: 40000
    }
  ]
}

/**
 * 险种费用占比数据
 */
export function getInsuranceTypeRatioMock(params: StatisticsQueryParams): InsuranceTypeRatio[] {
  const totalAmount = 1120934
  return [
    {
      insuranceType: '养老保险',
      amount: 480400,
      ratio: Number(((480400 / totalAmount) * 100).toFixed(2))
    },
    {
      insuranceType: '医疗保险',
      amount: 240200,
      ratio: Number(((240200 / totalAmount) * 100).toFixed(2))
    },
    {
      insuranceType: '公积金',
      amount: 320267,
      ratio: Number(((320267 / totalAmount) * 100).toFixed(2))
    },
    {
      insuranceType: '失业保险',
      amount: 40033,
      ratio: Number(((40033 / totalAmount) * 100).toFixed(2))
    },
    {
      insuranceType: '工伤保险',
      amount: 20017,
      ratio: Number(((20017 / totalAmount) * 100).toFixed(2))
    },
    {
      insuranceType: '生育保险',
      amount: 20017,
      ratio: Number(((20017 / totalAmount) * 100).toFixed(2))
    }
  ]
}
