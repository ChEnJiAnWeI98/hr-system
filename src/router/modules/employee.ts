import { AppRouteRecord } from '@/types/router'

export const employeeRoutes: AppRouteRecord = {
  path: '/employee',
  name: 'Employee',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.employee.title',
    icon: '&#xe734;'
  },
  children: [
    {
      path: 'profile',
      name: 'EmployeeProfile',
      component: () => import('@/views/employee/profile/index.vue'),
      meta: {
        title: 'menus.employee.profile',
        keepAlive: true
      }
    },
    {
      path: 'profile/create/new',
      name: 'EmployeeProfileCreate',
      component: () => import('@/views/employee/profile/form.vue'),
      meta: {
        title: 'menus.employee.profileCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/profile'
      }
    },
    {
      path: 'profile/edit/:id',
      name: 'EmployeeProfileEdit',
      component: () => import('@/views/employee/profile/form.vue'),
      meta: {
        title: 'menus.employee.profileEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/profile'
      }
    },
    {
      path: 'profile/detail/:id',
      name: 'EmployeeProfileDetail',
      component: () => import('@/views/employee/profile/detail.vue'),
      meta: {
        title: 'menus.employee.profileDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/profile'
      }
    },
    {
      path: 'onboarding',
      name: 'EmployeeOnboarding',
      component: () => import('@/views/employee/onboarding/index.vue'),
      meta: {
        title: 'menus.employee.onboarding',
        keepAlive: true
      }
    },
    {
      path: 'onboarding/create/new',
      name: 'EmployeeOnboardingCreate',
      component: () => import('@/views/employee/onboarding/form.vue'),
      meta: {
        title: 'menus.employee.onboardingCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/onboarding'
      }
    },
    {
      path: 'onboarding/approve/:id',
      name: 'EmployeeOnboardingApprove',
      component: () => import('@/views/employee/onboarding/form.vue'),
      meta: {
        title: 'menus.employee.onboardingApprove',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/onboarding'
      }
    },
    {
      path: 'onboarding/handle/:id',
      name: 'EmployeeOnboardingHandle',
      component: () => import('@/views/employee/onboarding/form.vue'),
      meta: {
        title: 'menus.employee.onboardingHandle',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/onboarding'
      }
    },
    {
      path: 'onboarding/detail/:id',
      name: 'EmployeeOnboardingDetail',
      component: () => import('@/views/employee/onboarding/form.vue'),
      meta: {
        title: 'menus.employee.onboardingDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/onboarding'
      }
    },
    {
      path: 'probation',
      name: 'EmployeeProbation',
      component: () => import('@/views/employee/probation/index.vue'),
      meta: {
        title: 'menus.employee.probation',
        keepAlive: true
      }
    },
    {
      path: 'probation/create/new',
      name: 'EmployeeProbationCreate',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/edit/:id',
      name: 'EmployeeProbationEdit',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/evaluate/:id',
      name: 'EmployeeProbationEvaluate',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEvaluate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/extend/:id',
      name: 'EmployeeProbationExtend',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationExtend',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/evaluation/detail/:id',
      name: 'EmployeeProbationEvaluationDetail',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationEvaluationDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'probation/extension/detail/:id',
      name: 'EmployeeProbationExtensionDetail',
      component: () => import('@/views/employee/probation/form.vue'),
      meta: {
        title: 'menus.employee.probationExtensionDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/probation'
      }
    },
    {
      path: 'resignation',
      name: 'EmployeeResignation',
      component: () => import('@/views/employee/resignation/index.vue'),
      meta: {
        title: 'menus.employee.resignation',
        keepAlive: true
      }
    },
    {
      path: 'resignation/create/new',
      name: 'EmployeeResignationCreate',
      component: () => import('@/views/employee/resignation/form.vue'),
      meta: {
        title: 'menus.employee.resignationCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/resignation'
      }
    },
    {
      path: 'resignation/approve/:id',
      name: 'EmployeeResignationApprove',
      component: () => import('@/views/employee/resignation/form.vue'),
      meta: {
        title: 'menus.employee.resignationApprove',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/resignation'
      }
    },
    {
      path: 'resignation/handle/:id',
      name: 'EmployeeResignationHandle',
      component: () => import('@/views/employee/resignation/form.vue'),
      meta: {
        title: 'menus.employee.resignationHandle',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/resignation'
      }
    },
    {
      path: 'resignation/detail/:id',
      name: 'EmployeeResignationDetail',
      component: () => import('@/views/employee/resignation/form.vue'),
      meta: {
        title: 'menus.employee.resignationDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/resignation'
      }
    },
    {
      path: 'transfer',
      name: 'EmployeeTransfer',
      component: () => import('@/views/employee/transfer/index.vue'),
      meta: {
        title: 'menus.employee.transfer',
        keepAlive: true
      }
    },
    {
      path: 'transfer/create/new',
      name: 'EmployeeTransferCreate',
      component: () => import('@/views/employee/transfer/form.vue'),
      meta: {
        title: 'menus.employee.transferCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/transfer'
      }
    },
    {
      path: 'transfer/edit/:id',
      name: 'EmployeeTransferEdit',
      component: () => import('@/views/employee/transfer/form.vue'),
      meta: {
        title: 'menus.employee.transferEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/transfer'
      }
    },
    {
      path: 'transfer/approve/:id',
      name: 'EmployeeTransferApprove',
      component: () => import('@/views/employee/transfer/form.vue'),
      meta: {
        title: 'menus.employee.transferApprove',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/transfer'
      }
    },
    {
      path: 'transfer/detail/:id',
      name: 'EmployeeTransferDetail',
      component: () => import('@/views/employee/transfer/form.vue'),
      meta: {
        title: 'menus.employee.transferDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/transfer'
      }
    },
    {
      path: 'certificate',
      name: 'EmployeeCertificate',
      component: () => import('@/views/employee/certificate/index.vue'),
      meta: {
        title: 'menus.employee.certificate',
        keepAlive: true
      }
    },
    {
      path: 'certificate/create/new',
      name: 'EmployeeCertificateCreate',
      component: () => import('@/views/employee/certificate/form.vue'),
      meta: {
        title: 'menus.employee.certificateCreate',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/certificate'
      }
    },
    {
      path: 'certificate/edit/:id',
      name: 'EmployeeCertificateEdit',
      component: () => import('@/views/employee/certificate/form.vue'),
      meta: {
        title: 'menus.employee.certificateEdit',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/certificate'
      }
    },
    {
      path: 'certificate/detail/:id',
      name: 'EmployeeCertificateDetail',
      component: () => import('@/views/employee/certificate/form.vue'),
      meta: {
        title: 'menus.employee.certificateDetail',
        keepAlive: false,
        isHide: true,
        activePath: '/employee/certificate'
      }
    }
  ]
}
