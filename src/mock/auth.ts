import avatar1 from '@/assets/img/avatar/avatar.jpg'

/**
 * Mock 登录数据
 * 用于产品经理前端演示，无需后端 API
 */

// Mock 用户数据
export const MOCK_USERS = [
  {
    username: 'admin',
    password: '123456',
    userInfo: {
      id: 1,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: null,
      updateBy: null,
      username: 'admin',
      nickname: '超级管理员',
      email: '475353265@qq.com',
      phone: '13800138000',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '系统超级管理员',
      departmentId: 1,
      department: {
        id: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: null,
        updateBy: null,
        departmentName: '总经办',
        departmentCode: 'CEO_OFFICE',
        parentId: null,
        type: 'company',
        companyId: 1,
        status: 1,
        sort: 1,
        managerId: 1,
        managerName: '超级管理员',
        phone: '13800138000',
        email: '475353265@qq.com'
      },
      roles: [
        {
          id: 1,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: null,
          updateBy: null,
          name: '超级管理员',
          code: 'R_SUPER',
          description: '系统最高权限：用户/角色/权限/系统配置/数据字典/操作日志',
          permissions: null,
          status: 1,
          sort: 1,
          isSystem: 1
        },
        {
          id: 2,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: null,
          updateBy: null,
          name: 'HR管理员',
          code: 'R_HR',
          description: '负责招聘全流程：发布职位、筛选简历、组织面试、发放Offer、办理入职',
          permissions: null,
          status: 1,
          sort: 2,
          isSystem: 1
        },
        {
          id: 4,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: null,
          updateBy: null,
          name: '部门负责人',
          code: 'R_DEPT_MANAGER',
          description: '用人部门负责人，可发起招聘需求、参与候选人筛选与面试',
          permissions: null,
          status: 1,
          sort: 3,
          isSystem: 1
        }
      ],
      buttons: [
        'user:add', 'user:edit', 'user:delete',
        'role:add', 'role:edit', 'role:delete',
        'demand:create', 'job:publish', 'resume:manage',
        'interview:organize', 'offer:issue', 'onboarding:handle'
      ]
    }
  },
  {
    username: 'hr',
    password: '123456',
    userInfo: {
      id: 3,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'hr',
      nickname: '张HR',
      email: 'hr@example.com',
      phone: '13800138002',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '人力资源部 HR 招聘官',
      departmentId: 10,
      department: {
        id: 10,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '人力资源部',
        departmentCode: 'HR_DEPT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 3,
        managerId: 3,
        managerName: '张HR',
        phone: '13800138002',
        email: 'hr@example.com'
      },
      roles: [
        {
          id: 2,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: 'HR管理员',
          code: 'R_HR',
          description: '负责招聘全流程：发布职位、筛选简历、组织面试、发放Offer、办理入职',
          permissions: null,
          status: 1,
          sort: 2,
          isSystem: 1
        }
      ],
      buttons: ['job:publish', 'resume:manage', 'interview:organize', 'offer:issue', 'onboarding:handle']
    }
  },
  {
    username: 'manager',
    password: '123456',
    userInfo: {
      id: 4,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'manager',
      nickname: '李经理',
      email: 'manager@example.com',
      phone: '13800138003',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '产品部负责人（用人部门）',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '产品部',
        departmentCode: 'PRODUCT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 2,
        managerId: 4,
        managerName: '李经理',
        phone: '13800138003',
        email: 'manager@example.com'
      },
      roles: [
        {
          id: 4,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '部门负责人',
          code: 'R_DEPT_MANAGER',
          description: '用人部门负责人，可发起招聘需求、参与候选人筛选与面试',
          permissions: null,
          status: 1,
          sort: 3,
          isSystem: 1
        }
      ],
      buttons: ['demand:create', 'resume:screen', 'interview:participate']
    }
  },
  {
    username: 'user',
    password: '123456',
    userInfo: {
      id: 2,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'user',
      nickname: '普通用户',
      email: 'user@example.com',
      phone: '13800138001',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '普通员工账号',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '产品部',
        departmentCode: 'PRODUCT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 2,
        managerId: 4,
        managerName: '李经理',
        phone: '13800138001',
        email: 'user@example.com'
      },
      roles: [
        {
          id: 5,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '普通员工',
          code: 'R_USER',
          description: '在职员工，可查看个人信息、参与内推、接收培训通知',
          permissions: null,
          status: 1,
          sort: 4,
          isSystem: 0
        }
      ],
      buttons: ['user:view']
    }
  },
  // ========== V2.0 RBAC 新增账号（Phase 1.5）==========
  {
    username: 'hrbp',
    password: '123456',
    userInfo: {
      id: 5,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2026-04-21 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'hrbp',
      nickname: '王 HRBP',
      email: 'hrbp@example.com',
      phone: '13800138005',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2026-04-21 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: 'HRBP - 技术事业部分管 HR',
      departmentId: 10,
      department: {
        id: 10,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '人力资源部',
        departmentCode: 'HR_DEPT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 3,
        managerId: 3,
        managerName: '张HR',
        phone: '13800138002',
        email: 'hr@example.com'
      },
      roles: [
        {
          id: 6,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: 'HRBP',
          code: 'R_HRBP',
          description: 'HRBP - 按员工档案 managedOrgIds 分管组织',
          permissions: null,
          status: 1,
          sort: 5,
          isSystem: 1
        }
      ],
      buttons: ['hr:view', 'employee:view']
    }
  },
  {
    username: 'leader',
    password: '123456',
    userInfo: {
      id: 6,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2026-04-21 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'leader',
      nickname: '赵组长',
      email: 'leader@example.com',
      phone: '13800138006',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2026-04-21 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '直线经理 - 只看本人 + 直属下属',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '技术研发中心',
        departmentCode: 'RD_CENTER',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 1,
        managerId: 6,
        managerName: '赵组长',
        phone: '13800138006',
        email: 'leader@example.com'
      },
      roles: [
        {
          id: 7,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '直线经理',
          code: 'R_LINE_MANAGER',
          description: '直线经理 - 只看本人和直属下属',
          permissions: null,
          status: 1,
          sort: 6,
          isSystem: 1
        }
      ],
      buttons: ['team:view', 'subordinate:manage']
    }
  },
  {
    username: 'interviewer',
    password: '123456',
    userInfo: {
      id: 7,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2026-04-21 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'interviewer',
      nickname: '孙面试官',
      email: 'interviewer@example.com',
      phone: '13800138007',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2026-04-21 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '面试官（临时角色）',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '技术研发中心',
        departmentCode: 'RD_CENTER',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 1,
        managerId: 6,
        managerName: '赵组长',
        phone: '13800138006',
        email: 'leader@example.com'
      },
      roles: [
        {
          id: 8,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '面试官',
          code: 'R_INTERVIEWER',
          description: '临时角色 - 仅看面试相关菜单',
          permissions: null,
          status: 1,
          sort: 7,
          isSystem: 1
        }
      ],
      buttons: ['interview:view']
    }
  }
]

// ========== V2.0 RBAC 账号映射（Phase 1.5）==========
/**
 * 账号 → RBAC 角色编码 + 员工池绑定特征
 * 登录成功后，login 流程通过此表调用 rbacStore.setLoginIdentity()
 */
export const RBAC_ACCOUNT_MAP: Record<
  string,
  {
    rbacRoleCode: string
    /** 员工匹配规则（登录时动态从员工池查找） */
    employeeFinder: 'none' | 'hr_lead' | 'hrbp_with_managed_orgs' | 'dept_manager_tech' | 'line_manager_with_subs' | 'regular_employee' | 'any_interviewer'
  }
> = {
  admin: { rbacRoleCode: 'super_admin', employeeFinder: 'none' },
  hr: { rbacRoleCode: 'hr_admin', employeeFinder: 'hr_lead' },
  hrbp: { rbacRoleCode: 'hr_bp', employeeFinder: 'hrbp_with_managed_orgs' },
  manager: { rbacRoleCode: 'dept_manager', employeeFinder: 'dept_manager_tech' },
  leader: { rbacRoleCode: 'line_manager', employeeFinder: 'line_manager_with_subs' },
  user: { rbacRoleCode: 'employee', employeeFinder: 'regular_employee' },
  interviewer: { rbacRoleCode: 'interviewer', employeeFinder: 'any_interviewer' }
}

/**
 * Mock 登录函数
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据
 */
export function mockLogin(username: string, password: string): Api.Auth.LoginResponse | null {
  const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

  if (!user) {
    return null
  }

  // 生成 Mock Token
  const token = `mock_token_${username}_${Date.now()}`
  const refreshToken = `mock_refresh_token_${username}_${Date.now()}`

  return {
    token,
    refreshToken,
    user: user.userInfo
  }
}

/**
 * Mock 获取用户信息
 * @param token Token
 * @returns 用户信息
 */
export function mockGetUserInfo(token: string): Api.Auth.UserInfo | null {
  // 从 token 中提取用户名
  const match = token.match(/mock_token_(\w+)_/)
  if (!match) {
    return null
  }

  const username = match[1]
  const user = MOCK_USERS.find((u) => u.username === username)

  return user ? user.userInfo : null
}

/**
 * Mock 菜单树数据（用于动态路由）
 */
export const MOCK_MENU_TREE = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: 'index',
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
      isHideTab: false
    },
    children: [
      {
        id: 11,
        name: 'DashboardConsole',
        path: '/dashboard/console',
        component: 'dashboard/console/index',
        meta: {
          title: '控制台',
          icon: 'console',
          isHideTab: false
        }
      },
      {
        id: 12,
        name: 'DashboardAnalysis',
        path: '/dashboard/analysis',
        component: 'dashboard/analysis/index',
        meta: {
          title: '分析页',
          icon: 'analysis',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Prototype',
    path: '/prototype',
    component: 'index',
    meta: {
      title: '原型中心',
      icon: 'prototype',
      isHideTab: false
    },
    children: [
      {
        id: 21,
        name: 'PrototypeList',
        path: '/prototype/list',
        component: 'prototype/list/index',
        meta: {
          title: '原型列表',
          icon: 'list',
          isHideTab: false
        }
      },
      {
        id: 22,
        name: 'PrototypeCategory',
        path: '/prototype/category',
        component: 'prototype/category/index',
        meta: {
          title: '原型分类',
          icon: 'category',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 3,
    name: 'ChartWorkshop',
    path: '/chart-workshop',
    component: 'index',
    meta: {
      title: '图表工作坊',
      icon: 'chart',
      isHideTab: false
    },
    children: [
      {
        id: 31,
        name: 'UserCharts',
        path: '/chart-workshop/user-charts',
        component: 'chart-workshop/user-charts/index',
        meta: {
          title: '我的图表',
          icon: 'user-chart',
          isHideTab: false
        }
      },
      {
        id: 32,
        name: 'ChartGallery',
        path: '/chart-workshop/gallery',
        component: 'chart-workshop/gallery/index',
        meta: {
          title: '图表画廊',
          icon: 'gallery',
          isHideTab: false
        }
      }
    ]
  },
  {
    id: 4,
    name: 'Template',
    path: '/template',
    component: 'index',
    meta: {
      title: '模板展示',
      icon: 'template',
      isHideTab: false
    },
    children: [
      {
        id: 41,
        name: 'TemplateCards',
        path: '/template/cards',
        component: 'template/cards/index',
        meta: {
          title: '卡片',
          icon: 'card',
          isHideTab: false
        }
      },
      {
        id: 42,
        name: 'TemplateCharts',
        path: '/template/charts',
        component: 'template/charts/index',
        meta: {
          title: '图表',
          icon: 'chart',
          isHideTab: false
        }
      }
    ]
  }
]

/**
 * Mock 获取用户菜单树
 * @returns 菜单树数据
 */
export function mockGetUserMenuTree() {
  return MOCK_MENU_TREE
}

/**
 * Mock 获取验证码
 * @returns 验证码数据
 */
export function mockGetCaptcha() {
  // 生成一个简单的 Mock 验证码 ID
  const captchaId = `mock_captcha_${Date.now()}`

  // 返回一个简单的 Base64 图片（1x1 透明像素）
  // 在 Mock 模式下，验证码不做实际验证
  const captchaImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Nb2NrIOmqjOivgTwvdGV4dD48L3N2Zz4='

  return {
    captchaId,
    captchaImage
  }
}
