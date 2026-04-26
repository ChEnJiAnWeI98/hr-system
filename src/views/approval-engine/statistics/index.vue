<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="统计维度">
            <el-select v-model="queryParams.dimension" placeholder="请选择统计维度" style="width: 150px">
              <el-option label="按模板" value="template" />
              <el-option label="按部门" value="department" />
              <el-option label="按人员" value="user" />
            </el-select>
          </el-form-item>

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

    <!-- 可滚动内容区域 -->
    <el-scrollbar class="content-scrollbar">
      <!-- 概览卡片 -->
      <div class="overview-cards">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #409eff">
            <i class="iconfont-sys" v-html="'&#xe7ae;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">总实例数</div>
            <div class="overview-value">{{ statistics.totalInstances }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #67c23a">
            <i class="iconfont-sys" v-html="'&#xe6b1;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">已完成</div>
            <div class="overview-value">{{ statistics.completedInstances }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #e6a23c">
            <i class="iconfont-sys" v-html="'&#xe6b4;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">进行中</div>
            <div class="overview-value">{{ statistics.processingInstances }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-icon" style="background-color: #f56c6c">
            <i class="iconfont-sys" v-html="'&#xe6b2;'"></i>
          </div>
          <div class="overview-info">
            <div class="overview-label">已驳回</div>
            <div class="overview-value">{{ statistics.rejectedInstances }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表卡片 -->
    <div class="chart-row">
      <el-card class="chart-card">
        <template #header>
          <span>审批状态分布</span>
        </template>
        <div ref="statusChartRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <span>审批趋势</span>
        </template>
        <div ref="trendChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <div class="chart-row">
      <el-card class="chart-card">
        <template #header>
          <span>平均处理时长（小时）</span>
        </template>
        <div ref="durationChartRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <span>审批人效率排行</span>
        </template>
        <div ref="efficiencyChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 详细数据表格 -->
    <el-card class="data-card" style="margin-top: 16px">
      <template #header>
        <span>详细统计数据</span>
      </template>

      <div class="table-container">
        <el-table :data="tableData">
          <el-table-column prop="name" label="名称" min-width="12%" />
          <el-table-column prop="totalCount" label="总数" min-width="8%" />
          <el-table-column prop="completedCount" label="已完成" min-width="8%" />
          <el-table-column prop="processingCount" label="进行中" min-width="8%" />
          <el-table-column prop="rejectedCount" label="已驳回" min-width="8%" />
          <el-table-column prop="avgDuration" label="平均时长(小时)" min-width="12%" />
          <el-table-column prop="completionRate" label="完成率" min-width="8%">
            <template #default="{ row }">
              {{ row.completionRate }}%
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  getStatistics,
  getStatisticsDetail,
  exportStatistics,
  getTypeDistribution,
  getApproverEfficiency,
  getTimeEfficiency
} from '@/api/approval-engine'
import type { ListParams } from '@/types/approval-engine'

defineOptions({
  name: 'ApprovalStatistics'
})

// 查询参数
const queryParams = reactive<ListParams>({
  dimension: 'template',
  page: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 统计数据
const statistics = ref({
  totalInstances: 0,
  completedInstances: 0,
  processingInstances: 0,
  rejectedInstances: 0,
  avgDuration: 0,
  completionRate: 0
})

// 表格数据
const tableData = ref<any[]>([])
const total = ref(0)

// 图表数据
const typeDistribution = ref<any[]>([])
const approverEfficiency = ref<any[]>([])
const timeEfficiency = ref<any[]>([])

// 图表引用
const statusChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
const durationChartRef = ref<HTMLElement>()
const efficiencyChartRef = ref<HTMLElement>()

// 图表实例
let statusChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null
let durationChart: echarts.ECharts | null = null
let efficiencyChart: echarts.ECharts | null = null

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const params: any = { dimension: queryParams.dimension }
    if (dateRange.value) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }
    console.log('Fetching statistics with params:', params)
    const res = await getStatistics(params)
    console.log('Statistics API response:', res)
    if (res && res.data) {
      statistics.value = res.data
      console.log('Statistics data assigned:', statistics.value)
    } else {
      console.error('Invalid statistics response:', res)
      statistics.value = {
        totalInstances: 0,
        completedInstances: 0,
        processingInstances: 0,
        rejectedInstances: 0,
        avgDuration: 0,
        completionRate: 0
      }
    }
  } catch (error) {
    console.error('Fetch statistics error:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 获取图表数据
const fetchChartData = async () => {
  try {
    // 获取类型分布
    const typeRes = await getTypeDistribution()
    typeDistribution.value = typeRes.data || []
    console.log('Type distribution data:', typeDistribution.value)

    // 获取审批人效率
    const efficiencyRes = await getApproverEfficiency()
    approverEfficiency.value = efficiencyRes.data || []
    console.log('Approver efficiency data:', approverEfficiency.value)

    // 获取时效分析
    const timeRes = await getTimeEfficiency()
    timeEfficiency.value = timeRes.data || []
    console.log('Time efficiency data:', timeEfficiency.value)
  } catch (error) {
    console.error('Fetch chart data error:', error)
    // 设置默认空数组，避免后续处理出错
    typeDistribution.value = []
    approverEfficiency.value = []
    timeEfficiency.value = []
    ElMessage.error('获取图表数据失败')
  }
}

// 获取详细数据
const fetchData = async () => {
  try {
    const params = { ...queryParams }
    if (dateRange.value) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }
    const res = await getStatisticsDetail(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取详细数据失败')
  }
}

// 初始化状态分布图
const initStatusChart = () => {
  if (!statusChartRef.value) return

  try {
    statusChart = echarts.init(statusChartRef.value)

    // 使用真实的类型分布数据，如果没有数据则使用空数组
    const chartData = typeDistribution.value && typeDistribution.value.length > 0
      ? typeDistribution.value.map(item => ({
          value: item.count,
          name: item.type
        }))
      : []

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '0%',
        left: 'center'
      },
      series: [
        {
          name: '审批类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    }
    statusChart.setOption(option)
  } catch (error) {
    console.error('Init status chart error:', error)
  }
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  try {
    trendChart = echarts.init(trendChartRef.value)
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['提交', '通过', '驳回']
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '提交',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true,
          itemStyle: { color: '#409eff' }
        },
        {
          name: '通过',
          type: 'line',
          data: [100, 120, 90, 120, 80, 200, 180],
          smooth: true,
          itemStyle: { color: '#67c23a' }
        },
        {
          name: '驳回',
          type: 'line',
          data: [20, 12, 11, 14, 10, 30, 30],
          smooth: true,
          itemStyle: { color: '#f56c6c' }
        }
      ]
    }
    trendChart.setOption(option)
  } catch (error) {
    console.error('Init trend chart error:', error)
  }
}

// 初始化时长图
const initDurationChart = () => {
  if (!durationChartRef.value) return

  try {
    durationChart = echarts.init(durationChartRef.value)

    // 使用真实的时效分析数据，如果没有数据则使用空数组
    const categories = timeEfficiency.value && timeEfficiency.value.length > 0
      ? timeEfficiency.value.map(item => item.range)
      : []
    const values = timeEfficiency.value && timeEfficiency.value.length > 0
      ? timeEfficiency.value.map(item => item.count)
      : []

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
        data: categories
      },
      yAxis: {
        type: 'value',
        name: '数量'
      },
      series: [
        {
          name: '审批数量',
          type: 'bar',
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          barWidth: '40%'
        }
      ]
    }
    durationChart.setOption(option)
  } catch (error) {
    console.error('Init duration chart error:', error)
  }
}

// 初始化效率图
const initEfficiencyChart = () => {
  if (!efficiencyChartRef.value) return

  try {
    efficiencyChart = echarts.init(efficiencyChartRef.value)

    // 使用真实的审批人效率数据，如果没有数据则使用空数组
    const approvers = approverEfficiency.value && approverEfficiency.value.length > 0
      ? approverEfficiency.value.map(item => item.approver)
      : []
    const totals = approverEfficiency.value && approverEfficiency.value.length > 0
      ? approverEfficiency.value.map(item => item.total)
      : []

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '处理数量'
      },
      yAxis: {
        type: 'category',
        data: approvers
      },
      series: [
        {
          name: '处理数量',
          type: 'bar',
          data: totals,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#67c23a' },
              { offset: 1, color: '#95d475' }
            ])
          },
          barWidth: '40%'
        }
      ]
    }
    efficiencyChart.setOption(option)
  } catch (error) {
    console.error('Init efficiency chart error:', error)
  }
}

// 初始化所有图表
const initCharts = () => {
  // 使用 requestAnimationFrame 延迟初始化，避免 ResizeObserver 错误
  requestAnimationFrame(() => {
    nextTick(() => {
      try {
        console.log('Initializing charts...')
        initStatusChart()
        initTrendChart()
        initDurationChart()
        initEfficiencyChart()
        console.log('Charts initialized successfully')
      } catch (error) {
        console.error('Init charts error:', error)
      }
    })
  })
}

// 查询
const handleSearch = async () => {
  queryParams.page = 1
  await fetchStatistics()
  await fetchChartData()
  await fetchData()
  initCharts()
}

// 重置
const handleReset = async () => {
  queryParams.dimension = 'template'
  queryParams.page = 1
  dateRange.value = null
  await fetchStatistics()
  await fetchChartData()
  await fetchData()
  initCharts()
}

// 导出
const handleExport = async () => {
  try {
    const params: any = { dimension: queryParams.dimension }
    if (dateRange.value) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }
    await exportStatistics(params)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  statusChart?.resize()
  trendChart?.resize()
  durationChart?.resize()
  efficiencyChart?.resize()
}

onMounted(async () => {
  try {
    console.log('Statistics page mounted, starting data fetch...')
    await fetchStatistics()
    await fetchChartData()
    await fetchData()
    console.log('All data fetched, initializing charts...')
    initCharts()
    window.addEventListener('resize', handleResize)
    console.log('Statistics page initialization complete')
  } catch (error) {
    console.error('Statistics page mount error:', error)
    ElMessage.error('页面初始化失败')
  }
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
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
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
    font-weight: bold;
    color: #303133;
  }
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.chart-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .chart-container {
    width: 100%;
    height: 300px;
  }
}

.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  :deep(.el-table) {
    border: none !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(.el-table::before) {
    display: none;
  }

  :deep(.el-table::after) {
    display: none;
  }

  .el-pagination {
    flex-shrink: 0;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}
</style>
