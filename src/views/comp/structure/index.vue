<template>
  <div class="structure-container">
    <el-card class="filter-card">
      <div class="filter-row">
        <div>
          <span class="filter-label">年度：</span>
          <el-select v-model="year" style="width: 120px">
            <el-option :label="2026" :value="2026" />
            <el-option :label="2025" :value="2025" />
          </el-select>
        </div>
        <div>
          <span class="filter-label">岗位族：</span>
          <el-radio-group v-model="currentFamily">
            <el-radio-button
              v-for="f in JOB_FAMILIES"
              :key="f.code"
              :value="f.code"
            >
              {{ f.icon }} {{ f.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>

    <el-card class="data-card">
      <div class="header">
        <div class="header-title">薪酬带宽（{{ currentFamilyLabel }} · {{ year }}）</div>
        <el-tag type="info" size="default" effect="plain">
          共 {{ bandsOfCurrentFamily.length }} 档
        </el-tag>
      </div>

      <el-table :data="bandsOfCurrentFamily" border size="default" style="width: 100%">
        <el-table-column prop="level" label="职级" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="plain" size="default">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下限" width="130" align="right">
          <template #default="{ row }">
            <span style="color: #909399">¥{{ formatAmount(row.minSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中位" width="130" align="right">
          <template #default="{ row }">
            <span style="font-weight: 500">¥{{ formatAmount(row.midSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上限" width="130" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-success)">¥{{ formatAmount(row.maxSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="带宽可视化" min-width="280">
          <template #default="{ row }">
            <div class="band-bar">
              <div class="band-track">
                <div class="band-range" :style="{ left: '0%', right: '0%' }"></div>
                <div class="band-mid" :style="{ left: '50%' }"></div>
              </div>
              <div class="band-labels">
                <span>¥{{ formatAmount(row.minSalary) }}</span>
                <span>¥{{ formatAmount(row.midSalary) }}</span>
                <span>¥{{ formatAmount(row.maxSalary) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="本级员工数" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ countByBand(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="平均薪资" width="130" align="right">
          <template #default="{ row }">
            <span v-if="rbacStore.canViewSalary">
              ¥{{ formatAmount(avgSalaryByBand(row)) }}
            </span>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="分位情况" width="180" align="center">
          <template #default="{ row }">
            <span v-if="rbacStore.canViewSalary">
              <el-progress
                :percentage="getBandUtilization(row)"
                :stroke-width="6"
                :status="getBandUtilization(row) > 100 ? 'exception' : 'success'"
                :format="(p: number) => `${p}%`"
              />
            </span>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
      </el-table>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        style="margin-top: 16px"
        title="💡 说明"
        description="薪酬带宽按「岗位族 × 职级」定义。带宽可视化展示 min/mid/max 三档，中位（mid）通常为招聘时的目标水平。"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSalaryBandList } from '@/api/comp'
import type { SalaryBand } from '@/types/comp/structure'
import type { JobFamilyCode } from '@/types/org/position'
import { useEmployeeStore } from '@/store/modules/employee'
import { useRBACStore } from '@/store/modules/rbac'

defineOptions({ name: 'CompStructure' })

const empStore = useEmployeeStore()
const rbacStore = useRBACStore()

const JOB_FAMILIES: { code: JobFamilyCode; label: string; icon: string }[] = [
  { code: 'TECH', label: '技术', icon: '💻' },
  { code: 'PROD', label: '产品', icon: '📋' },
  { code: 'SALES', label: '销售', icon: '💼' },
  { code: 'OPS', label: '运营', icon: '📣' },
  { code: 'FUNC', label: '职能', icon: '🏢' },
  { code: 'MGMT', label: '管理', icon: '👔' }
]

const year = ref(2026)
const currentFamily = ref<JobFamilyCode>('TECH')
const allBands = ref<SalaryBand[]>([])

const currentFamilyLabel = computed(
  () => JOB_FAMILIES.find((f) => f.code === currentFamily.value)?.label || ''
)

const bandsOfCurrentFamily = computed(() => {
  return allBands.value
    .filter((b) => b.jobFamily === currentFamily.value && b.year === year.value)
    .sort((a, b) => a.level.localeCompare(b.level, 'en', { numeric: true }))
})

const fetchBands = async () => {
  const res: any = await getSalaryBandList({ page: 1, pageSize: 200 })
  allBands.value = res.data.list
}

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const countByBand = (band: SalaryBand) => {
  return empStore.employees.filter(
    (e) =>
      e.jobFamily === band.jobFamily &&
      e.level === band.level &&
      (e.status === 'regular' || e.status === 'probation')
  ).length
}

const avgSalaryByBand = (band: SalaryBand) => {
  const members = empStore.employees.filter(
    (e) =>
      e.jobFamily === band.jobFamily &&
      e.level === band.level &&
      (e.baseSalary || 0) > 0
  )
  if (members.length === 0) return 0
  return Math.round(members.reduce((s, e) => s + (e.baseSalary || 0), 0) / members.length)
}

const getBandUtilization = (band: SalaryBand) => {
  const avg = avgSalaryByBand(band)
  if (avg === 0 || band.midSalary === 0) return 0
  return Math.round((avg / band.midSalary) * 100)
}

onMounted(fetchBands)
</script>

<style scoped lang="scss">
.structure-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .filter-card,
  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .filter-card :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .filter-row {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .filter-label {
    color: #606266;
    margin-right: 8px;
  }

  .data-card {
    flex: 1;
    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .header-title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.band-bar {
  width: 100%;
  padding: 4px 0;

  .band-track {
    position: relative;
    height: 8px;
    background: #f0f2f5;
    border-radius: 4px;

    .band-range {
      position: absolute;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
      border-radius: 4px;
    }

    .band-mid {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 12px;
      background: #303133;
      transform: translateX(-50%);
    }
  }

  .band-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 11px;
    color: #909399;
  }
}
</style>
