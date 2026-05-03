<template>
  <el-popover
    :visible="visible"
    placement="bottom-end"
    :width="420"
    trigger="click"
    @hide="handleClosed"
  >
    <template #reference>
      <slot />
    </template>

    <div class="ai-popover-wrapper">
      <div class="ai-popover-head">
        <span class="ai-popover-title">
          <el-icon><ArtAiIcon /></el-icon>
          {{ abilityName }}
        </span>
        <el-button link size="small" @click="handleClose">关闭</el-button>
      </div>

      <!-- 风格切换（仅 comment_polish 显示）-->
      <div v-if="showToneSwitch" class="ai-popover-tone">
        <span class="ai-popover-tone-label">风格</span>
        <el-radio-group
          v-model="currentTone"
          size="small"
          @change="reinvoke"
        >
          <el-radio-button value="professional">专业</el-radio-button>
          <el-radio-button value="concise">简洁</el-radio-button>
          <el-radio-button value="constructive">建设性</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="calling" class="ai-popover-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>AI 思考中…</span>
      </div>

      <template v-else-if="output">
        <div class="ai-popover-section">
          <div class="ai-popover-label">原文</div>
          <div class="ai-popover-old">{{ inputText }}</div>
        </div>
        <div class="ai-popover-section">
          <div class="ai-popover-label">AI 建议</div>
          <div class="ai-popover-new">{{ output }}</div>
        </div>
        <div v-if="showToneSwitch" class="ai-popover-disclaimer">
          ⚠️ AI 仅做风格润色，不会补充原稿没有的事实。请采纳前核对内容是否符合您的本意。
        </div>
        <div class="ai-popover-actions">
          <el-button size="small" @click="handleReject">放弃</el-button>
          <el-button type="primary" size="small" @click="handleAdopt">替换原文</el-button>
        </div>
      </template>

      <div v-else class="ai-popover-empty">原文为空，无法调用</div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { invokeAIAbility, updateAIAdoption } from '@/api/performanceAI'
import type { AIAbilityCode } from '@/types/performanceAI'
import { AI_ABILITY_LABEL } from '@/types/performanceAI'

interface Props {
  /** 显隐（v-model） */
  modelValue: boolean
  abilityCode: AIAbilityCode
  /** 原文（等同于 inputText） */
  inputText: string
  /** 目标对象 */
  targetEmployee?: string
  /** 操作人 */
  operatorName?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetEmployee: '',
  operatorName: 'HR-Lisa'
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  /** 替换原文 */
  adopt: [output: string]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const abilityName = computed(() => AI_ABILITY_LABEL[props.abilityCode])

const output = ref('')
const recordId = ref<number | null>(null)
const calling = ref(false)

// 风格切换（仅 comment_polish 用，默认 professional）
const showToneSwitch = computed(() => props.abilityCode === 'comment_polish')
const currentTone = ref<'professional' | 'concise' | 'constructive'>('professional')

const buildInput = (): string => {
  // 仅 comment_polish 在 input 中编码 tone（mock 阶段；真接入 LLM 时改为单独参数）
  if (showToneSwitch.value) {
    return `[tone:${currentTone.value}]\n${props.inputText}`
  }
  return props.inputText
}

const invoke = async () => {
  if (!props.inputText.trim()) return
  calling.value = true
  output.value = ''
  recordId.value = null
  try {
    const res: any = await invokeAIAbility(
      props.abilityCode,
      buildInput(),
      props.operatorName,
      props.targetEmployee
    )
    output.value = res.data.output
    recordId.value = res.data.recordId
  } finally {
    calling.value = false
  }
}

const reinvoke = () => invoke()

// 打开时自动调用
watch(visible, async (v) => {
  if (v) {
    if (showToneSwitch.value) currentTone.value = 'professional'
    await invoke()
  }
})

const handleClose = () => {
  visible.value = false
}

const handleClosed = () => {
  // 无需采纳结果变更（draft）
}

const handleAdopt = async () => {
  if (recordId.value != null) {
    await updateAIAdoption(recordId.value, 'adopted', 0)
  }
  emit('adopt', output.value)
  ElMessage.success('已替换原文')
  visible.value = false
}

const handleReject = async () => {
  if (recordId.value != null) {
    await updateAIAdoption(recordId.value, 'rejected', 0)
  }
  ElMessage.info('已放弃')
  visible.value = false
}
</script>

<style scoped lang="scss">
.ai-popover-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-popover-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ai-popover-title {
    font-weight: 600;
    font-size: 14px;
    color: #303133;
  }
}

.ai-popover-tone {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f5f7fa;
  border-radius: 4px;

  .ai-popover-tone-label {
    font-size: 12px;
    color: #909399;
    flex-shrink: 0;
  }
}

.ai-popover-disclaimer {
  padding: 6px 8px;
  background: #fdf6ec;
  border-left: 2px solid #e6a23c;
  border-radius: 2px;
  font-size: 11px;
  color: #b88230;
  line-height: 1.5;
}

.ai-popover-loading {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
  font-size: 13px;
}

.ai-popover-section {
  .ai-popover-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .ai-popover-old {
    padding: 8px 10px;
    background: #fef0f0;
    color: #909399;
    font-size: 12px;
    border-radius: 4px;
    max-height: 80px;
    overflow-y: auto;
    line-height: 1.6;
    white-space: pre-wrap;
    text-decoration: line-through;
  }

  .ai-popover-new {
    padding: 8px 10px;
    background: #f0f9eb;
    color: #303133;
    font-size: 13px;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.7;
    white-space: pre-wrap;
  }
}

.ai-popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.ai-popover-empty {
  padding: 16px 0;
  text-align: center;
  color: #c0c4cc;
  font-size: 13px;
}
</style>
