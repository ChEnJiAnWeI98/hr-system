<template>
  <div class="page-container">
    <ModuleTabBar :tabs="welfareTabs" />

    <el-card class="info-card">
      <div class="section-head">
        <div class="section-title">福利项（{{ programs.length }} 项）</div>
        <el-button type="primary" @click="handleAddProgram">
          <el-icon><Plus /></el-icon>
          新增福利项
        </el-button>
      </div>
      <el-table :data="programs" border style="width: 100%">
        <el-table-column prop="code" label="编码" width="140" />
        <el-table-column prop="name" label="福利名称" width="140" />
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="categoryColor(row.category)">
              {{ dictStore.getLabel('WELFARE_ITEM', row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="年度预算" width="140" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.budgetAmount) }}</template>
        </el-table-column>
        <el-table-column label="频率" width="100" align="center">
          <template #default="{ row }">
            {{ FREQUENCY_LABEL[row.frequency as WelfareProgram['frequency']] }}
          </template>
        </el-table-column>
        <el-table-column label="适用范围" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">
              {{ row.scope === 'all' ? '全员' : row.scope === 'byLevel' ? '按职级' : '按岗位族' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleEditProgram(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDeleteProgram(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 福利项编辑 Dialog -->
    <el-dialog v-model="programDialogVisible" :title="programForm.id ? '编辑福利项' : '新增福利项'" width="560px">
      <el-form :model="programForm" label-width="120px">
        <el-form-item label="编码">
          <el-input v-model="programForm.code" />
        </el-form-item>
        <el-form-item label="福利名称">
          <el-input v-model="programForm.name" />
        </el-form-item>
        <el-form-item label="类型">
          <DictSelector v-model="programForm.category" dict-code="WELFARE_ITEM" />
        </el-form-item>
        <el-form-item label="年度预算">
          <el-input v-model.number="programForm.budgetAmount" />
        </el-form-item>
        <el-form-item label="频率">
          <el-select v-model="programForm.frequency" style="width: 100%">
            <el-option
              v-for="(label, value) in FREQUENCY_LABEL"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="programForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="programDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProgram">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { welfareProgramMock } from '@/mock/comp/welfare'
import { FREQUENCY_LABEL } from '@/types/comp/welfare'
import type { WelfareProgram } from '@/types/comp/welfare'
import DictSelector from '@/components/core/hr/dict-selector.vue'
import { useDictStore } from '@/store/modules/dict'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { welfareTabs } from '@/views/comp/_shared/welfareTabs'

defineOptions({ name: 'CompWelfareProgram' })

const dictStore = useDictStore()
const programs = ref<WelfareProgram[]>([])

const programCrud = createCrudApi<WelfareProgram>({
  baseUrl: '/admin/comp/welfare-program',
  mockFns: welfareProgramMock
})

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const categoryColor = (category: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const m: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    festival: 'danger',
    birthday: 'warning',
    health_check: 'success',
    travel: 'primary',
    insurance: 'info',
    family: 'primary',
    annual_dinner: 'warning'
  }
  return m[category] || 'info'
}

const fetchPrograms = async () => {
  const res = await programCrud.getList({ page: 1, pageSize: 50 })
  programs.value = (res as any).data.list
}

// CRUD
const programDialogVisible = ref(false)
const programForm = reactive<Partial<WelfareProgram>>({})

const handleAddProgram = () => {
  Object.keys(programForm).forEach((k) => delete (programForm as any)[k])
  Object.assign(programForm, {
    code: '',
    name: '',
    category: 'festival',
    budgetAmount: 100000,
    scope: 'all',
    frequency: 'annually',
    description: '',
    status: 1
  })
  programDialogVisible.value = true
}

const handleEditProgram = (row: WelfareProgram) => {
  Object.keys(programForm).forEach((k) => delete (programForm as any)[k])
  Object.assign(programForm, JSON.parse(JSON.stringify(row)))
  programDialogVisible.value = true
}

const handleSubmitProgram = async () => {
  if (!programForm.name || !programForm.code) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (programForm.id) {
    await programCrud.update(programForm as any)
    ElMessage.success('更新成功')
  } else {
    await programCrud.add(programForm as any)
    ElMessage.success('新增成功')
  }
  programDialogVisible.value = false
  fetchPrograms()
}

const handleDeleteProgram = (row: WelfareProgram) => {
  ElMessageBox.confirm(`确定删除"${row.name}"吗？`, '提示', { type: 'warning' }).then(async () => {
    await programCrud.delete(row.id)
    ElMessage.success('删除成功')
    fetchPrograms()
  })
}

onMounted(fetchPrograms)
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
