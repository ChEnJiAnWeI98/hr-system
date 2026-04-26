/**
 * 字段脱敏工具（Phase 1.4）
 * 按敏感字段类型进行不同方式的脱敏显示
 */

/** 手机号脱敏：138****1234 */
export function maskMobile(v?: string): string {
  if (!v) return ''
  if (v.length < 7) return v
  return v.slice(0, 3) + '****' + v.slice(-4)
}

/** 身份证/护照号脱敏：110101********1234 */
export function maskCertificate(v?: string): string {
  if (!v) return ''
  if (v.length <= 10) return v.slice(0, 2) + '****' + v.slice(-2)
  return v.slice(0, 6) + '********' + v.slice(-4)
}

/** 住址脱敏：北京市朝阳***昆仑里小区 */
export function maskAddress(v?: string): string {
  if (!v) return ''
  if (v.length < 8) return v
  return v.slice(0, 4) + '***' + v.slice(-4)
}

/** 银行卡脱敏：****1234 */
export function maskBankCard(v?: string): string {
  if (!v) return ''
  return '****' + v.slice(-4)
}

/** 邮箱脱敏：f***@example.com */
export function maskEmail(v?: string): string {
  if (!v) return ''
  const [name, domain] = v.split('@')
  if (!domain) return v
  const masked = name.length <= 1 ? name : name[0] + '***'
  return `${masked}@${domain}`
}

/** 敏感字段类型 */
export type MaskType = 'mobile' | 'certificate' | 'address' | 'bank' | 'email'

/** 根据类型脱敏 */
export function mask(value: string | undefined, type: MaskType): string {
  if (!value) return ''
  switch (type) {
    case 'mobile':
      return maskMobile(value)
    case 'certificate':
      return maskCertificate(value)
    case 'address':
      return maskAddress(value)
    case 'bank':
      return maskBankCard(value)
    case 'email':
      return maskEmail(value)
    default:
      return value
  }
}

/** 敏感字段名清单（用于权限指令判断）*/
export const SENSITIVE_FIELDS = {
  mobile: ['mobile', 'emergencyMobile', 'emergencyContact.mobile'],
  certificate: ['certificateNo'],
  address: ['homeAddress'],
  bank: ['bankCardNo']
}

/** 薪酬字段清单（非 HR 整列隐藏）*/
export const SALARY_FIELDS = [
  'baseSalary',
  'positionSalary',
  'performanceBase',
  'socialBase',
  'monthlyBase',
  'totalSalary',
  'netSalary'
]
