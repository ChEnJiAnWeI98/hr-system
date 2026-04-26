<template>
  <div class="perf-calib-container">
    <el-tabs v-model="activeTab" class="calib-tabs">
      <!-- Tab 1: 强制分布看板 -->
      <el-tab-pane label="分布看板" name="distribution">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="周期">
              <el-select v-model="cycleId" style="width: 260px" @change="loadDistribution">
                <el-option label="2026 Q1 OKR 季度考核" :value="3" />
                <el-option label="2026 Q2 OKR 季度考核" :value="4" />
                <el-option label="2026 Q1 销售团队 KPI 考核" :value="8" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <div v-if="summary" class="dist-main">
          <el-card class="dist-card">
            <div class="section-title">
              总体分布
              <span class="sub-hint">（{{ summary.total }} 人，对照强制分布 S {{ summary.config.S }}% / A {{ summary.config.A }}% / B {{ summary.config.B }}% / C {{ summary.config.C }}% / D {{ summary.config.D }}%）</span>
            </div>
            <div class="distribution-compare">
              <div class="dist-row">
                <div class="dist-row-label">当前</div>
                <div class="dist-bar">
                  <div v-for="g in grades" :key="g" class="dist-seg" :class="`grade-${g}`" :style="{ flex: summary.ratios[g] || 0.01 }">
                    <span v-if="summary.ratios[g] >= 5">{{ g }} {{ summary.ratios[g] }}%</span>
                  </div>
                </div>
              </div>
              <div class="dist-row">
                <div class="dist-row-label">目标</div>
                <div class="dist-bar">
                  <div v-for="g in grades" :key="g" class="dist-seg target" :class="`grade-${g}`" :style="{ flex: summary.config[g] }">
                    <span>{{ g }} {{ summary.config[g] }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="dept-card">
            <div class="section-title">跨部门对标</div>
            <el-table :data="summary.departments" stripe>
              <el-table-column prop="departmentName" label="部门" width="120" />
              <el-table-column prop="totalEmployees" label="人数" width="80" align="right" />
              <el-table-column label="各等级占比" min-width="360">
                <template #default="{ row }">
                  <div class="dist-bar small">
                    <div v-for="g in grades" :key="g" class="dist-seg" :class="`grade-${g}`" :style="{ flex: row.gradeRatios[g] || 0.01 }">
                      <span v-if="row.gradeRatios[g] >= 8">{{ g }} {{ row.gradeRatios[g] }}%</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="avgScore" label="平均分" width="90" align="center">
                <template #default="{ row }">
                  <strong>{{ row.avgScore }}</strong>
                </template>
              </el-table-column>
              <el-table-column label="偏差" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.compliant ? 'success' : 'warning'" size="small">
                    ±{{ row.deviation }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="合规" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.compliant ? 'success' : 'danger'" size="small">
                    {{ row.compliant ? '符合' : '需调整' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 校准卡（拖拽调档） -->
      <el-tab-pane label="校准卡" name="cards">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="周期">
              <el-select v-model="cycleId" style="width: 260px" @change="loadCards">
                <el-option label="2026 Q1 OKR 季度考核" :value="3" />
                <el-option label="2026 Q2 OKR 季度考核" :value="4" />
                <el-option label="2026 Q1 销售团队 KPI 考核" :value="8" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联会议">
              <el-select v-model="currentMeetingId" clearable placeholder="（可选）" style="width: 200px">
                <el-option v-for="m in meetings" :key="m.id" :label="m.title" :value="m.id" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="cards-card">
          <div class="cards-hint">💡 校准卡操作：点击员工卡片上的 S/A/B/C/D 按钮可调整其等级，每次调档需填写原因并自动留痕</div>
          <div class="grade-columns">
            <div v-for="g in grades" :key="g" class="grade-col">
              <div class="grade-col-header" :class="`grade-${g}`">
                <span class="grade-label">{{ g }}</span>
                <span class="grade-count">{{ groupedCards[g]?.length || 0 }} 人</span>
                <span class="grade-target">目标 {{ summary?.config[g] }}%</span>
              </div>
              <div class="grade-col-body">
                <div v-for="card in groupedCards[g] || []" :key="card.id" class="emp-card">
                  <div class="emp-name">{{ card.employeeName }}</div>
                  <div class="emp-dept">{{ card.departmentName }}</div>
                  <div class="emp-score">
                    <span class="muted">原始得分</span>
                    <strong>{{ card.finalScore }}</strong>
                  </div>
                  <div class="grade-buttons">
                    <el-button
                      v-for="g2 in grades"
                      :key="g2"
                      :class="`gbtn grade-${g2}`"
                      size="small"
                      :plain="card.initialGrade !== g2"
                      @click="openAdjustDialog(card, g2)"
                      :disabled="card.initialGrade === g2 && card.finalGrade === g2"
                    >
                      {{ g2 }}
                    </el-button>
                  </div>
                </div>
                <el-empty v-if="!groupedCards[g] || groupedCards[g].length === 0" description="无数据" :image-size="50" />
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- Tab 3: 校准会议 -->
      <el-tab-pane label="校准会议" name="meetings">
        <el-card class="data-card">
          <div class="table-header">
            <el-button type="primary" @click="openMeetingDialog()">
              <el-icon><Plus /></el-icon>
              新建校准会
            </el-button>
          </div>
          <el-table :data="meetings" stripe>
            <el-table-column prop="meetingNo" label="会议编号" width="170" />
            <el-table-column prop="title" label="会议主题" min-width="220" />
            <el-table-column prop="cycleName" label="周期" min-width="200" />
            <el-table-column prop="meetingTime" label="时间" width="170" />
            <el-table-column label="参会人" min-width="240">
              <template #default="{ row }">
                <el-tag v-for="a in row.attendees" :key="a.id" size="small" effect="plain" style="margin-right: 4px">
                  {{ a.name }} · {{ a.role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="覆盖部门" width="160">
              <template #default="{ row }">
                <span>{{ (row.departments || []).join('、') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调档数" width="100" align="center">
              <template #default="{ row }">{{ row.adjustCount || 0 }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="MEETING_STATUS_MAP[row.status].type" size="small">
                  {{ MEETING_STATUS_MAP[row.status].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="viewMeeting(row)">查看</el-button>
                <el-button v-if="row.status !== 'completed' && row.status !== 'cancelled'" link type="success" @click="advanceMeeting(row)">
                  推进
                </el-button>
                <el-button link type="danger" @click="deleteMeetingItem(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 4: 调档日志 -->
      <el-tab-pane label="调档日志" name="records">
        <el-card class="data-card">
          <el-table :data="records" stripe>
            <el-table-column prop="adjustTime" label="时间" width="170" />
            <el-table-column prop="employeeName" label="员工" width="100" />
            <el-table-column prop="departmentName" label="部门" width="110" />
            <el-table-column prop="originalScore" label="原始得分" width="100" align="right" />
            <el-table-column label="等级变化" width="180" align="center">
              <template #default="{ row }">
                <el-tag :class="`grade-${row.beforeGrade}`" size="small">{{ row.beforeGrade }}</el-tag>
                <el-icon style="margin: 0 8px" color="#909399"><Right /></el-icon>
                <el-tag :class="`grade-${row.afterGrade}`" size="small">{{ row.afterGrade }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="调档原因" min-width="280" show-overflow-tooltip />
            <el-table-column prop="adjustedBy" label="调整人" width="120" />
            <el-table-column label="会议" width="100">
              <template #default="{ row }">
                <span v-if="row.meetingId">#{{ row.meetingId }}</span>
                <span v-else class="muted">—</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 调档弹窗 -->
    <el-dialog v-model="adjustDialogVisible" title="调整等级" width="520px">
      <el-descriptions v-if="adjustTarget" :column="1" border size="small">
        <el-descriptions-item label="员工">{{ adjustTarget.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ adjustTarget.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="原始得分">{{ adjustTarget.finalScore }}</el-descriptions-item>
        <el-descriptions-item label="调整前等级">
          <el-tag :class="`grade-${adjustTarget.initialGrade}`">{{ adjustTarget.initialGrade }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整后等级">
          <el-tag :class="`grade-${adjustToGrade}`">{{ adjustToGrade }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-form label-width="100px" style="margin-top: 16px">
        <el-form-item label="调档原因" required>
          <el-input v-model="adjustReason" type="textarea" :rows="3" placeholder="必填，留痕审计" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdjust">确定调档</el-button>
      </template>
    </el-dialog>

    <!-- 会议编辑弹窗 -->
    <el-dialog v-model="meetingDialogVisible" :title="meetingForm.id ? '编辑校准会' : '新建校准会'" width="640px">
      <el-form :model="meetingForm" label-width="120px">
        <el-form-item label="会议主题">
          <el-input v-model="meetingForm.title" />
        </el-form-item>
        <el-form-item label="周期">
          <el-select v-model="meetingForm.cycleId" style="width: 100%">
            <el-option label="2026 Q1 OKR 季度考核" :value="3" />
            <el-option label="2026 Q2 OKR 季度考核" :value="4" />
            <el-option label="2026 Q1 销售团队 KPI 考核" :value="8" />
          </el-select>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-date-picker v-model="meetingForm.meetingTime" type="datetime" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="覆盖部门">
          <el-select v-model="meetingForm.departments" multiple placeholder="选择部门" style="width: 100%">
            <el-option label="技术部" value="技术部" />
            <el-option label="产品部" value="产品部" />
            <el-option label="设计部" value="设计部" />
            <el-option label="运营部" value="运营部" />
            <el-option label="销售部" value="销售部" />
          </el-select>
        </el-form-item>
        <el-form-item label="参会人">
          <el-input v-model="attendeesInput" type="textarea" :rows="3" placeholder="格式：姓名·角色，多个换行分隔" />
        </el-form-item>
        <el-form-item label="会议纪要">
          <el-input v-model="meetingForm.minutes" type="textarea" :rows="3" placeholder="会议完成后填写" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="meetingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMeeting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Right } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDistributionSummary,
  adjustGrade,
  getCalibrationMeetings,
  addCalibrationMeeting,
  updateCalibrationMeeting,
  deleteCalibrationMeeting,
  advanceMeetingStatus,
  getCalibrationRecords
} from '@/api/performanceCalibration'
import { getPerformanceEvaluationList } from '@/api/performanceEvaluation'
import type { CalibrationMeeting, CalibrationRecord } from '@/types/performanceCalibration'
import { MEETING_STATUS_MAP } from '@/types/performanceCalibration'
import type { PerformanceEvaluation } from '@/types/performanceEvaluation'

defineOptions({ name: 'PerformanceCalibration' })

const activeTab = ref<'distribution' | 'cards' | 'meetings' | 'records'>('distribution')
const grades = ['S', 'A', 'B', 'C', 'D'] as const
const cycleId = ref(3)
const currentMeetingId = ref<number | null>(null)

/* ========== 分布看板 ========== */
const summary = ref<any>(null)

const loadDistribution = async () => {
  const res = await getDistributionSummary(cycleId.value)
  summary.value = res.data
}

/* ========== 校准卡 ========== */
const cards = ref<PerformanceEvaluation[]>([])

const groupedCards = computed(() => {
  const grouped: Record<string, PerformanceEvaluation[]> = { S: [], A: [], B: [], C: [], D: [] }
  for (const c of cards.value) {
    const g = c.finalGrade || c.initialGrade
    if (g && grouped[g]) grouped[g].push(c)
  }
  return grouped
})

const loadCards = async () => {
  const res = await getPerformanceEvaluationList({ pageSize: 200, cycleId: cycleId.value })
  cards.value = (res.data?.list || []).filter((e: PerformanceEvaluation) => e.initialGrade)
}

/* ========== 调档 ========== */
const adjustDialogVisible = ref(false)
const adjustTarget = ref<PerformanceEvaluation | null>(null)
const adjustToGrade = ref('')
const adjustReason = ref('')

const openAdjustDialog = (card: PerformanceEvaluation, toGrade: string) => {
  if (card.initialGrade === toGrade && card.finalGrade === toGrade) return
  adjustTarget.value = card
  adjustToGrade.value = toGrade
  adjustReason.value = ''
  adjustDialogVisible.value = true
}

const submitAdjust = async () => {
  if (!adjustTarget.value) return
  if (!adjustReason.value) {
    ElMessage.warning('必须填写调档原因')
    return
  }
  await adjustGrade({
    evaluationId: adjustTarget.value.id,
    employeeName: adjustTarget.value.employeeName,
    departmentName: adjustTarget.value.departmentName,
    originalScore: adjustTarget.value.finalScore || 0,
    beforeGrade: (adjustTarget.value.finalGrade || adjustTarget.value.initialGrade) as any,
    afterGrade: adjustToGrade.value,
    reason: adjustReason.value,
    meetingId: currentMeetingId.value || undefined,
    adjustedBy: '校准人',
    adjustedById: 101
  })
  ElMessage.success('已调档并留痕')
  adjustDialogVisible.value = false
  loadCards()
  loadRecords()
  loadDistribution()
}

/* ========== 会议 ========== */
const meetings = ref<CalibrationMeeting[]>([])

const loadMeetings = async () => {
  const res = await getCalibrationMeetings({ pageSize: 100 })
  meetings.value = res.data?.list || []
}

const meetingDialogVisible = ref(false)
const meetingForm = reactive<Partial<CalibrationMeeting>>({
  id: undefined,
  cycleId: 4,
  cycleName: '',
  title: '',
  meetingTime: '',
  attendees: [],
  departments: [],
  minutes: '',
  status: 'planning'
})
const attendeesInput = ref('')

const openMeetingDialog = (row?: CalibrationMeeting) => {
  if (row) {
    Object.assign(meetingForm, row)
    attendeesInput.value = (row.attendees || []).map((a) => `${a.name}·${a.role}`).join('\n')
  } else {
    meetingForm.id = undefined
    meetingForm.title = ''
    meetingForm.meetingTime = ''
    meetingForm.departments = []
    meetingForm.attendees = []
    meetingForm.minutes = ''
    meetingForm.status = 'planning'
    attendeesInput.value = ''
  }
  meetingDialogVisible.value = true
}

const saveMeeting = async () => {
  meetingForm.attendees = attendeesInput.value
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, idx) => {
      const [name, role] = s.split(/[·・]/).map((x) => x.trim())
      return { id: idx + 1, name: name || s, role: role || '参会人' }
    })
  const cycleMap: Record<number, string> = {
    3: '2026 Q1 OKR 季度考核',
    4: '2026 Q2 OKR 季度考核',
    8: '2026 Q1 销售团队 KPI 考核'
  }
  meetingForm.cycleName = cycleMap[meetingForm.cycleId as number] || ''
  if (meetingForm.id) {
    await updateCalibrationMeeting(meetingForm)
    ElMessage.success('已更新')
  } else {
    const now = new Date()
    meetingForm.meetingNo = `CALMTG${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`
    await addCalibrationMeeting(meetingForm)
    ElMessage.success('已新建')
  }
  meetingDialogVisible.value = false
  loadMeetings()
}

const viewMeeting = (row: CalibrationMeeting) => {
  openMeetingDialog(row)
}

const advanceMeeting = async (row: CalibrationMeeting) => {
  await advanceMeetingStatus(row.id)
  ElMessage.success('已推进')
  loadMeetings()
}

const deleteMeetingItem = async (row: CalibrationMeeting) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.title}」？`, '确认', { type: 'warning' })
    await deleteCalibrationMeeting(row.id)
    ElMessage.success('已删除')
    loadMeetings()
  } catch {}
}

/* ========== 调档日志 ========== */
const records = ref<CalibrationRecord[]>([])

const loadRecords = async () => {
  const res = await getCalibrationRecords({ pageSize: 200 })
  records.value = (res.data?.list || []).sort((a: CalibrationRecord, b: CalibrationRecord) =>
    b.adjustTime.localeCompare(a.adjustTime)
  )
}

onMounted(() => {
  loadDistribution()
  loadCards()
  loadMeetings()
  loadRecords()
})
</script>

<style scoped lang="scss">
.perf-calib-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calib-tabs {
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
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.filter-card,
.dist-card,
.dept-card,
.cards-card,
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

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;

  .sub-hint {
    font-weight: normal;
    font-size: 12px;
    color: #909399;
    margin-left: 8px;
  }
}

.distribution-compare {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .dist-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .dist-row-label {
      width: 50px;
      font-size: 13px;
      color: #606266;
    }
  }
}

.dist-bar {
  flex: 1;
  display: flex;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;

  &.small {
    height: 22px;
  }

  .dist-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    min-width: 0;

    &.target {
      opacity: 0.5;
    }
  }
}

.cards-hint {
  padding: 10px 14px;
  background: #ecf5ff;
  border-radius: 6px;
  font-size: 13px;
  color: #409eff;
  margin-bottom: 16px;
}

.grade-columns {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.grade-col {
  background: #fafbfc;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .grade-col-header {
    padding: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;

    .grade-label {
      font-size: 18px;
      font-weight: 700;
    }

    .grade-count {
      font-size: 13px;
    }

    .grade-target {
      margin-left: auto;
      font-size: 11px;
      opacity: 0.85;
    }
  }

  .grade-col-body {
    padding: 10px;
    flex: 1;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.emp-card {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  .emp-name {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .emp-dept {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  .emp-score {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 12px;
    color: #606266;
  }

  .grade-buttons {
    margin-top: 8px;
    display: flex;
    gap: 4px;

    .gbtn {
      flex: 1;
      padding: 0;
      min-width: 0;
      font-weight: 700;
    }
  }
}

.table-header {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.muted {
  color: #909399;
}

/* 等级配色 */
.grade-S,
:deep(.gbtn.grade-S) {
  background: #67c23a !important;
  color: #fff !important;
  border: none !important;
}
.grade-A,
:deep(.gbtn.grade-A) {
  background: #409eff !important;
  color: #fff !important;
  border: none !important;
}
.grade-B,
:deep(.gbtn.grade-B) {
  background: #909399 !important;
  color: #fff !important;
  border: none !important;
}
.grade-C,
:deep(.gbtn.grade-C) {
  background: #e6a23c !important;
  color: #fff !important;
  border: none !important;
}
.grade-D,
:deep(.gbtn.grade-D) {
  background: #f56c6c !important;
  color: #fff !important;
  border: none !important;
}

.gbtn.is-plain {
  opacity: 0.55;
}
</style>
