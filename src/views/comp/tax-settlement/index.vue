<template>
  <div class="page-container">
    <ModuleTabBar :tabs="taxTabs" />

    <el-card class="info-card">
      <div class="section-head">
        <div class="section-title">2025 年度个税汇算清缴</div>
        <el-tag type="warning" effect="plain">
          待汇算 {{ pendingSettlement.length }} 人 / 已汇算 {{ settledCount }} 人
        </el-tag>
      </div>
      <el-table :data="settlements" border style="width: 100%">
        <el-table-column prop="employeeName" label="员工" width="120" fixed />
        <el-table-column label="年度收入总额" min-width="160" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.totalIncome) }}</template>
        </el-table-column>
        <el-table-column label="专项附加扣除" min-width="160" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.totalSpecialDeduction) }}</template>
        </el-table-column>
        <el-table-column label="已缴税款" width="140" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.totalPaid) }}</template>
        </el-table-column>
        <el-table-column label="应补/退税" width="140" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.settlement > 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
              {{ row.settlement > 0 ? '补税' : '退税' }} ¥{{ formatAmount(Math.abs(row.settlement)) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'settled' ? 'success' : 'warning'" size="small">
              {{ row.status === 'settled' ? '已汇算' : '待汇算' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        type="info"
        :closable="false"
        show-icon
        style="margin-top: 16px"
        title="💡 年度汇算清缴说明"
        description="根据税法规定，员工在次年 3~6 月进行上一年度的个税汇算清缴。系统自动计算应补/退税，员工可在个税 APP 或由 HR 代办申报。"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createCrudApi } from '@/utils/crud/apiHelper'
import { yearSettlementMock } from '@/mock/comp/tax'
import type { YearTaxSettlement } from '@/types/comp/tax'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { taxTabs } from '@/views/comp/_shared/taxTabs'

defineOptions({ name: 'CompTaxSettlement' })

const settlementCrud = createCrudApi<YearTaxSettlement>({
  baseUrl: '/admin/comp/tax-settlement',
  mockFns: yearSettlementMock
})

const settlements = ref<YearTaxSettlement[]>([])
const pendingSettlement = computed(() => settlements.value.filter((s) => s.status === 'pending'))
const settledCount = computed(() => settlements.value.filter((s) => s.status === 'settled').length)

const formatAmount = (n: number) => n.toLocaleString('zh-CN')

const fetchSettlements = async () => {
  const res: any = await settlementCrud.getList({ page: 1, pageSize: 200 })
  settlements.value = res.data.list
}

onMounted(fetchSettlements)
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
