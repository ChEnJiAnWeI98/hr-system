<template>
  <el-autocomplete
    :model-value="modelValue"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :trigger-on-focus="false"
    value-key="candidateName"
    clearable
    :style="{ width: width }"
    @input="handleInput"
    @select="handleSelect"
    @clear="handleClear"
  >
    <template #default="{ item }">
      <div class="cp-option">
        <span class="cp-name">{{ item.candidateName }}</span>
        <span class="cp-meta">{{ item.position || '—' }} · {{ item.phone || '—' }}</span>
      </div>
    </template>
    <template #append>
      <span class="cp-hint">从简历池搜，或直接输入新候选人</span>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { getResumeList } from '@/api/recruitment/resume'
import type { Resume } from '@/types/recruitment'

defineOptions({ name: 'CandidatePicker' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    width?: string
  }>(),
  {
    modelValue: '',
    placeholder: '输入姓名搜索，或直接录入新候选人',
    width: '100%'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [resume: Resume]
  clear: []
}>()

type Suggestion = Resume & { value: string }

const querySearch = (queryString: string, cb: (results: any[]) => void) => {
  if (!queryString) {
    cb([])
    return
  }
  getResumeList({
    candidateName: queryString,
    page: 1,
    pageSize: 10
  })
    .then((res: any) => {
      const list: Resume[] = res?.data?.list || []
      cb(list.map((r) => ({ ...r, value: r.candidateName })))
    })
    .catch(() => cb([]))
}

const handleInput = (val: string | number) => {
  emit('update:modelValue', String(val))
}

const handleSelect = (item: Record<string, any>) => {
  const s = item as Suggestion
  emit('update:modelValue', s.candidateName)
  emit('select', s)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped lang="scss">
.cp-option {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  padding: 4px 0;

  .cp-name {
    font-size: 14px;
    color: #303133;
  }

  .cp-meta {
    font-size: 12px;
    color: #909399;
  }
}

.cp-hint {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
