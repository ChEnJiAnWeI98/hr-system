<template>
  <div class="talent-board-container">
    <!-- 面包屑 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回盘点列表
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ meeting?.meetingName || '盘点工作台' }}</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出结果
          </el-button>
          <el-button type="success" @click="handleCompleteMeeting" :disabled="meeting?.status === 'completed'">
            完成盘点
          </el-button>
        </div>
      </div>
    </el-card>

    <el-scrollbar class="content-scrollbar" v-if="meeting">
      <!-- 会议信息 -->
      <el-card class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">会议编号</span>
            <span>{{ meeting.meetingNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属周期</span>
            <span>{{ meeting.cycleName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">主持人</span>
            <span>{{ meeting.hostName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">计划时间</span>
            <span>{{ meeting.scheduledTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">适用部门</span>
            <div>
              <el-tag
                v-for="d in meeting.departments"
                :key="d"
                size="small"
                effect="plain"
                style="margin-right: 4px"
              >
                {{ d }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">状态</span>
            <el-tag :type="TALENT_STATUS_TYPE[meeting.status]" size="small">
              {{ TALENT_STATUS_LABEL[meeting.status] }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- 9-box 主体 -->
      <el-card class="board-card">
        <div class="board-header">
          <div class="board-title">9-box 人才盘点网格</div>
          <div class="board-tip">拖拽员工卡片到目标格子即可调档；调整会记录到历史</div>
        </div>

        <div class="nine-box-wrapper">
          <!-- Y 轴标签（潜力） -->
          <div class="axis-y">
            <div class="axis-y-title">潜力 →</div>
            <div class="axis-y-label">高</div>
            <div class="axis-y-label">中</div>
            <div class="axis-y-label">低</div>
          </div>

          <!-- 9-box 网格 -->
          <div class="nine-box-grid">
            <div
              v-for="cell in CELL_ORDER"
              :key="cell"
              class="box-cell"
              :class="`cell-${cell}`"
            >
              <div class="cell-head">
                <el-tag :type="NINE_BOX_CATEGORY_TYPE[NINE_BOX_CELL_CATEGORY[cell]]" size="small">
                  {{ NINE_BOX_CATEGORY_LABEL[NINE_BOX_CELL_CATEGORY[cell]] }}
                </el-tag>
                <span class="cell-count">{{ getCellEntries(cell).length }} 人</span>
              </div>
              <VueDraggable
                v-model="cellEntriesMap[cell]"
                :group="{ name: 'talent', pull: true, put: meeting.status !== 'completed' }"
                :disabled="meeting.status === 'completed'"
                item-key="employeeId"
                class="cell-body"
                @end="(e) => handleDragEnd(e, cell)"
              >
                <div
                  v-for="entry in cellEntriesMap[cell]"
                  :key="entry.employeeId"
                  class="employee-card"
                  :data-emp-id="entry.employeeId"
                >
                  <div class="emp-name">{{ entry.employeeName }}</div>
                  <div class="emp-meta">
                    {{ entry.position }} · <el-tag size="small" :type="gradeColor(entry.performanceGrade)">{{ entry.performanceGrade }}</el-tag>
                  </div>
                </div>
                <div v-if="!cellEntriesMap[cell].length" class="cell-empty">拖拽到此</div>
              </VueDraggable>
            </div>
          </div>

          <!-- X 轴标签（业绩） -->
          <div class="axis-x">
            <span class="axis-x-label">低</span>
            <span class="axis-x-label">中</span>
            <span class="axis-x-label">高</span>
            <div class="axis-x-title">业绩 →</div>
          </div>
        </div>

        <!-- 统计 -->
        <div class="dist-summary">
          <div
            v-for="cat in CATEGORY_ORDER"
            :key="cat"
            class="dist-item"
          >
            <el-tag :type="NINE_BOX_CATEGORY_TYPE[cat]" size="small" effect="plain">
              {{ NINE_BOX_CATEGORY_LABEL[cat] }}
            </el-tag>
            <span class="dist-count">{{ getCategoryCount(cat) }} 人</span>
          </div>
        </div>
      </el-card>

      <!-- 员工明细列表 -->
      <el-card class="entries-card">
        <div class="board-header">
          <div class="board-title">员工明细（可编辑潜力 / 评语 / 应用建议）</div>
        </div>
        <el-table :data="meeting.entries" border>
          <el-table-column prop="employeeName" label="姓名" width="100" fixed />
          <el-table-column prop="department" label="部门" width="140" />
          <el-table-column prop="position" label="岗位" width="130" />
          <el-table-column label="绩效等级" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="gradeColor(row.performanceGrade)" size="small">{{ row.performanceGrade }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="业绩档次" width="100" align="center">
            <template #default="{ row }">{{ PERFORMANCE_LEVEL_LABEL[row.performanceLevel as 'low' | 'medium' | 'high'] }}</template>
          </el-table-column>
          <el-table-column label="潜力档次" width="140" align="center">
            <template #default="{ row }">
              <el-select
                v-model="row.potentialLevel"
                size="small"
                :disabled="meeting.status === 'completed'"
                @change="(v: any) => handlePotentialChange(row, v)"
              >
                <el-option label="低" value="low" />
                <el-option label="中" value="medium" />
                <el-option label="高" value="high" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="9-box 分类" width="130" align="center">
            <template #default="{ row }">
              <el-tag :type="NINE_BOX_CATEGORY_TYPE[row.category as NineBoxCategory]" size="small">
                {{ NINE_BOX_CATEGORY_LABEL[row.category as NineBoxCategory] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="应用建议" width="140">
            <template #default="{ row }">
              <el-select v-model="row.applySuggestion" size="small" :disabled="meeting.status === 'completed'">
                <el-option
                  v-for="key in APPLY_KEYS"
                  :key="key"
                  :label="APPLY_SUGGESTION_LABEL[key]"
                  :value="key"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="评语" min-width="240">
            <template #default="{ row }">
              <el-input
                v-model="row.reviewComment"
                size="small"
                placeholder="盘点评语（可选）"
                :disabled="meeting.status === 'completed'"
              />
            </template>
          </el-table-column>
          <el-table-column label="初始 → 当前" width="130" align="center">
            <template #default="{ row }">
              <span v-if="row.initialCell === row.currentCell" style="color: #909399">未调整</span>
              <span v-else>{{ row.initialCell }} → <b>{{ row.currentCell }}</b></span>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: right; margin-top: 16px">
          <el-button
            type="primary"
            :disabled="meeting.status === 'completed'"
            @click="handleSaveEntries"
          >
            保存员工明细
          </el-button>
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import {
  getTalentMeetingDetail,
  updateTalentMeeting,
  updateTalentReviewEntry
} from '@/api/performanceTalentReview'
import {
  TALENT_STATUS_LABEL,
  TALENT_STATUS_TYPE,
  NINE_BOX_CATEGORY_LABEL,
  NINE_BOX_CATEGORY_TYPE,
  NINE_BOX_CELL_CATEGORY,
  NINE_BOX_CELL_DEFAULT_SUGGESTION,
  APPLY_SUGGESTION_LABEL,
  PERFORMANCE_LEVEL_LABEL,
  toNineBoxCell
} from '@/types/performanceTalentReview'
import type {
  TalentReviewMeeting,
  TalentReviewEntry,
  NineBoxCell,
  NineBoxCategory,
  PotentialLevel,
  TalentApplySuggestion
} from '@/types/performanceTalentReview'

defineOptions({ name: 'PerformanceTalentBoard' })

const route = useRoute()
const router = useRouter()

const meetingId = Number(route.params.id)
const meeting = ref<TalentReviewMeeting | null>(null)

/** 9 格顺序（第一行潜力高 → 最后一行潜力低，每行内业绩低→高） */
const CELL_ORDER: NineBoxCell[] = ['LH', 'MH', 'HH', 'LM', 'MM', 'HM', 'LL', 'ML', 'HL']

const CATEGORY_ORDER: NineBoxCategory[] = [
  'star',
  'core',
  'solid',
  'high_potential',
  'average',
  'observation',
  'misfit',
  'dilemma',
  'underperformer'
]

const APPLY_KEYS: TalentApplySuggestion[] = [
  'promote',
  'rotate',
  'train',
  'pip',
  'retain',
  'none'
]

/** 每格的员工列表（VueDraggable 绑定） */
const cellEntriesMap = ref<Record<NineBoxCell, TalentReviewEntry[]>>({
  HH: [],
  HM: [],
  HL: [],
  MH: [],
  MM: [],
  ML: [],
  LH: [],
  LM: [],
  LL: []
})

const buildCellMap = () => {
  const map: Record<string, TalentReviewEntry[]> = {
    HH: [],
    HM: [],
    HL: [],
    MH: [],
    MM: [],
    ML: [],
    LH: [],
    LM: [],
    LL: []
  }
  meeting.value?.entries.forEach((e) => {
    map[e.currentCell].push(e)
  })
  cellEntriesMap.value = map as any
}

const getCellEntries = (cell: NineBoxCell) => cellEntriesMap.value[cell] || []

const getCategoryCount = (cat: NineBoxCategory) => {
  return meeting.value?.entries.filter((e) => e.category === cat).length || 0
}

const gradeColor = (grade: string) => {
  const map: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    S: 'success',
    A: 'primary',
    B: 'info',
    C: 'warning',
    D: 'danger'
  }
  return map[grade] || 'info'
}

const fetchMeeting = async () => {
  const res: any = await getTalentMeetingDetail(meetingId)
  meeting.value = res.data
  buildCellMap()
}

/**
 * 拖拽结束：识别目标格子并更新员工 currentCell
 * VueDraggable 的 v-model 会自动同步数组，这里需要反查该员工被放到了哪个 cell
 */
const handleDragEnd = async (e: any, targetCell: NineBoxCell) => {
  // 找到被移动的员工（新出现在 targetCell 中的那个）
  // 逻辑：scan meeting.entries，找 currentCell !== targetCell 但现在出现在 cellEntriesMap[targetCell] 中的员工
  const currentIds = new Set(cellEntriesMap.value[targetCell].map((x) => x.employeeId))
  const moved = meeting.value?.entries.find(
    (entry) => currentIds.has(entry.employeeId) && entry.currentCell !== targetCell
  )
  if (!moved) return

  const oldCell = moved.currentCell
  const { performance: perf, potential: pot } = parseNewCell(targetCell)

  // 更新本地数据
  moved.currentCell = targetCell
  moved.performanceLevel = perf
  moved.potentialLevel = pot
  moved.category = NINE_BOX_CELL_CATEGORY[targetCell]
  moved.applySuggestion = NINE_BOX_CELL_DEFAULT_SUGGESTION[targetCell]
  moved.adjustHistory = moved.adjustHistory || []
  moved.adjustHistory.push({
    from: oldCell,
    to: targetCell,
    adjustBy: '盘点主持人',
    adjustTime: new Date().toLocaleString('zh-CN'),
    reason: '工作台拖拽调整'
  })

  // 远程保存
  try {
    await updateTalentReviewEntry(meetingId, moved.employeeId, {
      currentCell: targetCell,
      potentialLevel: pot,
      performanceLevel: perf,
      category: moved.category,
      applySuggestion: moved.applySuggestion
    })
    ElMessage.success(`${moved.employeeName} 已从 ${oldCell} 调整至 ${targetCell}`)
  } catch (err: any) {
    ElMessage.error(err.message || '调整失败')
  }
}

const parseNewCell = (cell: NineBoxCell) => {
  const perfMap: Record<string, 'low' | 'medium' | 'high'> = {
    L: 'low',
    M: 'medium',
    H: 'high'
  }
  const potMap: Record<string, 'low' | 'medium' | 'high'> = {
    L: 'low',
    M: 'medium',
    H: 'high'
  }
  return {
    performance: perfMap[cell[0]],
    potential: potMap[cell[1]]
  }
}

/**
 * 潜力档次变更（在明细表中）
 */
const handlePotentialChange = async (row: TalentReviewEntry, newPotential: PotentialLevel) => {
  const newCell = toNineBoxCell(row.performanceLevel, newPotential)
  row.currentCell = newCell
  row.category = NINE_BOX_CELL_CATEGORY[newCell]
  row.applySuggestion = NINE_BOX_CELL_DEFAULT_SUGGESTION[newCell]
  await updateTalentReviewEntry(meetingId, row.employeeId, {
    potentialLevel: newPotential,
    currentCell: newCell,
    category: row.category,
    applySuggestion: row.applySuggestion
  })
  ElMessage.success('潜力档次已更新')
  buildCellMap()
}

const handleSaveEntries = async () => {
  if (!meeting.value) return
  await updateTalentMeeting(meeting.value)
  ElMessage.success('保存成功')
}

const handleCompleteMeeting = () => {
  ElMessageBox.confirm('完成盘点后将不再允许调整。确定完成吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    if (!meeting.value) return
    meeting.value.status = 'completed'
    await updateTalentMeeting(meeting.value)
    ElMessage.success('盘点已完成')
  })
}

const handleExport = () => {
  ElMessage.info('导出功能：Mock 环境展示。实际环境将导出 Excel 含 9-box 分布与每位员工的调档记录')
}

const handleBack = () => {
  router.push('/talent/review')
}

onMounted(fetchMeeting)

watch(
  () => meeting.value?.entries,
  () => buildCellMap(),
  { deep: true }
)
</script>

<style scoped lang="scss">
.talent-board-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .breadcrumb-card {
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
    }

    .breadcrumb-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .breadcrumb-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .el-button {
        font-size: 14px;
        color: #606266;
        padding: 0;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .divider {
        color: #dcdfe6;
      }

      .page-info {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }

    .breadcrumb-actions {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .content-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  .info-card,
  .board-card,
  .entries-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 40px;

    .info-item {
      display: flex;
      align-items: center;

      .info-label {
        color: #909399;
        width: 80px;
        flex-shrink: 0;
      }
    }
  }

  .board-header {
    margin-bottom: 16px;

    .board-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .board-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  .nine-box-wrapper {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 1fr 40px;
    gap: 0;

    .axis-y {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0;

      .axis-y-title {
        font-size: 12px;
        color: #606266;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        white-space: nowrap;
        margin-bottom: 8px;
      }

      .axis-y-label {
        font-size: 12px;
        color: #606266;
        padding: 8px 0;
      }
    }

    .nine-box-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 200px);
      gap: 8px;
    }

    .axis-x {
      grid-column: 2;
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      padding-top: 8px;

      .axis-x-label {
        font-size: 12px;
        color: #606266;
      }

      .axis-x-title {
        position: absolute;
        right: 0;
        top: 8px;
        font-size: 12px;
        color: #606266;
      }
    }
  }

  .box-cell {
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    background: #fafafa;

    &.cell-HH {
      background: #f0f9ff;
      border-color: #a1e6a1;
    }
    &.cell-HM,
    &.cell-MH {
      background: #f3faff;
    }
    &.cell-LL {
      background: #fff5f5;
      border-color: #f1b1b1;
    }

    .cell-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-shrink: 0;

      .cell-count {
        font-size: 12px;
        color: #909399;
      }
    }

    .cell-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 60px;
    }

    .cell-empty {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c0c4cc;
      font-size: 12px;
    }
  }

  .employee-card {
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 6px 8px;
    cursor: move;
    transition: all 0.15s;

    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
    }

    .emp-name {
      font-size: 13px;
      font-weight: 500;
      color: #303133;
    }

    .emp-meta {
      font-size: 11px;
      color: #909399;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .dist-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px dashed #e4e7ed;

    .dist-item {
      display: flex;
      align-items: center;
      gap: 6px;

      .dist-count {
        font-size: 13px;
        color: #606266;
      }
    }
  }
}
</style>
