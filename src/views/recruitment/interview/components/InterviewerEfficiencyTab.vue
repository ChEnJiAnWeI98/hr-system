<template>
  <div class="interviewer-efficiency">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="统计周期">
            <el-select v-model="queryParams.period" style="width: 130px" @change="handlePeriodChange">
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年度" value="year" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="queryParams.period === 'custom'" label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="岗位族">
            <el-select v-model="queryParams.jobFamily" clearable placeholder="全部" style="width: 140px">
              <el-option label="技术研发" value="tech" />
              <el-option label="产品设计" value="product" />
              <el-option label="运营市场" value="ops" />
              <el-option label="职能支持" value="func" />
              <el-option label="管理岗位" value="mgmt" />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 绩效表 -->
    <el-card class="data-card">
      <div class="section-header">
        <div class="section-title">面试官绩效看板</div>
        <div class="section-hint">通过率参考 50% ~ 60% 为合理区间；过高/过低均可能存在评估偏差</div>
      </div>
      <div class="table-container">
        <el-table :data="interviewerData" height="100%" style="width: 100%" stripe>
          <el-table-column prop="interviewer" label="面试官" min-width="140" />
          <el-table-column prop="interviewCount" label="累计场次" min-width="110" align="right" />
          <el-table-column prop="passCount" label="通过" min-width="90" align="right" />
          <el-table-column prop="failCount" label="不通过" min-width="90" align="right" />
          <el-table-column label="通过率" min-width="180" align="center">
            <template #default="{ row }">
              <el-progress :percentage="row.passRate" :stroke-width="10" :color="getPassRateColor(row.passRate)" />
            </template>
          </el-table-column>
          <el-table-column prop="cancelCount" label="延期/取消" min-width="120" align="right" />
          <el-table-column label="平均评分" min-width="180" align="center">
            <template #default="{ row }">
              <el-rate v-model="row.avgRating" disabled show-score allow-half text-color="#ff9900" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getInterviewerEfficiency } from '@/api/recruitmentAnalytics'
import type { InterviewerEfficiencyRow, AnalyticsPeriod } from '@/types/recruitmentAnalytics'

defineOptions({ name: 'InterviewerEfficiencyTab' })

const queryParams = reactive({
  period: 'month' as AnalyticsPeriod,
  jobFamily: '' as string
})
const dateRange = ref<[string, string] | null>(null)
const interviewerData = ref<InterviewerEfficiencyRow[]>([])

const buildParams = () => {
  const params: any = { period: queryParams.period, jobFamily: queryParams.jobFamily || undefined }
  if (queryParams.period === 'custom' && dateRange.value) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  return params
}

const getPassRateColor = (rate: number) => {
  if (rate >= 50 && rate <= 65) return '#67c23a'
  if (rate >= 40 && rate < 75) return '#e6a23c'
  return '#f56c6c'
}

const loadData = async () => {
  const res = await getInterviewerEfficiency(buildParams())
  interviewerData.value = res.data
}

const handlePeriodChange = () => {
  if (queryParams.period !== 'custom') dateRange.value = null
}

const handleSearch = () => {
  if (queryParams.period === 'custom' && !dateRange.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  loadData()
}

const handleReset = () => {
  queryParams.period = 'month'
  queryParams.jobFamily = ''
  dateRange.value = null
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.interviewer-efficiency {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .filter-form-content {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .filter-buttons {
    display: flex;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}

.data-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .section-header {
    flex-shrink: 0;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .section-hint {
      font-size: 12px;
      color: #909399;
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>
