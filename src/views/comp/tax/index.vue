<template>
  <div class="tax-container">
    <el-tabs v-model="activeTab" class="tax-tabs">
      <!-- Tab 1 累进税率表 -->
      <el-tab-pane label="累进税率表" name="brackets">
        <el-card class="info-card">
          <div class="section-head">
            <div class="section-title">居民综合所得个人所得税税率表（年度 2026）</div>
            <el-tag type="info" effect="plain">起征点 ¥{{ TAX_THRESHOLD }} / 月</el-tag>
          </div>
          <el-table :data="TAX_BRACKETS" border style="width: 100%">
            <el-table-column label="级数" width="80" align="center" type="index" />
            <el-table-column label="年度应纳税所得额" min-width="240">
              <template #default="{ row }">
                <span v-if="row.max === Infinity">超过 ¥{{ formatAmount(row.min) }}</span>
                <span v-else>¥{{ formatAmount(row.min) }} ~ ¥{{ formatAmount(row.max) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="税率" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="bracketColor(row.rate)" size="small">
                  {{ (row.rate * 100).toFixed(0) }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="速算扣除数" width="160" align="right">
              <template #default="{ row }">¥{{ formatAmount(row.quickDeduction) }}</template>
            </el-table-column>
          </el-table>
          <el-alert
            type="info"
            show-icon
            :closable="false"
            style="margin-top: 16px"
            title="个税计算公式"
          >
            <template #default>
              <div style="line-height: 1.8">
                <code>应纳税所得额 = 月工资 − 起征点 5000 − 社保公积金 − 专项附加扣除</code><br />
                <code>应纳税额（年度）= 应纳税所得额 × 12 × 税率 − 速算扣除数</code><br />
                <code>月个税 = 年度应纳税额 / 12</code>
              </div>
            </template>
          </el-alert>
        </el-card>
      </el-tab-pane>

      <!-- Tab 2 专项附加扣除登记 -->
      <el-tab-pane label="专项附加扣除" name="deductions">
        <el-card class="info-card">
          <div class="section-head">
            <div>
              <div class="section-title">员工专项附加扣除登记</div>
              <div style="font-size: 12px; color: #909399; margin-top: 4px">
                支持 6 类：子女教育 / 继续教育 / 大病医疗 / 住房贷款 / 住房租金 / 赡养老人
              </div>
            </div>
            <div>
              <el-input
                v-model="deductionKeyword"
                placeholder="搜索员工"
                clearable
                style="width: 220px"
              />
              <el-button
                type="primary"
                style="margin-left: 12px"
                @click="handleAddDeduction"
              >
                <el-icon><Plus /></el-icon>
                新增扣除
              </el-button>
            </div>
          </div>

          <el-table :data="filteredDeductions" border style="width: 100%">
            <el-table-column prop="employeeName" label="员工" width="120" fixed />
            <el-table-column label="扣除类型" width="160">
              <template #default="{ row }">
                <el-tag size="small" :type="deductionColor(row.type)">
                  {{ DEDUCTION_TYPE_LABEL[row.type as SpecialDeductionType] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="月扣除金额" width="130" align="right">
              <template #default="{ row }">
                <span style="color: var(--el-color-success)">¥{{ formatAmount(row.monthlyAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年度" width="90" align="center">
              <template #default="{ row }">{{ row.year }}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? '有效' : '失效' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="登记时间" width="160" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button link @click="handleEditDeduction(row)">编辑</el-button>
                <el-button link type="danger" @click="handleDeleteDeduction(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 3 年度汇算清缴 -->
      <el-tab-pane label="年度汇算" name="settlement">
        <el-card class="info-card">
          <div class="section-head">
            <div class="section-title">2025 年度个税汇算清缴</div>
            <el-tag type="warning" effect="plain">
              待汇算 {{ pendingSettlement.length }} 人 / 已汇算 {{ settledCount }} 人
            </el-tag>
          </div>
          <el-table :data="settlements" border style="width: 100%">
            <el-table-column prop="employeeName" label="员工" width="120" fixed />
            <el-table-column label="年度收入总额" min-width="160" align="right">
              <template #default="{ row }">¥{{ formatAmount(row.totalIncome) }}</template>
            </el-table-column>
            <el-table-column label="专项附加扣除" min-width="160" align="right">
              <template #default="{ row }">¥{{ formatAmount(row.totalSpecialDeduction) }}</template>
            </el-table-column>
            <el-table-column label="已缴税款" width="140" align="right">
              <template #default="{ row }">¥{{ formatAmount(row.totalPaid) }}</template>
            </el-table-column>
            <el-table-column label="应补/退税" width="140" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.settlement > 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
                  {{ row.settlement > 0 ? '补税' : '退税' }} ¥{{ formatAmount(Math.abs(row.settlement)) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'settled' ? 'success' : 'warning'" size="small">
                  {{ row.status === 'settled' ? '已汇算' : '待汇算' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-alert
            type="info"
            :closable="false"
            show-icon
            style="margin-top: 16px"
            title="💡 年度汇算清缴说明"
            description="根据税法规定，员工在次年 3~6 月进行上一年度的个税汇算清缴。系统自动计算应补/退税，员工可在个税 APP 或由 HR 代办申报。"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑 Dialog -->
    <el-dialog v-model="deductionDialogVisible" :title="deductionForm.id ? '编辑扣除' : '新增扣除'" width="520px">
      <el-form :model="deductionForm" label-width="120px">
        <el-form-item label="员工">
          <EmployeeSelector v-model="deductionForm.employeeId" @change="onEmployeeChange" />
        </el-form-item>
        <el-form-item label="扣除类型">
          <el-select v-model="deductionForm.type" style="width: 100%" @change="onTypeChange">
            <el-option
              v-for="(label, value) in DEDUCTION_TYPE_LABEL"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="月扣除金额">
          <el-input v-model.number="deductionForm.monthlyAmount" placeholder="元" />
        </el-form-item>
        <el-form-item label="生效年度">
          <el-input v-model.number="deductionForm.year" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="deductionForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deductionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitDeduction">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { specialDeductionMock, yearSettlementMock } from '@/mock/comp/tax'
import {
  TAX_BRACKETS,
  TAX_THRESHOLD,
  DEDUCTION_TYPE_LABEL
} from '@/types/comp/tax'
import type { SpecialDeduction, SpecialDeductionType, YearTaxSettlement } from '@/types/comp/tax'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'

defineOptions({ name: 'CompTax' })

const empStore = useEmployeeStore()

const activeTab = ref('brackets')
const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const bracketColor = (rate: number): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  if (rate <= 0.1) return 'success'
  if (rate <= 0.2) return 'primary'
  if (rate <= 0.3) return 'warning'
  return 'danger'
}

// === Deductions ===
const deductionCrud = createCrudApi<SpecialDeduction>({
  baseUrl: '/admin/comp/deduction',
  mockFns: specialDeductionMock
})

const deductions = ref<SpecialDeduction[]>([])
const deductionKeyword = ref('')

const filteredDeductions = computed(() => {
  if (!deductionKeyword.value) return deductions.value
  const k = deductionKeyword.value.toLowerCase()
  return deductions.value.filter((d) => d.employeeName.includes(deductionKeyword.value))
})

const fetchDeductions = async () => {
  const res: any = await deductionCrud.getList({ page: 1, pageSize: 500 })
  deductions.value = res.data.list
}

const deductionColor = (type: SpecialDeductionType): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const m: Record<SpecialDeductionType, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    child_education: 'primary',
    continuing_education: 'primary',
    serious_illness: 'danger',
    housing_loan: 'warning',
    housing_rent: 'warning',
    elder_support: 'success'
  }
  return m[type] || 'info'
}

// === 扣除 Dialog ===
const deductionDialogVisible = ref(false)
const deductionForm = reactive<Partial<SpecialDeduction>>({})

const handleAddDeduction = () => {
  Object.keys(deductionForm).forEach((k) => delete (deductionForm as any)[k])
  Object.assign(deductionForm, {
    employeeId: undefined,
    employeeName: '',
    type: 'child_education' as SpecialDeductionType,
    monthlyAmount: 2000,
    year: 2026,
    status: 'active',
    remark: ''
  })
  deductionDialogVisible.value = true
}

const handleEditDeduction = (row: SpecialDeduction) => {
  Object.keys(deductionForm).forEach((k) => delete (deductionForm as any)[k])
  Object.assign(deductionForm, JSON.parse(JSON.stringify(row)))
  deductionDialogVisible.value = true
}

const onEmployeeChange = (id: number) => {
  deductionForm.employeeName = empStore.getById(id)?.nameZh || ''
}

const onTypeChange = (type: SpecialDeductionType) => {
  const defaults: Record<SpecialDeductionType, number> = {
    child_education: 2000,
    continuing_education: 400,
    serious_illness: 0,
    housing_loan: 1000,
    housing_rent: 1500,
    elder_support: 3000
  }
  deductionForm.monthlyAmount = defaults[type]
}

const handleSubmitDeduction = async () => {
  if (!deductionForm.employeeId) {
    ElMessage.warning('请选择员工')
    return
  }
  if (deductionForm.id) {
    await deductionCrud.update(deductionForm as any)
    ElMessage.success('更新成功')
  } else {
    await deductionCrud.add(deductionForm as any)
    ElMessage.success('新增成功')
  }
  deductionDialogVisible.value = false
  fetchDeductions()
}

const handleDeleteDeduction = (row: SpecialDeduction) => {
  ElMessageBox.confirm(`确定删除 ${row.employeeName} 的"${DEDUCTION_TYPE_LABEL[row.type]}"扣除项？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deductionCrud.delete(row.id)
    ElMessage.success('删除成功')
    fetchDeductions()
  })
}

// === 年度汇算 ===
const settlementCrud = createCrudApi<YearTaxSettlement>({
  baseUrl: '/admin/comp/tax-settlement',
  mockFns: yearSettlementMock
})

const settlements = ref<YearTaxSettlement[]>([])
const pendingSettlement = computed(() => settlements.value.filter((s) => s.status === 'pending'))
const settledCount = computed(() => settlements.value.filter((s) => s.status === 'settled').length)

const fetchSettlements = async () => {
  const res: any = await settlementCrud.getList({ page: 1, pageSize: 200 })
  settlements.value = res.data.list
}

onMounted(() => {
  fetchDeductions()
  fetchSettlements()
})
</script>

<style scoped lang="scss">
.tax-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;

  .tax-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 16px;
      background: #fff;
      padding: 0 16px;
      border-radius: 12px;
    }
  }

  .info-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>
