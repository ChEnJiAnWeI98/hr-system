<template>
  <el-tabs
    v-model="currentPath"
    class="module-tab-bar"
    @tab-change="handleChange"
  >
    <el-tab-pane
      v-for="t in tabs"
      :key="t.path"
      :name="t.path"
    >
      <template #label>
        <span v-if="t.icon" class="mtb-icon">{{ t.icon }}</span>
        {{ t.label }}
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  tabs: Array<{ label: string; path: string; icon?: string }>
}>()

const route = useRoute()
const router = useRouter()

const currentPath = computed({
  get: () => {
    const found = props.tabs.find((t) => route.path === t.path)
    return found?.path || props.tabs[0]?.path || ''
  },
  set: () => {
    // setter 由 @tab-change 处理路由跳转
  }
})

const handleChange = (path: string | number) => {
  if (typeof path === 'string' && path !== route.path) {
    router.push(path)
  }
}
</script>

<style scoped lang="scss">
.module-tab-bar {
  flex-shrink: 0;

  /* 去掉默认底部 padding，让 Tab 更紧凑 */
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  /* 隐藏 el-tab-pane 的内容区（我们只用 header 做导航）*/
  :deep(.el-tabs__content) {
    display: none;
  }

  .mtb-icon {
    margin-right: 4px;
  }
}
</style>
