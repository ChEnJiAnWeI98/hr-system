<template>
  <div class="perf-meeting-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">面谈总数</div>
        <div class="kpi-value">{{ stats.total || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已确认</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.confirmedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">有异议</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.disputedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待预约</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.pendingCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">平均时长</div>
        <div class="kpi-value">{{ stats.avgDuration || 0 }} 分</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">确认率</div>
        <div class="kpi-value">{{ stats.confirmRate || 0 }}%</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="员工">
          <el-input v-model="filters.employeeName" placeholder="姓名" style="width: 160px" clearable />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="filters.departmentName" placeholder="部门" style="width: 140px" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" style="width: 160px" clearable>
            <el-option v-for="(s, k) in MEETING_STATUS_MAP" :key="k" :label="s.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="data-card">
      <el-table :data="filteredData" stripe>
        <el-table-column prop="meetingNo" label="编号" width="160" />
        <el-table-column prop="employeeName" label="员工" width="100" />
        <el-table-column prop="departmentName" label="部门" width="120" />
        <el-table-column prop="interviewerName" label="面谈人" width="120" />
        <el-table-column prop="cycleName" label="周期" min-width="200" show-overflow-tooltip />
        <el-table-column prop="scheduledTime" label="预约时间" width="170" />
        <el-table-column label="状态" width="130" align="center">
          <template #default="{ row }">
            <el-tag :type="MEETING_STATUS_MAP[row.status].type" size="small">
              {{ MEETING_STATUS_MAP[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="员工确认" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="CONFIRM_STATUS_MAP[row.employeeConfirmStatus].type" size="small">
              {{ CONFIRM_STATUS_MAP[row.employeeConfirmStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button v-if="row.status === 'pending'" link type="warning" @click="handleSchedule(row)">预约</el-button>
            <el-button v-if="row.status === 'scheduled'" link type="success" @click="openNotesDialog(row)">填写纪要</el-button>
            <el-button v-if="row.status === 'completed'" link type="primary" @click="handleConfirm(row, true)">员工确认</el-button>
            <el-button v-if="row.status === 'completed'" link type="danger" @click="handleConfirm(row, false)">提异议</el-button>
            <el-button v-if="row.status === 'disputed'" link type="warning" @click="openNotesDialog(row, true)">协商处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预约弹窗 -->
    <el-dialog v-model="scheduleVisible" title="预约面谈时间" width="420px">
      <el-form label-width="90px">
        <el-form-item label="预约时间">
          <el-date-picker v-model="scheduleTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSchedule">确认预约</el-button>
      </template>
    </el-dialog>

    <!-- 纪要弹窗 -->
    <el-dialog v-model="notesVisible" :title="isResolving ? '协商处理 - 修改纪要' : '填写面谈纪要'" width="760px" top="5vh">
      <el-scrollbar v-if="notesTarget" max-height="72vh">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="员工">{{ notesTarget.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="面谈人">{{ notesTarget.interviewerName }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ notesTarget.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="预约时间">{{ notesTarget.scheduledTime || '—' }}</el-descriptions-item>
        </el-descriptions>

        <el-alert
          v-if="isResolving && notesTarget.employeeDispute"
          type="warning"
          :closable="false"
          show-icon
          title="员工异议内容"
          :description="notesTarget.employeeDispute"
          style="margin: 12px 0"
        />

        <div class="ai-agenda-row">
          <el-button type="primary" plain size="small" @click="aiAgendaVisible = true">
            ✨ AI 生成面谈提纲（参考）
          </el-button>
          <span class="ai-agenda-hint">基于员工目标进度/360 反馈 生成讨论要点，辅助面谈人备课</span>
        </div>

        <el-form label-position="top" style="margin-top: 16px">
          <el-form-item label="实际面谈时长（分钟）">
            <el-input v-model.number="notesForm.duration" style="width: 180px" />
          </el-form-item>
          <el-form-item label="优点总结" required>
            <el-input v-model="notesForm.strengths" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="不足分析" required>
            <el-input v-model="notesForm.weaknesses" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="改进建议" required>
            <el-input v-model="notesForm.improvementSuggestions" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="发展计划">
            <el-input v-model="notesForm.developmentPlan" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="下周期目标预设">
            <el-input v-model="notesForm.nextPeriodGoals" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="员工反馈">
            <el-input v-model="notesForm.employeeFeedback" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="上级承诺">
            <el-input v-model="notesForm.commitments" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="notesVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNotes">{{ isResolving ? '协商确认（员工已同意）' : '提交纪要' }}</el-button>
      </template>
    </el-dialog>

    <!-- AI 面谈提纲（generate 模式，参考用，支持复制到剪贴板）-->
    <AIAssistDialog
      v-model="aiAgendaVisible"
      ability-code="meeting_agenda"
      mode="generate"
      :adoptable="false"
      :initial-input="buildMeetingAgendaInput()"
      :target-employee="notesTarget?.employeeName || ''"
      dialog-width="680px"
      dialog-title="面谈提纲 · AI 生成（参考）"
      input-label="基础信息"
    />

    <!-- 员工异议弹窗 -->
    <el-dialog v-model="disputeVisible" title="提交异议" width="520px">
      <el-form label-width="100px">
        <el-form-item label="异议内容" required>
          <el-input v-model="disputeReason" type="textarea" :rows="4" placeholder="请详细说明对纪要的异议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="disputeVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDispute">提交异议</el-button>
      </template>
    </el-dialog>

    <!-- 查看弹窗 -->
    <el-dialog v-model="viewVisible" title="面谈详情" width="760px" top="5vh">
      <el-scrollbar v-if="viewData" max-height="72vh">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="编号">{{ viewData.meetingNo }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="MEETING_STATUS_MAP[viewData.status].type">
              {{ MEETING_STATUS_MAP[viewData.status].label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="员工">{{ viewData.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ viewData.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="面谈人">{{ viewData.interviewerName }}</el-descriptions-item>
          <el-descriptions-item label="周期">{{ viewData.cycleName }}</el-descriptions-item>
          <el-descriptions-item label="预约时间">{{ viewData.scheduledTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="实际时间">{{ viewData.actualTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ viewData.duration ? viewData.duration + ' 分钟' : '—' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ viewData.submitTime || '—' }}</el-descriptions-item>
        </el-descriptions>

        <div v-if="viewData.strengths" class="note-section">
          <div class="section-title">优点总结</div>
          <div class="note-body">{{ viewData.strengths }}</div>
        </div>
        <div v-if="viewData.weaknesses" class="note-section">
          <div class="section-title">不足分析</div>
          <div class="note-body">{{ viewData.weaknesses }}</div>
        </div>
        <div v-if="viewData.improvementSuggestions" class="note-section">
          <div class="section-title">改进建议</div>
          <div class="note-body">{{ viewData.improvementSuggestions }}</div>
        </div>
        <div v-if="viewData.developmentPlan" class="note-section">
          <div class="section-title">发展计划</div>
          <div class="note-body">{{ viewData.developmentPlan }}</div>
        </div>
        <div v-if="viewData.nextPeriodGoals" class="note-section">
          <div class="section-title">下周期目标预设</div>
          <div class="note-body">{{ viewData.nextPeriodGoals }}</div>
        </div>
        <div v-if="viewData.employeeFeedback" class="note-section">
          <div class="section-title">员工反馈</div>
          <div class="note-body">{{ viewData.employeeFeedback }}</div>
        </div>
        <div v-if="viewData.commitments" class="note-section">
          <div class="section-title">上级承诺</div>
          <div class="note-body">{{ viewData.commitments }}</div>
        </div>
        <div v-if="viewData.employeeDispute" class="note-section">
          <div class="section-title" style="color: #f56c6c">员工异议</div>
          <div class="note-body dispute">{{ viewData.employeeDispute }}</div>
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AIAssistDialog from '@/components/business/AIAssistDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPerformanceMeetingList,
  scheduleMeeting,
  submitMeetingNotes,
  employeeConfirm,
  resolveDispute,
  getMeetingStats
} from '@/api/performanceMeeting'
import type { PerformanceMeeting } from '@/types/performanceMeeting'
import {
  MEETING_STATUS_MAP,
  CONFIRM_STATUS_MAP,
  DEFAULT_MEETING_TEMPLATE
} from '@/types/performanceMeeting'

defineOptions({ name: 'PerformanceMeeting' })

const filters = reactive({
  employeeName: '',
  departmentName: '',
  status: '' as string
})

const tableData = ref<PerformanceMeeting[]>([])
const stats = ref<any>({})

const filteredData = computed(() =>
  tableData.value.filter(
    (r) =>
      (!filters.employeeName || r.employeeName.includes(filters.employeeName)) &&
      (!filters.departmentName || r.departmentName.includes(filters.departmentName)) &&
      (!filters.status || r.status === filters.status)
  )
)

const fetchData = async () => {
  const res = await getPerformanceMeetingList({ pageSize: 200 })
  tableData.value = res.data?.list || []
  const s = await getMeetingStats()
  stats.value = s.data
}

/* ========== 预约 ========== */
const scheduleVisible = ref(false)
const scheduleTarget = ref<PerformanceMeeting | null>(null)
const scheduleTime = ref('')

const handleSchedule = (row: PerformanceMeeting) => {
  scheduleTarget.value = row
  scheduleTime.value = ''
  scheduleVisible.value = true
}

const submitSchedule = async () => {
  if (!scheduleTarget.value || !scheduleTime.value) {
    ElMessage.warning('请选择时间')
    return
  }
  await scheduleMeeting(scheduleTarget.value.id, scheduleTime.value)
  ElMessage.success('已预约')
  scheduleVisible.value = false
  fetchData()
}

/* ========== 填写纪要 / 协商处理 ========== */
const notesVisible = ref(false)
// AI 面谈提纲生成
const aiAgendaVisible = ref(false)
const buildMeetingAgendaInput = () => {
  if (!notesTarget.value) return ''
  const t = notesTarget.value
  return `员工：${t.employeeName}\n面谈人：${t.interviewerName}\n周期：${t.cycleName}\n预约时间：${t.scheduledTime || '-'}\n备注：请基于员工在本周期的目标进度、360 反馈、上次面谈纪要，生成按优先级排序的讨论要点。`
}
const notesTarget = ref<PerformanceMeeting | null>(null)
const isResolving = ref(false)
const notesForm = reactive<Partial<PerformanceMeeting>>({
  duration: 45,
  strengths: '',
  weaknesses: '',
  improvementSuggestions: '',
  developmentPlan: '',
  nextPeriodGoals: '',
  employeeFeedback: '',
  commitments: ''
})

const openNotesDialog = (row: PerformanceMeeting, resolving = false) => {
  notesTarget.value = row
  isResolving.value = resolving
  // 初始化：有数据则回填，没有则用模板
  notesForm.duration = row.duration || 45
  notesForm.strengths = row.strengths || DEFAULT_MEETING_TEMPLATE.strengths
  notesForm.weaknesses = row.weaknesses || DEFAULT_MEETING_TEMPLATE.weaknesses
  notesForm.improvementSuggestions = row.improvementSuggestions || DEFAULT_MEETING_TEMPLATE.improvementSuggestions
  notesForm.developmentPlan = row.developmentPlan || DEFAULT_MEETING_TEMPLATE.developmentPlan
  notesForm.nextPeriodGoals = row.nextPeriodGoals || DEFAULT_MEETING_TEMPLATE.nextPeriodGoals
  notesForm.employeeFeedback = row.employeeFeedback || ''
  notesForm.commitments = row.commitments || DEFAULT_MEETING_TEMPLATE.commitments
  notesVisible.value = true
}

const submitNotes = async () => {
  if (!notesTarget.value) return
  if (!notesForm.strengths || !notesForm.weaknesses || !notesForm.improvementSuggestions) {
    ElMessage.warning('优点 / 不足 / 改进建议为必填项')
    return
  }
  if (isResolving.value) {
    await resolveDispute(notesTarget.value.id, notesForm)
    ElMessage.success('异议已协商处理，纪要已更新')
  } else {
    await submitMeetingNotes(notesTarget.value.id, notesForm)
    ElMessage.success('纪要已提交，等待员工确认')
  }
  notesVisible.value = false
  fetchData()
}

/* ========== 员工确认 / 异议 ========== */
const disputeVisible = ref(false)
const disputeTarget = ref<PerformanceMeeting | null>(null)
const disputeReason = ref('')

const handleConfirm = async (row: PerformanceMeeting, confirmed: boolean) => {
  if (confirmed) {
    try {
      await ElMessageBox.confirm(`确定确认「${row.employeeName}」的面谈纪要？`, '员工确认', { type: 'info' })
      await employeeConfirm(row.id, true)
      ElMessage.success('已确认')
      fetchData()
    } catch {}
  } else {
    disputeTarget.value = row
    disputeReason.value = ''
    disputeVisible.value = true
  }
}

const submitDispute = async () => {
  if (!disputeTarget.value || !disputeReason.value) {
    ElMessage.warning('请填写异议内容')
    return
  }
  await employeeConfirm(disputeTarget.value.id, false, disputeReason.value)
  ElMessage.success('异议已提交，面谈人和 HRBP 将介入协商')
  disputeVisible.value = false
  fetchData()
}

/* ========== 查看 ========== */
const viewVisible = ref(false)
const viewData = ref<PerformanceMeeting | null>(null)
const handleView = (row: PerformanceMeeting) => {
  viewData.value = row
  viewVisible.value = true
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.perf-meeting-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.kpi-card,
.filter-card,
.data-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
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

.filter-card {
  flex-shrink: 0;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.note-section {
  margin-top: 16px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .note-body {
    padding: 12px 14px;
    background: #fafbfc;
    border-radius: 6px;
    color: #606266;
    font-size: 13px;
    white-space: pre-line;
    line-height: 1.8;

    &.dispute {
      background: #fef0f0;
      color: #c45656;
    }
  }
}
</style>
