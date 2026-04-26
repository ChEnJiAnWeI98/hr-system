import type {
  InsuredTrend,
  PaymentAmountStats,
  DepartmentCostCompare,
  InsuranceTypeRatio,
  StatisticsQueryParams
} from '@/types/socialSecurity'
import {
  getInsuredTrendMock,
  getPaymentAmountStatsMock,
  getDepartmentCostCompareMock,
  getInsuranceTypeRatioMock
} from '@/mock/socialSecurityStatistics'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取参保人数趋势
 */
export function getInsuredTrend(params: StatisticsQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getInsuredTrendMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return {
    url: '/admin/social-security/statistics/insured-trend',
    params
  }
}

/**
 * 获取缴纳金额统计
 */
export function getPaymentAmountStats(params: StatisticsQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getPaymentAmountStatsMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return {
    url: '/admin/social-security/statistics/payment-amount',
    params
  }
}

/**
 * 获取部门费用对比
 */
export function getDepartmentCostCompare(params: StatisticsQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getDepartmentCostCompareMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return {
    url: '/admin/social-security/statistics/department-cost',
    params
  }
}

/**
 * 获取险种费用占比
 */
export function getInsuranceTypeRatio(params: StatisticsQueryParams) {
  if (USE_MOCK) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const data = getInsuranceTypeRatioMock(params)
        resolve({
          code: 200,
          message: 'success',
          data
        })
      }, 300)
    })
  }

  return {
    url: '/admin/social-security/statistics/insurance-ratio',
    params
  }
}
