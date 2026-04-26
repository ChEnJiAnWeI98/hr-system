<template>
  <div class="module-tab-bar">
    <el-radio-group :model-value="currentPath" @change="handleChange">
      <el-radio-button v-for="t in tabs" :key="t.path" :value="t.path">
        <span v-if="t.icon" class="mtb-icon">{{ t.icon }}</span>
        {{ t.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  tabs: Array<{ label: string; path: string; icon?: string }>
}>()

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => {
  const found = props.tabs.find((t) => route.path === t.path)
  return found?.path || props.tabs[0]?.path
})

const handleChange = (path: any) => {
  if (typeof path === 'string' && path !== route.path) {
    router.push(path)
  }
}
</script>

<style scoped lang="scss">
.module-tab-bar {
  flex-shrink: 0;
  margin-bottom: 16px;
  background: #fff;
  padding: 6px;
  border-radius: 10px;
  display: inline-block;

  :deep(.el-radio-button__inner) {
    padding: 8px 20px;
    font-size: 13px;
    border-radius: 6px !important;
    border-left: 1px solid #dcdfe6 !important;
  }

  .mtb-icon {
    margin-right: 4px;
  }
}
</style>
