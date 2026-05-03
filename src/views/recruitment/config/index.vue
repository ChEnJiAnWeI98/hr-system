<template>
  <div class="config-center-container">
    <ModuleTabBar :tabs="settingsGroupTabs" />
    <el-card class="config-card">
      <el-tabs v-model="activeTab" class="config-tabs">
        <el-tab-pane label="面试评价模板" name="interview">
          <InterviewTemplateTab v-if="activeTab === 'interview'" />
        </el-tab-pane>
        <el-tab-pane label="Offer 模板" name="offer">
          <OfferTemplateTab v-if="activeTab === 'offer'" />
        </el-tab-pane>
        <el-tab-pane label="通知模板" name="notification">
          <NotificationTemplateTab v-if="activeTab === 'notification'" />
        </el-tab-pane>
        <el-tab-pane label="入职资料模板" name="onboarding">
          <OnboardingTemplateTab v-if="activeTab === 'onboarding'" />
        </el-tab-pane>
        <el-tab-pane label="招聘流程配置" name="process">
          <ProcessConfigTab v-if="activeTab === 'process'" />
        </el-tab-pane>
        <el-tab-pane label="渠道账号管理" name="channel">
          <ChannelAccountTab v-if="activeTab === 'channel'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import InterviewTemplateTab from './components/InterviewTemplateTab.vue'
import OfferTemplateTab from './components/OfferTemplateTab.vue'
import NotificationTemplateTab from './components/NotificationTemplateTab.vue'
import OnboardingTemplateTab from './components/OnboardingTemplateTab.vue'
import ProcessConfigTab from './components/ProcessConfigTab.vue'
import ChannelAccountTab from './components/ChannelAccountTab.vue'

defineOptions({
  name: 'RecruitmentConfig'
})

const settingsGroupTabs = [
  { label: '招聘配置中心', path: '/recruit/settings-config' },
  { label: '自动化规则', path: '/recruit/settings-automation' },
  { label: '内推规则', path: '/recruit/settings-referral-rules' },
  { label: '外部集成', path: '/recruit/settings-integrations' }
]

const activeTab = ref('interview')
</script>

<style scoped lang="scss">
.config-center-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 0 20px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.config-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
