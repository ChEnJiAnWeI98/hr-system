<template>
  <div class="alignment-container">
    <ModuleTabBar :tabs="goalGroupTabs" />
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">全部 OKR</div>
        <div class="kpi-value">{{ stats.totalGoals || 0 }}</div>
        <div class="kpi-sub">
          公司 {{ stats.companyGoals || 0 }} / 部门 {{ stats.departmentGoals || 0 }} / 个人 {{ stats.personalGoals || 0 }}
        </div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">已对齐</div>
        <div class="kpi-value" style="color: #67c23a">{{ stats.alignedCount || 0 }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">孤岛目标</div>
        <div class="kpi-value" style="color: #f56c6c">{{ stats.orphanCount || 0 }}</div>
        <div class="kpi-sub">无父目标的非公司级 OKR</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">整体对齐率</div>
        <div class="kpi-value">{{ stats.alignmentRate || 0 }}%</div>
      </el-card>
    </div>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form :model="queryParams">
        <div class="filter-form-content">
          <el-form-item label="周期">
            <el-select v-model="queryParams.cycleId" placeholder="全部周期" style="width: 180px" clearable>
              <el-option label="2026 Q2 OKR 季度考核" :value="4" />
              <el-option label="2026 Q1 OKR 季度考核" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="queryParams.departmentName" placeholder="部门" style="width: 160px" clearable />
          </el-form-item>
          <el-form-item label="进度范围">
            <el-slider
              v-model="progressRange"
              range
              :min="0"
              :max="100"
              style="width: 220px"
              @change="onProgressRangeChange"
            />
          </el-form-item>
          <el-form-item label=" ">
            <div class="filter-buttons">
              <el-button type="primary" @click="loadData">刷新</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button @click="expandAll">全部展开</el-button>
              <el-button @click="collapseAll">全部收起</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <div class="main-row">
      <!-- OKR 树（左侧主区域）-->
      <el-card class="tree-card">
        <div class="section-header">
          <div class="section-title">OKR 对齐树（公司 → 部门 → 个人）</div>
          <div class="legend">
            <span class="legend-item"><span class="dot" style="background: #67c23a" /> ≥ 80%</span>
            <span class="legend-item"><span class="dot" style="background: #409eff" /> 50~79%</span>
            <span class="legend-item"><span class="dot" style="background: #e6a23c" /> 30~49%</span>
            <span class="legend-item"><span class="dot" style="background: #f56c6c" /> &lt; 30%</span>
          </div>
        </div>

        <el-scrollbar class="tree-scrollbar">
          <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="id"
            :props="{ children: 'children', label: 'goalTitle' }"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <div class="tree-node" :class="{ orphan: data.isOrphan }">
                <div class="node-main">
                  <el-tag size="small" class="node-category" effect="plain">
                    {{ data.category === 'company' ? '🏢 公司' : data.category === 'department' ? '👥 部门' : '👤 个人' }}
                  </el-tag>
                  <span class="node-title">{{ data.goalTitle }}</span>
                  <el-tag v-if="data.isOrphan" type="danger" size="small" effect="dark" style="margin-left: 8px">
                    ⚠ 孤岛
                  </el-tag>
                  <span class="node-owner">{{ data.owner }} · {{ data.department }}</span>
                </div>
                <div class="node-progress">
                  <el-progress
                    :percentage="data.progress"
                    :stroke-width="8"
                    :color="progressColor(data.progress)"
                    style="width: 160px"
                  />
                </div>
                <div class="node-actions">
                  <el-button
                    v-if="data.category !== 'company' && !hasParent(data.id)"
                    link
                    type="primary"
                    size="small"
                    @click="openAlignDialog(data)"
                  >建立对齐</el-button>
                  <el-button
                    v-if="hasParent(data.id)"
                    link
                    type="danger"
                    size="small"
                    @click="handleRemoveAlign(data)"
                  >取消对齐</el-button>
                </div>
              </div>
            </template>
          </el-tree>
          <el-empty v-if="treeData.length === 0" description="暂无已批准的 OKR" />
        </el-scrollbar>
      </el-card>

      <!-- 右侧：部门对齐率 -->
      <el-card class="dept-card">
        <div class="section-header">
          <div class="section-title">各部门对齐率</div>
        </div>
        <div class="dept-list">
          <div v-for="d in stats.byDepartment || []" :key="d.department" class="dept-item">
            <div class="dept-header">
              <span class="dept-name">{{ d.department }}</span>
              <span class="dept-count">{{ d.aligned }}/{{ d.total }}</span>
            </div>
            <el-progress
              :percentage="d.rate"
              :stroke-width="10"
              :color="d.rate >= 80 ? '#67c23a' : d.rate >= 50 ? '#409eff' : '#e6a23c'"
            />
          </div>
          <el-empty v-if="(stats.byDepartment || []).length === 0" description="暂无数据" :image-size="80" />
        </div>
      </el-card>
    </div>

    <!-- 建立对齐弹窗 -->
    <el-dialog v-model="alignDialogVisible" title="建立目标对齐关系" width="560px">
      <el-descriptions v-if="alignChildTarget" :column="1" border size="small">
        <el-descriptions-item label="子目标">{{ alignChildTarget.goalTitle }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ alignChildTarget.owner }}</el-descriptions-item>
      </el-descriptions>
      <el-form label-width="100px" style="margin-top: 16px">
        <el-form-item label="对齐到父目标" required>
          <el-select v-model="alignParentId" filterable placeholder="选择公司/部门级 OKR" style="width: 100%">
            <el-option
              v-for="p in parentCandidates"
              :key="p.id"
              :label="`[${p.category === 'company' ? '公司' : '部门'}] ${p.goalTitle} (${p.owner})`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="alignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAlign">建立对齐</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'

const goalGroupTabs = [
  { label: '目标管理', path: '/perf/goal' },
  { label: '目标对齐视图', path: '/perf/goal-alignment' }
]
import {
  getOKRTree,
  getAlignmentStats,
  createAlignment,
  removeAlignment
} from '@/api/performanceAlignment'
import type { AlignmentStats, OKRTreeNode } from '@/types/performanceAlignment'
import { progressColor } from '@/types/performanceAlignment'

defineOptions({ name: 'PerformanceGoalAlignment' })

const queryParams = reactive({
  cycleId: 4 as number | null,
  departmentName: '',
  progressMin: 0,
  progressMax: 100
})
const progressRange = ref<[number, number]>([0, 100])

const treeData = ref<OKRTreeNode[]>([])
const stats = ref<Partial<AlignmentStats>>({})
const treeRef = ref<any>(null)

const parentCandidates = computed(() => {
  const flat: OKRTreeNode[] = []
  const walk = (nodes: OKRTreeNode[]) => {
    for (const n of nodes) {
      if (n.category === 'company' || n.category === 'department') flat.push(n)
      if (n.children) walk(n.children)
    }
  }
  walk(treeData.value)
  return flat
})

const onProgressRangeChange = (v: number | number[]) => {
  const arr = Array.isArray(v) ? v : [v, v]
  queryParams.progressMin = arr[0]
  queryParams.progressMax = arr[1]
}

const loadData = async () => {
  const treeRes = await getOKRTree(queryParams)
  treeData.value = treeRes.data || []
  const statsRes = await getAlignmentStats(queryParams)
  stats.value = statsRes.data
}

const handleReset = () => {
  queryParams.cycleId = 4
  queryParams.departmentName = ''
  queryParams.progressMin = 0
  queryParams.progressMax = 100
  progressRange.value = [0, 100]
  loadData()
}

const expandAll = () => {
  // 遍历所有节点并展开（通过遍历 dom 或 ref 的 store）
  const walk = (nodes: OKRTreeNode[]) => {
    for (const n of nodes) {
      const node = treeRef.value?.getNode(n.id)
      if (node) node.expanded = true
      if (n.children) walk(n.children)
    }
  }
  walk(treeData.value)
}
const collapseAll = () => {
  const walk = (nodes: OKRTreeNode[]) => {
    for (const n of nodes) {
      const node = treeRef.value?.getNode(n.id)
      if (node) node.expanded = false
      if (n.children) walk(n.children)
    }
  }
  walk(treeData.value)
}

/** 判断节点是否有父目标（用于 UI 显示"建立对齐" vs "取消对齐"）*/
const hasParent = (id: number): boolean => {
  const walk = (nodes: OKRTreeNode[], parent?: OKRTreeNode): boolean => {
    for (const n of nodes) {
      if (n.id === id && parent) return true
      if (n.children && walk(n.children, n)) return true
    }
    return false
  }
  return walk(treeData.value)
}

/* ========== 建立 / 取消对齐 ========== */
const alignDialogVisible = ref(false)
const alignChildTarget = ref<OKRTreeNode | null>(null)
const alignParentId = ref<number | null>(null)

const openAlignDialog = (node: OKRTreeNode) => {
  alignChildTarget.value = node
  alignParentId.value = null
  alignDialogVisible.value = true
}

const submitAlign = async () => {
  if (!alignChildTarget.value || !alignParentId.value) {
    ElMessage.warning('请选择父目标')
    return
  }
  await createAlignment(alignChildTarget.value.id, alignParentId.value)
  ElMessage.success('已建立对齐关系')
  alignDialogVisible.value = false
  loadData()
}

const handleRemoveAlign = async (node: OKRTreeNode) => {
  try {
    await ElMessageBox.confirm(`确定取消「${node.goalTitle}」与父目标的对齐关系？`, '取消对齐', { type: 'warning' })
    await removeAlignment(node.id)
    ElMessage.success('已取消对齐')
    loadData()
  } catch {}
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.alignment-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

  .kpi-sub {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}

.filter-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
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
}

.main-row {
  flex: 1;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}

.tree-card,
.dept-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.section-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .legend {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #606266;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
    }
  }
}

.tree-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-tree-node__content) {
    height: auto;
    padding: 8px 0;
  }
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #f5f7fa;
  }

  &.orphan {
    background: #fef0f0;
  }

  .node-main {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    .node-title {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-owner {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }
  }

  .node-progress {
    flex-shrink: 0;
  }

  .node-actions {
    flex-shrink: 0;
  }
}

.dept-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 4px;

  .dept-item {
    .dept-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 13px;

      .dept-name {
        color: #303133;
        font-weight: 500;
      }

      .dept-count {
        color: #909399;
      }
    }
  }
}
</style>
