<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder || '请选择'"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :style="{ width: width || '100%' }"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <template v-if="showExtraTag && getExtraType(item)">
        <span style="display: flex; align-items: center; justify-content: space-between">
          <span>{{ item.label }}</span>
          <el-tag size="small" :type="getExtraType(item)">{{ item.label }}</el-tag>
        </span>
      </template>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDictStore } from '@/store/modules/dict'

interface Props {
  /** 绑定值 */
  modelValue?: string | number | (string | number)[] | null
  /** 字典编码（如 EDUCATION、EMP_STATUS） */
  dictCode: string
  /** 占位符 */
  placeholder?: string
  /** 是否可清除 */
  clearable?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 宽度 */
  width?: string
  /** 排除的值（不展示在选项里） */
  excludeValues?: (string | number)[]
  /** 是否展示 extra type 标签 */
  showExtraTag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  multiple: false,
  disabled: false,
  showExtraTag: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const dictStore = useDictStore()

const options = computed(() => {
  const items = dictStore.getItems(props.dictCode)
  if (props.excludeValues?.length) {
    return items.filter((i) => !props.excludeValues!.includes(i.value))
  }
  return items
})

const getExtraType = (item: any) => item.extra?.type

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
