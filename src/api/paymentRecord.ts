import { createCrudApi } from '@/utils/crud'
import type { PaymentRecord } from '@/types/socialSecurity'
import { paymentRecordMock } from '@/mock/paymentRecord'

export const {
  getList: getPaymentRecordList,
  getDetail: getPaymentRecordDetail,
  add: addPaymentRecord,
  update: updatePaymentRecord,
  remove: removePaymentRecord
} = createCrudApi<PaymentRecord>({
  baseUrl: '/admin/social-security/payment-record',
  mockFns: paymentRecordMock
})
