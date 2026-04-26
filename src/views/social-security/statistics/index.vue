<template>
  <div class="statistics-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="开始月份">
            <el-date-picker
              v-model="queryParams.startMonth"
              type="month"
              placeholder="请选择开始月份"
              style="width: 200px"
              clearable
              format="YYYY-MM"
              value-format="YYYY-MM"
            />
          </el-form-item>

          <el-form-item label="结束月份">
            <el-date-picker
              v-model="queryParams.endMonth"
              type="month"
              placeholder="请选择结束月份"
              style="width: 200px"
              clearable
              format="YYYY-MM"
              value-format="YYYY-MM"
            />
          </el-form-item>

          <el-form-item label="部门">
            <el-input v-model="queryParams.department" placeholder="请输入部门" style="width: 200px" clearable />
          </el-form-item>

          <el-form-item label="城市">
            <el-input v-model="queryParams.city" placeholder="请输入城市" style="width: 150px" clearable />
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">
                查询
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 参保人数趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>参保人数趋势</span>
        </div>
      </template>
      <div ref="insuredTrendChartRef" class="chart-container"></div>
    </el-card>

    <!-- 缴纳金额统计 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>缴纳金额统计</span>
        </div>
      </template>
      <div ref="paymentAmountChartRef" class="chart-container"></div>
    </el-card>

    <!-- 费用趋势分析 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>费用趋势分析</span>
        </div>
      </template>
      <div ref="costTrendChartRef" class="chart-container"></div>
    </el-card>

    <!-- 部门费用对比 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>部门费用对比（柱状图）</span>
            </div>
          </template>
          <div ref="departmentBarChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>部门费用对比（饼图）</span>
            </div>
          </template>
          <div ref="departmentPieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 险种费用占比 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>险种费用占比</span>
        </div>
      </template>
      <div ref="insuranceRatioChartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { ElMessage } from 'element-plus'
import type { StatisticsQueryParams } from '@/types/socialSecurity'
import {
  getInsuredTrend,
  getPaymentAmountStats,
  getDepartmentCostCompare,
  getInsuranceTypeRatio
} from '@/api/socialSecurityStatistics'

defineOptions({
  name: 'SocialSecurityStatistics'
})

// 查询参数
const queryParams = ref<StatisticsQueryParams>({
  startMonth: '2026-01',
  endMonth: '2026-06',
  department: '',
  city: ''
})

// 图表实例
const insuredTrendChartRef = ref<HTMLElement>()
const paymentAmountChartRef = ref<HTMLElement>()
const costTrendChartRef = ref<HTMLElement>()
const departmentBarChartRef = ref<HTMLElement>()
const departmentPieChartRef = ref<HTMLElement>()
const insuranceRatioChartRef = ref<HTMLElement>()

let insuredTrendChart: ECharts | null = null
let paymentAmountChart: ECharts | null = null
let costTrendChart: ECharts | null = null
let departmentBarChart: ECharts | null = null
let departmentPieChart: ECharts | null = null
let insuranceRatioChart: ECharts | null = null

/**
 * 初始化参保人数趋势图
 */
const initInsuredTrendChart = async () => {
  if (!insuredTrendChartRef.value) return

  try {
    const res = await getInsuredTrend(queryParams.value)
    const data = res.data

    if (insuredTrendChart) {
      insuredTrendChart.dispose()
    }

    insuredTrendChart = echarts.init(insuredTrendChartRef.value)

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['参保人数', '新增人数', '停保人数']
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
        data: data.map((item: any) => item.month)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '参保人数',
          type: 'line',
          data: data.map((item: any) => item.insuredCount),
          smooth: true,
          itemStyle: { color: '#409EFF' }
        },
        {
          name: '新增人数',
          type: 'line',
          data: data.map((item: any) => item.newCount),
          smooth: true,
          itemStyle: { color: '#67C23A' }
        },
        {
          name: '停保人数',
          type: 'line',
          data: data.map((item: any) => item.stopCount),
          smooth: true,
          itemStyle: { color: '#F56C6C' }
        }
      ]
    }

    insuredTrendChart.setOption(option)
  } catch (error) {
    console.error('加载参保人数趋势失败:', error)
  }
}

/**
 * 初始化缴纳金额统计图
 */
const initPaymentAmountChart = async () => {
  if (!paymentAmountChartRef.value) return

  try {
    const res = await getPaymentAmountStats(queryParams.value)
    const data = res.data

    if (paymentAmountChart) {
      paymentAmountChart.dispose()
    }

    paymentAmountChart = echarts.init(paymentAmountChartRef.value)

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '公积金']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map((item: any) => item.month)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '养老保险',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.pensionAmount),
          itemStyle: { color: '#409EFF' }
        },
        {
          name: '医疗保险',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.medicalAmount),
          itemStyle: { color: '#67C23A' }
        },
        {
          name: '失业保险',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.unemploymentAmount),
          itemStyle: { color: '#E6A23C' }
        },
        {
          name: '工伤保险',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.injuryAmount),
          itemStyle: { color: '#F56C6C' }
        },
        {
          name: '生育保险',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.maternityAmount),
          itemStyle: { color: '#909399' }
        },
        {
          name: '公积金',
          type: 'bar',
          stack: 'total',
          data: data.map((item: any) => item.providentFundAmount),
          itemStyle: { color: '#C71585' }
        }
      ]
    }

    paymentAmountChart.setOption(option)
  } catch (error) {
    console.error('加载缴纳金额统计失败:', error)
  }
}

/**
 * 初始化费用趋势分析图
 */
const initCostTrendChart = async () => {
  if (!costTrendChartRef.value) return

  try {
    const res = await getPaymentAmountStats(queryParams.value)
    const data = res.data

    if (costTrendChart) {
      costTrendChart.dispose()
    }

    costTrendChart = echarts.init(costTrendChartRef.value)

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['总费用']
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
        data: data.map((item: any) => item.month)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '总费用',
          type: 'line',
          data: data.map((item: any) => item.totalAmount),
          smooth: true,
          itemStyle: { color: '#409EFF' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ])
          }
        }
      ]
    }

    costTrendChart.setOption(option)
  } catch (error) {
    console.error('加载费用趋势分析失败:', error)
  }
}

/**
 * 初始化部门费用对比柱状图
 */
const initDepartmentBarChart = async () => {
  if (!departmentBarChartRef.value) return

  try {
    const res = await getDepartmentCostCompare(queryParams.value)
    const data = res.data

    if (departmentBarChart) {
      departmentBarChart.dispose()
    }

    departmentBarChart = echarts.init(departmentBarChartRef.value)

    const option = {
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
        data: data.map((item: any) => item.department),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '总费用',
          type: 'bar',
          data: data.map((item: any) => item.totalAmount),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#409EFF' },
              { offset: 1, color: '#67C23A' }
            ])
          }
        }
      ]
    }

    departmentBarChart.setOption(option)
  } catch (error) {
    console.error('加载部门费用对比柱状图失败:', error)
  }
}

/**
 * 初始化部门费用对比饼图
 */
const initDepartmentPieChart = async () => {
  if (!departmentPieChartRef.value) return

  try {
    const res = await getDepartmentCostCompare(queryParams.value)
    const data = res.data

    if (departmentPieChart) {
      departmentPieChart.dispose()
    }

    departmentPieChart = echarts.init(departmentPieChartRef.value)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '部门费用',
          type: 'pie',
          radius: '50%',
          data: data.map((item: any) => ({
            value: item.totalAmount,
            name: item.department
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    departmentPieChart.setOption(option)
  } catch (error) {
    console.error('加载部门费用对比饼图失败:', error)
  }
}

/**
 * 初始化险种费用占比图
 */
const initInsuranceRatioChart = async () => {
  if (!insuranceRatioChartRef.value) return

  try {
    const res = await getInsuranceTypeRatio(queryParams.value)
    const data = res.data

    if (insuranceRatioChart) {
      insuranceRatioChart.dispose()
    }

    insuranceRatioChart = echarts.init(insuranceRatioChartRef.value)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '险种费用',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          data: data.map((item: any) => ({
            value: item.amount,
            name: item.insuranceType
          }))
        }
      ]
    }

    insuranceRatioChart.setOption(option)
  } catch (error) {
    console.error('加载险种费用占比失败:', error)
  }
}

/**
 * 初始化所有图表
 */
const initAllCharts = async () => {
  await nextTick()
  await Promise.all([
    initInsuredTrendChart(),
    initPaymentAmountChart(),
    initCostTrendChart(),
    initDepartmentBarChart(),
    initDepartmentPieChart(),
    initInsuranceRatioChart()
  ])
}

/**
 * 查询
 */
const handleSearch = () => {
  initAllCharts()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.value = {
    startMonth: '2026-01',
    endMonth: '2026-06',
    department: '',
    city: ''
  }
  handleSearch()
}

/**
 * 窗口大小改变时重新渲染图表
 */
const handleResize = () => {
  insuredTrendChart?.resize()
  paymentAmountChart?.resize()
  costTrendChart?.resize()
  departmentBarChart?.resize()
  departmentPieChart?.resize()
  insuranceRatioChart?.resize()
}

onMounted(() => {
  initAllCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  insuredTrendChart?.dispose()
  paymentAmountChart?.dispose()
  costTrendChart?.dispose()
  departmentBarChart?.dispose()
  departmentPieChart?.dispose()
  insuranceRatioChart?.dispose()
})
</script>

<style scoped lang="scss">
.statistics-container {
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

.chart-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  .card-header {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }
}
</style>
