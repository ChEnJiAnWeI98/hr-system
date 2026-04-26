<template>
  <div v-if="shouldShow" class="ai-salary-inline" :class="statusLevel">
    <div v-if="calling" class="ai-row loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在诊断薪资合理性…</span>
    </div>
    <template v-else-if="output">
      <el-icon class="ai-icon"><MagicStick /></el-icon>
      <div class="ai-content">
        <div class="ai-summary-line">
          <span class="ai-label">AI 诊断：</span>
          <el-tag size="small" :type="tagType">{{ statusLabel }}</el-tag>
          <span class="ai-preview">{{ summaryPreview }}</span>
        </div>
      </div>
      <el-button link type="primary" @click="fullVisible = true">查看完整报告</el-button>
    </template>
    <template v-else>
      <span class="ai-placeholder">填写薪资后 AI 将自动诊断</span>
    </template>
  </div>

  <el-dialog v-model="fullVisible" title="薪酬合理性检查 · AI 完整诊断" width="700px">
    <div class="ai-full-output">{{ output }}</div>
    <template #footer>
      <el-button @click="fullVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loading, MagicStick } from '@element-plus/icons-vue'
import { invokeAIAbility } from '@/api/performanceAI'

interface Props {
  /** 业务上下文字符串（完整输入，debounce 后触发调用）*/
  context: string
  /** 关键触发条件：缺少任意一个则不调用 */
  requiredFields: (string | number | undefined | null)[]
  /** 目标对象（员工/候选人姓名）*/
  targetName?: string
  /** 操作人 */
  operatorName?: string
  /** Debounce 毫秒数 */
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  targetName: '',
  operatorName: 'HR-Lisa',
  debounceMs: 600
})

const output = ref('')
const calling = ref(false)
const fullVisible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const shouldShow = computed(() => {
  return props.requiredFields.every((f) => f !== undefined && f !== null && f !== '')
})

watch(
  () => [props.context, ...props.requiredFields],
  () => {
    output.value = ''
    if (!shouldShow.value) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => invoke(), props.debounceMs)
  },
  { immediate: true }
)

async function invoke() {
  calling.value = true
  try {
    const res: any = await invokeAIAbility('salary_sanity_check', props.context, props.operatorName, props.targetName)
    output.value = res.data.output
  } finally {
    calling.value = false
  }
}

/** 解析输出首行判断状态等级 */
const statusLevel = computed<'warning' | 'success' | 'danger' | 'info'>(() => {
  const t = output.value
  if (!t) return 'info'
  if (/风险|倒挂|严重/.test(t)) return 'danger'
  if (/偏高|偏低|建议调整|注意/.test(t)) return 'warning'
  if (/合理|正常|可通过/.test(t)) return 'success'
  return 'info'
})

const statusLabel = computed(() => {
  const m: Record<string, string> = { warning: '偏离带宽', success: '合理', danger: '高风险', info: '参考' }
  return m[statusLevel.value]
})

const tagType = computed<'warning' | 'success' | 'danger' | 'info'>(() => statusLevel.value)

const summaryPreview = computed(() => {
  if (!output.value) return ''
  const firstLine = output.value.split('\n').find((l) => l.trim())
  return firstLine ? firstLine.replace(/^[⚠️✅🔴]+\s*/, '') : ''
})
</script>

<style scoped lang="scss">
.ai-salary-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 6px;
  font-size: 12px;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;

  &.success {
    background: #f0f9eb;
    border-color: #e1f3d8;
  }
  &.warning {
    background: #fdf6ec;
    border-color: #faecd8;
  }
  &.danger {
    background: #fef0f0;
    border-color: #fde2e2;
  }

  .ai-row.loading {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #909399;
  }

  .ai-icon {
    color: #409eff;
    font-size: 16px;
  }

  .ai-content {
    flex: 1;
    min-width: 0;

    .ai-summary-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .ai-label {
        color: #606266;
        font-weight: 500;
      }

      .ai-preview {
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .ai-placeholder {
    color: #c0c4cc;
  }
}

.ai-full-output {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 13px;
  color: #303133;
  max-height: 520px;
  overflow-y: auto;
  padding: 12px 16px;
  background: #f4f9ff;
  border-radius: 6px;
}
</style>
