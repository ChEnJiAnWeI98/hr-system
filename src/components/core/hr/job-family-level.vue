<template>
  <el-cascader
    :model-value="modelValue"
    :options="options"
    :props="{
      label: 'label',
      value: 'value',
      children: 'children',
      expandTrigger: 'hover'
    }"
    :placeholder="placeholder || '请选择岗位族与职级'"
    :clearable="clearable"
    :disabled="disabled"
    :style="{ width: width || '100%' }"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePositionStore } from '@/store/modules/position'
import type { JobFamilyCode } from '@/types/org/position'

interface Props {
  /** 格式：[familyCode, sequenceCode, levelCode] */
  modelValue?: (string | number)[] | null
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  width?: string
  /** 是否跳过"序列"层级，直接 家族 → 职级 两层 */
  skipSequence?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  disabled: false,
  skipSequence: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const posStore = usePositionStore()

const FAMILY_META = [
  { code: 'TECH' as const, label: '💻 技术' },
  { code: 'PROD' as const, label: '📋 产品' },
  { code: 'SALES' as const, label: '💼 销售' },
  { code: 'OPS' as const, label: '📣 运营' },
  { code: 'FUNC' as const, label: '🏢 职能' },
  { code: 'MGMT' as const, label: '👔 管理' }
]

const options = computed(() => {
  return FAMILY_META.map((f) => {
    const sequences = posStore.getSequencesByFamily(f.code)
    if (props.skipSequence) {
      // 家族 → 职级（取家族下所有序列的职级并集）
      const levelTrack = f.code === 'MGMT' ? 'management' : 'professional'
      const levels = posStore.getLevelsByTrack(levelTrack).map((l) => ({
        label: l.name,
        value: l.code
      }))
      return {
        label: f.label,
        value: f.code,
        children: levels
      }
    }
    // 家族 → 序列 → 职级
    return {
      label: f.label,
      value: f.code,
      children: sequences.map((s) => {
        const levelTrack = f.code === 'MGMT' ? 'management' : 'professional'
        const allLevels = posStore.getLevelsByTrack(levelTrack)
        const minRank = posStore.levels.find((l) => l.code === s.levelMin)?.rank ?? 0
        const maxRank = posStore.levels.find((l) => l.code === s.levelMax)?.rank ?? 10
        const levels = allLevels.filter((l) => l.rank >= minRank && l.rank <= maxRank)
        return {
          label: s.name,
          value: s.code,
          children: levels.map((l) => ({ label: l.name, value: l.code }))
        }
      })
    }
  })
})

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
