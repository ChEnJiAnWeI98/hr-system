<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    size="540px"
    :before-close="handleBeforeClose"
    @open="onOpen"
  >
    <template #header>
      <div class="drawer-header">
        <el-icon class="drawer-icon"><ArtAiIcon /></el-icon>
        <span class="drawer-title">员工资料卡 · AI 辅助参考</span>
      </div>
    </template>

    <div v-if="loading" class="state-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在拉员工数据生成资料卡…</span>
    </div>

    <div v-else-if="error" class="state-error">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ error }}</span>
      <el-button size="small" @click="invoke">重试</el-button>
    </div>

    <el-scrollbar v-else-if="output" class="profile-content">
      <!-- 输入数据来源（默认折叠）-->
      <el-collapse>
        <el-collapse-item name="src">
          <template #title>
            <span class="src-title">员工档案数据（点击展开查看 RAG 原始数据）</span>
          </template>
          <pre class="src-text">{{ contextInput }}</pre>
        </el-collapse-item>
      </el-collapse>

      <!-- AI 资料卡输出（三段式卡片）-->
      <div class="card-section">
        <div class="card-section-title">AI 资料卡</div>

        <template v-if="sections">
          <div
            v-for="s in sections"
            :key="s.key"
            :class="['profile-card', `profile-card-${s.key}`]"
          >
            <div class="profile-card-header">
              <el-icon class="profile-card-icon">
                <DataAnalysis v-if="s.key === 'snapshot'" />
                <ArtAiIcon v-else-if="s.key === 'insight'" />
                <Aim v-else-if="s.key === 'focus'" />
              </el-icon>
              <span class="profile-card-title">{{ s.label }}</span>
            </div>
            <pre class="profile-card-body">{{ s.content }}</pre>
          </div>

          <!-- 数据来源 footer（来自 AI 输出 "——" 行）-->
          <div v-if="aiFooter" class="profile-source-footer">
            <pre>{{ aiFooter }}</pre>
          </div>
        </template>

        <!-- 兜底：解析失败时仍按原 pre 渲染 -->
        <pre v-else class="card-text">{{ output }}</pre>
      </div>

      <!-- 安全提示 -->
      <div class="footer-hint">
        本卡仅供 Leader / 面谈人参考，1on1 / 绩效面谈具体怎么聊由 Leader 决定。
      </div>
    </el-scrollbar>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="output" type="primary" :icon="DocumentCopy" @click="handleCopy">
          复制资料卡
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loading, WarningFilled, DocumentCopy, DataAnalysis, Aim } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { invokeAIAbility, updateAIAdoption } from '@/api/performanceAI'

interface ProfileSection {
  emoji: string
  label: string
  key: 'snapshot' | 'insight' | 'focus'
  content: string
}

interface Props {
  modelValue: boolean
  /** 系统拼接的员工档案数据上下文（mock 阶段；真接入 LLM 时由 RAG 层注入真实数据）*/
  contextInput: string
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
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const error = ref('')
const output = ref('')
const recordId = ref<number | null>(null)

/**
 * 解析 AI 输出文本为三段式结构：
 * 📊 数据快照 / 🤖 AI 智能洞察 / 📋 重点关注
 *
 * 解析失败（少于 2 段）时返回 null，UI 会兜底走原 <pre> 平铺渲染
 */
const sections = computed<ProfileSection[] | null>(() => {
  if (!output.value) return null
  const text = output.value

  const markerSpec: { emoji: string; label: string; key: ProfileSection['key'] }[] = [
    { emoji: '📊', label: '数据快照', key: 'snapshot' },
    { emoji: '🤖', label: 'AI 智能洞察', key: 'insight' },
    { emoji: '📋', label: '重点关注', key: 'focus' }
  ]

  const found = markerSpec
    .map((m) => {
      const pos = text.indexOf(m.emoji)
      return pos >= 0 ? { ...m, pos } : null
    })
    .filter((x): x is { emoji: string; label: string; key: ProfileSection['key']; pos: number } => x !== null)

  if (found.length < 2) return null

  found.sort((a, b) => a.pos - b.pos)

  const result: ProfileSection[] = []
  for (let i = 0; i < found.length; i++) {
    const start = found[i].pos
    const end = i < found.length - 1 ? found[i + 1].pos : text.length
    let body = text.slice(start, end)

    // 剥离首行 marker 行
    const firstNewline = body.indexOf('\n')
    if (firstNewline >= 0) body = body.slice(firstNewline + 1)

    // 剥离 "——" 数据来源/合规提示行（统一在 aiFooter 渲染）
    body = body
      .split('\n')
      .filter((l) => !l.trim().startsWith('——'))
      .join('\n')

    result.push({
      emoji: found[i].emoji,
      label: found[i].label,
      key: found[i].key,
      content: body.trim()
    })
  }

  return result
})

/**
 * AI 输出尾部的"——"溯源行
 * 仅保留"数据来源 / 数据窗口 / 信号源"等数据溯源信息，
 * 过滤掉与 UI 底部静态提示重复的免责声明行（"仅供 Leader 决定"等）
 */
const aiFooter = computed(() => {
  if (!output.value) return ''
  return output.value
    .split('\n')
    .filter((l) => {
      const trimmed = l.trim()
      if (!trimmed.startsWith('——')) return false
      // 排除与 UI 底部静态提示语义重复的免责声明行
      const isDuplicateDisclaimer = /Leader.*决定|面谈.*决定|仅供.*Leader|仅供.*面谈/.test(trimmed)
      return !isDuplicateDisclaimer
    })
    .join('\n')
})

const onOpen = () => {
  output.value = ''
  error.value = ''
  recordId.value = null
  if (props.contextInput.trim()) {
    invoke()
  } else {
    error.value = '当前员工信息不足，无法生成资料卡（请先选择员工）'
  }
}

const invoke = async () => {
  loading.value = true
  error.value = ''
  try {
    const res: any = await invokeAIAbility(
      'meeting_agenda',
      props.contextInput,
      props.operatorName,
      props.targetEmployee
    )
    output.value = res.data?.output || ''
    recordId.value = res.data?.recordId || null
    if (!output.value) error.value = 'AI 返回数据为空，请重试'
  } catch (e: any) {
    error.value = e?.message || 'AI 调用失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleCopy = async () => {
  if (recordId.value != null) {
    try {
      await updateAIAdoption(recordId.value, 'adopted', 0)
    } catch {
      /* 留痕失败不阻塞 */
    }
  }
  try {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制资料卡到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动选中文本')
  }
}

const handleBeforeClose = (done: () => void) => {
  done()
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
    color: #7367f0;
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

.profile-content {
  height: 100%;
}

/* 数据来源（折叠区）*/
.src-title {
  font-size: 13px;
  color: #909399;
}

.src-text {
  margin: 0;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
  color: #606266;
  line-height: 1.7;
  white-space: pre-wrap;
  font-family: inherit;
  max-height: 240px;
  overflow-y: auto;
}

/* AI 资料卡区 */
.card-section {
  margin-top: 16px;
}

.card-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

/* 三段式卡片 */
.profile-card {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fff;

  &-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  &-icon {
    font-size: 16px;
  }

  &-title {
    flex: 1;
  }

  &-body {
    margin: 0;
    font-size: 13px;
    color: #303133;
    line-height: 1.8;
    white-space: pre-wrap;
    font-family: inherit;
  }

  /* 数据快照：浅蓝（数据感）*/
  &-snapshot {
    background: #f4f9ff;
    border-color: #d9ecff;

    .profile-card-icon {
      color: #409eff;
    }
  }

  /* AI 智能洞察：浅紫（AI 感，sparkle 配色）*/
  &-insight {
    background: #f6f4ff;
    border-color: #e1d9ff;

    .profile-card-icon {
      color: #7367f0;
    }
  }

  /* 重点关注：浅橙 + 左侧强调（最重要）*/
  &-focus {
    background: #fff7e6;
    border-color: #ffe7ba;
    border-left: 3px solid #faad14;

    .profile-card-icon {
      color: #faad14;
    }
  }
}

/* AI 输出尾部数据来源行 */
.profile-source-footer {
  margin-top: 12px;
  padding: 8px 4px;
  font-size: 11px;
  color: #909399;

  pre {
    margin: 0;
    font-family: inherit;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

/* 兜底：解析失败时的纯文本渲染 */
.card-text {
  margin: 0;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f4f9ff 0%, #ffffff 100%);
  border: 1px solid #d9ecff;
  border-radius: 8px;
  font-size: 13px;
  color: #303133;
  line-height: 1.8;
  white-space: pre-wrap;
  font-family: inherit;
}

.footer-hint {
  margin-top: 16px;
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
