<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #ecf5ff">
            <i class="iconfont-sys" v-html="'&#xe7ae;'" style="color: #409eff"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">合同总数</div>
            <div class="stat-value">{{ statistics.total }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #f0f9ff">
            <i class="iconfont-sys" v-html="'&#xe88a;'" style="color: #67c23a"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">生效中</div>
            <div class="stat-value">{{ statistics.active }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #fef0f0">
            <i class="iconfont-sys" v-html="'&#xe7fc;'" style="color: #f56c6c"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">即将到期</div>
            <div class="stat-value">{{ statistics.expiringSoon }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #fdf6ec">
            <i class="iconfont-sys" v-html="'&#xe7b0;'" style="color: #e6a23c"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">待审批</div>
            <div class="stat-value">{{ statistics.pending }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <el-card class="chart-card">
        <template #header>
          <span>合同类型分布</span>
        </template>
        <div ref="typeChartRef" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <span>合同状态分布</span>
        </template>
        <div ref="statusChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <div class="charts-row">
      <el-card class="chart-card-full">
        <template #header>
          <span>合同签订趋势</span>
        </template>
        <div ref="trendChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 即将到期合同列表 -->
    <el-card class="data-card">
      <template #header>
        <span>即将到期合同（30天内）</span>
      </template>

      <div class="table-container">
        <el-table :data="expiringContracts" height="100%">
          <el-table-column prop="contractNo" label="合同编号" min-width="15%" />
          <el-table-column prop="employeeName" label="员工姓名" min-width="12%" />
          <el-table-column prop="employeeNo" label="工号" min-width="12%" />
          <el-table-column prop="department" label="部门" min-width="15%" show-overflow-tooltip />
          <el-table-column prop="type" label="合同类型" min-width="12%">
            <template #default="{ row }">
              {{ getContractTypeName(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="到期日期" min-width="12%" />
          <el-table-column prop="remainDays" label="剩余天数" min-width="10%">
            <template #default="{ row }">
              <el-tag :type="row.remainDays <= 7 ? 'danger' : 'warning'">
                {{ row.remainDays }}天
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleRenew(row)">
                续签
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getContractStatistics, getExpiringContracts } from '@/api/contract'
import type { Contract, ContractStatistics } from '@/types/contract'

defineOptions({
  name: 'ContractStatistics'
})

const router = useRouter()

const typeChartRef = ref<HTMLElement>()
const statusChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

let typeChart: echarts.ECharts | null = null
let statusChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

const statistics = ref<ContractStatistics>({
  total: 0,
  active: 0,
  expiringSoon: 0,
  expiringThisMonth: 0,
  expiringThisYear: 0,
  pending: 0,
  byType: [],
  byStatus: [],
  typeDistribution: [],
  renewalRate: [],
  trend: []
})

const expiringContracts = ref<Contract[]>([])

// 获取合同类型名称
const getContractTypeName = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '劳动合同',
    2: '保密协议',
    3: '竞业限制协议',
    4: '培训协议',
    5: '其他'
  }
  return typeMap[type] || '-'
}

// 初始化合同类型分布图表
const initTypeChart = () => {
  if (!typeChartRef.value) return

  typeChart = echarts.init(typeChartRef.value)

  // 转换数据格式：将 { typeName, count } 转换为 { name, value }
  const chartData = statistics.value.byType
    .filter(item => item.count > 0)  // 只显示有数据的类型
    .map(item => ({
      name: item.typeName,
      value: item.count
    }))

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
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

  typeChart.setOption(option)
}

// 初始化合同状态分布图表
const initStatusChart = () => {
  if (!statusChartRef.value) return

  statusChart = echarts.init(statusChartRef.value)

  // 转换数据格式：将 { statusName, count } 转换为 { name, value }
  const chartData = statistics.value.byStatus
    .filter(item => item.count > 0)  // 只显示有数据的状态
    .map(item => ({
      name: item.statusName,
      value: item.count
    }))

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
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
}

// 初始化合同签订趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const months = statistics.value.trend.map(item => item.month)
  const counts = statistics.value.trend.map(item => item.count)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '签订数量',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        },
        itemStyle: {
          color: '#409eff'
        },
        data: counts
      }
    ]
  }

  trendChart.setOption(option)
}

// 续签
const handleRenew = (row: Contract) => {
  router.push(`/contract/list/renew/${row.id}`)
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const res = await getContractStatistics()
    statistics.value = res.data

    // 初始化图表
    initTypeChart()
    initStatusChart()
    initTrendChart()
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

// 获取即将到期合同
const fetchExpiringContracts = async () => {
  try {
    const res = await getExpiringContracts()
    expiringContracts.value = res.data
  } catch (error) {
    console.error('获取即将到期合同失败', error)
  }
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  typeChart?.resize()
  statusChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  fetchStatistics()
  fetchExpiringContracts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  typeChart?.dispose()
  statusChart?.dispose()
  trendChart?.dispose()
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.stat-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont-sys {
        font-size: 28px;
      }
    }

    .stat-info {
      flex: 1;

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }
    }
  }
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.chart-card,
.chart-card-full {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }
}

.chart-card-full {
  grid-column: 1 / -1;
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

  .table-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>
