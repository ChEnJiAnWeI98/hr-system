<template>
  <div class="page-container">
    <!-- 顶部 NPS 总览 · 5 张 KPI 卡 + 色阶条 / 占比条 -->
    <div class="nps-overview">
      <el-card class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" :style="{ background: getNPSColor(stats.npsScore || 0) }">
            <el-icon :size="22"><Medal /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">候选人满意度 NPS</div>
            <div class="kpi-value" :style="{ color: getNPSColor(stats.npsScore || 0) }">
              {{ stats.npsScore ?? '—' }}
            </div>
            <div class="kpi-bar gradient">
              <div class="kpi-bar-marker" :style="{ left: npsPosition + '%' }"></div>
            </div>
            <div class="kpi-sub">{{ getNPSComment(stats.npsScore || 0) }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" style="background: #67c23a">
            <el-icon :size="22"><CircleCheck /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">推荐者</div>
            <div class="kpi-value">
              <span style="color: #67c23a">{{ stats.promoterCount || 0 }}</span>
              <span class="kpi-ratio">{{ promoterRate }}%</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill" :style="{ width: promoterRate + '%', background: '#67c23a' }"></div>
            </div>
            <div class="kpi-sub">9-10 分</div>
          </div>
        </div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" style="background: #e6a23c">
            <el-icon :size="22"><Warning /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">中立者</div>
            <div class="kpi-value">
              <span style="color: #e6a23c">{{ stats.passiveCount || 0 }}</span>
              <span class="kpi-ratio">{{ passiveRate }}%</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill" :style="{ width: passiveRate + '%', background: '#e6a23c' }"></div>
            </div>
            <div class="kpi-sub">7-8 分</div>
          </div>
        </div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" style="background: #f56c6c">
            <el-icon :size="22"><CircleClose /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">贬损者</div>
            <div class="kpi-value">
              <span style="color: #f56c6c">{{ stats.detractorCount || 0 }}</span>
              <span class="kpi-ratio">{{ detractorRate }}%</span>
            </div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill" :style="{ width: detractorRate + '%', background: '#f56c6c' }"></div>
            </div>
            <div class="kpi-sub">0-6 分</div>
          </div>
        </div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon" style="background: #909399">
            <el-icon :size="22"><Document /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">总调研数</div>
            <div class="kpi-value">{{ stats.totalSurveys || 0 }}</div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill" style="width: 100%; background: #c0c4cc"></div>
            </div>
            <div class="kpi-sub">累计</div>
          </div>
        </div>
      </el-card>
    </div>


    <el-scrollbar class="content-scrollbar">
      <PageTabs v-model="activeTab" class="nps-tabs" @tab-change="handleTabChange">
        <!-- Tab 1: 调研看板 -->
        <el-tab-pane label="调研看板" name="dashboard">
          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">按调研节点的 NPS</div>
            </div>
            <div class="stage-grid">
              <el-card v-for="s in stats.byStage || []" :key="s.stage" class="stage-card">
                <div class="stage-header">
                  <el-tag :style="{ background: NPS_STAGE_MAP[s.stage].color, color: '#fff', border: 'none' }">
                    {{ NPS_STAGE_MAP[s.stage].label }}
                  </el-tag>
                  <span class="stage-count">{{ s.count }} 份</span>
                </div>
                <div class="stage-score" :style="{ color: getNPSColor(s.npsScore) }">
                  NPS {{ s.npsScore }}
                </div>
                <div class="stage-bar">
                  <div class="stage-bar-item promoter" :style="{ width: s.promoterRate + '%' }">
                    <span v-if="s.promoterRate >= 15">推荐 {{ s.promoterRate }}%</span>
                  </div>
                  <div
                    class="stage-bar-item passive"
                    :style="{ width: 100 - s.promoterRate - s.detractorRate + '%' }"
                  ></div>
                  <div class="stage-bar-item detractor" :style="{ width: s.detractorRate + '%' }">
                    <span v-if="s.detractorRate >= 15">贬损 {{ s.detractorRate }}%</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-card>

          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">近 6 个月 NPS 趋势</div>
            </div>
            <div ref="trendChartRef" class="trend-chart"></div>
          </el-card>

          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">Top 反馈标签</div>
              <div class="section-hint">来自所有反馈的高频词，按分类着色</div>
            </div>
            <div class="tag-cloud">
              <span
                v-for="t in stats.topTags || []"
                :key="t.tag"
                class="tag-item"
                :style="{
                  background: NPS_CATEGORY_MAP[t.category].color,
                  fontSize: 12 + t.count * 1 + 'px'
                }"
              >
                {{ t.tag }} <small>×{{ t.count }}</small>
              </span>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 调研模板配置 -->
        <el-tab-pane label="调研模板" name="templates">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">三节点调研模板</div>
                <div class="section-hint">投递后 3 天 / 面试后 1 天 / 入职后 7 天自动触发</div>
              </div>
              <el-button type="primary" @click="openTemplateDialog()">
                <el-icon><Plus /></el-icon>
                新增模板
              </el-button>
            </div>
            <el-table :data="templateList" stripe>
              <el-table-column label="调研节点" width="150" align="center">
                <template #default="{ row }">
                  <el-tag :style="{ background: NPS_STAGE_MAP[row.stage].color, color: '#fff', border: 'none' }">
                    {{ NPS_STAGE_MAP[row.stage].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="模板名称" min-width="200" />
              <el-table-column prop="title" label="调研标题" min-width="220" />
              <el-table-column label="问题数" width="100" align="center">
                <template #default="{ row }">{{ row.questions.length }} 题</template>
              </el-table-column>
              <el-table-column label="触发延迟" width="110" align="center">
                <template #default="{ row }">{{ row.triggerDelayDays }} 天后</template>
              </el-table-column>
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.enabled === 1 ? 'success' : 'info'" size="small">
                    {{ row.enabled === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openTemplateDialog(row)">编辑</el-button>
                  <el-button link @click="previewTemplate(row)">预览</el-button>
                  <el-button link :type="row.enabled === 1 ? 'warning' : 'success'" @click="toggleTemplate(row)">
                    {{ row.enabled === 1 ? '禁用' : '启用' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 反馈列表 -->
        <el-tab-pane label="反馈列表" name="surveys">
          <el-card class="filter-card">
            <div class="filter-content">
              <el-form :model="surveyQuery" inline>
                <el-form-item label="调研节点">
                  <el-select v-model="surveyQuery.stage" clearable placeholder="全部" style="width: 160px">
                    <el-option label="投递后" value="post_apply" />
                    <el-option label="面试后" value="post_interview" />
                    <el-option label="入职后" value="post_onboard" />
                  </el-select>
                </el-form-item>
                <el-form-item label="分类">
                  <el-select v-model="surveyQuery.category" clearable placeholder="全部" style="width: 140px">
                    <el-option label="推荐者" value="promoter" />
                    <el-option label="中立者" value="passive" />
                    <el-option label="贬损者" value="detractor" />
                  </el-select>
                </el-form-item>
                <el-form-item label="候选人">
                  <el-input v-model="surveyQuery.candidateName" placeholder="姓名" style="width: 160px" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="loadSurveys">查询</el-button>
                  <el-button @click="resetSurveyQuery">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="section-card">
            <el-table :data="surveyList" stripe>
              <el-table-column prop="surveyTime" label="调研时间" width="170" />
              <el-table-column prop="candidateName" label="候选人" width="110" />
              <el-table-column prop="position" label="职位" width="160" />
              <el-table-column label="节点" width="110">
                <template #default="{ row }">
                  {{ NPS_STAGE_MAP[row.stage].label }}
                </template>
              </el-table-column>
              <el-table-column label="分数" width="120" align="center">
                <template #default="{ row }">
                  <div class="score-cell">
                    <span :style="{ color: NPS_CATEGORY_MAP[row.category].color, fontSize: 18, fontWeight: 700 }">
                      {{ row.score }}
                    </span>
                    <span class="score-max">/ 10</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="分类" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="NPS_CATEGORY_MAP[row.category].type" size="small">
                    {{ NPS_CATEGORY_MAP[row.category].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="feedback" label="文字反馈" min-width="280" show-overflow-tooltip />
              <el-table-column label="标签" min-width="180">
                <template #default="{ row }">
                  <el-tag
                    v-for="t in row.tags"
                    :key="t"
                    size="small"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ t }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="showSurveyDetail(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 4: 改进建议 -->
        <el-tab-pane label="改进建议" name="improvements">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">基于贬损者反馈的改进建议</div>
                <div class="section-hint">AI 对贬损者文字反馈做问题聚类，给出可执行的改进措施</div>
              </div>
            </div>
            <div class="improvement-list">
              <el-card v-for="imp in improvements" :key="imp.id" class="improvement-card">
                <div class="imp-header">
                  <div class="imp-title">
                    <el-tag
                      :type="imp.priority === 'high' ? 'danger' : imp.priority === 'medium' ? 'warning' : 'info'"
                      size="small"
                    >
                      {{ imp.priority === 'high' ? '高优' : imp.priority === 'medium' ? '中优' : '低优' }}
                    </el-tag>
                    <span class="imp-category">{{ imp.category }}</span>
                    <span class="imp-count">（{{ imp.feedbackCount }} 条相关反馈）</span>
                  </div>
                  <div class="imp-stages">
                    <el-tag
                      v-for="s in imp.stages"
                      :key="s"
                      size="small"
                      effect="plain"
                      style="margin-left: 6px"
                    >
                      {{ NPS_STAGE_MAP[s].label }}
                    </el-tag>
                  </div>
                </div>
                <div class="imp-body">
                  <div class="imp-subtitle">典型反馈摘录</div>
                  <ul class="imp-feedbacks">
                    <li v-for="(f, i) in imp.sampleFeedbacks" :key="i">"{{ f }}"</li>
                  </ul>
                  <div class="imp-subtitle">建议改进措施</div>
                  <ul class="imp-actions">
                    <li v-for="(a, i) in imp.suggestedActions" :key="i">{{ a }}</li>
                  </ul>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-tab-pane>
      </PageTabs>
    </el-scrollbar>

    <!-- 调研详情 -->
    <el-dialog v-model="surveyDetailVisible" title="调研详情" width="600px">
      <el-descriptions v-if="surveyDetail" :column="2" border>
        <el-descriptions-item label="候选人">{{ surveyDetail.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ surveyDetail.position }}</el-descriptions-item>
        <el-descriptions-item label="调研节点">{{ NPS_STAGE_MAP[surveyDetail.stage].label }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ surveyDetail.surveyTime }}</el-descriptions-item>
        <el-descriptions-item label="NPS 分数">
          <span :style="{ color: NPS_CATEGORY_MAP[surveyDetail.category].color, fontWeight: 700 }">
            {{ surveyDetail.score }} / 10
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-tag :type="NPS_CATEGORY_MAP[surveyDetail.category].type">
            {{ NPS_CATEGORY_MAP[surveyDetail.category].label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="文字反馈" :span="2">
          {{ surveyDetail.feedback || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="标签" :span="2">
          <el-tag
            v-for="t in surveyDetail.tags"
            :key="t"
            size="small"
            effect="plain"
            style="margin-right: 4px"
          >
            {{ t }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="surveyDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 模板编辑 -->
    <el-dialog v-model="templateDialogVisible" :title="templateForm.id ? '编辑调研模板' : '新增调研模板'" width="640px">
      <el-form ref="templateFormRef" :model="templateForm" :rules="templateRules" label-width="120px">
        <el-form-item label="调研节点" prop="stage">
          <el-select v-model="templateForm.stage" style="width: 100%">
            <el-option label="投递后" value="post_apply" />
            <el-option label="面试后" value="post_interview" />
            <el-option label="入职后" value="post_onboard" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="templateForm.name" />
        </el-form-item>
        <el-form-item label="调研标题">
          <el-input v-model="templateForm.title" />
        </el-form-item>
        <el-form-item label="调研副标题">
          <el-input v-model="templateForm.subtitle" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="触发延迟">
          <el-input v-model.number="templateForm.triggerDelayDays">
            <template #append>天后</template>
          </el-input>
        </el-form-item>
        <el-form-item label="问题数">
          <div class="muted">共 {{ templateForm.questions?.length || 0 }} 道题（暂不支持在弹窗内编辑题目，请在预览后在系统内微调）</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTemplate">确定</el-button>
      </template>
    </el-dialog>

    <!-- 模板预览 -->
    <el-dialog v-model="previewVisible" :title="previewTemplate_?.title || '模板预览'" width="560px">
      <div v-if="previewTemplate_" class="preview-body">
        <div class="preview-subtitle">{{ previewTemplate_.subtitle }}</div>
        <div v-for="q in previewTemplate_.questions" :key="q.id" class="preview-question">
          <div class="preview-q-title">
            <span v-if="q.required" style="color: #f56c6c">* </span>
            {{ q.title }}
          </div>
          <div class="preview-q-body">
            <el-rate
              v-if="q.type === 'score'"
              :max="10"
              show-score
              disabled
              :model-value="8"
            />
            <el-select v-else-if="q.type === 'single_choice'" disabled placeholder="单选" style="width: 100%">
              <el-option v-for="o in q.options" :key="o" :label="o" :value="o" />
            </el-select>
            <el-checkbox-group v-else-if="q.type === 'multi_choice'" disabled>
              <el-checkbox v-for="o in q.options" :key="o" :value="o">{{ o }}</el-checkbox>
            </el-checkbox-group>
            <el-input v-else-if="q.type === 'text'" disabled type="textarea" :rows="2" :placeholder="q.placeholder || ''" />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { Plus, Medal, CircleCheck, Warning, CircleClose, Document } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  npsTemplateApi,
  npsSurveyApi,
  getNPSStats,
  getImprovements
} from '@/api/nps'
import {
  NPS_STAGE_MAP,
  NPS_CATEGORY_MAP,
  type NPSTemplate,
  type NPSSurvey,
  type NPSStats,
  type NPSImprovement
} from '@/types/nps'

defineOptions({ name: 'RecruitmentNPS' })

const activeTab = ref<'dashboard' | 'templates' | 'surveys' | 'improvements'>('dashboard')

const stats = ref<Partial<NPSStats>>({})
const templateList = ref<NPSTemplate[]>([])
const surveyList = ref<NPSSurvey[]>([])
const improvements = ref<NPSImprovement[]>([])

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

// 占比与 NPS 位置
const total = computed(() => stats.value.totalSurveys || 0)
const promoterRate = computed(() => {
  if (total.value === 0) return 0
  return Math.round(((stats.value.promoterCount || 0) / total.value) * 100)
})
const passiveRate = computed(() => {
  if (total.value === 0) return 0
  return Math.round(((stats.value.passiveCount || 0) / total.value) * 100)
})
const detractorRate = computed(() => {
  if (total.value === 0) return 0
  return Math.round(((stats.value.detractorCount || 0) / total.value) * 100)
})
const npsPosition = computed(() => {
  const score = stats.value.npsScore ?? 0
  return Math.max(0, Math.min(100, ((score + 100) / 200) * 100))
})

/* ========== 加载 ========== */
const loadStats = async () => {
  const res = await getNPSStats()
  stats.value = res.data
  await nextTick()
  renderTrend()
}

const loadTemplates = async () => {
  const res = await npsTemplateApi.getList({ pageSize: 100 })
  templateList.value = res.data?.list || []
}

const surveyQuery = reactive({
  stage: '',
  category: '',
  candidateName: ''
})

const loadSurveys = async () => {
  const res = await npsSurveyApi.getList({ ...surveyQuery, pageSize: 100 })
  surveyList.value = (res.data?.list || []).sort((a: NPSSurvey, b: NPSSurvey) =>
    b.surveyTime.localeCompare(a.surveyTime)
  )
}

const resetSurveyQuery = () => {
  surveyQuery.stage = ''
  surveyQuery.category = ''
  surveyQuery.candidateName = ''
  loadSurveys()
}

const loadImprovements = async () => {
  const res = await getImprovements()
  improvements.value = res.data
}

const handleTabChange = () => {
  if (activeTab.value === 'surveys' && surveyList.value.length === 0) loadSurveys()
  if (activeTab.value === 'improvements' && improvements.value.length === 0) loadImprovements()
}

/* ========== 趋势图 ========== */
const renderTrend = () => {
  if (!trendChartRef.value || !stats.value.trend) return
  if (!trendChart) trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 60, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: stats.value.trend.map((t) => t.month) },
    yAxis: [
      { type: 'value', name: 'NPS', position: 'left' },
      { type: 'value', name: '调研数', position: 'right' }
    ],
    series: [
      {
        name: 'NPS 分数',
        type: 'line',
        smooth: true,
        data: stats.value.trend.map((t) => t.npsScore),
        itemStyle: { color: '#409eff' },
        symbolSize: 10,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.4)' },
              { offset: 1, color: 'rgba(64,158,255,0.05)' }
            ]
          }
        }
      },
      {
        name: '调研数',
        type: 'bar',
        yAxisIndex: 1,
        data: stats.value.trend.map((t) => t.totalSurveys),
        itemStyle: { color: '#e6a23c' },
        barWidth: 24
      }
    ]
  } as EChartsOption)
}

/* ========== 工具 ========== */
const getNPSColor = (nps: number): string => {
  if (nps >= 50) return '#67c23a'
  if (nps >= 30) return '#409eff'
  if (nps >= 0) return '#e6a23c'
  return '#f56c6c'
}

const getNPSComment = (nps: number): string => {
  if (nps >= 70) return '极佳 - 招聘体验行业领先'
  if (nps >= 50) return '优秀 - 候选人强烈认可'
  if (nps >= 30) return '良好 - 整体体验不错'
  if (nps >= 0) return '一般 - 有明显改进空间'
  return '较差 - 急需改进'
}

/* ========== 模板编辑 ========== */
const templateDialogVisible = ref(false)
const templateFormRef = ref<FormInstance>()
const templateForm = reactive<Partial<NPSTemplate>>({
  id: undefined,
  stage: 'post_apply',
  name: '',
  title: '',
  subtitle: '',
  questions: [],
  enabled: 1,
  triggerDelayDays: 3
})
const templateRules = {
  stage: [{ required: true, message: '请选择节点', trigger: 'change' }],
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
}

const resetTemplateForm = () => {
  templateForm.id = undefined
  templateForm.stage = 'post_apply'
  templateForm.name = ''
  templateForm.title = ''
  templateForm.subtitle = ''
  templateForm.questions = []
  templateForm.enabled = 1
  templateForm.triggerDelayDays = 3
}

const openTemplateDialog = (row?: NPSTemplate) => {
  resetTemplateForm()
  if (row) Object.assign(templateForm, row, { questions: [...row.questions] })
  templateDialogVisible.value = true
}

const saveTemplate = async () => {
  await templateFormRef.value?.validate()
  if (templateForm.id) {
    await npsTemplateApi.update(templateForm)
    ElMessage.success('模板已更新')
  } else {
    await npsTemplateApi.add(templateForm)
    ElMessage.success('模板已新增')
  }
  templateDialogVisible.value = false
  loadTemplates()
}

const toggleTemplate = async (row: NPSTemplate) => {
  await npsTemplateApi.updateStatus(row.id, row.enabled === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  loadTemplates()
}

/* ========== 模板预览 ========== */
const previewVisible = ref(false)
const previewTemplate_ = ref<NPSTemplate | null>(null)
const previewTemplate = (row: NPSTemplate) => {
  previewTemplate_.value = row
  previewVisible.value = true
}

/* ========== 调研详情 ========== */
const surveyDetailVisible = ref(false)
const surveyDetail = ref<NPSSurvey | null>(null)
const showSurveyDetail = (row: NPSSurvey) => {
  surveyDetail.value = row
  surveyDetailVisible.value = true
}

onMounted(() => {
  loadStats()
  loadTemplates()
})

onBeforeUnmount(() => {
  trendChart?.dispose()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nps-overview {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
    color: #fff;
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

  .kpi-ratio {
    font-size: 13px;
    color: #909399;
    font-weight: 400;
    margin-left: 6px;
  }

  .kpi-bar {
    height: 4px;
    background: #f0f2f5;
    border-radius: 2px;
    margin: 10px 0 6px;
    overflow: visible;
    position: relative;

    &.gradient {
      background: linear-gradient(90deg, #f56c6c 0%, #e6a23c 50%, #67c23a 100%);
    }
  }

  .kpi-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  .kpi-bar-marker {
    position: absolute;
    top: -7px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #303133;
    transform: translateX(-50%);
  }

  .kpi-sub {
    font-size: 12px;
    color: #909399;
    margin-top: 6px;
  }
}


.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.nps-tabs {
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

.section-card,
.filter-card {
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

.filter-content :deep(.el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
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

.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stage-card {
  border: 1px solid #ebeef5 !important;
  box-shadow: none !important;
  border-radius: 10px;

  :deep(.el-card__body) {
    padding: 16px;
  }

  .stage-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .stage-count {
      font-size: 13px;
      color: #909399;
    }
  }

  .stage-score {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .stage-bar {
    display: flex;
    height: 16px;
    border-radius: 4px;
    overflow: hidden;

    .stage-bar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;

      &.promoter {
        background: #67c23a;
      }
      &.passive {
        background: #e6a23c;
      }
      &.detractor {
        background: #f56c6c;
      }
    }
  }
}

.trend-chart {
  width: 100%;
  height: 320px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;

  .tag-item {
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 500;

    small {
      opacity: 0.8;
      margin-left: 2px;
    }
  }
}

.score-cell {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;

  .score-max {
    font-size: 12px;
    color: #909399;
  }
}

.improvement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.improvement-card {
  border: 1px solid #ebeef5 !important;
  box-shadow: none !important;
  border-radius: 10px;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .imp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .imp-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .imp-category {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .imp-count {
      font-size: 12px;
      color: #909399;
    }
  }

  .imp-body {
    .imp-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: #606266;
      margin: 8px 0;
    }

    .imp-feedbacks {
      background: #fafbfc;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      color: #606266;
      line-height: 1.8;
      margin: 0;

      li {
        list-style: none;
        font-style: italic;
      }
    }

    .imp-actions {
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      color: #303133;
      line-height: 1.8;
    }
  }
}

.preview-body {
  .preview-subtitle {
    color: #909399;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .preview-question {
    margin-bottom: 16px;

    .preview-q-title {
      font-size: 14px;
      color: #303133;
      margin-bottom: 6px;
    }
  }
}

.muted {
  font-size: 12px;
  color: #909399;
}
</style>
