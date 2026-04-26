/**
 * 基础字典（9 种）
 * 性别 / 教育程度 / 婚姻 / 政治面貌 / 民族 / 国籍 / 证件类型 / 紧急联系人关系 / 语言等级
 */
import type { DictEntry } from '@/types/system/dictionary'

/** 56 个民族（按国务院公布顺序） */
const NATION_ITEMS = [
  '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族',
  '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族',
  '哈萨克族', '傣族', '黎族', '傈僳族', '佤族', '畲族', '高山族', '拉祜族',
  '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族',
  '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族',
  '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族',
  '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
].map((name, idx) => ({
  value: `N${String(idx + 1).padStart(2, '0')}`,
  label: name,
  sortOrder: idx + 1,
  status: 1 as const
}))

export const BASIC_DICTS: DictEntry[] = [
  {
    dictCode: 'GENDER',
    dictName: '性别',
    dictGroup: 'basic',
    description: '员工性别',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 1,
    items: [
      { value: 'M', label: '男', sortOrder: 1, status: 1 },
      { value: 'F', label: '女', sortOrder: 2, status: 1 },
      { value: 'OTHER', label: '保密', sortOrder: 3, status: 1 }
    ]
  },
  {
    dictCode: 'EDUCATION',
    dictName: '教育程度',
    dictGroup: 'basic',
    description: '员工最高学历',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 2,
    items: [
      { value: 'primary', label: '小学', sortOrder: 1, status: 1 },
      { value: 'junior', label: '初中', sortOrder: 2, status: 1 },
      { value: 'senior', label: '高中', sortOrder: 3, status: 1 },
      { value: 'vocational', label: '中专', sortOrder: 4, status: 1 },
      { value: 'college', label: '大专', sortOrder: 5, status: 1 },
      { value: 'bachelor', label: '本科', sortOrder: 6, status: 1 },
      { value: 'master', label: '硕士', sortOrder: 7, status: 1 },
      { value: 'doctor', label: '博士', sortOrder: 8, status: 1 },
      { value: 'postdoc', label: '博士后', sortOrder: 9, status: 1 }
    ]
  },
  {
    dictCode: 'MARITAL_STATUS',
    dictName: '婚姻状况',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 3,
    items: [
      { value: 'single', label: '未婚', sortOrder: 1, status: 1 },
      { value: 'married', label: '已婚', sortOrder: 2, status: 1 },
      { value: 'divorced', label: '离异', sortOrder: 3, status: 1 },
      { value: 'widowed', label: '丧偶', sortOrder: 4, status: 1 },
      { value: 'secret', label: '保密', sortOrder: 5, status: 1 }
    ]
  },
  {
    dictCode: 'POLITICAL_STATUS',
    dictName: '政治面貌',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 4,
    items: [
      { value: 'mass', label: '群众', sortOrder: 1, status: 1 },
      { value: 'youth_league', label: '共青团员', sortOrder: 2, status: 1 },
      { value: 'cpc_member', label: '中共党员', sortOrder: 3, status: 1 },
      { value: 'cpc_probationary', label: '中共预备党员', sortOrder: 4, status: 1 },
      { value: 'democratic_party', label: '民主党派', sortOrder: 5, status: 1 },
      { value: 'other', label: '其他', sortOrder: 6, status: 1 }
    ]
  },
  {
    dictCode: 'NATION',
    dictName: '民族',
    dictGroup: 'basic',
    description: '56 个民族',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 5,
    items: NATION_ITEMS
  },
  {
    dictCode: 'NATIONALITY',
    dictName: '国籍',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 6,
    items: [
      { value: 'CN', label: '中国', sortOrder: 1, status: 1 },
      { value: 'HK', label: '中国香港', sortOrder: 2, status: 1 },
      { value: 'MO', label: '中国澳门', sortOrder: 3, status: 1 },
      { value: 'TW', label: '中国台湾', sortOrder: 4, status: 1 },
      { value: 'foreign', label: '外籍', sortOrder: 5, status: 1 }
    ]
  },
  {
    dictCode: 'CERTIFICATE_TYPE',
    dictName: '证件类型',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 7,
    items: [
      { value: 'id_card', label: '身份证', sortOrder: 1, status: 1 },
      { value: 'passport', label: '护照', sortOrder: 2, status: 1 },
      { value: 'hk_macau_pass', label: '港澳通行证', sortOrder: 3, status: 1 },
      { value: 'taiwan_pass', label: '台胞证', sortOrder: 4, status: 1 },
      { value: 'military', label: '军官证', sortOrder: 5, status: 1 },
      { value: 'other', label: '其他', sortOrder: 6, status: 1 }
    ]
  },
  {
    dictCode: 'EMERGENCY_RELATION',
    dictName: '紧急联系人关系',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 8,
    items: [
      { value: 'parent', label: '父母', sortOrder: 1, status: 1 },
      { value: 'spouse', label: '配偶', sortOrder: 2, status: 1 },
      { value: 'child', label: '子女', sortOrder: 3, status: 1 },
      { value: 'sibling', label: '兄弟姐妹', sortOrder: 4, status: 1 },
      { value: 'other', label: '其他', sortOrder: 5, status: 1 }
    ]
  },
  {
    dictCode: 'LANGUAGE_LEVEL',
    dictName: '语言等级',
    dictGroup: 'basic',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 9,
    items: [
      { value: 'native', label: '母语', sortOrder: 1, status: 1 },
      { value: 'fluent', label: '精通', sortOrder: 2, status: 1 },
      { value: 'proficient', label: '熟练', sortOrder: 3, status: 1 },
      { value: 'basic', label: '一般', sortOrder: 4, status: 1 },
      { value: 'beginner', label: '入门', sortOrder: 5, status: 1 }
    ]
  }
]
