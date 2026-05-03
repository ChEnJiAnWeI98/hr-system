<template>
  <div class="page-container">
    <ModuleTabBar :tabs="paramTabs" />
    <ParamGroupForm group-name="业务配置" />
  </div>
</template>

<script setup lang="ts">
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import ParamGroupForm from '@/views/system/_shared/ParamGroupForm.vue'
import { paramTabs } from '@/views/system/_shared/paramTabs'

defineOptions({ name: 'SystemParamBusiness' })
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
