<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder || '请选择岗位'"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :multiple="multiple"
    :style="{ width: width || '100%' }"
    @update:model-value="handleChange"
  >
    <el-option-group
      v-for="family in groupedOptions"
      :key="family.code"
      :label="`${family.icon} ${family.label}`"
    >
      <el-option
        v-for="p in family.positions"
        :key="p.id"
        :label="p.positionName"
        :value="p.id"
      >
        <span style="display: flex; justify-content: space-between; align-items: center">
          <span>{{ p.positionName }}</span>
          <span style="font-size: 12px; color: #909399">{{ p.levelMin }}~{{ p.levelMax }}</span>
        </span>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePositionStore } from '@/store/modules/position'
import type { JobFamilyCode } from '@/types/org/position'

interface Props {
  modelValue?: number | number[] | null
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  filterable?: boolean
  multiple?: boolean
  width?: string
  /** 按岗位族筛选 */
  familyCode?: JobFamilyCode
  /** 可选的岗位 ID 白名单 */
  allowedIds?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  disabled: false,
  filterable: true,
  multiple: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const posStore = usePositionStore()

const FAMILY_META = [
  { code: 'TECH' as const, label: '技术', icon: '💻' },
  { code: 'PROD' as const, label: '产品', icon: '📋' },
  { code: 'SALES' as const, label: '销售', icon: '💼' },
  { code: 'OPS' as const, label: '运营', icon: '📣' },
  { code: 'FUNC' as const, label: '职能', icon: '🏢' },
  { code: 'MGMT' as const, label: '管理', icon: '👔' }
]

const groupedOptions = computed(() => {
  const families = props.familyCode ? [props.familyCode] : FAMILY_META.map((f) => f.code)
  return families
    .map((code) => {
      const meta = FAMILY_META.find((f) => f.code === code)!
      let positions = posStore.getPositionsByFamily(code)
      if (props.allowedIds?.length) {
        positions = positions.filter((p) => props.allowedIds!.includes(p.id))
      }
      return {
        code,
        label: meta.label,
        icon: meta.icon,
        positions
      }
    })
    .filter((f) => f.positions.length > 0)
})

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
