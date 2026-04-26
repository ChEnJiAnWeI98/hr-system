<template>
  <div class="pip-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">PIP 总数</div>
        <div class="kpi-value">{{ stats.total || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">进行中</div>
        <div class="kpi-value" style="color: #409eff">{{ stats.inProgress || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">延期</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.extendedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">通过数</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.passedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">未通过</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.failedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">通过率</div>
        <div class="kpi-value">{{ stats.passRate || 0 }}%</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="员工">
          <el-input v-model="filters.employeeName" placeholder="姓名" style="width: 160px" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" style="width: 140px" clearable>
            <el-option v-for="(s, k) in PIP_STATUS_MAP" :key="k" :label="s.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon>
            HR 发起 PIP
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- PIP 列表 -->
    <el-card class="data-card">
      <el-table :data="filteredPIPs" stripe>
        <el-table-column prop="pipNo" label="PIP 编号" width="170" />
        <el-table-column prop="employeeName" label="员工" width="100" />
        <el-table-column prop="departmentName" label="部门" width="110" />
        <el-table-column prop="positionName" label="岗位" width="130" />
        <el-table-column prop="startDate" label="启动日" width="120" />
        <el-table-column prop="expectedEndDate" label="预计结束" width="120" />
        <el-table-column label="改进目标" width="100" align="center">
          <template #default="{ row }">{{ (row.goals || []).length }} 项</template>
        </el-table-column>
        <el-table-column label="整体进度" width="180">
          <template #default="{ row }">
            <el-progress :percentage="avgGoalProgress(row)" :stroke-width="10" :color="progressColor(avgGoalProgress(row))" />
          </template>
        </el-table-column>
        <el-table-column label="签署" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="SIGN_STATUS_MAP[row.signStatus].type" size="small">
              {{ SIGN_STATUS_MAP[row.signStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="PIP_STATUS_MAP[row.status].type" size="small">
              {{ PIP_STATUS_MAP[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最终结果" width="160" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.result" :type="PIP_RESULT_MAP[row.result].type" size="small">
              {{ PIP_RESULT_MAP[row.result].label }}
            </el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewPIP(row)">详情</el-button>
            <el-button v-if="row.signStatus === 'not_signed'" link type="warning" @click="handleSign(row, true)">员工签署</el-button>
            <el-button v-if="row.status === 'in_progress'" link @click="openWeeklyDialog(row)">周跟踪</el-button>
            <el-button v-if="row.status === 'in_progress'" link @click="openMonthlyDialog(row)">月评估</el-button>
            <el-button v-if="row.status === 'in_progress' || row.status === 'extended'" link type="success" @click="openFinalizeDialog(row)">判定结果</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发起 PIP 弹窗 -->
    <el-dialog v-model="createVisible" title="HR 发起 PIP" width="680px" top="5vh">
      <el-scrollbar max-height="70vh">
        <el-form :model="createForm" label-width="120px">
          <el-form-item label="员工">
            <el-input v-model="createForm.employeeName" />
          </el-form-item>
          <el-form-item label="员工 ID">
            <el-input v-model.number="createForm.employeeId" />
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="createForm.departmentName" />
          </el-form-item>
          <el-form-item label="岗位">
            <el-input v-model="createForm.positionName" />
          </el-form-item>
          <el-form-item label="启动原因">
            <el-input v-model="createForm.initiatedReason" type="textarea" :rows="2" placeholder="关联评估结果 / 绩效事件" />
          </el-form-item>
          <el-form-item label="启动日期">
            <el-date-picker v-model="createForm.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" @change="onStartDateChange" />
          </el-form-item>
          <el-form-item label="预计结束">
            <el-input v-model="createForm.expectedEndDate" disabled />
          </el-form-item>
          <el-form-item label="直属上级">
            <el-input v-model="createForm.leaderName" />
          </el-form-item>
          <el-divider>改进目标（3~5 个）</el-divider>
          <div v-for="(g, idx) in createForm.goals" :key="idx" class="goal-row">
            <el-input v-model="g.description" placeholder="目标描述" style="flex: 2" />
            <el-input v-model="g.criteria" placeholder="可衡量标准" style="flex: 2; margin-left: 6px" />
            <el-input v-model="g.deadline" placeholder="截止日" style="width: 150px; margin-left: 6px" />
            <el-button link type="danger" @click="removeGoal(idx)">删除</el-button>
          </div>
          <el-button plain type="primary" size="small" @click="addGoal">+ 添加目标</el-button>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">发起（待员工签署）</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="viewVisible" :title="viewData?.pipNo || 'PIP 详情'" width="900px" top="4vh">
      <el-scrollbar v-if="viewData" max-height="72vh">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="员工">{{ viewData.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ viewData.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="岗位">{{ viewData.positionName }}</el-descriptions-item>
          <el-descriptions-item label="启动日">{{ viewData.startDate }}</el-descriptions-item>
          <el-descriptions-item label="预计结束">{{ viewData.expectedEndDate }}</el-descriptions-item>
          <el-descriptions-item label="实际结束">{{ viewData.actualEndDate || '—' }}</el-descriptions-item>
          <el-descriptions-item label="HR">{{ viewData.hrName }}</el-descriptions-item>
          <el-descriptions-item label="直属上级">{{ viewData.leaderName }}</el-descriptions-item>
          <el-descriptions-item label="签署">
            <el-tag :type="SIGN_STATUS_MAP[viewData.signStatus].type" size="small">{{ SIGN_STATUS_MAP[viewData.signStatus].label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启动原因" :span="3">{{ viewData.initiatedReason }}</el-descriptions-item>
          <el-descriptions-item v-if="viewData.result" label="最终结果" :span="3">
            <el-tag :type="PIP_RESULT_MAP[viewData.result].type">{{ PIP_RESULT_MAP[viewData.result].label }}</el-tag>
            <div class="muted" style="margin-top: 6px">{{ viewData.resultReason }}</div>
          </el-descriptions-item>
        </el-descriptions>

        <div class="section-title">改进目标</div>
        <el-table :data="viewData.goals" size="small" border>
          <el-table-column prop="order" label="#" width="50" align="center" />
          <el-table-column prop="description" label="目标" min-width="200" />
          <el-table-column prop="criteria" label="可衡量标准" min-width="220" />
          <el-table-column prop="deadline" label="截止日" width="120" />
          <el-table-column label="进度" width="180">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :stroke-width="8" :color="progressColor(row.progress)" />
            </template>
          </el-table-column>
        </el-table>

        <div class="section-title">周跟踪（共 {{ getWeeklyFor(viewData.id).length }} 条）</div>
        <el-table :data="getWeeklyFor(viewData.id)" size="small" stripe>
          <el-table-column label="周次" width="80" align="center">
            <template #default="{ row }">第 {{ row.week }} 周</template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="170" />
          <el-table-column prop="employeeUpdate" label="员工更新" min-width="220" show-overflow-tooltip />
          <el-table-column prop="leaderFeedback" label="上级反馈" min-width="220" show-overflow-tooltip />
        </el-table>

        <div class="section-title">月度评估（共 {{ getMonthlyFor(viewData.id).length }} 次）</div>
        <el-table :data="getMonthlyFor(viewData.id)" size="small" stripe>
          <el-table-column label="月份" width="80" align="center">
            <template #default="{ row }">第 {{ row.month }} 月</template>
          </el-table-column>
          <el-table-column label="评估结果" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="MONTHLY_RESULT_MAP[row.result].type" size="small">
                {{ MONTHLY_RESULT_MAP[row.result].label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="上级评价" min-width="220" />
          <el-table-column prop="hrComment" label="HR 意见" min-width="180" />
          <el-table-column prop="reviewTime" label="评估时间" width="170" />
        </el-table>
      </el-scrollbar>
      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 周跟踪弹窗 -->
    <el-dialog v-model="weeklyVisible" title="提交周跟踪" width="640px">
      <el-form v-if="weeklyTarget" :model="weeklyForm" label-width="120px">
        <el-form-item label="周次">
          <el-input v-model.number="weeklyForm.week" placeholder="第几周（1~13）" />
        </el-form-item>
        <el-form-item label="员工本周更新">
          <el-input v-model="weeklyForm.employeeUpdate" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="上级本周反馈">
          <el-input v-model="weeklyForm.leaderFeedback" type="textarea" :rows="3" />
        </el-form-item>
        <el-divider>各目标当前进度</el-divider>
        <el-form-item v-for="g in weeklyTarget.goals" :key="g.order" :label="`目标 ${g.order}`">
          <el-slider v-model="weeklyForm.goalProgress[g.order]" :min="0" :max="100" show-input :show-input-controls="false" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="weeklyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitWeekly">提交</el-button>
      </template>
    </el-dialog>

    <!-- 月评估弹窗 -->
    <el-dialog v-model="monthlyVisible" title="提交月度评估" width="520px">
      <el-form :model="monthlyForm" label-width="100px">
        <el-form-item label="评估月份">
          <el-select v-model="monthlyForm.month" style="width: 100%">
            <el-option label="第 1 月" :value="1" />
            <el-option label="第 2 月" :value="2" />
            <el-option label="第 3 月" :value="3" />
            <el-option label="第 4 月（延期）" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="结果">
          <el-radio-group v-model="monthlyForm.result">
            <el-radio value="above_expected">超预期</el-radio>
            <el-radio value="meet_expected">达预期</el-radio>
            <el-radio value="below_expected">低于预期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级评价">
          <el-input v-model="monthlyForm.comment" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="HR 意见">
          <el-input v-model="monthlyForm.hrComment" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="monthlyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMonthly">提交</el-button>
      </template>
    </el-dialog>

    <!-- 判定结果弹窗 -->
    <el-dialog v-model="finalizeVisible" title="判定 PIP 结果" width="520px">
      <el-form :model="finalizeForm" label-width="100px">
        <el-form-item label="结果">
          <el-radio-group v-model="finalizeForm.result">
            <el-radio value="passed">通过（回归正常）</el-radio>
            <el-radio value="extended">延期 1 个月</el-radio>
            <el-radio value="failed">未通过（进入离职）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="判定理由">
          <el-input v-model="finalizeForm.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="finalizeVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFinalize">确认判定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPIPList,
  addPIP,
  signPIP,
  getPIPWeeklyList,
  getPIPMonthlyList,
  submitWeeklyTrack,
  submitMonthlyReview,
  finalizePIP,
  getPIPStats
} from '@/api/performancePIP'
import type {
  PerformancePIP,
  PIPWeeklyTrack,
  PIPMonthlyReview,
  PIPGoalItem
} from '@/types/performancePIP'
import {
  PIP_STATUS_MAP,
  PIP_RESULT_MAP,
  SIGN_STATUS_MAP,
  MONTHLY_RESULT_MAP
} from '@/types/performancePIP'

defineOptions({ name: 'PerformancePIP' })

const filters = reactive({
  employeeName: '',
  status: '' as string
})

const pips = ref<PerformancePIP[]>([])
const weeklys = ref<PIPWeeklyTrack[]>([])
const monthlys = ref<PIPMonthlyReview[]>([])
const stats = ref<any>({})

const filteredPIPs = computed(() =>
  pips.value.filter(
    (p) =>
      (!filters.employeeName || p.employeeName.includes(filters.employeeName)) &&
      (!filters.status || p.status === filters.status)
  )
)

const loadAll = async () => {
  const pr = await getPIPList({ pageSize: 100 })
  pips.value = pr.data?.list || []
  const wr = await getPIPWeeklyList({ pageSize: 200 })
  weeklys.value = wr.data?.list || []
  const mr = await getPIPMonthlyList({ pageSize: 200 })
  monthlys.value = mr.data?.list || []
  const s = await getPIPStats()
  stats.value = s.data
}

const avgGoalProgress = (p: PerformancePIP): number => {
  if (!p.goals || p.goals.length === 0) return 0
  return Math.round(p.goals.reduce((s, g) => s + (g.progress || 0), 0) / p.goals.length)
}

const getWeeklyFor = (pipId: number) =>
  weeklys.value.filter((w) => w.pipId === pipId).sort((a, b) => a.week - b.week)

const getMonthlyFor = (pipId: number) =>
  monthlys.value.filter((m) => m.pipId === pipId).sort((a, b) => a.month - b.month)

const progressColor = (p: number): string => {
  if (p >= 80) return '#67c23a'
  if (p >= 50) return '#409eff'
  if (p >= 30) return '#e6a23c'
  return '#f56c6c'
}

/* ========== 发起 PIP ========== */
const createVisible = ref(false)
const createForm = reactive({
  employeeId: 0,
  employeeName: '',
  departmentName: '',
  positionName: '',
  initiatedReason: '',
  startDate: '',
  expectedEndDate: '',
  leaderId: 101,
  leaderName: '直属上级',
  goals: [] as Partial<PIPGoalItem>[]
})

const openCreateDialog = () => {
  Object.assign(createForm, {
    employeeId: 0, employeeName: '', departmentName: '', positionName: '',
    initiatedReason: '', startDate: '', expectedEndDate: '',
    leaderId: 101, leaderName: '直属上级',
    goals: [
      { description: '', criteria: '', deadline: '', progress: 0 },
      { description: '', criteria: '', deadline: '', progress: 0 },
      { description: '', criteria: '', deadline: '', progress: 0 }
    ]
  })
  createVisible.value = true
}

const onStartDateChange = (v: string) => {
  if (!v) return
  const d = new Date(v)
  d.setMonth(d.getMonth() + 3)
  createForm.expectedEndDate = d.toISOString().slice(0, 10)
}

const addGoal = () => {
  createForm.goals.push({ description: '', criteria: '', deadline: '', progress: 0 })
}
const removeGoal = (idx: number) => {
  createForm.goals.splice(idx, 1)
}

const submitCreate = async () => {
  if (!createForm.employeeName) {
    ElMessage.warning('请填写员工')
    return
  }
  const now = new Date()
  const no = `PIP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`
  await addPIP({
    pipNo: no,
    employeeId: createForm.employeeId,
    employeeName: createForm.employeeName,
    departmentName: createForm.departmentName,
    positionName: createForm.positionName,
    initiatedReason: createForm.initiatedReason,
    startDate: createForm.startDate,
    expectedEndDate: createForm.expectedEndDate,
    goals: createForm.goals.filter((g) => g.description).map((g, idx) => ({ order: idx + 1, description: g.description!, criteria: g.criteria || '', deadline: g.deadline || '', progress: 0 })),
    hrId: 3,
    hrName: '张HR',
    leaderId: createForm.leaderId,
    leaderName: createForm.leaderName,
    signStatus: 'not_signed',
    status: 'planning'
  } as any)
  ElMessage.success('PIP 已发起，等待员工签署')
  createVisible.value = false
  loadAll()
}

/* ========== 签署 ========== */
const handleSign = async (row: PerformancePIP, signed: boolean) => {
  try {
    const msg = signed ? `确定员工「${row.employeeName}」已签署《改进计划书》？` : '请输入拒签原因'
    if (signed) {
      await ElMessageBox.confirm(msg, '员工签署', { type: 'info' })
      await signPIP(row.id, true)
      ElMessage.success('已签署，PIP 开始进行')
    } else {
      const { value } = await ElMessageBox.prompt(msg, '拒签', {
        inputValidator: (v) => (v && v.trim() ? true : '必填')
      })
      await signPIP(row.id, false, value)
      ElMessage.warning('已记录拒签，HRBP 介入协商')
    }
    loadAll()
  } catch {}
}

/* ========== 详情 ========== */
const viewVisible = ref(false)
const viewData = ref<PerformancePIP | null>(null)
const viewPIP = (row: PerformancePIP) => {
  viewData.value = row
  viewVisible.value = true
}

/* ========== 周跟踪 ========== */
const weeklyVisible = ref(false)
const weeklyTarget = ref<PerformancePIP | null>(null)
const weeklyForm = reactive({
  week: 1,
  employeeUpdate: '',
  leaderFeedback: '',
  goalProgress: {} as Record<number, number>
})

const openWeeklyDialog = (row: PerformancePIP) => {
  weeklyTarget.value = row
  const existingWeeks = weeklys.value.filter((w) => w.pipId === row.id).length
  weeklyForm.week = existingWeeks + 1
  weeklyForm.employeeUpdate = ''
  weeklyForm.leaderFeedback = ''
  weeklyForm.goalProgress = {}
  for (const g of row.goals || []) {
    weeklyForm.goalProgress[g.order] = g.progress || 0
  }
  weeklyVisible.value = true
}

const submitWeekly = async () => {
  if (!weeklyTarget.value) return
  await submitWeeklyTrack(weeklyTarget.value.id, {
    week: weeklyForm.week,
    employeeUpdate: weeklyForm.employeeUpdate,
    leaderFeedback: weeklyForm.leaderFeedback,
    goalProgress: weeklyForm.goalProgress
  })
  ElMessage.success('周跟踪已提交')
  weeklyVisible.value = false
  loadAll()
}

/* ========== 月评估 ========== */
const monthlyVisible = ref(false)
const monthlyTarget = ref<PerformancePIP | null>(null)
const monthlyForm = reactive({
  month: 1,
  result: 'meet_expected' as any,
  comment: '',
  hrComment: ''
})

const openMonthlyDialog = (row: PerformancePIP) => {
  monthlyTarget.value = row
  const existing = monthlys.value.filter((m) => m.pipId === row.id).length
  monthlyForm.month = Math.min(existing + 1, 4)
  monthlyForm.result = 'meet_expected'
  monthlyForm.comment = ''
  monthlyForm.hrComment = ''
  monthlyVisible.value = true
}

const submitMonthly = async () => {
  if (!monthlyTarget.value) return
  await submitMonthlyReview(
    monthlyTarget.value.id,
    monthlyForm.month,
    monthlyForm.result,
    monthlyForm.comment,
    monthlyForm.hrComment
  )
  ElMessage.success('月评估已提交')
  monthlyVisible.value = false
  loadAll()
}

/* ========== 判定结果 ========== */
const finalizeVisible = ref(false)
const finalizeTarget = ref<PerformancePIP | null>(null)
const finalizeForm = reactive({
  result: 'passed' as 'passed' | 'extended' | 'failed',
  reason: ''
})

const openFinalizeDialog = (row: PerformancePIP) => {
  finalizeTarget.value = row
  finalizeForm.result = 'passed'
  finalizeForm.reason = ''
  finalizeVisible.value = true
}

const submitFinalize = async () => {
  if (!finalizeTarget.value) return
  if (!finalizeForm.reason) {
    ElMessage.warning('请填写判定理由')
    return
  }
  if (finalizeForm.result === 'failed') {
    try {
      await ElMessageBox.confirm('未通过将启动离职流程，此操作需 HRD 和法务审核，确定吗？', '确认', { type: 'warning' })
    } catch {
      return
    }
  }
  await finalizePIP(finalizeTarget.value.id, finalizeForm.result, finalizeForm.reason)
  ElMessage.success('结果已判定')
  finalizeVisible.value = false
  loadAll()
}

onMounted(() => loadAll())
</script>

<style scoped lang="scss">
.pip-container {
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

.goal-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 18px 0 10px;
}

.muted {
  color: #909399;
  font-size: 12px;
}
</style>
