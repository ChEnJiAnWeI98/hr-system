<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="统计周期">
            <el-select v-model="queryParams.period" style="width: 140px">
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

          <el-form-item label="对比模式">
            <el-radio-group v-model="queryParams.compareMode">
              <el-radio-button value="chain">环比（上周期）</el-radio-button>
              <el-radio-button value="year">同比（去年同期）</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="部门范围">
            <el-select
              v-model="queryParams.departmentIds"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="全公司"
              style="width: 200px"
              :max-collapse-tags="2"
            >
              <el-option label="技术部" :value="1" />
              <el-option label="产品部" :value="2" />
              <el-option label="设计部" :value="3" />
              <el-option label="运营部" :value="4" />
              <el-option label="市场部" :value="5" />
              <el-option label="人事部" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon>
                导出管理层报表
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 主内容区（纵向滚动） -->
    <el-scrollbar class="content-scrollbar">
      <!-- 模块 1：核心 KPI（6 张卡片带环比）-->
      <div class="section-header">
        <div class="section-title">核心指标 · {{ reportData.periodLabel || '本月' }} vs {{ reportData.previousPeriodLabel || '上月' }}</div>
        <div class="section-hint">绿色箭头为正向变化，红色为负向；负向指标（周期/成本）数值下降为好</div>
      </div>
      <div class="kpi-grid">
        <el-card v-for="card in kpiCards" :key="card.key" class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">{{ card.label }}</span>
            <span class="kpi-change" :style="{ color: getChangeColor(card.metric) }">
              <el-icon v-if="card.metric.changeRate !== null && card.metric.changeRate > 0"><ArrowUp /></el-icon>
              <el-icon v-else-if="card.metric.changeRate !== null && card.metric.changeRate < 0"><ArrowDown /></el-icon>
              <span>{{ formatChange(card.metric.changeRate) }}</span>
            </span>
          </div>
          <div class="kpi-value">
            <span class="kpi-main">{{ formatMetric(card.metric.current, card.unit) }}</span>
            <span v-if="card.unit" class="kpi-unit">{{ card.unit }}</span>
          </div>
          <div class="kpi-compare">
            {{ reportData.previousPeriodLabel }}：{{ formatMetric(card.metric.previous, card.unit) }}{{ card.unit || '' }}
          </div>
        </el-card>
      </div>

      <!-- 模块 2：双周期漏斗对比 -->
      <el-card class="chart-card">
        <div class="chart-header">
          <span class="chart-title">招聘漏斗 · 本期 vs 上期对比</span>
          <span class="chart-hint">定位各阶段转化率的变化，快速识别瓶颈</span>
        </div>
        <div class="dual-funnel-layout">
          <div class="dual-funnel-item">
            <div class="funnel-label">{{ reportData.periodLabel || '本期' }}</div>
            <div ref="currentFunnelRef" class="funnel-chart"></div>
          </div>
          <div class="dual-funnel-item">
            <div class="funnel-label funnel-label-previous">{{ reportData.previousPeriodLabel || '上期' }}</div>
            <div ref="previousFunnelRef" class="funnel-chart"></div>
          </div>
        </div>
        <el-table :data="conversionCompareData" class="conversion-compare-table" size="small" stripe>
          <el-table-column prop="stage" label="转化阶段" min-width="160" />
          <el-table-column label="本期" width="130" align="center">
            <template #default="{ row }">
              <span :style="{ color: getRateColor(row.current) }">{{ row.current.toFixed(1) }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="上期" width="130" align="center">
            <template #default="{ row }">
              <span :style="{ color: getRateColor(row.previous) }">{{ row.previous.toFixed(1) }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="变化（百分点）" width="160" align="center">
            <template #default="{ row }">
              <span :style="{ color: row.diff > 0 ? '#67c23a' : row.diff < 0 ? '#f56c6c' : '#909399' }">
                {{ row.diff > 0 ? '+' : '' }}{{ row.diff.toFixed(1) }} pp
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 模块 3：月度趋势 -->
      <el-card class="chart-card">
        <div class="chart-header">
          <span class="chart-title">近 6 个月招聘趋势</span>
          <span class="chart-hint">观察招聘节奏稳定性与季节性波动</span>
        </div>
        <div ref="trendRef" class="trend-chart"></div>
      </el-card>

      <!-- 模块 4：TOP5 渠道 -->
      <el-card class="chart-card">
        <div class="chart-header">
          <span class="chart-title">本期渠道贡献 TOP5</span>
          <span class="chart-hint">仅展示入职数前 5 大渠道；全渠道 ROI / CPH 明细请在招聘数据分析中心查看</span>
        </div>
        <div class="channel-layout">
          <div ref="channelPieRef" class="channel-pie"></div>
          <div class="channel-list">
            <div
              v-for="(row, idx) in reportData.channelTop5 || []"
              :key="row.channel"
              class="channel-list-item"
            >
              <div class="channel-rank" :class="`rank-${idx + 1}`">
                <template v-if="row.channel === '其他'">—</template>
                <template v-else>{{ idx + 1 }}</template>
              </div>
              <div class="channel-info">
                <div class="channel-name">{{ row.channel }}</div>
                <div class="channel-stats">入职 {{ row.onboardedCount }} 人 · 占比 {{ row.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 模块 5：跳转引导卡片 -->
      <el-card class="cta-card" @click="handleJumpToAnalytics">
        <div class="cta-content">
          <div class="cta-icon">
            <el-icon :size="36"><DataAnalysis /></el-icon>
          </div>
          <div class="cta-main">
            <div class="cta-title">需要更详细的分析？进入 <strong>招聘数据分析中心</strong></div>
            <div class="cta-desc">
              全渠道 ROI / CPH 明细 · 面试官效率 · 周期分析 · 需求完成详情 · 渠道成本登记
            </div>
          </div>
          <div class="cta-action">
            <el-button type="primary" @click.stop="handleJumpToAnalytics">
              进入招聘数据分析中心
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Download, ArrowUp, ArrowDown, ArrowRight, DataAnalysis } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getRecruitmentFunnel, exportReport } from '@/api/data-report'
import type {
  RecruitmentFunnelData,
  KpiMetric
} from '@/types/data-report'

defineOptions({
  name: 'DataReportRecruitment'
})

const router = useRouter()

// ============ 查询参数 ============
const queryParams = reactive<{
  period: 'month' | 'quarter' | 'year' | 'custom'
  compareMode: 'chain' | 'year'
  departmentIds: number[]
}>({
  period: 'month',
  compareMode: 'chain',
  departmentIds: []
})
const dateRange = ref<[string, string] | null>(null)

// ============ 报表数据 ============
const reportData = ref<Partial<RecruitmentFunnelData>>({})

// ============ KPI 卡片配置 ============
const kpiCards = computed(() => {
  const kpi = reportData.value.kpi
  if (!kpi) return []
  return [
    { key: 'onboarded', label: '本期入职人数', metric: kpi.onboarded, unit: '人' },
    { key: 'totalConversion', label: '总转化率（投递→入职）', metric: kpi.totalConversion, unit: '%' },
    { key: 'avgTimeToHire', label: '平均招聘周期', metric: kpi.avgTimeToHire, unit: '天' },
    { key: 'offerAcceptRate', label: 'Offer 接受率', metric: kpi.offerAcceptRate, unit: '%' },
    { key: 'demandFillRate', label: '需求完成率', metric: kpi.demandFillRate, unit: '%' },
    { key: 'cph', label: '单人招聘成本 CPH', metric: kpi.cph, unit: '元' }
  ]
})

// ============ 双漏斗转化对比表 ============
const conversionCompareData = computed(() => {
  const cur = reportData.value.funnelCurrent
  const prev = reportData.value.funnelPrevious
  if (!cur || !prev) return []
  return [
    { stage: '投递 → 初筛', current: cur.screenRate, previous: prev.screenRate, diff: +(cur.screenRate - prev.screenRate).toFixed(1) },
    { stage: '初筛 → 面试', current: cur.interviewRate, previous: prev.interviewRate, diff: +(cur.interviewRate - prev.interviewRate).toFixed(1) },
    { stage: '面试 → Offer', current: cur.offerRate, previous: prev.offerRate, diff: +(cur.offerRate - prev.offerRate).toFixed(1) },
    { stage: 'Offer → 入职', current: cur.onboardRate, previous: prev.onboardRate, diff: +(cur.onboardRate - prev.onboardRate).toFixed(1) }
  ]
})

// ============ 工具函数 ============
const getChangeColor = (metric: KpiMetric): string => {
  if (metric.changeRate === null || metric.changeRate === 0) return '#909399'
  const isUp = metric.changeRate > 0
  // 正向指标：上升绿色、下降红色；负向指标相反
  if (metric.direction === 'positive') {
    return isUp ? '#67c23a' : '#f56c6c'
  }
  return isUp ? '#f56c6c' : '#67c23a'
}

const formatChange = (rate: number | null): string => {
  if (rate === null) return '—'
  if (rate === 0) return '持平'
  return `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`
}

const formatMetric = (v: number, unit?: string): string => {
  if (unit === '元') return v.toLocaleString('zh-CN')
  if (unit === '%') return v.toFixed(1)
  return String(v)
}

const getRateColor = (rate: number): string => {
  if (rate >= 50) return '#67c23a'
  if (rate >= 35) return '#e6a23c'
  return '#f56c6c'
}

// ============ 图表实例 ============
const currentFunnelRef = ref<HTMLElement>()
const previousFunnelRef = ref<HTMLElement>()
const trendRef = ref<HTMLElement>()
const channelPieRef = ref<HTMLElement>()
let currentFunnelChart: echarts.ECharts | null = null
let previousFunnelChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null
let channelPieChart: echarts.ECharts | null = null

// ============ 渲染图表 ============
const renderFunnels = () => {
  const cur = reportData.value.funnelCurrent
  const prev = reportData.value.funnelPrevious
  if (!cur || !prev) return

  const buildFunnelOption = (data: typeof cur, theme: 'primary' | 'muted'): EChartsOption => {
    const colors = theme === 'primary'
      ? ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#6f5ef9']
      : ['#c6e2ff', '#b3e19d', '#f3d19e', '#fab6b6', '#c7c1f5']
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      series: [
        {
          type: 'funnel',
          left: '8%',
          top: 20,
          bottom: 20,
          width: '84%',
          sort: 'descending',
          gap: 2,
          label: { show: true, position: 'inside', formatter: '{b}\n{c}', fontSize: 12 },
          data: [
            { value: data.resumeSubmitted, name: '投递', itemStyle: { color: colors[0] } },
            { value: data.resumeScreened, name: '初筛', itemStyle: { color: colors[1] } },
            { value: data.interviewScheduled, name: '面试', itemStyle: { color: colors[2] } },
            { value: data.offerSent, name: 'Offer', itemStyle: { color: colors[3] } },
            { value: data.onboarded, name: '入职', itemStyle: { color: colors[4] } }
          ]
        }
      ]
    }
  }

  if (currentFunnelRef.value) {
    if (!currentFunnelChart) currentFunnelChart = echarts.init(currentFunnelRef.value)
    currentFunnelChart.setOption(buildFunnelOption(cur, 'primary'))
  }
  if (previousFunnelRef.value) {
    if (!previousFunnelChart) previousFunnelChart = echarts.init(previousFunnelRef.value)
    previousFunnelChart.setOption(buildFunnelOption(prev, 'muted'))
  }
}

const renderTrend = () => {
  const trend = reportData.value.monthlyTrend
  if (!trend || !trendRef.value) return
  if (!trendChart) trendChart = echarts.init(trendRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 60, top: 30, bottom: 50 },
    xAxis: {
      type: 'category',
      data: trend.map((t) => t.month)
    },
    yAxis: [
      { type: 'value', name: '入职人数', position: 'left' },
      { type: 'value', name: '完成率(%)', position: 'right', max: 100, min: 0 }
    ],
    series: [
      {
        name: '月度入职人数',
        type: 'line',
        smooth: true,
        data: trend.map((t) => t.onboardedCount),
        itemStyle: { color: '#409eff' },
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.3)' },
              { offset: 1, color: 'rgba(64,158,255,0.05)' }
            ]
          }
        }
      },
      {
        name: '月度招聘完成率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: trend.map((t) => t.fillRate),
        itemStyle: { color: '#67c23a' },
        symbolSize: 8
      }
    ]
  } as EChartsOption)
}

const renderChannelPie = () => {
  const data = reportData.value.channelTop5
  if (!data || !channelPieRef.value) return
  if (!channelPieChart) channelPieChart = echarts.init(channelPieRef.value)
  channelPieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, itemWidth: 12, itemHeight: 12 },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '45%'],
        label: { formatter: '{b}\n{d}%', fontSize: 12 },
        data: data.map((c) => ({ name: c.channel, value: c.onboardedCount }))
      }
    ]
  } as EChartsOption)
}

const renderAll = async () => {
  await nextTick()
  renderFunnels()
  renderTrend()
  renderChannelPie()
}

// ============ 数据加载 ============
const buildParams = () => {
  const params: any = {
    period: queryParams.period,
    compareMode: queryParams.compareMode
  }
  if (queryParams.period === 'custom' && dateRange.value) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  if (queryParams.departmentIds.length > 0) {
    params.departmentIds = queryParams.departmentIds
  }
  return params
}

const loadData = async () => {
  try {
    const res = await getRecruitmentFunnel(buildParams())
    reportData.value = res.data
    await renderAll()
  } catch {
    ElMessage.error('加载数据失败')
  }
}

// ============ 事件 ============
const handleSearch = () => {
  if (queryParams.period === 'custom' && !dateRange.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  loadData()
}

const handleReset = () => {
  queryParams.period = 'month'
  queryParams.compareMode = 'chain'
  queryParams.departmentIds = []
  dateRange.value = null
  loadData()
}

const handleExport = async () => {
  try {
    const params: any = {
      reportType: 'recruitment',
      format: 'excel',
      period: queryParams.period,
      compareMode: queryParams.compareMode
    }
    if (queryParams.period === 'custom' && dateRange.value) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    await exportReport(params)
    ElMessage.success('招聘漏斗报表_管理层版 已生成')
  } catch {
    ElMessage.error('导出失败')
  }
}

const handleJumpToAnalytics = () => {
  router.push('/talent-experience/analytics')
}

// ============ 生命周期 ============
const handleResize = () => {
  currentFunnelChart?.resize()
  previousFunnelChart?.resize()
  trendChart?.resize()
  channelPieChart?.resize()
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  currentFunnelChart?.dispose()
  previousFunnelChart?.dispose()
  trendChart?.dispose()
  channelPieChart?.dispose()
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

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.section-header {
  margin-bottom: 12px;
  padding: 0 4px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .section-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

@media (min-width: 1400px) {
  .kpi-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 18px;
  }

  .kpi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .kpi-label {
    font-size: 13px;
    color: #606266;
  }

  .kpi-change {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .kpi-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;

    .kpi-main {
      font-size: 26px;
      font-weight: 700;
      color: #303133;
      line-height: 1;
    }

    .kpi-unit {
      font-size: 13px;
      color: #909399;
    }
  }

  .kpi-compare {
    font-size: 12px;
    color: #909399;
  }
}

.chart-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .chart-hint {
    font-size: 12px;
    color: #909399;
  }
}

.dual-funnel-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  .dual-funnel-item {
    display: flex;
    flex-direction: column;

    .funnel-label {
      font-size: 13px;
      font-weight: 600;
      color: #409eff;
      text-align: center;
      margin-bottom: 8px;
      padding: 4px 12px;
      background: rgba(64, 158, 255, 0.08);
      border-radius: 6px;
      align-self: center;
    }

    .funnel-label-previous {
      color: #909399;
      background: #f5f7fa;
    }

    .funnel-chart {
      width: 100%;
      height: 340px;
    }
  }
}

.conversion-compare-table {
  margin-top: 12px;
}

.trend-chart {
  width: 100%;
  height: 340px;
}

.channel-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  .channel-pie {
    width: 100%;
    height: 340px;
  }

  .channel-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;

    .channel-list-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 14px;
      background: #fafbfc;
      border-radius: 8px;

      .channel-rank {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #fff;
        background: #909399;
        flex-shrink: 0;

        &.rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffa500);
        }
        &.rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #9ba0ab);
        }
        &.rank-3 {
          background: linear-gradient(135deg, #cd7f32, #a56227);
        }
      }

      .channel-info {
        flex: 1;

        .channel-name {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }

        .channel-stats {
          font-size: 12px;
          color: #909399;
          margin-top: 2px;
        }
      }
    }
  }
}

.cta-card {
  border: none !important;
  border-radius: 12px;
  background: linear-gradient(120deg, #e8f1ff 0%, #f0f5ff 100%);
  box-shadow: none !important;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15) !important;
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  .cta-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .cta-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #409eff;
    color: #fff;
    flex-shrink: 0;
  }

  .cta-main {
    flex: 1;
    min-width: 0;

    .cta-title {
      font-size: 16px;
      color: #303133;
      margin-bottom: 6px;

      strong {
        color: #409eff;
      }
    }

    .cta-desc {
      font-size: 13px;
      color: #606266;
    }
  }

  .cta-action {
    flex-shrink: 0;
  }
}
</style>
