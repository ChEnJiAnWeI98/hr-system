<template>
  <div class="page-container">
    <ModuleTabBar :tabs="settingsGroupTabs" />
    <!-- 顶部统计 -->
    <div class="stats-grid">
      <el-card class="stats-card">
        <div class="stats-label">规则总数</div>
        <div class="stats-value">{{ stats.totalRules || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">启用中</div>
        <div class="stats-value stats-success">{{ stats.enabledRules || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">近 30 天触发</div>
        <div class="stats-value">{{ stats.last30DaysTriggers || 0 }}</div>
      </el-card>
      <el-card class="stats-card">
        <div class="stats-label">执行成功率</div>
        <div class="stats-value" :style="{ color: (stats.successRate || 0) >= 90 ? '#67c23a' : '#e6a23c' }">
          {{ stats.successRate || 0 }}%
        </div>
      </el-card>
    </div>

    <el-scrollbar class="content-scrollbar">
      <el-tabs v-model="activeTab" class="auto-tabs">
        <!-- Tab 1: 规则配置 -->
        <el-tab-pane label="规则配置" name="rules">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">自动化规则列表</div>
                <div class="section-hint">按优先级从高到低执行；同一目标命中多条规则时依优先级串行</div>
              </div>
              <el-button type="primary" @click="openRuleDialog()">
                <el-icon><Plus /></el-icon>
                新增规则
              </el-button>
            </div>
            <el-table :data="ruleList" stripe>
              <el-table-column prop="priority" label="优先级" width="90" align="center">
                <template #default="{ row }">
                  <el-tag size="small">P{{ row.priority }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="规则名称" min-width="220">
                <template #default="{ row }">
                  <div class="rule-name-cell">
                    <span class="rule-name">{{ row.name }}</span>
                    <span v-if="row.description" class="rule-desc">{{ row.description }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="触发条件" min-width="220">
                <template #default="{ row }">
                  <div class="trigger-cell">
                    <span class="trigger-icon">{{ TRIGGER_TYPE_MAP[row.triggerType].icon }}</span>
                    <div>
                      <div class="trigger-label">{{ TRIGGER_TYPE_MAP[row.triggerType].label }}</div>
                      <div class="trigger-config">{{ formatTriggerConfig(row) }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="执行动作" min-width="220">
                <template #default="{ row }">
                  <el-tag
                    v-for="(a, idx) in row.actions"
                    :key="idx"
                    size="small"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ ACTION_TYPE_MAP[a.type].icon }} {{ ACTION_TYPE_MAP[a.type].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="触发次数" width="110" align="right">
                <template #default="{ row }">{{ row.triggerCount }}</template>
              </el-table-column>
              <el-table-column prop="lastTriggerTime" label="最近触发" width="180" />
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.enabled === 1 ? 'success' : 'info'" size="small">
                    {{ row.enabled === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="260" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openRuleDialog(row)">编辑</el-button>
                  <el-button link :type="row.enabled === 1 ? 'warning' : 'success'" @click="toggleRule(row)">
                    {{ row.enabled === 1 ? '禁用' : '启用' }}
                  </el-button>
                  <el-button link @click="triggerRule(row)">手动触发</el-button>
                  <el-button link type="danger" @click="deleteRule(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 触发日志 -->
        <el-tab-pane label="触发日志" name="logs">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">规则触发日志</div>
                <div class="section-hint">记录每一次规则命中和动作执行情况，用于审计和问题排查</div>
              </div>
            </div>
            <el-table :data="logList" stripe>
              <el-table-column prop="triggerTime" label="触发时间" width="180" />
              <el-table-column prop="ruleName" label="规则名称" min-width="180" />
              <el-table-column label="触发类型" width="160">
                <template #default="{ row }">
                  <span class="trigger-icon">{{ TRIGGER_TYPE_MAP[row.triggerType].icon }}</span>
                  {{ TRIGGER_TYPE_MAP[row.triggerType].label }}
                </template>
              </el-table-column>
              <el-table-column prop="targetName" label="目标对象" min-width="220" show-overflow-tooltip />
              <el-table-column prop="matchedReason" label="匹配原因" min-width="260" show-overflow-tooltip />
              <el-table-column label="动作执行" min-width="220">
                <template #default="{ row }">
                  <div class="action-result-list">
                    <div v-for="(a, idx) in row.actionResults" :key="idx" class="action-result-item">
                      <span>{{ ACTION_TYPE_MAP[a.type].icon }}</span>
                      <el-tag :type="ACTION_RESULT_MAP[a.result].type" size="small">
                        {{ ACTION_RESULT_MAP[a.result].label }}
                      </el-tag>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="整体结果" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="ACTION_RESULT_MAP[row.overallResult].type" size="small">
                    {{ ACTION_RESULT_MAP[row.overallResult].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="showLogDetail(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 模板库 -->
        <el-tab-pane label="规则模板库" name="templates">
          <el-card class="section-card">
            <div class="section-header">
              <div>
                <div class="section-title">内置规则模板</div>
                <div class="section-hint">一键导入常用自动化规则，导入后可再编辑</div>
              </div>
            </div>
            <div class="template-grid">
              <el-card v-for="t in templateList" :key="t.id" class="template-card">
                <div class="template-header">
                  <el-tag size="small" effect="plain">{{ t.category }}</el-tag>
                  <span class="template-name">{{ t.name }}</span>
                </div>
                <div class="template-desc">{{ t.description }}</div>
                <div class="template-trigger">
                  <span class="trigger-icon">{{ TRIGGER_TYPE_MAP[t.triggerType].icon }}</span>
                  {{ TRIGGER_TYPE_MAP[t.triggerType].label }}
                </div>
                <div class="template-actions">
                  <el-tag
                    v-for="(a, idx) in t.actions"
                    :key="idx"
                    size="small"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 4px"
                  >
                    {{ ACTION_TYPE_MAP[a.type].icon }} {{ ACTION_TYPE_MAP[a.type].label }}
                  </el-tag>
                </div>
                <div class="template-recommend">
                  <el-icon><InfoFilled /></el-icon>
                  <span>适用：{{ t.recommendedFor }}</span>
                </div>
                <el-button type="primary" style="margin-top: 12px; width: 100%" @click="importTemplate(t)">
                  <el-icon><Plus /></el-icon>
                  导入此模板
                </el-button>
              </el-card>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <!-- 规则编辑弹窗 -->
    <el-dialog v-model="ruleDialogVisible" :title="ruleForm.id ? '编辑规则' : '新增规则'" width="720px">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="120px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="触发类型" prop="triggerType">
          <el-select v-model="ruleForm.triggerType" style="width: 100%" @change="onTriggerTypeChange">
            <el-option
              v-for="(v, k) in TRIGGER_TYPE_MAP"
              :key="k"
              :label="`${v.icon} ${v.label}`"
              :value="k"
            >
              <span>{{ v.icon }} {{ v.label }}</span>
              <span style="float: right; color: #909399; font-size: 12px">{{ v.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="needDaysConfig" label="触发天数">
          <el-input v-model.number="ruleForm.triggerConfig!.days">
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="needHoursConfig" label="触发小时数">
          <el-input v-model.number="ruleForm.triggerConfig!.hours">
            <template #append>小时</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="needThresholdConfig" label="匹配度阈值">
          <el-input v-model.number="ruleForm.triggerConfig!.matchThreshold">
            <template #append>分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="执行动作">
          <div class="actions-editor">
            <div v-for="(action, idx) in ruleForm.actions" :key="idx" class="action-row">
              <el-select v-model="action.type" style="width: 220px">
                <el-option
                  v-for="(v, k) in ACTION_TYPE_MAP"
                  :key="k"
                  :label="`${v.icon} ${v.label}`"
                  :value="k"
                />
              </el-select>
              <el-input
                :model-value="JSON.stringify(action.config)"
                placeholder='动作配置 JSON，如 {"targetRole":"R_HR"}'
                style="flex: 1"
                @update:model-value="(v) => updateActionConfig(idx, v)"
              />
              <el-button link type="danger" @click="removeAction(idx)">删除</el-button>
            </div>
            <el-button type="primary" plain size="small" @click="addAction">
              <el-icon><Plus /></el-icon>
              添加动作
            </el-button>
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-input v-model.number="ruleForm.priority" placeholder="数字越大越优先（1-10）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch v-model="ruleForm.enabled" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">确定</el-button>
      </template>
    </el-dialog>

    <!-- 日志详情弹窗 -->
    <el-dialog v-model="logDetailVisible" title="触发日志详情" width="600px">
      <el-descriptions v-if="logDetail" :column="2" border>
        <el-descriptions-item label="触发时间">{{ logDetail.triggerTime }}</el-descriptions-item>
        <el-descriptions-item label="整体结果">
          <el-tag :type="ACTION_RESULT_MAP[logDetail.overallResult].type" size="small">
            {{ ACTION_RESULT_MAP[logDetail.overallResult].label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="规则" :span="2">{{ logDetail.ruleName }}</el-descriptions-item>
        <el-descriptions-item label="触发类型" :span="2">
          {{ TRIGGER_TYPE_MAP[logDetail.triggerType].icon }} {{ TRIGGER_TYPE_MAP[logDetail.triggerType].label }}
        </el-descriptions-item>
        <el-descriptions-item label="目标对象" :span="2">{{ logDetail.targetName }}</el-descriptions-item>
        <el-descriptions-item label="匹配原因" :span="2">{{ logDetail.matchedReason }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="logDetail" style="margin-top: 16px">
        <div class="detail-title">动作执行结果</div>
        <el-table :data="logDetail.actionResults" size="small" stripe>
          <el-table-column label="动作" width="160">
            <template #default="{ row }">
              {{ ACTION_TYPE_MAP[row.type].icon }} {{ ACTION_TYPE_MAP[row.type].label }}
            </template>
          </el-table-column>
          <el-table-column label="结果" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="ACTION_RESULT_MAP[row.result].type" size="small">
                {{ ACTION_RESULT_MAP[row.result].label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="执行信息" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="logDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import {
  automationRuleApi,
  automationLogApi,
  getRuleTemplates,
  getAutomationStats,
  manualTriggerRule
} from '@/api/automation'
import {
  TRIGGER_TYPE_MAP,
  ACTION_TYPE_MAP,
  ACTION_RESULT_MAP,
  type AutomationRule,
  type AutomationLog,
  type RuleTemplate,
  type AutomationStats,
  type TriggerType,
  type ActionType
} from '@/types/automation'

defineOptions({ name: 'RecruitmentAutomation' })

const settingsGroupTabs = [
  { label: '招聘配置中心', path: '/recruit/settings-config' },
  { label: '自动化规则', path: '/recruit/settings-automation' },
  { label: '内推规则', path: '/recruit/settings-referral-rules' },
  { label: '外部集成', path: '/recruit/settings-integrations' }
]

const activeTab = ref<'rules' | 'logs' | 'templates'>('rules')

const stats = ref<Partial<AutomationStats>>({})
const ruleList = ref<AutomationRule[]>([])
const logList = ref<AutomationLog[]>([])
const templateList = ref<RuleTemplate[]>([])

const loadStats = async () => {
  const res = await getAutomationStats()
  stats.value = res.data
}

const loadRules = async () => {
  const res = await automationRuleApi.getList({ pageSize: 100 })
  ruleList.value = (res.data?.list || []).sort(
    (a: AutomationRule, b: AutomationRule) => b.priority - a.priority
  )
}

const loadLogs = async () => {
  const res = await automationLogApi.getList({ pageSize: 100 })
  logList.value = (res.data?.list || []).sort((a: AutomationLog, b: AutomationLog) =>
    b.triggerTime.localeCompare(a.triggerTime)
  )
}

const loadTemplates = async () => {
  const res = await getRuleTemplates()
  templateList.value = res.data
}

/* ========== 规则编辑 ========== */
const ruleDialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Partial<AutomationRule>>({
  id: undefined,
  name: '',
  description: '',
  triggerType: 'resume_stuck',
  triggerConfig: { days: 3 },
  actions: [],
  enabled: 1,
  priority: 5,
  triggerCount: 0
})

const formRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  triggerType: [{ required: true, message: '请选择触发类型', trigger: 'change' }]
}

const needDaysConfig = computed(() =>
  ['resume_stuck', 'offer_no_response', 'onboard_no_confirm', 'demand_overdue'].includes(ruleForm.triggerType || '')
)
const needHoursConfig = computed(() =>
  ['interview_no_feedback'].includes(ruleForm.triggerType || '')
)
const needThresholdConfig = computed(() => ruleForm.triggerType === 'low_match')

const onTriggerTypeChange = () => {
  ruleForm.triggerConfig = {}
  if (needDaysConfig.value) ruleForm.triggerConfig.days = 3
  if (needHoursConfig.value) ruleForm.triggerConfig.hours = 24
  if (needThresholdConfig.value) ruleForm.triggerConfig.matchThreshold = 50
}

const resetRuleForm = () => {
  ruleForm.id = undefined
  ruleForm.name = ''
  ruleForm.description = ''
  ruleForm.triggerType = 'resume_stuck'
  ruleForm.triggerConfig = { days: 3 }
  ruleForm.actions = []
  ruleForm.enabled = 1
  ruleForm.priority = 5
  ruleForm.triggerCount = 0
  ruleForm.createdByName = '张HR'
}

const openRuleDialog = (row?: AutomationRule) => {
  resetRuleForm()
  if (row) {
    Object.assign(ruleForm, row, {
      triggerConfig: { ...row.triggerConfig },
      actions: row.actions.map((a) => ({ ...a, config: { ...a.config } }))
    })
  }
  ruleDialogVisible.value = true
}

const addAction = () => {
  ruleForm.actions!.push({ type: 'send_notification' as ActionType, config: {} })
}

const removeAction = (idx: number) => {
  ruleForm.actions!.splice(idx, 1)
}

const updateActionConfig = (idx: number, v: string) => {
  try {
    ruleForm.actions![idx].config = v ? JSON.parse(v) : {}
  } catch {
    // 不合法 JSON 暂时保留原值不变
  }
}

const saveRule = async () => {
  await ruleFormRef.value?.validate()
  if (!ruleForm.actions || ruleForm.actions.length === 0) {
    ElMessage.warning('请至少添加一个执行动作')
    return
  }
  if (ruleForm.id) {
    await automationRuleApi.update(ruleForm)
    ElMessage.success('规则已更新')
  } else {
    await automationRuleApi.add(ruleForm)
    ElMessage.success('规则已新增')
  }
  ruleDialogVisible.value = false
  loadRules()
  loadStats()
}

const toggleRule = async (row: AutomationRule) => {
  await automationRuleApi.update({ ...row, enabled: row.enabled === 1 ? 0 : 1 })
  ElMessage.success('状态已更新')
  loadRules()
  loadStats()
}

const triggerRule = async (row: AutomationRule) => {
  try {
    await ElMessageBox.confirm(
      `即将手动触发规则「${row.name}」（演示用途，不会真实执行外部动作）`,
      '手动触发',
      { type: 'info' }
    )
    await manualTriggerRule(row.id)
    ElMessage.success('规则已触发，查看触发日志')
    loadRules()
    loadStats()
    if (activeTab.value === 'logs') loadLogs()
  } catch {}
}

const deleteRule = async (row: AutomationRule) => {
  try {
    await ElMessageBox.confirm(`确定删除规则「${row.name}」吗？`, '确认', { type: 'warning' })
    await automationRuleApi.delete(row.id)
    ElMessage.success('已删除')
    loadRules()
    loadStats()
  } catch {}
}

const importTemplate = async (t: RuleTemplate) => {
  try {
    await ElMessageBox.confirm(
      `即将导入模板「${t.name}」到规则列表，导入后可在规则配置 Tab 进一步编辑。`,
      '导入模板',
      { type: 'info' }
    )
    await automationRuleApi.add({
      name: t.name,
      description: t.description,
      triggerType: t.triggerType,
      triggerConfig: { ...t.triggerConfig },
      actions: t.actions.map((a) => ({ ...a, config: { ...a.config } })),
      enabled: 1,
      priority: 5,
      triggerCount: 0,
      createdByName: '张HR'
    } as any)
    ElMessage.success('模板已导入')
    loadRules()
    loadStats()
  } catch {}
}

/* ========== 日志详情 ========== */
const logDetailVisible = ref(false)
const logDetail = ref<AutomationLog | null>(null)
const showLogDetail = (row: AutomationLog) => {
  logDetail.value = row
  logDetailVisible.value = true
}

/* ========== 工具 ========== */
const formatTriggerConfig = (rule: AutomationRule): string => {
  const cfg = rule.triggerConfig
  if (cfg.days) return `超过 ${cfg.days} 天`
  if (cfg.hours) return `超过 ${cfg.hours} 小时`
  if (cfg.matchThreshold) return `分值 < ${cfg.matchThreshold}`
  return JSON.stringify(cfg)
}

onMounted(() => {
  loadStats()
  loadRules()
  loadLogs()
  loadTemplates()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stats-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .stats-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .stats-value {
    font-size: 26px;
    font-weight: 700;
    color: #303133;

    &.stats-success {
      color: #67c23a;
    }
  }
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.auto-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.section-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .section-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}

.rule-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .rule-name {
    font-weight: 500;
  }

  .rule-desc {
    font-size: 12px;
    color: #909399;
  }
}

.trigger-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .trigger-icon {
    font-size: 18px;
  }

  .trigger-label {
    font-weight: 500;
  }

  .trigger-config {
    font-size: 12px;
    color: #909399;
  }
}

.action-result-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .action-result-item {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.template-card {
  border: 1px solid #ebeef5 !important;
  border-radius: 10px;
  box-shadow: none !important;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }

  .template-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .template-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .template-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
    margin-bottom: 12px;
    min-height: 42px;
  }

  .template-trigger {
    padding: 8px 12px;
    background: #fafbfc;
    border-radius: 6px;
    font-size: 13px;
    color: #303133;
    margin-bottom: 10px;

    .trigger-icon {
      margin-right: 6px;
    }
  }

  .template-actions {
    margin-bottom: 10px;
  }

  .template-recommend {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    font-size: 12px;
    color: #909399;
    line-height: 1.6;
    background: #f0f9eb;
    padding: 6px 10px;
    border-radius: 4px;

    .el-icon {
      flex-shrink: 0;
      color: #67c23a;
      margin-top: 2px;
    }
  }
}

.actions-editor {
  width: 100%;

  .action-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
  }
}

.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
</style>
