<template>
  <div v-if="shouldShow" class="ai-salary-inline" :class="statusClass">
    <!-- 加载中 -->
    <div v-if="calling" class="ai-row loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在诊断薪资合理性…</span>
    </div>

    <!-- 已有结果 -->
    <template v-else-if="result">
      <div class="ai-summary-row">
        <el-icon class="ai-icon"><ArtAiIcon /></el-icon>
        <el-tag size="small" :type="statusTagType">{{ statusLabel }}</el-tag>

        <!-- compa-ratio 关键指标 -->
        <span class="metric">
          <span class="metric-label">Compa-Ratio</span>
          <span :class="['metric-value', compaRatioClass]">
            {{ result.band.compaRatio.toFixed(2) }}
          </span>
        </span>

        <!-- 分位定位 -->
        <span class="metric">
          <span class="metric-label">同岗分位</span>
          <span class="metric-value">{{ result.peer.proposedQuartile }}</span>
        </span>

        <!-- AI 一句话观察 -->
        <span class="ai-observation">{{ result.aiObservation }}</span>

        <el-button link type="primary" @click="fullVisible = true">查看完整诊断</el-button>
      </div>
    </template>

    <!-- 未填齐 / 未触发 -->
    <template v-else-if="readyForCheck">
      <div class="ai-row idle">
        <el-icon class="ai-icon"><ArtAiIcon /></el-icon>
        <span class="ai-placeholder">薪资已填齐 ·</span>
        <el-button link type="primary" @click="invoke">点此 AI 诊断</el-button>
      </div>
    </template>
    <template v-else>
      <span class="ai-placeholder">填写薪资后可触发 AI 诊断</span>
    </template>
  </div>

  <!-- 完整诊断 Drawer（业界对标 ChartHop / Pave，与其他 AI 能力 Drawer 形态统一）-->
  <el-drawer
    v-model="fullVisible"
    :size="800"
    direction="rtl"
    title="薪酬合理性检查"
    append-to-body
  >
    <div v-if="result" class="full-diagnosis">
      <!-- 状态摘要 + AI 一句话作为描述（取代单独的"AI 观察"段）-->
      <el-alert
        :type="statusAlertType"
        :title="statusAlertTitle"
        :description="result.aiObservation"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      />

      <!-- 带宽分析 -->
      <div class="section">
        <div class="section-title">
          <el-icon><DataAnalysis /></el-icon>
          带宽分析
        </div>
        <div class="band-bar">
          <div class="band-track">
            <div class="band-segment" />
            <div class="band-marker band-marker-min" :style="{ left: '0%' }">
              <div class="marker-dot" />
              <div class="marker-label">{{ formatMoney(result.band.min) }}<br /><span>下限</span></div>
            </div>
            <div class="band-marker band-marker-mid" :style="{ left: '50%' }">
              <div class="marker-dot" />
              <div class="marker-label">{{ formatMoney(result.band.mid) }}<br /><span>中位</span></div>
            </div>
            <div class="band-marker band-marker-max" :style="{ left: '100%' }">
              <div class="marker-dot" />
              <div class="marker-label">{{ formatMoney(result.band.max) }}<br /><span>上限</span></div>
            </div>
            <div
              class="band-marker band-marker-proposed"
              :class="{ 'out-of-range': result.band.outOfRange }"
              :style="{ left: proposedPercent + '%' }"
            >
              <div class="marker-dot proposed-dot" />
              <div class="marker-label proposed-label">
                {{ formatMoney(result.band.proposed) }}<br /><span>提议</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-meta">
          Compa-Ratio：<strong>{{ result.band.compaRatio.toFixed(2) }}</strong>
          <span class="meta-source">数据来源：{{ result.band.source }}</span>
        </div>
      </div>

      <!-- 同岗对标 -->
      <div class="section">
        <div class="section-title">
          <el-icon><User /></el-icon>
          同岗内部对标
        </div>
        <div class="section-content">
          同岗级在职 <strong>{{ result.peer.peerCount }}</strong> 人 · 提议薪资处于
          <el-tag size="small" :type="peerTagType">{{ result.peer.proposedQuartile }}</el-tag>
          分位
        </div>
        <div class="section-meta">
          <span class="meta-source">数据来源：{{ result.peer.source }}</span>
        </div>
      </div>

      <!-- 数值倒挂提示 -->
      <div v-if="result.inversion.hasInversion" class="section section-warning">
        <div class="section-title">
          <el-icon><WarningFilled /></el-icon>
          数值倒挂提示
        </div>
        <div class="section-content">
          {{ result.inversion.description }}
        </div>
        <div class="section-meta">
          <span class="meta-source">数据来源：{{ result.inversion.source }}</span>
        </div>
      </div>

      <!-- 合规底部 -->
      <div class="compliance-footer">
        AI 诊断结果仅作 HR 决策参考，不可作为唯一依据。最终方案需 HR 与 HRBP 综合判断。
      </div>
    </div>
    <template #footer>
      <el-button @click="fullVisible = false">关闭</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loading, DataAnalysis, User, WarningFilled } from '@element-plus/icons-vue'
import { invokeAIAbility } from '@/api/performanceAI'
import {
  SANITY_STATUS_LABEL,
  SANITY_STATUS_TYPE
} from '@/types/performanceAI'
import type { SalarySanityCheckResult } from '@/types/performanceAI'

interface Props {
  /** 业务上下文字符串（拼接员工 + 岗位 + 薪资）*/
  context: string
  /** 关键触发条件：缺一不调用 */
  requiredFields: (string | number | undefined | null)[]
  /** 目标对象（员工/候选人姓名）*/
  targetName?: string
  /** 操作人 */
  operatorName?: string
  /** Debounce 毫秒数（默认 2000ms · 业界对标，避免 HR 反复改薪资跑 LLM）*/
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  targetName: '',
  operatorName: 'HR-Lisa',
  debounceMs: 2000
})

const result = ref<SalarySanityCheckResult | null>(null)
const calling = ref(false)
const fullVisible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const shouldShow = computed(() => {
  return props.requiredFields.every((f) => f !== undefined && f !== null && f !== '')
})

const readyForCheck = computed(() => shouldShow.value && !result.value && !calling.value)

watch(
  () => [props.context, ...props.requiredFields],
  () => {
    result.value = null
    if (!shouldShow.value) return
    if (timer) clearTimeout(timer)
    // 2000ms 后自动触发；用户也可以通过手动按钮提前触发
    timer = setTimeout(() => invoke(), props.debounceMs)
  },
  { immediate: true }
)

/* ============ 后处理违禁关键词拦截 ============ */
const FORBIDDEN_KEYWORDS = [
  '建议晋升',
  '推荐方案',
  '方案 A',
  '方案 B',
  '方案 C',
  '管理倒挂',
  '建议调整',
  '应该调整',
  '建议提高',
  '建议降低'
]

const sanitizeText = (text: string): string => {
  let safe = text
  FORBIDDEN_KEYWORDS.forEach((kw) => {
    if (safe.includes(kw)) {
      // eslint-disable-next-line no-console
      console.warn(`[salary_sanity_check] 拦截违禁关键词：${kw}`)
      safe = safe.replace(new RegExp(kw, 'g'), '[已拦截]')
    }
  })
  return safe
}

async function invoke() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  calling.value = true
  try {
    const res: any = await invokeAIAbility(
      'salary_sanity_check',
      props.context,
      props.operatorName,
      props.targetName
    )
    const payload = res?.data
    if (payload?.structured) {
      const safe = payload.structured as SalarySanityCheckResult
      // 拦截违禁词（防 LLM 越界）
      safe.aiObservation = sanitizeText(safe.aiObservation)
      safe.inversion.description = sanitizeText(safe.inversion.description)
      result.value = safe
    }
  } finally {
    calling.value = false
  }
}

/* ============ 状态展示 ============ */
const statusLabel = computed(() => (result.value ? SANITY_STATUS_LABEL[result.value.status] : ''))
const statusTagType = computed(() => (result.value ? SANITY_STATUS_TYPE[result.value.status] : 'info'))

const statusClass = computed(() => {
  if (!result.value) return 'idle'
  return result.value.status === 'in_range'
    ? 'success'
    : result.value.status === 'out_of_range'
      ? 'warning'
      : 'danger'
})

const statusAlertType = computed<'success' | 'warning' | 'error'>(() => {
  if (!result.value) return 'success'
  return result.value.status === 'in_range'
    ? 'success'
    : result.value.status === 'out_of_range'
      ? 'warning'
      : 'error'
})

const statusAlertTitle = computed(() => {
  if (!result.value) return ''
  return result.value.status === 'in_range'
    ? '提议薪资在公司带宽内'
    : result.value.status === 'out_of_range'
      ? '提议薪资超出公司带宽，请 HR 综合判断'
      : '形成数值倒挂，请 HR 综合判断（如属专家序列等场景可能合理）'
})

/* ============ Compa-Ratio 颜色 ============ */
const compaRatioClass = computed(() => {
  if (!result.value) return ''
  const r = result.value.band.compaRatio
  if (r > 1.25) return 'compa-danger'
  if (r > 1.1) return 'compa-warning'
  if (r < 0.85) return 'compa-low'
  return 'compa-normal'
})

/* ============ 带宽位置百分比 ============ */
const proposedPercent = computed(() => {
  if (!result.value) return 50
  const { min, max, proposed } = result.value.band
  if (max <= min) return 50
  // 限制在 0~115% 范围（超出可视化）
  const pct = ((proposed - min) / (max - min)) * 100
  return Math.max(-5, Math.min(115, pct))
})

const peerTagType = computed<'success' | 'info' | 'warning' | 'danger'>(() => {
  if (!result.value) return 'info'
  const q = result.value.peer.proposedQuartile
  if (q === 'Top') return 'danger'
  if (q === 'P75') return 'warning'
  if (q === 'P50') return 'success'
  return 'info'
})

/* ============ 工具函数 ============ */
const formatMoney = (n: number): string => {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`
  return `${n}`
}
</script>

<style scoped lang="scss">
.ai-salary-inline {
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 6px;
  font-size: 13px;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;

  &.success {
    background: #f0f9eb;
    border-color: #c2e7b0;
  }
  &.warning {
    background: #fdf6ec;
    border-color: #f5dab1;
  }
  &.danger {
    background: #fef0f0;
    border-color: #fbc4c4;
  }
  &.idle {
    background: #fafafa;
    border-color: #e4e7ed;
  }

  .ai-row {
    display: flex;
    align-items: center;
    gap: 6px;

    &.loading {
      color: #909399;
    }

    &.idle {
      color: #606266;
    }
  }

  .ai-icon {
    color: #6366f1;
    font-size: 16px;
  }

  .ai-summary-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .metric {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;

      .metric-label {
        color: #909399;
      }

      .metric-value {
        font-weight: 600;
        color: #303133;
        font-family: 'SF Mono', Menlo, monospace;

        &.compa-normal {
          color: #67c23a;
        }
        &.compa-warning {
          color: #e6a23c;
        }
        &.compa-danger {
          color: #f56c6c;
        }
        &.compa-low {
          color: #909399;
        }
      }
    }

    .ai-observation {
      flex: 1;
      min-width: 0;
      color: #606266;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .ai-placeholder {
    color: #909399;
    font-size: 12px;
  }
}

/* 完整诊断 Dialog */
.full-diagnosis {
  font-size: 13px;
  line-height: 1.7;

  .section {
    margin-bottom: 18px;
    padding: 12px 14px;
    background: #fafbfc;
    border: 1px solid #ebeef5;
    border-radius: 6px;

    &.section-warning {
      background: #fef0f0;
      border-color: #fbc4c4;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
      font-size: 13px;

      .el-icon {
        color: #409eff;
      }
    }

    .section-content {
      color: #303133;
    }

    .section-meta {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;

      strong {
        color: #303133;
        font-family: 'SF Mono', Menlo, monospace;
      }

      .meta-source {
        margin-left: 12px;

        &::before {
          content: '· ';
        }
      }
    }

  }

  /* 带宽可视化 */
  .band-bar {
    padding: 28px 12px 36px;
  }

  .band-track {
    position: relative;
    height: 6px;
    background: #ecf5ff;
    border-radius: 3px;
  }

  .band-segment {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #67c23a 0%, #67c23a 50%, #e6a23c 100%);
    border-radius: 3px;
  }

  .band-marker {
    position: absolute;
    top: -10px;
    transform: translateX(-50%);
    text-align: center;

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #909399;
      margin: 0 auto;
    }

    .marker-label {
      margin-top: 4px;
      font-size: 11px;
      color: #909399;

      span {
        font-size: 10px;
      }
    }

    &.band-marker-mid .marker-dot {
      border-color: #67c23a;
    }

    &.band-marker-max .marker-dot {
      border-color: #e6a23c;
    }

    &.band-marker-proposed {
      top: -16px;

      .proposed-dot {
        width: 16px;
        height: 16px;
        background: #409eff;
        border-color: #fff;
        box-shadow: 0 0 0 3px #409eff;
      }

      .proposed-label {
        color: #409eff;
        font-weight: 600;
      }

      &.out-of-range .proposed-dot {
        background: #f56c6c;
        box-shadow: 0 0 0 3px #f56c6c;
      }

      &.out-of-range .proposed-label {
        color: #f56c6c;
      }
    }
  }

  .compliance-footer {
    margin-top: 16px;
    padding: 10px 14px;
    background: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 6px;
    font-size: 12px;
    color: #4f7ea3;
    line-height: 1.6;
  }
}
</style>
