<template>
  <div class="page-container">
    <!-- 筛选卡片 -->
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
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon>
                导出报表
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- KPI 横条（固定常驻，切 Tab 不消失） -->
    <div class="kpi-ribbon">
      <el-card v-for="item in kpiCards" :key="item.key" class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" :style="{ background: item.color }">
            <el-icon :size="22" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">{{ item.label }}</div>
            <div class="kpi-value">{{ item.value }}<span v-if="item.unit" class="kpi-unit">{{ item.unit }}</span></div>
            <div v-if="item.sub" class="kpi-sub">{{ item.sub }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-scrollbar class="content-scrollbar">
      <el-tabs v-model="activeTab" class="analytics-tabs" @tab-change="handleTabChange">
        <!-- Tab: 招聘漏斗 -->
        <el-tab-pane label="招聘漏斗" name="funnel">
          <el-card class="chart-card">
            <div class="chart-header">
              <span class="chart-title">招聘漏斗 - 投递 → 入职全阶段</span>
            </div>
            <div class="funnel-layout">
              <div ref="funnelRef" class="funnel-chart"></div>
              <el-table :data="funnelStages" class="conversion-table" stripe>
                <el-table-column prop="stage" label="转化阶段" min-width="180" />
                <el-table-column prop="count" label="人数" width="100" align="right" />
                <el-table-column prop="rate" label="转化率" width="100" align="center">
                  <template #default="{ row }">
                    <span :style="{ color: getRateColor(row.rate) }">{{ row.rate }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 渠道分析 -->
        <el-tab-pane label="渠道分析" name="channel">
          <el-card class="chart-card">
            <div class="chart-header">
              <span class="chart-title">各渠道招聘效果</span>
              <span class="chart-hint">颜色越深表示 ROI 越高；CPH = 渠道投入 / 入职人数</span>
            </div>
            <div ref="channelChartRef" class="bar-chart"></div>
          </el-card>

          <el-card class="chart-card">
            <div class="chart-header">
              <span class="chart-title">渠道数据明细</span>
            </div>
            <el-table :data="channelData" stripe>
              <el-table-column prop="channel" label="渠道" width="140" />
              <el-table-column prop="resumeCount" label="投递数" width="100" align="right" />
              <el-table-column prop="interviewCount" label="面试数" width="100" align="right" />
              <el-table-column prop="offerCount" label="Offer数" width="100" align="right" />
              <el-table-column prop="onboardedCount" label="入职数" width="100" align="right" />
              <el-table-column label="投递→入职转化" width="140" align="center">
                <template #default="{ row }">
                  <span :style="{ color: getRateColor(row.conversionRate + '%') }">
                    {{ row.conversionRate }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="投入（元）" width="120" align="right">
                <template #default="{ row }">{{ formatMoney(row.cost) }}</template>
              </el-table-column>
              <el-table-column label="CPH（元/人）" width="130" align="right">
                <template #default="{ row }">{{ formatMoney(row.cph) }}</template>
              </el-table-column>
              <el-table-column label="ROI（人/万元）" width="140" align="right">
                <template #default="{ row }">
                  <el-tag :type="row.roi > 2 ? 'success' : row.roi > 1 ? 'warning' : 'info'" size="small">
                    {{ row.roi }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 4: 周期分析 -->
        <el-tab-pane label="周期分析" name="time">
          <el-card class="chart-card">
            <div class="chart-header">
              <span class="chart-title">Time-to-Fill / Time-to-Hire（按岗位族）</span>
              <span class="chart-hint">Time-to-Fill：职位发布 → 首个 Offer；Time-to-Hire：需求提出 → 首个入职</span>
            </div>
            <div ref="timeChartRef" class="bar-chart"></div>
          </el-card>

          <el-card class="chart-card">
            <el-table :data="timeData" stripe>
              <el-table-column prop="dimension" label="岗位族" width="160" />
              <el-table-column prop="hireCount" label="招聘数量" width="120" align="right" />
              <el-table-column label="Time-to-Fill（天）" width="180" align="right">
                <template #default="{ row }">
                  <span :style="{ color: row.timeToFill > 30 ? '#f56c6c' : '#303133' }">{{ row.timeToFill }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Time-to-Hire（天）" width="180" align="right">
                <template #default="{ row }">
                  <span :style="{ color: row.timeToHire > 45 ? '#f56c6c' : '#303133' }">{{ row.timeToHire }}</span>
                </template>
              </el-table-column>
              <el-table-column label="超期占比" width="140" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.overtimeRate > 20 ? 'danger' : row.overtimeRate > 10 ? 'warning' : 'success'" size="small">
                    {{ row.overtimeRate }}%
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import { Download, User, Document, ChatDotRound, Medal, OfficeBuilding } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  getDashboardStats,
  getFunnelData,
  getChannelEffect,
  getTimeToFillData,
  exportAnalyticsReport
} from '@/api/recruitmentAnalytics'
import type {
  RecruitmentDashboardStats,
  RecruitmentFunnelData,
  ChannelEffectRow,
  TimeToFillRow,
  FunnelStage,
  AnalyticsPeriod
} from '@/types/recruitmentAnalytics'

defineOptions({ name: 'RecruitmentAnalytics' })

const activeTab = ref<string>('funnel')
const queryParams = reactive({
  period: 'month' as AnalyticsPeriod,
  jobFamily: '' as string
})
const dateRange = ref<[string, string] | null>(null)

// 数据
const dashboardStats = ref<RecruitmentDashboardStats>({} as RecruitmentDashboardStats)
const funnelRaw = ref<RecruitmentFunnelData>({} as RecruitmentFunnelData)
const funnelStages = ref<FunnelStage[]>([])
const channelData = ref<ChannelEffectRow[]>([])
const timeData = ref<TimeToFillRow[]>([])

// 图表实例
const funnelRef = ref<HTMLElement>()
const channelChartRef = ref<HTMLElement>()
const timeChartRef = ref<HTMLElement>()
let funnelChart: echarts.ECharts | null = null
let channelChart: echarts.ECharts | null = null
let timeChart: echarts.ECharts | null = null

// KPI 横条（6 张核心指标）
const kpiCards = computed(() => [
  { key: 'demand', label: '进行中需求', value: dashboardStats.value.activeDemandCount ?? 0, unit: '', sub: `本周期新增 ${dashboardStats.value.newDemandCount ?? 0}`, color: '#409eff', icon: Document },
  { key: 'resume', label: '本周期简历', value: dashboardStats.value.newResumeCount ?? 0, unit: '', sub: `面试 ${dashboardStats.value.interviewCount ?? 0}`, color: '#e6a23c', icon: User },
  { key: 'offer', label: '本周期 Offer', value: dashboardStats.value.offerCount ?? 0, unit: '', sub: `接受率 ${dashboardStats.value.offerAcceptRate ?? 0}%`, color: '#f56c6c', icon: ChatDotRound },
  { key: 'onboarded', label: '本周期入职', value: dashboardStats.value.onboardedCount ?? 0, unit: '', sub: `爽约 ${dashboardStats.value.noShowCount ?? 0}`, color: '#909399', icon: OfficeBuilding },
  { key: 'fill', label: '需求完成率', value: dashboardStats.value.demandFillRate ?? 0, unit: '%', sub: '', color: '#6f5ef9', icon: Medal },
  { key: 'tth', label: '平均招聘周期', value: dashboardStats.value.avgTimeToHire ?? 0, unit: '天', sub: '需求→入职', color: '#14c9c9', icon: Document }
])

// ============ 颜色工具 ============
const getRateColor = (rate: string) => {
  const value = parseFloat(rate)
  if (value >= 60) return '#67c23a'
  if (value >= 40) return '#e6a23c'
  if (value >= 20) return '#f0a02c'
  return '#f56c6c'
}
const formatMoney = (v: number) => (v || 0).toLocaleString('zh-CN')

// ============ 数据加载 ============
const buildParams = () => {
  const params: any = { period: queryParams.period, jobFamily: queryParams.jobFamily || undefined }
  if (queryParams.period === 'custom' && dateRange.value) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  return params
}

const loadKpiStats = async () => {
  const res = await getDashboardStats(buildParams())
  dashboardStats.value = res.data
}

const loadFunnel = async () => {
  const res = await getFunnelData(buildParams())
  funnelRaw.value = res.data
  computeFunnelStages()
  await nextTick()
  renderFunnelChart()
}

const loadChannel = async () => {
  const res = await getChannelEffect(buildParams())
  channelData.value = res.data
  await nextTick()
  renderChannelChart()
}

const loadTime = async () => {
  const res = await getTimeToFillData(buildParams())
  timeData.value = res.data
  await nextTick()
  renderTimeChart()
}

const computeFunnelStages = () => {
  const f = funnelRaw.value
  const pct = (n: number, d: number) => (d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '0%')
  funnelStages.value = [
    { stage: '投递 → 初筛通过', count: f.resumeScreened, rate: pct(f.resumeScreened, f.resumeSubmitted) },
    { stage: '初筛 → 面试安排', count: f.interviewScheduled, rate: pct(f.interviewScheduled, f.resumeScreened) },
    { stage: '面试 → 通过', count: f.interviewPassed, rate: pct(f.interviewPassed, f.interviewScheduled) },
    { stage: '面试通过 → Offer', count: f.offerSent, rate: pct(f.offerSent, f.interviewPassed) },
    { stage: 'Offer → 接受', count: f.offerAccepted, rate: pct(f.offerAccepted, f.offerSent) },
    { stage: '接受 → 入职', count: f.onboarded, rate: pct(f.onboarded, f.offerAccepted) }
  ]
}

// ============ 图表渲染 ============
const renderFunnelChart = () => {
  if (!funnelRef.value) return
  if (!funnelChart) funnelChart = echarts.init(funnelRef.value)
  const f = funnelRaw.value
  funnelChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'funnel',
      left: '10%',
      top: 20,
      bottom: 20,
      width: '80%',
      sort: 'descending',
      gap: 3,
      label: { show: true, position: 'inside', formatter: '{b}: {c}', fontSize: 13 },
      emphasis: { label: { fontSize: 16 } },
      data: [
        { value: f.resumeSubmitted, name: '简历投递' },
        { value: f.resumeScreened, name: '初筛通过' },
        { value: f.interviewScheduled, name: '面试安排' },
        { value: f.interviewPassed, name: '面试通过' },
        { value: f.offerSent, name: 'Offer 发放' },
        { value: f.offerAccepted, name: 'Offer 接受' },
        { value: f.onboarded, name: '入职确认' }
      ]
    }]
  } as EChartsOption)
}

const renderChannelChart = () => {
  if (!channelChartRef.value) return
  if (!channelChart) channelChart = echarts.init(channelChartRef.value)
  const channels = channelData.value.map((c) => c.channel)
  channelChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 50, right: 30, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: channels, axisLabel: { fontSize: 12 } },
    yAxis: [
      { type: 'value', name: '人数', position: 'left' },
      { type: 'value', name: 'ROI(人/万元)', position: 'right' }
    ],
    series: [
      { name: '投递数', type: 'bar', data: channelData.value.map((c) => c.resumeCount), itemStyle: { color: '#b3d8ff' } },
      { name: '面试数', type: 'bar', data: channelData.value.map((c) => c.interviewCount), itemStyle: { color: '#79bbff' } },
      { name: 'Offer 数', type: 'bar', data: channelData.value.map((c) => c.offerCount), itemStyle: { color: '#409eff' } },
      { name: '入职数', type: 'bar', data: channelData.value.map((c) => c.onboardedCount), itemStyle: { color: '#67c23a' } },
      { name: 'ROI', type: 'line', yAxisIndex: 1, data: channelData.value.map((c) => c.roi), itemStyle: { color: '#f56c6c' }, symbolSize: 8 }
    ]
  } as EChartsOption)
}

const renderTimeChart = () => {
  if (!timeChartRef.value) return
  if (!timeChart) timeChart = echarts.init(timeChartRef.value)
  const dimensions = timeData.value.map((t) => t.dimension)
  timeChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    grid: { left: 50, right: 30, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: dimensions },
    yAxis: { type: 'value', name: '天数' },
    series: [
      { name: 'Time-to-Fill', type: 'bar', data: timeData.value.map((t) => t.timeToFill), itemStyle: { color: '#409eff' } },
      { name: 'Time-to-Hire', type: 'bar', data: timeData.value.map((t) => t.timeToHire), itemStyle: { color: '#e6a23c' } }
    ]
  } as EChartsOption)
}

// ============ 事件 ============
const handlePeriodChange = () => {
  if (queryParams.period !== 'custom') dateRange.value = null
}

const handleSearch = () => {
  if (queryParams.period === 'custom' && !dateRange.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  loadKpiStats()
  loadCurrentTab()
}

const handleReset = () => {
  queryParams.period = 'month'
  queryParams.jobFamily = ''
  dateRange.value = null
  loadKpiStats()
  loadCurrentTab()
}

const handleExport = async () => {
  const moduleMap: Record<string, any> = {
    funnel: 'funnel', channel: 'channel',
    time: 'time'
  }
  const res = await exportAnalyticsReport({
    module: moduleMap[activeTab.value] || 'funnel',
    format: 'excel',
    ...buildParams()
  })
  ElMessage.success(`已生成：${res.data.filename}`)
}

const handleTabChange = () => {
  loadCurrentTab()
}

const loadCurrentTab = () => {
  switch (activeTab.value) {
    case 'funnel':
      return loadFunnel()
    case 'channel':
      return loadChannel()
    case 'time':
      return loadTime()
  }
}

// ============ 生命周期 ============
const handleResize = () => {
  funnelChart?.resize()
  channelChart?.resize()
  timeChart?.resize()
}

onMounted(() => {
  loadKpiStats()
  loadFunnel()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  funnelChart?.dispose()
  channelChart?.dispose()
  timeChart?.dispose()
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

.analytics-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.kpi-ribbon {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .kpi-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .kpi-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .kpi-info {
    flex: 1;
    min-width: 0;
  }

  .kpi-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .kpi-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    line-height: 1;
  }

  .kpi-unit {
    font-size: 14px;
    color: #909399;
    margin-left: 2px;
  }

  .kpi-sub {
    font-size: 12px;
    color: #909399;
    margin-top: 6px;
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

  .chart-actions {
    display: flex;
    gap: 8px;
  }
}

.funnel-layout {
  display: flex;
  gap: 20px;

  .funnel-chart {
    flex: 1;
    min-width: 0;
    height: 460px;
  }

  .conversion-table {
    width: 400px;
    flex-shrink: 0;
  }
}

.bar-chart {
  width: 100%;
  height: 380px;
}
</style>
