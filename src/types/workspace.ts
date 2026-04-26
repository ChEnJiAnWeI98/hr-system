/**
 * 工作台模块类型定义
 */

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 真实姓名 */
  realName: string
  /** 用户姓名 */
  userName?: string
  /** 用户头像URL */
  avatar: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 部门 */
  department: string
  /** 部门名称 */
  departmentName?: string
  /** 职位 */
  position: string
  /** 角色名称 */
  roleName?: string
}

/**
 * 天气信息接口
 */
export interface WeatherInfo {
  /** 城市名称 */
  city: string
  /** 天气状况 */
  weather: string
  /** 当前温度 */
  temperature: number
  /** 湿度 */
  humidity: number
  /** 风向 */
  windDirection: string
  /** 风力等级 */
  windLevel: string
  /** 更新时间 */
  updateTime: string
  /** 空气质量 */
  airQuality?: string
}

/**
 * 员工统计接口
 */
export interface EmployeeStats {
  /** 在职员工数 */
  onJob: number
  /** 在职员工数（兼容字段） */
  onJobCount?: number
  /** 待入职员工数 */
  toBeOnboarded: number
  /** 待入职员工数（兼容字段） */
  toBeOnboardCount?: number
  /** 试用期员工数 */
  probation: number
  /** 试用期员工数（兼容字段） */
  probationCount?: number
  /** 正式员工数 */
  formal: number
  /** 正式员工数（兼容字段） */
  formalCount?: number
  /** 待离职员工数 */
  toBeOffboarded: number
  /** 待离职员工数（兼容字段） */
  toBeOffboardCount?: number
  /** 已离职员工数 */
  offboarded: number
  /** 已离职员工数（兼容字段） */
  offboardCount?: number
}

/**
 * 快捷入口接口
 */
export interface ShortcutItem {
  /** ID */
  id: number
  /** 入口名称 */
  name: string
  /** 图标代码 */
  icon: string
  /** 跳转路径 */
  path: string
  /** 排序序号 */
  order: number
  /** 图标颜色 */
  color: string
}

/**
 * 快捷入口接口（兼容别名）
 */
export type ShortcutEntry = ShortcutItem

/**
 * 日程信息接口
 */
export interface ScheduleItem {
  /** ID */
  id: number
  /** 日程标题 */
  title: string
  /** 日期 */
  date: string
  /** 时间 */
  time: string
  /** 类型：1-会议 2-培训 3-外出 4-其他 */
  type: number
  /** 状态：1-待办 2-已完成 3-已取消 */
  status: number
  /** 描述 */
  description?: string
  /** 开始时间（兼容字段） */
  startTime?: string
  /** 地点（兼容字段） */
  location?: string
  /** 备注（兼容字段） */
  remark?: string
  /** 是否提醒（兼容字段） */
  isRemind?: boolean
  /** 提醒时间（兼容字段） */
  remindTime?: string
}

/**
 * 日程信息接口（兼容别名）
 */
export type Schedule = ScheduleItem

/**
 * 日程列表查询参数
 */
export interface ScheduleListParams {
  /** 日期 */
  date?: string
  /** 类型 */
  type?: number | string | null
  /** 状态 */
  status?: number | string | null
}

/**
 * 审批概况接口
 */
export interface ApprovalStats {
  /** 待审批数量 */
  pending: number
  /** 待审批数量（兼容字段） */
  pendingCount?: number
  /** 已审批数量 */
  approved: number
  /** 已审批数量（兼容字段） */
  approvedCount?: number
  /** 已拒绝数量 */
  rejected: number
  /** 已拒绝数量（兼容字段） */
  rejectedCount?: number
  /** 全部审批数量 */
  total?: number
  /** 审批类型（兼容字段） */
  type?: string
}

/**
 * 查询参数接口
 */
export interface WorkspaceQueryParams {
  /** 日期（用于查询日程） */
  date?: string
}
