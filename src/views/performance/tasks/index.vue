<template>
  <div class="task-container">
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">待办总数</div>
        <div class="kpi-value">{{ stats.pending || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">紧急待办</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.urgent || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已超期</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.overdue || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">员工视角</div>
        <div class="kpi-value" style="color: #409eff">{{ stats.byRole?.employee || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">Leader 视角</div>
        <div class="kpi-value" style="color: #e6a23c">{{ stats.byRole?.leader || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">HR 视角</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.byRole?.hr || 0 }}</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="视角">
          <el-radio-group v-model="viewAs" @change="loadData">
            <el-radio-button value="">全部</el-radio-button>
            <el-radio-button value="employee">员工</el-radio-button>
            <el-radio-button value="leader">Leader</el-radio-button>
            <el-radio-button value="hr">HR</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="filters.priority" placeholder="全部" style="width: 120px" clearable>
            <el-option v-for="(p, k) in PRIORITY_MAP" :key="k" :label="p.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" style="width: 120px" clearable>
            <el-option v-for="(s, k) in TASK_STATUS_MAP" :key="k" :label="s.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filters.keyword" placeholder="任务或姓名" style="width: 180px" clearable />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 任务列表 -->
    <el-card class="data-card">
      <el-table :data="filteredTasks" stripe>
        <el-table-column prop="taskNo" label="任务编号" width="160" />
        <el-table-column label="任务" min-width="280">
          <template #default="{ row }">
            <div class="task-cell">
              <span class="task-icon">{{ TASK_TYPE_MAP[row.type]?.icon || '📌' }}</span>
              <div class="task-body">
                <div class="task-title">{{ row.title }}</div>
                <div v-if="row.description" class="task-desc">{{ row.description }}</div>
                <div v-if="row.relatedObject" class="task-related">
                  <el-tag size="small" effect="plain">关联：{{ row.relatedObject.type }}{{ row.relatedObject.name ? ' · ' + row.relatedObject.name : '' }}</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="视角" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ VIEW_LABEL[row.assigneeRole] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assigneeName" label="负责人" width="110" />
        <el-table-column label="优先级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="PRIORITY_MAP[row.priority].type" size="small">
              {{ PRIORITY_MAP[row.priority].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="截止" width="180">
          <template #default="{ row }">
            <div :class="{ 'overdue-text': isOverdue(row) }">
              {{ row.dueTime }}
            </div>
            <div class="countdown" :class="getCountdownClass(row)">
              {{ getCountdown(row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="TASK_STATUS_MAP[row.status].type" size="small">
              {{ TASK_STATUS_MAP[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending' || row.status === 'overdue'" link type="primary" @click="handleJump(row)">
              去处理
            </el-button>
            <el-button v-if="row.status === 'pending'" link type="success" @click="handleComplete(row)">
              标记完成
            </el-button>
            <el-button v-if="row.status === 'pending'" link type="warning" @click="openDelayDialog(row)">
              延期
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 延期申请弹窗 -->
    <el-dialog v-model="delayVisible" title="申请延期" width="480px">
      <el-form :model="delayForm" label-width="100px">
        <el-form-item label="任务">
          <el-input :model-value="delayTarget?.title" disabled />
        </el-form-item>
        <el-form-item label="原截止">
          <el-input :model-value="delayTarget?.dueTime" disabled />
        </el-form-item>
        <el-form-item label="新截止">
          <el-date-picker v-model="delayForm.newDueTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="延期理由">
          <el-input v-model="delayForm.reason" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="delayVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDelay">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTaskList,
  completeTask,
  applyDelay,
  getTaskStats
} from '@/api/performanceTask'
import type { PerformanceTask } from '@/types/performanceTask'
import {
  TASK_TYPE_MAP,
  PRIORITY_MAP,
  TASK_STATUS_MAP,
  VIEW_LABEL
} from '@/types/performanceTask'

defineOptions({ name: 'PerformanceTasks' })

const router = useRouter()

const viewAs = ref<'employee' | 'leader' | 'hr' | ''>('')
const filters = reactive({
  priority: '' as string,
  status: '' as string,
  keyword: ''
})

const tasks = ref<PerformanceTask[]>([])
const stats = ref<any>({})

const filteredTasks = computed(() =>
  tasks.value.filter(
    (t) =>
      (!viewAs.value || t.assigneeRole === viewAs.value) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!filters.status || t.status === filters.status) &&
      (!filters.keyword ||
        t.title.includes(filters.keyword) ||
        t.assigneeName.includes(filters.keyword))
  )
)

const loadData = async () => {
  const res = await getTaskList({ pageSize: 200 })
  tasks.value = res.data?.list || []
  const s = await getTaskStats()
  stats.value = s.data
}

/* ========== 工具 ========== */
const isOverdue = (t: PerformanceTask): boolean => {
  if (t.status === 'completed' || t.status === 'cancelled') return false
  return new Date(t.dueTime) < new Date()
}

const getCountdown = (t: PerformanceTask): string => {
  if (t.status === 'completed') return '已完成于 ' + (t.completedAt || '').slice(0, 10)
  if (t.status === 'cancelled') return ''
  const now = new Date()
  const due = new Date(t.dueTime)
  const diff = due.getTime() - now.getTime()
  const days = Math.round(diff / 86400000)
  if (diff < 0) return `已超期 ${Math.abs(days)} 天`
  if (days === 0) return '今日到期'
  if (days <= 3) return `${days} 天后到期`
  return `剩余 ${days} 天`
}

const getCountdownClass = (t: PerformanceTask) => {
  if (isOverdue(t)) return 'text-overdue'
  const diff = new Date(t.dueTime).getTime() - Date.now()
  if (diff < 86400000 * 3) return 'text-urgent'
  return 'text-normal'
}

/* ========== 操作 ========== */
const handleJump = (t: PerformanceTask) => {
  if (t.redirectUrl) {
    router.push(t.redirectUrl)
  } else {
    ElMessage.info('该任务暂无跳转目标')
  }
}

const handleComplete = async (t: PerformanceTask) => {
  try {
    await ElMessageBox.confirm(`确定将任务「${t.title}」标记为已完成？`, '确认', { type: 'info' })
    await completeTask(t.id)
    ElMessage.success('已完成')
    loadData()
  } catch {}
}

const delayVisible = ref(false)
const delayTarget = ref<PerformanceTask | null>(null)
const delayForm = reactive({ newDueTime: '', reason: '' })

const openDelayDialog = (t: PerformanceTask) => {
  delayTarget.value = t
  delayForm.newDueTime = ''
  delayForm.reason = ''
  delayVisible.value = true
}

const submitDelay = async () => {
  if (!delayTarget.value) return
  if (!delayForm.newDueTime || !delayForm.reason) {
    ElMessage.warning('请填写新截止时间和原因')
    return
  }
  try {
    await applyDelay(delayTarget.value.id, delayForm.newDueTime, delayForm.reason)
    ElMessage.success('延期已申请')
    delayVisible.value = false
    loadData()
  } catch (e: any) {
    ElMessage.error(e?.message || '延期失败')
  }
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.task-container {
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

.task-cell {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .task-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .task-body {
    flex: 1;
    min-width: 0;
  }

  .task-title {
    font-weight: 500;
    color: #303133;
  }

  .task-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  .task-related {
    margin-top: 4px;
  }
}

.countdown {
  font-size: 12px;
  margin-top: 2px;

  &.text-overdue {
    color: #f56c6c;
    font-weight: 600;
  }

  &.text-urgent {
    color: #e6a23c;
  }

  &.text-normal {
    color: #909399;
  }
}

.overdue-text {
  color: #f56c6c;
  font-weight: 500;
}
</style>
