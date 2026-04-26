<template>
  <div class="page-container">
    <!-- AI 洞察入口 -->
    <el-card class="ai-insight-banner">
      <div class="ai-banner-left">
        <span class="ai-banner-icon">⚠️</span>
        <div>
          <div class="ai-banner-title">AI 洞察 · 高风险员工预警</div>
          <div class="ai-banner-desc">基于目标停滞/360 分下滑/协作活跃度 多维信号，识别离职、绩效、心理异常风险员工</div>
        </div>
      </div>
      <el-button type="primary" @click="aiRiskAlertVisible = true">
        识别高风险员工
      </el-button>
    </el-card>

    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="分析维度">
            <el-select v-model="queryParams.dimension" placeholder="请选择分析维度" style="width: 150px" @change="handleDimensionChange">
              <el-option label="司龄分布" value="seniority" />
              <el-option label="学历分布" value="education" />
              <el-option label="年龄分布" value="age" />
              <el-option label="性别比例" value="gender" />
              <el-option label="部门人员构成" value="department" />
            </el-select>
          </el-form-item>

          <el-form-item label="部门筛选">
            <el-select v-model="queryParams.department" placeholder="请选择部门" style="width: 150px" clearable>
              <el-option label="全部部门" value="" />
              <el-option label="技术部" value="1" />
              <el-option label="产品部" value="2" />
              <el-option label="运营部" value="3" />
              <el-option label="市场部" value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="职级筛选">
            <el-select v-model="queryParams.level" placeholder="请选择职级" style="width: 150px" clearable>
              <el-option label="全部职级" value="" />
              <el-option label="初级" value="1" />
              <el-option label="中级" value="2" />
              <el-option label="高级" value="3" />
              <el-option label="专家" value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="入职时间">
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

    <!-- 图表卡片 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ chartTitle }}</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <!-- AI 高风险员工预警（诊断模式）-->
    <AIAssistDialog
      v-model="aiRiskAlertVisible"
      ability-code="risk_alert"
      mode="diagnose"
      initial-input="输入范围：当前筛选条件下的员工，近 8 周数据"
      dialog-width="720px"
      dialog-title="高风险员工预警 · AI 分析"
      input-label="分析范围"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AIAssistDialog from '@/components/business/AIAssistDialog.vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getPersonnelAnalysis, exportReport } from '@/api/data-report'
import type { PersonnelAnalysisParams, ExportReportParams } from '@/types/data-report'

defineOptions({
  name: 'DataReportPersonnel'
})

// 查询参数
const queryParams = ref({
  dimension: 'seniority',
  department: '',
  level: '',
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 图表实例
const chartRef = ref<HTMLElement>()
const aiRiskAlertVisible = ref(false)
let chartInstance: echarts.ECharts | null = null

// 图表标题
const chartTitle = ref('司龄分布')

// 维度标题映射
const dimensionTitleMap: Record<string, string> = {
  seniority: '司龄分布',
  education: '学历分布',
  age: '年龄分布',
  gender: '性别比例',
  department: '部门人员构成'
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  loadChartData()
}

// 加载图表数据
const loadChartData = async () => {
  try {
    const params = {
      ...queryParams.value,
      startDate: dateRange.value?.[0] || '',
      endDate: dateRange.value?.[1] || ''
    }

    const res = await getPersonnelAnalysis(params as PersonnelAnalysisParams)

    if (res.code === 200) {
      updateChart(res.data)
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
    ElMessage.error('加载图表数据失败')
  }
}

// 更新图表
const updateChart = (data: any) => {
  if (!chartInstance) return

  let option: EChartsOption

  const dimension = queryParams.value.dimension

  if (dimension === 'seniority') {
    // 司龄分布 - 柱状图
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const item = params[0]
          return `${item.name}<br/>${item.seriesName}: ${item.value}人 (${item.data.percentage}%)`
        }
      },
      legend: {
        bottom: 0,
        data: ['人数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.categories,
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
          data: data.values.map((val: number, idx: number) => ({
            value: val,
            percentage: data.percentages[idx]
          })),
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
  } else if (dimension === 'education' || dimension === 'gender') {
    // 学历分布/性别比例 - 饼图
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}人 ({d}%)'
      },
      legend: {
        bottom: 0,
        data: data.categories
      },
      series: [
        {
          name: dimension === 'education' ? '学历' : '性别',
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
          labelLine: {
            show: true
          },
          data: data.categories.map((name: string, idx: number) => ({
            name,
            value: data.values[idx]
          }))
        }
      ]
    }
  } else if (dimension === 'age') {
    // 年龄分布 - 柱状图
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const item = params[0]
          return `${item.name}<br/>${item.seriesName}: ${item.value}人 (${item.data.percentage}%)`
        }
      },
      legend: {
        bottom: 0,
        data: ['人数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.categories,
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
          data: data.values.map((val: number, idx: number) => ({
            value: val,
            percentage: data.percentages[idx]
          })),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#fccb05' },
              { offset: 0.5, color: '#f5804d' },
              { offset: 1, color: '#f5804d' }
            ])
          },
          barWidth: '40%'
        }
      ]
    }
  } else if (dimension === 'department') {
    // 部门人员构成 - 柱状图
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const item = params[0]
          return `${item.name}<br/>${item.seriesName}: ${item.value}人 (${item.data.percentage}%)`
        }
      },
      legend: {
        bottom: 0,
        data: ['人数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.categories,
        axisLabel: {
          interval: 0,
          rotate: 30
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
          data: data.values.map((val: number, idx: number) => ({
            value: val,
            percentage: data.percentages[idx]
          })),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a0cfff' },
              { offset: 0.5, color: '#626aef' },
              { offset: 1, color: '#626aef' }
            ])
          },
          barWidth: '40%'
        }
      ]
    }
  }

  chartInstance.setOption(option!)
}

// 维度切换
const handleDimensionChange = () => {
  chartTitle.value = dimensionTitleMap[queryParams.value.dimension]
  loadChartData()
}

// 查询
const handleSearch = () => {
  loadChartData()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    dimension: 'seniority',
    department: '',
    level: '',
    startDate: '',
    endDate: ''
  }
  dateRange.value = null
  chartTitle.value = '司龄分布'
  loadChartData()
}

// 导出报表
const handleExport = async () => {
  try {
    const params = {
      reportType: 'personnel',
      format: 'excel',
      dimension: queryParams.value.dimension,
      department: queryParams.value.department,
      level: queryParams.value.level,
      startDate: dateRange.value?.[0] || '',
      endDate: dateRange.value?.[1] || ''
    }

    await exportReport(params as ExportReportParams)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
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
.ai-insight-banner {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0d3 100%);

  :deep(.el-card__body) {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ai-banner-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ai-banner-icon {
    font-size: 28px;
  }

  .ai-banner-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .ai-banner-desc {
    font-size: 12px;
    color: #606266;
    margin-top: 2px;
  }
}

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

.chart-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-card__body) {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .chart-container {
    flex: 1;
    height: 400px;
    min-height: 400px;
  }
}
</style>
