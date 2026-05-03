<template>
  <div class="page-container">
    <ModuleTabBar :tabs="badgesTabs" />

    <el-card class="info-card">
      <div class="tab-toolbar">
        <el-alert
          type="info"
          show-icon
          :closable="false"
          title="说明：月度基础配额 = 常规徽章可颁发数；额外配额 = 仅限高价值徽章（积分 ≥ 30），每月 1 号自动重置"
        />
        <el-button type="primary" @click="handleAddQuota" style="margin-top: 12px">
          <el-icon><Plus /></el-icon>
          新增配额
        </el-button>
      </div>
      <el-table :data="quotaList" border>
        <el-table-column prop="leaderName" label="Leader" width="120" />
        <el-table-column prop="department" label="所属部门" min-width="200" />
        <el-table-column label="基础配额" width="110" align="center">
          <template #default="{ row }">
            <span>{{ row.usedThisMonth }} / {{ row.monthlyQuota }}</span>
            <el-progress
              :percentage="(row.usedThisMonth / row.monthlyQuota) * 100"
              :stroke-width="4"
              :show-text="false"
              style="margin-top: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column label="额外配额" width="110" align="center">
          <template #default="{ row }">
            <span>{{ row.extraUsedThisMonth }} / {{ row.extraQuota }}</span>
            <el-progress
              v-if="row.extraQuota > 0"
              :percentage="(row.extraUsedThisMonth / row.extraQuota) * 100"
              status="warning"
              :stroke-width="4"
              :show-text="false"
              style="margin-top: 4px"
            />
            <span v-else style="font-size: 11px; color: #c0c4cc">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="resetDate" label="下次重置" width="120" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleEditQuota(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDeleteQuota(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="quotaDialogVisible" :title="quotaForm.id ? '编辑配额' : '新增配额'" width="560px">
      <el-form :model="quotaForm" label-width="110px">
        <el-form-item label="Leader 姓名"><el-input v-model="quotaForm.leaderName" /></el-form-item>
        <el-form-item label="所属部门"><el-input v-model="quotaForm.department" /></el-form-item>
        <el-form-item label="基础配额">
          <el-input v-model.number="quotaForm.monthlyQuota" />
        </el-form-item>
        <el-form-item label="额外配额">
          <el-input v-model.number="quotaForm.extraQuota" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quotaDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitQuota">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBadgeQuotaList,
  addBadgeQuota,
  updateBadgeQuota,
  deleteBadgeQuota
} from '@/api/performanceBadge'
import type { BadgeQuota } from '@/types/performanceBadge'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { badgesTabs } from '@/views/performance/_shared/badgesTabs'

defineOptions({ name: 'PerformanceBadgesQuota' })

const quotaList = ref<BadgeQuota[]>([])
const quotaDialogVisible = ref(false)
const quotaForm = reactive<Partial<BadgeQuota>>({
  id: undefined,
  leaderName: '',
  department: '',
  monthlyQuota: 5,
  extraQuota: 0,
  usedThisMonth: 0,
  extraUsedThisMonth: 0,
  resetDate: '2026-05-01',
  status: 1
})

const fetchQuotas = async () => {
  const res: any = await getBadgeQuotaList({ page: 1, pageSize: 100 })
  quotaList.value = res.data.list
}
const handleAddQuota = () => {
  Object.assign(quotaForm, {
    id: undefined,
    leaderName: '',
    department: '',
    monthlyQuota: 5,
    extraQuota: 0,
    usedThisMonth: 0,
    extraUsedThisMonth: 0,
    resetDate: '2026-05-01',
    status: 1
  })
  quotaDialogVisible.value = true
}
const handleEditQuota = (row: BadgeQuota) => {
  Object.assign(quotaForm, JSON.parse(JSON.stringify(row)))
  quotaDialogVisible.value = true
}
const handleSubmitQuota = async () => {
  if (!quotaForm.leaderName) {
    ElMessage.warning('请填写 Leader 姓名')
    return
  }
  if (quotaForm.id) {
    await updateBadgeQuota(quotaForm as any)
    ElMessage.success('更新成功')
  } else {
    await addBadgeQuota(quotaForm as any)
    ElMessage.success('新增成功')
  }
  quotaDialogVisible.value = false
  fetchQuotas()
}
const handleDeleteQuota = (row: BadgeQuota) => {
  ElMessageBox.confirm(`确定删除 ${row.leaderName} 的配额吗？`, '提示', { type: 'warning' }).then(
    async () => {
      await deleteBadgeQuota(row.id)
      ElMessage.success('删除成功')
      fetchQuotas()
    }
  )
}

onMounted(fetchQuotas)
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
}
</style>
