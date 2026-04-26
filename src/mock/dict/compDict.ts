/**
 * 薪酬福利字典（3 种）
 * 薪资项 / 社保项 / 福利项
 */
import type { DictEntry } from '@/types/system/dictionary'

export const COMP_DICTS: DictEntry[] = [
  {
    dictCode: 'SALARY_ITEM',
    dictName: '薪资项',
    dictGroup: 'comp',
    description: '工资条构成项',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 1,
    items: [
      { value: 'base_salary', label: '基本工资', sortOrder: 1, status: 1, extra: { direction: 'addition', mandatory: true } },
      { value: 'position_salary', label: '岗位工资', sortOrder: 2, status: 1, extra: { direction: 'addition', mandatory: true } },
      { value: 'performance_salary', label: '绩效工资', sortOrder: 3, status: 1, extra: { direction: 'addition', mandatory: false } },
      { value: 'overtime_pay', label: '加班费', sortOrder: 4, status: 1, extra: { direction: 'addition', mandatory: false } },
      { value: 'meal_allowance', label: '餐补', sortOrder: 5, status: 1, extra: { direction: 'addition' } },
      { value: 'transport_allowance', label: '交通补贴', sortOrder: 6, status: 1, extra: { direction: 'addition' } },
      { value: 'comm_allowance', label: '通讯补贴', sortOrder: 7, status: 1, extra: { direction: 'addition' } },
      { value: 'bonus', label: '奖金', sortOrder: 8, status: 1, extra: { direction: 'addition' } },
      { value: 'income_tax', label: '个人所得税', sortOrder: 9, status: 1, extra: { direction: 'deduction', mandatory: true } },
      { value: 'social_self', label: '社保个人部分', sortOrder: 10, status: 1, extra: { direction: 'deduction', mandatory: true } },
      { value: 'fund_self', label: '公积金个人部分', sortOrder: 11, status: 1, extra: { direction: 'deduction', mandatory: true } }
    ]
  },
  {
    dictCode: 'SOCIAL_ITEM',
    dictName: '社保公积金项',
    dictGroup: 'comp',
    isSystem: true,
    editable: false,
    status: 1,
    sortOrder: 2,
    items: [
      { value: 'pension', label: '养老保险', sortOrder: 1, status: 1, extra: { personalRate: 0.08, companyRate: 0.16 } },
      { value: 'medical', label: '医疗保险', sortOrder: 2, status: 1, extra: { personalRate: 0.02, companyRate: 0.10 } },
      { value: 'unemployment', label: '失业保险', sortOrder: 3, status: 1, extra: { personalRate: 0.005, companyRate: 0.005 } },
      { value: 'injury', label: '工伤保险', sortOrder: 4, status: 1, extra: { personalRate: 0, companyRate: 0.005 } },
      { value: 'maternity', label: '生育保险', sortOrder: 5, status: 1, extra: { personalRate: 0, companyRate: 0.008 } },
      { value: 'housing_fund', label: '住房公积金', sortOrder: 6, status: 1, extra: { personalRate: 0.12, companyRate: 0.12 } }
    ]
  },
  {
    dictCode: 'WELFARE_ITEM',
    dictName: '福利项',
    dictGroup: 'comp',
    isSystem: true,
    editable: true,
    status: 1,
    sortOrder: 3,
    items: [
      { value: 'festival', label: '节日福利', sortOrder: 1, status: 1 },
      { value: 'birthday', label: '生日福利', sortOrder: 2, status: 1 },
      { value: 'health_check', label: '体检', sortOrder: 3, status: 1 },
      { value: 'travel', label: '员工旅游', sortOrder: 4, status: 1 },
      { value: 'insurance', label: '商业保险', sortOrder: 5, status: 1 },
      { value: 'family', label: '家庭关爱', sortOrder: 6, status: 1 },
      { value: 'annual_dinner', label: '年会/团建', sortOrder: 7, status: 1 }
    ]
  }
]
