<template>
  <div class="attendance-container">
    <el-card class="tab-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <el-tab-pane label="考勤规则" name="rule">
          <AttendanceRuleTab />
        </el-tab-pane>
        <el-tab-pane label="打卡记录" name="record">
          <AttendanceRecordTab />
        </el-tab-pane>
        <el-tab-pane label="加班申请" name="overtime">
          <OvertimeTab />
        </el-tab-pane>
        <el-tab-pane label="外勤记录" name="fieldwork">
          <FieldWorkTab />
        </el-tab-pane>
        <el-tab-pane label="补卡申请" name="makeup">
          <MakeupClockInTab />
        </el-tab-pane>
        <el-tab-pane label="考勤统计" name="statistics">
          <AttendanceStatisticsTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AttendanceRuleTab from './components/AttendanceRuleTab.vue'
import AttendanceRecordTab from './components/AttendanceRecordTab.vue'
import OvertimeTab from './components/OvertimeTab.vue'
import FieldWorkTab from './components/FieldWorkTab.vue'
import MakeupClockInTab from './components/MakeupClockInTab.vue'
import AttendanceStatisticsTab from './components/AttendanceStatisticsTab.vue'

defineOptions({
  name: 'AttendanceManagement'
})

const activeTab = ref('rule')

const handleTabChange = (tabName: string) => {
  console.log('切换到标签页:', tabName)
}
</script>

<style scoped lang="scss">
.attendance-container {
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
