<template>
  <div class="page-container">
    <ModuleTabBar :tabs="badgesTabs" />

    <el-card class="info-card">
      <div class="tab-toolbar">
        <el-input
          v-model="awardSearch"
          placeholder="搜索颁发人/接收人/徽章名"
          style="width: 260px"
          clearable
          @keyup.enter="fetchAwards"
        />
        <el-button @click="fetchAwards">搜索</el-button>
      </div>
      <el-table :data="awardList" border>
        <el-table-column label="徽章" width="130">
          <template #default="{ row }">
            <span style="font-size: 18px; margin-right: 6px">{{ row.icon }}</span>
            <span>{{ row.badgeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fromName" label="颁发人" width="100" />
        <el-table-column label="" width="60" align="center">
          <template #default>→</template>
        </el-table-column>
        <el-table-column prop="toName" label="接收人" width="100" />
        <el-table-column prop="toDepartment" label="部门" width="160" />
        <el-table-column label="积分" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">+{{ row.pointValue }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="额外配额" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isExtra" type="warning" size="small">是</el-tag>
            <span v-else style="color: #c0c4cc">否</span>
          </template>
        </el-table-column>
        <el-table-column label="可见性" width="110" align="center">
          <template #default="{ row }">
            {{ VISIBILITY_LABEL[row.visibility as BadgeVisibility] }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="颁发理由" min-width="280" show-overflow-tooltip />
        <el-table-column prop="awardTime" label="时间" width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBadgeAwardList } from '@/api/performanceBadge'
import { VISIBILITY_LABEL } from '@/types/performanceBadge'
import type { BadgeAward, BadgeVisibility } from '@/types/performanceBadge'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { badgesTabs } from '@/views/performance/_shared/badgesTabs'

defineOptions({ name: 'PerformanceBadgesAward' })

const awardList = ref<BadgeAward[]>([])
const awardSearch = ref('')

const fetchAwards = async () => {
  const res: any = await getBadgeAwardList({
    page: 1,
    pageSize: 100,
    fromName: awardSearch.value || undefined
  })
  awardList.value = res.data.list
}

onMounted(fetchAwards)
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

.tab-toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
</style>
