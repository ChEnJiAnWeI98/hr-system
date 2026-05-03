<template>
  <el-tabs
    :model-value="modelValue"
    class="page-tabs"
    @update:model-value="handleChange"
  >
    <slot />
  </el-tabs>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    /** 当前激活的 Tab name */
    modelValue: string
    /** 是否同步 URL query 参数（默认关闭，符合国内 B 端规范；仅在需要分享深链/刷新保留状态时显式开启） */
    syncUrl?: boolean
    /** URL query 参数名（默认 tab） */
    queryKey?: string
  }>(),
  {
    syncUrl: false,
    queryKey: 'tab'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'tab-change': [name: string]
}>()

const route = useRoute()
const router = useRouter()

const handleChange = (name: string | number) => {
  const value = String(name)
  emit('update:modelValue', value)
  emit('tab-change', value)
  if (props.syncUrl) {
    router
      .replace({ query: { ...route.query, [props.queryKey]: value } })
      .catch(() => {})
  }
}

onMounted(() => {
  if (!props.syncUrl) return
  const queryTab = route.query[props.queryKey]
  if (typeof queryTab === 'string' && queryTab && queryTab !== props.modelValue) {
    emit('update:modelValue', queryTab)
  }
})

watch(
  () => route.query[props.queryKey],
  (newTab) => {
    if (!props.syncUrl) return
    if (typeof newTab === 'string' && newTab && newTab !== props.modelValue) {
      emit('update:modelValue', newTab)
    }
  }
)
</script>

<style scoped lang="scss">
.page-tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  :deep(.el-tabs__header) {
    flex-shrink: 0;
    margin: 0 0 16px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }

  :deep(.el-tabs__item) {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 400;

    &.is-active {
      font-weight: 500;
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 2px;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-tab-pane) {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
