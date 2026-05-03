<template>
  <div class="page-container">
    <ModuleTabBar :tabs="welfareTabs" />

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { welfareProgramMock, welfareGrantMock } from '@/mock/comp/welfare'
import { GRANT_METHOD_LABEL, GRANT_STATUS_LABEL } from '@/types/comp/welfare'
import type { WelfareProgram, WelfareGrant } from '@/types/comp/welfare'
import { useDictStore } from '@/store/modules/dict'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { welfareTabs } from '@/views/comp/_shared/welfareTabs'

defineOptions({ name: 'CompWelfareGrant' })

const dictStore = useDictStore()

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

onMounted(fetchAll)
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
