<template>
  <div class="hc-container">
    <!-- 顶部统计 -->
    <div class="stat-row">
      <el-card class="stat-card">
        <div class="stat-label">集团总编制</div>
        <div class="stat-value primary">{{ totalBudget }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">实际在职</div>
        <div class="stat-value success">{{ totalActual }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">招聘中</div>
        <div class="stat-value warning">{{ totalPipeline }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">剩余 HC</div>
        <div class="stat-value" :class="totalGap < 0 ? 'danger' : 'primary'">{{ totalGap }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">超编部门</div>
        <div class="stat-value danger">{{ overOrgCount }}</div>
      </el-card>
    </div>

    <!-- 超编告警 -->
    <el-alert
      v-if="alerts.length"
      :title="`⚠️ 检测到 ${alerts.length} 个部门存在编制异常`"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    >
      <template #default>
        <div
          v-for="alert in alerts"
          :key="alert.orgId"
          class="alert-item"
        >
          <el-tag
            :type="alert.alertLevel === 'danger' ? 'danger' : 'warning'"
            size="small"
            effect="plain"
            style="margin-right: 8px"
          >
            {{ alert.alertLevel === 'danger' ? '超编' : '接近上限' }}
          </el-tag>
          <span>{{ alert.orgName }}</span>：
          <span style="color: #606266">{{ alert.message }}</span>
        </div>
      </template>
    </el-alert>

    <!-- 标签切换：总览 / 调整记录 -->
    <el-tabs v-model="activeTab" class="hc-tabs">
      <el-tab-pane label="编制总览" name="plans">
        <el-card class="data-card">
          <div class="table-header">
            <div class="header-title">各组织编制情况（2026 年度）</div>
            <el-button type="primary" @click="handleOpenAdjust()">
              <el-icon><Plus /></el-icon>
              发起编制调整
            </el-button>
          </div>
          <el-table :data="enrichedPlans" border style="width: 100%">
            <el-table-column prop="orgName" label="组织" min-width="200">
              <template #default="{ row }">
                <span :style="{ paddingLeft: `${(row._level - 1) * 16}px` }">
                  <el-tag
                    :type="(ORG_NODE_TYPE_COLOR as any)[row._nodeType]"
                    size="small"
                    effect="plain"
                    style="margin-right: 6px"
                  >
                    {{ (ORG_NODE_TYPE_LABEL as any)[row._nodeType] }}
                  </el-tag>
                  {{ row.orgName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="编制预算" width="130" align="center">
              <template #default="{ row }">
                <span style="font-weight: 500">{{ row.budgetCount }}</span>
                <el-tag v-if="!row._isLeaf" size="small" effect="plain" style="margin-left: 4px">
                  汇总
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="实际在职" width="100" align="center">
              <template #default="{ row }">{{ row.actualCount }}</template>
            </el-table-column>
            <el-table-column label="招聘中" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.pipelineCount" size="small" type="warning" effect="plain">
                  {{ row.pipelineCount }}
                </el-tag>
                <span v-else style="color: #c0c4cc">0</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余 HC" width="100" align="center">
              <template #default="{ row }">
                <span :style="{ color: row.gap < 0 ? 'var(--el-color-danger)' : row.gap === 0 ? 'var(--el-color-warning)' : 'var(--el-color-success)' }">
                  {{ row.gap }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="占用率" min-width="200">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.min(row._ratio, 110)"
                  :stroke-width="12"
                  :status="row._ratio > 100 ? 'exception' : row._ratio >= 90 ? 'warning' : 'success'"
                  :format="() => `${row._ratio}%`"
                />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="HEADCOUNT_STATUS_TYPE[row.status as HeadcountStatus]" size="small">
                  {{ HEADCOUNT_STATUS_LABEL[row.status as HeadcountStatus] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastAdjustTime" label="最近调整" width="160" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button
                  link
                  :type="row._isLeaf ? 'primary' : 'info'"
                  :disabled="!row._isLeaf"
                  :title="row._isLeaf ? '' : '父组织编制由叶子后代自动汇总，不可直接调整'"
                  @click="handleOpenAdjust(row)"
                >
                  调整编制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="调整记录" name="adjusts">
        <el-card class="data-card">
          <el-table :data="adjusts" border style="width: 100%">
            <el-table-column prop="adjustNo" label="调整单号" width="160" />
            <el-table-column prop="orgName" label="组织" min-width="180" show-overflow-tooltip />
            <el-table-column label="年度" width="80" align="center">
              <template #default="{ row }">{{ row.year }}</template>
            </el-table-column>
            <el-table-column label="变动" width="180" align="center">
              <template #default="{ row }">
                <span style="color: #909399">{{ row.beforeBudget }}</span>
                <span style="margin: 0 8px">→</span>
                <span>{{ row.afterBudget }}</span>
                <el-tag
                  :type="row.delta > 0 ? 'success' : 'warning'"
                  size="small"
                  effect="plain"
                  style="margin-left: 8px"
                >
                  {{ row.delta > 0 ? '+' : '' }}{{ row.delta }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" min-width="240" show-overflow-tooltip />
            <el-table-column prop="submitterName" label="发起人" width="120" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'"
                  size="small"
                >
                  {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已驳回' : '审批中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="approverName" label="审批人" width="120">
              <template #default="{ row }">{{ row.approverName || '—' }}</template>
            </el-table-column>
            <el-table-column prop="effectiveDate" label="生效日期" width="120">
              <template #default="{ row }">{{ row.effectiveDate || '—' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'pending'"
                  link
                  type="primary"
                  @click="handleApproveAdjust(row, 'approved')"
                >
                  通过
                </el-button>
                <el-button
                  v-if="row.status === 'pending'"
                  link
                  type="danger"
                  @click="handleApproveAdjust(row, 'rejected')"
                >
                  驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 编制调整 Dialog -->
    <el-dialog v-model="adjustDialogVisible" title="编制调整申请" width="560px">
      <el-form :model="adjustForm" label-width="120px">
        <el-form-item label="组织">
          <OrgTreeSelect v-model="adjustForm.orgId" @change="onOrgChange" />
        </el-form-item>
        <el-form-item label="当前预算">
          <el-input :model-value="adjustForm.beforeBudget" disabled />
        </el-form-item>
        <el-form-item label="调整后预算">
          <el-input v-model.number="adjustForm.afterBudget" placeholder="新预算人数" />
        </el-form-item>
        <el-form-item label="变动">
          <el-tag
            v-if="deltaValue !== 0"
            :type="deltaValue > 0 ? 'success' : 'warning'"
            size="default"
          >
            {{ deltaValue > 0 ? '+' : '' }}{{ deltaValue }}
          </el-tag>
          <span v-else style="color: #909399">未变动</span>
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input v-model="adjustForm.reason" type="textarea" :rows="3" placeholder="请说明调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAdjust">提交审批</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getHeadcountPlanList,
  getHeadcountAdjustList,
  addHeadcountAdjust,
  approveHeadcountAdjustApi
} from '@/api/org/headcount'
import {
  HEADCOUNT_STATUS_LABEL,
  HEADCOUNT_STATUS_TYPE,
  calcHeadcountStatus
} from '@/types/org/headcount'
import type {
  HeadcountPlan,
  HeadcountAdjust,
  HeadcountAlert,
  HeadcountStatus
} from '@/types/org/headcount'
import OrgTreeSelect from '@/components/core/hr/org-tree-select.vue'
import { useEmployeeStore } from '@/store/modules/employee'
import { useOrganizationStore } from '@/store/modules/organization'
import {
  ORG_NODE_TYPE_LABEL,
  ORG_NODE_TYPE_COLOR
} from '@/types/org/organization'
import { getMockDemandData } from '@/mock/recruitmentDemand'
import { isLeafOrg, getDescendantOrgIds } from '@/mock/org/headcount'

defineOptions({ name: 'HrmHeadcount' })

const empStore = useEmployeeStore()
const orgStore = useOrganizationStore()

const activeTab = ref('plans')
const plans = ref<HeadcountPlan[]>([])
const adjusts = ref<HeadcountAdjust[]>([])

const fetchAll = async () => {
  const [p, a] = await Promise.all([
    getHeadcountPlanList({ page: 1, pageSize: 100 }),
    getHeadcountAdjustList({ page: 1, pageSize: 100 })
  ])
  plans.value = (p as any).data.list
  adjusts.value = (a as any).data.list.sort((x: HeadcountAdjust, y: HeadcountAdjust) =>
    y.createTime.localeCompare(x.createTime)
  )
}

/** 获取招聘需求（一次）+ 按组织缓存 */
const activeDemands = computed(() => {
  try {
    return getMockDemandData().filter((d: any) => d.status === 1) // status=1 已批准 = 招聘中
  } catch {
    return []
  }
})

/** 为每个 plan 动态计算实际人数 / 招聘中 / 剩余 HC / 状态
 *  - actualCount = ∑ 本组织及所有后代的在职员工（regular + probation）
 *  - pipelineCount = ∑ 本组织及所有后代的招聘需求（status=1 已批准）
 *  - 非叶子节点标注 [汇总]
 */
const enrichedPlans = computed(() => {
  return plans.value.map((p) => {
    const org = orgStore.getById(p.orgId)
    const descendants = getDescendantOrgIds(p.orgId)
    const actualCount = empStore.getByOrg(p.orgId, true).filter(
      (e) => e.status === 'regular' || e.status === 'probation'
    ).length
    const pipelineCount = activeDemands.value.filter((d: any) =>
      descendants.includes(d.departmentId)
    ).length
    const gap = p.budgetCount - actualCount - pipelineCount
    const status = calcHeadcountStatus(actualCount, p.budgetCount)
    const ratio = p.budgetCount > 0 ? Math.round((actualCount / p.budgetCount) * 100) : 0
    return {
      ...p,
      actualCount,
      pipelineCount,
      gap,
      status,
      _ratio: ratio,
      _level: org?.level || 1,
      _nodeType: org?.nodeType || 'department',
      _isLeaf: isLeafOrg(p.orgId)
    }
  })
})

/** KPI 总计：只取根节点（集团）的值，避免父子重复累加 */
const rootPlan = computed(() => enrichedPlans.value.find((p) => !orgStore.getById(p.orgId)?.parentId))
const totalBudget = computed(() => rootPlan.value?.budgetCount || 0)
const totalActual = computed(() => rootPlan.value?.actualCount || 0)
const totalPipeline = computed(() => rootPlan.value?.pipelineCount || 0)
const totalGap = computed(() => totalBudget.value - totalActual.value - totalPipeline.value)
const overOrgCount = computed(() => enrichedPlans.value.filter((p) => p.status === 'over').length)

/** 告警列表 */
const alerts = computed<HeadcountAlert[]>(() => {
  return enrichedPlans.value
    .filter((p) => p.status !== 'normal')
    .map((p) => ({
      orgId: p.orgId,
      orgName: p.orgName,
      alertLevel: p.status === 'over' ? 'danger' : 'warning',
      message:
        p.status === 'over'
          ? `实际 ${p.actualCount} 人 > 预算 ${p.budgetCount} 人`
          : `实际 ${p.actualCount}/${p.budgetCount} 人，已达 ${p._ratio}% 占用率`
    }))
})

// === 调整 Dialog ===
const adjustDialogVisible = ref(false)
const adjustForm = reactive({
  orgId: undefined as number | undefined,
  orgName: '',
  year: 2026,
  beforeBudget: 0,
  afterBudget: 0,
  reason: ''
})

const deltaValue = computed(() => adjustForm.afterBudget - adjustForm.beforeBudget)

const onOrgChange = (id: number) => {
  const org = orgStore.getById(id)
  adjustForm.orgName = org?.orgName || ''
  const plan = plans.value.find((p) => p.orgId === id && p.year === 2026)
  adjustForm.beforeBudget = plan?.budgetCount || 0
  adjustForm.afterBudget = plan?.budgetCount || 0
}

const handleOpenAdjust = (plan?: any) => {
  if (plan) {
    adjustForm.orgId = plan.orgId
    adjustForm.orgName = plan.orgName
    adjustForm.beforeBudget = plan.budgetCount
    adjustForm.afterBudget = plan.budgetCount
  } else {
    adjustForm.orgId = undefined
    adjustForm.orgName = ''
    adjustForm.beforeBudget = 0
    adjustForm.afterBudget = 0
  }
  adjustForm.year = 2026
  adjustForm.reason = ''
  adjustDialogVisible.value = true
}

const handleSubmitAdjust = async () => {
  if (!adjustForm.orgId || !adjustForm.reason) {
    ElMessage.warning('请选择组织并填写原因')
    return
  }
  if (!isLeafOrg(adjustForm.orgId)) {
    ElMessage.warning('只能调整叶子组织（最底层部门/组）的编制。父组织编制由所有叶子后代自动汇总')
    return
  }
  if (deltaValue.value === 0) {
    ElMessage.warning('调整后预算未变动')
    return
  }
  const payload: Partial<HeadcountAdjust> = {
    adjustNo: `HCA${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`,
    orgId: adjustForm.orgId,
    orgName: adjustForm.orgName,
    year: adjustForm.year,
    beforeBudget: adjustForm.beforeBudget,
    afterBudget: adjustForm.afterBudget,
    delta: deltaValue.value,
    reason: adjustForm.reason,
    submitterName: '当前用户',
    submitterId: 9001,
    status: 'pending'
  }
  await addHeadcountAdjust(payload as any)
  ElMessage.success('调整申请已提交')
  adjustDialogVisible.value = false
  await fetchAll()
  activeTab.value = 'adjusts'
}

// === 审批 ===
const handleApproveAdjust = async (row: HeadcountAdjust, action: 'approved' | 'rejected') => {
  const prompt = action === 'approved' ? '审批意见（可选）' : '驳回原因'
  try {
    const { value } = await ElMessageBox.prompt(prompt, '审批', {
      inputType: 'textarea',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await approveHeadcountAdjustApi(row.id, action, 'HR-Lisa', 9001, value)
    ElMessage.success('审批完成')
    await fetchAll()
  } catch {
    // 取消
  }
}

onMounted(fetchAll)
</script>

<style scoped lang="scss">
.hc-container {
  height: 100%;
  overflow: auto;
  padding-right: 4px;

  .stat-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .stat-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 14px 20px;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
    }
    .stat-value {
      font-size: 26px;
      font-weight: 600;
      margin-top: 4px;
      color: #303133;
      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
      &.danger {
        color: var(--el-color-danger);
      }
    }
  }

  .alert-item {
    padding: 4px 0;
  }

  .hc-tabs {
    :deep(.el-tabs__content) {
      padding-top: 16px;
    }
  }

  .data-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    :deep(.el-card__body) {
      padding: 20px;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .header-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
