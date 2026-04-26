<template>
  <div class="salary-container">
    <el-card class="tab-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <el-tab-pane label="薪资结构配置" name="structure">
          <SalaryStructureTab />
        </el-tab-pane>
        <el-tab-pane label="薪酬计算" name="calculation">
          <SalaryCalculationTab />
        </el-tab-pane>
        <el-tab-pane label="工资条管理" name="payslip">
          <PayslipTab />
        </el-tab-pane>
        <el-tab-pane label="个税申报" name="tax">
          <TaxDeclarationTab />
        </el-tab-pane>
        <el-tab-pane label="调薪管理" name="adjustment">
          <SalaryAdjustmentTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SalaryStructureTab from './components/SalaryStructureTab.vue'
import SalaryCalculationTab from './components/SalaryCalculationTab.vue'
import PayslipTab from './components/PayslipTab.vue'
import TaxDeclarationTab from './components/TaxDeclarationTab.vue'
import SalaryAdjustmentTab from './components/SalaryAdjustmentTab.vue'

defineOptions({
  name: 'SalaryManagement'
})

const activeTab = ref('structure')

const handleTabChange = (tabName: string) => {
  console.log('切换到标签页:', tabName)
}
</script>

<style scoped lang="scss">
.salary-container {
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
