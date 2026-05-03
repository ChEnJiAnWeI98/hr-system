<template>
  <div class="page-container">
    <ModuleTabBar :tabs="badgesTabs" />

    <el-card class="info-card">
      <div class="tab-toolbar">
        <el-button type="primary" @click="handleAddType">
          <el-icon><Plus /></el-icon>
          新增徽章类型
        </el-button>
      </div>
      <el-table :data="typeList" border>
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <span style="font-size: 22px">{{ row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="badgeCode" label="编码" width="140" />
        <el-table-column prop="badgeName" label="名称" width="140" />
        <el-table-column label="类别" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="BADGE_CATEGORY_TYPE[row.category as BadgeCategory]" size="small">
              {{ BADGE_CATEGORY_LABEL[row.category as BadgeCategory] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
        <el-table-column label="积分值" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">+{{ row.pointValue }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="月度上限" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.monthlyLimit === 0" style="color: #909399">不限</span>
            <span v-else>{{ row.monthlyLimit }} 次 / 人</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleEditType(row)">编辑</el-button>
            <el-button link @click="handleToggleType(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="danger" @click="handleDeleteType(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="typeDialogVisible" :title="typeForm.id ? '编辑徽章' : '新增徽章'" width="620px">
      <el-form :model="typeForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称"><el-input v-model="typeForm.badgeName" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标（emoji）">
              <el-input v-model="typeForm.icon" placeholder="如 🏆 🚀 💎" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别">
              <el-select v-model="typeForm.category" style="width: 100%">
                <el-option label="价值观" value="value" />
                <el-option label="业绩成就" value="achievement" />
                <el-option label="协作精神" value="collaboration" />
                <el-option label="创新突破" value="innovation" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分值">
              <el-input v-model.number="typeForm.pointValue" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度上限">
              <el-input v-model.number="typeForm.monthlyLimit" placeholder="0 = 不限" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model.number="typeForm.sortOrder" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="typeForm.description" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitType">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBadgeTypeList,
  addBadgeType,
  updateBadgeType,
  deleteBadgeType,
  updateBadgeTypeStatus
} from '@/api/performanceBadge'
import { BADGE_CATEGORY_LABEL, BADGE_CATEGORY_TYPE } from '@/types/performanceBadge'
import type { BadgeType, BadgeCategory } from '@/types/performanceBadge'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { badgesTabs } from '@/views/performance/_shared/badgesTabs'

defineOptions({ name: 'PerformanceBadgesType' })

const typeList = ref<BadgeType[]>([])
const typeDialogVisible = ref(false)
const typeForm = reactive<Partial<BadgeType>>({
  id: undefined,
  badgeCode: '',
  badgeName: '',
  icon: '🏆',
  category: 'value',
  description: '',
  pointValue: 10,
  monthlyLimit: 3,
  status: 1,
  sortOrder: 99
})

const fetchTypes = async () => {
  const res: any = await getBadgeTypeList({ page: 1, pageSize: 100 })
  typeList.value = res.data.list
}
const handleAddType = () => {
  Object.assign(typeForm, {
    id: undefined,
    badgeCode: '',
    badgeName: '',
    icon: '🏆',
    category: 'value',
    description: '',
    pointValue: 10,
    monthlyLimit: 3,
    status: 1,
    sortOrder: 99
  })
  typeDialogVisible.value = true
}
const handleEditType = (row: BadgeType) => {
  Object.assign(typeForm, JSON.parse(JSON.stringify(row)))
  typeDialogVisible.value = true
}
const handleSubmitType = async () => {
  if (!typeForm.badgeName) {
    ElMessage.warning('请输入徽章名称')
    return
  }
  if (!typeForm.badgeCode) {
    typeForm.badgeCode = `BDG-${String(typeForm.category || 'CUS').toUpperCase().slice(0, 3)}-${String(Date.now()).slice(-3)}`
  }
  if (typeForm.id) {
    await updateBadgeType(typeForm as any)
    ElMessage.success('更新成功')
  } else {
    await addBadgeType(typeForm as any)
    ElMessage.success('新增成功')
  }
  typeDialogVisible.value = false
  fetchTypes()
}
const handleToggleType = async (row: BadgeType) => {
  await updateBadgeTypeStatus(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  fetchTypes()
}
const handleDeleteType = (row: BadgeType) => {
  ElMessageBox.confirm(`确定删除徽章"${row.badgeName}"吗？`, '提示', { type: 'warning' }).then(
    async () => {
      await deleteBadgeType(row.id)
      ElMessage.success('删除成功')
      fetchTypes()
    }
  )
}

onMounted(fetchTypes)
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
