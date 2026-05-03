<template>
  <div class="page-container">
    <ModuleTabBar :tabs="taxTabs" />

    <el-card class="info-card">
      <div class="section-head">
        <div class="section-title">居民综合所得个人所得税税率表（年度 2026）</div>
        <el-tag type="info" effect="plain">起征点 ¥{{ TAX_THRESHOLD }} / 月</el-tag>
      </div>
      <el-table :data="TAX_BRACKETS" border style="width: 100%">
        <el-table-column label="级数" width="80" align="center" type="index" />
        <el-table-column label="年度应纳税所得额" min-width="240">
          <template #default="{ row }">
            <span v-if="row.max === Infinity">超过 ¥{{ formatAmount(row.min) }}</span>
            <span v-else>¥{{ formatAmount(row.min) }} ~ ¥{{ formatAmount(row.max) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="税率" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="bracketColor(row.rate)" size="small">
              {{ (row.rate * 100).toFixed(0) }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="速算扣除数" width="160" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.quickDeduction) }}</template>
        </el-table-column>
      </el-table>
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="margin-top: 16px"
        title="个税计算公式"
      >
        <template #default>
          <div style="line-height: 1.8">
            <code>应纳税所得额 = 月工资 − 起征点 5000 − 社保公积金 − 专项附加扣除</code><br />
            <code>应纳税额（年度）= 应纳税所得额 × 12 × 税率 − 速算扣除数</code><br />
            <code>月个税 = 年度应纳税额 / 12</code>
          </div>
        </template>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { TAX_BRACKETS, TAX_THRESHOLD } from '@/types/comp/tax'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { taxTabs } from '@/views/comp/_shared/taxTabs'

defineOptions({ name: 'CompTaxBracket' })

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const bracketColor = (rate: number): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  if (rate <= 0.1) return 'success'
  if (rate <= 0.2) return 'primary'
  if (rate <= 0.3) return 'warning'
  return 'danger'
}
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
