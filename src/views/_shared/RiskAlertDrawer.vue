<template>
  <el-drawer
    v-model="visible"
    :size="800"
    direction="rtl"
    :show-close="false"
    @open="handleOpen"
  >
    <template #header>
      <div class="drawer-header">
        <div class="drawer-title">
          <el-icon class="title-icon"><Warning /></el-icon>
          高风险员工预警 · AI 分析
        </div>
        <el-button text @click="visible = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </template>

    <div v-loading="loading" class="drawer-body">
      <!-- 合规标注条 -->
      <div class="compliance-strip">
        <el-icon><WarningFilled /></el-icon>
        <span>
          仅用 HR 系统已授权数据；不监控 IM / 邮件 / 代码；不做心理诊断；仅作 HR 关怀触发参考。
        </span>
      </div>

      <!-- 扫描范围摘要 -->
      <div v-if="result" class="scope-card">
        <div class="scope-row">
          <span class="scope-label">扫描范围：</span>
          <span class="scope-value">{{ result.scope }}</span>
        </div>
        <div class="scope-row">
          <span class="scope-label">数据窗口：</span>
          <span class="scope-value">{{ result.dataWindow }}</span>
        </div>
        <div class="scope-row">
          <span class="scope-label">快照生成：</span>
          <span class="scope-value">{{ result.meta.snapshotTime }}</span>
          <el-tag
            size="small"
            :type="freshnessTagType"
            effect="plain"
            class="freshness-tag"
          >
            {{ freshnessLabel }}
          </el-tag>
          <el-tag size="small" type="info" effect="plain" class="reason-tag">
            {{ RECOMPUTE_REASON_LABEL[result.meta.lastRecomputeReason] }}
          </el-tag>
        </div>
        <div class="scope-row">
          <span class="scope-label">下次重算：</span>
          <span class="scope-value">{{ result.meta.nextScheduledRun }} · 每日 03:00 例行</span>
        </div>
        <el-collapse class="data-source-collapse">
          <el-collapse-item name="src">
            <template #title>
              <span class="data-source-title">信号源声明（{{ result.dataSources.length }} 项）</span>
            </template>
            <ul class="data-source-list">
              <li v-for="(src, idx) in result.dataSources" :key="idx">{{ src }}</li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 风险摘要统计 -->
      <div v-if="result" class="risk-summary">
        <div class="summary-stat">
          <div class="stat-num">{{ result.meta.totalScanned }}</div>
          <div class="stat-label">扫描人数</div>
        </div>
        <div class="summary-stat danger">
          <div class="stat-num">{{ result.meta.highRiskCount }}</div>
          <div class="stat-label">高风险</div>
        </div>
        <div class="summary-stat warning">
          <div class="stat-num">{{ result.meta.mediumRiskCount }}</div>
          <div class="stat-label">中风险</div>
        </div>
        <div class="summary-stat info">
          <div class="stat-num">{{ result.meta.lowRiskCount }}</div>
          <div class="stat-label">低风险</div>
        </div>
      </div>

      <!-- 主区：左列右详 -->
      <div v-if="result" class="main-area">
        <!-- 左：员工列表 -->
        <div class="employee-list">
          <div
            v-for="emp in displayEmployees"
            :key="emp.employeeId"
            class="employee-row"
            :class="{ active: selectedEmpId === emp.employeeId }"
            @click="selectedEmpId = emp.employeeId"
          >
            <div class="emp-row-top">
              <span class="emp-name">{{ emp.name }}</span>
              <el-tag size="small" :type="RISK_LEVEL_TYPE[emp.riskLevel]">
                {{ RISK_LEVEL_LABEL[emp.riskLevel] }}
              </el-tag>
            </div>
            <div class="emp-row-meta">{{ emp.department }} · {{ emp.level || '-' }}</div>
            <div class="emp-row-status">
              <el-tag v-if="getFollowUpStatus(emp.employeeId) === 'reviewed'" size="small" type="success" effect="plain">
                已跟进
              </el-tag>
              <el-tag v-if="isInFocusList(emp.employeeId)" size="small" type="warning" effect="plain">
                关注中
              </el-tag>
              <el-tag v-if="isSnoozed(emp.employeeId)" size="small" type="info" effect="plain">
                已忽略
              </el-tag>
            </div>
          </div>
          <div v-if="displayEmployees.length === 0" class="emp-list-empty">
            没有需要关注的员工
          </div>
        </div>

        <!-- 右：详情 -->
        <div class="employee-detail">
          <template v-if="selectedEmployee">
            <!-- 详情 Header -->
            <div class="detail-header">
              <div class="detail-name">{{ selectedEmployee.name }}</div>
              <div class="detail-meta">
                <span>{{ selectedEmployee.department }}</span>
                <span class="dot">·</span>
                <span>{{ selectedEmployee.level || '-' }}</span>
                <span class="dot">·</span>
                <span>司龄 {{ selectedEmployee.tenure }}</span>
                <el-tag :type="RISK_LEVEL_TYPE[selectedEmployee.riskLevel]" style="margin-left: 12px">
                  {{ RISK_LEVEL_LABEL[selectedEmployee.riskLevel] }}
                </el-tag>
              </div>
            </div>

            <!-- AI 一段话观察 -->
            <div class="ai-observation">
              <div class="observation-header">
                <el-icon class="observation-icon"><ArtAiIcon /></el-icon>
                <span>AI 观察（仅描述事实，不下结论）</span>
              </div>
              <div class="observation-text">{{ selectedEmployee.aiObservation }}</div>
            </div>

            <!-- Key Drivers -->
            <div class="section-block">
              <div class="section-title">关键风险因素（Top {{ selectedEmployee.keyDrivers.length }}）</div>
              <div class="key-drivers">
                <el-tag
                  v-for="(d, idx) in selectedEmployee.keyDrivers"
                  :key="idx"
                  type="warning"
                  effect="plain"
                  class="driver-tag"
                >
                  {{ d }}
                </el-tag>
              </div>
            </div>

            <!-- 信号变化清单 -->
            <div class="section-block">
              <div class="section-title">信号变化清单（HR 域已授权数据）</div>
              <div class="signal-list">
                <div
                  v-for="(sig, idx) in selectedEmployee.signalChanges"
                  :key="idx"
                  class="signal-card"
                  :class="`flag-${sig.flag}`"
                >
                  <div class="signal-card-top">
                    <span class="signal-name">{{ sig.name }}</span>
                    <el-tag size="small" :type="SIGNAL_FLAG_TYPE[sig.flag]" effect="plain">
                      {{ getFlagLabel(sig.flag) }}
                    </el-tag>
                  </div>
                  <div class="signal-variance">
                    <span class="signal-current">{{ sig.current }}</span>
                    <span class="signal-arrow">←</span>
                    <span class="signal-baseline">{{ sig.baseline }}</span>
                  </div>
                  <div class="signal-meta">
                    <span class="signal-source">{{ RISK_SIGNAL_SOURCE_LABEL[sig.source] }}</span>
                    <span class="dot">·</span>
                    <span>{{ sig.window }}</span>
                  </div>
                  <div class="signal-tag">{{ sig.variance }}</div>
                </div>
              </div>
            </div>

            <!-- 4 个 inline 操作 -->
            <div class="inline-actions">
              <el-button
                type="primary"
                :icon="ChatLineRound"
                :disabled="getFollowUpStatus(selectedEmployee.employeeId) === 'one_on_one_scheduled'"
                @click="handleScheduleOneOnOne(selectedEmployee)"
              >
                {{
                  getFollowUpStatus(selectedEmployee.employeeId) === 'one_on_one_scheduled'
                    ? '已发起 1on1'
                    : '发起 1on1'
                }}
              </el-button>
              <el-button
                :icon="Check"
                :disabled="getFollowUpStatus(selectedEmployee.employeeId) === 'reviewed'"
                @click="handleMarkReviewed(selectedEmployee)"
              >
                {{
                  getFollowUpStatus(selectedEmployee.employeeId) === 'reviewed'
                    ? '已跟进'
                    : '标记已跟进'
                }}
              </el-button>
              <el-button
                :icon="Star"
                :disabled="isInFocusList(selectedEmployee.employeeId)"
                @click="handleAddToFocus(selectedEmployee)"
              >
                {{ isInFocusList(selectedEmployee.employeeId) ? '已加入关注' : '加入关注列表' }}
              </el-button>
              <el-button
                :icon="Clock"
                :disabled="isSnoozed(selectedEmployee.employeeId)"
                @click="handleSnooze(selectedEmployee)"
              >
                {{ isSnoozed(selectedEmployee.employeeId) ? '已忽略' : '暂时忽略 30 天' }}
              </el-button>
            </div>
          </template>
          <div v-else class="detail-empty">
            <el-icon><Warning /></el-icon>
            <span>选择左侧员工查看详情</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <span class="footer-hint">
          风险预警仅作 HR 关怀触发参考，<strong>不可作为考核 / 裁员依据</strong>。
        </span>
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 首次使用合规声明 Modal -->
  <el-dialog
    v-model="complianceVisible"
    title="AI 风险预警合规声明"
    width="560px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
  >
    <div class="compliance-modal">
      <p class="compliance-intro">
        本能力使用 AI 辅助 HR 识别可能离职的员工，使用前请阅读以下声明：
      </p>
      <ul class="compliance-list">
        <li>
          <strong>数据源</strong>：仅使用 HR 系统已授权数据（OKR 系统 / 360 评估 / 员工档案 / 薪酬系统 / 出勤系统 / 绩效历史）。
        </li>
        <li>
          <strong>不做监控</strong>：<em>不</em>读取员工 IM / 邮件 / 代码 / 浏览器历史等行为数据。
        </li>
        <li>
          <strong>不做心理诊断</strong>：AI 不输出"心理波动 / 抑郁倾向"等心理类标签，<em>不</em>给出心理干预建议。
        </li>
        <li>
          <strong>预测目标单一</strong>：仅预测"未来 4~8 周内主动离职可能性"，<em>不</em>外延到绩效下滑等其他维度。
        </li>
        <li>
          <strong>仅作参考</strong>：AI 输出仅供 HR 关怀触发参考，<strong>不可作为考核、调薪、裁员依据</strong>。
        </li>
        <li>
          <strong>员工告知</strong>：HR 应在系统告知员工"将基于 HR 数据做风险分析"（《个人信息保护法》第 24 条要求）。
        </li>
      </ul>
      <el-checkbox v-model="acknowledged" class="compliance-check">
        我已知悉以上声明，承诺仅在合规范围内使用本能力
      </el-checkbox>
    </div>
    <template #footer>
      <el-button @click="handleComplianceCancel">取消</el-button>
      <el-button type="primary" :disabled="!acknowledged" @click="handleComplianceConfirm">
        我已知悉
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Warning,
  WarningFilled,
  Close,
  ChatLineRound,
  Check,
  Star,
  Clock
} from '@element-plus/icons-vue'
import {
  RISK_LEVEL_LABEL,
  RISK_LEVEL_TYPE,
  RISK_SIGNAL_SOURCE_LABEL,
  SIGNAL_FLAG_TYPE,
  RECOMPUTE_REASON_LABEL
} from '@/types/performanceAI'
import type {
  RiskAlertResult,
  RiskAlertEmployee,
  RiskFollowUpStatus,
  RecomputeReason
} from '@/types/performanceAI'
import { invokeAIAbility } from '@/api/performanceAI'

interface Props {
  modelValue: boolean
  /** 扫描范围（来自父页面筛选条件，可选 - 不传用 mock 默认）*/
  scopeHint?: string
  /** 触发原因（push 例外：盘点会议触发时为 'meeting_created'，否则默认 daily_03）*/
  triggerReason?: RecomputeReason
}

const props = withDefaults(defineProps<Props>(), {
  scopeHint: '',
  triggerReason: undefined
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>()

const router = useRouter()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const result = ref<RiskAlertResult | null>(null)
const selectedEmpId = ref<number | null>(null)

/* ============ 合规声明 Modal ============ */
const COMPLIANCE_KEY = 'hr_risk_alert_acknowledged_v2'
const complianceVisible = ref(false)
const acknowledged = ref(false)
const pendingFetch = ref(false)

const handleOpen = () => {
  // 已确认过 → 直接拉数据
  if (localStorage.getItem(COMPLIANCE_KEY) === '1') {
    fetchRiskAlert()
  } else {
    // 未确认 → 弹合规声明
    complianceVisible.value = true
    pendingFetch.value = true
  }
}

const handleComplianceConfirm = () => {
  localStorage.setItem(COMPLIANCE_KEY, '1')
  complianceVisible.value = false
  if (pendingFetch.value) {
    pendingFetch.value = false
    fetchRiskAlert()
  }
}

const handleComplianceCancel = () => {
  complianceVisible.value = false
  acknowledged.value = false
  pendingFetch.value = false
  visible.value = false
  ElMessage.info('已取消，需阅读合规声明后才能使用本能力')
}

/* ============ 拉取数据 ============ */
const fetchRiskAlert = async () => {
  loading.value = true
  try {
    const scopeText = props.scopeHint || '当前筛选条件下的员工，近 8 周数据'
    const res: any = await invokeAIAbility('risk_alert', scopeText, 'HR-Lisa')
    const payload = res?.data
    if (payload?.structured) {
      // 后处理校验：拦截违禁关键词（防 LLM 越界）
      const safeResult = sanitizeResult(payload.structured as RiskAlertResult)
      // push 例外：HR 创建盘点会议时立刻跑 → 标记触发原因 + 快照时间设为现在
      if (props.triggerReason === 'meeting_created') {
        const now = new Date()
        const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000)
        const fmt = (d: Date) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 03:00:00`
        safeResult.meta = {
          ...safeResult.meta,
          lastRecomputeReason: 'meeting_created',
          snapshotTime: now.toLocaleString('zh-CN').replace(/\//g, '-'),
          nextScheduledRun: fmt(tomorrow)
        }
      }
      result.value = safeResult
      // 默认选中第一位（排序最高风险）
      selectedEmpId.value = safeResult.employees[0]?.employeeId ?? null
    }
  } catch (err) {
    ElMessage.error('AI 风险分析失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/* ============ 后处理校验：拦截违禁关键词 ============ */
const FORBIDDEN_KEYWORDS = [
  '心理波动',
  '抑郁',
  '情绪异常',
  '心理异常',
  'EAP',
  '心理干预',
  '心理问题',
  '建议邀约',
  '建议干预'
]

const sanitizeText = (text: string): string => {
  let safe = text
  FORBIDDEN_KEYWORDS.forEach((kw) => {
    if (safe.includes(kw)) {
      // eslint-disable-next-line no-console
      console.warn(`[risk_alert] 拦截违禁关键词：${kw}`)
      safe = safe.replace(new RegExp(kw, 'g'), '[已拦截]')
    }
  })
  return safe
}

const sanitizeResult = (raw: RiskAlertResult): RiskAlertResult => {
  return {
    ...raw,
    employees: raw.employees.map((e) => ({
      ...e,
      aiObservation: sanitizeText(e.aiObservation),
      keyDrivers: e.keyDrivers.map(sanitizeText)
    }))
  }
}

/* ============ 快照新鲜度（业界标准：> 3 天 黄 / > 7 天 红）============ */
const freshnessDays = computed(() => {
  if (!result.value) return 0
  const snapshot = new Date(result.value.meta.snapshotTime.replace(/-/g, '/'))
  const now = new Date()
  return Math.floor((now.getTime() - snapshot.getTime()) / (24 * 3600 * 1000))
})

const freshnessLabel = computed(() => {
  const d = freshnessDays.value
  if (d <= 0) return '今日生成'
  if (d === 1) return '1 天前'
  return `${d} 天前`
})

const freshnessTagType = computed<'success' | 'warning' | 'danger'>(() => {
  const d = freshnessDays.value
  if (d <= 1) return 'success'
  if (d <= 7) return 'warning'
  return 'danger'
})

/* ============ 显示员工：过滤已 Snooze 的 ============ */
const displayEmployees = computed(() => {
  if (!result.value) return []
  return result.value.employees.filter((e) => !isSnoozed(e.employeeId))
})

const selectedEmployee = computed<RiskAlertEmployee | null>(() => {
  if (!result.value || selectedEmpId.value == null) return null
  return result.value.employees.find((e) => e.employeeId === selectedEmpId.value) ?? null
})

watch(displayEmployees, (list) => {
  // 当前选中员工被 Snooze 后，自动切到第一位
  if (selectedEmpId.value != null && !list.find((e) => e.employeeId === selectedEmpId.value)) {
    selectedEmpId.value = list[0]?.employeeId ?? null
  }
})

/* ============ 4 个 Inline 操作（HR 个人级别 · localStorage） ============ */
const FOLLOWUP_KEY = 'hr_risk_alert_followups' // { [empId]: status }
const FOCUS_LIST_KEY = 'hr_risk_focus_list' // [empId, ...]
const SNOOZE_KEY = 'hr_risk_alert_snooze' // { [empId]: deadlineISO }

const followUpMap = ref<Record<number, RiskFollowUpStatus>>({})
const focusList = ref<number[]>([])
const snoozeMap = ref<Record<number, string>>({})

const loadLocalState = () => {
  followUpMap.value = JSON.parse(localStorage.getItem(FOLLOWUP_KEY) || '{}')
  focusList.value = JSON.parse(localStorage.getItem(FOCUS_LIST_KEY) || '[]')
  snoozeMap.value = JSON.parse(localStorage.getItem(SNOOZE_KEY) || '{}')
}
loadLocalState()

const getFollowUpStatus = (id: number): RiskFollowUpStatus | undefined => followUpMap.value[id]
const isInFocusList = (id: number) => focusList.value.includes(id)
const isSnoozed = (id: number): boolean => {
  const deadline = snoozeMap.value[id]
  if (!deadline) return false
  return new Date(deadline) > new Date()
}

const setFollowUp = (id: number, status: RiskFollowUpStatus) => {
  followUpMap.value = { ...followUpMap.value, [id]: status }
  localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(followUpMap.value))
}

const handleScheduleOneOnOne = (emp: RiskAlertEmployee) => {
  setFollowUp(emp.employeeId, 'one_on_one_scheduled')
  ElMessage.success(`已为 ${emp.name} 跳转 1on1 创建`)
  // 跳转到 1on1 页，通过 query 携带预填信息
  router.push({
    path: '/perf/one-on-one',
    query: {
      createForEmployeeId: String(emp.employeeId),
      createForEmployeeName: emp.name,
      createForDepartment: emp.department
    }
  })
  visible.value = false
}

const handleMarkReviewed = (emp: RiskAlertEmployee) => {
  setFollowUp(emp.employeeId, 'reviewed')
  ElMessage.success(`已标记 ${emp.name} 为"已跟进"`)
}

const handleAddToFocus = (emp: RiskAlertEmployee) => {
  if (focusList.value.includes(emp.employeeId)) return
  focusList.value = [...focusList.value, emp.employeeId]
  localStorage.setItem(FOCUS_LIST_KEY, JSON.stringify(focusList.value))
  ElMessage.success(`已将 ${emp.name} 加入关注列表`)
}

const handleSnooze = (emp: RiskAlertEmployee) => {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 30)
  snoozeMap.value = { ...snoozeMap.value, [emp.employeeId]: deadline.toISOString() }
  localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozeMap.value))
  ElMessage.success(`已暂时忽略 ${emp.name}（30 天后再次出现）`)
}

/* ============ 工具：flag 文本 ============ */
const getFlagLabel = (flag: 'normal' | 'attention' | 'concerning'): string => {
  return flag === 'normal' ? '正常' : flag === 'attention' ? '需留意' : '需关注'
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .drawer-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;

    .title-icon {
      color: #f56c6c;
      font-size: 18px;
    }
  }
}

.drawer-body {
  padding: 0 4px;
}

/* 合规标注条 */
.compliance-strip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: #fdf6ec;
  border: 1px solid #f5dab1;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #b88230;
  margin-bottom: 16px;

  .el-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #e6a23c;
  }
}

/* 扫描范围卡 */
.scope-card {
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;

  .scope-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 13px;
    line-height: 1.8;

    .scope-label {
      color: #909399;
      flex-shrink: 0;
      width: 80px;
    }

    .scope-value {
      color: #303133;
      font-weight: 500;
    }

    .freshness-tag {
      margin-left: 8px;
    }

    .reason-tag {
      margin-left: 6px;
    }
  }

  .data-source-collapse {
    margin-top: 8px;
    border-top: 1px dashed #ebeef5;
    padding-top: 4px;

    :deep(.el-collapse-item__header) {
      background: transparent;
      height: 32px;
      line-height: 32px;
      border: none;
      font-size: 13px;
      color: #909399;
    }

    :deep(.el-collapse-item__content) {
      padding-bottom: 8px;
    }

    .data-source-list {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      color: #606266;
      line-height: 1.8;
    }
  }
}

/* 风险摘要统计 */
.risk-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .summary-stat {
    flex: 1;
    background: #fafbfc;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 12px;
    text-align: center;

    .stat-num {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }

    &.danger {
      background: #fef0f0;
      border-color: #fbc4c4;
      .stat-num {
        color: #f56c6c;
      }
    }

    &.warning {
      background: #fdf6ec;
      border-color: #f5dab1;
      .stat-num {
        color: #e6a23c;
      }
    }

    &.info {
      background: #f4f4f5;
      border-color: #d3d4d6;
      .stat-num {
        color: #909399;
      }
    }
  }
}

/* 主区：左列右详 */
.main-area {
  display: flex;
  gap: 12px;
  height: calc(100% - 0px);
}

.employee-list {
  width: 260px;
  flex-shrink: 0;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 600px;

  .employee-row {
    padding: 12px 14px;
    cursor: pointer;
    border-bottom: 1px solid #f5f7fa;
    transition: background 0.15s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f7fa;
    }

    &.active {
      background: #ecf5ff;
      border-left: 3px solid #409eff;
      padding-left: 11px;
    }

    .emp-row-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .emp-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .emp-row-meta {
      font-size: 12px;
      color: #909399;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .emp-row-status {
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .el-tag {
        font-size: 11px;
      }
    }
  }

  .emp-list-empty {
    padding: 40px 16px;
    text-align: center;
    font-size: 13px;
    color: #c0c4cc;
  }
}

.employee-detail {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  max-height: 600px;
}

/* 详情 Header */
.detail-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f7fa;

  .detail-name {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 6px;
  }

  .detail-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 13px;
    color: #606266;

    .dot {
      color: #c0c4cc;
      margin: 0 4px;
    }
  }
}

/* AI 观察块 */
.ai-observation {
  background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
  border-left: 3px solid #6366f1;
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 16px;

  .observation-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 6px;

    .observation-icon {
      animation: pulse 2s ease-in-out infinite;
    }
  }

  .observation-text {
    font-size: 13px;
    line-height: 1.8;
    color: #2d3748;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* 通用 section */
.section-block {
  margin-bottom: 16px;

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;

    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 12px;
      background: #409eff;
      margin-right: 6px;
      vertical-align: -1px;
    }
  }
}

.key-drivers {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .driver-tag {
    font-size: 12px;
  }
}

/* 信号变化清单 */
.signal-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  .signal-card {
    border: 1px solid #ebeef5;
    border-radius: 6px;
    padding: 10px 12px;
    background: #fafbfc;

    &.flag-attention {
      background: #fdf6ec;
      border-color: #f5dab1;
    }

    &.flag-concerning {
      background: #fef0f0;
      border-color: #fbc4c4;
    }

    .signal-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      .signal-name {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
      }
    }

    .signal-variance {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      margin-bottom: 4px;

      .signal-current {
        color: #f56c6c;
        font-weight: 600;
      }

      .signal-arrow {
        color: #c0c4cc;
      }

      .signal-baseline {
        color: #909399;
        text-decoration: line-through;
      }
    }

    .signal-meta {
      font-size: 11px;
      color: #909399;
      margin-bottom: 4px;

      .dot {
        margin: 0 4px;
        color: #c0c4cc;
      }
    }

    .signal-tag {
      font-size: 12px;
      color: #606266;
      font-weight: 500;
    }
  }
}

/* Inline 操作 */
.inline-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f5f7fa;

  .el-button {
    margin-left: 0;
  }
}

/* 详情空态 */
.detail-empty {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #c0c4cc;
  font-size: 13px;

  .el-icon {
    font-size: 32px;
  }
}

/* Drawer footer */
.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .footer-hint {
    font-size: 12px;
    color: #909399;

    strong {
      color: #f56c6c;
    }
  }
}

/* 合规 Modal */
.compliance-modal {
  font-size: 13px;
  line-height: 1.8;

  .compliance-intro {
    margin: 0 0 12px;
    color: #303133;
  }

  .compliance-list {
    margin: 0 0 16px;
    padding-left: 20px;
    color: #606266;

    li {
      margin-bottom: 6px;

      strong {
        color: #303133;
      }

      em {
        color: #f56c6c;
        font-style: normal;
        font-weight: 600;
      }
    }
  }

  .compliance-check {
    margin-top: 8px;
  }
}
</style>
