<template>
  <div class="perf-goal-container">
    <ModuleTabBar :tabs="goalGroupTabs" />
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">总目标数</div>
        <div class="kpi-value">{{ total }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">OKR</div>
        <div class="kpi-value" style="color: #67c23a">{{ okrCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">KPI</div>
        <div class="kpi-value" style="color: #e6a23c">{{ kpiCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待审批</div>
        <div class="kpi-value" style="color: #f56c6c">{{ pendingApprovalCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">平均进度</div>
        <div class="kpi-value">{{ avgProgress }}%</div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" class="goal-tabs">
      <el-tab-pane label="目标列表" name="list">
        <el-card class="filter-card">
          <el-form :model="queryParams">
            <div class="filter-form-content">
              <el-form-item label="员工">
                <el-input v-model="queryParams.employeeName" placeholder="姓名" style="width: 160px" clearable />
              </el-form-item>
              <el-form-item label="部门">
                <el-input v-model="queryParams.departmentName" placeholder="部门" style="width: 140px" clearable />
              </el-form-item>
              <el-form-item label="目标模式">
                <el-select v-model="queryParams.goalType" placeholder="全部" style="width: 130px" clearable>
                  <el-option label="OKR" :value="1" />
                  <el-option label="KPI" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="层级">
                <el-select v-model="queryParams.goalCategory" placeholder="全部" style="width: 140px" clearable>
                  <el-option label="公司目标" value="company" />
                  <el-option label="部门目标" value="department" />
                  <el-option label="个人目标" value="personal" />
                </el-select>
              </el-form-item>
              <el-form-item label="审批状态">
                <el-select v-model="queryParams.approvalStatus" placeholder="全部" style="width: 130px" clearable>
                  <el-option v-for="(s, k) in GOAL_APPROVAL_STATUS_MAP" :key="k" :label="s.label" :value="Number(k)" />
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <div class="filter-buttons">
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-card>

        <el-card class="data-card">
          <div class="table-header">
            <div class="header-buttons">
              <el-button type="primary" @click="handleAdd">
                <el-icon><Plus /></el-icon>
                新增目标
              </el-button>
              <el-button @click="templateDialogVisible = true">
                <el-icon><Document /></el-icon>
                从模板创建
              </el-button>
            </div>
          </div>

          <div class="table-container">
            <el-table :data="tableData" height="100%" style="width: 100%">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <div class="expand-box">
                    <div v-if="row.goalType === 1 && row.keyResults && row.keyResults.length" class="kr-list">
                      <div class="expand-title">关键成果（KR）</div>
                      <el-table :data="row.keyResults" size="small" stripe>
                        <el-table-column prop="description" label="KR 描述" min-width="260" />
                        <el-table-column prop="targetValue" label="目标值" width="140" />
                        <el-table-column prop="currentValue" label="当前值" width="140" />
                        <el-table-column prop="weight" label="权重" width="80" align="center">
                          <template #default="{ row: kr }">{{ kr.weight }}%</template>
                        </el-table-column>
                        <el-table-column label="进度" width="180">
                          <template #default="{ row: kr }">
                            <el-progress :percentage="kr.progress" :stroke-width="8" />
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div v-if="row.approveComment" class="expand-approval">
                      <div class="expand-title">审批意见</div>
                      <el-alert :title="row.approveComment" :closable="false" type="info" show-icon />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="goalNo" label="编号" width="150" />
              <el-table-column prop="employeeName" label="员工" width="90" />
              <el-table-column prop="departmentName" label="部门" width="110" />
              <el-table-column label="模式" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="GOAL_MODE_MAP[row.goalType].type" size="small">
                    {{ GOAL_MODE_MAP[row.goalType].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="层级" width="110" align="center">
                <template #default="{ row }">
                  <span v-if="row.goalCategory">
                    {{ GOAL_CATEGORY_MAP[row.goalCategory].icon }}
                    {{ GOAL_CATEGORY_MAP[row.goalCategory].label }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="goalTitle" label="目标标题" min-width="180" show-overflow-tooltip />
              <el-table-column label="父目标" min-width="140">
                <template #default="{ row }">
                  <el-tag v-if="row.parentGoalTitle" size="small" effect="plain">
                    <el-icon><TopRight /></el-icon> {{ row.parentGoalTitle }}
                  </el-tag>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column label="权重" width="80" align="right">
                <template #default="{ row }">{{ row.weight }}%</template>
              </el-table-column>
              <el-table-column label="进度" width="180">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.progress"
                    :stroke-width="10"
                    :color="row.frozen === 1 ? '#909399' : undefined"
                  />
                </template>
              </el-table-column>
              <el-table-column label="审批" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="GOAL_APPROVAL_STATUS_MAP[row.approvalStatus].type" size="small">
                    {{ GOAL_APPROVAL_STATUS_MAP[row.approvalStatus].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="冻结" width="80" align="center">
                <template #default="{ row }">
                  <el-icon v-if="row.frozen === 1" color="#909399"><Lock /></el-icon>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleViewLogs(row)">进度日志</el-button>
                  <el-button
                    link
                    type="success"
                    :disabled="row.frozen === 1 || row.approvalStatus !== 1"
                    @click="handleUpdateProgress(row)"
                  >更新进度</el-button>
                  <el-button
                    v-if="row.approvalStatus === 0"
                    link
                    type="warning"
                    @click="handleApprove(row)"
                  >审批</el-button>
                  <el-button
                    v-if="row.approvalStatus === 2"
                    link
                    @click="handleResubmit(row)"
                  >重新提交</el-button>
                  <el-button link @click="handleEdit(row)" :disabled="row.frozen === 1">编辑</el-button>
                  <el-button link type="danger" @click="handleDelete(row)" :disabled="row.frozen === 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchData"
            @current-change="fetchData"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="进度日志" name="logs">
        <el-card class="data-card">
          <el-table :data="logList" stripe>
            <el-table-column prop="updateTime" label="更新时间" width="170" />
            <el-table-column label="目标" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">{{ goalTitleById(row.goalId) }}</template>
            </el-table-column>
            <el-table-column label="进度变化" width="220">
              <template #default="{ row }">
                <span>{{ row.beforeProgress }}%</span>
                <el-icon style="margin: 0 6px" color="#909399"><Right /></el-icon>
                <span style="color: #67c23a; font-weight: 600">{{ row.afterProgress }}%</span>
                <span class="diff-text">(+{{ row.afterProgress - row.beforeProgress }}%)</span>
              </template>
            </el-table-column>
            <el-table-column prop="highlights" label="本阶段亮点" min-width="220" show-overflow-tooltip />
            <el-table-column prop="issues" label="遇到的问题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="nextPlan" label="下阶段计划" min-width="200" show-overflow-tooltip />
            <el-table-column prop="updatedBy" label="更新人" width="100" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑目标' : '新增目标'" width="760px">
      <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工" prop="employeeName">
              <el-input v-model="editForm.employeeName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentName">
              <el-input v-model="editForm.departmentName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位族">
              <el-select v-model="editForm.jobFamily" @change="autoMatchMode" style="width: 100%">
                <el-option label="技术研发" value="技术研发" />
                <el-option label="产品设计" value="产品设计" />
                <el-option label="运营市场" value="运营市场" />
                <el-option label="职能支持" value="职能支持" />
                <el-option label="管理岗位" value="管理岗位" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标模式" prop="goalType">
              <el-select v-model="editForm.goalType" style="width: 100%" @change="onGoalModeChange">
                <el-option label="OKR" :value="1" />
                <el-option label="KPI" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标层级" prop="goalCategory">
              <el-select v-model="editForm.goalCategory" style="width: 100%">
                <el-option label="公司目标" value="company" />
                <el-option label="部门目标" value="department" />
                <el-option label="个人目标" value="personal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重">
              <el-input v-model.number="editForm.weight"><template #append>%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="父目标" v-if="editForm.goalType === 1">
          <el-select v-model="editForm.parentGoalId" clearable placeholder="可选，对齐到上级目标" style="width: 100%">
            <el-option
              v-for="p in parentGoalOptions"
              :key="p.id"
              :label="`[${p.employeeName}] ${p.goalTitle}`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标标题" prop="goalTitle">
          <el-input v-model="editForm.goalTitle" />
        </el-form-item>
        <el-form-item label="目标描述">
          <el-input v-model="editForm.goalDescription" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider v-if="editForm.goalType === 1" content-position="left">
          关键成果（KR，建议 3~5 个，权重和 = 100）
        </el-divider>
        <div v-if="editForm.goalType === 1">
          <div v-for="(kr, idx) in editForm.keyResults" :key="idx" class="kr-row">
            <el-input v-model="kr.description" placeholder="KR 描述" style="flex: 2" />
            <el-input v-model="kr.targetValue" placeholder="目标值" style="width: 130px; margin-left: 6px" />
            <el-input v-model="kr.currentValue" placeholder="当前值" style="width: 130px; margin-left: 6px" />
            <el-input v-model.number="kr.weight" placeholder="权重" style="width: 100px; margin-left: 6px">
              <template #append>%</template>
            </el-input>
            <el-input v-model.number="kr.progress" placeholder="进度" style="width: 100px; margin-left: 6px">
              <template #append>%</template>
            </el-input>
            <el-button link type="danger" @click="removeKR(idx)">删除</el-button>
          </div>
          <el-button type="primary" plain size="small" @click="addKR">+ 添加 KR</el-button>
          <el-button
            type="primary"
            plain
            size="small"
            :disabled="!editForm.goalTitle || !editForm.keyResults || editForm.keyResults.length === 0"
            @click="aiOKRCheckVisible = true"
          >
            ✨ AI 质量检查
          </el-button>
          <div class="kr-weight-hint" :class="krWeightOk ? 'ok' : 'err'">
            当前 KR 权重和：{{ krWeightSum }}
          </div>
        </div>

        <div v-else>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="目标值">
                <el-input v-model="editForm.targetValue" placeholder="如 销售额 800 万" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前值">
                <el-input v-model="editForm.currentValue" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前进度">
                <el-input v-model.number="editForm.progress"><template #append>%</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存（提交审批）</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog v-model="approveDialogVisible" title="审批目标" width="520px">
      <el-descriptions v-if="approveTargetGoal" :column="1" border>
        <el-descriptions-item label="员工">{{ approveTargetGoal.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="目标">{{ approveTargetGoal.goalTitle }}</el-descriptions-item>
        <el-descriptions-item label="权重">{{ approveTargetGoal.weight }}%</el-descriptions-item>
      </el-descriptions>
      <el-form label-width="90px" style="margin-top: 16px">
        <el-form-item label="审批意见">
          <el-input v-model="approveComment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitApprove(false)">驳回</el-button>
        <el-button type="primary" @click="submitApprove(true)">批准</el-button>
      </template>
    </el-dialog>

    <!-- 更新进度弹窗 -->
    <el-dialog v-model="progressDialogVisible" title="更新目标进度" width="560px">
      <el-form label-width="100px">
        <el-form-item label="当前进度">
          <el-slider v-model="progressForm.afterProgress" :min="0" :max="100" show-input :show-input-controls="false" />
        </el-form-item>
        <el-form-item v-if="progressTarget && progressTarget.goalType === 2" label="当前值">
          <el-input v-model="progressForm.afterValue" placeholder="如 销售额 320 万" />
        </el-form-item>
        <el-form-item label="本阶段亮点">
          <el-input v-model="progressForm.highlights" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="遇到的问题">
          <el-input v-model="progressForm.issues" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="下阶段计划">
          <el-input v-model="progressForm.nextPlan" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProgress">提交更新</el-button>
      </template>
    </el-dialog>

    <!-- 进度日志弹窗 -->
    <el-dialog v-model="logsDialogVisible" title="目标进度日志" width="700px">
      <el-table :data="currentGoalLogs" size="small">
        <el-table-column prop="updateTime" label="时间" width="160" />
        <el-table-column label="进度" width="140" align="center">
          <template #default="{ row }">
            {{ row.beforeProgress }}% → <strong style="color: #67c23a">{{ row.afterProgress }}%</strong>
          </template>
        </el-table-column>
        <el-table-column prop="highlights" label="亮点" min-width="160" show-overflow-tooltip />
        <el-table-column prop="issues" label="问题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="updatedBy" label="更新人" width="100" />
      </el-table>
    </el-dialog>

    <!-- 从模板创建 -->
    <el-dialog v-model="templateDialogVisible" title="从目标模板创建" width="720px">
      <el-table :data="templateList" highlight-current-row @current-change="(r: any) => (selectedTemplateId = r?.id)">
        <el-table-column prop="templateName" label="模板名称" min-width="200" />
        <el-table-column prop="jobFamily" label="岗位族" width="120" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="GOAL_MODE_MAP[row.goalType].type" size="small">{{ GOAL_MODE_MAP[row.goalType].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goalTitle" label="目标示例" min-width="200" />
        <el-table-column prop="suggestedWeight" label="建议权重" width="100" align="right">
          <template #default="{ row }">{{ row.suggestedWeight || '—' }}%</template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedTemplateId" @click="handleApplyTemplate">基于此模板新建</el-button>
      </template>
    </el-dialog>

    <!-- AI OKR 质量检查（诊断模式：打开即调用，展示报告）-->
    <AIAssistDialog
      v-model="aiOKRCheckVisible"
      ability-code="okr_check"
      mode="diagnose"
      :initial-input="buildOKRCheckInput()"
      :target-employee="editForm.employeeName || ''"
      dialog-width="720px"
      dialog-title="OKR 质量检查 · AI 诊断"
      input-label="本次检查的 OKR"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Document, TopRight, Lock, Right } from '@element-plus/icons-vue'
import AIAssistDialog from '@/components/business/AIAssistDialog.vue'
import ModuleTabBar from '@/views/performance/_shared/ModuleTabBar.vue'

const goalGroupTabs = [
  { label: '目标管理', path: '/perf/goal' },
  { label: '目标对齐视图', path: '/perf/goal-alignment/x' }
]
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  getList,
  addItem,
  updateItem,
  deleteItem,
  approveGoal,
  resubmitGoal,
  updateGoalProgress,
  getGoalTemplates,
  getGoalProgressLogs,
  createGoalFromTemplate
} from '@/api/performanceGoal'
import type {
  PerformanceGoal,
  GoalProgressLog,
  GoalTemplate
} from '@/types/performanceGoal'
import {
  GOAL_MODE_MAP,
  GOAL_CATEGORY_MAP,
  GOAL_APPROVAL_STATUS_MAP,
  matchGoalMode
} from '@/types/performanceGoal'

defineOptions({ name: 'PerformanceGoal' })

const activeTab = ref<'list' | 'logs'>('list')

const queryParams = reactive({
  employeeName: '',
  departmentName: '',
  goalType: null as 1 | 2 | null,
  goalCategory: '' as 'company' | 'department' | 'personal' | '',
  approvalStatus: null as number | null,
  page: 1,
  pageSize: 10
})
const tableData = ref<PerformanceGoal[]>([])
const total = ref(0)

const okrCount = computed(() => tableData.value.filter((g) => g.goalType === 1).length)
const kpiCount = computed(() => tableData.value.filter((g) => g.goalType === 2).length)
const pendingApprovalCount = computed(() =>
  tableData.value.filter((g) => g.approvalStatus === 0 || g.approvalStatus === 3).length
)
const avgProgress = computed(() =>
  tableData.value.length
    ? Math.round(tableData.value.reduce((s, g) => s + g.progress, 0) / tableData.value.length)
    : 0
)

const fetchData = async () => {
  const res = await getList(queryParams)
  tableData.value = res.data?.list || []
  total.value = res.data?.total || 0
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.goalType = null
  queryParams.goalCategory = ''
  queryParams.approvalStatus = null
  queryParams.page = 1
  fetchData()
}

const handleDelete = async (row: PerformanceGoal) => {
  await ElMessageBox.confirm(`确定删除「${row.goalTitle}」？`, '确认', { type: 'warning' })
  await deleteItem(row.id)
  ElMessage.success('已删除')
  fetchData()
}

/* ========== 新增 / 编辑 ========== */
const editDialogVisible = ref(false)
// AI OKR 质量检查
const aiOKRCheckVisible = ref(false)
const buildOKRCheckInput = () => {
  if (!editForm.goalTitle) return ''
  const krLines = (editForm.keyResults || [])
    .map((kr: any, i: number) => `KR${i + 1}：${kr.description || '-'}（目标：${kr.targetValue || '-'}，权重：${kr.weight || 0}%）`)
    .join('\n')
  return `O：${editForm.goalTitle}\n${krLines}`
}
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<PerformanceGoal>>({})
const formRules = {
  employeeName: [{ required: true, message: '请输入员工', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  goalType: [{ required: true, message: '请选择目标模式', trigger: 'change' }],
  goalCategory: [{ required: true, message: '请选择层级', trigger: 'change' }],
  goalTitle: [{ required: true, message: '请输入目标标题', trigger: 'blur' }]
}

const krWeightSum = computed(() =>
  (editForm.keyResults || []).reduce((s, k) => s + (Number(k.weight) || 0), 0)
)
const krWeightOk = computed(() => krWeightSum.value === 100)

const parentGoalOptions = computed(() =>
  tableData.value.filter(
    (g) =>
      g.approvalStatus === 1 &&
      g.goalType === 1 &&
      (g.goalCategory === 'company' || g.goalCategory === 'department') &&
      g.id !== editForm.id
  )
)

const resetEditForm = () => {
  Object.assign(editForm, {
    id: undefined,
    employeeId: 0,
    employeeName: '',
    departmentId: undefined,
    departmentName: '',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    parentGoalId: undefined,
    parentGoalTitle: undefined,
    goalTitle: '',
    goalDescription: '',
    weight: 40,
    targetValue: '',
    currentValue: '',
    keyResults: [
      { description: '', targetValue: '', currentValue: '', weight: 50, progress: 0 },
      { description: '', targetValue: '', currentValue: '', weight: 50, progress: 0 }
    ],
    progress: 0,
    status: 0,
    approvalStatus: 0,
    frozen: 0
  })
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}

const handleEdit = (row: PerformanceGoal) => {
  resetEditForm()
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}

const autoMatchMode = () => {
  editForm.goalType = matchGoalMode(editForm.jobFamily)
  editForm.goalTypeName = editForm.goalType === 1 ? 'OKR' : 'KPI'
}

const onGoalModeChange = () => {
  editForm.goalTypeName = editForm.goalType === 1 ? 'OKR' : 'KPI'
  if (editForm.goalType === 1 && (!editForm.keyResults || editForm.keyResults.length === 0)) {
    editForm.keyResults = [
      { description: '', targetValue: '', currentValue: '', weight: 50, progress: 0 },
      { description: '', targetValue: '', currentValue: '', weight: 50, progress: 0 }
    ]
  }
}

const addKR = () => {
  editForm.keyResults!.push({ description: '', targetValue: '', currentValue: '', weight: 0, progress: 0 })
}
const removeKR = (idx: number) => {
  editForm.keyResults!.splice(idx, 1)
}

const handleSave = async () => {
  await editFormRef.value?.validate()
  if (editForm.goalType === 1 && krWeightSum.value !== 100) {
    ElMessage.warning(`KR 权重和应为 100（当前 ${krWeightSum.value}）`)
    return
  }
  if (editForm.parentGoalId) {
    const p = tableData.value.find((g) => g.id === editForm.parentGoalId)
    if (p) editForm.parentGoalTitle = p.goalTitle
  }
  if (editForm.id) {
    await updateItem(editForm)
    ElMessage.success('已更新')
  } else {
    const now = new Date()
    editForm.goalNo = `GOAL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-4)}`
    await addItem(editForm)
    ElMessage.success('已新增，等待审批')
  }
  editDialogVisible.value = false
  fetchData()
}

/* ========== 审批 ========== */
const approveDialogVisible = ref(false)
const approveTargetGoal = ref<PerformanceGoal | null>(null)
const approveComment = ref('')

const handleApprove = (row: PerformanceGoal) => {
  approveTargetGoal.value = row
  approveComment.value = ''
  approveDialogVisible.value = true
}

const submitApprove = async (approved: boolean) => {
  if (!approveTargetGoal.value) return
  if (!approved && !approveComment.value) {
    ElMessage.warning('驳回必须填写意见')
    return
  }
  await approveGoal(approveTargetGoal.value.id, approved, approveComment.value)
  ElMessage.success(approved ? '已批准' : '已驳回')
  approveDialogVisible.value = false
  fetchData()
}

const handleResubmit = async (row: PerformanceGoal) => {
  try {
    await ElMessageBox.confirm(`确定重新提交「${row.goalTitle}」？请先编辑修改 KR 内容`, '重新提交', { type: 'info' })
    await resubmitGoal(row.id)
    ElMessage.success('已重新提交')
    fetchData()
  } catch {}
}

/* ========== 更新进度 ========== */
const progressDialogVisible = ref(false)
const progressTarget = ref<PerformanceGoal | null>(null)
const progressForm = reactive({
  afterProgress: 0,
  afterValue: '',
  highlights: '',
  issues: '',
  nextPlan: ''
})

const handleUpdateProgress = (row: PerformanceGoal) => {
  progressTarget.value = row
  progressForm.afterProgress = row.progress
  progressForm.afterValue = row.currentValue || ''
  progressForm.highlights = ''
  progressForm.issues = ''
  progressForm.nextPlan = ''
  progressDialogVisible.value = true
}

const submitProgress = async () => {
  if (!progressTarget.value) return
  await updateGoalProgress(progressTarget.value.id, {
    afterProgress: progressForm.afterProgress,
    afterValue: progressForm.afterValue,
    highlights: progressForm.highlights,
    issues: progressForm.issues,
    nextPlan: progressForm.nextPlan,
    updatedBy: progressTarget.value.employeeName,
    updatedById: progressTarget.value.employeeId
  })
  ElMessage.success('进度已更新')
  progressDialogVisible.value = false
  fetchData()
  loadLogs()
}

/* ========== 进度日志 ========== */
const logList = ref<GoalProgressLog[]>([])
const logsDialogVisible = ref(false)
const currentGoalLogs = ref<GoalProgressLog[]>([])

const loadLogs = async () => {
  const res = await getGoalProgressLogs({ pageSize: 100 })
  logList.value = (res.data?.list || []).sort((a: GoalProgressLog, b: GoalProgressLog) =>
    b.updateTime.localeCompare(a.updateTime)
  )
}

const handleViewLogs = (row: PerformanceGoal) => {
  currentGoalLogs.value = logList.value.filter((l) => l.goalId === row.id)
  logsDialogVisible.value = true
}

const goalTitleById = (id: number) => {
  const g = tableData.value.find((x) => x.id === id)
  return g ? `[${g.employeeName}] ${g.goalTitle}` : `#${id}`
}

/* ========== 模板库 ========== */
const templateDialogVisible = ref(false)
const templateList = ref<GoalTemplate[]>([])
const selectedTemplateId = ref<number | null>(null)

const loadTemplates = async () => {
  const res = await getGoalTemplates({ pageSize: 100 })
  templateList.value = res.data?.list || []
}

const handleApplyTemplate = async () => {
  if (!selectedTemplateId.value) return
  await createGoalFromTemplate(selectedTemplateId.value, {
    employeeId: 0,
    employeeName: '（待填写）',
    departmentName: '（待填写）',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalCategory: 'personal',
    weight: 30
  })
  ElMessage.success('已从模板创建，请在列表中编辑补充员工信息')
  templateDialogVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
  loadLogs()
  loadTemplates()
})
</script>

<style scoped lang="scss">
.perf-goal-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .kpi-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .kpi-value {
    font-size: 26px;
    font-weight: 700;
    color: #303133;
    line-height: 1;
  }
}

.goal-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }
  :deep(.el-tab-pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-card {
  flex-shrink: 0;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.filter-form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.filter-buttons {
  display: flex;

  .el-button:not(:first-child) {
    margin-left: 12px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    margin-top: 16px;
  }
}

.muted {
  color: #909399;
  font-size: 12px;
}

.expand-box {
  padding: 12px 24px;
  background: #fafbfc;
  border-radius: 8px;
  margin: 0 8px;

  .expand-title {
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    margin: 8px 0 6px;
  }

  .kr-list {
    margin-bottom: 10px;
  }
}

.kr-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.kr-weight-hint {
  margin-top: 8px;
  font-size: 12px;

  &.ok {
    color: #67c23a;
  }

  &.err {
    color: #f56c6c;
  }
}

.diff-text {
  margin-left: 8px;
  font-size: 12px;
  color: #67c23a;
}
</style>
