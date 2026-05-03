<template>
  <div class="page-container">
    <ModuleTabBar :tabs="settingsGroupTabs" />

    <el-card class="data-card">
      <div class="section-header">
        <div>
          <div class="section-title">内推奖励规则</div>
          <div class="section-hint">按岗位族 + 职级差异化，支持现金 / 积分 / 礼品三种形式</div>
        </div>
        <el-button type="primary" @click="openRuleDialog()">
          <el-icon><Plus /></el-icon>
          新增规则
        </el-button>
      </div>

      <div class="table-container">
        <el-table :data="rewardRules" height="100%" style="width: 100%" stripe>
          <el-table-column prop="name" label="规则名称" min-width="180" />
          <el-table-column prop="jobFamily" label="岗位族" min-width="120" />
          <el-table-column prop="level" label="职级范围" min-width="100" />
          <el-table-column label="奖励形式" min-width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ REWARD_TYPE_LABEL[row.rewardType] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="面试奖" min-width="90" align="right">
            <template #default="{ row }">{{ row.interviewAward }}</template>
          </el-table-column>
          <el-table-column label="Offer 奖" min-width="100" align="right">
            <template #default="{ row }">{{ row.offerAward }}</template>
          </el-table-column>
          <el-table-column label="入职奖" min-width="100" align="right">
            <template #default="{ row }">{{ row.onboardAward }}</template>
          </el-table-column>
          <el-table-column label="试用通过奖" min-width="120" align="right">
            <template #default="{ row }">{{ row.passProbationAward }}</template>
          </el-table-column>
          <el-table-column label="状态" min-width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openRuleDialog(row)">编辑</el-button>
              <el-button link :type="row.status === 1 ? 'warning' : 'success'" @click="toggleRuleStatus(row)">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button link type="danger" @click="deleteRule(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 规则编辑弹窗 -->
    <el-dialog v-model="ruleVisible" :title="ruleForm.id ? '编辑奖励规则' : '新增奖励规则'" width="600px">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="ruleRulesValidator" label-width="110px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="岗位族" prop="jobFamily">
          <el-select v-model="ruleForm.jobFamily" style="width: 100%">
            <el-option label="技术研发" value="技术研发" />
            <el-option label="产品设计" value="产品设计" />
            <el-option label="运营市场" value="运营市场" />
            <el-option label="职能支持" value="职能支持" />
            <el-option label="管理岗位" value="管理岗位" />
          </el-select>
        </el-form-item>
        <el-form-item label="职级范围" prop="level">
          <el-input v-model="ruleForm.level" placeholder="如 P5-P7 或 全部" />
        </el-form-item>
        <el-form-item label="奖励形式" prop="rewardType">
          <el-radio-group v-model="ruleForm.rewardType">
            <el-radio :value="1">现金</el-radio>
            <el-radio :value="2">积分</el-radio>
            <el-radio :value="3">礼品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面试奖">
          <el-input v-model.number="ruleForm.interviewAward" placeholder="单位：元/积分" />
        </el-form-item>
        <el-form-item label="Offer 奖">
          <el-input v-model.number="ruleForm.offerAward" placeholder="单位：元/积分" />
        </el-form-item>
        <el-form-item label="入职奖">
          <el-input v-model.number="ruleForm.onboardAward" placeholder="单位：元/积分" />
        </el-form-item>
        <el-form-item label="试用通过奖">
          <el-input v-model.number="ruleForm.passProbationAward" placeholder="单位：元/积分" />
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker
            v-model="ruleForm.effectiveDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ruleVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { rewardRuleApi } from '@/api/referral'
import { REWARD_TYPE_LABEL, type ReferralRewardRule } from '@/types/referral'

defineOptions({ name: 'RecruitmentReferralRules' })

const settingsGroupTabs = [
  { label: '招聘配置中心', path: '/recruit/settings-config' },
  { label: '自动化规则', path: '/recruit/settings-automation' },
  { label: '内推规则', path: '/recruit/settings-referral-rules' },
  { label: '外部集成', path: '/recruit/settings-integrations' }
]

const rewardRules = ref<ReferralRewardRule[]>([])

const loadRules = async () => {
  const res = await rewardRuleApi.getList({ pageSize: 100 })
  rewardRules.value = res.data?.list || []
}

const ruleVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Partial<ReferralRewardRule>>({
  id: undefined,
  name: '',
  jobFamily: '技术研发',
  level: '全部',
  rewardType: 1,
  interviewAward: 0,
  offerAward: 0,
  onboardAward: 0,
  passProbationAward: 0,
  status: 1,
  effectiveDate: '',
  remark: ''
})
const ruleRulesValidator = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  jobFamily: [{ required: true, message: '请选择岗位族', trigger: 'change' }],
  level: [{ required: true, message: '请输入职级范围', trigger: 'blur' }],
  rewardType: [{ required: true, message: '请选择奖励形式', trigger: 'change' }]
}

const resetRuleForm = () => {
  ruleForm.id = undefined
  ruleForm.name = ''
  ruleForm.jobFamily = '技术研发'
  ruleForm.level = '全部'
  ruleForm.rewardType = 1
  ruleForm.interviewAward = 0
  ruleForm.offerAward = 0
  ruleForm.onboardAward = 0
  ruleForm.passProbationAward = 0
  ruleForm.status = 1
  ruleForm.effectiveDate = ''
  ruleForm.remark = ''
}

const openRuleDialog = (row?: ReferralRewardRule) => {
  resetRuleForm()
  if (row) Object.assign(ruleForm, row)
  ruleVisible.value = true
}

const saveRule = async () => {
  await ruleFormRef.value?.validate()
  if (ruleForm.id) {
    await rewardRuleApi.update(ruleForm)
    ElMessage.success('规则已更新')
  } else {
    await rewardRuleApi.add(ruleForm)
    ElMessage.success('规则已新增')
  }
  ruleVisible.value = false
  loadRules()
}

const toggleRuleStatus = async (row: ReferralRewardRule) => {
  await rewardRuleApi.updateStatus(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('状态已更新')
  loadRules()
}

const deleteRule = async (row: ReferralRewardRule) => {
  try {
    await ElMessageBox.confirm(`确定删除规则「${row.name}」吗？`, '确认', { type: 'warning' })
    await rewardRuleApi.delete(row.id)
    ElMessage.success('已删除')
    loadRules()
  } catch {}
}

onMounted(() => {
  loadRules()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-card {
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

  .section-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .section-hint {
      font-size: 12px;
      color: #909399;
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>
