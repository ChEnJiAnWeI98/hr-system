<template>
  <div class="page-container">
    <ModuleTabBar :tabs="badgesTabs" />

    <el-card class="info-card">
      <div class="tab-toolbar">
        <el-alert
          type="warning"
          show-icon
          :closable="false"
          title="说明：按年度累计徽章积分排名，触发年终奖金加成。规则一经生效不可修改，如需调整请新建规则"
        />
        <el-button type="primary" @click="handleAddRule" style="margin-top: 12px">
          <el-icon><Plus /></el-icon>
          新增规则
        </el-button>
      </div>
      <el-table :data="ruleList" border>
        <el-table-column prop="ruleName" label="规则名称" min-width="240" />
        <el-table-column prop="cyclePeriod" label="适用周期" width="140" />
        <el-table-column label="Top 10% 加成" width="130" align="center">
          <template #default="{ row }">+{{ row.top10Bonus }}%</template>
        </el-table-column>
        <el-table-column label="Top 25% 加成" width="130" align="center">
          <template #default="{ row }">+{{ row.top25Bonus }}%</template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" width="130" />
        <el-table-column prop="description" label="描述" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '生效中' : '已归档' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link @click="handleEditRule(row)">查看</el-button>
            <el-button link type="danger" @click="handleDeleteRule(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="ruleDialogVisible" :title="ruleForm.id ? '查看规则' : '新增规则'" width="560px">
      <el-form :model="ruleForm" label-width="120px" :disabled="!!ruleForm.id">
        <el-form-item label="规则名称"><el-input v-model="ruleForm.ruleName" /></el-form-item>
        <el-form-item label="适用周期"><el-input v-model="ruleForm.cyclePeriod" /></el-form-item>
        <el-form-item label="Top 10% 加成 (%)">
          <el-input v-model.number="ruleForm.top10Bonus" />
        </el-form-item>
        <el-form-item label="Top 25% 加成 (%)">
          <el-input v-model.number="ruleForm.top25Bonus" />
        </el-form-item>
        <el-form-item label="生效时间">
          <el-date-picker v-model="ruleForm.effectiveTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ruleDialogVisible = false">关闭</el-button>
        <el-button v-if="!ruleForm.id" type="primary" @click="handleSubmitRule">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBadgeBonusRuleList,
  addBadgeBonusRule,
  deleteBadgeBonusRule
} from '@/api/performanceBadge'
import type { BadgeBonusRule } from '@/types/performanceBadge'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { badgesTabs } from '@/views/performance/_shared/badgesTabs'

defineOptions({ name: 'PerformanceBadgesRule' })

const ruleList = ref<BadgeBonusRule[]>([])
const ruleDialogVisible = ref(false)
const ruleForm = reactive<Partial<BadgeBonusRule>>({
  id: undefined,
  ruleName: '',
  cyclePeriod: '',
  top10Bonus: 15,
  top25Bonus: 8,
  effectiveTime: '',
  description: '',
  status: 1
})

const fetchRules = async () => {
  const res: any = await getBadgeBonusRuleList({ page: 1, pageSize: 100 })
  ruleList.value = res.data.list
}
const handleAddRule = () => {
  Object.assign(ruleForm, {
    id: undefined,
    ruleName: '',
    cyclePeriod: '',
    top10Bonus: 15,
    top25Bonus: 8,
    effectiveTime: '',
    description: '',
    status: 1
  })
  ruleDialogVisible.value = true
}
const handleEditRule = (row: BadgeBonusRule) => {
  Object.assign(ruleForm, JSON.parse(JSON.stringify(row)))
  ruleDialogVisible.value = true
}
const handleSubmitRule = async () => {
  if (!ruleForm.ruleName || !ruleForm.cyclePeriod) {
    ElMessage.warning('请填写完整信息')
    return
  }
  await addBadgeBonusRule(ruleForm as any)
  ElMessage.success('新增成功')
  ruleDialogVisible.value = false
  fetchRules()
}
const handleDeleteRule = (row: BadgeBonusRule) => {
  ElMessageBox.confirm(`确定删除规则"${row.ruleName}"吗？`, '提示', { type: 'warning' }).then(
    async () => {
      await deleteBadgeBonusRule(row.id)
      ElMessage.success('删除成功')
      fetchRules()
    }
  )
}

onMounted(fetchRules)
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
