<template>
  <el-drawer
    v-model="visible"
    title="OKR 质量检查 · AI 诊断"
    direction="rtl"
    size="540px"
    :before-close="handleBeforeClose"
    @open="onOpen"
  >
    <template #header>
      <div class="drawer-header">
        <el-icon class="drawer-icon"><ArtAiIcon /></el-icon>
        <span class="drawer-title">OKR 质量检查 · AI 诊断</span>
      </div>
    </template>

    <div v-if="loading" class="state-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在基于 SMART 原则检查您的 OKR…</span>
    </div>

    <div v-else-if="error" class="state-error">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ error }}</span>
      <el-button size="small" @click="invoke">重试</el-button>
    </div>

    <el-scrollbar v-else-if="result" class="check-content">
      <!-- SMART 评分卡 -->
      <el-card class="section-card score-card" shadow="never">
        <div class="score-row">
          <div class="score-summary">
            <div class="score-label">SMART 综合评分</div>
            <div class="score-main">
              <span class="score-num" :class="scoreColorClass">{{ result.smartScore.toFixed(1) }}</span>
              <span class="score-max">/ 5.0</span>
            </div>
            <el-tag :type="scoreTagType" size="small" effect="light">
              {{ scoreLabel }}
            </el-tag>
          </div>
          <div class="dim-list">
            <div v-for="(score, dim) in result.dimensions" :key="dim" class="dim-row">
              <span class="dim-label">
                <span class="dim-letter">{{ dim }}</span>
                <span class="dim-name">{{ DIM_NAME[dim] }}</span>
              </span>
              <el-rate :model-value="score" :max="5" disabled />
            </div>
          </div>
        </div>
      </el-card>

      <!-- 问题清单 -->
      <el-card class="section-card issue-card" shadow="never">
        <div class="card-title">
          <el-icon><Warning /></el-icon>
          <span>发现 {{ result.issues.length }} 个问题</span>
        </div>
        <div class="issue-list">
          <div v-for="(issue, i) in result.issues" :key="i" class="issue-row">
            <el-tag size="small" :type="getTargetTagType(issue.target)" effect="plain">
              {{ issue.target }}
            </el-tag>
            <span class="issue-text">{{ issue.text }}</span>
          </div>
        </div>
      </el-card>

      <!-- 改进版 -->
      <el-card class="section-card suggestion-card" shadow="never">
        <div class="card-title">
          <el-icon><ArtAiIcon /></el-icon>
          <span>AI 改进版（可逐条采纳）</span>
        </div>

        <!-- 改写后的 O -->
        <div class="suggestion-block">
          <div class="block-head">
            <el-tag type="success" size="small" effect="dark">改进 O</el-tag>
            <el-button link type="primary" :icon="Right" @click="handleApplyObjective">
              应用到目标
            </el-button>
          </div>
          <div class="block-text">{{ result.improvedDraft.objective }}</div>
          <div v-if="result.improvedDraft.objectiveDescription" class="block-desc">
            {{ result.improvedDraft.objectiveDescription }}
          </div>
        </div>

        <el-divider />

        <!-- 改写后的 KR -->
        <div
          v-for="(kr, i) in result.improvedDraft.keyResults"
          :key="i"
          class="suggestion-block kr-block"
        >
          <div class="block-head">
            <el-tag type="primary" size="small" effect="dark">
              改进 KR{{ i + 1 }}
            </el-tag>
            <el-tag v-if="kr.type" size="small" effect="plain">
              {{ KR_TYPE_MAP[kr.type]?.icon }} {{ KR_TYPE_MAP[kr.type]?.label }}
            </el-tag>
            <div class="block-spacer"></div>
            <el-button link type="primary" :icon="Right" @click="handleApplyKR(i)">
              应用到 KR{{ i + 1 }}
            </el-button>
          </div>
          <div class="block-text">{{ kr.description }}</div>
          <div class="kr-meta">
            <span v-if="kr.startValue" class="meta-item">
              <span class="meta-label">起始</span>
              <span class="meta-value">{{ kr.startValue }}</span>
            </span>
            <span v-if="kr.targetValue" class="meta-item">
              <span class="meta-label">目标</span>
              <span class="meta-value">{{ kr.targetValue }}</span>
            </span>
            <span class="meta-item">
              <span class="meta-label">权重</span>
              <span class="meta-value">{{ kr.weight }}%</span>
            </span>
          </div>
        </div>
      </el-card>

      <!-- 安全提示 -->
      <div class="footer-hint">
        AI 输出仅作草稿参考，所有建议采纳后请二次核对再保存。
      </div>
    </el-scrollbar>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="result" type="primary" @click="handleApplyAll">
          全部应用
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loading, Warning, WarningFilled, Right } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { invokeAIAbility, updateAIAdoption } from '@/api/performanceAI'
import type { OKRCheckResult } from '@/types/performanceAI'
import { KR_TYPE_MAP, type KeyResult } from '@/types/performanceGoal'

interface Props {
  modelValue: boolean
  /** 待检查的 OKR 文本输入（O + KR 列表，调用方拼好） */
  objectiveInput: string
  /** 目标员工姓名（用于 AI 调用记录） */
  targetEmployee?: string
  /** 操作人姓名 */
  operatorName?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetEmployee: '',
  operatorName: 'HR-Lisa'
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  /** 应用单个 O 到业务表单 */
  'apply-objective': [draft: { title: string; description: string }]
  /** 应用单条 KR 到业务表单（idx 是 AI 改写版中的索引；调用方决定回填到哪里） */
  'apply-kr': [idx: number, kr: KeyResult]
  /** 全部应用：替换 O + 所有 KR */
  'apply-all': [draft: { title: string; description: string; keyResults: KeyResult[] }]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const error = ref('')
const result = ref<OKRCheckResult | null>(null)
const recordId = ref<number | null>(null)
/** 已采纳的目标项（避免重复采纳率统计） */
const adopted = ref<Set<string>>(new Set())

const DIM_NAME: Record<string, string> = {
  S: 'Specific 具体',
  M: 'Measurable 可衡量',
  A: 'Achievable 可实现',
  R: 'Relevant 相关',
  T: 'Time-bound 有时限'
}

const scoreColorClass = computed(() => {
  if (!result.value) return ''
  const s = result.value.smartScore
  if (s >= 4) return 'score-good'
  if (s >= 3) return 'score-fair'
  return 'score-poor'
})

const scoreTagType = computed<'success' | 'warning' | 'danger'>(() => {
  if (!result.value) return 'warning'
  const s = result.value.smartScore
  if (s >= 4) return 'success'
  if (s >= 3) return 'warning'
  return 'danger'
})

const scoreLabel = computed(() => {
  if (!result.value) return ''
  const s = result.value.smartScore
  if (s >= 4) return '优秀'
  if (s >= 3) return '合格'
  if (s >= 2) return '待改进'
  return '需重写'
})

const onOpen = () => {
  result.value = null
  error.value = ''
  recordId.value = null
  adopted.value = new Set()
  if (props.objectiveInput.trim()) {
    invoke()
  } else {
    error.value = '当前 OKR 内容不足以触发 AI 检查，请先填写目标标题和至少一条 KR'
  }
}

const invoke = async () => {
  loading.value = true
  error.value = ''
  try {
    const res: any = await invokeAIAbility(
      'okr_check',
      props.objectiveInput,
      props.operatorName,
      props.targetEmployee
    )
    result.value = (res.data?.structured as OKRCheckResult) || null
    recordId.value = res.data?.recordId || null
    if (!result.value) {
      error.value = 'AI 返回数据格式异常，请重试'
    }
  } catch (e: any) {
    error.value = e?.message || 'AI 调用失败，请重试'
  } finally {
    loading.value = false
  }
}

const recordAdoption = async (key: string, isAll = false) => {
  if (!recordId.value || adopted.value.has(key)) return
  adopted.value.add(key)
  try {
    await updateAIAdoption(recordId.value, isAll ? 'adopted' : 'modified_adopted', isAll ? 0 : 30)
  } catch {
    /* 留痕失败不阻塞主流程 */
  }
}

const handleApplyObjective = async () => {
  if (!result.value) return
  emit('apply-objective', {
    title: result.value.improvedDraft.objective,
    description: result.value.improvedDraft.objectiveDescription || ''
  })
  ElMessage.success('已应用 AI 改写的目标')
  recordAdoption('O')
}

const handleApplyKR = async (idx: number) => {
  if (!result.value) return
  const aiKR = result.value.improvedDraft.keyResults[idx]
  emit('apply-kr', idx, {
    description: aiKR.description,
    type: aiKR.type || 'milestone',
    startValue: aiKR.startValue,
    targetValue: aiKR.targetValue,
    currentValue: aiKR.currentValue || aiKR.startValue || '',
    weight: aiKR.weight,
    progress: 0
  })
  ElMessage.success(`已应用到 KR${idx + 1}`)
  recordAdoption(`KR${idx + 1}`)
}

const handleApplyAll = async () => {
  if (!result.value) return
  await ElMessageBox.confirm(
    'AI 改写版会覆盖目标标题、描述和所有 KR（包括权重）。确认全部应用？',
    '全部应用',
    { type: 'warning', confirmButtonText: '全部应用', cancelButtonText: '取消' }
  ).catch(() => null) // 取消时不抛错
    .then((confirmed) => {
      if (confirmed === null) return
      const draft = {
        title: result.value!.improvedDraft.objective,
        description: result.value!.improvedDraft.objectiveDescription || '',
        keyResults: result.value!.improvedDraft.keyResults.map((kr) => ({
          description: kr.description,
          type: kr.type || 'milestone',
          startValue: kr.startValue,
          targetValue: kr.targetValue,
          currentValue: kr.currentValue || kr.startValue || '',
          weight: kr.weight,
          progress: 0
        })) as KeyResult[]
      }
      emit('apply-all', draft)
      ElMessage.success('已全部应用 AI 改写')
      recordAdoption('all', true)
      visible.value = false
    })
}

const handleBeforeClose = (done: () => void) => {
  done()
}

const getTargetTagType = (target: string): 'success' | 'primary' | 'warning' | 'info' => {
  if (target === 'O') return 'success'
  if (target.startsWith('KR')) return 'primary'
  return 'info'
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;

  .drawer-icon {
    font-size: 18px;
  }
}

.state-loading,
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: #606266;
  font-size: 14px;

  .el-icon {
    font-size: 36px;
  }
}

.state-error .el-icon {
  color: #f56c6c;
}

.check-content {
  height: 100%;
}

.section-card {
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 16px;
  }
}

/* SMART 评分卡 */
.score-card {
  background: linear-gradient(135deg, #f4f9ff 0%, #ffffff 100%);
}

.score-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.score-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 110px;

  .score-label {
    font-size: 12px;
    color: #909399;
  }

  .score-main {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .score-num {
    font-size: 36px;
    font-weight: 700;
    line-height: 1;

    &.score-good {
      color: #67c23a;
    }

    &.score-fair {
      color: #e6a23c;
    }

    &.score-poor {
      color: #f56c6c;
    }
  }

  .score-max {
    font-size: 14px;
    color: #c0c4cc;
  }
}

.dim-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dim-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .dim-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #606266;

    .dim-letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: #409eff;
      color: #fff;
      font-weight: 700;
      font-size: 11px;
    }

    .dim-name {
      color: #909399;
    }
  }
}

/* 问题清单 */
.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.issue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.issue-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;

  .issue-text {
    flex: 1;
    color: #606266;
  }
}

/* AI 改进版 */
.suggestion-block {
  padding: 12px;
  background: #f8faff;
  border-radius: 6px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.block-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;

  .block-spacer {
    flex: 1;
  }
}

.block-text {
  font-size: 13px;
  color: #303133;
  line-height: 1.7;
}

.block-desc {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

.kr-block .kr-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;

    .meta-label {
      color: #909399;
    }

    .meta-value {
      color: #303133;
      font-weight: 500;
    }
  }
}

.footer-hint {
  margin-top: 8px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-left: 3px solid #e6a23c;
  border-radius: 4px;
  font-size: 12px;
  color: #b88230;
  line-height: 1.6;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
