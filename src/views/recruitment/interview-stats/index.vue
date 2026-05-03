<template>
  <div class="interview-stats-container">
    <ModuleTabBar :tabs="interviewGroupTabs" />
    <InterviewerEfficiencyTab />
  </div>
</template>

<script setup lang="ts">
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import InterviewerEfficiencyTab from '@/views/recruitment/interview/components/InterviewerEfficiencyTab.vue'

defineOptions({ name: 'RecruitInterviewStats' })

const interviewGroupTabs = [
  { label: '面试列表', path: '/recruit/interview' },
  { label: '面试官效率', path: '/recruit/interview-stats' }
]
</script>

<style scoped lang="scss">
.interview-stats-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
