<template>
  <div class="page-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">{{ currentYear }} 年度预算</div>
        <div class="kpi-value">¥ {{ formatMoney(overview.totalBudget || 0) }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已使用</div>
        <div class="kpi-value" style="color: #409eff">¥ {{ formatMoney(overview.totalUsed || 0) }}</div>
        <div class="kpi-sub">使用率 {{ overview.totalUsageRate || 0 }}%</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">剩余</div>
        <div class="kpi-value" style="color: #67c23a">¥ {{ formatMoney(overview.totalRemaining || 0) }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">预算健康度</div>
        <div class="kpi-health">
          <el-tag type="success" size="small">健康 {{ overview.normalCount || 0 }}</el-tag>
          <el-tag type="warning" size="small" style="margin-left: 6px">预警 {{ overview.warningCount || 0 }}</el-tag>
          <el-tag type="danger" size="small" style="margin-left: 6px">超支 {{ overview.exceededCount || 0 }}</el-tag>
        </div>
      </el-card>
    </div>

    <el-scrollbar class="content-scrollbar">
      <PageTabs v-model="activeTab" class="budget-tabs" @tab-change="handleTabChange">
        <!-- Tab 1: 预算总览 -->
        <el-tab-pane label="预算总览" name="overview">
          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">按维度预算分布</div>
              <div class="section-hint">部门 / 岗位族 / 渠道三个维度的预算使用情况</div>
            </div>
            <div class="dimension-grid">
              <el-card
                v-for="(dim, idx) in overview.byDimension || []"
                :key="dim.dimension"
                class="dimension-card"
              >
                <div class="dim-header">
                  <span class="dim-icon">{{ BUDGET_DIMENSION_MAP[dim.dimension].icon }}</span>
                  <div>
                    <div class="dim-title">{{ BUDGET_DIMENSION_MAP[dim.dimension].label }}</div>
                    <div class="dim-total">¥ {{ formatMoney(dim.totalBudget) }} / ¥ {{ formatMoney(dim.totalUsed) }}</div>
                  </div>
                </div>
                <div :ref="(el) => setDimChartRef(idx, el)" class="dim-chart"></div>
              </el-card>
            </div>
          </el-card>

          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">近 6 个月消耗趋势</div>
            </div>
            <div ref="trendChartRef" class="trend-chart"></div>
          </el-card>

          <el-card v-if="exceededBudgets.length > 0" class="section-card alert-section">
            <div class="section-header">
              <div class="section-title" style="color: #f56c6c">⚠ 超支预算警告</div>
              <div class="section-hint">以下预算已超出年度额度，需立即关注</div>
            </div>
            <el-table :data="exceededBudgets" stripe>
              <el-table-column prop="name" label="预算名称" min-width="220" />
              <el-table-column prop="dimensionKey" label="维度" width="140" />
              <el-table-column label="预算" width="140" align="right">
                <template #default="{ row }">¥ {{ formatMoney(row.budgetAmount) }}</template>
              </el-table-column>
              <el-table-column label="已使用" width="140" align="right">
                <template #default="{ row }">
                  <span style="color: #f56c6c; font-weight: 600">¥ {{ formatMoney(row.usedAmount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="超支金额" width="140" align="right">
                <template #default="{ row }">
                  <span style="color: #f56c6c; font-weight: 600">
                    ¥ {{ formatMoney(row.usedAmount - row.budgetAmount) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="超支比例" width="120" align="center">
                <template #default="{ row }">
                  <el-tag type="danger">{{ (row.usageRate - 100).toFixed(1) }}%</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 预算分配 -->
        <el-tab-pane label="预算分配" name="allocation">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">预算分配表</div>
                <div class="section-hint">维护年度/季度预算项，使用率实时更新</div>
              </div>
              <el-button type="primary" @click="openBudgetDialog()">
                <el-icon><Plus /></el-icon>
                新增预算项
              </el-button>
            </div>
            <el-table :data="budgetList" stripe>
              <el-table-column prop="name" label="预算名称" min-width="200" />
              <el-table-column label="周期" width="110" align="center">
                <template #default="{ row }">
                  {{ row.year }} {{ row.period === 'quarter' ? `Q${row.quarter}` : BUDGET_PERIOD_MAP[row.period] }}
                </template>
              </el-table-column>
              <el-table-column label="维度" width="140">
                <template #default="{ row }">
                  <span>{{ BUDGET_DIMENSION_MAP[row.dimension].icon }} {{ BUDGET_DIMENSION_MAP[row.dimension].label }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="dimensionKey" label="目标" width="140" />
              <el-table-column label="预算" width="140" align="right">
                <template #default="{ row }">¥ {{ formatMoney(row.budgetAmount) }}</template>
              </el-table-column>
              <el-table-column label="已使用" width="140" align="right">
                <template #default="{ row }">¥ {{ formatMoney(row.usedAmount) }}</template>
              </el-table-column>
              <el-table-column label="使用率" width="200">
                <template #default="{ row }">
                  <el-progress
                    :percentage="Math.min(row.usageRate, 100)"
                    :stroke-width="10"
                    :color="getProgressColor(row.usageRate, row.alertThreshold)"
                    :format="() => row.usageRate + '%'"
                  />
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="BUDGET_STATUS_MAP[row.status].type" size="small">
                    {{ BUDGET_STATUS_MAP[row.status].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openBudgetDialog(row)">编辑</el-button>
                  <el-button link @click="showExpenses(row)">查看消耗</el-button>
                  <el-button link type="danger" @click="deleteBudget(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 消耗明细 -->
        <el-tab-pane label="消耗明细" name="expenses">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">全部消耗明细</div>
                <div class="section-hint">来源于渠道成本登记、内推奖励、背调订单等业务模块</div>
              </div>
            </div>
            <el-table :data="expenseList" stripe>
              <el-table-column prop="month" label="月份" width="110" />
              <el-table-column prop="description" label="消耗描述" min-width="280" />
              <el-table-column label="来源" width="140">
                <template #default="{ row }">
                  <el-tag size="small" effect="plain">{{ getSourceLabel(row.source) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="关联预算" width="180">
                <template #default="{ row }">
                  {{ getBudgetName(row.budgetId) }}
                </template>
              </el-table-column>
              <el-table-column label="金额" width="140" align="right">
                <template #default="{ row }">¥ {{ formatMoney(row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="登记时间" width="180" />
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 4: 告警配置 -->
        <el-tab-pane label="告警中心" name="alerts">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">预算告警</div>
                <div class="section-hint">触发条件：使用率达到阈值 / 超支 100%</div>
              </div>
            </div>
            <el-table :data="alertList" stripe>
              <el-table-column prop="triggerTime" label="触发时间" width="180" />
              <el-table-column prop="budgetName" label="预算名称" min-width="200" />
              <el-table-column prop="dimensionKey" label="维度" width="130" />
              <el-table-column label="类型" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.triggerType === 'exceeded' ? 'danger' : 'warning'" size="small">
                    {{ row.triggerType === 'exceeded' ? '超支' : '预警' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="当前使用率" width="130" align="center">
                <template #default="{ row }">
                  <span :style="{ color: row.triggerRate >= 100 ? '#f56c6c' : '#e6a23c', fontWeight: 600 }">
                    {{ row.triggerRate }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="message" label="告警信息" min-width="280" show-overflow-tooltip />
              <el-table-column label="确认状态" width="130" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.acknowledged === 1" type="success" size="small">已确认</el-tag>
                  <el-tag v-else type="warning" size="small">待确认</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="acknowledgedBy" label="确认人" width="110" />
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button
                    v-if="row.acknowledged === 0"
                    link
                    type="primary"
                    @click="handleAcknowledge(row)"
                  >
                    确认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 5: 渠道投入 -->
        <el-tab-pane label="渠道投入" name="channelCost">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">渠道投入明细</div>
                <div class="section-hint">手工登记月度渠道投放金额，供招聘运营分析计算 ROI/CPH</div>
              </div>
              <el-button type="primary" @click="handleAddCost">
                <el-icon><Plus /></el-icon>
                新增成本记录
              </el-button>
            </div>
            <el-table :data="costList" stripe style="width: 100%">
              <el-table-column prop="channel" label="渠道" min-width="140" />
              <el-table-column prop="month" label="月份" min-width="110" />
              <el-table-column label="投入金额" min-width="140" align="right">
                <template #default="{ row }">¥ {{ formatMoney(row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="200" />
              <el-table-column prop="createTime" label="登记时间" min-width="170" />
              <el-table-column label="操作" width="140" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleEditCost(row)">编辑</el-button>
                  <el-button link type="danger" @click="handleDeleteCost(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </PageTabs>
    </el-scrollbar>

    <!-- 预算编辑弹窗 -->
    <el-dialog v-model="budgetDialogVisible" :title="budgetForm.id ? '编辑预算' : '新增预算'" width="600px">
      <el-form ref="budgetFormRef" :model="budgetForm" :rules="budgetRules" label-width="120px">
        <el-form-item label="预算名称" prop="name">
          <el-input v-model="budgetForm.name" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-input v-model.number="budgetForm.year" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期" prop="period">
              <el-select v-model="budgetForm.period" style="width: 100%">
                <el-option label="年度" value="year" />
                <el-option label="季度" value="quarter" />
                <el-option label="月度" value="month" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="budgetForm.period === 'quarter'" label="季度">
          <el-select v-model="budgetForm.quarter" style="width: 100%">
            <el-option label="Q1" :value="1" />
            <el-option label="Q2" :value="2" />
            <el-option label="Q3" :value="3" />
            <el-option label="Q4" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="维度" prop="dimension">
          <el-select v-model="budgetForm.dimension" style="width: 100%">
            <el-option label="按部门" value="department" />
            <el-option label="按岗位族" value="jobFamily" />
            <el-option label="按渠道" value="channel" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标对象" prop="dimensionKey">
          <el-input v-model="budgetForm.dimensionKey" placeholder="部门名 / 岗位族 / 渠道名" />
        </el-form-item>
        <el-form-item label="预算金额" prop="budgetAmount">
          <el-input v-model.number="budgetForm.budgetAmount">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="告警阈值">
          <el-slider
            v-model="budgetForm.alertThreshold"
            :min="50"
            :max="100"
            show-input
            :show-input-controls="false"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="budgetForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="budgetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBudget">确定</el-button>
      </template>
    </el-dialog>

    <!-- 消耗详情 -->
    <el-dialog v-model="expenseDialogVisible" :title="`${currentBudget?.name || ''} - 消耗明细`" width="640px">
      <el-table :data="currentBudgetExpenses" stripe>
        <el-table-column prop="month" label="月份" width="110" />
        <el-table-column prop="description" label="消耗描述" min-width="240" />
        <el-table-column label="来源" width="130">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ getSourceLabel(row.source) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130" align="right">
          <template #default="{ row }">¥ {{ formatMoney(row.amount) }}</template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="expenseDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 渠道成本弹窗 -->
    <el-dialog
      v-model="costDialogVisible"
      :title="costForm.id ? '编辑渠道成本' : '新增渠道成本'"
      width="500px"
    >
      <el-form ref="costFormRef" :model="costForm" :rules="costRules" label-width="100px">
        <el-form-item label="渠道" prop="channel">
          <el-select v-model="costForm.channel" placeholder="请选择渠道" style="width: 100%">
            <el-option label="Boss直聘" value="Boss直聘" />
            <el-option label="猎聘" value="猎聘" />
            <el-option label="智联招聘" value="智联招聘" />
            <el-option label="前程无忧" value="前程无忧" />
            <el-option label="拉勾网" value="拉勾网" />
            <el-option label="LinkedIn" value="LinkedIn" />
            <el-option label="脉脉" value="脉脉" />
            <el-option label="内推" value="内推" />
          </el-select>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-date-picker
            v-model="costForm.month"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="投入金额" prop="amount">
          <el-input v-model.number="costForm.amount" placeholder="请输入金额（元）">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="costForm.remark" type="textarea" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="costDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCost">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  budgetApi,
  budgetAlertApi,
  budgetExpenseApi,
  getBudgetOverview,
  acknowledgeAlert
} from '@/api/recruitmentBudget'
import {
  BUDGET_DIMENSION_MAP,
  BUDGET_PERIOD_MAP,
  BUDGET_STATUS_MAP,
  calcBudgetStatus,
  type RecruitmentBudget,
  type BudgetAlert,
  type BudgetExpense,
  type BudgetOverview
} from '@/types/recruitmentBudget'
import { channelCostApi } from '@/api/recruitmentAnalytics'
import type { ChannelCostRecord } from '@/types/recruitmentAnalytics'

defineOptions({ name: 'RecruitmentBudget' })

const activeTab = ref<'overview' | 'allocation' | 'expenses' | 'alerts' | 'channelCost'>('overview')
const currentYear = new Date().getFullYear()

const overview = ref<Partial<BudgetOverview>>({})
const budgetList = ref<RecruitmentBudget[]>([])
const alertList = ref<BudgetAlert[]>([])
const expenseList = ref<BudgetExpense[]>([])

const exceededBudgets = computed(() => budgetList.value.filter((b) => b.status === 'exceeded'))

/* ========== 加载 ========== */
const loadOverview = async () => {
  const res = await getBudgetOverview(currentYear)
  overview.value = res.data
  await nextTick()
  renderCharts()
}

const loadBudgets = async () => {
  const res = await budgetApi.getList({ pageSize: 200 })
  budgetList.value = res.data?.list || []
}

const loadAlerts = async () => {
  const res = await budgetAlertApi.getList({ pageSize: 100 })
  alertList.value = (res.data?.list || []).sort((a: BudgetAlert, b: BudgetAlert) =>
    b.triggerTime.localeCompare(a.triggerTime)
  )
}

const loadExpenses = async () => {
  const res = await budgetExpenseApi.getList({ pageSize: 200 })
  expenseList.value = (res.data?.list || []).sort((a: BudgetExpense, b: BudgetExpense) =>
    b.createTime.localeCompare(a.createTime)
  )
}

const handleTabChange = () => {
  if (activeTab.value === 'allocation' && budgetList.value.length === 0) loadBudgets()
  if (activeTab.value === 'expenses' && expenseList.value.length === 0) loadExpenses()
  if (activeTab.value === 'alerts' && alertList.value.length === 0) loadAlerts()
  if (activeTab.value === 'channelCost' && costList.value.length === 0) loadChannelCost()
}

/* ========== 渠道投入 CRUD ========== */
const costList = ref<ChannelCostRecord[]>([])
const costDialogVisible = ref(false)
const costFormRef = ref<FormInstance>()
const costForm = reactive<Partial<ChannelCostRecord>>({
  id: undefined,
  channel: '',
  month: '',
  amount: 0,
  remark: ''
})
const costRules = {
  channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
}

const loadChannelCost = async () => {
  const res = await channelCostApi.getList({ pageSize: 100 })
  costList.value = res.data?.list || []
}

const resetCostForm = () => {
  costForm.id = undefined
  costForm.channel = ''
  costForm.month = ''
  costForm.amount = 0
  costForm.remark = ''
}

const handleAddCost = () => {
  resetCostForm()
  costDialogVisible.value = true
}

const handleEditCost = (row: ChannelCostRecord) => {
  Object.assign(costForm, row)
  costDialogVisible.value = true
}

const handleDeleteCost = async (row: ChannelCostRecord) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.channel} - ${row.month}」的成本记录吗？`, '确认', {
      type: 'warning'
    })
    await channelCostApi.delete(row.id)
    ElMessage.success('删除成功')
    loadChannelCost()
  } catch {}
}

const handleSaveCost = async () => {
  await costFormRef.value?.validate()
  if (costForm.id) {
    await channelCostApi.update(costForm)
    ElMessage.success('更新成功')
  } else {
    await channelCostApi.add(costForm)
    ElMessage.success('添加成功')
  }
  costDialogVisible.value = false
  loadChannelCost()
}

/* ========== 图表 ========== */
const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
const dimChartInstances = ref<Record<number, echarts.ECharts>>({})

const setDimChartRef = (idx: number, el: any) => {
  if (el && overview.value.byDimension && overview.value.byDimension[idx]) {
    nextTick(() => {
      if (!dimChartInstances.value[idx]) {
        dimChartInstances.value[idx] = echarts.init(el)
      }
      const dim = overview.value.byDimension![idx]
      dimChartInstances.value[idx].setOption({
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '50%'],
            label: { formatter: '{b}\n{d}%', fontSize: 11 },
            data: dim.items.map((i) => ({ name: i.key, value: i.used }))
          }
        ]
      } as EChartsOption)
    })
  }
}

const renderCharts = () => {
  if (trendChartRef.value && overview.value.monthlyTrend) {
    if (!trendChart) trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      grid: { left: 60, right: 30, top: 30, bottom: 50 },
      xAxis: { type: 'category', data: overview.value.monthlyTrend.map((t) => t.month) },
      yAxis: { type: 'value', name: '金额（元）' },
      series: [
        {
          name: '月度预算',
          type: 'bar',
          data: overview.value.monthlyTrend.map((t) => t.budget),
          itemStyle: { color: '#c6e2ff' },
          barWidth: 24
        },
        {
          name: '实际消耗',
          type: 'bar',
          data: overview.value.monthlyTrend.map((t) => t.used),
          itemStyle: { color: '#409eff' },
          barWidth: 24
        }
      ]
    } as EChartsOption)
  }
}

/* ========== 工具 ========== */
const formatMoney = (v: number) => v.toLocaleString('zh-CN')

const getProgressColor = (rate: number, threshold: number): string => {
  if (rate >= 100) return '#f56c6c'
  if (rate >= threshold) return '#e6a23c'
  return '#67c23a'
}

const getSourceLabel = (source: string): string => {
  const map: Record<string, string> = {
    channel_cost: '渠道成本',
    referral_reward: '内推奖励',
    background_check: '背调订单',
    other: '其他'
  }
  return map[source] || source
}

const getBudgetName = (id: number): string => {
  const b = budgetList.value.find((x) => x.id === id)
  return b?.name || '-'
}

/* ========== 预算 CRUD ========== */
const budgetDialogVisible = ref(false)
const budgetFormRef = ref<FormInstance>()
const budgetForm = reactive<Partial<RecruitmentBudget>>({
  id: undefined,
  name: '',
  year: currentYear,
  period: 'year',
  quarter: undefined,
  dimension: 'department',
  dimensionKey: '',
  budgetAmount: 0,
  usedAmount: 0,
  alertThreshold: 80,
  remark: ''
})
const budgetRules = {
  name: [{ required: true, message: '请输入预算名称', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年度', trigger: 'blur' }],
  period: [{ required: true, message: '请选择周期', trigger: 'change' }],
  dimension: [{ required: true, message: '请选择维度', trigger: 'change' }],
  dimensionKey: [{ required: true, message: '请输入目标对象', trigger: 'blur' }],
  budgetAmount: [{ required: true, message: '请输入预算金额', trigger: 'blur' }]
}

const resetBudgetForm = () => {
  budgetForm.id = undefined
  budgetForm.name = ''
  budgetForm.year = currentYear
  budgetForm.period = 'year'
  budgetForm.quarter = undefined
  budgetForm.dimension = 'department'
  budgetForm.dimensionKey = ''
  budgetForm.budgetAmount = 0
  budgetForm.usedAmount = 0
  budgetForm.alertThreshold = 80
  budgetForm.remark = ''
}

const openBudgetDialog = (row?: RecruitmentBudget) => {
  resetBudgetForm()
  if (row) Object.assign(budgetForm, row)
  budgetDialogVisible.value = true
}

const saveBudget = async () => {
  await budgetFormRef.value?.validate()
  const budgetAmount = budgetForm.budgetAmount || 0
  const usedAmount = budgetForm.usedAmount || 0
  const usageRate = budgetAmount > 0 ? Number(((usedAmount / budgetAmount) * 100).toFixed(1)) : 0
  const data = {
    ...budgetForm,
    remainingAmount: budgetAmount - usedAmount,
    usageRate,
    status: calcBudgetStatus(usageRate, budgetForm.alertThreshold || 80)
  }
  if (budgetForm.id) {
    await budgetApi.update(data)
    ElMessage.success('预算已更新')
  } else {
    await budgetApi.add(data)
    ElMessage.success('预算已新增')
  }
  budgetDialogVisible.value = false
  loadBudgets()
  loadOverview()
}

const deleteBudget = async (row: RecruitmentBudget) => {
  try {
    await ElMessageBox.confirm(`确定删除预算「${row.name}」吗？`, '确认', { type: 'warning' })
    await budgetApi.delete(row.id)
    ElMessage.success('已删除')
    loadBudgets()
    loadOverview()
  } catch {}
}

/* ========== 消耗详情 ========== */
const expenseDialogVisible = ref(false)
const currentBudget = ref<RecruitmentBudget | null>(null)
const currentBudgetExpenses = ref<BudgetExpense[]>([])

const showExpenses = async (row: RecruitmentBudget) => {
  currentBudget.value = row
  if (expenseList.value.length === 0) await loadExpenses()
  currentBudgetExpenses.value = expenseList.value.filter((e) => e.budgetId === row.id)
  expenseDialogVisible.value = true
}

/* ========== 告警确认 ========== */
const handleAcknowledge = async (row: BudgetAlert) => {
  try {
    await ElMessageBox.confirm(`确认告警「${row.budgetName}」吗？`, '确认告警', { type: 'info' })
    await acknowledgeAlert(row.id, '张HR')
    ElMessage.success('告警已确认')
    loadAlerts()
  } catch {}
}

/* ========== 生命周期 ========== */
const handleResize = () => {
  trendChart?.resize()
  Object.values(dimChartInstances.value).forEach((c) => c.resize())
}

onMounted(() => {
  loadOverview()
  loadBudgets()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  Object.values(dimChartInstances.value).forEach((c) => c.dispose())
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 18px 20px;
  }

  .kpi-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .kpi-value {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }

  .kpi-sub {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .kpi-health {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    margin-top: 8px;
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.budget-tabs {
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

.section-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  &.alert-section {
    background: #fef0f0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

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

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.dimension-card {
  border: 1px solid #ebeef5 !important;
  box-shadow: none !important;
  border-radius: 10px;

  :deep(.el-card__body) {
    padding: 16px;
  }

  .dim-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;

    .dim-icon {
      font-size: 24px;
    }

    .dim-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .dim-total {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }
  }

  .dim-chart {
    width: 100%;
    height: 200px;
  }
}

.trend-chart {
  width: 100%;
  height: 320px;
}
</style>
