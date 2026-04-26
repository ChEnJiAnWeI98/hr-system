<template>
  <div class="report-container">
    <!-- 顶部 KPI -->
    <div class="kpi-row">
      <el-card class="kpi-card">
        <div class="kpi-label">月度总人力成本</div>
        <div class="kpi-value primary">¥{{ formatAmount(currentStats.totalCost) }}</div>
        <div class="kpi-sub">应发 + 公司承担社保</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">月度应发总额</div>
        <div class="kpi-value">¥{{ formatAmount(currentStats.totalGross) }}</div>
        <div class="kpi-sub">{{ currentStats.totalEmployees }} 人</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">人均成本</div>
        <div class="kpi-value success">¥{{ formatAmount(currentStats.perCapita) }}</div>
        <div class="kpi-sub">月均</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">当月个税</div>
        <div class="kpi-value warning">¥{{ formatAmount(currentStats.totalTax) }}</div>
        <div class="kpi-sub">{{ ((currentStats.totalTax / currentStats.totalGross) * 100).toFixed(1) }}% of 应发</div>
      </el-card>
    </div>

    <!-- 部门成本分析 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">部门人力成本分析（{{ selectedPeriod }}）</div>
        <div>
          <el-select v-model="selectedBatchId" style="width: 200px" @change="buildStats">
            <el-option
              v-for="b in batches"
              :key="b.id"
              :label="`${b.period} 批次`"
              :value="b.id"
            />
          </el-select>
          <el-button plain style="margin-left: 12px" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出报表
          </el-button>
        </div>
      </div>
      <el-table :data="deptCostList" border>
        <el-table-column prop="orgName" label="部门" min-width="200" />
        <el-table-column label="人数" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.count }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="应发总额" width="160" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.gross) }}</template>
        </el-table-column>
        <el-table-column label="扣缴总额" width="140" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-warning)">¥{{ formatAmount(row.deduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发总额" width="160" align="right">
          <template #default="{ row }">
            <span style="color: var(--el-color-success); font-weight: 500">¥{{ formatAmount(row.net) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人均应发" width="140" align="right">
          <template #default="{ row }">
            ¥{{ formatAmount(Math.round(row.gross / row.count)) }}
          </template>
        </el-table-column>
        <el-table-column label="占比" min-width="160">
          <template #default="{ row }">
            <el-progress
              :percentage="row.ratio"
              :stroke-width="8"
              :format="() => `${row.ratio}%`"
              status="success"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 岗位族薪酬分位 -->
    <el-card class="data-card">
      <div class="section-head">
        <div class="section-title">岗位族薪酬分位（基于当前在职员工）</div>
      </div>
      <el-table :data="familyStatsList" border style="width: 100%">
        <el-table-column label="岗位族" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.family }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="在职人数" width="100" align="center">
          <template #default="{ row }">{{ row.count }}</template>
        </el-table-column>
        <el-table-column label="最低薪资" min-width="130" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.min) }}</template>
        </el-table-column>
        <el-table-column label="P25 分位" min-width="130" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.p25) }}</template>
        </el-table-column>
        <el-table-column label="P50 中位" min-width="130" align="right">
          <template #default="{ row }">
            <span style="font-weight: 500">¥{{ formatAmount(row.p50) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P75 分位" min-width="130" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.p75) }}</template>
        </el-table-column>
        <el-table-column label="最高薪资" min-width="130" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.max) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getPayrollBatchList, getBatchRecordsApi } from '@/api/comp'
import type { PayrollBatch, PayrollRecord } from '@/types/comp/payroll'
import { useEmployeeStore } from '@/store/modules/employee'

defineOptions({ name: 'CompReport' })

const empStore = useEmployeeStore()

const batches = ref<PayrollBatch[]>([])
const selectedBatchId = ref<number | null>(null)
const currentBatch = computed(() => batches.value.find((b) => b.id === selectedBatchId.value))
const selectedPeriod = computed(() => currentBatch.value?.period || '')
const records = ref<PayrollRecord[]>([])

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

/** KPI */
const currentStats = computed(() => {
  const total = records.value.length
  const totalGross = records.value.reduce((s, r) => s + r.grossAmount, 0)
  const totalDeduction = records.value.reduce((s, r) => s + r.deductionAmount, 0)
  const totalNet = records.value.reduce((s, r) => s + r.netAmount, 0)
  const totalTax = records.value.reduce((s, r) => {
    const taxItem = r.items.find((i) => i.code === 'income_tax')
    return s + (taxItem?.amount || 0)
  }, 0)
  // 公司承担的社保约为应发的 18%
  const companyCost = Math.round(totalGross * 0.18)
  return {
    totalEmployees: total,
    totalGross,
    totalDeduction,
    totalNet,
    totalTax,
    totalCost: totalGross + companyCost,
    perCapita: total > 0 ? Math.round((totalGross + companyCost) / total) : 0
  }
})

/** 部门成本分析 */
const deptCostList = computed(() => {
  const map = new Map<string, { orgName: string; count: number; gross: number; deduction: number; net: number }>()
  records.value.forEach((r) => {
    const key = r.orgName
    if (!map.has(key)) {
      map.set(key, { orgName: r.orgName, count: 0, gross: 0, deduction: 0, net: 0 })
    }
    const dept = map.get(key)!
    dept.count++
    dept.gross += r.grossAmount
    dept.deduction += r.deductionAmount
    dept.net += r.netAmount
  })
  const totalGross = currentStats.value.totalGross || 1
  return Array.from(map.values())
    .map((d) => ({ ...d, ratio: Math.round((d.gross / totalGross) * 100) }))
    .sort((a, b) => b.gross - a.gross)
})

/** 岗位族薪酬分位 */
const familyStatsList = computed(() => {
  const FAMILIES = [
    { code: 'TECH', label: '技术' },
    { code: 'PROD', label: '产品' },
    { code: 'SALES', label: '销售' },
    { code: 'OPS', label: '运营' },
    { code: 'FUNC', label: '职能' },
    { code: 'MGMT', label: '管理' }
  ]
  return FAMILIES.map((f) => {
    const salaries = empStore.employees
      .filter((e) => e.jobFamily === f.code && (e.baseSalary || 0) > 0)
      .map((e) => e.baseSalary!)
      .sort((a, b) => a - b)
    if (salaries.length === 0) {
      return { family: f.label, count: 0, min: 0, p25: 0, p50: 0, p75: 0, max: 0 }
    }
    const q = (p: number) => salaries[Math.floor(salaries.length * p)] || 0
    return {
      family: f.label,
      count: salaries.length,
      min: salaries[0],
      p25: q(0.25),
      p50: q(0.5),
      p75: q(0.75),
      max: salaries[salaries.length - 1]
    }
  }).filter((f) => f.count > 0)
})

const fetchBatches = async () => {
  const res: any = await getPayrollBatchList({ page: 1, pageSize: 100 })
  batches.value = res.data.list.sort((a: PayrollBatch, b: PayrollBatch) =>
    b.period.localeCompare(a.period)
  )
  if (batches.value.length) {
    selectedBatchId.value = batches.value[0].id
    await buildStats()
  }
}

const buildStats = async () => {
  if (!selectedBatchId.value) return
  const res: any = await getBatchRecordsApi(selectedBatchId.value)
  records.value = res.data
}

const handleExport = () => {
  ElMessage.info('Mock 环境：导出功能将在真实环境生成 Excel 报表（含部门成本 + 岗位族分位 + 月度对比）')
}

onMounted(fetchBatches)
</script>

<style scoped lang="scss">
.report-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .kpi-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 16px 20px;
    }
    .kpi-label {
      font-size: 13px;
      color: #909399;
    }
    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      margin-top: 6px;
      color: #303133;
      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
    }
    .kpi-sub {
      font-size: 12px;
      color: #c0c4cc;
      margin-top: 4px;
    }
  }

  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 20px;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .section-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
