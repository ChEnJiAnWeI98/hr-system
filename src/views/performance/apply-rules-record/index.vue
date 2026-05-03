<template>
  <div class="page-container">
    <ModuleTabBar :tabs="applyRulesTabs" />

    <!-- KPI 卡片 -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">规则总数</div>
        <div class="kpi-value">{{ stats.totalRules || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">启用中</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.activeRules || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">执行记录</div>
        <div class="kpi-value">{{ stats.totalRecords || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待确认</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.pendingCount || 0 }}</div>
      </el-card>
    </div>

    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="状态">
          <el-select v-model="recordFilters.downstreamStatus" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="(s, k) in DOWNSTREAM_STATUS_MAP" :key="k" :label="s.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="recordFilters.category" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="(c, k) in RULE_CATEGORY_MAP" :key="k" :label="c.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工">
          <el-input v-model="recordFilters.employeeName" placeholder="姓名" style="width: 160px" clearable />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="data-card">
      <el-table :data="filteredRecords" stripe>
        <el-table-column prop="executeTime" label="执行时间" width="170" />
        <el-table-column prop="ruleName" label="规则" min-width="200" />
        <el-table-column label="类别" width="130" align="center">
          <template #default="{ row }">
            <el-tag :style="{ background: RULE_CATEGORY_MAP[row.category].color, color: '#fff', border: 'none' }" size="small">
              {{ RULE_CATEGORY_MAP[row.category].icon }} {{ RULE_CATEGORY_MAP[row.category].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="员工" width="100" />
        <el-table-column prop="context" label="触发上下文" min-width="220" show-overflow-tooltip />
        <el-table-column prop="executedAction" label="执行结果" min-width="260" show-overflow-tooltip />
        <el-table-column label="下游状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="DOWNSTREAM_STATUS_MAP[row.downstreamStatus].type" size="small">
              {{ DOWNSTREAM_STATUS_MAP[row.downstreamStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="confirmedBy" label="确认人" width="110" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.downstreamStatus === 'pending'" link type="success" @click="handleConfirm(row, true)">
              确认
            </el-button>
            <el-button v-if="row.downstreamStatus === 'pending'" link type="danger" @click="handleConfirm(row, false)">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRuleRecords,
  confirmRecord,
  getApplyStats
} from '@/api/performanceApplyRule'
import type { RuleExecutionRecord } from '@/types/performanceApplyRule'
import {
  RULE_CATEGORY_MAP,
  DOWNSTREAM_STATUS_MAP
} from '@/types/performanceApplyRule'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { applyRulesTabs } from '@/views/performance/_shared/applyRulesTabs'

defineOptions({ name: 'PerformanceApplyRulesRecord' })

const records = ref<RuleExecutionRecord[]>([])
const stats = ref<any>({})

const recordFilters = reactive({
  downstreamStatus: '' as string,
  category: '' as string,
  employeeName: ''
})

const filteredRecords = computed(() =>
  records.value.filter(
    (r) =>
      (!recordFilters.downstreamStatus || r.downstreamStatus === recordFilters.downstreamStatus) &&
      (!recordFilters.category || r.category === recordFilters.category) &&
      (!recordFilters.employeeName || r.employeeName.includes(recordFilters.employeeName))
  )
)

const loadData = async () => {
  const rec = await getRuleRecords({ pageSize: 200 })
  records.value = (rec.data?.list || []).sort((a: any, b: any) => b.executeTime.localeCompare(a.executeTime))
  const s = await getApplyStats()
  stats.value = s.data
}

const handleConfirm = async (row: RuleExecutionRecord, approved: boolean) => {
  try {
    const msg = approved
      ? `确认执行「${row.ruleName}」？（${row.employeeName}）`
      : `确定拒绝「${row.ruleName}」的执行？`
    await ElMessageBox.confirm(msg, approved ? '确认执行' : '拒绝执行', { type: approved ? 'info' : 'warning' })
    await confirmRecord(row.id, approved)
    ElMessage.success(approved ? '已确认' : '已拒绝')
    loadData()
  } catch {}
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card,
.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.filter-card {
  flex-shrink: 0;
  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}
</style>
