<template>
  <div class="page-container">
    <ModuleTabBar :tabs="applyRulesTabs" />

    <!-- KPI 卡片 -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">规则总数</div>
        <div class="kpi-value">{{ stats.totalRules || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">启用中</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.activeRules || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">执行记录</div>
        <div class="kpi-value">{{ stats.totalRecords || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待确认</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.pendingCount || 0 }}</div>
      </el-card>
    </div>

    <el-card class="data-card">
      <div class="table-header">
        <el-button type="primary" @click="openRuleDialog()">
          <el-icon><Plus /></el-icon>
          新建规则
        </el-button>
        <el-button @click="helpDialogVisible = true">
          <el-icon><InfoFilled /></el-icon>
          联动说明
        </el-button>
      </div>
      <el-table :data="rules" stripe>
        <el-table-column prop="ruleNo" label="编号" width="160" />
        <el-table-column prop="name" label="规则名称" min-width="200" />
        <el-table-column label="类别" width="130" align="center">
          <template #default="{ row }">
            <el-tag :style="{ background: RULE_CATEGORY_MAP[row.category].color, color: '#fff', border: 'none' }" size="small">
              {{ RULE_CATEGORY_MAP[row.category].icon }} {{ RULE_CATEGORY_MAP[row.category].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="触发条件" min-width="260">
          <template #default="{ row }">
            <span class="condition-text">{{ formatCondition(row.condition) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行动作" min-width="300">
          <template #default="{ row }">
            <span class="action-text">{{ formatAction(row.category, row.action) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="90" align="center">
          <template #default="{ row }">P{{ row.priority }}</template>
        </el-table-column>
        <el-table-column label="双确认" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.needDualConfirm === 1" type="warning" size="small">HRBP+HRD</el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="RULE_STATUS_MAP[row.status].type" size="small">
              {{ RULE_STATUS_MAP[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openRuleDialog(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggle(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 规则编辑弹窗 -->
    <el-dialog v-model="ruleDialogVisible" :title="ruleForm.id ? '编辑规则' : '新建规则'" width="640px">
      <el-form :model="ruleForm" label-width="120px">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="ruleForm.category" style="width: 100%">
            <el-option v-for="(c, k) in RULE_CATEGORY_MAP" :key="k" :label="`${c.icon} ${c.label}`" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件">
          <el-select v-model="ruleForm.condition.type" style="width: 100%">
            <el-option v-for="(l, k) in CONDITION_TYPE_MAP" :key="k" :label="l" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发等级">
          <el-checkbox-group v-model="ruleForm.condition.grades">
            <el-checkbox v-for="g in ['S', 'A', 'B', 'C', 'D']" :key="g" :value="g">{{ g }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.condition.type === 'consecutive_grade'" label="连续周期数">
          <el-input-number v-model="ruleForm.condition.consecutiveCycles" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="动作描述">
          <el-input v-model="ruleForm.action.description" type="textarea" :rows="3" placeholder="如 奖金系数 1.2 / 调薪 5-10% / 指派培训等" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="ruleForm.priority" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="双确认">
          <el-switch v-model="ruleForm.needDualConfirm" :active-value="1" :inactive-value="0" active-text="需要 HRBP+HRD" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 联动说明 Dialog（原"联动说明" Tab 内容）-->
    <el-dialog v-model="helpDialogVisible" title="📖 绩效结果应用联动说明" width="880px">
      <div class="help-intro">
        <div class="help-desc">
          绩效结果不是目的，而是驱动薪酬、培训、晋升等人才决策的输入。本页配置"条件 → 动作"规则，让绩效自动触发后续环节。
        </div>
      </div>

      <div class="help-grid">
        <div v-for="(c, k) in RULE_CATEGORY_MAP" :key="k" class="help-card" :style="{ borderLeft: `4px solid ${c.color}` }">
          <div class="help-cat-title">
            <span class="help-icon" :style="{ background: c.color }">{{ c.icon }}</span>
            <span>{{ c.label }}</span>
          </div>
          <div class="help-cat-desc">{{ helpDescriptions[k] }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getApplyRuleList,
  addApplyRule,
  updateApplyRule,
  deleteApplyRule,
  toggleRuleStatus,
  getApplyStats
} from '@/api/performanceApplyRule'
import type { PerformanceApplyRule } from '@/types/performanceApplyRule'
import {
  RULE_CATEGORY_MAP,
  RULE_STATUS_MAP,
  CONDITION_TYPE_MAP
} from '@/types/performanceApplyRule'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'
import { applyRulesTabs } from '@/views/performance/_shared/applyRulesTabs'

defineOptions({ name: 'PerformanceApplyRulesConfig' })

const rules = ref<PerformanceApplyRule[]>([])
const stats = ref<any>({})

const loadData = async () => {
  const rl = await getApplyRuleList({ pageSize: 100 })
  rules.value = (rl.data?.list || []).sort((a: any, b: any) => b.priority - a.priority)
  const s = await getApplyStats()
  stats.value = s.data
}

/* 工具 */
const formatCondition = (c: any) => {
  if (!c) return '—'
  const type = CONDITION_TYPE_MAP[c.type] || c.type
  if (c.type === 'consecutive_grade') {
    return `${type}：连续 ${c.consecutiveCycles || 2} 个周期 ${(c.grades || []).join('/')}`
  }
  if (c.type === 'grade') {
    return `${type}：${(c.grades || []).join(' / ')}`
  }
  if (c.type === 'score_range') {
    return `${type}：${c.scoreMin || 0}~${c.scoreMax || 100}`
  }
  if (c.type === 'goal_rate') {
    return `${type}：≥ ${c.goalRateMin || 0}%`
  }
  return type
}

const formatAction = (category: string, a: any) => {
  if (!a) return '—'
  if (a.description) return a.description
  if (category === 'bonus') return `奖金系数 ${a.bonusCoefficient || 1}`
  if (category === 'raise') return `调薪 ${a.raiseMin || 0}~${a.raiseMax || 0}%`
  if (category === 'training') return `指派培训：${(a.trainingCourses || []).join('、')}`
  if (category === 'promotion') return `加入池：${a.promotionPool}`
  if (category === 'talent_tag') return `标签：${a.talentTag}`
  return ''
}

/* 规则编辑 */
const ruleDialogVisible = ref(false)
const ruleForm = reactive({
  id: undefined as number | undefined,
  name: '',
  category: 'bonus' as string,
  condition: { type: 'grade' as string, grades: [] as string[], consecutiveCycles: undefined as number | undefined },
  action: { description: '' },
  priority: 5,
  status: 'draft' as string,
  needDualConfirm: 0 as 0 | 1,
  remark: ''
})

const openRuleDialog = (row?: PerformanceApplyRule) => {
  if (row) {
    Object.assign(ruleForm, JSON.parse(JSON.stringify(row)))
  } else {
    Object.assign(ruleForm, {
      id: undefined, name: '', category: 'bonus',
      condition: { type: 'grade', grades: [] },
      action: { description: '' },
      priority: 5, status: 'draft', needDualConfirm: 0, remark: ''
    })
  }
  ruleDialogVisible.value = true
}

const submitRule = async () => {
  if (!ruleForm.name) {
    ElMessage.warning('请填写规则名称')
    return
  }
  if (ruleForm.id) {
    await updateApplyRule(ruleForm as any)
    ElMessage.success('已更新')
  } else {
    const now = new Date()
    const form = ruleForm as any
    form.ruleNo = `APR${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`
    form.createdBy = '张HR'
    await addApplyRule(form)
    ElMessage.success('已创建')
  }
  ruleDialogVisible.value = false
  loadData()
}

/* 启停 / 删除 */
const handleToggle = async (row: PerformanceApplyRule) => {
  await toggleRuleStatus(row.id, row.status === 'active' ? 'disabled' : 'active')
  ElMessage.success('状态已更新')
  loadData()
}

const handleDelete = async (row: PerformanceApplyRule) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.name}」？`, '确认', { type: 'warning' })
    await deleteApplyRule(row.id)
    ElMessage.success('已删除')
    loadData()
  } catch {}
}

/* 联动说明 */
const helpDialogVisible = ref(false)
const helpDescriptions: Record<string, string> = {
  bonus: '按等级配置奖金系数：S=1.5 / A=1.2 / B=1.0 / C=0.6 / D=0.0。规则触发后自动推送至薪酬模块',
  raise: '年度 S/A 员工自动触发调薪建议。幅度区间由规则定义，最终由 HR 决策',
  training: '面谈识别的能力短板 → 自动推送培训需求池；C/D 员工自动指派必修课',
  promotion: '连续 2+ 周期 S/A 且无 PIP 的员工自动进入晋升候选池，作为内推和人才盘点的基础',
  talent_tag: '员工档案自动打标签（如"核心骨干"/"高潜"/"待关注"等），作为后续人才运营的输入'
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.condition-text,
.action-text {
  font-size: 13px;
  color: #606266;
}

.muted {
  color: #909399;
  font-size: 12px;
}

.help-intro {
  margin-bottom: 20px;

  .help-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.7;
  }
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.help-card {
  padding: 16px 18px;
  background: #fafbfc;
  border-radius: 8px;

  .help-cat-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;

    .help-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }

  .help-cat-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.7;
  }
}
</style>
