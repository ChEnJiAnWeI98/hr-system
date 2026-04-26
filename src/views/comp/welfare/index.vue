<template>
  <div class="welfare-container">
    <el-tabs v-model="activeTab" class="welfare-tabs">
      <!-- Tab 1 福利项配置 -->
      <el-tab-pane label="福利项配置" name="programs">
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
      </el-tab-pane>

      <!-- Tab 2 发放记录 -->
      <el-tab-pane label="发放记录" name="grants">
        <el-card class="info-card">
          <div class="section-head">
            <div class="section-title">福利发放记录（{{ filteredGrants.length }} 条）</div>
            <div>
              <el-input
                v-model="grantKeyword"
                placeholder="搜索员工/福利"
                clearable
                style="width: 220px"
              />
              <el-select v-model="filterCategory" placeholder="类型" clearable style="width: 140px; margin-left: 12px">
                <el-option
                  v-for="p in programs"
                  :key="p.category"
                  :label="dictStore.getLabel('WELFARE_ITEM', p.category)"
                  :value="p.category"
                />
              </el-select>
            </div>
          </div>
          <el-table :data="filteredGrants" border style="width: 100%">
            <el-table-column prop="programName" label="福利项" width="140" />
            <el-table-column label="类型" width="120" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="categoryColor(row.category)">
                  {{ dictStore.getLabel('WELFARE_ITEM', row.category) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="employeeName" label="员工" width="110" />
            <el-table-column prop="orgName" label="组织" min-width="140" show-overflow-tooltip />
            <el-table-column label="金额/价值" width="130" align="right">
              <template #default="{ row }">
                <span style="color: var(--el-color-success)">¥{{ formatAmount(row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发放方式" width="100" align="center">
              <template #default="{ row }">
                {{ GRANT_METHOD_LABEL[row.grantMethod as WelfareGrant['grantMethod']] }}
              </template>
            </el-table-column>
            <el-table-column prop="grantTime" label="发放时间" width="160" />
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 'granted' ? 'success' : row.status === 'pending' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ GRANT_STATUS_LABEL[row.status as WelfareGrant['status']] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { welfareProgramMock, welfareGrantMock } from '@/mock/comp/welfare'
import {
  FREQUENCY_LABEL,
  GRANT_METHOD_LABEL,
  GRANT_STATUS_LABEL
} from '@/types/comp/welfare'
import type { WelfareProgram, WelfareGrant } from '@/types/comp/welfare'
import DictSelector from '@/components/core/hr/dict-selector.vue'
import { useDictStore } from '@/store/modules/dict'

defineOptions({ name: 'CompWelfare' })

const dictStore = useDictStore()
const activeTab = ref('programs')

const programCrud = createCrudApi<WelfareProgram>({
  baseUrl: '/admin/comp/welfare-program',
  mockFns: welfareProgramMock
})
const grantCrud = createCrudApi<WelfareGrant>({
  baseUrl: '/admin/comp/welfare-grant',
  mockFns: welfareGrantMock
})

const programs = ref<WelfareProgram[]>([])
const grants = ref<WelfareGrant[]>([])
const grantKeyword = ref('')
const filterCategory = ref<string>('')

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

const filteredGrants = computed(() => {
  let list = [...grants.value]
  if (grantKeyword.value) {
    list = list.filter(
      (g) =>
        g.employeeName.includes(grantKeyword.value) ||
        g.programName.includes(grantKeyword.value)
    )
  }
  if (filterCategory.value) {
    list = list.filter((g) => g.category === filterCategory.value)
  }
  return list.sort((a, b) => b.grantTime.localeCompare(a.grantTime))
})

const fetchAll = async () => {
  const [p, g] = await Promise.all([
    programCrud.getList({ page: 1, pageSize: 50 }),
    grantCrud.getList({ page: 1, pageSize: 500 })
  ])
  programs.value = (p as any).data.list
  grants.value = (g as any).data.list
}

// 福利项 CRUD
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
  fetchAll()
}

const handleDeleteProgram = (row: WelfareProgram) => {
  ElMessageBox.confirm(`确定删除"${row.name}"吗？`, '提示', { type: 'warning' }).then(async () => {
    await programCrud.delete(row.id)
    ElMessage.success('删除成功')
    fetchAll()
  })
}

onMounted(fetchAll)
</script>

<style scoped lang="scss">
.welfare-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;

  .welfare-tabs :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    padding: 0 16px;
    border-radius: 12px;
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
