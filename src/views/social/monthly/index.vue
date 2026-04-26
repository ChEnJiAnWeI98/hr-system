<template>
  <div class="monthly-container">
    <el-card class="main-card">
      <div class="toolbar">
        <el-button type="primary" @click="handleDeclarationExport">
          <el-icon><Download /></el-icon>
          申报导出
        </el-button>
        <span class="tip">提示：月度计算生成社保账单；已完成缴费的月份状态显示为「已缴费」</span>
      </div>
      <div class="content-wrapper">
        <InsuranceBill />
      </div>
    </el-card>

    <el-drawer v-model="exportDrawerVisible" title="申报导出" size="620px">
      <DeclarationExport />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download } from '@element-plus/icons-vue'
import InsuranceBill from '@/views/social-security/insurance-bill/index.vue'
import DeclarationExport from '@/views/social-security/declaration-export/index.vue'

defineOptions({ name: 'SocialMonthly' })

const exportDrawerVisible = ref(false)

const handleDeclarationExport = () => {
  exportDrawerVisible.value = true
}
</script>

<style scoped lang="scss">
.monthly-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-card {
    flex: 1;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      height: 100%;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    flex-shrink: 0;

    .tip {
      font-size: 12px;
      color: #909399;
    }
  }

  .content-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
