import type { AppRouteRecord } from '@/types/router'

export const socialSecurityRoutes: AppRouteRecord = {
  path: '/social-security',
  name: 'SocialSecurity',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.socialSecurity.title',
    icon: '&#xe7a9;',
    isFirstLevel: true
  },
  children: [
    {
      path: 'insurance-config',
      name: 'InsuranceConfig',
      component: () => import('@/views/social-security/insurance-config/index.vue'),
      meta: {
        title: 'menus.socialSecurity.insuranceConfig',
        keepAlive: true
      }
    },
    {
      path: 'employee-insurance',
      name: 'EmployeeInsurance',
      component: () => import('@/views/social-security/employee-insurance/index.vue'),
      meta: {
        title: 'menus.socialSecurity.employeeInsurance',
        keepAlive: true
      }
    },
    {
      path: 'provident-fund',
      name: 'ProvidentFund',
      component: () => import('@/views/social-security/provident-fund/index.vue'),
      meta: {
        title: 'menus.socialSecurity.providentFund',
        keepAlive: true
      }
    },
    {
      path: 'insurance-bill',
      name: 'InsuranceBill',
      component: () => import('@/views/social-security/insurance-bill/index.vue'),
      meta: {
        title: 'menus.socialSecurity.insuranceBill',
        keepAlive: true
      }
    },
    {
      path: 'declaration-export',
      name: 'DeclarationExport',
      component: () => import('@/views/social-security/declaration-export/index.vue'),
      meta: {
        title: 'menus.socialSecurity.declarationExport',
        keepAlive: true
      }
    },
    {
      path: 'payment-record',
      name: 'PaymentRecord',
      component: () => import('@/views/social-security/payment-record/index.vue'),
      meta: {
        title: 'menus.socialSecurity.paymentRecord',
        keepAlive: true
      }
    },
    {
      path: 'statistics',
      name: 'SocialSecurityStatistics',
      component: () => import('@/views/social-security/statistics/index.vue'),
      meta: {
        title: 'menus.socialSecurity.statistics',
        keepAlive: true
      }
    }
  ]
}
