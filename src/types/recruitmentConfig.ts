/**
 * 招聘配置与模板管理类型定义（需求说明书 11.3.7）
 * 包含 6 类配置：面试评价模板 / Offer 模板 / 通知模板 / 入职资料模板 / 招聘流程配置 / 渠道账号管理
 */

// ======================== 1. 面试评价模板 ========================
export interface EvaluationDimension {
  /** 维度名称 */
  name: string
  /** 维度说明 */
  description?: string
  /** 权重（0-100），加权平均模式下所有维度权重之和必须为 100 */
  weight: number
  /** 评分上限（默认 5 星） */
  maxScore: number
}

export interface InterviewEvaluationTemplate {
  id: number
  templateName: string
  /** 适用岗位族（逗号分隔，为空代表全岗位适用） */
  applicableJobFamily?: string
  /** 评价维度列表 */
  dimensions: EvaluationDimension[]
  /** 总分计算规则：weighted-加权平均 / sum-简单求和 */
  scoreRule: 'weighted' | 'sum'
  /** 结果建议选项（通过/不通过/待定/强烈推荐） */
  resultOptions: string[]
  /** 模板状态：1-启用 0-禁用 */
  status: number
  remark?: string
  creatorName?: string
  createTime?: string
  updateTime?: string
}

// ======================== 2. Offer 模板 ========================
export interface OfferTemplate {
  id: number
  templateName: string
  /** 适用职级（如 P5-P7、M1-M3，多个逗号分隔） */
  applicableLevel?: string
  /** 适用岗位族 */
  applicableJobFamily?: string
  /** 适用语言：zh-中文 en-英文 bilingual-双语 */
  language: 'zh' | 'en' | 'bilingual'
  /** 正文（富文本 + 变量占位符 {{变量名}}） */
  content: string
  /** 支持的变量列表（说明文字） */
  supportedVariables?: string
  /** 版本号，默认 1 */
  version: number
  /** 模板状态：1-启用 0-禁用 2-已废弃 */
  status: number
  createTime?: string
  updateTime?: string
}

// ======================== 3. 通知模板（邮件/短信/消息） ========================
export interface NotificationTemplate {
  id: number
  /** 场景编码，如 interview_invite / offer_send */
  sceneCode: string
  /** 场景名称 */
  sceneName: string
  /** 通知渠道：email/sms/inner/wechat/dingtalk/feishu */
  channel: 'email' | 'sms' | 'inner' | 'wechat' | 'dingtalk' | 'feishu'
  /** 模板标题（邮件/站内信） */
  title?: string
  /** 模板内容（含变量占位符） */
  content: string
  /** 支持变量说明 */
  supportedVariables?: string
  /** 模板状态：1-启用 0-禁用 */
  status: number
  createTime?: string
  updateTime?: string
}

// ======================== 4. 入职资料填报模板 ========================
export interface OnboardingFormField {
  /** 字段名称 */
  name: string
  /** 字段类型：text/textarea/date/select/upload */
  type: 'text' | 'textarea' | 'date' | 'select' | 'upload'
  /** 是否必填 */
  required: boolean
  /** 校验规则（简单描述） */
  validation?: string
  /** 选项（select 类型时使用） */
  options?: string[]
}

export interface OnboardingAttachmentItem {
  /** 附件名称 */
  name: string
  /** 是否必传 */
  required: boolean
  /** 示例说明 */
  example?: string
}

export interface OnboardingTemplate {
  id: number
  templateName: string
  /** 适用岗位族 */
  applicableJobFamily?: string
  /** 表单字段配置 */
  formFields: OnboardingFormField[]
  /** 附件清单 */
  attachments: OnboardingAttachmentItem[]
  /** 模板状态：1-启用 0-禁用 */
  status: number
  createTime?: string
  updateTime?: string
}

// ======================== 5. 招聘流程配置 ========================
export interface ProcessStage {
  /** 阶段名称 */
  name: string
  /** 默认面试评价模板ID */
  defaultEvaluationTemplateId?: number
  /** 默认面试官角色 */
  defaultInterviewerRole?: string
  /** 阶段 SLA 天数（超过天数自动提醒） */
  slaDays: number
}

export interface RecruitmentProcessConfig {
  id: number
  processName: string
  /** 适用岗位族 */
  applicableJobFamily?: string
  /** 流程阶段 */
  stages: ProcessStage[]
  /** 流程状态：1-启用 0-禁用 */
  status: number
  createTime?: string
  updateTime?: string
}

// ======================== 6. 渠道账号管理 ========================
export interface ChannelAccount {
  id: number
  /** 渠道平台：boss/liepin/zhilian/51job/lagou/linkedin/maimai */
  platform: string
  /** 平台展示名 */
  platformName: string
  /** 账号名称（企业在平台的账号名） */
  accountName: string
  /** 账号状态：1-正常 2-异常 3-已过期 4-已禁用 */
  accountStatus: number
  /** 账号余额（元） */
  balance?: number
  /** 累计发布次数 */
  publishCount?: number
  /** 最后同步时间 */
  lastSyncTime?: string
  /** 备注 */
  remark?: string
  createTime?: string
  updateTime?: string
}

// ======================== 列表查询参数 ========================
export interface ConfigListParams {
  keyword?: string
  status?: number | string | null
  page: number
  pageSize: number
}
