<template>
  <div class="review-360-container">
    <ModuleTabBar :tabs="evalGroupTabs" />
    <el-tabs v-model="activeTab" class="review-tabs">
      <!-- Tab 1: 评估关系管理 -->
      <el-tab-pane label="评估人关系" name="relations">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="被评估人">
              <el-input v-model="filters.subjectName" placeholder="姓名" style="width: 140px" clearable />
            </el-form-item>
            <el-form-item label="评估人类型">
              <el-select v-model="filters.reviewerType" placeholder="全部" clearable style="width: 130px">
                <el-option label="下属" value="subordinate" />
                <el-option label="同事" value="peer" />
                <el-option label="跨部门" value="cross" />
                <el-option label="上级" value="superior" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filters.status" placeholder="全部" clearable style="width: 140px">
                <el-option v-for="(s, k) in REL_STATUS_MAP" :key="k" :label="s.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadRelations">搜索</el-button>
              <el-button @click="openNominateDialog">员工自选评估人</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="data-card">
          <el-table :data="filteredRelations" stripe>
            <el-table-column prop="subjectName" label="被评估人" width="120" />
            <el-table-column prop="subjectDept" label="被评估人部门" width="130" />
            <el-table-column prop="reviewerName" label="评估人" width="120" />
            <el-table-column prop="reviewerDept" label="评估人部门" width="130" />
            <el-table-column label="评估人类型" width="130" align="center">
              <template #default="{ row }">
                <span>{{ REVIEWER_TYPE_MAP[row.reviewerType].icon }} {{ REVIEWER_TYPE_MAP[row.reviewerType].label }}</span>
                <span class="weight-hint">（{{ REVIEWER_TYPE_MAP[row.reviewerType].weight }}%）</span>
              </template>
            </el-table-column>
            <el-table-column label="提名来源" width="110" align="center">
              <template #default="{ row }">{{ NOMINATION_MAP[row.nominationSource] }}</template>
            </el-table-column>
            <el-table-column label="状态" width="130" align="center">
              <template #default="{ row }">
                <el-tag :type="REL_STATUS_MAP[row.status].type" size="small">
                  {{ REL_STATUS_MAP[row.status].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="匿名" width="80" align="center">
              <template #default="{ row }">
                <span>{{ row.reviewerType === 'superior' ? '实名' : '匿名' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="approverName" label="核准人" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="170" />
            <el-table-column label="操作" width="260" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'proposed'"
                  link
                  type="success"
                  @click="handleApproveRel(row, true)"
                >核准</el-button>
                <el-button
                  v-if="row.status === 'proposed'"
                  link
                  type="danger"
                  @click="handleApproveRel(row, false)"
                >拒绝</el-button>
                <el-button
                  v-if="row.status === 'approved'"
                  link
                  type="primary"
                  @click="handleFillFeedback(row)"
                >填写反馈</el-button>
                <el-button
                  v-if="row.status === 'submitted'"
                  link
                  @click="handleViewFeedback(row)"
                >查看反馈</el-button>
                <el-button
                  v-if="row.status === 'approved'"
                  link
                  type="warning"
                  @click="handleDecline(row)"
                >婉拒</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 2: 聚合结果 -->
      <el-tab-pane label="聚合结果" name="aggregate">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="被评估人">
              <el-select v-model="aggregateSubject" placeholder="选择员工" style="width: 300px" @change="loadAggregate">
                <el-option
                  v-for="s in subjectOptions"
                  :key="`${s.subjectId}-${s.evaluationId}`"
                  :label="`${s.subjectName} - ${s.evaluationName}`"
                  :value="`${s.subjectId}-${s.evaluationId}`"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <div v-if="aggregateData" class="aggregate-layout">
          <el-card class="agg-main-card">
            <div class="agg-header">
              <div class="agg-title">{{ aggregateData.subjectName }} · 360 聚合反馈</div>
              <div class="agg-score">
                <span class="agg-score-label">加权综合分</span>
                <span class="agg-score-value" :style="{ color: scoreColor(aggregateData.weightedScore) }">
                  {{ aggregateData.weightedScore }}
                </span>
              </div>
            </div>

            <div class="sub-section">
              <div class="section-title">各评估人类型平均分</div>
              <div class="type-scores">
                <div v-for="t in (['subordinate', 'peer', 'cross', 'superior'] as const)" :key="t" class="type-score-item">
                  <div class="type-head">
                    <span>{{ REVIEWER_TYPE_MAP[t].icon }} {{ REVIEWER_TYPE_MAP[t].label }}</span>
                    <span class="type-count">{{ aggregateData.counts[t] }} 人</span>
                  </div>
                  <div class="type-score-value" :style="{ color: scoreColor(aggregateData.avgScores[t]) }">
                    {{ aggregateData.avgScores[t] || '—' }}
                  </div>
                  <div class="type-weight">权重 {{ REVIEWER_TYPE_MAP[t].weight }}%</div>
                </div>
              </div>
            </div>

            <div class="sub-section">
              <div class="section-title">各维度平均分（跨评估人）</div>
              <div class="dim-bars">
                <div v-for="d in aggregateData.dimensionAverage" :key="d.dimension" class="dim-bar-item">
                  <span class="dim-name">{{ d.dimension }}</span>
                  <el-progress
                    :percentage="d.score * 20"
                    :stroke-width="10"
                    :color="scoreColor(d.score * 20)"
                    style="flex: 1; margin: 0 12px"
                  />
                  <span class="dim-score">{{ d.score }} / 5</span>
                </div>
              </div>
            </div>

            <div class="sub-section">
              <div class="section-title">
                亮点反馈
                <span class="quality-hint">（匿名聚合，至少 3 人反馈才展示）</span>
              </div>
              <div v-if="aggregateData.strengths.length >= 3" class="feedback-list">
                <div v-for="(f, idx) in aggregateData.strengths" :key="idx" class="feedback-item positive">
                  "{{ f }}"
                </div>
              </div>
              <el-empty v-else description="反馈人数不足 3，为保护匿名性暂不展示" :image-size="80" />
            </div>

            <div class="sub-section">
              <div class="section-title">改进建议</div>
              <div v-if="aggregateData.improvements.length >= 3" class="feedback-list">
                <div v-for="(f, idx) in aggregateData.improvements" :key="idx" class="feedback-item negative">
                  "{{ f }}"
                </div>
              </div>
              <el-empty v-else description="反馈人数不足 3，为保护匿名性暂不展示" :image-size="80" />
            </div>

            <div class="sub-section">
              <el-alert
                :title="`提交率：${aggregateData.submissionRate}%`"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
          </el-card>
        </div>
        <el-empty v-else description="请选择被评估人查看聚合结果" />
      </el-tab-pane>
    </el-tabs>

    <!-- 员工自选评估人弹窗 -->
    <el-dialog v-model="nominateVisible" title="员工自选评估人（5~8 人）" width="680px">
      <el-form :model="nominateForm" label-width="120px">
        <el-form-item label="被评估人">
          <el-input v-model="nominateForm.subjectName" />
        </el-form-item>
        <el-form-item label="被评估人部门">
          <el-input v-model="nominateForm.subjectDept" />
        </el-form-item>
        <el-form-item label="关联评估任务">
          <el-input v-model.number="nominateForm.evaluationId" placeholder="关联的评估 ID" />
        </el-form-item>
        <el-form-item label="周期">
          <el-input v-model.number="nominateForm.cycleId" placeholder="周期 ID" />
        </el-form-item>
        <el-divider>评估人列表</el-divider>
        <div v-for="(r, idx) in nominateForm.reviewers" :key="idx" class="nominate-row">
          <el-input v-model="r.reviewerName" placeholder="评估人姓名" style="flex: 1" />
          <el-input v-model="r.reviewerDept" placeholder="部门" style="width: 120px; margin-left: 6px" />
          <el-select v-model="r.reviewerType" style="width: 120px; margin-left: 6px">
            <el-option label="下属" value="subordinate" />
            <el-option label="同事" value="peer" />
            <el-option label="跨部门" value="cross" />
            <el-option label="上级" value="superior" />
          </el-select>
          <el-button link type="danger" @click="removeNominate(idx)">删除</el-button>
        </div>
        <el-button plain type="primary" size="small" @click="addNominate">+ 添加评估人</el-button>
      </el-form>
      <template #footer>
        <el-button @click="nominateVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNominate">提交（待上级核准）</el-button>
      </template>
    </el-dialog>

    <!-- 填写反馈弹窗 -->
    <el-dialog v-model="feedbackVisible" title="填写 360 反馈" width="640px" top="6vh">
      <el-scrollbar v-if="feedbackTarget" max-height="68vh">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="被评估人">{{ feedbackTarget.subjectName }}</el-descriptions-item>
          <el-descriptions-item label="评估人">{{ feedbackTarget.reviewerName }}</el-descriptions-item>
          <el-descriptions-item label="评估人类型">
            {{ REVIEWER_TYPE_MAP[feedbackTarget.reviewerType].label }}
          </el-descriptions-item>
          <el-descriptions-item label="匿名">
            {{ feedbackTarget.reviewerType === 'superior' ? '实名' : '匿名聚合' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="section-title" style="margin-top: 16px">各维度评分（1~5 分）</div>
        <el-table :data="feedbackScores" size="small" border>
          <el-table-column prop="dimension" label="维度" width="200" />
          <el-table-column label="评分">
            <template #default="{ row }">
              <el-rate v-model="row.score" :max="5" allow-half show-score />
            </template>
          </el-table-column>
        </el-table>

        <el-form label-width="100px" style="margin-top: 16px">
          <el-form-item label="亮点反馈">
            <el-input v-model="feedbackForm.strengths" type="textarea" :rows="3" placeholder="至少 20 字，描述具体行为或事例" />
          </el-form-item>
          <el-form-item label="改进建议">
            <el-input
              v-model="feedbackForm.improvements"
              type="textarea"
              :rows="3"
              placeholder="建议按 SBI 结构描述：在什么情境（Situation）下，观察到什么行为（Behavior），造成了什么影响（Impact），最后给出建议"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>


    <!-- 查看反馈弹窗 -->
    <el-dialog v-model="viewFeedbackVisible" title="反馈详情" width="560px">
      <el-descriptions v-if="viewFeedbackData" :column="1" border size="small">
        <el-descriptions-item label="评估人">
          <span v-if="viewFeedbackData.relation?.reviewerType === 'superior'">
            {{ viewFeedbackData.relation.reviewerName }}
          </span>
          <span v-else class="muted">（匿名）</span>
        </el-descriptions-item>
        <el-descriptions-item label="综合得分">
          <strong :style="{ color: scoreColor(viewFeedbackData.feedback?.overallScore || 0) }">
            {{ viewFeedbackData.feedback?.overallScore || '—' }}
          </strong>
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="viewFeedbackData?.feedback" class="fb-body">
        <div class="section-title">各维度评分</div>
        <el-table :data="viewFeedbackData.feedback.dimensionScores" size="small">
          <el-table-column prop="dimension" label="维度" width="160" />
          <el-table-column label="得分">
            <template #default="{ row }">
              <el-rate v-model="row.score" disabled :max="5" allow-half show-score />
            </template>
          </el-table-column>
        </el-table>
        <div class="section-title">亮点</div>
        <div class="fb-text">{{ viewFeedbackData.feedback.strengths || '—' }}</div>
        <div class="section-title">改进建议</div>
        <div class="fb-text">{{ viewFeedbackData.feedback.improvements || '—' }}</div>
      </div>
      <template #footer>
        <el-button @click="viewFeedbackVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'

const evalGroupTabs = [
  { label: '绩效评估', path: '/perf/evaluation' },
  { label: '360 度评估', path: '/perf/review-360' }
]
import {
  getReviewerRelations,
  getReviewFeedbacks,
  nominateReviewers,
  approveReviewer,
  declineReviewer,
  submitReviewFeedback,
  getAggregatedResult
} from '@/api/performance360'
import type {
  ReviewerRelation,
  ReviewFeedback,
  ReviewAggregatedResult
} from '@/types/performance360'
import {
  REVIEWER_TYPE_MAP,
  NOMINATION_MAP,
  REL_STATUS_MAP,
  DEFAULT_360_DIMENSIONS
} from '@/types/performance360'

defineOptions({ name: 'PerformanceReview360' })

const activeTab = ref<'relations' | 'aggregate'>('relations')

/* ========== 关系列表 ========== */
const filters = reactive({
  subjectName: '',
  reviewerType: '' as '' | 'subordinate' | 'peer' | 'cross' | 'superior',
  status: '' as string
})
const relations = ref<ReviewerRelation[]>([])
const feedbacks = ref<ReviewFeedback[]>([])

const filteredRelations = computed(() =>
  relations.value.filter(
    (r) =>
      (!filters.subjectName || r.subjectName.includes(filters.subjectName)) &&
      (!filters.reviewerType || r.reviewerType === filters.reviewerType) &&
      (!filters.status || r.status === filters.status)
  )
)

const loadRelations = async () => {
  const res = await getReviewerRelations({ pageSize: 200 })
  relations.value = res.data?.list || []
  const fbRes = await getReviewFeedbacks({ pageSize: 200 })
  feedbacks.value = fbRes.data?.list || []
}

/* ========== 核准 / 拒绝 / 婉拒 ========== */
const handleApproveRel = async (rel: ReviewerRelation, approved: boolean) => {
  if (approved) {
    await approveReviewer(rel.id, true)
    ElMessage.success('已核准')
  } else {
    try {
      const { value: reason } = await ElMessageBox.prompt('请输入拒绝理由', '拒绝核准', {
        inputValidator: (v) => (v && v.trim() ? true : '必填')
      })
      await approveReviewer(rel.id, false, '直属上级', reason)
      ElMessage.success('已拒绝')
    } catch {
      return
    }
  }
  loadRelations()
}

const handleDecline = async (rel: ReviewerRelation) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入婉拒理由', '婉拒', {
      inputValidator: (v) => (v && v.trim() ? true : '必填')
    })
    await declineReviewer(rel.id, reason)
    ElMessage.success('已婉拒')
    loadRelations()
  } catch {}
}

/* ========== 提名 ========== */
const nominateVisible = ref(false)
const nominateForm = reactive({
  evaluationId: 2,
  cycleId: 4,
  subjectId: 202,
  subjectName: '李前端',
  subjectDept: '技术部',
  reviewers: [] as Array<{
    reviewerId: number
    reviewerName: string
    reviewerDept: string
    reviewerType: 'subordinate' | 'peer' | 'cross' | 'superior'
  }>
})

const openNominateDialog = () => {
  nominateForm.reviewers = [
    { reviewerId: 0, reviewerName: '', reviewerDept: '', reviewerType: 'peer' },
    { reviewerId: 0, reviewerName: '', reviewerDept: '', reviewerType: 'peer' }
  ]
  nominateVisible.value = true
}

const addNominate = () => {
  nominateForm.reviewers.push({
    reviewerId: 0, reviewerName: '', reviewerDept: '', reviewerType: 'peer'
  })
}
const removeNominate = (idx: number) => {
  nominateForm.reviewers.splice(idx, 1)
}

const submitNominate = async () => {
  const n = nominateForm.reviewers.filter((r) => r.reviewerName).length
  if (n < 5) {
    ElMessage.warning('至少提名 5 人')
    return
  }
  if (n > 8) {
    ElMessage.warning('最多提名 8 人')
    return
  }
  await nominateReviewers(
    nominateForm.evaluationId,
    nominateForm.subjectId,
    nominateForm.subjectName,
    nominateForm.reviewers.filter((r) => r.reviewerName).map((r) => ({ ...r, subjectDept: nominateForm.subjectDept, cycleId: nominateForm.cycleId }))
  )
  ElMessage.success('已提交，等待直属上级核准')
  nominateVisible.value = false
  loadRelations()
}

/* ========== 填写反馈 ========== */
const feedbackVisible = ref(false)
const feedbackTarget = ref<ReviewerRelation | null>(null)
const feedbackScores = ref<Array<{ dimension: string; score: number }>>([])
const feedbackForm = reactive({ strengths: '', improvements: '' })

const handleFillFeedback = (rel: ReviewerRelation) => {
  feedbackTarget.value = rel
  feedbackScores.value = DEFAULT_360_DIMENSIONS.map((d) => ({ dimension: d, score: 3 }))
  feedbackForm.strengths = ''
  feedbackForm.improvements = ''
  feedbackVisible.value = true
}

const submitFeedback = async () => {
  if (!feedbackTarget.value) return
  const totalWords = feedbackForm.strengths.length + feedbackForm.improvements.length
  if (totalWords < 20) {
    try {
      await ElMessageBox.confirm('文字反馈少于 20 字，确定提交？（将被标记为低质量反馈）', '提示', { type: 'warning' })
    } catch {
      return
    }
  }
  await submitReviewFeedback(feedbackTarget.value.id, {
    dimensionScores: feedbackScores.value,
    strengths: feedbackForm.strengths,
    improvements: feedbackForm.improvements
  })
  ElMessage.success('已提交反馈')
  feedbackVisible.value = false
  loadRelations()
}

/* ========== 查看反馈 ========== */
const viewFeedbackVisible = ref(false)
const viewFeedbackData = ref<{ relation: ReviewerRelation; feedback?: ReviewFeedback } | null>(null)

const handleViewFeedback = (rel: ReviewerRelation) => {
  const fb = feedbacks.value.find((f) => f.relationId === rel.id)
  viewFeedbackData.value = { relation: rel, feedback: fb }
  viewFeedbackVisible.value = true
}

/* ========== 聚合结果 ========== */
const aggregateSubject = ref<string>('')
const aggregateData = ref<ReviewAggregatedResult | null>(null)

const subjectOptions = computed(() => {
  const map = new Map<string, any>()
  for (const r of relations.value) {
    const key = `${r.subjectId}-${r.evaluationId}`
    if (!map.has(key)) {
      map.set(key, {
        subjectId: r.subjectId,
        subjectName: r.subjectName,
        evaluationId: r.evaluationId,
        evaluationName: `评估 #${r.evaluationId}`
      })
    }
  }
  return [...map.values()]
})

const loadAggregate = async () => {
  if (!aggregateSubject.value) {
    aggregateData.value = null
    return
  }
  const [sid, eid] = aggregateSubject.value.split('-').map(Number)
  const res = await getAggregatedResult(sid, eid)
  aggregateData.value = res.data
}

/* ========== 工具 ========== */
const scoreColor = (score: number) => {
  if (score >= 80) return '#67c23a'
  if (score >= 65) return '#409eff'
  if (score >= 50) return '#e6a23c'
  return '#f56c6c'
}

onMounted(() => loadRelations())
</script>

<style scoped lang="scss">
.ai-inline-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.review-360-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }
  :deep(.el-tab-pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-card {
  flex-shrink: 0;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.weight-hint {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

.aggregate-layout {
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}

.agg-main-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.agg-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  .agg-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .agg-score-label {
    font-size: 13px;
    color: #909399;
    margin-right: 8px;
  }

  .agg-score-value {
    font-size: 36px;
    font-weight: 700;
  }
}

.sub-section {
  margin-top: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.quality-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 6px;
}

.type-scores {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .type-score-item {
    padding: 12px 16px;
    background: #fafbfc;
    border-radius: 8px;

    .type-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .type-count {
        font-size: 12px;
        color: #909399;
      }
    }

    .type-score-value {
      font-size: 24px;
      font-weight: 700;
    }

    .type-weight {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
}

.dim-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .dim-bar-item {
    display: flex;
    align-items: center;
    font-size: 13px;

    .dim-name {
      width: 120px;
      color: #606266;
    }

    .dim-score {
      width: 60px;
      text-align: right;
      color: #303133;
      font-weight: 500;
    }
  }
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .feedback-item {
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-style: italic;

    &.positive {
      background: #f0f9eb;
      color: #67c23a;
    }

    &.negative {
      background: #fdf6ec;
      color: #b88230;
    }
  }
}

.nominate-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.fb-body {
  margin-top: 16px;

  .section-title {
    margin-top: 12px;
  }

  .fb-text {
    padding: 10px 14px;
    background: #fafbfc;
    border-radius: 6px;
    color: #606266;
    font-size: 13px;
  }
}

.muted {
  color: #909399;
}
</style>
