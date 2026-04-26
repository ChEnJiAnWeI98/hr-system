/**
 * 招聘配置 Mock 数据
 * 6 类配置统一管理：面试评价模板 / Offer 模板 / 通知模板 / 入职资料模板 / 招聘流程 / 渠道账号
 */

import { createCrudMock } from '@/utils/crud/mockHelper'
import type {
  InterviewEvaluationTemplate,
  OfferTemplate,
  NotificationTemplate,
  OnboardingTemplate,
  RecruitmentProcessConfig,
  ChannelAccount
} from '@/types/recruitmentConfig'

// ============ 1. 面试评价模板 ============
const interviewEvaluationTemplatesInit: InterviewEvaluationTemplate[] = [
  {
    id: 1,
    templateName: '技术岗通用评价模板',
    applicableJobFamily: '前端,后端,测试,运维,架构',
    dimensions: [
      { name: '专业能力', weight: 40, maxScore: 5, description: '技术深度与解决问题能力' },
      { name: '沟通能力', weight: 20, maxScore: 5, description: '表达清晰度、协作意愿' },
      { name: '学习能力', weight: 15, maxScore: 5, description: '新技术学习速度' },
      { name: '抗压能力', weight: 10, maxScore: 5, description: '面对压力的情绪管理' },
      { name: '文化匹配度', weight: 15, maxScore: 5, description: '价值观与团队契合度' }
    ],
    scoreRule: 'weighted',
    resultOptions: ['强烈推荐', '通过', '待定', '不通过'],
    status: 1,
    remark: '覆盖常见技术岗位的通用评价维度',
    creatorName: '张HR',
    createTime: '2026-03-20 10:00:00',
    updateTime: '2026-03-20 10:00:00'
  },
  {
    id: 2,
    templateName: '产品岗评价模板',
    applicableJobFamily: '产品经理,产品运营',
    dimensions: [
      { name: '产品思维', weight: 35, maxScore: 5, description: '需求分析与产品设计' },
      { name: '业务理解', weight: 25, maxScore: 5, description: '行业和业务理解深度' },
      { name: '沟通协调', weight: 25, maxScore: 5, description: '跨团队沟通协调能力' },
      { name: '执行力', weight: 15, maxScore: 5, description: '推进事项落地能力' }
    ],
    scoreRule: 'weighted',
    resultOptions: ['强烈推荐', '通过', '待定', '不通过'],
    status: 1,
    remark: '产品经理与产品运营岗位使用',
    creatorName: '张HR',
    createTime: '2026-03-22 14:30:00',
    updateTime: '2026-03-22 14:30:00'
  },
  {
    id: 3,
    templateName: '管理岗评价模板',
    applicableJobFamily: '部门负责人,总监,副总裁',
    dimensions: [
      { name: '战略思维', weight: 25, maxScore: 5 },
      { name: '领导力', weight: 25, maxScore: 5 },
      { name: '业务能力', weight: 20, maxScore: 5 },
      { name: '团队建设', weight: 15, maxScore: 5 },
      { name: '文化价值观', weight: 15, maxScore: 5 }
    ],
    scoreRule: 'weighted',
    resultOptions: ['强烈推荐', '通过', '待定', '不通过'],
    status: 1,
    createTime: '2026-03-25 09:00:00',
    updateTime: '2026-03-25 09:00:00'
  }
]

export const interviewEvaluationTemplateMock = createCrudMock<InterviewEvaluationTemplate>(
  interviewEvaluationTemplatesInit,
  { searchFields: ['templateName', 'applicableJobFamily'] }
)

// ============ 2. Offer 模板 ============
const offerTemplatesInit: OfferTemplate[] = [
  {
    id: 1,
    templateName: '标准 Offer 模板（中文）',
    applicableLevel: 'P4-P7',
    applicableJobFamily: '技术,产品,设计',
    language: 'zh',
    content: `尊敬的 {{候选人姓名}}：

非常高兴地通知您，经过慎重考虑，我们决定正式录用您担任 {{入职部门}} {{入职岗位}} 一职。

【薪资待遇】
基本月薪：{{薪资}}（税前）
试用期：{{试用期}}
试用期薪资：转正薪资的 80%

【入职信息】
预计入职日期：{{入职日期}}
工作地点：{{工作地点}}
汇报对象：{{汇报对象}}

请您于收到本 Offer 后 3 个工作日内回复是否接受。

顺祝商祺
XX 公司 人力资源部`,
    supportedVariables: '{{候选人姓名}}、{{入职岗位}}、{{入职部门}}、{{薪资}}、{{入职日期}}、{{工作地点}}、{{试用期}}、{{汇报对象}}',
    version: 1,
    status: 1,
    createTime: '2026-03-15 10:00:00',
    updateTime: '2026-03-15 10:00:00'
  },
  {
    id: 2,
    templateName: '高管 Offer 模板',
    applicableLevel: 'M3-M5',
    applicableJobFamily: '',
    language: 'zh',
    content: `尊敬的 {{候选人姓名}}：

我们非常荣幸地邀请您加入公司，担任 {{入职岗位}} 一职。

【薪资与股权激励】
年薪包：{{薪资}}
股权激励：详见单独协议

【入职信息】
预计入职日期：{{入职日期}}
工作地点：{{工作地点}}
汇报对象：{{汇报对象}}

期待您的加入。`,
    supportedVariables: '{{候选人姓名}}、{{入职岗位}}、{{薪资}}、{{入职日期}}、{{工作地点}}、{{汇报对象}}',
    version: 1,
    status: 1,
    createTime: '2026-03-16 10:00:00',
    updateTime: '2026-03-16 10:00:00'
  },
  {
    id: 3,
    templateName: 'Standard Offer Letter (English)',
    applicableLevel: 'P4-P7',
    applicableJobFamily: '',
    language: 'en',
    content: `Dear {{候选人姓名}},

We are pleased to offer you the position of {{入职岗位}} in our {{入职部门}} department.

【Compensation】
Monthly Salary: {{薪资}} (before tax)
Probation Period: {{试用期}}

【Onboarding】
Expected start date: {{入职日期}}
Location: {{工作地点}}
Reporting to: {{汇报对象}}

Please confirm your acceptance within 3 business days.

Sincerely,
HR Department`,
    supportedVariables: '{{候选人姓名}}、{{入职岗位}}、{{入职部门}}、{{薪资}}、{{试用期}}、{{入职日期}}、{{工作地点}}、{{汇报对象}}',
    version: 1,
    status: 1,
    createTime: '2026-03-18 10:00:00',
    updateTime: '2026-03-18 10:00:00'
  }
]

export const offerTemplateMock = createCrudMock<OfferTemplate>(offerTemplatesInit, {
  searchFields: ['templateName', 'applicableJobFamily', 'applicableLevel']
})

// ============ 3. 通知模板 ============
const notificationTemplatesInit: NotificationTemplate[] = [
  {
    id: 1,
    sceneCode: 'interview_invite',
    sceneName: '面试邀约通知',
    channel: 'email',
    title: '面试邀约 - {{公司名称}}',
    content: `{{候选人姓名}} 您好：

非常感谢您投递我司 {{职位名称}} 一职，经过简历筛选，我们诚邀您参加面试。

【面试信息】
面试时间：{{面试时间}}
面试地点：{{面试地点}}
面试形式：{{面试方式}}
联系人：{{联系人}}

请提前 10 分钟到达并携带个人简历。期待与您见面。

{{公司名称}} 招聘团队`,
    supportedVariables: '{{候选人姓名}}、{{职位名称}}、{{面试时间}}、{{面试地点}}、{{面试方式}}、{{联系人}}、{{公司名称}}',
    status: 1,
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00'
  },
  {
    id: 2,
    sceneCode: 'interview_change',
    sceneName: '面试时间变更通知',
    channel: 'sms',
    content: '【{{公司名称}}】{{候选人姓名}} 您好，原定于 {{原面试时间}} 的面试调整为 {{新面试时间}}，地点不变。如有疑问请联系 {{联系人}}。',
    supportedVariables: '{{候选人姓名}}、{{原面试时间}}、{{新面试时间}}、{{联系人}}、{{公司名称}}',
    status: 1,
    createTime: '2026-03-11 10:00:00',
    updateTime: '2026-03-11 10:00:00'
  },
  {
    id: 3,
    sceneCode: 'offer_send',
    sceneName: 'Offer 发放通知',
    channel: 'email',
    title: '【重要】{{公司名称}} 录用通知',
    content: `{{候选人姓名}} 您好：

恭喜您，我们决定录用您担任 {{入职岗位}} 一职。详细 Offer 内容见附件，请在 3 个工作日内确认。

{{公司名称}} 人力资源部`,
    supportedVariables: '{{候选人姓名}}、{{入职岗位}}、{{公司名称}}',
    status: 1,
    createTime: '2026-03-12 10:00:00',
    updateTime: '2026-03-12 10:00:00'
  },
  {
    id: 4,
    sceneCode: 'onboarding_notice',
    sceneName: '入职通知书',
    channel: 'email',
    title: '入职通知 - {{公司名称}}',
    content: `{{候选人姓名}} 您好：

欢迎加入 {{公司名称}}！

【报到信息】
报到时间：{{入职日期}} 上午 9:00
报到地点：{{公司地址}}
联系人：{{HR姓名}}（{{HR电话}}）

【报到所需材料】
1. 身份证原件及复印件 2 份
2. 毕业证、学位证原件及复印件
3. 离职证明原件
4. 1 寸免冠彩照 6 张
5. 体检报告（3 个月内）
6. 银行卡（用于发放工资）

期待与您见面！`,
    supportedVariables: '{{候选人姓名}}、{{入职日期}}、{{公司地址}}、{{HR姓名}}、{{HR电话}}、{{公司名称}}',
    status: 1,
    createTime: '2026-03-13 10:00:00',
    updateTime: '2026-03-13 10:00:00'
  },
  {
    id: 5,
    sceneCode: 'interview_reject',
    sceneName: '面试未通过关怀邮件',
    channel: 'email',
    title: '感谢您对 {{公司名称}} 的关注',
    content: `{{候选人姓名}} 您好：

非常感谢您对我司 {{职位名称}} 岗位的关注，也感谢您前来面试。

经过综合评估，您当前的经历与本岗位尚有一定差距。我们已将您加入公司人才库，若未来有更合适的机会，我们会第一时间与您联系。

再次感谢您的时间，祝您求职顺利！

{{公司名称}} 招聘团队`,
    supportedVariables: '{{候选人姓名}}、{{职位名称}}、{{公司名称}}',
    status: 1,
    createTime: '2026-03-14 10:00:00',
    updateTime: '2026-03-14 10:00:00'
  }
]

export const notificationTemplateMock = createCrudMock<NotificationTemplate>(
  notificationTemplatesInit,
  { searchFields: ['sceneCode', 'sceneName'] }
)

// ============ 4. 入职资料填报模板 ============
const onboardingTemplatesInit: OnboardingTemplate[] = [
  {
    id: 1,
    templateName: '通用岗位入职资料清单',
    applicableJobFamily: '',
    formFields: [
      { name: '紧急联系人姓名', type: 'text', required: true },
      { name: '紧急联系人关系', type: 'select', required: true, options: ['父亲', '母亲', '配偶', '兄弟姐妹', '其他'] },
      { name: '紧急联系人电话', type: 'text', required: true, validation: '11 位手机号' },
      { name: '开户行', type: 'text', required: true },
      { name: '工资卡账号', type: 'text', required: true },
      { name: '户籍地址', type: 'text', required: true },
      { name: '居住地址', type: 'textarea', required: true },
      { name: '政治面貌', type: 'select', required: false, options: ['党员', '团员', '群众', '其他'] },
      { name: '婚姻状况', type: 'select', required: true, options: ['未婚', '已婚', '离异', '丧偶'] }
    ],
    attachments: [
      { name: '身份证正反面', required: true, example: '清晰、无遮挡、彩色扫描件' },
      { name: '学历证书', required: true, example: '毕业证 + 学位证' },
      { name: '离职证明', required: false, example: '前一家公司开具' },
      { name: '体检报告', required: true, example: '3 个月内有效' },
      { name: '近期 1 寸免冠彩照', required: true, example: '白底，用于员工档案' },
      { name: '银行卡正面', required: true }
    ],
    status: 1,
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00'
  },
  {
    id: 2,
    templateName: '高管入职资料清单',
    applicableJobFamily: '总监,副总裁,CEO',
    formFields: [
      { name: '紧急联系人姓名', type: 'text', required: true },
      { name: '紧急联系人电话', type: 'text', required: true },
      { name: '开户行', type: 'text', required: true },
      { name: '工资卡账号', type: 'text', required: true },
      { name: '居住地址', type: 'textarea', required: true },
      { name: '竞业限制声明', type: 'textarea', required: true }
    ],
    attachments: [
      { name: '身份证正反面', required: true },
      { name: '学历证书', required: true },
      { name: '离职证明', required: true },
      { name: '体检报告', required: true },
      { name: '竞业限制协议', required: true },
      { name: '前雇主推荐信（可选）', required: false }
    ],
    status: 1,
    createTime: '2026-03-12 10:00:00',
    updateTime: '2026-03-12 10:00:00'
  }
]

export const onboardingTemplateMock = createCrudMock<OnboardingTemplate>(onboardingTemplatesInit, {
  searchFields: ['templateName', 'applicableJobFamily']
})

// ============ 5. 招聘流程配置 ============
const processConfigInit: RecruitmentProcessConfig[] = [
  {
    id: 1,
    processName: '技术岗标准流程',
    applicableJobFamily: '前端,后端,测试,运维',
    stages: [
      { name: '简历初筛', defaultInterviewerRole: 'R_HR', slaDays: 2 },
      { name: '电话面试', defaultInterviewerRole: 'R_HR', slaDays: 3 },
      { name: '技术一面', defaultEvaluationTemplateId: 1, defaultInterviewerRole: 'R_DEPT_MANAGER', slaDays: 5 },
      { name: '技术二面', defaultEvaluationTemplateId: 1, defaultInterviewerRole: 'R_DEPT_MANAGER', slaDays: 5 },
      { name: 'HR 面', defaultInterviewerRole: 'R_HR', slaDays: 3 },
      { name: 'Offer 发放', defaultInterviewerRole: 'R_HR', slaDays: 3 }
    ],
    status: 1,
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00'
  },
  {
    id: 2,
    processName: '产品岗标准流程',
    applicableJobFamily: '产品经理,产品运营',
    stages: [
      { name: '简历初筛', defaultInterviewerRole: 'R_HR', slaDays: 2 },
      { name: '业务面', defaultEvaluationTemplateId: 2, defaultInterviewerRole: 'R_DEPT_MANAGER', slaDays: 5 },
      { name: '专业面', defaultEvaluationTemplateId: 2, defaultInterviewerRole: 'R_DEPT_MANAGER', slaDays: 5 },
      { name: 'HR 面', defaultInterviewerRole: 'R_HR', slaDays: 3 },
      { name: 'Offer 发放', defaultInterviewerRole: 'R_HR', slaDays: 3 }
    ],
    status: 1,
    createTime: '2026-03-12 10:00:00',
    updateTime: '2026-03-12 10:00:00'
  },
  {
    id: 3,
    processName: '高管招聘流程',
    applicableJobFamily: '总监,副总裁',
    stages: [
      { name: '候选人洽谈', defaultInterviewerRole: 'R_HR', slaDays: 7 },
      { name: '业务线面试', defaultEvaluationTemplateId: 3, defaultInterviewerRole: 'R_SUPER', slaDays: 10 },
      { name: 'CEO 面', defaultEvaluationTemplateId: 3, defaultInterviewerRole: 'R_SUPER', slaDays: 10 },
      { name: '背景调查', defaultInterviewerRole: 'R_HR', slaDays: 10 },
      { name: 'Offer 发放', defaultInterviewerRole: 'R_HR', slaDays: 5 }
    ],
    status: 1,
    createTime: '2026-03-14 10:00:00',
    updateTime: '2026-03-14 10:00:00'
  }
]

export const processConfigMock = createCrudMock<RecruitmentProcessConfig>(processConfigInit, {
  searchFields: ['processName', 'applicableJobFamily']
})

// ============ 6. 渠道账号管理 ============
const channelAccountsInit: ChannelAccount[] = [
  {
    id: 1,
    platform: 'boss',
    platformName: 'Boss直聘',
    accountName: 'XX公司企业版',
    accountStatus: 1,
    balance: 12000,
    publishCount: 156,
    lastSyncTime: '2026-04-19 23:00:00',
    remark: '主力招聘渠道，合约至 2026-12-31',
    createTime: '2025-12-01 10:00:00',
    updateTime: '2026-04-19 23:00:00'
  },
  {
    id: 2,
    platform: 'liepin',
    platformName: '猎聘网',
    accountName: 'XX公司猎头版',
    accountStatus: 1,
    balance: 8500,
    publishCount: 89,
    lastSyncTime: '2026-04-19 23:00:00',
    remark: '主要用于中高端岗位招聘',
    createTime: '2025-12-05 10:00:00',
    updateTime: '2026-04-19 23:00:00'
  },
  {
    id: 3,
    platform: 'zhilian',
    platformName: '智联招聘',
    accountName: 'XX公司基础版',
    accountStatus: 1,
    balance: 3200,
    publishCount: 67,
    lastSyncTime: '2026-04-19 23:00:00',
    remark: '广告位套餐，覆盖基础岗位',
    createTime: '2026-01-10 10:00:00',
    updateTime: '2026-04-19 23:00:00'
  },
  {
    id: 4,
    platform: '51job',
    platformName: '前程无忧',
    accountName: 'XX公司标准版',
    accountStatus: 2,
    balance: 0,
    publishCount: 42,
    lastSyncTime: '2026-04-10 10:00:00',
    remark: '账户余额不足，需充值',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-04-10 10:00:00'
  },
  {
    id: 5,
    platform: 'lagou',
    platformName: '拉勾网',
    accountName: 'XX公司技术版',
    accountStatus: 1,
    balance: 5000,
    publishCount: 35,
    lastSyncTime: '2026-04-19 23:00:00',
    remark: '主要用于互联网岗位招聘',
    createTime: '2026-01-20 10:00:00',
    updateTime: '2026-04-19 23:00:00'
  }
]

export const channelAccountMock = createCrudMock<ChannelAccount>(channelAccountsInit, {
  searchFields: ['platformName', 'accountName']
})
