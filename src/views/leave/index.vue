<template>
  <div class="leave-container">
    <el-card class="tab-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <el-tab-pane label="假期配置" name="leaveType">
          <LeaveTypeTab />
        </el-tab-pane>
        <el-tab-pane label="假期额度" name="leaveQuota">
          <LeaveQuotaTab />
        </el-tab-pane>
        <el-tab-pane label="请假申请" name="leaveApplication">
          <LeaveApplicationTab />
        </el-tab-pane>
        <el-tab-pane label="调休管理" name="timeOff">
          <TimeOffTab />
        </el-tab-pane>
        <el-tab-pane label="假期台账" name="leaveLedger">
          <LeaveLedgerTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeaveTypeTab from './components/LeaveTypeTab.vue'
import LeaveQuotaTab from './components/LeaveQuotaTab.vue'
import LeaveApplicationTab from './components/LeaveApplicationTab.vue'
import TimeOffTab from './components/TimeOffTab.vue'
import LeaveLedgerTab from './components/LeaveLedgerTab.vue'

defineOptions({
  name: 'LeaveManagement'
})

const activeTab = ref('leaveType')

const handleTabChange = (tabName: string) => {
  console.log('切换到标签页:', tabName)
}
</script>

<style scoped lang="scss">
.leave-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      flex-shrink: 0;
      margin-bottom: 20px;
    }

    .el-tabs__content {
      flex: 1;
      overflow: hidden;

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
