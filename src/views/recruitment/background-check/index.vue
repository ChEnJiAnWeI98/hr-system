<template>
  <div class="page-container">
    <el-scrollbar class="content-scrollbar">
      <el-tabs v-model="activeTab" class="bg-tabs" @tab-change="handleTabChange">
        <!-- Tab 1: 订单管理 -->
        <el-tab-pane label="背调订单" name="orders">
          <!-- 筛选 -->
          <el-card class="filter-card">
            <el-form :model="orderQuery">
              <div class="filter-form-content">
                <el-form-item label="订单编号">
                  <el-input v-model="orderQuery.orderNo" placeholder="请输入订单编号" clearable style="width: 180px" />
                </el-form-item>
                <el-form-item label="候选人">
                  <el-input v-model="orderQuery.candidateName" placeholder="请输入姓名" clearable style="width: 150px" />
                </el-form-item>
                <el-form-item label="订单状态">
                  <el-select v-model="orderQuery.status" clearable placeholder="全部" style="width: 140px">
                    <el-option label="待发起" :value="0" />
                    <el-option label="待授权" :value="1" />
                    <el-option label="调查中" :value="2" />
                    <el-option label="已完成" :value="3" />
                    <el-option label="授权超期" :value="4" />
                    <el-option label="已取消" :value="5" />
                  </el-select>
                </el-form-item>
                <el-form-item label="服务商">
                  <el-select v-model="orderQuery.vendor" clearable placeholder="全部" style="width: 140px">
                    <el-option label="北森背调" :value="1" />
                    <el-option label="i背调" :value="2" />
                    <el-option label="大易背调" :value="3" />
                    <el-option label="手工模式" :value="4" />
                  </el-select>
                </el-form-item>
                <el-form-item label=" ">
                  <div class="filter-buttons">
                    <el-button type="primary" @click="loadOrders">查询</el-button>
                    <el-button @click="resetOrderQuery">重置</el-button>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>

          <!-- 数据卡片 -->
          <el-card class="data-card">
            <div class="section-header">
              <div class="section-title">背调订单列表</div>
              <div class="section-actions">
                <el-button type="primary" @click="openOrderDialog()">
                  <el-icon><Plus /></el-icon>
                  发起背调
                </el-button>
              </div>
            </div>

            <el-table :data="orderList" stripe>
              <el-table-column prop="orderNo" label="订单编号" width="150" />
              <el-table-column prop="candidateName" label="候选人" width="100" />
              <el-table-column label="手机号" width="140">
                <template #default="{ row }">{{ maskPhone(row.phone) }}</template>
              </el-table-column>
              <el-table-column prop="position" label="意向职位" width="160" />
              <el-table-column label="套餐" width="130">
                <template #default="{ row }">
                  <el-tag :type="BG_PACKAGE_LEVEL_MAP[row.packageLevel].type" size="small">
                    {{ row.packageName }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="服务商" width="120">
                <template #default="{ row }">{{ BG_VENDOR_MAP[row.vendor] }}</template>
              </el-table-column>
              <el-table-column label="订单状态" width="130" align="center">
                <template #default="{ row }">
                  <el-tag :type="BG_STATUS_MAP[row.status].type" size="small">
                    {{ BG_STATUS_MAP[row.status].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="结论" width="110" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.conclusion" :type="BG_CONCLUSION_MAP[row.conclusion].type" size="small">
                    {{ BG_CONCLUSION_MAP[row.conclusion].label }}
                  </el-tag>
                  <span v-else>—</span>
                </template>
              </el-table-column>
              <el-table-column label="风险等级" width="110" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.riskLevel" :type="BG_RISK_LEVEL_MAP[row.riskLevel].type" size="small">
                    {{ BG_RISK_LEVEL_MAP[row.riskLevel].label }}
                  </el-tag>
                  <span v-else>—</span>
                </template>
              </el-table-column>
              <el-table-column label="费用" width="110" align="right">
                <template #default="{ row }">¥ {{ (row.cost || 0).toLocaleString('zh-CN') }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column label="操作" width="280" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="row.status === 0" link type="primary" @click="handleSendAuth(row)">发送授权</el-button>
                  <el-button v-if="row.status === 1" link type="success" @click="handleSimulateAuth(row)">模拟授权</el-button>
                  <el-button v-if="row.status === 1" link @click="handleCopyAuth(row)">复制链接</el-button>
                  <el-button v-if="row.status === 2" link type="success" @click="handleSimulateComplete(row)">模拟完成</el-button>
                  <el-button v-if="row.status === 3" link type="primary" @click="handleViewReport(row)">查看报告</el-button>
                  <el-button link @click="showOrderDetail(row)">详情</el-button>
                  <el-button v-if="[0, 1, 2].includes(row.status)" link type="danger" @click="handleCancel(row)">取消</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="audit-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>敏感信息（身份证/手机号）已自动脱敏；查看完整信息需要 HR 总监及以上权限（对应业务规则 BG-005）</span>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 套餐配置 -->
        <el-tab-pane label="背调套餐" name="packages">
          <el-card class="data-card">
            <div class="section-header">
              <div class="section-title">背调套餐配置</div>
              <div class="section-actions">
                <el-button type="primary" @click="openPackageDialog()">
                  <el-icon><Plus /></el-icon>
                  新增套餐
                </el-button>
              </div>
            </div>

            <el-table :data="packageList" stripe>
              <el-table-column prop="name" label="套餐名称" width="160" />
              <el-table-column label="等级" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="BG_PACKAGE_LEVEL_MAP[row.level].type" size="small">
                    {{ BG_PACKAGE_LEVEL_MAP[row.level].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="调查项" min-width="360">
                <template #default="{ row }">
                  <el-tag
                    v-for="t in row.itemTypes"
                    :key="t"
                    size="small"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ BG_ITEM_TYPE_MAP[t] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="defaultForLevel" label="默认适用职级" width="140" />
              <el-table-column prop="defaultForJobFamily" label="默认适用岗位族" width="160" />
              <el-table-column label="单次成本" width="140" align="right">
                <template #default="{ row }">¥ {{ row.cost.toLocaleString('zh-CN') }}</template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openPackageDialog(row)">编辑</el-button>
                  <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="togglePackageStatus(row)">
                    {{ row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
                  <el-button link type="danger" @click="deletePackage(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 费用统计 -->
        <el-tab-pane label="费用统计" name="cost">
          <div class="cost-kpi-grid">
            <el-card class="kpi-card">
              <div class="kpi-label">总订单数</div>
              <div class="kpi-value">{{ costStats.totalOrders || 0 }}</div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-label">已完成</div>
              <div class="kpi-value">{{ costStats.completedOrders || 0 }}</div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-label">总费用</div>
              <div class="kpi-value">¥ {{ (costStats.totalCost || 0).toLocaleString('zh-CN') }}</div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-label">单订单均费</div>
              <div class="kpi-value">¥ {{ (costStats.avgCost || 0).toLocaleString('zh-CN') }}</div>
            </el-card>
          </div>

          <el-card class="chart-card">
            <div class="chart-header">
              <span class="chart-title">近 6 个月背调趋势</span>
            </div>
            <div ref="trendChartRef" class="trend-chart"></div>
          </el-card>

          <div class="cost-dual-grid">
            <el-card class="chart-card">
              <div class="chart-header">
                <span class="chart-title">按服务商分布</span>
              </div>
              <div ref="vendorChartRef" class="mini-chart"></div>
            </el-card>
            <el-card class="chart-card">
              <div class="chart-header">
                <span class="chart-title">按套餐等级分布</span>
              </div>
              <div ref="levelChartRef" class="mini-chart"></div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <!-- 发起背调 / 编辑订单 -->
    <el-dialog
      v-model="orderDialogVisible"
      :title="orderForm.id ? '编辑背调订单' : '发起背调'"
      width="640px"
    >
      <el-form ref="orderFormRef" :model="orderForm" :rules="orderRules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="候选人姓名" prop="candidateName">
              <CandidatePicker v-model="orderForm.candidateName" @select="onCandidatePick" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="orderForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="orderForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idNumber">
              <el-input v-model="orderForm.idNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向职位" prop="position">
              <el-input v-model="orderForm.position" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向部门">
              <el-input v-model="orderForm.department" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="背调套餐" prop="packageId">
              <el-select v-model="orderForm.packageId" style="width: 100%" @change="onPackageChange">
                <el-option
                  v-for="p in activePackages"
                  :key="p.id"
                  :label="`${p.name}（¥${p.cost}）`"
                  :value="p.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务商" prop="vendor">
              <el-select v-model="orderForm.vendor" style="width: 100%">
                <el-option label="北森背调" :value="1" />
                <el-option label="i背调" :value="2" />
                <el-option label="大易背调" :value="3" />
                <el-option label="手工模式" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveOrder">确定</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情 -->
    <el-dialog v-model="detailVisible" title="背调订单详情" width="780px">
      <el-tabs v-if="detailData" v-model="detailTab">
        <el-tab-pane label="基本信息" name="info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单编号">{{ detailData.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="当前状态">
              <el-tag :type="BG_STATUS_MAP[detailData.status].type" size="small">
                {{ BG_STATUS_MAP[detailData.status].label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="候选人">{{ detailData.candidateName }}</el-descriptions-item>
            <el-descriptions-item label="意向职位">{{ detailData.position }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ maskPhone(detailData.phone) }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ maskIdNumber(detailData.idNumber) }}</el-descriptions-item>
            <el-descriptions-item label="邮箱" :span="2">{{ detailData.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="背调套餐">{{ detailData.packageName }}</el-descriptions-item>
            <el-descriptions-item label="服务商">{{ BG_VENDOR_MAP[detailData.vendor] }}</el-descriptions-item>
            <el-descriptions-item label="费用">¥ {{ detailData.cost.toLocaleString('zh-CN') }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ detailData.createdByName }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
            <el-descriptions-item label="授权截止">{{ detailData.authExpireTime || '-' }}</el-descriptions-item>
            <el-descriptions-item v-if="detailData.cancelReason" label="取消原因" :span="2">
              {{ detailData.cancelReason }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="调查项进度" name="items">
          <el-table :data="detailData.checkItems" stripe>
            <el-table-column prop="name" label="调查项" width="160" />
            <el-table-column label="状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="BG_ITEM_STATUS_MAP[row.status].type" size="small">
                  {{ BG_ITEM_STATUS_MAP[row.status].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="核验结论" min-width="240" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>

        <el-tab-pane v-if="detailData.status === 3" label="背调报告" name="report">
          <div class="report-section">
            <div class="report-header">
              <div class="report-conclusion">
                <span class="report-conclusion-label">核验结论：</span>
                <el-tag :type="BG_CONCLUSION_MAP[detailData.conclusion!].type" size="large">
                  {{ BG_CONCLUSION_MAP[detailData.conclusion!].label }}
                </el-tag>
              </div>
              <div class="report-risk">
                <span class="report-risk-label">风险等级：</span>
                <el-tag :type="BG_RISK_LEVEL_MAP[detailData.riskLevel!].type" size="large">
                  {{ BG_RISK_LEVEL_MAP[detailData.riskLevel!].label }}
                </el-tag>
              </div>
            </div>
            <el-alert
              :title="detailData.riskSummary || ''"
              :type="detailData.conclusion === 1 ? 'success' : detailData.conclusion === 2 ? 'warning' : 'error'"
              show-icon
              :closable="false"
              style="margin: 16px 0"
            />
            <div class="report-file">
              <el-icon :size="36"><Document /></el-icon>
              <div class="report-file-info">
                <div class="report-file-name">{{ detailData.reportFileName }}</div>
                <div class="report-file-time">完成时间：{{ detailData.completeTime }}</div>
              </div>
              <el-button type="primary" @click="handleDownloadReport(detailData)">
                <el-icon><Download /></el-icon>
                下载报告
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 套餐编辑 -->
    <el-dialog
      v-model="packageDialogVisible"
      :title="packageForm.id ? '编辑背调套餐' : '新增背调套餐'"
      width="600px"
    >
      <el-form ref="packageFormRef" :model="packageForm" :rules="packageRules" label-width="120px">
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="packageForm.name" />
        </el-form-item>
        <el-form-item label="套餐等级" prop="level">
          <el-select v-model="packageForm.level" style="width: 100%">
            <el-option label="基础" value="basic" />
            <el-option label="标准" value="standard" />
            <el-option label="高管" value="executive" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="调查项" prop="itemTypes">
          <el-checkbox-group v-model="packageForm.itemTypes">
            <el-checkbox v-for="(label, type) in BG_ITEM_TYPE_MAP" :key="type" :value="type">
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="单次成本" prop="cost">
          <el-input v-model.number="packageForm.cost">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="默认职级">
          <el-input v-model="packageForm.defaultForLevel" placeholder="如 P5-P7 / 全部" />
        </el-form-item>
        <el-form-item label="默认岗位族">
          <el-select v-model="packageForm.defaultForJobFamily" style="width: 100%" clearable>
            <el-option label="技术研发" value="技术研发" />
            <el-option label="产品设计" value="产品设计" />
            <el-option label="运营市场" value="运营市场" />
            <el-option label="职能支持" value="职能支持" />
            <el-option label="管理岗位" value="管理岗位" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="packageForm.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="packageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePackage">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Download, Document, InfoFilled } from '@element-plus/icons-vue'
import CandidatePicker from '@/views/recruitment/_shared/CandidatePicker.vue'
import type { Resume } from '@/types/recruitment'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  bgOrderApi,
  bgPackageApi,
  sendAuthLink,
  simulateAuth,
  simulateComplete,
  cancelBGOrder,
  getBGCostStats
} from '@/api/backgroundCheck'
import {
  BG_STATUS_MAP,
  BG_VENDOR_MAP,
  BG_PACKAGE_LEVEL_MAP,
  BG_CONCLUSION_MAP,
  BG_RISK_LEVEL_MAP,
  BG_ITEM_TYPE_MAP,
  BG_ITEM_STATUS_MAP,
  maskPhone,
  maskIdNumber,
  type BackgroundCheck,
  type BackgroundCheckPackage,
  type BGCostStats,
  type BGItemType
} from '@/types/backgroundCheck'

defineOptions({ name: 'RecruitmentBackgroundCheck' })

const route = useRoute()
const router = useRouter()

// 选中简历池候选人 → 预填关联字段
const onCandidatePick = (r: Resume) => {
  orderForm.candidateName = r.candidateName
  if (r.phone) orderForm.phone = r.phone
  if (r.email) orderForm.email = r.email
  if (r.position) orderForm.position = r.position
}

const activeTab = ref<'orders' | 'packages' | 'cost'>('orders')

/* ========== 订单列表 ========== */
const orderList = ref<BackgroundCheck[]>([])
const orderQuery = reactive({
  orderNo: '',
  candidateName: '',
  status: null as number | null,
  vendor: null as number | null
})

const loadOrders = async () => {
  const res = await bgOrderApi.getList({ ...orderQuery, pageSize: 100 })
  orderList.value = res.data?.list || []
}

const resetOrderQuery = () => {
  orderQuery.orderNo = ''
  orderQuery.candidateName = ''
  orderQuery.status = null
  orderQuery.vendor = null
  loadOrders()
}

/* ========== 套餐列表 ========== */
const packageList = ref<BackgroundCheckPackage[]>([])
const activePackages = computed(() => packageList.value.filter((p) => p.status === 1))

const loadPackages = async () => {
  const res = await bgPackageApi.getList({ pageSize: 100 })
  packageList.value = res.data?.list || []
}

/* ========== 费用统计 ========== */
const costStats = ref<Partial<BGCostStats>>({})
const trendChartRef = ref<HTMLElement>()
const vendorChartRef = ref<HTMLElement>()
const levelChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let vendorChart: echarts.ECharts | null = null
let levelChart: echarts.ECharts | null = null

const loadCostStats = async () => {
  const res = await getBGCostStats()
  costStats.value = res.data
  await nextTick()
  renderCostCharts()
}

const renderCostCharts = () => {
  // 趋势图
  if (trendChartRef.value) {
    if (!trendChart) trendChart = echarts.init(trendChartRef.value)
    const trend = costStats.value.monthlyTrend || []
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      grid: { left: 50, right: 60, top: 30, bottom: 50 },
      xAxis: { type: 'category', data: trend.map((t) => t.month) },
      yAxis: [
        { type: 'value', name: '订单数', position: 'left' },
        { type: 'value', name: '费用(元)', position: 'right' }
      ],
      series: [
        {
          name: '订单数',
          type: 'bar',
          data: trend.map((t) => t.orderCount),
          itemStyle: { color: '#409eff' }
        },
        {
          name: '费用',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: trend.map((t) => t.cost),
          itemStyle: { color: '#e6a23c' },
          symbolSize: 8
        }
      ]
    } as EChartsOption)
  }

  // 服务商分布
  if (vendorChartRef.value) {
    if (!vendorChart) vendorChart = echarts.init(vendorChartRef.value)
    const byVendor = costStats.value.byVendor || []
    vendorChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
      legend: { bottom: 0, itemWidth: 12, itemHeight: 12 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          label: { formatter: '{b}\n{d}%', fontSize: 12 },
          data: byVendor.map((v) => ({
            name: BG_VENDOR_MAP[v.vendor],
            value: v.count
          }))
        }
      ]
    } as EChartsOption)
  }

  // 套餐等级分布
  if (levelChartRef.value) {
    if (!levelChart) levelChart = echarts.init(levelChartRef.value)
    const byLevel = costStats.value.byLevel || []
    levelChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 50, right: 30, top: 30, bottom: 40 },
      xAxis: { type: 'category', data: byLevel.map((l: any) => BG_PACKAGE_LEVEL_MAP[l.level]?.label || l.level) },
      yAxis: { type: 'value' },
      series: [
        {
          name: '订单数',
          type: 'bar',
          data: byLevel.map((l: any) => l.count),
          itemStyle: { color: '#67c23a' },
          barWidth: 32
        }
      ]
    } as EChartsOption)
  }
}

/* ========== Tab 切换 ========== */
const handleTabChange = () => {
  if (activeTab.value === 'orders') loadOrders()
  else if (activeTab.value === 'packages') loadPackages()
  else if (activeTab.value === 'cost') loadCostStats()
}

/* ========== 订单新增 / 编辑 ========== */
const orderDialogVisible = ref(false)
const orderFormRef = ref<FormInstance>()
const orderForm = reactive<Partial<BackgroundCheck>>({
  id: undefined,
  candidateName: '',
  phone: '',
  email: '',
  idNumber: '',
  position: '',
  department: '',
  packageId: undefined,
  packageName: '',
  packageLevel: 'standard',
  vendor: 1,
  cost: 0,
  status: 0,
  checkItems: []
})
const orderRules = {
  candidateName: [{ required: true, message: '请输入候选人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  idNumber: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  position: [{ required: true, message: '请输入意向职位', trigger: 'blur' }],
  packageId: [{ required: true, message: '请选择背调套餐', trigger: 'change' }],
  vendor: [{ required: true, message: '请选择服务商', trigger: 'change' }]
}

const resetOrderForm = () => {
  orderForm.id = undefined
  orderForm.candidateName = ''
  orderForm.phone = ''
  orderForm.email = ''
  orderForm.idNumber = ''
  orderForm.position = ''
  orderForm.department = ''
  orderForm.packageId = undefined
  orderForm.packageName = ''
  orderForm.packageLevel = 'standard'
  orderForm.vendor = 1
  orderForm.cost = 0
  orderForm.status = 0
  orderForm.checkItems = []
}

const openOrderDialog = async () => {
  resetOrderForm()
  if (packageList.value.length === 0) await loadPackages()
  orderDialogVisible.value = true
}

const onPackageChange = (id: number) => {
  const p = packageList.value.find((x) => x.id === id)
  if (p) {
    orderForm.packageName = p.name
    orderForm.packageLevel = p.level
    orderForm.cost = p.cost
    orderForm.checkItems = p.itemTypes.map((t, idx) => ({
      id: idx + 1,
      type: t as BGItemType,
      name: BG_ITEM_TYPE_MAP[t as BGItemType],
      status: 'pending',
      result: '',
      remark: ''
    }))
  }
}

const saveOrder = async () => {
  await orderFormRef.value?.validate()
  const now = new Date()
  const orderNo = `BG${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    Math.floor(Math.random() * 900) + 100
  )}`
  await bgOrderApi.add({
    ...orderForm,
    orderNo,
    createdById: 3,
    createdByName: '张HR',
    status: 0
  })
  ElMessage.success('背调订单已创建')
  orderDialogVisible.value = false
  loadOrders()
  // 从候选人详情页跳转来，提交成功后返回
  if (route.query.from === 'detail') {
    router.back()
  }
}

/* ========== 订单操作 ========== */
const handleSendAuth = async (row: BackgroundCheck) => {
  try {
    await ElMessageBox.confirm(`确定向「${row.candidateName}」发送背调授权链接吗？`, '发送授权', {
      type: 'info'
    })
    await sendAuthLink(row.id)
    ElMessage.success('授权链接已发送，候选人需在 7 天内完成授权')
    loadOrders()
  } catch {}
}

const handleSimulateAuth = async (row: BackgroundCheck) => {
  try {
    await ElMessageBox.confirm(
      `该功能为演示用途：模拟「${row.candidateName}」在线完成授权，订单将进入调查中状态。真实场景下由候选人通过授权链接自行授权。`,
      '模拟候选人授权',
      { type: 'warning' }
    )
    await simulateAuth(row.id)
    ElMessage.success('候选人已授权，订单进入调查中')
    loadOrders()
  } catch {}
}

const handleSimulateComplete = async (row: BackgroundCheck) => {
  try {
    await ElMessageBox.confirm(
      `该功能为演示用途：模拟第三方背调机构完成全部调查项，订单将标记为已完成并生成报告。`,
      '模拟完成调查',
      { type: 'warning' }
    )
    await simulateComplete(row.id)
    ElMessage.success('背调已完成，报告已生成')
    loadOrders()
  } catch {}
}

const handleCopyAuth = async (row: BackgroundCheck) => {
  if (!row.authUrl) return
  await navigator.clipboard.writeText(row.authUrl)
  ElMessage.success('授权链接已复制')
}

const handleCancel = async (row: BackgroundCheck) => {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      `确定取消「${row.candidateName}」的背调订单吗？`,
      '取消订单',
      {
        type: 'warning',
        inputPlaceholder: '请输入取消原因',
        inputValidator: (v) => (v && v.trim() ? true : '请输入取消原因')
      }
    )
    await cancelBGOrder(row.id, reason)
    ElMessage.success('订单已取消')
    loadOrders()
  } catch {}
}

const handleViewReport = (row: BackgroundCheck) => {
  detailData.value = row
  detailTab.value = 'report'
  detailVisible.value = true
}

const handleDownloadReport = (row: BackgroundCheck) => {
  ElMessageBox.alert(
    `报告下载演示：\n\n文件名：${row.reportFileName}\n\n真实环境下会从 ${BG_VENDOR_MAP[row.vendor]} 拉取 PDF 文件。`,
    '报告下载',
    { confirmButtonText: '我知道了', type: 'info' }
  )
}

/* ========== 订单详情 ========== */
const detailVisible = ref(false)
const detailTab = ref<'info' | 'items' | 'report'>('info')
const detailData = ref<BackgroundCheck | null>(null)

const showOrderDetail = (row: BackgroundCheck) => {
  detailData.value = row
  detailTab.value = 'info'
  detailVisible.value = true
}

/* ========== 套餐 CRUD ========== */
const packageDialogVisible = ref(false)
const packageFormRef = ref<FormInstance>()
const packageForm = reactive<Partial<BackgroundCheckPackage>>({
  id: undefined,
  name: '',
  level: 'standard',
  itemTypes: [],
  defaultForLevel: '',
  defaultForJobFamily: '',
  cost: 0,
  description: '',
  status: 1
})
const packageRules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }],
  itemTypes: [{ required: true, message: '请选择至少一项调查项', type: 'array', min: 1, trigger: 'change' }],
  cost: [{ required: true, message: '请输入成本', trigger: 'blur' }]
}

const resetPackageForm = () => {
  packageForm.id = undefined
  packageForm.name = ''
  packageForm.level = 'standard'
  packageForm.itemTypes = []
  packageForm.defaultForLevel = ''
  packageForm.defaultForJobFamily = ''
  packageForm.cost = 0
  packageForm.description = ''
  packageForm.status = 1
}

const openPackageDialog = (row?: BackgroundCheckPackage) => {
  resetPackageForm()
  if (row) Object.assign(packageForm, row, { itemTypes: [...row.itemTypes] })
  packageDialogVisible.value = true
}

const savePackage = async () => {
  await packageFormRef.value?.validate()
  if (packageForm.id) {
    await bgPackageApi.update(packageForm)
    ElMessage.success('套餐已更新')
  } else {
    await bgPackageApi.add(packageForm)
    ElMessage.success('套餐已新增')
  }
  packageDialogVisible.value = false
  loadPackages()
}

const togglePackageStatus = async (row: BackgroundCheckPackage) => {
  await bgPackageApi.updateStatus(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  loadPackages()
}

const deletePackage = async (row: BackgroundCheckPackage) => {
  try {
    await ElMessageBox.confirm(`确定删除套餐「${row.name}」吗？`, '确认', { type: 'warning' })
    await bgPackageApi.delete(row.id)
    ElMessage.success('已删除')
    loadPackages()
  } catch {}
}

/* ========== 生命周期 ========== */
const handleResize = () => {
  trendChart?.resize()
  vendorChart?.resize()
  levelChart?.resize()
}

onMounted(async () => {
  loadOrders()
  loadPackages()
  window.addEventListener('resize', handleResize)
  // 候选人详情页跳转而来：自动打开发起背调 Dialog 并预填
  if (route.query.prefill === 'new') {
    await openOrderDialog()
    const q = route.query
    if (q.candidateName) orderForm.candidateName = String(q.candidateName)
    if (q.phone) orderForm.phone = String(q.phone)
    if (q.email) orderForm.email = String(q.email)
    if (q.position) orderForm.position = String(q.position)
    const from = route.query.from
    router.replace({ query: from ? { from: String(from) } : {} })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  vendorChart?.dispose()
  levelChart?.dispose()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.bg-tabs {
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

.filter-card,
.data-card,
.chart-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-card :deep(.el-card__body) {
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
}

.audit-hint {
  margin-top: 12px;
  padding: 8px 12px;
  background: #f0f9eb;
  border-radius: 6px;
  font-size: 12px;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cost-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .kpi-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
  }

  .kpi-value {
    font-size: 26px;
    font-weight: 700;
    color: #303133;
  }
}

.cost-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}

.trend-chart {
  width: 100%;
  height: 340px;
}

.mini-chart {
  width: 100%;
  height: 300px;
}

.report-section {
  .report-header {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 16px;
    background: #fafbfc;
    border-radius: 8px;

    .report-conclusion-label,
    .report-risk-label {
      font-size: 14px;
      color: #606266;
      margin-right: 8px;
    }
  }

  .report-file {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #fafbfc;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;

    .el-icon {
      color: #409eff;
    }

    .report-file-info {
      flex: 1;

      .report-file-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }

      .report-file-time {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}
</style>
