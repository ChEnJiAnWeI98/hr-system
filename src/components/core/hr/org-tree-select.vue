<template>
  <el-tree-select
    :model-value="modelValue"
    :data="treeData"
    :props="treeProps"
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder || '请选择组织'"
    :filterable="filterable"
    :filter-node-method="filterNodeMethod"
    :check-strictly="checkStrictly"
    :show-checkbox="multiple"
    :style="{ width: width || '100%' }"
    @update:model-value="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrganizationStore } from '@/store/modules/organization'
import type { Organization, OrgNodeType } from '@/types/org/organization'

interface Props {
  modelValue?: number | number[] | null
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  disabled?: boolean
  filterable?: boolean
  /** 多选时是否支持父子独立勾选 */
  checkStrictly?: boolean
  width?: string
  /** 限制最大层级（如 2 表示只到事业部层）*/
  maxLevel?: number
  /** 只允许选择某些节点类型 */
  allowedTypes?: OrgNodeType[]
  /** 排除的组织 ID 列表 */
  excludeIds?: number[]
  /** 是否只显示 active 状态 */
  onlyActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  multiple: false,
  disabled: false,
  filterable: true,
  checkStrictly: true,
  onlyActive: true
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any, node?: Organization]
}>()

const orgStore = useOrganizationStore()

const treeProps = {
  label: 'orgName',
  children: 'children',
  value: 'id',
  disabled: (data: any) => {
    if (props.allowedTypes && !props.allowedTypes.includes(data.nodeType)) return true
    if (props.excludeIds && props.excludeIds.includes(data.id)) return true
    if (props.maxLevel && data.level > props.maxLevel) return true
    if (props.onlyActive && data.status !== 'active') return true
    return false
  }
}

const treeData = computed(() => orgStore.getTree)

const filterNodeMethod = (value: string, data: any) => {
  const org = data as Organization
  return !value || org.orgName.includes(value) || org.orgCode.includes(value)
}

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  const node = typeof value === 'number' ? orgStore.getById(value) : undefined
  emit('change', value, node)
}
</script>
