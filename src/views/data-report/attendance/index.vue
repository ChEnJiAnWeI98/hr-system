<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="查询月份">
            <el-date-picker
              v-model="queryParams.month"
              type="month"
              placeholder="请选择月份"
              style="width: 200px"
              value-format="YYYY-MM"
            />
          </el-form-item>

          <el-form-item label="部门范围">
            <el-select v-model="queryParams.department" placeholder="请选择部门" style="width: 200px" clearable>
              <el-option label="全部部门" value="" />
              <el-option label="技术部" value="tech" />
              <el-option label="产品部" value="product" />
              <el-option label="运营部" value="operation" />
              <el-option label="市场部" value="market" />
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
            <i class="iconfont-sys" v-html="'&#xe7ae;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">应出勤天数</div>
            <div class="overview-value">{{ statistics.shouldAttendDays }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">实际出勤天数</div>
            <div class="overview-value">{{ statistics.actualAttendDays }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #e6a23c">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">迟到次数</div>
            <div class="overview-value">{{ statistics.lateCount }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #f56c6c">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">早退次数</div>
            <div class="overview-value">{{ statistics.earlyLeaveCount }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #909399">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">缺勤次数</div>
            <div class="overview-value">{{ statistics.absentCount }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #5470c6">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">加班时长</div>
            <div class="overview-value">{{ statistics.overtimeHours }}h</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #91cc75">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">出勤率</div>
            <div class="overview-value">{{ statistics.attendanceRate }}%</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表卡片 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>考勤统计</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getAttendanceReport, exportReport } from '@/api/data-report'

defineOptions({
  name: 'DataReportAttendance'
})

// 查询参数
const queryParams = reactive({
  month: new Date().toISOString().slice(0, 7),
  department: ''
})

// 统计数据
const statistics = reactive({
  shouldAttendDays: 0,
  actualAttendDays: 0,
  lateCount: 0,
  earlyLeaveCount: 0,
  absentCount: 0,
  overtimeHours: 0,
  attendanceRate: 0
})

// 表格数据
const tableData = ref<any[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 图表
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 查询
const handleSearch = async () => {
  try {
    const res = await getAttendanceReport({
      month: queryParams.month,
      department: queryParams.department
    })

    if (res.code === 200) {
      // 更新统计数据
      Object.assign(statistics, res.data.statistics)

      // 更新表格数据
      tableData.value = res.data.exceptionList
      pagination.total = res.data.total

      // 更新图表
      updateChart(res.data.chartData)
    }
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

// 重置
const handleReset = () => {
  queryParams.month = new Date().toISOString().slice(0, 7)
  queryParams.department = ''
  pagination.page = 1
  handleSearch()
}

// 导出
const handleExport = async () => {
  try {
    await exportReport({
      reportType: 'attendance',
      format: 'excel',
      month: queryParams.month,
      department: queryParams.department
    })
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['应出勤', '实际出勤', '迟到', '早退', '缺勤', '加班']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '应出勤',
        type: 'bar',
        data: [],
        itemStyle: { color: '#409eff' }
      },
      {
        name: '实际出勤',
        type: 'bar',
        data: [],
        itemStyle: { color: '#67c23a' }
      },
      {
        name: '迟到',
        type: 'bar',
        data: [],
        itemStyle: { color: '#e6a23c' }
      },
      {
        name: '早退',
        type: 'bar',
        data: [],
        itemStyle: { color: '#f56c6c' }
      },
      {
        name: '缺勤',
        type: 'bar',
        data: [],
        itemStyle: { color: '#909399' }
      },
      {
        name: '加班',
        type: 'bar',
        data: [],
        itemStyle: { color: '#5470c6' }
      }
    ]
  }

  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = (chartData: any) => {
  if (!chartInstance) return

  const option: EChartsOption = {
    xAxis: {
      data: chartData.categories
    },
    series: [
      { data: chartData.shouldAttend },
      { data: chartData.actualAttend },
      { data: chartData.late },
      { data: chartData.earlyLeave },
      { data: chartData.absent },
      { data: chartData.overtime }
    ]
  }

  chartInstance.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  handleSearch()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
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

  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
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
}

.chart-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .card-header {
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
