<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="时间范围">
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

          <el-form-item label="部门范围">
            <el-select v-model="queryParams.department" placeholder="请选择部门" style="width: 200px" clearable>
              <el-option label="全部部门" value="" />
              <el-option label="技术部" value="tech" />
              <el-option label="产品部" value="product" />
              <el-option label="运营部" value="operation" />
              <el-option label="市场部" value="marketing" />
            </el-select>
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

    <!-- 统计卡片 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #409eff">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">薪酬总额</div>
            <div class="overview-value">{{ formatAmount(statistics.totalSalary) }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">平均薪酬</div>
            <div class="overview-value">{{ formatAmount(statistics.avgSalary) }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #e6a23c">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">薪酬中位数</div>
            <div class="overview-value">{{ formatAmount(statistics.medianSalary) }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表行 -->
    <div class="charts-row">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>薪酬分布</span>
          </div>
        </template>
        <div ref="salaryDistributionRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>人力成本趋势</span>
          </div>
        </template>
        <div ref="costTrendRef" class="chart-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

defineOptions({
  name: 'DataReportSalary'
})

// 查询参数
const queryParams = ref({
  department: ''
})

const dateRange = ref<[string, string]>(['2024-01-01', '2024-12-31'])

// 统计数据
const statistics = ref({
  totalSalary: 5280000,
  avgSalary: 12000,
  medianSalary: 10500
})

// 图表实例
const salaryDistributionRef = ref<HTMLElement>()
const costTrendRef = ref<HTMLElement>()
let salaryDistributionChart: ECharts | null = null
let costTrendChart: ECharts | null = null

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN') + '元'
}

// 查询
const handleSearch = async () => {
  try {
    // 调用 API
    // const res = await getSalaryAnalysis({
    //   timeRange: dateRange.value,
    //   department: queryParams.value.department
    // })

    // Mock 数据
    statistics.value = {
      totalSalary: 5280000,
      avgSalary: 12000,
      medianSalary: 10500
    }

    // 更新图表
    updateCharts()

    ElMessage.success('查询成功')
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

// 重置
const handleReset = () => {
  queryParams.value = {
    department: ''
  }
  dateRange.value = ['2024-01-01', '2024-12-31']
  handleSearch()
}

// 导出报表
const handleExport = async () => {
  try {
    // 调用导出 API
    // await exportReport({
    //   reportType: 'salary',
    //   format: 'excel',
    //   timeRange: dateRange.value,
    //   department: queryParams.value.department
    // })

    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 初始化薪酬分布图表
const initSalaryDistributionChart = () => {
  if (!salaryDistributionRef.value) return

  salaryDistributionChart = echarts.init(salaryDistributionRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.seriesName}: ${data.value}人`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-5K', '5-8K', '8-12K', '12-18K', '18-25K', '25K以上'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        data: [15, 45, 120, 85, 45, 30],
        itemStyle: {
          color: '#409eff'
        },
        barWidth: '50%'
      }
    ]
  }

  salaryDistributionChart.setOption(option)
}

// 初始化人力成本趋势图表
const initCostTrendChart = () => {
  if (!costTrendRef.value) return

  costTrendChart = echarts.init(costTrendRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.seriesName}: ${(data.value / 10000).toFixed(2)}万元`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: '成本(万元)',
      axisLabel: {
        formatter: (value: number) => (value / 10000).toFixed(0)
      }
    },
    series: [
      {
        name: '人力成本',
        type: 'line',
        data: [420000, 430000, 445000, 450000, 460000, 470000, 480000, 485000, 490000, 495000, 500000, 510000],
        smooth: true,
        itemStyle: {
          color: '#67c23a'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ])
        }
      }
    ]
  }

  costTrendChart.setOption(option)
}

// 更新图表
const updateCharts = () => {
  if (salaryDistributionChart) {
    salaryDistributionChart.resize()
  }
  if (costTrendChart) {
    costTrendChart.resize()
  }
}

// 窗口大小变化时重新调整图表
const handleResize = () => {
  updateCharts()
}

onMounted(() => {
  initSalaryDistributionChart()
  initCostTrendChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (salaryDistributionChart) {
    salaryDistributionChart.dispose()
  }
  if (costTrendChart) {
    costTrendChart.dispose()
  }
  window.removeEventListener('resize', handleResize)
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex-shrink: 0;
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
    flex-shrink: 0;

    .iconfont-sys {
      font-size: 28px;
      color: #fff;
    }
  }

  .overview-info {
    flex: 1;
    min-width: 0;
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

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.chart-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.el-card__body) {
    padding: 20px;
    flex: 1;
    overflow: hidden;
  }

  .chart-header {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>
