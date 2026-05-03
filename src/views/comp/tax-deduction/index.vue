<template>
  <div class="page-container">
    <ModuleTabBar :tabs="taxTabs" />

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
import { specialDeductionMock } from '@/mock/comp/tax'
import { DEDUCTION_TYPE_LABEL } from '@/types/comp/tax'
import type { SpecialDeduction, SpecialDeductionType } from '@/types/comp/tax'
import EmployeeSelector from '@/components/core/hr/employee-selector.vue'
import { useEmployeeStore } from '@/store/modules/employee'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { taxTabs } from '@/views/comp/_shared/taxTabs'

defineOptions({ name: 'CompTaxDeduction' })

const empStore = useEmployeeStore()

const deductionCrud = createCrudApi<SpecialDeduction>({
  baseUrl: '/admin/comp/deduction',
  mockFns: specialDeductionMock
})

const deductions = ref<SpecialDeduction[]>([])
const deductionKeyword = ref('')

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const filteredDeductions = computed(() => {
  if (!deductionKeyword.value) return deductions.value
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

onMounted(fetchDeductions)
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-card {
  flex: 1;
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
</style>
