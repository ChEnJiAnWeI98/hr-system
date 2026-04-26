<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder || '请选择员工'"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :collapse-tags="multiple"
    :collapse-tags-tooltip="multiple"
    :filterable="true"
    :filter-method="handleFilter"
    :style="{ width: width || '100%' }"
    :loading="loading"
    @update:model-value="handleChange"
    @visible-change="onVisibleChange"
  >
    <el-option
      v-for="e in visibleOptions"
      :key="e.id"
      :label="`${e.nameZh}（${e.employeeNo}）`"
      :value="e.id"
    >
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>
          <span style="font-weight: 500">{{ e.nameZh }}</span>
          <span style="color: #909399; font-size: 12px; margin-left: 4px">
            {{ e.employeeNo }}
          </span>
        </span>
        <span style="font-size: 12px; color: #909399">
          {{ e.orgName }} · {{ e.level }}
        </span>
      </div>
    </el-option>
    <div v-if="visibleOptions.length === 0" style="padding: 20px; color: #909399; text-align: center">
      没有符合条件的员工
    </div>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmployeeStore } from '@/store/modules/employee'
import type { Employee, EmployeeStatus } from '@/types/employee/profile'

interface Props {
  modelValue?: number | number[] | null
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  multiple?: boolean
  width?: string
  /** 按组织过滤（含子组织）*/
  orgFilter?: number
  /** 按岗位族过滤 */
  familyFilter?: string
  /** 只显示某些状态的员工 */
  statusFilter?: EmployeeStatus[]
  /** 排除的员工 ID */
  excludeIds?: number[]
  /** 允许的员工 ID 白名单 */
  allowedIds?: number[]
  /** 最大显示数量（避免一次渲染 200 个） */
  maxDisplay?: number
}

const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  disabled: false,
  multiple: false,
  maxDisplay: 50
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any, employee?: Employee | Employee[]]
}>()

const empStore = useEmployeeStore()
const loading = ref(false)
const keyword = ref('')

/** 所有备选员工 */
const baseList = computed(() => {
  let list = empStore.employees
  if (props.orgFilter) {
    list = empStore.getByOrg(props.orgFilter, true)
  }
  if (props.familyFilter) {
    list = list.filter((e) => e.jobFamily === props.familyFilter)
  }
  if (props.statusFilter?.length) {
    list = list.filter((e) => props.statusFilter!.includes(e.status))
  }
  if (props.excludeIds?.length) {
    list = list.filter((e) => !props.excludeIds!.includes(e.id))
  }
  if (props.allowedIds?.length) {
    list = list.filter((e) => props.allowedIds!.includes(e.id))
  }
  return list
})

/** 应用搜索关键字 + 数量上限 */
const visibleOptions = computed(() => {
  let list = baseList.value
  if (keyword.value) {
    const k = keyword.value.toLowerCase()
    list = list.filter(
      (e) =>
        e.nameZh.includes(keyword.value) ||
        e.employeeNo.toLowerCase().includes(k) ||
        e.positionName.includes(keyword.value)
    )
  }
  return list.slice(0, props.maxDisplay)
})

const handleFilter = (v: string) => {
  keyword.value = v
}

const onVisibleChange = (visible: boolean) => {
  if (!visible) keyword.value = ''
}

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  if (Array.isArray(value)) {
    const emps = value.map((id) => empStore.getById(id)).filter(Boolean) as Employee[]
    emit('change', value, emps)
  } else {
    const e = typeof value === 'number' ? empStore.getById(value) : undefined
    emit('change', value, e)
  }
}
</script>
