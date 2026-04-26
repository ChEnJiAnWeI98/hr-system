<template>
  <slot :visible-data="visibleData" :scope="rbacStore.currentDataScope" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRBACStore } from '@/store/modules/rbac'
import type { Employee } from '@/types/employee/profile'

interface Props {
  /** 待过滤的员工数据 */
  data: Employee[]
  /** 是否启用过滤（测试时可关闭） */
  enabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true
})

const rbacStore = useRBACStore()

const visibleData = computed<Employee[]>(() => {
  if (!props.enabled) return props.data
  return rbacStore.filterEmployees(props.data)
})
</script>
