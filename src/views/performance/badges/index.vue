<template>
  <div class="badges-container">
    <el-tabs v-model="activeTab" class="badge-tabs">
      <!-- Tab1 徽章类型管理 -->
      <el-tab-pane label="徽章类型" name="types">
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
      </el-tab-pane>

      <!-- Tab2 颁发配额 -->
      <el-tab-pane label="颁发配额" name="quota">
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
      </el-tab-pane>

      <!-- Tab3 颁发记录 -->
      <el-tab-pane label="颁发记录" name="awards">
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
      </el-tab-pane>

      <!-- Tab4 奖金联动规则 -->
      <el-tab-pane label="奖金联动规则" name="rule">
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
      </el-tab-pane>
    </el-tabs>

    <!-- 类型编辑 -->
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

    <!-- 配额编辑 -->
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

    <!-- 规则编辑 -->
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
  getBadgeTypeList,
  addBadgeType,
  updateBadgeType,
  deleteBadgeType,
  updateBadgeTypeStatus,
  getBadgeQuotaList,
  addBadgeQuota,
  updateBadgeQuota,
  deleteBadgeQuota,
  getBadgeAwardList,
  getBadgeBonusRuleList,
  addBadgeBonusRule,
  deleteBadgeBonusRule
} from '@/api/performanceBadge'
import {
  BADGE_CATEGORY_LABEL,
  BADGE_CATEGORY_TYPE,
  VISIBILITY_LABEL
} from '@/types/performanceBadge'
import type {
  BadgeType,
  BadgeQuota,
  BadgeAward,
  BadgeBonusRule,
  BadgeCategory,
  BadgeVisibility
} from '@/types/performanceBadge'

defineOptions({ name: 'PerformanceBadges' })

const activeTab = ref('types')

// Tab1 类型
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

// Tab2 配额
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

// Tab3 记录
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

// Tab4 规则
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

onMounted(() => {
  fetchTypes()
  fetchQuotas()
  fetchAwards()
  fetchRules()
})
</script>

<style scoped lang="scss">
.badges-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .badge-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__header) {
      margin-bottom: 12px;
      background: #fff;
      padding: 0 16px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: auto;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
    }
  }

  .tab-toolbar {
    margin-bottom: 16px;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }
}
</style>
