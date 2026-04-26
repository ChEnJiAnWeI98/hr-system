<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle || abilityName + ' · AI 辅助'"
    :width="dialogWidth"
    @open="onOpen"
    @closed="handleClosed"
  >
    <div class="ai-assist-wrapper">
      <!-- 输入区域 -->
      <div v-if="!hideInput" class="ai-section">
        <div class="ai-section-title">{{ inputLabel || '输入内容' }}</div>
        <el-input
          v-if="inputEditable"
          v-model="inputText"
          type="textarea"
          :rows="inputRows"
          :placeholder="inputPlaceholder"
          :disabled="calling || !!output"
        />
        <div v-else class="ai-input-locked">{{ inputText || '（系统自动基于当前上下文构造输入）' }}</div>
      </div>

      <!-- 调用按钮 / Loading -->
      <div v-if="!output && !calling && mode === 'edit'" class="ai-action-row">
        <el-button type="primary" :disabled="!inputText.trim()" @click="handleInvoke">
          调用 AI
        </el-button>
        <span class="ai-hint">AI 生成的是草稿参考，采纳前请人工核对</span>
      </div>
      <div v-if="calling" class="ai-action-row">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="ai-hint">AI 思考中…</span>
      </div>

      <!-- 输出区域 -->
      <div v-if="output" class="ai-section">
        <div class="ai-section-title">AI 输出</div>
        <div class="ai-output">{{ output }}</div>
      </div>

      <!-- edit 模式：采纳选择 -->
      <div v-if="output && mode === 'edit'" class="ai-adoption">
        <div class="ai-section-title">处置方式</div>
        <el-radio-group v-model="adoption">
          <el-radio label="adopted">原样采纳</el-radio>
          <el-radio label="modified_adopted">修改后采纳</el-radio>
          <el-radio label="rejected">放弃</el-radio>
        </el-radio-group>
      </div>
    </div>

    <template #footer>
      <!-- edit：调用完成后显示采纳按钮 -->
      <template v-if="mode === 'edit'">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="output" type="primary" @click="handleConfirmEdit">
          {{ adoption === 'rejected' ? '确认放弃' : '确认采纳' }}
        </el-button>
      </template>
      <!-- diagnose：只展示结果，只有关闭 -->
      <template v-else-if="mode === 'diagnose'">
        <el-button type="primary" @click="visible = false">关闭</el-button>
      </template>
      <!-- generate：采纳到字段 / 复制 / 关闭 -->
      <template v-else-if="mode === 'generate'">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="output" @click="handleCopy">复制到剪贴板</el-button>
        <el-button v-if="output && adoptable" type="primary" @click="handleAdoptGenerate">
          填入
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { invokeAIAbility, updateAIAdoption } from '@/api/performanceAI'
import type { AIAbilityCode, AdoptionResult } from '@/types/performanceAI'
import { AI_ABILITY_LABEL } from '@/types/performanceAI'

interface Props {
  modelValue: boolean
  abilityCode: AIAbilityCode
  /** 交互模式：edit=用户编辑输入+采纳 / diagnose=自动调用展示诊断（只读）/ generate=自动调用展示结果（可填入/复制）*/
  mode?: 'edit' | 'diagnose' | 'generate'
  /** 初始输入文本 */
  initialInput?: string
  /** 输入是否允许编辑（diagnose/generate 默认 false）*/
  inputEditable?: boolean
  /** 是否隐藏输入展示（极简诊断场景）*/
  hideInput?: boolean
  /** 打开 dialog 时自动调用 AI（diagnose/generate 默认 true）*/
  autoInvoke?: boolean
  /** generate 模式是否允许"填入"到业务字段 */
  adoptable?: boolean
  /** 目标对象（员工姓名等）*/
  targetEmployee?: string
  /** 操作人 */
  operatorName?: string
  /** 输入框行数 */
  inputRows?: number
  /** 输入占位符 */
  inputPlaceholder?: string
  /** 输入区标题 */
  inputLabel?: string
  /** 对话框宽度 */
  dialogWidth?: string
  /** 对话框自定义标题 */
  dialogTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'edit',
  initialInput: '',
  inputEditable: undefined,
  hideInput: false,
  autoInvoke: undefined,
  adoptable: true,
  targetEmployee: '',
  operatorName: 'HR-Lisa',
  inputRows: 6,
  inputPlaceholder: '请输入内容…',
  inputLabel: '',
  dialogWidth: '640px',
  dialogTitle: ''
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  /** 采纳（edit / generate 模式）*/
  adopt: [output: string, isModified: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const abilityName = computed(() => AI_ABILITY_LABEL[props.abilityCode])

// 根据 mode 决定默认值
const inputEditable = computed(() => {
  if (props.inputEditable !== undefined) return props.inputEditable
  return props.mode === 'edit'
})
const autoInvokeFinal = computed(() => {
  if (props.autoInvoke !== undefined) return props.autoInvoke
  return props.mode === 'diagnose' || props.mode === 'generate'
})

const inputText = ref('')
const output = ref('')
const recordId = ref<number | null>(null)
const calling = ref(false)
const adoption = ref<AdoptionResult>('adopted')

const onOpen = async () => {
  inputText.value = props.initialInput
  output.value = ''
  recordId.value = null
  adoption.value = 'adopted'
  // 自动触发
  if (autoInvokeFinal.value && inputText.value.trim()) {
    await handleInvoke()
  }
}

const handleInvoke = async () => {
  calling.value = true
  try {
    const res: any = await invokeAIAbility(
      props.abilityCode,
      inputText.value,
      props.operatorName,
      props.targetEmployee
    )
    output.value = res.data.output
    recordId.value = res.data.recordId
  } finally {
    calling.value = false
  }
}

const handleConfirmEdit = async () => {
  if (recordId.value != null) {
    const degree = adoption.value === 'modified_adopted' ? 30 : 0
    await updateAIAdoption(recordId.value, adoption.value as 'adopted' | 'modified_adopted' | 'rejected', degree)
  }
  if (adoption.value === 'adopted' || adoption.value === 'modified_adopted') {
    emit('adopt', output.value, adoption.value === 'modified_adopted')
    ElMessage.success('已采纳 AI 结果')
  } else {
    ElMessage.info('已放弃本次 AI 结果')
  }
  visible.value = false
}

const handleAdoptGenerate = async () => {
  if (recordId.value != null) {
    await updateAIAdoption(recordId.value, 'adopted', 0)
  }
  emit('adopt', output.value, false)
  ElMessage.success('已填入业务字段')
  visible.value = false
}

const handleCopy = async () => {
  if (recordId.value != null) {
    await updateAIAdoption(recordId.value, 'adopted', 0)
  }
  try {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动选中文本')
  }
}

const handleClosed = () => {
  // 未处置的草稿保留 draft 状态（mockInvokeAI 默认即是）
}
</script>

<style scoped lang="scss">
.ai-assist-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.ai-input-locked {
  padding: 10px 14px;
  background: #f5f7fa;
  color: #606266;
  border-radius: 6px;
  font-size: 13px;
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
}

.ai-action-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .ai-hint {
    font-size: 12px;
    color: #909399;
  }
}

.ai-output {
  padding: 12px 14px;
  background: #f4f9ff;
  border: 1px solid #d9ecff;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  white-space: pre-wrap;
  line-height: 1.7;
  max-height: 360px;
  overflow-y: auto;
}

.ai-adoption {
  padding-top: 4px;
}
</style>
