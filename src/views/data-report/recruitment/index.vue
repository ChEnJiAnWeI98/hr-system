<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="统计周期">
            <el-select v-model="queryParams.period" placeholder="请选择统计周期" style="width: 150px">
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
              style="width: 240px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
              <el-button @click="handleExport">
                <el-icon><Download /></el-icon>
                导出报表
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 统计卡片行 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #409eff">
            <i class="iconfont-sys" v-html="'&#xe7ae;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">简历投递</div>
            <div class="overview-value">{{ statistics.resumeSubmitted }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">简历筛选</div>
            <div class="overview-value">{{ statistics.resumeScreened }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #e6a23c">
            <i class="iconfont-sys" v-html="'&#xe88a;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">面试安排</div>
            <div class="overview-value">{{ statistics.interviewScheduled }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #f56c6c">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">Offer发放</div>
            <div class="overview-value">{{ statistics.offerSent }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #909399">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">入职确认</div>
            <div class="overview-value">{{ statistics.onboarded }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表卡片 -->
    <el-card class="chart-card">
      <div class="chart-header">
        <span class="chart-title">招聘漏斗分析</span>
      </div>
      <div class="chart-content">
        <div class="funnel-chart">
          <div ref="chartRef" class="chart-container"></div>
        </div>
        <div class="conversion-table">
          <el-table :data="conversionData" border height="100%">
            <el-table-column prop="stage" label="转化阶段" min-width="12%" />
            <el-table-column prop="count" label="人数" min-width="8%" align="center" />
            <el-table-column prop="rate" label="转化率" align="center">
              <template #default="{ row }">
                <span :style="{ color: getRateColor(row.rate) }">{{ row.rate }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getRecruitmentFunnel, exportReport } from '@/api/data-report'

defineOptions({
  name: 'DataReportRecruitment'
})

// 查询参数
const queryParams = ref({
  period: 'month'
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 统计数据
const statistics = ref({
  resumeSubmitted: 0,
  resumeScreened: 0,
  interviewScheduled: 0,
  offerSent: 0,
  onboarded: 0
})

// 转化率数据
const conversionData = ref<Array<{ stage: string; count: number; rate: string }>>([])

// 图表实例
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: statistics.value.resumeSubmitted, name: '简历投递' },
          { value: statistics.value.resumeScreened, name: '简历筛选' },
          { value: statistics.value.interviewScheduled, name: '面试安排' },
          { value: statistics.value.offerSent, name: 'Offer发放' },
          { value: statistics.value.onboarded, name: '入职确认' }
        ]
      }
    ]
  }

  chartInstance.setOption(option)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption({
    series: [
      {
        data: [
          { value: statistics.value.resumeSubmitted, name: '简历投递' },
          { value: statistics.value.resumeScreened, name: '简历筛选' },
          { value: statistics.value.interviewScheduled, name: '面试安排' },
          { value: statistics.value.offerSent, name: 'Offer发放' },
          { value: statistics.value.onboarded, name: '入职确认' }
        ]
      }
    ]
  })
}

// 计算转化率数据
const calculateConversionData = () => {
  const { resumeSubmitted, resumeScreened, interviewScheduled, offerSent, onboarded } =
    statistics.value

  conversionData.value = [
    {
      stage: '简历投递 → 简历筛选',
      count: resumeScreened,
      rate:
        resumeSubmitted > 0 ? `${((resumeScreened / resumeSubmitted) * 100).toFixed(2)}%` : '0%'
    },
    {
      stage: '简历筛选 → 面试安排',
      count: interviewScheduled,
      rate:
        resumeScreened > 0
          ? `${((interviewScheduled / resumeScreened) * 100).toFixed(2)}%`
          : '0%'
    },
    {
      stage: '面试安排 → Offer发放',
      count: offerSent,
      rate:
        interviewScheduled > 0 ? `${((offerSent / interviewScheduled) * 100).toFixed(2)}%` : '0%'
    },
    {
      stage: 'Offer发放 → 入职确认',
      count: onboarded,
      rate: offerSent > 0 ? `${((onboarded / offerSent) * 100).toFixed(2)}%` : '0%'
    }
  ]
}

// 获取转化率颜色
const getRateColor = (rate: string) => {
  const value = parseFloat(rate)
  if (value >= 60) return '#67c23a'
  if (value >= 40) return '#e6a23c'
  return '#f56c6c'
}

// 加载数据
const loadData = async () => {
  try {
    const params: any = {
      period: queryParams.value.period
    }

    if (queryParams.value.period === 'custom' && dateRange.value) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    const res = await getRecruitmentFunnel(params)
    statistics.value = res.data

    calculateConversionData()
    await nextTick()
    updateChart()
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 查询
const handleSearch = () => {
  if (queryParams.value.period === 'custom' && !dateRange.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.value.period = 'month'
  dateRange.value = null
  loadData()
}

// 导出报表
const handleExport = async () => {
  try {
    const params: any = {
      reportType: 'recruitment',
      format: 'excel',
      period: queryParams.value.period
    }

    if (queryParams.value.period === 'custom' && dateRange.value) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    await exportReport(params)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  loadData()
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.page-container {
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

.overview-cards {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.overview-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .overview-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .overview-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    .iconfont-sys {
      font-size: 28px;
      color: #fff;
    }
  }

  .overview-info {
    flex: 1;
  }

  .overview-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }

  .overview-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
}

.chart-card {
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

  .chart-header {
    flex-shrink: 0;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .chart-content {
    flex: 1;
    display: flex;
    gap: 20px;
    overflow: hidden;
  }

  .funnel-chart {
    flex: 1;
    overflow: hidden;
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }

  .conversion-table {
    width: 350px;
    flex-shrink: 0;
  }
}
</style>
