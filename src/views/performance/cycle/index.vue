<template>
  <div class="performance-cycle-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">进行中周期</div>
        <div class="kpi-value">{{ inProgressCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">目标设定中</div>
        <div class="kpi-value" style="color: #e6a23c">{{ statusCount(2) }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">评估 / 校准中</div>
        <div class="kpi-value" style="color: #409eff">{{ statusCount(4) + statusCount(5) }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已归档</div>
        <div class="kpi-value" style="color: #909399">{{ statusCount(7) }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">本期参与人数</div>
        <div class="kpi-value">{{ totalParticipants }}</div>
      </el-card>
    </div>

    <!-- 筛选卡片 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="周期名称">
            <el-input v-model="queryParams.cycleName" placeholder="名称或编号" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="周期类型">
            <el-select v-model="queryParams.cycleType" placeholder="全部" style="width: 140px" clearable>
              <el-option v-for="(l, k) in CYCLE_TYPE_MAP" :key="k" :label="l" :value="Number(k)" />
            </el-select>
          </el-form-item>
          <el-form-item label="目标模式">
            <el-select v-model="queryParams.goalMode" placeholder="全部" style="width: 140px" clearable>
              <el-option label="OKR" value="okr" />
              <el-option label="KPI" value="kpi" />
              <el-option label="混合" value="mixed" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" style="width: 150px" clearable>
              <el-option v-for="(s, k) in CYCLE_STATUS_MAP" :key="k" :label="s.label" :value="Number(k)" />
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

    <!-- 数据卡片 -->
    <el-card class="data-card">
      <div class="table-header">
        <div class="header-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增周期
          </el-button>
          <el-button :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="48" />
          <el-table-column prop="cycleNo" label="周期编号" width="140" />
          <el-table-column prop="cycleName" label="周期名称" min-width="200" show-overflow-tooltip />
          <el-table-column label="类型" width="90" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ CYCLE_TYPE_MAP[row.cycleType] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="目标模式" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.goalMode === 'okr'" type="success" size="small">OKR</el-tag>
              <el-tag v-else-if="row.goalMode === 'kpi'" type="warning" size="small">KPI</el-tag>
              <el-tag v-else size="small" type="info">混合</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="周期" width="200">
            <template #default="{ row }">
              <span>{{ row.startDate }} ~ {{ row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="CYCLE_STATUS_MAP[row.status].type" size="small">
                {{ CYCLE_STATUS_MAP[row.status].label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="participantCount" label="参与人数" width="100" align="right" />
          <el-table-column label="模板组" width="120" align="center">
            <template #default="{ row }">
              <el-tooltip v-if="parseTemplateGroup(row.templateGroup).length > 0" :content="templateNames(row.templateGroup)">
                <el-tag size="small" effect="plain">{{ parseTemplateGroup(row.templateGroup).length }} 个</el-tag>
              </el-tooltip>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="340" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">详情</el-button>
              <el-button link @click="handleEdit(row)" :disabled="row.status === 7">编辑</el-button>
              <el-button
                v-if="row.status < 7"
                link
                type="success"
                @click="handleAdvance(row)"
              >
                推进状态
              </el-button>
              <el-button link @click="handleClone(row)">复用</el-button>
              <el-button v-if="row.status === 7" link type="warning" @click="handleUnarchive(row)">解锁归档</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑周期' : '新增周期'" width="760px">
      <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="周期名称" prop="cycleName">
              <el-input v-model="editForm.cycleName" placeholder="如 2026 Q3 OKR 考核" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期编号">
              <el-input v-model="editForm.cycleNo" placeholder="留空自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期类型" prop="cycleType">
              <el-select v-model="editForm.cycleType" style="width: 100%">
                <el-option v-for="(l, k) in CYCLE_TYPE_MAP" :key="k" :label="l" :value="Number(k)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标模式" prop="goalMode">
              <el-select v-model="editForm.goalMode" style="width: 100%">
                <el-option label="OKR" value="okr" />
                <el-option label="KPI" value="kpi" />
                <el-option label="混合" value="mixed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="editForm.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker v-model="editForm.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">6 个关键节点</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标设定截止">
              <el-date-picker v-model="editForm.goalDeadline" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估开始">
              <el-date-picker v-model="editForm.evalStartDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估截止">
              <el-date-picker v-model="editForm.evalEndDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校准完成">
              <el-date-picker v-model="editForm.calibrationDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归档完成">
              <el-date-picker v-model="editForm.archiveDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过程跟踪节点">
              <el-input v-model="trackingNodesInput" placeholder="YYYY-MM-DD，多个用英文逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">适用范围 & 配置</el-divider>
        <el-form-item label="适用范围">
          <el-radio-group v-model="applyScopeType">
            <el-radio value="all">全员</el-radio>
            <el-radio value="departments">指定部门</el-radio>
            <el-radio value="jobFamilies">指定岗位族</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="applyScopeType === 'departments'" label="部门列表">
          <el-input v-model="applyScopeValue" placeholder="部门名，逗号分隔" />
        </el-form-item>
        <el-form-item v-if="applyScopeType === 'jobFamilies'" label="岗位族列表">
          <el-select v-model="applyScopeJobFamilies" multiple style="width: 100%">
            <el-option label="技术研发" value="技术研发" />
            <el-option label="产品设计" value="产品设计" />
            <el-option label="运营市场" value="运营市场" />
            <el-option label="职能支持" value="职能支持" />
            <el-option label="管理岗位" value="管理岗位" />
          </el-select>
        </el-form-item>
        <el-form-item label="参与人数（预估）">
          <el-input v-model.number="editForm.participantCount" placeholder="可先预估，后续系统自动统计" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗（含甘特图 & 节点进度）-->
    <el-dialog v-model="detailVisible" title="周期详情" width="800px">
      <div v-if="detailData">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="周期编号">{{ detailData.cycleNo }}</el-descriptions-item>
          <el-descriptions-item label="周期名称">{{ detailData.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ CYCLE_TYPE_MAP[detailData.cycleType] }}</el-descriptions-item>
          <el-descriptions-item label="目标模式">
            {{ detailData.goalMode === 'okr' ? 'OKR' : detailData.goalMode === 'kpi' ? 'KPI' : '混合' }}
          </el-descriptions-item>
          <el-descriptions-item label="周期">{{ detailData.startDate }} ~ {{ detailData.endDate }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="CYCLE_STATUS_MAP[detailData.status].type">
              {{ CYCLE_STATUS_MAP[detailData.status].label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="参与人数">{{ detailData.participantCount }}</el-descriptions-item>
          <el-descriptions-item label="适用范围">{{ scopeLabel(detailData.applyScope) }}</el-descriptions-item>
          <el-descriptions-item label="关联模板组" :span="2">
            <el-tag
              v-for="t in parseTemplateGroup(detailData.templateGroup)"
              :key="t.templateId"
              size="small"
              effect="plain"
              style="margin-right: 6px"
            >
              {{ t.templateName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '—' }}</el-descriptions-item>
        </el-descriptions>

        <div class="milestone-section">
          <div class="section-title">状态流转进度</div>
          <el-steps :active="detailData.status - 1" finish-status="success">
            <el-step title="未开始" />
            <el-step title="目标设定中" />
            <el-step title="过程跟踪中" />
            <el-step title="评估中" />
            <el-step title="校准中" />
            <el-step title="公示中" />
            <el-step title="已归档" />
          </el-steps>
        </div>

        <div class="milestone-section">
          <div class="section-title">6 个关键节点（甘特视图）</div>
          <div class="milestone-list">
            <div v-for="m in milestones(detailData)" :key="m.key" class="milestone-item" :class="m.status">
              <span class="milestone-label">{{ m.label }}</span>
              <span class="milestone-date">{{ m.date || '—' }}</span>
              <span class="milestone-flag">{{ m.status === 'done' ? '✓ 已完成' : m.status === 'current' ? '◎ 进行中' : '○ 未开始' }}</span>
            </div>
          </div>
        </div>

        <div class="milestone-section">
          <div class="section-title">强制分布配置</div>
          <div class="distribution-bar">
            <div
              v-for="(v, k) in distributionOf(detailData)"
              :key="k"
              class="distribution-item"
              :class="'grade-' + k"
              :style="{ flex: v }"
            >
              {{ k }} {{ v }}%
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 复用弹窗 -->
    <el-dialog v-model="cloneDialogVisible" title="复用周期" width="540px">
      <el-form v-if="cloneSourceData" :model="cloneForm" label-width="120px">
        <el-alert
          :title="`将基于「${cloneSourceData.cycleName}」复用创建新周期`"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
        />
        <el-form-item label="新周期名称" required>
          <el-input v-model="cloneForm.cycleName" placeholder="如 2026 Q4 OKR 考核" />
        </el-form-item>
        <el-form-item label="新开始日期" required>
          <el-date-picker v-model="cloneForm.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="新结束日期" required>
          <el-date-picker v-model="cloneForm.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cloneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCloneConfirm">确定复用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  getList,
  addItem,
  updateItem,
  deleteItem,
  batchDeleteItems,
  advanceCycleStatus,
  cloneCycle,
  unarchiveCycle
} from '@/api/performanceCycle'
import type { PerformanceCycle, CycleMilestone } from '@/types/performance'
import { CYCLE_TYPE_MAP, CYCLE_STATUS_MAP, CYCLE_NEXT_STATUS } from '@/types/performance'

defineOptions({ name: 'PerformanceCycle' })

/* ========== 查询 & 列表 ========== */
const queryParams = reactive({
  cycleName: '',
  cycleType: null as number | null,
  goalMode: '' as 'okr' | 'kpi' | 'mixed' | '',
  status: null as number | null,
  page: 1,
  pageSize: 10
})
const tableData = ref<PerformanceCycle[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const inProgressCount = computed(() =>
  tableData.value.filter((c) => c.status >= 2 && c.status <= 6).length
)
const totalParticipants = computed(() =>
  tableData.value.reduce((sum, c) => sum + (c.status >= 2 && c.status <= 6 ? (c.participantCount || 0) : 0), 0)
)
const statusCount = (s: number) => tableData.value.filter((c) => c.status === s).length

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
  queryParams.cycleName = ''
  queryParams.cycleType = null
  queryParams.goalMode = ''
  queryParams.status = null
  queryParams.page = 1
  fetchData()
}
const handleSelectionChange = (sel: PerformanceCycle[]) => {
  selectedIds.value = sel.map((r) => r.id)
}
const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定删除 ${selectedIds.value.length} 个周期？`, '确认', { type: 'warning' })
  await batchDeleteItems(selectedIds.value)
  ElMessage.success('已删除')
  selectedIds.value = []
  fetchData()
}
const handleDelete = async (row: PerformanceCycle) => {
  await ElMessageBox.confirm(`确定删除「${row.cycleName}」？`, '确认', { type: 'warning' })
  await deleteItem(row.id)
  ElMessage.success('已删除')
  fetchData()
}

/* ========== 新增 / 编辑 ========== */
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<PerformanceCycle>>({
  id: undefined,
  cycleNo: '',
  cycleName: '',
  cycleType: 3,
  startDate: '',
  endDate: '',
  goalDeadline: '',
  evalStartDate: '',
  evalEndDate: '',
  calibrationDate: '',
  archiveDate: '',
  trackingNodes: '[]',
  status: 1,
  participantCount: 0,
  remark: '',
  applyScope: JSON.stringify({ scope: 'all' }),
  templateGroup: '[]',
  goalMode: 'mixed',
  distributionConfig: JSON.stringify({ S: 10, A: 20, B: 40, C: 20, D: 10, tolerance: 2 })
})
const trackingNodesInput = ref('')
const applyScopeType = ref<'all' | 'departments' | 'jobFamilies'>('all')
const applyScopeValue = ref('')
const applyScopeJobFamilies = ref<string[]>([])

const formRules = {
  cycleName: [{ required: true, message: '请输入周期名称', trigger: 'blur' }],
  cycleType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  goalMode: [{ required: true, message: '请选择目标模式', trigger: 'change' }]
}

const resetEditForm = () => {
  editForm.id = undefined
  editForm.cycleNo = ''
  editForm.cycleName = ''
  editForm.cycleType = 3
  editForm.startDate = ''
  editForm.endDate = ''
  editForm.goalDeadline = ''
  editForm.evalStartDate = ''
  editForm.evalEndDate = ''
  editForm.calibrationDate = ''
  editForm.archiveDate = ''
  editForm.trackingNodes = '[]'
  editForm.status = 1
  editForm.participantCount = 0
  editForm.remark = ''
  editForm.applyScope = JSON.stringify({ scope: 'all' })
  editForm.templateGroup = '[]'
  editForm.goalMode = 'mixed'
  editForm.distributionConfig = JSON.stringify({ S: 10, A: 20, B: 40, C: 20, D: 10, tolerance: 2 })
  trackingNodesInput.value = ''
  applyScopeType.value = 'all'
  applyScopeValue.value = ''
  applyScopeJobFamilies.value = []
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}

const handleEdit = (row: PerformanceCycle) => {
  resetEditForm()
  Object.assign(editForm, row)
  try {
    const nodes = JSON.parse(row.trackingNodes || '[]')
    trackingNodesInput.value = Array.isArray(nodes) ? nodes.join(', ') : ''
  } catch {
    trackingNodesInput.value = ''
  }
  try {
    const scope = JSON.parse(row.applyScope || '{}')
    if (scope.scope === 'all') applyScopeType.value = 'all'
    else if (scope.departments) {
      applyScopeType.value = 'departments'
      applyScopeValue.value = (scope.departments || []).join(', ')
    } else if (scope.jobFamilies) {
      applyScopeType.value = 'jobFamilies'
      applyScopeJobFamilies.value = scope.jobFamilies || []
    }
  } catch {}
  editDialogVisible.value = true
}

const handleSave = async () => {
  await editFormRef.value?.validate()
  editForm.trackingNodes = JSON.stringify(
    trackingNodesInput.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
  )
  if (applyScopeType.value === 'all') editForm.applyScope = JSON.stringify({ scope: 'all' })
  else if (applyScopeType.value === 'departments')
    editForm.applyScope = JSON.stringify({
      departments: applyScopeValue.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    })
  else editForm.applyScope = JSON.stringify({ jobFamilies: applyScopeJobFamilies.value })

  if (editForm.id) {
    await updateItem(editForm)
    ElMessage.success('已更新')
  } else {
    const now = new Date()
    if (!editForm.cycleNo) {
      const typeCode = { 1: 'Y', 2: 'H', 3: 'Q', 4: 'M', 5: 'X' }[editForm.cycleType || 3] || 'X'
      editForm.cycleNo = `PERF${now.getFullYear()}${typeCode}${String(Date.now()).slice(-3)}`
    }
    await addItem(editForm)
    ElMessage.success('已新增')
  }
  editDialogVisible.value = false
  fetchData()
}

/* ========== 推进状态 ========== */
const handleAdvance = async (row: PerformanceCycle) => {
  const nextStatus = CYCLE_NEXT_STATUS[row.status]
  if (nextStatus === null || nextStatus === undefined) {
    ElMessage.info('已到达终态，无法再推进')
    return
  }
  const nextLabel = CYCLE_STATUS_MAP[nextStatus].label
  try {
    await ElMessageBox.confirm(
      `即将从「${CYCLE_STATUS_MAP[row.status].label}」推进到「${nextLabel}」？`,
      '推进周期状态',
      { type: 'warning' }
    )
    await advanceCycleStatus(row.id)
    ElMessage.success(`已推进到：${nextLabel}`)
    fetchData()
  } catch {}
}

/* ========== 复用 ========== */
const cloneDialogVisible = ref(false)
const cloneSourceData = ref<PerformanceCycle | null>(null)
const cloneForm = reactive({ cycleName: '', startDate: '', endDate: '' })

const handleClone = (row: PerformanceCycle) => {
  cloneSourceData.value = row
  cloneForm.cycleName = row.cycleName + '(副本)'
  cloneForm.startDate = ''
  cloneForm.endDate = ''
  cloneDialogVisible.value = true
}

const handleCloneConfirm = async () => {
  if (!cloneSourceData.value) return
  if (!cloneForm.cycleName || !cloneForm.startDate || !cloneForm.endDate) {
    ElMessage.warning('请填写完整信息')
    return
  }
  await cloneCycle(cloneSourceData.value.id, cloneForm)
  ElMessage.success('周期已复用')
  cloneDialogVisible.value = false
  fetchData()
}

/* ========== 归档解锁 ========== */
const handleUnarchive = async (row: PerformanceCycle) => {
  try {
    await ElMessageBox.confirm(`确定解锁已归档的「${row.cycleName}」？此操作仅 HRD 授权可用`, '解锁归档', {
      type: 'warning'
    })
    await unarchiveCycle(row.id)
    ElMessage.success('已解锁，周期回到公示中状态')
    fetchData()
  } catch {}
}

/* ========== 详情 ========== */
const detailVisible = ref(false)
const detailData = ref<PerformanceCycle | null>(null)
const handleView = (row: PerformanceCycle) => {
  detailData.value = row
  detailVisible.value = true
}

/* ========== 工具 ========== */
const parseTemplateGroup = (s?: string) => {
  if (!s) return []
  try {
    return JSON.parse(s) || []
  } catch {
    return []
  }
}

const templateNames = (s?: string) =>
  parseTemplateGroup(s)
    .map((t: any) => t.templateName)
    .join('、')

const scopeLabel = (s?: string): string => {
  if (!s) return '—'
  try {
    const o = JSON.parse(s)
    if (o.scope === 'all') return '全员'
    if (o.departments) return `部门：${o.departments.join('、')}`
    if (o.jobFamilies) return `岗位族：${o.jobFamilies.join('、')}`
    if (o.employeeIds) return `指定员工：${o.employeeIds.length} 人`
  } catch {}
  return '—'
}

const milestones = (c: PerformanceCycle): CycleMilestone[] => {
  const today = new Date().toISOString().slice(0, 10)
  const items: Array<{ key: string; label: string; date?: string }> = [
    { key: 'goalDeadline', label: '目标设定截止', date: c.goalDeadline },
    { key: 'tracking', label: '过程跟踪节点', date: parseTemplateGroup(c.trackingNodes).join(' / ') },
    { key: 'evalStartDate', label: '评估开始', date: c.evalStartDate },
    { key: 'evalEndDate', label: '评估截止', date: c.evalEndDate },
    { key: 'calibrationDate', label: '校准完成', date: c.calibrationDate },
    { key: 'archiveDate', label: '归档完成', date: c.archiveDate }
  ]
  return items.map((m) => ({
    ...m,
    status: m.date && m.date <= today ? 'done' : m.date && m.date >= today ? 'pending' : 'pending'
  })) as CycleMilestone[]
}

const distributionOf = (c: PerformanceCycle) => {
  try {
    const o = JSON.parse(c.distributionConfig || '{}')
    return { S: o.S || 10, A: o.A || 20, B: o.B || 40, C: o.C || 20, D: o.D || 10 }
  } catch {
    return { S: 10, A: 20, B: 40, C: 20, D: 10 }
  }
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.performance-cycle-container {
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

.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-card :deep(.el-card__body) {
  padding: 12px 20px;
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

.milestone-section {
  margin-top: 20px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;
  }
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .milestone-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 14px;
    border-radius: 6px;
    background: #fafbfc;
    font-size: 13px;

    &.done {
      background: #f0f9eb;
    }
    &.current {
      background: #ecf5ff;
    }

    .milestone-label {
      width: 140px;
      color: #606266;
      flex-shrink: 0;
    }

    .milestone-date {
      flex: 1;
      color: #303133;
    }

    .milestone-flag {
      color: #909399;
      font-size: 12px;
    }
  }
}

.distribution-bar {
  display: flex;
  width: 100%;
  height: 28px;
  border-radius: 6px;
  overflow: hidden;

  .distribution-item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 600;

    &.grade-S {
      background: #67c23a;
    }
    &.grade-A {
      background: #409eff;
    }
    &.grade-B {
      background: #909399;
    }
    &.grade-C {
      background: #e6a23c;
    }
    &.grade-D {
      background: #f56c6c;
    }
  }
}
</style>
