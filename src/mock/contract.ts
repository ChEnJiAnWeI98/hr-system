import type {
  ContractTemplate,
  ContractTemplateQueryParams,
  ContractTemplateVersion,
  Contract,
  ContractQueryParams,
  ContractApprovalParams,
  ContractSignParams,
  ContractRenewParams,
  ContractChangeParams,
  ContractTerminateParams,
  ContractArchive,
  ContractArchiveQueryParams,
  ContractStatistics
} from '@/types/contract'
// 🔐 Phase 2.10 员工池对齐
import { alignEmployeeFields } from '@/utils/mock/alignEmployee'
// Wave 2 A 路线：合同由员工池动态生成（覆盖 200 员工 + 自动续签），与手写的 28 条样例合同合并
import { POOL_CONTRACTS } from '@/mock/core/employeePool'

// ==================== 合同模板 Mock 数据 ====================

let templates: ContractTemplate[] = [
  {
    id: 1,
    name: '标准劳动合同模板',
    type: 1,
    scope: '全体员工',
    content: `<h2>劳动合同</h2>
<p>甲方（用人单位）：{{公司名称}}</p>
<p>法定代表人：{{法定代表人}}</p>
<p>地址：{{公司地址}}</p>
<p>联系电话：{{公司电话}}</p>
<br>
<p>乙方（劳动者）：{{员工姓名}}</p>
<p>身份证号：{{身份证号}}</p>
<p>联系电话：{{联系电话}}</p>
<p>地址：{{家庭住址}}</p>
<br>
<p>根据《中华人民共和国劳动合同法》及有关法律、法规的规定，甲乙双方遵循合法、公平、平等自愿、协商一致、诚实信用的原则，订立本劳动合同。</p>
<br>
<h3>第一条 合同期限</h3>
<p>本合同为固定期限劳动合同，合同期限自{{开始日期}}起至{{结束日期}}止。</p>
<p>其中试用期为{{试用期}}个月，自{{开始日期}}起至试用期结束。</p>
<br>
<h3>第二条 工作内容和工作地点</h3>
<p>1. 乙方同意根据甲方工作需要，担任{{岗位名称}}岗位工作。</p>
<p>2. 工作地点：{{工作地点}}</p>
<p>3. 工作内容：{{工作内容}}</p>
<br>
<h3>第三条 工作时间和休息休假</h3>
<p>1. 甲方实行标准工时制度，每日工作8小时，每周工作40小时。</p>
<p>2. 乙方享有国家规定的法定节假日、年休假、婚假、产假等假期。</p>
<br>
<h3>第四条 劳动报酬</h3>
<p>1. 乙方月工资标准为：{{薪资标准}}</p>
<p>2. 甲方每月{{发薪日}}日前以货币形式支付乙方工资。</p>
<br>
<h3>第五条 社会保险</h3>
<p>甲乙双方按国家和地方有关规定参加社会保险。甲方为乙方办理有关社会保险手续，并承担相应社会保险义务。</p>
<br>
<h3>第六条 劳动保护、劳动条件和职业危害防护</h3>
<p>甲方根据生产岗位的需要，按照国家有关劳动安全、卫生的规定为乙方配备必要的安全防护措施，发放必要的劳动保护用品。</p>
<br>
<h3>第七条 合同的变更、解除和终止</h3>
<p>1. 经甲乙双方协商一致，可以变更本合同约定的内容。</p>
<p>2. 本合同的解除和终止按《劳动合同法》规定执行。</p>
<br>
<h3>第八条 违约责任</h3>
<p>甲乙双方违反本合同约定的，应承担相应的违约责任。</p>
<br>
<h3>第九条 其他</h3>
<p>本合同一式两份，甲乙双方各执一份，具有同等法律效力。</p>
<br>
<p>甲方（盖章）：</p>
<p>法定代表人（签字）：</p>
<p>日期：</p>
<br>
<p>乙方（签字）：</p>
<p>日期：</p>`,
    version: 'V1.0',
    status: 1,
    remark: '适用于所有正式员工',
    createBy: '系统管理员',
    createTime: '2024-01-15 10:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    name: '保密协议模板',
    type: 2,
    scope: '全体员工',
    content: `<h2>保密协议</h2>
<p>甲方（用人单位）：{{公司名称}}</p>
<p>乙方（员工）：{{员工姓名}}</p>
<p>工号：{{工号}}</p>
<br>
<p>鉴于乙方在甲方工作期间，可能接触、知悉甲方的商业秘密，为保护甲方的合法权益，根据《中华人民共和国劳动合同法》、《中华人民共和国反不正当竞争法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，订立本保密协议。</p>
<br>
<h3>第一条 保密内容</h3>
<p>本协议所称商业秘密，是指不为公众所知悉、能为甲方带来经济利益、具有实用性并经甲方采取保密措施的技术信息和经营信息，包括但不限于：</p>
<p>1. 技术信息：技术方案、工程设计、电路设计、制造方法、配方、工艺流程、技术指标、计算机软件、数据库、研究开发记录、技术报告、检测报告等；</p>
<p>2. 经营信息：客户名单、营销计划、采购资料、定价政策、财务资料、进货渠道等；</p>
<p>3. 其他商业秘密：甲方认为需要保密的其他信息。</p>
<br>
<h3>第二条 保密义务</h3>
<p>1. 乙方承诺在劳动合同期限内及离职后{{保密期限}}年内，对其在工作中接触、知悉的甲方商业秘密承担保密义务。</p>
<p>2. 未经甲方书面同意，乙方不得向任何第三方披露、泄露甲方的商业秘密。</p>
<p>3. 乙方不得利用甲方的商业秘密为自己或他人谋取利益。</p>
<br>
<h3>第三条 违约责任</h3>
<p>乙方违反本协议约定，泄露甲方商业秘密的，应承担违约责任，赔偿甲方因此遭受的全部损失。</p>
<br>
<p>甲方（盖章）：</p>
<p>日期：</p>
<br>
<p>乙方（签字）：</p>
<p>日期：</p>`,
    version: 'V1.0',
    status: 1,
    remark: '所有员工入职时签订',
    createBy: '系统管理员',
    createTime: '2024-01-15 10:30:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    id: 3,
    name: '竞业限制协议模板',
    type: 3,
    scope: '核心岗位员工',
    content: `<h2>竞业限制协议</h2>
<p>甲方（用人单位）：{{公司名称}}</p>
<p>乙方（员工）：{{员工姓名}}</p>
<p>工号：{{工号}}</p>
<p>岗位：{{岗位名称}}</p>
<br>
<p>鉴于乙方在甲方担任重要职务，掌握甲方的商业秘密，为保护甲方的合法权益，根据《中华人民共和国劳动合同法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，订立本竞业限制协议。</p>
<br>
<h3>第一条 竞业限制范围</h3>
<p>1. 乙方在劳动合同解除或终止后{{竞业限制期限}}年内，不得到与甲方生产或者经营同类产品、从事同类业务的有竞争关系的其他用人单位工作。</p>
<p>2. 乙方不得自己开业生产或者经营与甲方有竞争关系的同类产品、同类业务。</p>
<br>
<h3>第二条 竞业限制补偿</h3>
<p>在竞业限制期限内，甲方按月向乙方支付竞业限制补偿金，补偿金标准为乙方离职前12个月平均工资的{{补偿比例}}%。</p>
<br>
<h3>第三条 违约责任</h3>
<p>乙方违反本协议约定的，应当向甲方支付违约金{{违约金额}}元，并赔偿甲方因此遭受的全部损失。</p>
<br>
<p>甲方（盖章）：</p>
<p>日期：</p>
<br>
<p>乙方（签字）：</p>
<p>日期：</p>`,
    version: 'V1.0',
    status: 1,
    remark: '适用于核心技术岗位和高管',
    createBy: '系统管理员',
    createTime: '2024-01-15 11:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 11:00:00'
  },
  {
    id: 4,
    name: '培训协议模板',
    type: 4,
    scope: '参加专项培训的员工',
    content: `<h2>培训协议</h2>
<p>甲方（用人单位）：{{公司名称}}</p>
<p>乙方（员工）：{{员工姓名}}</p>
<p>工号：{{工号}}</p>
<br>
<p>甲方为提高乙方的专业技能和业务水平，决定对乙方进行专项培训。为明确双方的权利和义务，根据《中华人民共和国劳动合同法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，订立本培训协议。</p>
<br>
<h3>第一条 培训内容</h3>
<p>1. 培训项目：{{培训项目}}</p>
<p>2. 培训时间：{{培训时间}}</p>
<p>3. 培训地点：{{培训地点}}</p>
<p>4. 培训费用：{{培训费用}}元（含培训费、差旅费、住宿费等）</p>
<br>
<h3>第二条 服务期</h3>
<p>乙方接受培训后，应当为甲方服务满{{服务期限}}年。服务期自培训结束之日起计算。</p>
<br>
<h3>第三条 违约责任</h3>
<p>乙方违反服务期约定的，应当按照约定向甲方支付违约金。违约金的数额不得超过甲方提供的培训费用，且不得超过服务期尚未履行部分所应分摊的培训费用。</p>
<br>
<p>甲方（盖章）：</p>
<p>日期：</p>
<br>
<p>乙方（签字）：</p>
<p>日期：</p>`,
    version: 'V1.0',
    status: 1,
    remark: '参加专项培训时签订',
    createBy: '系统管理员',
    createTime: '2024-01-15 11:30:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 11:30:00'
  }
]

let templateNextId = 5

/**
 * 获取模板列表 Mock 函数
 */
export function getTemplateListMock(params: ContractTemplateQueryParams) {
  const { name, type, status, page = 1, pageSize = 20 } = params
  let filteredData = [...templates]

  // 筛选
  if (name) {
    filteredData = filteredData.filter(item => item.name.includes(name))
  }
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter(item => item.type === typeValue)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

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
 * 获取模板详情 Mock 函数
 */
export function getTemplateDetailMock(id: number) {
  return templates.find(item => item.id === id) || null
}

/**
 * 新增模板 Mock 函数
 */
export function addTemplateMock(data: Partial<ContractTemplate>) {
  const newTemplate: ContractTemplate = {
    id: templateNextId++,
    name: data.name || '',
    type: data.type || 1,
    scope: data.scope || '',
    content: data.content || '',
    version: 'V1.0',
    status: 1,
    remark: data.remark,
    createBy: '系统管理员',
    createTime: new Date().toLocaleString('zh-CN'),
    updateBy: '系统管理员',
    updateTime: new Date().toLocaleString('zh-CN')
  }
  templates.push(newTemplate)
  return newTemplate
}

/**
 * 更新模板 Mock 函数
 */
export function updateTemplateMock(data: Partial<ContractTemplate>) {
  const index = templates.findIndex(item => item.id === data.id)
  if (index !== -1) {
    // 版本号递增
    const currentVersion = templates[index].version
    const versionNum = parseFloat(currentVersion.replace('V', ''))
    const newVersion = `V${(versionNum + 0.1).toFixed(1)}`

    templates[index] = {
      ...templates[index],
      ...data,
      version: newVersion,
      updateBy: '系统管理员',
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return templates[index]
  }
  throw new Error('模板不存在')
}

/**
 * 删除模板 Mock 函数
 */
export function deleteTemplateMock(id: number) {
  const index = templates.findIndex(item => item.id === id)
  if (index !== -1) {
    templates.splice(index, 1)
    return true
  }
  throw new Error('模板不存在')
}

/**
 * 批量删除模板 Mock 函数
 */
export function batchDeleteTemplatesMock(ids: number[]) {
  templates = templates.filter(item => !ids.includes(item.id))
  return true
}

/**
 * 启用/停用模板 Mock 函数
 */
export function toggleTemplateStatusMock(id: number) {
  const index = templates.findIndex(item => item.id === id)
  if (index !== -1) {
    templates[index].status = templates[index].status === 1 ? 0 : 1
    templates[index].updateBy = '系统管理员'
    templates[index].updateTime = new Date().toLocaleString('zh-CN')
    return templates[index]
  }
  throw new Error('模板不存在')
}

/**
 * 获取模板版本列表 Mock 函数
 */
export function getTemplateVersionsMock(templateId: number) {
  const template = templates.find(item => item.id === templateId)
  if (!template) {
    throw new Error('模板不存在')
  }

  // 模拟版本历史
  const versions: ContractTemplateVersion[] = [
    {
      id: 1,
      templateId,
      version: 'V1.0',
      content: template.content,
      changeLog: '初始版本',
      isCurrent: template.version === 'V1.0',
      updateBy: '系统管理员',
      updateTime: '2024-01-15 10:00:00'
    }
  ]

  // 如果当前版本不是 V1.0，添加当前版本
  if (template.version !== 'V1.0') {
    versions.push({
      id: 2,
      templateId,
      version: template.version,
      content: template.content,
      changeLog: '更新合同条款',
      isCurrent: true,
      updateBy: template.updateBy || '系统管理员',
      updateTime: template.updateTime || new Date().toLocaleString('zh-CN')
    })
  }

  return versions
}

// ==================== 合同管理 Mock 数据 ====================

let contracts: Contract[] = [
  {
    id: 1,
    contractNo: 'HT202401001',
    employeeId: 1,
    employeeName: '张三',
    employeeNo: 'EMP001',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：张三</p>...',
    signDate: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2026-05-10',
    probationPeriod: 3,
    workLocation: '北京市朝阳区',
    workContent: '负责前端开发工作',
    salary: '月薪15000元',
    status: 4,
    signMethod: 1,
    attachments: [],
    createBy: '系统管理员',
    createTime: '2024-01-10 10:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    contractNo: 'HT202401002',
    employeeId: 2,
    employeeName: '李四',
    employeeNo: 'EMP002',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：李四</p>...',
    startDate: '2024-02-01',
    endDate: '2027-01-31',
    probationPeriod: 3,
    workLocation: '北京市海淀区',
    workContent: '负责后端开发工作',
    salary: '月薪18000元',
    status: 3,
    createBy: '系统管理员',
    createTime: '2024-01-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-25 16:00:00'
  },
  {
    id: 3,
    contractNo: 'HT202401003',
    employeeId: 3,
    employeeName: '王五',
    employeeNo: 'EMP003',
    department: '产品部',
    type: 2,
    templateId: 2,
    templateName: '保密协议模板',
    content: '<h2>保密协议</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（员工）：王五</p>...',
    signDate: '2024-01-20',
    startDate: '2024-01-20',
    endDate: '2026-05-05',
    workLocation: '北京市朝阳区',
    workContent: '负责产品经理工作',
    salary: '月薪16000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2024-01-15 11:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-20 15:00:00'
  },
  {
    id: 4,
    contractNo: 'HT202401004',
    employeeId: 4,
    employeeName: '赵六',
    employeeNo: 'EMP004',
    department: '人事部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：赵六</p>...',
    startDate: '2024-03-01',
    endDate: '2027-02-28',
    probationPeriod: 3,
    workLocation: '上海市浦东新区',
    workContent: '负责HR工作',
    salary: '月薪12000元',
    status: 2,
    createBy: '系统管理员',
    createTime: '2024-02-20 10:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-02-25 14:00:00'
  },
  {
    id: 5,
    contractNo: 'HT202401005',
    employeeId: 5,
    employeeName: '孙七',
    employeeNo: 'EMP005',
    department: '财务部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：孙七</p>...',
    signDate: '2022-06-15',
    startDate: '2022-06-15',
    endDate: '2024-01-10',
    probationPeriod: 3,
    workLocation: '杭州市西湖区',
    workContent: '负责会计工作',
    salary: '月薪13000元',
    status: 6,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-06-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-10 09:00:00'
  },
  {
    id: 6,
    contractNo: 'HT202401006',
    employeeId: 6,
    employeeName: '周八',
    employeeNo: 'EMP006',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：周八</p>...',
    signDate: '2023-07-10',
    startDate: '2023-07-10',
    endDate: '2026-07-09',
    probationPeriod: 3,
    workLocation: '成都市武侯区',
    workContent: '负责前端开发工作',
    salary: '月薪14000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-07-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-07-10 09:00:00'
  },
  {
    id: 7,
    contractNo: 'HT202401007',
    employeeId: 7,
    employeeName: '吴九',
    employeeNo: 'EMP007',
    department: '产品部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：吴九</p>...',
    signDate: '2023-08-15',
    startDate: '2023-08-15',
    endDate: '2026-08-14',
    probationPeriod: 3,
    workLocation: '武汉市洪山区',
    workContent: '负责产品经理工作',
    salary: '月薪17000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-08-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-08-15 09:00:00'
  },
  {
    id: 8,
    contractNo: 'HT202401008',
    employeeId: 8,
    employeeName: '郑十',
    employeeNo: 'EMP008',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：郑十</p>...',
    signDate: '2023-09-20',
    startDate: '2023-09-20',
    endDate: '2026-09-19',
    probationPeriod: 3,
    workLocation: '西安市雁塔区',
    workContent: '负责后端开发工作',
    salary: '月薪16000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-09-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-09-20 09:00:00'
  },
  {
    id: 9,
    contractNo: 'HT202401009',
    employeeId: 9,
    employeeName: '王十一',
    employeeNo: 'EMP009',
    department: '人事部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：王十一</p>...',
    signDate: '2024-01-10',
    startDate: '2024-01-10',
    endDate: '2027-01-09',
    probationPeriod: 3,
    workLocation: '南京市鼓楼区',
    workContent: '负责HR工作',
    salary: '月薪11000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2024-01-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-10 09:00:00'
  },
  {
    id: 10,
    contractNo: 'HT202401010',
    employeeId: 10,
    employeeName: '李十二',
    employeeNo: 'EMP010',
    department: '财务部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：李十二</p>...',
    signDate: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2027-01-14',
    probationPeriod: 3,
    workLocation: '天津市南开区',
    workContent: '负责会计工作',
    salary: '月薪12000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2024-01-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2024-01-15 09:00:00'
  },
  {
    id: 11,
    contractNo: 'HT202401011',
    employeeId: 11,
    employeeName: '张伟',
    employeeNo: 'EMP011',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：张伟</p>...',
    signDate: '2022-01-10',
    startDate: '2022-01-10',
    endDate: '2026-08-09',
    probationPeriod: 3,
    workLocation: '北京市海淀区',
    workContent: '负责技术管理工作',
    salary: '月薪25000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-01-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2022-01-10 09:00:00'
  },
  {
    id: 12,
    contractNo: 'HT202401012',
    employeeId: 12,
    employeeName: '王芳',
    employeeNo: 'EMP012',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：王芳</p>...',
    signDate: '2022-03-15',
    startDate: '2022-03-15',
    endDate: '2026-08-14',
    probationPeriod: 3,
    workLocation: '上海市浦东新区',
    workContent: '负责前端开发工作',
    salary: '月薪16000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-03-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2022-03-15 09:00:00'
  },
  {
    id: 13,
    contractNo: 'HT202401013',
    employeeId: 13,
    employeeName: '李明',
    employeeNo: 'EMP013',
    department: '前端组',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：李明</p>...',
    signDate: '2022-05-20',
    startDate: '2022-05-20',
    endDate: '2026-08-19',
    probationPeriod: 3,
    workLocation: '广州市天河区',
    workContent: '负责前端开发工作',
    salary: '月薪15000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-05-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2022-05-20 09:00:00'
  },
  {
    id: 14,
    contractNo: 'HT202401014',
    employeeId: 14,
    employeeName: '赵敏',
    employeeNo: 'EMP014',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：赵敏</p>...',
    signDate: '2022-07-10',
    startDate: '2022-07-10',
    endDate: '2023-05-14',
    probationPeriod: 3,
    workLocation: '深圳市南山区',
    workContent: '负责前端开发工作',
    salary: '月薪14000元',
    status: 5,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-07-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-05-14 16:00:00',
    remark: '已续签，新合同编号：HT202401024'
  },
  {
    id: 15,
    contractNo: 'HT202401015',
    employeeId: 15,
    employeeName: '孙杰',
    employeeNo: 'EMP015',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：孙杰</p>...',
    signDate: '2022-08-15',
    startDate: '2022-08-15',
    endDate: '2023-05-31',
    probationPeriod: 3,
    workLocation: '杭州市西湖区',
    workContent: '负责后端开发工作',
    salary: '月薪18000元',
    status: 5,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-08-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-05-31 16:00:00',
    remark: '已续签，新合同编号：HT202401025'
  },
  {
    id: 16,
    contractNo: 'HT202401016',
    employeeId: 16,
    employeeName: '周婷',
    employeeNo: 'EMP016',
    department: '后端组',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：周婷</p>...',
    signDate: '2022-09-20',
    startDate: '2022-09-20',
    endDate: '2023-07-09',
    probationPeriod: 3,
    workLocation: '南京市鼓楼区',
    workContent: '负责后端开发工作',
    salary: '月薪15000元',
    status: 5,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-09-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-07-09 16:00:00',
    remark: '已续签，新合同编号：HT202401026'
  },
  {
    id: 17,
    contractNo: 'HT202401017',
    employeeId: 17,
    employeeName: '吴磊',
    employeeNo: 'EMP017',
    department: '产品部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：吴磊</p>...',
    signDate: '2022-10-10',
    startDate: '2022-10-10',
    endDate: '2023-08-14',
    probationPeriod: 3,
    workLocation: '成都市武侯区',
    workContent: '负责产品经理工作',
    salary: '月薪16000元',
    status: 5,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-10-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-08-14 16:00:00',
    remark: '已续签，新合同编号：HT202401027'
  },
  {
    id: 18,
    contractNo: 'HT202401018',
    employeeId: 18,
    employeeName: '郑秀',
    employeeNo: 'EMP018',
    department: '产品部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：郑秀</p>...',
    signDate: '2022-11-15',
    startDate: '2022-11-15',
    endDate: '2023-09-19',
    probationPeriod: 3,
    workLocation: '武汉市武昌区',
    workContent: '负责产品经理工作',
    salary: '月薪15000元',
    status: 5,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-11-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-09-19 16:00:00',
    remark: '已续签，新合同编号：HT202401028'
  },
  {
    id: 19,
    contractNo: 'HT202401019',
    employeeId: 19,
    employeeName: '王涛',
    employeeNo: 'EMP019',
    department: '人事部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：王涛</p>...',
    signDate: '2022-12-01',
    startDate: '2022-12-01',
    endDate: '2026-11-30',
    probationPeriod: 3,
    workLocation: '西安市雁塔区',
    workContent: '负责HR管理工作',
    salary: '月薪18000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2022-12-01 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2022-12-01 09:00:00'
  },
  {
    id: 20,
    contractNo: 'HT202401020',
    employeeId: 20,
    employeeName: '李娜',
    employeeNo: 'EMP020',
    department: '人事部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：李娜</p>...',
    signDate: '2023-01-10',
    startDate: '2023-01-10',
    endDate: '2026-08-09',
    probationPeriod: 3,
    workLocation: '长沙市岳麓区',
    workContent: '负责HR工作',
    salary: '月薪11000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-01-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-01-10 09:00:00'
  },
  {
    id: 21,
    contractNo: 'HT202401021',
    employeeId: 21,
    employeeName: '张强',
    employeeNo: 'EMP021',
    department: '财务部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：张强</p>...',
    signDate: '2023-02-15',
    startDate: '2023-02-15',
    endDate: '2026-08-14',
    probationPeriod: 3,
    workLocation: '重庆市渝中区',
    workContent: '负责财务管理工作',
    salary: '月薪20000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-02-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-02-15 09:00:00'
  },
  {
    id: 22,
    contractNo: 'HT202401022',
    employeeId: 22,
    employeeName: '王丽',
    employeeNo: 'EMP022',
    department: '财务部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：王丽</p>...',
    signDate: '2023-03-20',
    startDate: '2023-03-20',
    endDate: '2026-08-19',
    probationPeriod: 3,
    workLocation: '天津市南开区',
    workContent: '负责会计工作',
    salary: '月薪13000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-03-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-03-20 09:00:00'
  },
  {
    id: 23,
    contractNo: 'HT202401023',
    employeeId: 23,
    employeeName: '刘洋',
    employeeNo: 'EMP023',
    department: '市场部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：刘洋</p>...',
    signDate: '2023-04-10',
    startDate: '2023-04-10',
    endDate: '2026-08-09',
    probationPeriod: 3,
    workLocation: '青岛市市南区',
    workContent: '负责市场管理工作',
    salary: '月薪17000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-04-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-04-10 09:00:00'
  },
  {
    id: 24,
    contractNo: 'HT202401024',
    employeeId: 14,
    employeeName: '赵敏',
    employeeNo: 'EMP014',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：赵敏</p>...',
    signDate: '2023-05-15',
    startDate: '2023-05-15',
    endDate: '2026-05-14',
    probationPeriod: 3,
    workLocation: '深圳市南山区',
    workContent: '负责前端开发工作',
    salary: '月薪16000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-05-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-05-15 09:00:00',
    remark: '续签合同，原合同编号：HT202401014'
  },
  {
    id: 25,
    contractNo: 'HT202401025',
    employeeId: 15,
    employeeName: '孙杰',
    employeeNo: 'EMP015',
    department: '技术部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：孙杰</p>...',
    signDate: '2023-06-01',
    startDate: '2023-06-01',
    endDate: '2026-05-31',
    probationPeriod: 3,
    workLocation: '杭州市西湖区',
    workContent: '负责后端开发工作',
    salary: '月薪20000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-06-01 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-06-01 09:00:00',
    remark: '续签合同，原合同编号：HT202401015'
  },
  {
    id: 26,
    contractNo: 'HT202401026',
    employeeId: 16,
    employeeName: '周婷',
    employeeNo: 'EMP016',
    department: '后端组',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：周婷</p>...',
    signDate: '2023-07-10',
    startDate: '2023-07-10',
    endDate: '2026-07-09',
    probationPeriod: 3,
    workLocation: '南京市鼓楼区',
    workContent: '负责后端开发工作',
    salary: '月薪17000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-07-10 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-07-10 09:00:00',
    remark: '续签合同，原合同编号：HT202401016'
  },
  {
    id: 27,
    contractNo: 'HT202401027',
    employeeId: 17,
    employeeName: '吴磊',
    employeeNo: 'EMP017',
    department: '产品部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：吴磊</p>...',
    signDate: '2023-08-15',
    startDate: '2023-08-15',
    endDate: '2026-08-14',
    probationPeriod: 3,
    workLocation: '成都市武侯区',
    workContent: '负责产品经理工作',
    salary: '月薪18000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-08-15 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-08-15 09:00:00',
    remark: '续签合同，原合同编号：HT202401017'
  },
  {
    id: 28,
    contractNo: 'HT202401028',
    employeeId: 18,
    employeeName: '郑秀',
    employeeNo: 'EMP018',
    department: '产品部',
    type: 1,
    templateId: 1,
    templateName: '标准劳动合同模板',
    content: '<h2>劳动合同</h2><p>甲方（用人单位）：某某科技有限公司</p><p>乙方（劳动者）：郑秀</p>...',
    signDate: '2023-09-20',
    startDate: '2023-09-20',
    endDate: '2026-09-19',
    probationPeriod: 3,
    workLocation: '武汉市武昌区',
    workContent: '负责产品经理工作',
    salary: '月薪17000元',
    status: 4,
    signMethod: 1,
    createBy: '系统管理员',
    createTime: '2023-09-20 09:00:00',
    updateBy: '系统管理员',
    updateTime: '2023-09-20 09:00:00',
    remark: '续签合同，原合同编号：HT202401018'
  }
]

// 🔐 Phase 2.10 员工池对齐（合同数据里的 employeeName/department 等字段同步到 200 员工池）
contracts = alignEmployeeFields(contracts)

// Wave 2 A 路线：合并员工池生成的合同（已对齐，无需再跑 alignEmployeeFields）
contracts = contracts.concat(POOL_CONTRACTS as unknown as Contract[])

// Wave 2 修复（2026-04-23）：补齐 contractType 字段（字典值），历史手写合同也缺此字段
// 规则：劳动合同类型（type=1）默认 'fixed' 固定期限；非劳动合同类型用对应字典值
const TYPE_NUM_TO_CONTRACT_TYPE: Record<number, string> = {
  1: 'fixed',      // 劳动合同 → 默认固定期限
  2: 'labor',      // 保密协议 → 归到劳务协议字典项
  3: 'labor',      // 竞业限制 → 归到劳务协议字典项
  4: 'intern',     // 培训协议 → 归到实习协议字典项
  5: 'labor'       // 其他 → 劳务协议
}
contracts = contracts.map((c) => ({
  ...c,
  contractType: (c as any).contractType || TYPE_NUM_TO_CONTRACT_TYPE[c.type] || 'fixed'
}))

let contractNextId = 1001 + POOL_CONTRACTS.length + 100 // 留 100 个缓冲，避免与池合同 id 冲突

/**
 * 获取合同列表 Mock 函数
 */
export function getContractListMock(params: ContractQueryParams) {
  const { employeeName, employeeNo, type, status, signDateStart, signDateEnd, page = 1, pageSize = 20 } = params
  let filteredData = [...contracts]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (employeeNo) {
    filteredData = filteredData.filter(item => item.employeeNo.includes(employeeNo))
  }
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter(item => item.type === typeValue)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (signDateStart) {
    filteredData = filteredData.filter(item => item.signDate && item.signDate >= signDateStart)
  }
  if (signDateEnd) {
    filteredData = filteredData.filter(item => item.signDate && item.signDate <= signDateEnd)
  }

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
 * 获取合同详情 Mock 函数
 */
export function getContractDetailMock(id: number) {
  return contracts.find(item => item.id === id) || null
}

/**
 * 新增合同 Mock 函数
 */
export function addContractMock(data: Partial<Contract>) {
  const newContract: Contract = {
    id: contractNextId++,
    contractNo: data.contractNo || `HT${new Date().getFullYear()}${String(contractNextId).padStart(5, '0')}`,
    employeeId: data.employeeId || 0,
    employeeName: data.employeeName || '',
    employeeNo: data.employeeNo || '',
    department: data.department || '',
    type: data.type || 1,
    templateId: data.templateId || 0,
    templateName: data.templateName || '',
    content: data.content || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    probationPeriod: data.probationPeriod,
    workLocation: data.workLocation || '',
    workContent: data.workContent || '',
    salary: data.salary || '',
    status: 1,
    remark: data.remark,
    createBy: '系统管理员',
    createTime: new Date().toLocaleString('zh-CN'),
    updateBy: '系统管理员',
    updateTime: new Date().toLocaleString('zh-CN')
  }
  contracts.push(newContract)
  return newContract
}

/**
 * 更新合同 Mock 函数
 */
export function updateContractMock(data: Partial<Contract>) {
  const index = contracts.findIndex(item => item.id === data.id)
  if (index !== -1) {
    contracts[index] = {
      ...contracts[index],
      ...data,
      updateBy: '系统管理员',
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return contracts[index]
  }
  throw new Error('合同不存在')
}

/**
 * 删除合同 Mock 函数
 */
export function deleteContractMock(id: number) {
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    contracts.splice(index, 1)
    return true
  }
  throw new Error('合同不存在')
}

/**
 * 提交审批 Mock 函数
 */
export function submitContractMock(id: number) {
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    if (contracts[index].status !== 1) {
      throw new Error('只有草稿状态的合同才能提交审批')
    }
    contracts[index].status = 2
    contracts[index].updateBy = '系统管理员'
    contracts[index].updateTime = new Date().toLocaleString('zh-CN')
    return contracts[index]
  }
  throw new Error('合同不存在')
}

/**
 * 审批合同 Mock 函数
 */
export function approveContractMock(params: ContractApprovalParams) {
  const { id, result, opinion } = params
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    if (contracts[index].status !== 2) {
      throw new Error('只有待审批状态的合同才能审批')
    }
    if (result === 1) {
      contracts[index].status = 3
    } else {
      contracts[index].status = 1
    }
    contracts[index].remark = opinion
    contracts[index].updateBy = '系统管理员'
    contracts[index].updateTime = new Date().toLocaleString('zh-CN')
    return contracts[index]
  }
  throw new Error('合同不存在')
}

/**
 * 签订合同 Mock 函数
 */
export function signContractMock(params: ContractSignParams) {
  const { id, signMethod, signDate, attachments, remark } = params
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    if (contracts[index].status !== 3) {
      throw new Error('只有待签订状态的合同才能签订')
    }
    contracts[index].status = 4
    contracts[index].signMethod = signMethod
    contracts[index].signDate = signDate
    contracts[index].attachments = attachments
    contracts[index].remark = remark
    contracts[index].updateBy = '系统管理员'
    contracts[index].updateTime = new Date().toLocaleString('zh-CN')
    return contracts[index]
  }
  throw new Error('合同不存在')
}

/**
 * 续签合同 Mock 函数
 */
export function renewContractMock(params: ContractRenewParams) {
  const { id, contractNo, startDate, endDate, salary, workLocation, workContent, reason, remark } = params
  const oldContract = contracts.find(item => item.id === id)
  if (!oldContract) {
    throw new Error('原合同不存在')
  }
  if (oldContract.status !== 4 && oldContract.status !== 7) {
    throw new Error('只有生效中或已到期的合同才能续签')
  }

  // 更新原合同状态为已续签
  const oldIndex = contracts.findIndex(item => item.id === id)
  contracts[oldIndex].status = 5
  contracts[oldIndex].updateBy = '系统管理员'
  contracts[oldIndex].updateTime = new Date().toLocaleString('zh-CN')

  // 创建新合同
  const newContract: Contract = {
    id: contractNextId++,
    contractNo,
    employeeId: oldContract.employeeId,
    employeeName: oldContract.employeeName,
    employeeNo: oldContract.employeeNo,
    department: oldContract.department,
    type: oldContract.type,
    templateId: oldContract.templateId,
    templateName: oldContract.templateName,
    content: oldContract.content,
    startDate,
    endDate,
    workLocation,
    workContent,
    salary,
    status: 1,
    remark: `续签原因：${reason}${remark ? `\n备注：${remark}` : ''}`,
    createBy: '系统管理员',
    createTime: new Date().toLocaleString('zh-CN'),
    updateBy: '系统管理员',
    updateTime: new Date().toLocaleString('zh-CN')
  }
  contracts.push(newContract)
  return newContract
}

/**
 * 变更合同 Mock 函数
 */
export function changeContractMock(params: ContractChangeParams) {
  const { id, changeType, beforeChange, afterChange, reason, effectiveDate, remark } = params
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    if (contracts[index].status !== 4) {
      throw new Error('只有生效中的合同才能变更')
    }
    // 根据变更类型更新对应字段
    if (changeType === 1) {
      contracts[index].salary = afterChange
    } else if (changeType === 3) {
      contracts[index].workLocation = afterChange
    }
    contracts[index].remark = `变更原因：${reason}\n变更前：${beforeChange}\n变更后：${afterChange}\n生效日期：${effectiveDate}${remark ? `\n备注：${remark}` : ''}`
    contracts[index].updateBy = '系统管理员'
    contracts[index].updateTime = new Date().toLocaleString('zh-CN')
    return contracts[index]
  }
  throw new Error('合同不存在')
}

/**
 * 终止合同 Mock 函数
 */
export function terminateContractMock(params: ContractTerminateParams) {
  const { id, terminateType, reason, terminateDate, hasCompensation, compensationAmount, remark } = params
  const index = contracts.findIndex(item => item.id === id)
  if (index !== -1) {
    if (contracts[index].status !== 4) {
      throw new Error('只有生效中的合同才能终止')
    }
    contracts[index].status = 6
    contracts[index].remark = `终止类型：${terminateType}\n终止原因：${reason}\n终止日期：${terminateDate}\n经济补偿：${hasCompensation ? `是，金额：${compensationAmount}元` : '否'}${remark ? `\n备注：${remark}` : ''}`
    contracts[index].updateBy = '系统管理员'
    contracts[index].updateTime = new Date().toLocaleString('zh-CN')
    return contracts[index]
  }
  throw new Error('合同不存在')
}

// ==================== 合同归档 Mock 数据 ====================

let archives: ContractArchive[] = [
  {
    id: 1,
    contractId: 1,
    contractNo: 'HT202301001',
    employeeId: 10,
    employeeName: '李十二',
    employeeNo: 'EMP010',
    department: '财务部',
    type: 1,
    signDate: '2023-01-15',
    startDate: '2023-01-15',
    endDate: '2024-01-14',
    archiveDate: '2024-01-20',
    archiveReason: '合同到期',
    archiveBy: '系统管理员'
  },
  {
    id: 2,
    contractId: 5,
    contractNo: 'HT202401005',
    employeeId: 5,
    employeeName: '孙七',
    employeeNo: 'EMP005',
    department: '财务部',
    type: 1,
    signDate: '2022-06-15',
    startDate: '2022-06-15',
    endDate: '2024-01-10',
    archiveDate: '2024-01-15',
    archiveReason: '员工离职',
    archiveBy: '系统管理员'
  }
]

// 🔐 Phase 2.10 员工池对齐
archives = alignEmployeeFields(archives)

let archiveNextId = 3

/**
 * 获取归档列表 Mock 函数
 */
export function getArchiveListMock(params: ContractArchiveQueryParams) {
  const { employeeName, employeeNo, type, archiveDateStart, archiveDateEnd, page = 1, pageSize = 20 } = params
  let filteredData = [...archives]

  // 筛选
  if (employeeName) {
    filteredData = filteredData.filter(item => item.employeeName.includes(employeeName))
  }
  if (employeeNo) {
    filteredData = filteredData.filter(item => item.employeeNo.includes(employeeNo))
  }
  if (type !== undefined && type !== null && type !== '') {
    const typeValue = typeof type === 'string' ? parseInt(type) : type
    filteredData = filteredData.filter(item => item.type === typeValue)
  }
  if (archiveDateStart) {
    filteredData = filteredData.filter(item => item.archiveDate >= archiveDateStart)
  }
  if (archiveDateEnd) {
    filteredData = filteredData.filter(item => item.archiveDate <= archiveDateEnd)
  }

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
 * 归档合同 Mock 函数
 */
export function archiveContractMock(id: number, reason: string) {
  const contract = contracts.find(item => item.id === id)
  if (!contract) {
    throw new Error('合同不存在')
  }
  if (contract.status !== 5 && contract.status !== 6 && contract.status !== 7) {
    throw new Error('只有已续签、已终止或已到期的合同才能归档')
  }

  // 更新合同状态为已归档
  const contractIndex = contracts.findIndex(item => item.id === id)
  contracts[contractIndex].status = 8
  contracts[contractIndex].updateBy = '系统管理员'
  contracts[contractIndex].updateTime = new Date().toLocaleString('zh-CN')

  // 创建归档记录
  const archive: ContractArchive = {
    id: archiveNextId++,
    contractId: contract.id,
    contractNo: contract.contractNo,
    employeeId: contract.employeeId,
    employeeName: contract.employeeName,
    employeeNo: contract.employeeNo,
    department: contract.department,
    type: contract.type,
    signDate: contract.signDate || '',
    startDate: contract.startDate,
    endDate: contract.endDate,
    archiveDate: new Date().toISOString().split('T')[0],
    archiveReason: reason,
    archiveBy: '系统管理员'
  }
  archives.push(archive)
  return archive
}

// ==================== 合同统计 Mock 数据 ====================

/**
 * 获取合同统计数据 Mock 函数
 */
export function getContractStatisticsMock(): ContractStatistics {
  const today = new Date()
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const endOfYear = new Date(today.getFullYear(), 11, 31)

  // 即将到期合同数（30天内）
  const expiringSoon = contracts.filter(item => {
    if (item.status !== 4) return false
    const endDate = new Date(item.endDate)
    return endDate >= today && endDate <= thirtyDaysLater
  }).length

  // 本月到期合同数
  const expiringThisMonth = contracts.filter(item => {
    if (item.status !== 4) return false
    const endDate = new Date(item.endDate)
    return endDate >= today && endDate <= endOfMonth
  }).length

  // 本年到期合同数
  const expiringThisYear = contracts.filter(item => {
    if (item.status !== 4) return false
    const endDate = new Date(item.endDate)
    return endDate >= today && endDate <= endOfYear
  }).length

  // 合同总数
  const total = contracts.length

  // 生效中合同数
  const active = contracts.filter(item => item.status === 4).length

  // 待审批合同数
  const pending = contracts.filter(item => item.status === 2).length

  // 按类型统计
  const byType = [
    { type: 1, typeName: '劳动合同', count: 0 },
    { type: 2, typeName: '保密协议', count: 0 },
    { type: 3, typeName: '竞业限制协议', count: 0 },
    { type: 4, typeName: '培训协议', count: 0 },
    { type: 5, typeName: '其他', count: 0 }
  ]
  contracts.forEach(item => {
    const typeItem = byType.find(t => t.type === item.type)
    if (typeItem) {
      typeItem.count++
    }
  })

  // 按状态统计
  const byStatus = [
    { status: 1, statusName: '草稿', count: 0 },
    { status: 2, statusName: '待审批', count: 0 },
    { status: 3, statusName: '待签订', count: 0 },
    { status: 4, statusName: '生效中', count: 0 },
    { status: 5, statusName: '已续签', count: 0 },
    { status: 6, statusName: '已终止', count: 0 },
    { status: 7, statusName: '已到期', count: 0 },
    { status: 8, statusName: '已归档', count: 0 }
  ]
  contracts.forEach(item => {
    const statusItem = byStatus.find(s => s.status === item.status)
    if (statusItem) {
      statusItem.count++
    }
  })

  // 合同类型分布
  const typeDistribution = [
    { type: 1, typeName: '劳动合同', count: 0, percentage: 0 },
    { type: 2, typeName: '保密协议', count: 0, percentage: 0 },
    { type: 3, typeName: '竞业限制协议', count: 0, percentage: 0 },
    { type: 4, typeName: '培训协议', count: 0, percentage: 0 },
    { type: 5, typeName: '其他', count: 0, percentage: 0 }
  ]
  contracts.forEach(item => {
    const typeItem = typeDistribution.find(t => t.type === item.type)
    if (typeItem) {
      typeItem.count++
    }
  })
  typeDistribution.forEach(item => {
    item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
  })

  // 合同续签率统计（最近6个月）
  const renewalRate = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const totalExpired = Math.floor(Math.random() * 10) + 5
    const renewed = Math.floor(totalExpired * (0.7 + Math.random() * 0.2))
    const rate = totalExpired > 0 ? Math.round((renewed / totalExpired) * 100) : 0
    renewalRate.push({ month, totalExpired, renewed, rate })
  }

  // 合同数量趋势（最近12个月）
  const trend = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const count = Math.floor(Math.random() * 20) + 10
    trend.push({ month, count })
  }

  return {
    expiringSoon,
    expiringThisMonth,
    expiringThisYear,
    total,
    active,
    pending,
    byType,
    byStatus,
    typeDistribution,
    renewalRate,
    trend
  }
}

/**
 * 获取即将到期合同列表 Mock 函数
 */
export function getExpiringContractsMock(days: number = 30) {
  const today = new Date()
  const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  return contracts
    .filter(item => {
      if (item.status !== 4) return false
      const endDate = new Date(item.endDate)
      return endDate >= today && endDate <= targetDate
    })
    .map(item => {
      const endDate = new Date(item.endDate)
      const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      return {
        id: item.id,
        contractNo: item.contractNo,
        employeeName: item.employeeName,
        employeeNo: item.employeeNo,
        department: item.department,
        type: item.type,
        endDate: item.endDate,
        remainingDays
      }
    })
    .sort((a, b) => a.remainingDays - b.remainingDays)
}


/**
 * Phase 3.7 - 按员工 ID 获取合同历史
 */
export function getContractsByEmployeeMock(employeeId: number) {
  return contracts
    .filter((c) => c.employeeId === employeeId)
    .sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''))
}

