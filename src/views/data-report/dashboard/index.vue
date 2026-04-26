<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="时间范围">
            <el-select v-model="queryParams.timeRange" placeholder="请选择时间范围" style="width: 150px" @change="handleTimeRangeChange">
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年度" value="year" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>

          <el-form-item label=" " v-if="queryParams.timeRange === 'custom'">
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

    <!-- 统计卡片行1 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #409eff">
            <i class="iconfont-sys" v-html="'&#xe88a;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">在职人数</div>
            <div class="overview-value">{{ dashboardData.employeeCount }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #f56c6c">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">离职率</div>
            <div class="overview-value">{{ dashboardData.turnoverRate }}%</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe7ae;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">招聘进度</div>
            <div class="overview-value">{{ dashboardData.recruitmentProgress }}%</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #e6a23c">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">出勤率</div>
            <div class="overview-value">{{ dashboardData.attendanceRate }}%</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 统计卡片行2 -->
    <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #909399">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">人力成本</div>
            <div class="overview-value">{{ formatCurrency(dashboardData.laborCost) }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">新增人数</div>
            <div class="overview-value">{{ dashboardData.newEmployees }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #f56c6c">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">离职人数</div>
            <div class="overview-value">{{ dashboardData.resignedEmployees }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #409eff">
            <i class="iconfont-sys" v-html="'&#xe88a;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">平均司龄</div>
            <div class="overview-value">{{ dashboardData.avgTenure }}年</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表行 -->
    <div class="chart-row">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>人员变化趋势</span>
          </div>
        </template>
        <div ref="employeeTrendChartRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>人力成本趋势</span>
          </div>
        </template>
        <div ref="laborCostChartRef" class="chart-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getDashboardData, exportReport } from '@/api/data-report'
import type { DashboardParams } from '@/types/dataReport'

defineOptions({
  name: 'DataReportDashboard'
})

// 查询参数
const queryParams = ref({
  timeRange: 'month' as 'month' | 'quarter' | 'year' | 'custom'
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 仪表盘数据
const dashboardData = ref({
  employeeCount: 0,
  turnoverRate: 0,
  recruitmentProgress: 0,
  attendanceRate: 0,
  laborCost: 0,
  newEmployees: 0,
  resignedEmployees: 0,
  avgTenure: 0,
  employeeTrend: [] as { date: string; count: number }[],
  laborCostTrend: [] as { date: string; cost: number }[]
})

// 图表引用
const employeeTrendChartRef = ref<HTMLElement>()
const laborCostChartRef = ref<HTMLElement>()
let employeeTrendChart: echarts.ECharts | null = null
let laborCostChart: echarts.ECharts | null = null

// 时间范围变化
const handleTimeRangeChange = () => {
  if (queryParams.value.timeRange !== 'custom') {
    dateRange.value = null
  }
}

// 查询
const handleSearch = async () => {
  try {
    const params: any = {
      timeRange: queryParams.value.timeRange
    }

    if (queryParams.value.timeRange === 'custom' && dateRange.value) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    const res = await getDashboardData(params as DashboardParams)
    dashboardData.value = res.data

    // 更新图表
    updateEmployeeTrendChart()
    updateLaborCostChart()

    ElMessage.success('查询成功')
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

// 重置
const handleReset = () => {
  queryParams.value.timeRange = 'month'
  dateRange.value = null
  handleSearch()
}

// 导出
const handleExport = async () => {
  try {
    const params: any = {
      reportType: 'dashboard',
      format: 'excel',
      timeRange: queryParams.value.timeRange
    }

    if (queryParams.value.timeRange === 'custom' && dateRange.value) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    await exportReport(params)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 格式化金额
const formatCurrency = (value: number): string => {
  return value.toLocaleString('zh-CN')
}

// 初始化人员变化趋势图表
const initEmployeeTrendChart = () => {
  if (!employeeTrendChartRef.value) return

  employeeTrendChart = echarts.init(employeeTrendChartRef.value)
  updateEmployeeTrendChart()

  window.addEventListener('resize', () => {
    employeeTrendChart?.resize()
  })
}

// 更新人员变化趋势图表
const updateEmployeeTrendChart = () => {
  if (!employeeTrendChart) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dashboardData.value.employeeTrend.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '在职人数',
        type: 'line',
        smooth: true,
        data: dashboardData.value.employeeTrend.map(item => item.count),
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        }
      }
    ]
  }

  employeeTrendChart.setOption(option)
}

// 初始化人力成本趋势图表
const initLaborCostChart = () => {
  if (!laborCostChartRef.value) return

  laborCostChart = echarts.init(laborCostChartRef.value)
  updateLaborCostChart()

  window.addEventListener('resize', () => {
    laborCostChart?.resize()
  })
}

// 更新人力成本趋势图表
const updateLaborCostChart = () => {
  if (!laborCostChart) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${param.seriesName}: ¥${param.value.toLocaleString('zh-CN')}`
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
      boundaryGap: false,
      data: dashboardData.value.laborCostTrend.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          return value >= 10000 ? `${(value / 10000).toFixed(1)}万` : value.toString()
        }
      }
    },
    series: [
      {
        name: '人力成本',
        type: 'line',
        smooth: true,
        data: dashboardData.value.laborCostTrend.map(item => item.cost),
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

  laborCostChart.setOption(option)
}

onMounted(() => {
  handleSearch()
  initEmployeeTrendChart()
  initLaborCostChart()
})

onUnmounted(() => {
  employeeTrendChart?.dispose()
  laborCostChart?.dispose()
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
  grid-template-columns: repeat(4, 1fr);
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

.chart-row {
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
