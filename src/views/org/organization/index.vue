<template>
  <div class="org-container">
    <el-card class="org-main-card">
      <el-tabs v-model="activeView" class="org-tabs">
        <el-tab-pane label="列表管理" name="list">
          <div class="org-layout">
        <!-- 左侧树 -->
        <div class="org-tree-panel">
          <div class="tree-header">
            <div class="tree-title">组织架构树</div>
            <el-button type="primary" size="small" @click="handleAdd()">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
          </div>
          <el-input
            v-model="keyword"
            placeholder="搜索组织"
            clearable
            size="default"
            style="margin-bottom: 12px"
          />
          <el-scrollbar class="tree-scroll">
            <el-tree
              ref="treeRef"
              :data="orgStore.getTree"
              node-key="id"
              :props="{ label: 'orgName', children: 'children' }"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :highlight-current="true"
              @node-click="handleSelect"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-tag
                    :type="ORG_NODE_TYPE_COLOR[data.nodeType as OrgNodeType]"
                    size="small"
                    effect="plain"
                    style="margin-right: 6px"
                  >
                    {{ ORG_NODE_TYPE_LABEL[data.nodeType as OrgNodeType] }}
                  </el-tag>
                  <span>{{ node.label }}</span>
                  <span v-if="data.status !== 'active'" class="node-status">
                    ({{ ORG_STATUS_LABEL[data.status as OrgStatus] }})
                  </span>
                </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>

        <!-- 右侧详情 -->
        <div class="org-detail-panel">
          <template v-if="current">
            <div class="detail-header">
              <div>
                <div class="detail-title">
                  {{ current.orgName }}
                  <el-tag
                    :type="ORG_NODE_TYPE_COLOR[current.nodeType]"
                    size="small"
                    style="margin-left: 8px"
                  >
                    {{ ORG_NODE_TYPE_LABEL[current.nodeType] }}
                  </el-tag>
                  <el-tag
                    :type="ORG_STATUS_TYPE[current.status]"
                    size="small"
                    style="margin-left: 4px"
                  >
                    {{ ORG_STATUS_LABEL[current.status] }}
                  </el-tag>
                </div>
                <div class="detail-code">{{ current.orgCode }}</div>
              </div>
              <div>
                <el-button @click="handleEdit">编辑</el-button>
                <el-button @click="handleAdd(current.id)">新增子级</el-button>
                <el-button @click="handleMove">迁移</el-button>
                <el-button type="danger" @click="handleDissolve">撤销</el-button>
              </div>
            </div>

            <el-descriptions :column="2" border>
              <el-descriptions-item label="组织路径">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-for="p in pathItems" :key="p.id">
                    {{ p.orgName }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-descriptions-item>
              <el-descriptions-item label="组织编码">
                <el-tag size="small" effect="plain">{{ current.orgCode }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="组织性质">
                {{ current.orgNature ? dictStore.getLabel('ORG_NATURE', current.orgNature) : '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="成本中心">
                {{ current.costCenter || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="组织负责人">
                {{ current.managerName || '（待指定）' }}
              </el-descriptions-item>
              <el-descriptions-item label="归属 HRBP">
                {{ current.hrbpName || '（待指定）' }}
              </el-descriptions-item>
              <el-descriptions-item label="编制数">
                {{ currentBudget }}
              </el-descriptions-item>
              <el-descriptions-item label="实际人数">
                <span>{{ currentActualCount }}</span>
                <el-progress
                  :percentage="percentUsed"
                  :stroke-width="6"
                  :status="percentUsed > 100 ? 'exception' : percentUsed >= 80 ? 'warning' : 'success'"
                  style="margin-top: 4px; width: 180px"
                />
              </el-descriptions-item>
              <el-descriptions-item label="成立日期">
                {{ current.startDate }}
              </el-descriptions-item>
              <el-descriptions-item label="撤销日期">
                {{ current.endDate || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">
                {{ current.description || '-' }}
              </el-descriptions-item>
            </el-descriptions>

            <!-- 演进历史 -->
            <div class="detail-sub-title">组织演进历史</div>
            <el-timeline v-if="orgEvents.length">
              <el-timeline-item
                v-for="ev in orgEvents"
                :key="ev.id"
                :timestamp="ev.eventDate"
              >
                <el-tag size="small" style="margin-right: 8px">
                  {{ ORG_EVENT_TYPE_LABEL[ev.eventType] }}
                </el-tag>
                {{ ev.description }}
                <div style="font-size: 12px; color: #909399; margin-top: 2px">
                  操作人：{{ ev.operator }}
                </div>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无演进事件" :image-size="80" />
          </template>

          <el-empty v-else description="请从左侧选择组织" />
        </div>
      </div>
        </el-tab-pane>

        <!-- Tab 2：架构图视图 -->
        <el-tab-pane label="架构图" name="chart">
          <div class="chart-toolbar">
            <el-button size="default" @click="handleChartExpand">展开全部</el-button>
            <el-button size="default" @click="handleChartCollapse">收起全部</el-button>
            <el-button size="default" type="primary" @click="handleExportChart">
              <el-icon><Download /></el-icon>
              导出 PNG
            </el-button>
            <span class="chart-tip">提示：滚轮缩放，拖拽平移</span>
          </div>
          <div ref="chartRef" class="org-chart-container"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 编辑 Dialog -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑组织' : '新增组织'" width="680px">
      <el-form :model="editForm" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组织名称">
              <el-input v-model="editForm.orgName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织编码">
              <el-input v-model="editForm.orgCode" placeholder="如 G01-BU01-D01-T01" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父组织">
              <el-tree-select
                v-model="editForm.parentId"
                :data="orgStore.getTree"
                :props="({ label: 'orgName', value: 'id', children: 'children' } as any)"
                clearable
                :disabled="!!editForm.id"
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点类型">
              <DictSelector v-model="editForm.nodeType" dict-code="ORG_TYPE" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织性质">
              <DictSelector v-model="editForm.orgNature" dict-code="ORG_NATURE" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本中心">
              <el-input v-model="editForm.costCenter" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制数">
              <el-input v-model.number="editForm.headcount" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立日期">
              <el-date-picker
                v-model="editForm.startDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="editForm.status" style="width: 100%">
                <el-option label="运行中" value="active" />
                <el-option label="停用" value="suspended" />
                <el-option label="筹建中" value="establishing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model.number="editForm.sortOrder" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="editForm.description" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 迁移 Dialog -->
    <el-dialog v-model="moveDialogVisible" title="组织迁移" width="560px">
      <el-form :model="moveForm" label-width="130px">
        <el-form-item label="当前组织">
          <el-input :model-value="current?.orgName" disabled />
        </el-form-item>
        <el-form-item label="新父组织">
          <el-tree-select
            v-model="moveForm.newParentId"
            :data="orgStore.getTree"
            :props="({ label: 'orgName', value: 'id', children: 'children' } as any)"
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="带子组织一起迁移">
          <el-switch v-model="moveForm.withChildren" />
        </el-form-item>
        <el-form-item label="迁移原因">
          <el-input v-model="moveForm.reason" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="moveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitMove">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
import { Plus, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useOrganizationStore } from '@/store/modules/organization'
import { useEmployeeStore } from '@/store/modules/employee'
import { useDictStore } from '@/store/modules/dict'
import DictSelector from '@/components/core/hr/dict-selector.vue'
import { calcBudgetByOrg } from '@/mock/org/headcount'
import {
  ORG_NODE_TYPE_LABEL,
  ORG_NODE_TYPE_COLOR,
  ORG_STATUS_LABEL,
  ORG_STATUS_TYPE,
  ORG_EVENT_TYPE_LABEL
} from '@/types/org/organization'
import type { Organization, OrgNodeType, OrgStatus } from '@/types/org/organization'

defineOptions({ name: 'HrmOrganization' })

const orgStore = useOrganizationStore()
const empStore = useEmployeeStore()
const dictStore = useDictStore()

const keyword = ref('')
const selectedId = ref<number>(1)
const treeRef = ref<any>()

const current = computed(() => orgStore.getById(selectedId.value))
const pathItems = computed(() => (current.value ? orgStore.getPath(current.value.id) : []))

/** 动态聚合：当前组织（含子组织）的实际在职数 */
const currentActualCount = computed(() => {
  if (!current.value) return 0
  return empStore
    .getByOrg(current.value.id, true)
    .filter((e) => e.status === 'regular' || e.status === 'probation').length
})

/** 动态计算：当前组织的编制（叶子取 org.headcount，非叶子 rollup） */
const currentBudget = computed(() => {
  if (!current.value) return 0
  return calcBudgetByOrg(current.value.id)
})

const percentUsed = computed(() => {
  if (!currentBudget.value) return 0
  return Math.round((currentActualCount.value / currentBudget.value) * 100)
})
const orgEvents = computed(() => (current.value ? orgStore.getEvents(current.value.id) : []))

watch(keyword, (v) => treeRef.value?.filter(v))
const filterNode = (value: string, data: any) => {
  const org = data as Organization
  return !value || org.orgName.includes(value) || org.orgCode.includes(value)
}

const handleSelect = (data: Organization) => {
  selectedId.value = data.id
}

// 新增 / 编辑
const editDialogVisible = ref(false)
const editForm = reactive<Partial<Organization>>({})

const openEdit = (data?: Partial<Organization>) => {
  Object.keys(editForm).forEach((k) => delete (editForm as any)[k])
  Object.assign(editForm, data || {})
  editDialogVisible.value = true
}

const handleAdd = (parentId?: number) => {
  openEdit({
    parentId: parentId ?? null,
    nodeType: 'department',
    status: 'active',
    headcount: 0,
    startDate: new Date().toISOString().slice(0, 10),
    sortOrder: 99
  })
}

const handleEdit = () => {
  if (current.value) openEdit({ ...current.value })
}

const handleSubmitEdit = () => {
  if (!editForm.orgName) {
    ElMessage.warning('请输入组织名称')
    return
  }
  if (editForm.id) {
    orgStore.updateOrg(editForm.id, editForm, true)
    ElMessage.success('更新成功')
  } else {
    const created = orgStore.addOrg(editForm)
    selectedId.value = created.id
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
  nextTick(() => treeRef.value?.setCurrentKey(selectedId.value))
}

// 迁移
const moveDialogVisible = ref(false)
const moveForm = reactive({
  newParentId: null as number | null,
  withChildren: true,
  reason: ''
})

const handleMove = () => {
  if (!current.value) return
  moveForm.newParentId = null
  moveForm.withChildren = true
  moveForm.reason = ''
  moveDialogVisible.value = true
}

const handleSubmitMove = () => {
  if (!current.value || !moveForm.newParentId) {
    ElMessage.warning('请选择新父组织')
    return
  }
  try {
    orgStore.moveOrg({
      orgId: current.value.id,
      newParentId: moveForm.newParentId,
      withChildren: moveForm.withChildren,
      reason: moveForm.reason
    })
    ElMessage.success('迁移成功')
    moveDialogVisible.value = false
  } catch (e: any) {
    ElMessage.error(e.message || '迁移失败')
  }
}

// 撤销
const handleDissolve = () => {
  if (!current.value) return
  ElMessageBox.prompt(`确定撤销"${current.value.orgName}"吗？（子组织需先处理）`, '撤销组织', {
    type: 'warning',
    confirmButtonText: '撤销',
    cancelButtonText: '取消',
    inputPlaceholder: '撤销原因（可选）'
  })
    .then(({ value }) => {
      try {
        orgStore.dissolveOrg(current.value!.id, value)
        ElMessage.success('已撤销')
      } catch (e: any) {
        ElMessage.error(e.message)
      }
    })
    .catch(() => {})
}

// ========== 视图切换（列表管理 / 架构图）==========
const activeView = ref<'list' | 'chart'>('list')
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

/** 把组织树转成 echarts tree 需要的 data 格式
 *  - actualCount 从员工池动态聚合（含子组织）
 *  - budgetCount 用 calcBudgetByOrg（叶子取 org.headcount，非叶子 rollup） */
const buildChartData = (nodes: any[]): any[] => {
  return nodes.map((n) => {
    const actual = empStore
      .getByOrg(n.id, true)
      .filter((e) => e.status === 'regular' || e.status === 'probation').length
    const budget = calcBudgetByOrg(n.id)
    return {
      name: n.orgName,
      value: `${actual}/${budget} 人`,
      itemStyle: {
        color:
          n.nodeType === 'group' ? '#409eff'
          : n.nodeType === 'division' || n.nodeType === 'company' ? '#67c23a'
          : n.nodeType === 'department' ? '#e6a23c'
          : n.nodeType === 'team' ? '#909399'
          : '#f56c6c'
      },
      children: n.children?.length ? buildChartData(n.children) : undefined
    }
  })
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>${p.value}` },
    series: [
      {
        type: 'tree',
        data: buildChartData(orgStore.getTree),
        top: '5%',
        left: '8%',
        bottom: '5%',
        right: '20%',
        symbolSize: 10,
        orient: 'LR',
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 13
        },
        leaves: {
          label: { position: 'right', align: 'left' }
        },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: true,
        initialTreeDepth: -1, // 默认全部展开
        animationDuration: 400,
        roam: true // 支持拖拽/缩放
      }
    ]
  }
  chartInstance.setOption(option)
}

/** 切换到架构图 Tab 时渲染 */
watch(activeView, (v) => {
  if (v === 'chart') {
    nextTick(() => renderChart())
  }
})

const handleChartExpand = () => {
  if (!chartInstance) return
  chartInstance.setOption({
    series: [{ type: 'tree', initialTreeDepth: -1, data: buildChartData(orgStore.getTree) }]
  } as any)
}

const handleChartCollapse = () => {
  if (!chartInstance) return
  chartInstance.setOption({
    series: [{ type: 'tree', initialTreeDepth: 1, data: buildChartData(orgStore.getTree) }]
  } as any)
}

const handleExportChart = () => {
  if (!chartInstance) return
  const dataURL = chartInstance.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' })
  const link = document.createElement('a')
  link.href = dataURL
  link.download = `组织架构图_${new Date().toISOString().slice(0, 10)}.png`
  link.click()
  ElMessage.success('已导出')
}

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped lang="scss">
.org-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .org-main-card {
    flex: 1;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
    }
  }

  .org-layout {
    display: flex;
    height: 100%;
  }

  .org-tree-panel {
    width: 320px;
    flex-shrink: 0;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
    padding: 16px 16px 0;

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .tree-title {
        font-size: 15px;
        font-weight: 600;
      }
    }

    .tree-scroll {
      flex: 1;
    }

    .tree-node {
      display: flex;
      align-items: center;

      .node-status {
        margin-left: 4px;
        color: #c0c4cc;
        font-size: 12px;
      }
    }
  }

  .org-detail-panel {
    flex: 1;
    padding: 20px;
    overflow: auto;

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      .detail-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }

      .detail-code {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }

      .el-button:not(:first-child) {
        margin-left: 8px;
      }
    }

    .detail-sub-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin: 24px 0 12px;
    }
  }
}

.org-tabs {
  :deep(.el-tabs__content) {
    padding-top: 8px;
  }
}

.chart-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .chart-tip {
    margin-left: auto;
    font-size: 12px;
    color: #909399;
  }
}

.org-chart-container {
  width: 100%;
  height: calc(100vh - 320px);
  min-height: 500px;
  background: #fafafa;
  border-radius: 8px;
}
</style>
