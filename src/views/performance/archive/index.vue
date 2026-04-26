<template>
  <div class="perf-archive-container">
    <el-tabs v-model="activeTab" class="archive-tabs">
      <!-- Tab 1: 档案列表 -->
      <el-tab-pane label="档案列表" name="list">
        <el-card class="filter-card">
          <el-form inline>
            <el-form-item label="员工">
              <el-input v-model="filters.employeeName" placeholder="姓名" style="width: 160px" clearable />
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="filters.departmentName" placeholder="部门" style="width: 140px" clearable />
            </el-form-item>
            <el-form-item label="等级">
              <el-select v-model="filters.grade" placeholder="全部" style="width: 120px" clearable>
                <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchData">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="data-card">
          <el-table :data="filteredData" stripe>
            <el-table-column prop="archiveNo" label="档案编号" width="180" />
            <el-table-column prop="employeeName" label="员工" width="100" />
            <el-table-column prop="departmentName" label="部门" width="110" />
            <el-table-column prop="positionName" label="岗位" width="140" />
            <el-table-column prop="cycleName" label="周期" min-width="200" />
            <el-table-column label="综合得分" width="100" align="right">
              <template #default="{ row }">
                <strong>{{ row.finalScore }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="等级" width="100" align="center">
              <template #default="{ row }">
                <el-tag :class="`grade-${row.grade || row.rating}`" size="small">
                  {{ row.grade || row.rating }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="目标完成率" width="130" align="center">
              <template #default="{ row }">
                <el-progress v-if="row.goalCompletionRate" :percentage="Math.min(row.goalCompletionRate, 120)" :stroke-width="8" :color="progressColor(row.goalCompletionRate)" />
                <span v-else class="muted">—</span>
              </template>
            </el-table-column>
            <el-table-column label="排名" width="110" align="center">
              <template #default="{ row }">{{ row.ranking }} / {{ row.totalInDepartment }}</template>
            </el-table-column>
            <el-table-column label="薪资调整" width="110" align="center">
              <template #default="{ row }">
                <span v-if="row.salaryAdjustment > 0" style="color: #67c23a">+{{ row.salaryAdjustment }}%</span>
                <span v-else-if="row.salaryAdjustment < 0" style="color: #f56c6c">{{ row.salaryAdjustment }}%</span>
                <span v-else class="muted">—</span>
              </template>
            </el-table-column>
            <el-table-column prop="promotion" label="晋升 / 荣誉" min-width="140" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewProfile(row)">员工画像</el-button>
                <el-button link @click="handleExport(row)">PDF 导出</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 2: 高潜员工 -->
      <el-tab-pane label="高潜员工识别" name="hipo">
        <el-card class="data-card">
          <div class="sub-title">🌟 高潜员工清单（连续 2+ 周期 S/A 且无 PIP 历史）</div>
          <el-table :data="hipoList" stripe>
            <el-table-column prop="employeeName" label="员工" width="120" />
            <el-table-column prop="departmentName" label="部门" width="140" />
            <el-table-column prop="positionName" label="岗位" width="160" />
            <el-table-column prop="totalCycles" label="周期数" width="100" align="center" />
            <el-table-column prop="avgScore" label="平均分" width="100" align="center">
              <template #default="{ row }"><strong style="color: #67c23a">{{ row.avgScore }}</strong></template>
            </el-table-column>
            <el-table-column label="近期趋势" min-width="300">
              <template #default="{ row }">
                <div class="trend-sparkline">
                  <div v-for="(s, i) in row.recentTrend" :key="i" class="spark-bar" :style="{ height: s + '%', background: progressColor(s) }" :title="`${s} 分`" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="建议" min-width="240">
              <template #default="{ row }">
                <el-tag type="success" size="small">晋升候选池</el-tag>
                <el-tag type="warning" size="small" style="margin-left: 6px">人才盘点加入明日之星</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="hipoList.length === 0" description="暂无高潜员工" />
        </el-card>
      </el-tab-pane>

      <!-- Tab 3: 需关注员工 -->
      <el-tab-pane label="需关注员工" name="attention">
        <el-card class="data-card">
          <div class="sub-title" style="color: #f56c6c">⚠ 需关注员工（近 2 周期有 C/D 记录）</div>
          <el-table :data="attentionList" stripe>
            <el-table-column prop="employeeName" label="员工" width="120" />
            <el-table-column prop="departmentName" label="部门" width="140" />
            <el-table-column prop="positionName" label="岗位" width="160" />
            <el-table-column prop="avgScore" label="平均分" width="100" align="center">
              <template #default="{ row }"><strong>{{ row.avgScore }}</strong></template>
            </el-table-column>
            <el-table-column label="历年等级分布" min-width="260">
              <template #default="{ row }">
                <el-tag v-for="g in grades" v-show="row.gradeCounts[g] > 0" :key="g" :class="`grade-${g}`" size="small" style="margin-right: 4px">
                  {{ g }} × {{ row.gradeCounts[g] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="建议" min-width="240">
              <template #default="{ row }">
                <el-tag type="warning" size="small">启动 PIP 评估</el-tag>
                <el-tag type="danger" size="small" style="margin-left: 6px">1on1 关注</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="attentionList.length === 0" description="暂无需关注员工" />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 员工画像弹窗 -->
    <el-dialog v-model="profileVisible" :title="`${profileData?.employeeName || ''} · 绩效画像`" width="860px" top="5vh">
      <el-scrollbar v-if="profileData" max-height="72vh">
        <div class="profile-header">
          <div class="profile-info">
            <div class="profile-name">{{ profileData.employeeName }}</div>
            <div class="profile-sub">{{ profileData.departmentName }} · {{ profileData.positionName }}</div>
          </div>
          <div class="profile-tags">
            <el-tag v-if="profileData.stats.isHiPo" type="success" size="large">🌟 高潜员工</el-tag>
            <el-tag v-if="profileData.stats.needsAttention" type="danger" size="large">⚠ 需关注</el-tag>
          </div>
        </div>

        <div class="profile-kpi">
          <div class="p-kpi-item">
            <div class="p-kpi-label">历史周期数</div>
            <div class="p-kpi-value">{{ profileData.stats.totalCycles }}</div>
          </div>
          <div class="p-kpi-item">
            <div class="p-kpi-label">平均分</div>
            <div class="p-kpi-value" :style="{ color: progressColor(profileData.stats.avgScore) }">{{ profileData.stats.avgScore }}</div>
          </div>
          <div class="p-kpi-item">
            <div class="p-kpi-label">S/A 次数</div>
            <div class="p-kpi-value">{{ (profileData.stats.gradeCounts.S || 0) + (profileData.stats.gradeCounts.A || 0) }}</div>
          </div>
          <div class="p-kpi-item">
            <div class="p-kpi-label">C/D 次数</div>
            <div class="p-kpi-value">{{ (profileData.stats.gradeCounts.C || 0) + (profileData.stats.gradeCounts.D || 0) }}</div>
          </div>
        </div>

        <div class="profile-section">
          <div class="section-title">绩效趋势</div>
          <div class="trend-chart">
            <div v-for="(a, i) in profileData.archives" :key="i" class="trend-bar-wrap">
              <div class="trend-bar" :style="{ height: a.finalScore + '%', background: progressColor(a.finalScore) }">
                <span class="trend-score">{{ a.finalScore }}</span>
              </div>
              <div class="trend-cycle">{{ (a.cycleName || '').slice(0, 14) }}</div>
              <el-tag :class="`grade-${a.grade || a.rating}`" size="small">{{ a.grade || a.rating }}</el-tag>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <div class="section-title">能力雷达图（最新周期各维度得分）</div>
          <div v-if="latestDimensions.length > 0" class="radar-placeholder">
            <div v-for="d in latestDimensions" :key="d.dimension" class="radar-row">
              <span class="radar-label">{{ d.dimension }}</span>
              <el-progress :percentage="d.score" :stroke-width="10" :color="progressColor(d.score)" style="flex: 1" />
              <span class="radar-score">{{ d.score }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无最新维度数据" :image-size="80" />
        </div>

        <div class="profile-section">
          <div class="section-title">成长轨迹</div>
          <el-timeline>
            <el-timeline-item
              v-for="(a, i) in profileData.archives"
              :key="i"
              :timestamp="a.cycleEndDate || a.archiveTime"
              :type="eventType(a)"
            >
              <div class="timeline-card">
                <div class="timeline-title">{{ a.cycleName }}</div>
                <div class="timeline-body">
                  综合得分 <strong>{{ a.finalScore }}</strong> · 等级
                  <el-tag :class="`grade-${a.grade || a.rating}`" size="small">{{ a.grade || a.rating }}</el-tag>
                  · 部门排名 {{ a.ranking }}/{{ a.totalInDepartment }}
                </div>
                <div v-if="a.promotion && a.promotion !== '—'" class="timeline-event">🏆 {{ a.promotion }}</div>
                <div v-if="a.events && a.events.length" class="timeline-events">
                  <el-tag v-for="(e, idx) in a.events" :key="idx" size="small" effect="plain" style="margin-right: 4px">
                    {{ e.description }}
                  </el-tag>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button @click="profileVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportProfile">导出 PDF</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPerformanceArchiveList,
  getEmployeeArchiveView,
  getHiPoList,
  getAttentionList
} from '@/api/performanceArchive'
import type { PerformanceArchive, EmployeeArchiveView } from '@/types/performanceArchive'

defineOptions({ name: 'PerformanceArchive' })

const activeTab = ref<'list' | 'hipo' | 'attention'>('list')
const grades = ['S', 'A', 'B', 'C', 'D'] as const

const filters = reactive({
  employeeName: '',
  departmentName: '',
  grade: '' as string
})

const tableData = ref<PerformanceArchive[]>([])
const hipoList = ref<any[]>([])
const attentionList = ref<any[]>([])

const filteredData = computed(() =>
  tableData.value.filter(
    (r) =>
      (!filters.employeeName || r.employeeName.includes(filters.employeeName)) &&
      (!filters.departmentName || r.departmentName.includes(filters.departmentName)) &&
      (!filters.grade || r.grade === filters.grade || r.rating === filters.grade)
  )
)

const fetchData = async () => {
  const res = await getPerformanceArchiveList({ pageSize: 200 })
  tableData.value = res.data?.list || []
  const hr = await getHiPoList()
  hipoList.value = hr.data || []
  const ar = await getAttentionList()
  attentionList.value = ar.data || []
}

/* ========== 员工画像 ========== */
const profileVisible = ref(false)
const profileData = ref<EmployeeArchiveView | null>(null)

const latestDimensions = computed(() => {
  if (!profileData.value || profileData.value.archives.length === 0) return []
  const latest = profileData.value.archives[profileData.value.archives.length - 1]
  return latest.dimensionScores || []
})

const handleViewProfile = async (row: PerformanceArchive) => {
  const res = await getEmployeeArchiveView(row.employeeId)
  profileData.value = res.data
  profileVisible.value = true
}

const handleExport = (row: PerformanceArchive) => {
  ElMessage.success(`导出 ${row.employeeName} 的 ${row.cycleName} 档案为 PDF（演示）`)
}

const exportProfile = () => {
  if (!profileData.value) return
  ElMessage.success(`导出 ${profileData.value.employeeName} 的完整绩效画像 PDF（演示）`)
}

/* ========== 工具 ========== */
const progressColor = (s: number): string => {
  if (s >= 90) return '#67c23a'
  if (s >= 80) return '#409eff'
  if (s >= 70) return '#909399'
  if (s >= 60) return '#e6a23c'
  return '#f56c6c'
}

const eventType = (a: PerformanceArchive): any => {
  const g = a.grade || a.rating
  if (g === 'S') return 'success'
  if (g === 'A') return 'primary'
  if (g === 'C' || g === 'D') return 'danger'
  return 'info'
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.perf-archive-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.archive-tabs {
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

.sub-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
}

.trend-sparkline {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;

  .spark-bar {
    width: 20px;
    min-height: 4px;
    border-radius: 2px;
  }
}

.muted {
  color: #909399;
}

/* Profile */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafbfc;
  border-radius: 10px;
  margin-bottom: 16px;

  .profile-name {
    font-size: 20px;
    font-weight: 700;
    color: #303133;
  }

  .profile-sub {
    font-size: 13px;
    color: #909399;
    margin-top: 4px;
  }

  .profile-tags {
    display: flex;
    gap: 8px;
  }
}

.profile-kpi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  .p-kpi-item {
    padding: 14px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 8px;

    .p-kpi-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 6px;
    }

    .p-kpi-value {
      font-size: 24px;
      font-weight: 700;
      color: #303133;
    }
  }
}

.profile-section {
  margin-top: 20px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 16px;
  height: 200px;
  background: #fafbfc;
  border-radius: 8px;

  .trend-bar-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .trend-bar {
      width: 40px;
      min-height: 10px;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 4px;

      .trend-score {
        color: #fff;
        font-size: 11px;
        font-weight: 600;
      }
    }

    .trend-cycle {
      font-size: 11px;
      color: #909399;
      text-align: center;
    }
  }
}

.radar-placeholder {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .radar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;

    .radar-label {
      width: 100px;
      color: #606266;
    }

    .radar-score {
      width: 50px;
      text-align: right;
      color: #303133;
      font-weight: 500;
    }
  }
}

.timeline-card {
  .timeline-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .timeline-body {
    font-size: 13px;
    color: #606266;
    margin-top: 4px;
  }

  .timeline-event {
    margin-top: 4px;
    font-size: 13px;
    color: #e6a23c;
  }

  .timeline-events {
    margin-top: 6px;
  }
}

/* Grade colors */
.grade-S {
  background: #67c23a !important;
  color: #fff !important;
  border: none !important;
}
.grade-A {
  background: #409eff !important;
  color: #fff !important;
  border: none !important;
}
.grade-B {
  background: #909399 !important;
  color: #fff !important;
  border: none !important;
}
.grade-C {
  background: #e6a23c !important;
  color: #fff !important;
  border: none !important;
}
.grade-D {
  background: #f56c6c !important;
  color: #fff !important;
  border: none !important;
}
</style>
