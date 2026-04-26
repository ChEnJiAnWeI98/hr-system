<template>
  <div class="perf-eval-container">
    <ModuleTabBar :tabs="evalGroupTabs" />
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">评估任务总数</div>
        <div class="kpi-value">{{ stats.total || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已完成</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.doneCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">超期</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.overdueCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已升级</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.escalatedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">平均分</div>
        <div class="kpi-value">{{ stats.avgScore || 0 }}</div>
      </el-card>
    </div>

    <!-- 视角切换 -->
    <el-card class="view-card">
      <el-form inline>
        <el-form-item label="视角">
          <el-radio-group v-model="viewAs">
            <el-radio-button value="employee">员工视角</el-radio-button>
            <el-radio-button value="manager">管理者视角</el-radio-button>
            <el-radio-button value="hr">HR 视角</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="周期">
          <el-select v-model="queryParams.cycleId" placeholder="全部" clearable style="width: 220px">
            <el-option label="2026 Q2 OKR 季度考核" :value="4" />
            <el-option label="2026 Q1 OKR 季度考核" :value="3" />
            <el-option label="2026 Q1 销售团队 KPI 考核" :value="8" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="(s, k) in EVAL_STATUS_MAP" :key="k" :label="s.label" :value="Number(k)" />
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-checkbox v-model="queryParams.overdueOnly" @change="fetchData" style="margin-left: 12px">
            仅看超期
          </el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="data-card">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="evaluationNo" label="评估编号" width="150" />
        <el-table-column prop="employeeName" label="员工" width="100" />
        <el-table-column prop="departmentName" label="部门" width="110" />
        <el-table-column prop="cycleName" label="周期" min-width="180" show-overflow-tooltip />
        <el-table-column label="当前节点" width="200">
          <template #default="{ row }">
            <div class="node-chain">
              <span
                v-for="n in row.nodeRecords"
                :key="n.order"
                class="node-dot"
                :class="'status-' + n.status"
                :title="`${n.nodeName}：${EVAL_NODE_STATUS_MAP[n.status].label}`"
              >{{ n.order }}</span>
            </div>
            <div class="node-name">{{ currentNodeName(row) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="整体状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="EVAL_STATUS_MAP[row.status].type" size="small">
              {{ EVAL_STATUS_MAP[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="综合得分" width="100" align="right">
          <template #default="{ row }">
            <strong v-if="row.finalScore">{{ row.finalScore }}</strong>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="110" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.initialGrade" :type="GRADE_MAP[row.initialGrade].type" size="small">
              {{ GRADE_MAP[row.initialGrade].label }}
            </el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="标记" width="110" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.overdue === 1" type="danger" size="small" effect="dark">超期</el-tag>
            <el-tag v-if="row.escalated === 1" type="warning" size="small" style="margin-left: 4px">已升级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最近更新" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">查看</el-button>
            <el-button
              v-if="canFillNode(row)"
              link
              type="success"
              @click="handleFill(row)"
            >填写评分</el-button>
            <el-button
              v-if="row.overdue === 1 && row.escalated !== 1"
              link
              type="warning"
              @click="handleEscalate(row)"
            >升级到 HRBP</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 评分填写弹窗 -->
    <el-dialog v-model="fillDialogVisible" :title="fillDialogTitle" width="760px" top="5vh">
      <el-scrollbar v-if="currentEval && currentNode" max-height="70vh">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="员工">{{ currentEval.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ currentEval.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ currentEval.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="模板">{{ currentEval.templateName }}</el-descriptions-item>
          <el-descriptions-item label="节点">{{ currentNode.nodeName }}</el-descriptions-item>
          <el-descriptions-item label="节点权重">{{ currentNode.weight }}%</el-descriptions-item>
        </el-descriptions>

        <!-- 显示前置节点的评分（参考）-->
        <div v-if="previousNodes.length > 0" class="prev-nodes">
          <div class="section-title">前置节点评分（参考）</div>
          <el-collapse>
            <el-collapse-item
              v-for="p in previousNodes"
              :key="p.order"
              :title="`${p.nodeName}（${p.scorerName || '—'}）· 加权分 ${p.weightedScore || '—'}`"
              :name="p.order"
            >
              <el-table :data="p.dimensionScores || []" size="small">
                <el-table-column prop="dimension" label="维度" width="140" />
                <el-table-column prop="weight" label="权重" width="80" align="center">
                  <template #default="{ row }">{{ row.weight }}%</template>
                </el-table-column>
                <el-table-column prop="score" label="得分" width="100" align="center">
                  <template #default="{ row }">
                    <strong>{{ row.score }}</strong>
                  </template>
                </el-table-column>
                <el-table-column prop="comment" label="评语" />
              </el-table>
              <div v-if="p.comment" class="prev-comment">{{ p.comment }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 本节点评分填写 -->
        <div class="section-title">本节点评分</div>
        <el-table :data="fillScores" size="small" border>
          <el-table-column prop="dimension" label="评估维度" width="180" />
          <el-table-column prop="weight" label="权重" width="90" align="center">
            <template #default="{ row }">{{ row.weight }}%</template>
          </el-table-column>
          <el-table-column label="得分（0-100）" width="200" align="center">
            <template #default="{ row }">
              <el-slider v-model="row.score" :min="0" :max="100" :step="1" show-input :show-input-controls="false" />
            </template>
          </el-table-column>
          <el-table-column label="评语">
            <template #default="{ row }">
              <el-input v-model="row.comment" placeholder="本维度简要评价" />
            </template>
          </el-table-column>
        </el-table>
        <div class="weighted-hint">本节点加权分预览：<strong>{{ previewWeightedScore }}</strong></div>

        <el-form label-width="110px" style="margin-top: 16px">
          <el-form-item label="整体评语">
            <el-input v-model="fillComment" type="textarea" :rows="3" placeholder="工作总结 / 亮点 / 不足 / 建议" />
            <div class="ai-inline-toolbar">
              <AIAssistPopover
                v-model="aiPolishVisible"
                ability-code="comment_polish"
                :input-text="fillComment"
                :target-employee="currentEval?.employeeName || ''"
                @adopt="(out) => (fillComment = out)"
              >
                <el-button
                  link
                  type="primary"
                  :disabled="!fillComment.trim()"
                  @click="aiPolishVisible = true"
                >
                  ✨ AI 优化评语
                </el-button>
              </AIAssistPopover>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="fillDialogVisible = false">取消</el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmitNode">提交本节点</el-button>
      </template>
    </el-dialog>


    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="评估详情" width="820px" top="5vh">
      <el-scrollbar v-if="detailData" max-height="72vh">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工">{{ detailData.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ detailData.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ detailData.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="模板">{{ detailData.templateName }}</el-descriptions-item>
          <el-descriptions-item label="整体状态">
            <el-tag :type="EVAL_STATUS_MAP[detailData.status].type">
              {{ EVAL_STATUS_MAP[detailData.status].label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="综合得分">
            <strong v-if="detailData.finalScore">{{ detailData.finalScore }}</strong>
            <el-tag v-if="detailData.initialGrade" :type="GRADE_MAP[detailData.initialGrade].type" size="small" style="margin-left: 8px">
              {{ GRADE_MAP[detailData.initialGrade].label }}
            </el-tag>
            <span v-if="!detailData.finalScore" class="muted">— 未归档</span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="section-title">节点流转进度</div>
        <el-steps :active="(detailData.currentNode || 1) - 1" finish-status="success">
          <el-step v-for="n in detailData.nodeRecords" :key="n.order" :title="n.nodeName" :description="EVAL_NODE_STATUS_MAP[n.status].label" />
        </el-steps>

        <div class="section-title" style="margin-top: 20px">各节点评分详情</div>
        <el-collapse>
          <el-collapse-item
            v-for="n in detailData.nodeRecords"
            :key="n.order"
            :title="`${n.nodeName}（权重 ${n.weight}%） · ${n.scorerName || '—'} · ${n.status === 'submitted' ? '加权分 ' + n.weightedScore : EVAL_NODE_STATUS_MAP[n.status].label}`"
            :name="n.order"
          >
            <el-table v-if="n.dimensionScores && n.dimensionScores.length" :data="n.dimensionScores" size="small">
              <el-table-column prop="dimension" label="维度" width="160" />
              <el-table-column prop="weight" label="权重" width="80" align="center">
                <template #default="{ row }">{{ row.weight }}%</template>
              </el-table-column>
              <el-table-column prop="score" label="得分" width="100" align="center">
                <template #default="{ row }"><strong>{{ row.score }}</strong></template>
              </el-table-column>
              <el-table-column prop="comment" label="评语" />
            </el-table>
            <div v-else class="muted">尚未填写</div>
            <div v-if="n.comment" class="prev-comment">
              <strong>整体评语：</strong>{{ n.comment }}
              <el-button
                link
                type="primary"
                style="margin-left: 8px"
                @click="openDemoCommentPolish(n.comment)"
              >
                ✨ AI 优化（演示）
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- HR 视角：评语 AI 优化演示（generate 模式，仅预览+复制，不改数据）-->
    <AIAssistDialog
      v-model="aiDemoVisible"
      ability-code="comment_polish"
      mode="generate"
      :adoptable="false"
      :initial-input="aiDemoInput"
      dialog-width="680px"
      dialog-title="评语优化 · AI 演示（仅预览）"
      input-label="原评语"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleTabBar from '@/views/performance/_shared/ModuleTabBar.vue'
import AIAssistPopover from '@/components/business/AIAssistPopover.vue'
import AIAssistDialog from '@/components/business/AIAssistDialog.vue'

const evalGroupTabs = [
  { label: '绩效评估', path: '/perf/evaluation' },
  { label: '360 度评估', path: '/perf/review-360/x' }
]
import {
  getPerformanceEvaluationList,
  saveEvalDraft,
  submitEvalNode,
  escalateEval,
  getEvalStats
} from '@/api/performanceEvaluation'
import type {
  PerformanceEvaluation,
  EvalNodeRecord,
  NodeScoreDetail
} from '@/types/performanceEvaluation'
import {
  EVAL_STATUS_MAP,
  EVAL_NODE_STATUS_MAP,
  GRADE_MAP
} from '@/types/performanceEvaluation'

defineOptions({ name: 'PerformanceEvaluation' })

const viewAs = ref<'employee' | 'manager' | 'hr'>('hr')
const queryParams = reactive({
  cycleId: null as number | null,
  status: null as number | null,
  overdueOnly: false,
  page: 1,
  pageSize: 50
})

const tableData = ref<PerformanceEvaluation[]>([])
const stats = ref<any>({})

const fetchData = async () => {
  // overdueOnly 是本地筛选字段（mockHelper 不认识），不传到 API 层
  const { overdueOnly, ...apiParams } = queryParams
  const res = await getPerformanceEvaluationList(apiParams)
  tableData.value = (res.data?.list || []).filter((e: PerformanceEvaluation) => {
    if (overdueOnly && e.overdue !== 1) return false
    return true
  })
  const s = await getEvalStats()
  stats.value = s.data
}

const handleReset = () => {
  queryParams.cycleId = null
  queryParams.status = null
  queryParams.overdueOnly = false
  fetchData()
}

/* ========== 工具 ========== */
const currentNodeName = (row: PerformanceEvaluation): string => {
  const n = row.nodeRecords.find((x) => x.order === row.currentNode)
  return n ? n.nodeName : '—'
}

const canFillNode = (row: PerformanceEvaluation): boolean => {
  if (row.status === 6 || row.status === 7) return false
  const n = row.nodeRecords.find((x) => x.order === row.currentNode)
  return !!n && (n.status === 'pending' || n.status === 'filling' || n.status === 'overdue')
}

/* ========== 填写评分 ========== */
const fillDialogVisible = ref(false)
const aiPolishVisible = ref(false)

// HR 视角：在评估详情里对已有评语做 AI 优化演示（只展示不替换原数据）
const aiDemoVisible = ref(false)
const aiDemoInput = ref('')
const openDemoCommentPolish = (comment: string) => {
  aiDemoInput.value = comment
  aiDemoVisible.value = true
}
const currentEval = ref<PerformanceEvaluation | null>(null)
const currentNode = ref<EvalNodeRecord | null>(null)
const fillScores = ref<NodeScoreDetail[]>([])
const fillComment = ref('')

const fillDialogTitle = computed(() => {
  if (!currentEval.value || !currentNode.value) return '填写评分'
  return `填写评分 · ${currentEval.value.employeeName} · ${currentNode.value.nodeName}`
})

const previousNodes = computed(() => {
  if (!currentEval.value || !currentNode.value) return []
  return currentEval.value.nodeRecords.filter((n) => n.order < currentNode.value!.order && n.status === 'submitted')
})

const previewWeightedScore = computed(() => {
  return Math.round(fillScores.value.reduce((s, d) => s + ((d.score || 0) * d.weight) / 100, 0))
})

const handleFill = (row: PerformanceEvaluation) => {
  currentEval.value = row
  const node = row.nodeRecords.find((n) => n.order === row.currentNode)
  if (!node) return
  currentNode.value = node
  // 初始化评分表单（从模板或前置记录）
  if (node.dimensionScores && node.dimensionScores.length > 0) {
    fillScores.value = JSON.parse(JSON.stringify(node.dimensionScores))
    fillComment.value = node.comment || ''
  } else {
    // 从前一节点的维度结构初始化（若有）
    const ref = row.nodeRecords.find((n) => n.dimensionScores && n.dimensionScores.length > 0)
    const dims = ref?.dimensionScores || [
      { dimension: '业绩成果', weight: 40, score: 0 },
      { dimension: '专业能力', weight: 30, score: 0 },
      { dimension: '团队协作', weight: 20, score: 0 },
      { dimension: '创新突破', weight: 10, score: 0 }
    ]
    fillScores.value = dims.map((d) => ({ ...d, score: 0, comment: '' }))
    fillComment.value = ''
  }
  fillDialogVisible.value = true
}

const handleSaveDraft = async () => {
  if (!currentEval.value || !currentNode.value) return
  await saveEvalDraft(currentEval.value.id, currentNode.value.order, fillScores.value, fillComment.value)
  ElMessage.success('草稿已保存')
  fetchData()
}

const handleSubmitNode = async () => {
  if (!currentEval.value || !currentNode.value) return
  if (fillScores.value.some((d) => d.score === 0)) {
    try {
      await ElMessageBox.confirm('存在维度得分为 0，确定提交？', '确认', { type: 'warning' })
    } catch {
      return
    }
  }
  await submitEvalNode(currentEval.value.id, currentNode.value.order, fillScores.value, fillComment.value)
  ElMessage.success('已提交，流转至下一节点')
  fillDialogVisible.value = false
  fetchData()
}

/* ========== 升级 ========== */
const handleEscalate = async (row: PerformanceEvaluation) => {
  try {
    await ElMessageBox.confirm(`确定将「${row.employeeName}」的超期评估升级至 HRBP？`, '升级 HRBP', {
      type: 'warning'
    })
    await escalateEval(row.id)
    ElMessage.success('已升级')
    fetchData()
  } catch {}
}

/* ========== 详情 ========== */
const detailVisible = ref(false)
const detailData = ref<PerformanceEvaluation | null>(null)
const handleViewDetail = (row: PerformanceEvaluation) => {
  detailData.value = row
  detailVisible.value = true
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.ai-inline-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.perf-eval-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card,
.view-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.view-card :deep(.el-card__body) {
  padding: 12px 20px;
}

.data-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.node-chain {
  display: flex;
  gap: 4px;

  .node-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #fff;
    font-weight: 600;
    cursor: help;

    &.status-pending {
      background: #c0c4cc;
    }
    &.status-filling {
      background: #409eff;
    }
    &.status-submitted {
      background: #67c23a;
    }
    &.status-overdue {
      background: #f56c6c;
    }
  }
}

.node-name {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.muted {
  color: #909399;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 16px 0 10px;
}

.prev-nodes {
  margin-bottom: 16px;
}

.prev-comment {
  margin-top: 8px;
  padding: 8px 12px;
  background: #fafbfc;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
}

.weighted-hint {
  margin-top: 10px;
  padding: 10px 14px;
  background: #ecf5ff;
  border-radius: 6px;
  font-size: 13px;
  color: #409eff;
}
</style>
