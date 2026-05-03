<template>
  <div class="page-container">
    <ModuleTabBar :tabs="resumeGroupTabs" />
    <!-- 顶部统计 -->
    <div class="stats-grid">
      <el-card class="stats-card">
        <div class="stats-label">累计匹配</div>
        <div class="stats-value">{{ stats.totalMatches || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">强匹配</div>
        <div class="stats-value stats-strong">{{ stats.strongMatchCount || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">一般匹配</div>
        <div class="stats-value stats-match">{{ stats.matchCount || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">平均分</div>
        <div class="stats-value">{{ stats.avgScore || 0 }}</div>
      </el-card>
    </div>

    <el-scrollbar class="content-scrollbar">
      <el-tabs v-model="activeTab" class="ai-tabs">
        <!-- Tab 1: 简历批量匹配 -->
        <el-tab-pane label="简历批量匹配" name="batch">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">选择职位，AI 自动评估简历库</div>
                <div class="section-hint">根据选定的匹配规则，对简历库的候选人按总分降序排列</div>
              </div>
            </div>
            <el-form :model="batchForm" label-width="110px">
              <div class="form-grid">
                <el-form-item label="目标职位" required>
                  <el-select v-model="batchForm.jobId" filterable style="width: 100%" @change="onSelectJob">
                    <el-option
                      v-for="job in jobList"
                      :key="job.id"
                      :label="`${job.jobTitle}（${job.departmentName}）`"
                      :value="job.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="匹配规则">
                  <el-select v-model="batchForm.ruleId" clearable placeholder="默认规则" style="width: 100%">
                    <el-option
                      v-for="r in activeRules"
                      :key="r.id"
                      :label="`${r.name}（${r.jobFamily}）`"
                      :value="r.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="待评估简历">
                  <el-select
                    v-model="batchForm.resumeIds"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    filterable
                    placeholder="不选则评估全部"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="r in resumeList"
                      :key="r.id"
                      :label="`${r.candidateName} - ${r.position}`"
                      :value="r.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-actions">
                <el-button type="primary" :loading="batchLoading" @click="handleBatchMatch">
                  <el-icon><ArtAiIcon /></el-icon>
                  开始 AI 匹配
                </el-button>
                <el-button @click="batchResults = []">清空结果</el-button>
              </div>
            </el-form>
          </el-card>

          <el-card v-if="batchResults.length > 0" class="section-card">
            <div class="section-header">
              <div class="section-title">匹配结果（按总分降序）</div>
            </div>
            <el-table :data="batchResults" stripe>
              <el-table-column label="排名" width="80" align="center">
                <template #default="{ $index }">
                  <span v-if="$index < 3" class="rank-medal">
                    {{ $index === 0 ? '🥇' : $index === 1 ? '🥈' : '🥉' }}
                  </span>
                  <span v-else>#{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="candidateName" label="候选人" width="120" />
              <el-table-column label="总分" width="200" align="center">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.totalScore"
                    :stroke-width="10"
                    :color="getScoreColor(row.totalScore)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="推荐等级" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="RECOMMEND_LEVEL_MAP[row.recommendLevel].type" size="small">
                    {{ RECOMMEND_LEVEL_MAP[row.recommendLevel].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="命中关键词" min-width="240">
                <template #default="{ row }">
                  <el-tag
                    v-for="k in row.matchedKeywords"
                    :key="k"
                    size="small"
                    type="success"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ k }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="缺失关键词" min-width="180">
                <template #default="{ row }">
                  <el-tag
                    v-for="k in row.missedKeywords"
                    :key="k"
                    size="small"
                    type="danger"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ k }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="showDetail(row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 职位推荐 -->
        <el-tab-pane label="职位推荐" name="recommend">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">选择候选人，AI 推荐最匹配的职位</div>
                <div class="section-hint">用于主动推荐场景：HR 拿到一份优质简历，快速定位哪个岗位最合适</div>
              </div>
            </div>
            <el-form :model="recommendForm" label-width="110px">
              <div class="form-grid">
                <el-form-item label="候选人" required>
                  <el-select v-model="recommendForm.resumeId" filterable style="width: 100%" @change="onSelectResume">
                    <el-option
                      v-for="r in resumeList"
                      :key="r.id"
                      :label="`${r.candidateName} - ${r.position}（${r.workYears}年）`"
                      :value="r.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="在招职位">
                  <el-select
                    v-model="recommendForm.jobIds"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    filterable
                    placeholder="不选则评估全部已发布职位"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="j in jobList"
                      :key="j.id"
                      :label="`${j.jobTitle}（${j.departmentName}）`"
                      :value="j.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-actions">
                <el-button type="primary" :loading="recommendLoading" @click="handleRecommend">
                  <el-icon><ArtAiIcon /></el-icon>
                  AI 推荐职位
                </el-button>
                <el-button @click="recommendResults = []">清空结果</el-button>
              </div>
            </el-form>
          </el-card>

          <el-card v-if="recommendResults.length > 0" class="section-card">
            <div class="section-header">
              <div class="section-title">推荐职位（按总分降序）</div>
            </div>
            <el-table :data="recommendResults" stripe>
              <el-table-column label="排名" width="80" align="center">
                <template #default="{ $index }">
                  <span v-if="$index < 3" class="rank-medal">
                    {{ $index === 0 ? '🥇' : $index === 1 ? '🥈' : '🥉' }}
                  </span>
                  <span v-else>#{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="jobTitle" label="职位" min-width="180" />
              <el-table-column prop="department" label="部门" width="140" />
              <el-table-column label="匹配度" width="200" align="center">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.totalScore"
                    :stroke-width="10"
                    :color="getScoreColor(row.totalScore)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="推荐等级" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="RECOMMEND_LEVEL_MAP[row.recommendLevel].type" size="small">
                    {{ RECOMMEND_LEVEL_MAP[row.recommendLevel].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="AI 建议" min-width="320" show-overflow-tooltip>
                <template #default="{ row }">{{ row.aiSuggestion }}</template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="showDetail(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 匹配规则 -->
        <el-tab-pane label="匹配规则" name="rules">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">AI 匹配规则配置</div>
                <div class="section-hint">按岗位族设置维度权重与关键词库；权重总和应为 100</div>
              </div>
              <el-button type="primary" @click="openRuleDialog()">
                <el-icon><Plus /></el-icon>
                新增规则
              </el-button>
            </div>
            <el-table :data="ruleList" stripe>
              <el-table-column prop="name" label="规则名称" min-width="200" />
              <el-table-column prop="jobFamily" label="岗位族" width="140" />
              <el-table-column label="维度权重" min-width="340">
                <template #default="{ row }">
                  <div class="weight-bar">
                    <div
                      v-for="(v, k) in row.dimensionWeights"
                      :key="k"
                      class="weight-item"
                      :title="`${DIMENSION_LABEL[k]}: ${v}%`"
                      :style="{ flex: v, background: weightColors[k] }"
                    >
                      {{ v }}%
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="核心技能" min-width="200">
                <template #default="{ row }">
                  <el-tag
                    v-for="k in row.coreSkills.slice(0, 4)"
                    :key="k"
                    size="small"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ k }}
                  </el-tag>
                  <span v-if="row.coreSkills.length > 4" class="muted">+{{ row.coreSkills.length - 4 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openRuleDialog(row)">编辑</el-button>
                  <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="toggleRule(row)">
                    {{ row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
                  <el-button link type="danger" @click="deleteRule(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 4: 历史记录 -->
        <el-tab-pane label="匹配历史" name="history">
          <el-card class="section-card">
            <div class="section-header">
              <div class="section-title">全部匹配记录</div>
            </div>
            <el-table :data="historyList" stripe>
              <el-table-column prop="matchTime" label="匹配时间" width="180" />
              <el-table-column prop="candidateName" label="候选人" width="120" />
              <el-table-column prop="jobTitle" label="匹配职位" min-width="180" />
              <el-table-column prop="department" label="部门" width="140" />
              <el-table-column label="总分" width="120" align="center">
                <template #default="{ row }">
                  <span :style="{ color: getScoreColor(row.totalScore), fontWeight: 600 }">
                    {{ row.totalScore }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="推荐等级" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="RECOMMEND_LEVEL_MAP[row.recommendLevel].type" size="small">
                    {{ RECOMMEND_LEVEL_MAP[row.recommendLevel].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="showDetail(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <!-- 匹配详情弹窗 -->
    <el-dialog v-model="detailVisible" title="AI 匹配详情" width="640px">
      <el-descriptions v-if="detailData" :column="2" border>
        <el-descriptions-item label="候选人">{{ detailData.candidateName }}</el-descriptions-item>
        <el-descriptions-item label="匹配职位">{{ detailData.jobTitle }}</el-descriptions-item>
        <el-descriptions-item label="总分" :span="2">
          <el-progress
            :percentage="detailData.totalScore"
            :stroke-width="12"
            :color="getScoreColor(detailData.totalScore)"
          />
        </el-descriptions-item>
        <el-descriptions-item label="推荐等级" :span="2">
          <el-tag :type="RECOMMEND_LEVEL_MAP[detailData.recommendLevel].type" size="large">
            {{ RECOMMEND_LEVEL_MAP[detailData.recommendLevel].label }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="detail-section">
        <div class="detail-title">各维度评分</div>
        <div class="dimension-list">
          <div v-for="(v, k) in detailData?.dimensionScores || {}" :key="k" class="dimension-item">
            <span class="dimension-label">{{ DIMENSION_LABEL[k] }}</span>
            <el-progress :percentage="v" :stroke-width="8" :color="getScoreColor(v)" />
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-title">命中关键词</div>
        <el-tag
          v-for="k in detailData?.matchedKeywords || []"
          :key="k"
          type="success"
          style="margin-right: 6px; margin-bottom: 6px"
        >
          ✓ {{ k }}
        </el-tag>
      </div>
      <div v-if="detailData?.missedKeywords && detailData.missedKeywords.length > 0" class="detail-section">
        <div class="detail-title">缺失关键词</div>
        <el-tag
          v-for="k in detailData.missedKeywords"
          :key="k"
          type="danger"
          style="margin-right: 6px; margin-bottom: 6px"
        >
          ✗ {{ k }}
        </el-tag>
      </div>
      <div class="detail-section">
        <div class="detail-title">AI 建议</div>
        <el-alert :title="detailData?.aiSuggestion || ''" :closable="false" type="info" show-icon />
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 规则编辑弹窗 -->
    <el-dialog v-model="ruleDialogVisible" :title="ruleForm.id ? '编辑匹配规则' : '新增匹配规则'" width="720px">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="ruleRules" label-width="120px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="适用岗位族" prop="jobFamily">
          <el-select v-model="ruleForm.jobFamily" style="width: 100%">
            <el-option label="技术研发" value="技术研发" />
            <el-option label="产品设计" value="产品设计" />
            <el-option label="运营市场" value="运营市场" />
            <el-option label="职能支持" value="职能支持" />
            <el-option label="管理岗位" value="管理岗位" />
          </el-select>
        </el-form-item>
        <el-form-item label="维度权重">
          <div class="weight-inputs">
            <div v-for="(_v, k) in ruleForm.dimensionWeights" :key="k" class="weight-input-row">
              <span class="weight-input-label">{{ DIMENSION_LABEL[k] }}</span>
              <el-slider
                v-model="ruleForm.dimensionWeights![k]"
                :min="0"
                :max="100"
                show-input
                :show-input-controls="false"
                style="flex: 1"
              />
            </div>
            <div class="weight-total" :class="{ 'weight-total-error': weightTotal !== 100 }">
              权重总和：{{ weightTotal }}{{ weightTotal !== 100 ? '（应为 100）' : ' ✓' }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="核心技能">
          <el-input
            v-model="coreSkillsInput"
            type="textarea"
            :rows="2"
            placeholder="用英文逗号分隔，如：Vue, TypeScript, Element Plus"
          />
        </el-form-item>
        <el-form-item label="加分技能">
          <el-input
            v-model="bonusSkillsInput"
            type="textarea"
            :rows="2"
            placeholder="用英文逗号分隔"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="强匹配阈值">
              <el-input v-model.number="ruleForm.strongMatchThreshold"><template #append>分</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="匹配阈值">
              <el-input v-model.number="ruleForm.matchThreshold"><template #append>分</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待定阈值">
              <el-input v-model.number="ruleForm.maybeThreshold"><template #append>分</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import {
  aiMatchResultApi,
  matchingRuleApi,
  batchMatch,
  recommendJobs,
  getMatchStats
} from '@/api/aiMatching'
import {
  RECOMMEND_LEVEL_MAP,
  DIMENSION_LABEL,
  type AIMatchResult,
  type MatchingRule,
  type AIMatchStats
} from '@/types/aiMatching'
import { getResumeList } from '@/api/recruitment/resume'
import { getJobPostingList } from '@/api/jobPosting'

defineOptions({ name: 'RecruitmentAIMatching' })

const resumeGroupTabs = [
  { label: '简历库', path: '/recruit/resume' },
  { label: 'AI 智能匹配', path: '/recruit/ai-matching' }
]

const activeTab = ref<'batch' | 'recommend' | 'rules' | 'history'>('batch')

/* ========== 基础数据 ========== */
const stats = ref<Partial<AIMatchStats>>({})
const jobList = ref<any[]>([])
const resumeList = ref<any[]>([])
const ruleList = ref<MatchingRule[]>([])
const historyList = ref<AIMatchResult[]>([])

const activeRules = computed(() => ruleList.value.filter((r) => r.status === 1))

const weightColors: Record<string, string> = {
  skill: '#409eff',
  experience: '#67c23a',
  education: '#e6a23c',
  location: '#f56c6c',
  salary: '#909399'
}

const loadStats = async () => {
  const res = await getMatchStats()
  stats.value = res.data
}

const loadJobs = async () => {
  const res = await getJobPostingList({ pageSize: 100 })
  jobList.value = res.data?.list || []
}

const loadResumes = async () => {
  const res = await getResumeList({ page: 1, pageSize: 100 })
  resumeList.value = res.data?.list || []
}

const loadRules = async () => {
  const res = await matchingRuleApi.getList({ pageSize: 100 })
  ruleList.value = res.data?.list || []
}

const loadHistory = async () => {
  const res = await aiMatchResultApi.getList({ pageSize: 100 })
  historyList.value = (res.data?.list || []).sort((a: AIMatchResult, b: AIMatchResult) =>
    b.matchTime.localeCompare(a.matchTime)
  )
}

/* ========== 批量匹配 ========== */
const batchForm = reactive({
  jobId: null as number | null,
  ruleId: null as number | null,
  resumeIds: [] as number[]
})
const batchResults = ref<AIMatchResult[]>([])
const batchLoading = ref(false)

const onSelectJob = (_: number) => {}

const handleBatchMatch = async () => {
  if (!batchForm.jobId) {
    ElMessage.warning('请选择目标职位')
    return
  }
  const job = jobList.value.find((j) => j.id === batchForm.jobId)
  if (!job) return
  const targetResumes =
    batchForm.resumeIds.length > 0
      ? resumeList.value.filter((r) => batchForm.resumeIds.includes(r.id))
      : resumeList.value
  if (targetResumes.length === 0) {
    ElMessage.warning('简历库为空')
    return
  }
  batchLoading.value = true
  try {
    const res = await batchMatch({
      jobId: job.id,
      jobTitle: job.jobTitle,
      department: job.departmentName,
      resumes: targetResumes.map((r) => ({ id: r.id, candidateName: r.candidateName })),
      ruleId: batchForm.ruleId || undefined
    })
    batchResults.value = res.data
    ElMessage.success(res.message)
    loadStats()
  } finally {
    batchLoading.value = false
  }
}

/* ========== 职位推荐 ========== */
const recommendForm = reactive({
  resumeId: null as number | null,
  jobIds: [] as number[]
})
const recommendResults = ref<AIMatchResult[]>([])
const recommendLoading = ref(false)

const onSelectResume = (_: number) => {}

const handleRecommend = async () => {
  if (!recommendForm.resumeId) {
    ElMessage.warning('请选择候选人')
    return
  }
  const resume = resumeList.value.find((r) => r.id === recommendForm.resumeId)
  if (!resume) return
  const targetJobs =
    recommendForm.jobIds.length > 0
      ? jobList.value.filter((j) => recommendForm.jobIds.includes(j.id))
      : jobList.value
  if (targetJobs.length === 0) {
    ElMessage.warning('在招职位为空')
    return
  }
  recommendLoading.value = true
  try {
    const res = await recommendJobs({
      resumeId: resume.id,
      candidateName: resume.candidateName,
      jobs: targetJobs.map((j) => ({ id: j.id, title: j.jobTitle, department: j.departmentName })),
      ruleId: undefined
    })
    recommendResults.value = res.data
    ElMessage.success(res.message)
    loadStats()
  } finally {
    recommendLoading.value = false
  }
}

/* ========== 详情弹窗 ========== */
const detailVisible = ref(false)
const detailData = ref<AIMatchResult | null>(null)
const showDetail = (row: AIMatchResult) => {
  detailData.value = row
  detailVisible.value = true
}

/* ========== 规则 CRUD ========== */
const ruleDialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Partial<MatchingRule>>({
  id: undefined,
  name: '',
  jobFamily: '技术研发',
  dimensionWeights: { skill: 40, experience: 30, education: 10, location: 10, salary: 10 },
  coreSkills: [],
  bonusSkills: [],
  excludeKeywords: [],
  strongMatchThreshold: 80,
  matchThreshold: 65,
  maybeThreshold: 50,
  status: 1,
  remark: ''
})
const coreSkillsInput = ref('')
const bonusSkillsInput = ref('')

const ruleRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  jobFamily: [{ required: true, message: '请选择岗位族', trigger: 'change' }]
}

const weightTotal = computed(() =>
  Object.values(ruleForm.dimensionWeights || {}).reduce((a, b) => a + b, 0)
)

const resetRuleForm = () => {
  ruleForm.id = undefined
  ruleForm.name = ''
  ruleForm.jobFamily = '技术研发'
  ruleForm.dimensionWeights = { skill: 40, experience: 30, education: 10, location: 10, salary: 10 }
  ruleForm.coreSkills = []
  ruleForm.bonusSkills = []
  ruleForm.excludeKeywords = []
  ruleForm.strongMatchThreshold = 80
  ruleForm.matchThreshold = 65
  ruleForm.maybeThreshold = 50
  ruleForm.status = 1
  ruleForm.remark = ''
  coreSkillsInput.value = ''
  bonusSkillsInput.value = ''
}

const openRuleDialog = (row?: MatchingRule) => {
  resetRuleForm()
  if (row) {
    Object.assign(ruleForm, row, { dimensionWeights: { ...row.dimensionWeights } })
    coreSkillsInput.value = row.coreSkills.join(', ')
    bonusSkillsInput.value = row.bonusSkills.join(', ')
  }
  ruleDialogVisible.value = true
}

const saveRule = async () => {
  await ruleFormRef.value?.validate()
  if (weightTotal.value !== 100) {
    ElMessage.warning('维度权重总和必须为 100')
    return
  }
  ruleForm.coreSkills = coreSkillsInput.value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  ruleForm.bonusSkills = bonusSkillsInput.value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (ruleForm.id) {
    await matchingRuleApi.update(ruleForm)
    ElMessage.success('规则已更新')
  } else {
    await matchingRuleApi.add(ruleForm)
    ElMessage.success('规则已新增')
  }
  ruleDialogVisible.value = false
  loadRules()
}

const toggleRule = async (row: MatchingRule) => {
  await matchingRuleApi.updateStatus(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  loadRules()
}

const deleteRule = async (row: MatchingRule) => {
  try {
    await ElMessageBox.confirm(`确定删除规则「${row.name}」吗？`, '确认', { type: 'warning' })
    await matchingRuleApi.delete(row.id)
    ElMessage.success('已删除')
    loadRules()
  } catch {}
}

/* ========== 工具 ========== */
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#67c23a'
  if (score >= 65) return '#409eff'
  if (score >= 50) return '#e6a23c'
  return '#f56c6c'
}

onMounted(() => {
  loadStats()
  loadJobs()
  loadResumes()
  loadRules()
  loadHistory()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stats-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .stats-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .stats-value {
    font-size: 26px;
    font-weight: 700;
    color: #303133;
    line-height: 1;

    &.stats-strong {
      color: #67c23a;
    }
    &.stats-match {
      color: #409eff;
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

.ai-tabs {
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
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;

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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
}

.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  padding-left: 110px;
}

.rank-medal {
  font-size: 20px;
}

.muted {
  color: #909399;
  font-size: 12px;
}

.weight-bar {
  display: flex;
  width: 100%;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;

  .weight-item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    min-width: 28px;
  }
}

.weight-inputs {
  width: 100%;

  .weight-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .weight-input-label {
      width: 80px;
      font-size: 13px;
      color: #606266;
    }
  }

  .weight-total {
    margin-top: 8px;
    padding: 6px 10px;
    background: #f0f9eb;
    border-radius: 4px;
    font-size: 13px;
    color: #67c23a;

    &.weight-total-error {
      background: #fef0f0;
      color: #f56c6c;
    }
  }
}

.detail-section {
  margin-top: 16px;

  .detail-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .dimension-list {
    .dimension-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .dimension-label {
        width: 80px;
        font-size: 13px;
        color: #606266;
        flex-shrink: 0;
      }

      :deep(.el-progress) {
        flex: 1;
      }
    }
  }
}
</style>
